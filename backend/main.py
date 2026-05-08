from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import boto3
from botocore.exceptions import ClientError

import models
import schemas
from database import engine, get_db
import security

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CloudKraft API")

# Configure CORS for the frontend
import os as _os

_CORS_ORIGINS = _os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:5174,http://localhost:3000",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _CORS_ORIGINS],  # F-007: never wildcard
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/aws/connect", response_model=schemas.AwsConnectResponse)
def connect_aws(request: schemas.AwsConnectRequest, db: Session = Depends(get_db)):
    # 1. Validate credentials with AWS STS
    if request.authMethod == "access_key":
        if not request.accessKey or not request.secretKey:
            raise HTTPException(status_code=400, detail="Missing Access Key or Secret Key.")
            
        sts_client = boto3.client(
            'sts',
            aws_access_key_id=request.accessKey,
            aws_secret_access_key=request.secretKey,
            region_name=request.region
        )

        try:
            identity = sts_client.get_caller_identity()
            print(f"Verified AWS Identity: {identity['Arn']}")
        except ClientError as e:
            raise HTTPException(status_code=400, detail="Invalid AWS credentials provided.")
            
        # 2. Encrypt the secret key
        encrypted_secret = security.encrypt_secret(request.secretKey)
        role_arn = None
        external_id = None
        
    elif request.authMethod == "assume_role":
        if not request.roleArn or not request.externalId:
            raise HTTPException(status_code=400, detail="Missing Role ARN or External ID.")
            
        # In a real app we'd assume the role using our own backend AWS credentials. 
        # For simplicity/demo we'll just store it since we can't test assume role without backend credentials anyway.
        encrypted_secret = None
        request.accessKey = None
        role_arn = request.roleArn
        external_id = request.externalId
        
    else:
        raise HTTPException(status_code=400, detail="Invalid authMethod.")

    # 3. Handle User
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user:
        user = models.User(email=request.email, name=request.fullName)
        db.add(user)
        db.commit()
        db.refresh(user)

    # 4. Save/Update AWS Credentials
    aws_cred = db.query(models.AwsCredential).filter(models.AwsCredential.user_id == user.id).first()
    if not aws_cred:
        aws_cred = models.AwsCredential(
            user_id=user.id,
            auth_method=request.authMethod,
            access_key_id=request.accessKey,
            encrypted_secret=encrypted_secret,
            role_arn=role_arn,
            external_id=external_id,
            region=request.region
        )
        db.add(aws_cred)
    else:
        aws_cred.auth_method = request.authMethod
        aws_cred.access_key_id = request.accessKey
        aws_cred.encrypted_secret = encrypted_secret
        aws_cred.role_arn = role_arn
        aws_cred.external_id = external_id
        aws_cred.region = request.region

    db.commit()

    return schemas.AwsConnectResponse(
        success=True, 
        message="AWS account successfully linked and securely stored.",
        region=request.region
    )
