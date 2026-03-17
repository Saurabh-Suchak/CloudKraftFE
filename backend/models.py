from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)

    aws_credentials = relationship("AwsCredential", back_populates="user")

class AwsCredential(Base):
    __tablename__ = "aws_credentials"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    auth_method = Column(String, default="access_key") # 'access_key' or 'assume_role'
    access_key_id = Column(String, nullable=True)
    encrypted_secret = Column(String, nullable=True)
    role_arn = Column(String, nullable=True)
    external_id = Column(String, nullable=True)
    region = Column(String)

    user = relationship("User", back_populates="aws_credentials")
