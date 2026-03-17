from pydantic import BaseModel, EmailStr

from typing import Optional

class AwsConnectRequest(BaseModel):
    authMethod: str = "access_key" # 'access_key' or 'assume_role'
    accessKey: Optional[str] = None
    secretKey: Optional[str] = None
    roleArn: Optional[str] = None
    externalId: Optional[str] = None
    region: str
    email: EmailStr
    fullName: str

class AwsConnectResponse(BaseModel):
    success: bool
    message: str
    region: str
