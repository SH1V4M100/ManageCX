from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Query, Header
from typing import Optional, List
import pandas as pd
from io import BytesIO
from datetime import datetime, date
from app.db import get_connection

router = APIRouter()

@router.post("/upload-roster")
async def upload_roster(file: UploadFile = File(...)):
    if not file.filename.endswith(".xlsx"):
        raise HTTPException(status_code=400, detail="Invalid file format")

    content = await file.read()
    xl = pd.read_excel(BytesIO(content), header=None)

    # Get the days and dates from row 1 and 2
    day_row = xl.iloc[0]
    date_row = xl.iloc[1]
    header_row = xl.iloc[2]

    # Parse date columns: d onwards (index 3)
    date_cols = {}
    for i in range(3, len(header_row), 2):  # Step by 2 (Login, Logout)
        try:
            date_val = pd.to_datetime(date_row[i], dayfirst=True).date()
            date_cols[i] = date_val
        except Exception as e:
            continue

    # Data starts from row 4
    data = xl.iloc[3:]

    conn = get_connection()
    cur = conn.cursor()

    uploaded_emp_ids = []

    for _, row in data.iterrows():
        emp_id = int(row[0])
        uploaded_emp_ids.append(emp_id)

        for i in date_cols:
            date = date_cols[i]
            login_raw = str(row[i]).strip()
            logout_raw = row[i+1]

            # Default
            login_time = logout_time = None
            status = "Present"

            if login_raw.upper() in ["WO", "W/O", "LEAVE"]:
                status = login_raw.upper()  # "WO" or "LEAVE"
            else:
                try:
                    login_time = pd.to_datetime(login_raw).time()
                    logout_time = pd.to_datetime(str(logout_raw)).time() if pd.notna(logout_raw) else None
                except:
                    continue  # Skip badly formatted times

            cur.execute("""
                INSERT INTO employee_rosters (emp_id, date, login_time, logout_time, status)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (emp_id, date) DO UPDATE
                SET login_time = EXCLUDED.login_time,
                    logout_time = EXCLUDED.logout_time,
                    status = EXCLUDED.status
            """, (emp_id, date, login_time, logout_time, status))


    conn.commit()
    cur.close()
    conn.close()

    return {"status": "roster uploaded successfully"}

# TEMP: Placeholder for logged-in user id
def get_current_employee_id():
    return 1  # Replace this with Clerk/Auth logic later

@router.get("/me")
def get_own_roster(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    emp_id: Optional[int] = Header(None)
):
    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT date, login_time, logout_time, status
    FROM employee_rosters
    WHERE emp_id = %s
"""
    params = [emp_id]

    if start_date:
        query += " AND date >= %s"
        params.append(start_date)

    if end_date:
        query += " AND date <= %s"
        params.append(end_date)

    cur.execute(query, params)
    rows = cur.fetchall()

    result = []
    for row in rows:
        result.append({
            "date": row[0],
            "login_time": str(row[1]) if row[1] else None,
            "logout_time": str(row[2]) if row[2] else None,
            "status": row[3]
        })

    cur.close()
    conn.close()
    return result
#test as /api/rosters/me?start_date=2024-01-01&end_date=2024-01-31

@router.get("/subtree")
def get_subtree_rosters(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    emp_id: Optional[int] = Header(None)
):
    if emp_id is None:
        raise HTTPException(status_code=401, detail="Missing emp_id in request")
    conn = get_connection()
    cur = conn.cursor()

    # Dynamically build WHERE clause for date filtering
    date_filter = ""
    params = [emp_id, emp_id]  # For WHERE supervisor_id = %s OR manager_02_id = %s

    if start_date:
        date_filter += " AND r.date >= %s"
        params.append(start_date)
    if end_date:
        date_filter += " AND r.date <= %s"
        params.append(end_date)

    query = f"""
    WITH RECURSIVE subordinates AS (
    SELECT employee_number, full_name, email_work
    FROM employees
    WHERE supervisor_id = %s OR manager_id = %s

    UNION

    SELECT DISTINCT e.employee_number, e.full_name, e.email_work
    FROM employees e
    INNER JOIN subordinates s
        ON e.supervisor_id = s.employee_number OR e.manager_id = s.employee_number
)

    SELECT 
        s.employee_number, s.full_name, s.email_work,
        r.date, r.login_time, r.logout_time, r.status
    FROM subordinates s
    LEFT JOIN employee_rosters r 
        ON s.employee_number = r.emp_id
        {date_filter}
    ORDER BY s.employee_number, r.date
    """

    cur.execute(query, params)
    rows = cur.fetchall()

    # Structure data by employee
    roster_map = {}
    for row in rows:
        emp_number = row[0]
        if emp_number not in roster_map:
            roster_map[emp_number] = {
                "employee_number": emp_number,
                "full_name": row[1],
                "email": row[2],
                "roster": []
            }

        if row[3] is not None:
            roster_map[emp_number]["roster"].append({
                "date": row[3],
                "login_time": str(row[4]) if row[4] else None,
                "logout_time": str(row[5]) if row[5] else None,
                "status": row[6]
            })

    cur.close()
    conn.close()
    print(roster_map.values())
    return list(roster_map.values())

# GET /api/rosters/subtree
# GET /api/rosters/subtree?start_date=2024-05-01
# GET /api/rosters/subtree?start_date=2024-05-01&end_date=2024-05-31

@router.get("/immediate-subordinates")
def get_immediate_subordinates(emp_id: Optional[int] = Header(None)):
    
    conn = get_connection()
    cur = conn.cursor()

    if emp_id is None:
        raise HTTPException(status_code=401, detail="Missing emp_id in request")

    query = """
        SELECT employee_number, full_name,
            CASE
                WHEN supervisor_id = %s THEN 'Supervisor'
                WHEN manager_id = %s THEN 'Manager'
            END AS relationship
        FROM employees
        WHERE supervisor_id = %s OR manager_id = %s
    """
    cur.execute(query, (emp_id, emp_id, emp_id, emp_id))
    rows = cur.fetchall()

    result = []
    for row in rows:
        result.append({
            "employee_number": row[0],
            "full_name": row[1],
            "relationship": row[2]
        })

    cur.close()
    conn.close()
    return result