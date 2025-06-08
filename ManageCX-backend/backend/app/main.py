from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import employees, rosters

app = FastAPI(title="Roster Management API")

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(employees.router, prefix="/api/employees", tags=["Employees"])
app.include_router(rosters.router, prefix="/api/rosters", tags=["Rosters"])
