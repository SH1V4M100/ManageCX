from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
from io import BytesIO
from pydantic import BaseModel
from app.db import get_connection

router = APIRouter()

@router.post("/upload")
async def upload_employees(file: UploadFile = File(...)):
    if not file.filename.endswith(".xlsx"):
        raise HTTPException(status_code=400, detail="Invalid file format")

    content = file.file.read()
    df = pd.read_excel(BytesIO(content))

    from fastapi import HTTPException

    required_cols = {
        "EMPLOYEE_NUMBER", "FULL_NAME", "Gender", "Email - Work", "Process",
        "SUPERVISOR_ID", "SUPERVISOR_FULL_NAME", "SUPERVISOR_EMAIL",
        "MANAGER_02_ID", "MANAGER_02_FULL_NAME", "MANAGER_02_EMAIL", "CITY"
    }

    missing_cols = required_cols - set(df.columns)
    if missing_cols:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required columns: {', '.join(missing_cols)}"
        )


    conn = get_connection()
    cur = conn.cursor()

    uploaded_ids = []

    for _, row in df.iterrows():
        emp_id = int(row["EMPLOYEE_NUMBER"])
        uploaded_ids.append(emp_id)

        cur.execute("""
            INSERT INTO employees (
                employee_number, full_name, gender, email_work, process,
                supervisor_id, supervisor_full_name, supervisor_email,
                manager_id, manager_full_name, manager_email, city
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (employee_number) DO UPDATE
            SET full_name = EXCLUDED.full_name,
                gender = EXCLUDED.gender,
                email_work = EXCLUDED.email_work,
                process = EXCLUDED.process,
                supervisor_id = EXCLUDED.supervisor_id,
                supervisor_full_name = EXCLUDED.supervisor_full_name,
                supervisor_email = EXCLUDED.supervisor_email,
                manager_id = EXCLUDED.manager_id,
                manager_full_name = EXCLUDED.manager_full_name,
                manager_email = EXCLUDED.manager_email,
                city = EXCLUDED.city
        """, (
            emp_id,
            row["FULL_NAME"],
            row["Gender"],
            row["Email - Work"],
            row["Process"],
            int(row["SUPERVISOR_ID"]) if pd.notna(row["SUPERVISOR_ID"]) else None,
            row["SUPERVISOR_FULL_NAME"],
            row["SUPERVISOR_EMAIL"],
            int(row["MANAGER_02_ID"]) if pd.notna(row["MANAGER_02_ID"]) else None,
            row["MANAGER_02_FULL_NAME"],
            row["MANAGER_02_EMAIL"],
            row["CITY"]
        ))

    # Delete employees not in the uploaded list
    cur.execute(
        "DELETE FROM employees WHERE employee_number NOT IN %s",
        (tuple(uploaded_ids),)
    )

    conn.commit()
    cur.close()
    conn.close()

    return {"status": "success"}

# Pydantic model for login request
class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login_user(data: LoginRequest):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
        SELECT id, name, email, role
        FROM employee_credentials
        WHERE username = %s AND password = %s
        """
        cursor.execute(query, (data.username, data.password))
        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if user:
            return {
                "id": user[0],
                "name": user[1],
                "email": user[2],
                "role": user[3]
            }
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
