# models/asset_model.py

from pydantic import BaseModel

class Asset(BaseModel):
    server_id: str
    office_id: str
    os_type: str
    is_eol_os: bool