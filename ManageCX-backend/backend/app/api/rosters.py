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

    # Rows 1, 2, 3 contain days, dates, and column names
    day_row = xl.iloc[0]
    date_row = xl.iloc[1]
    header_row = xl.iloc[2]

    # Date columns: from column D (index 3) onwards, step by 2 (Login, Logout)
    date_cols = {}
    for i in range(3, len(header_row), 2):
        try:
            date_val = pd.to_datetime(date_row[i], dayfirst=True).date()
            date_cols[i] = date_val
        except Exception:
            continue

    # Data rows: from row 4 onward
    data = xl.iloc[3:]

    conn = get_connection()
    cur = conn.cursor()

    uploaded_emp_ids = []

    for _, row in data.iterrows():
        try:
            emp_id = int(row[0])
        except:
            continue  # Skip rows with invalid emp_id

        uploaded_emp_ids.append(emp_id)

        transport_status = str(row[1]).strip() if pd.notna(row[1]) else None
        work_status = str(row[2]).strip() if pd.notna(row[2]) else None
        # print(transport_status, work_status)
        # print(row)
        for i in date_cols:
            date = date_cols[i]
            login_raw = str(row[i]).strip() if pd.notna(row[i]) else ""
            logout_raw = str(row[i + 1]).strip() if pd.notna(row[i + 1]) else ""

            login_time = logout_time = None
            status = "Scheduled"

            if login_raw.upper() in ["WO", "W/O", "LEAVE"]:
                status = login_raw.upper()
            else:
                try:
                    login_time = pd.to_datetime(login_raw).time()
                    logout_time = pd.to_datetime(logout_raw).time() if logout_raw else None
                except:
                    continue  # Skip invalid times

            cur.execute("""
                INSERT INTO employee_rosters (
                    emp_id, date, login_time, logout_time, status,
                    transport_status, work_status
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (emp_id, date) DO UPDATE SET
                    login_time = EXCLUDED.login_time,
                    logout_time = EXCLUDED.logout_time,
                    status = EXCLUDED.status,
                    transport_status = EXCLUDED.transport_status,
                    work_status = EXCLUDED.work_status
            """, (
                emp_id, date, login_time, logout_time, status,
                transport_status, work_status
            ))

    conn.commit()
    cur.close()
    conn.close()

    return {"status": "Roster uploaded successfully"}

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
    SELECT date, login_time, logout_time, status, transport_status, work_status
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
            "status": row[3],
            "transport_status": row[4],
            "work_status": row[5],
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
    params = [emp_id, emp_id]  # supervisor_id = ? OR manager_02_id = ?

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
        r.date, r.login_time, r.logout_time, r.status,
        r.transport_status, r.work_status
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
                "status": row[6],
                "transport_status": row[7],
                "work_status": row[8]
            })

    cur.close()
    conn.close()

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