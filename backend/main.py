# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import vulnerability_router
from routers.vulnerability_router import router_assets # Questo import rimane uguale

app = FastAPI(
    title="Vulnerability & Asset Report API",
    description="API for fetching simulated infrastructure vulnerability and asset data.",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "null"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vulnerability_router.router)
app.include_router(router_assets)

@app.get("/", summary="Root endpoint")
async def read_root():
    """
    Root endpoint for the API.
    """
    return {"message": "Welcome to the Vulnerability and Asset Report API"}