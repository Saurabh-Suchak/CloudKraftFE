import os
from cryptography.fernet import Fernet

# In a real app, this should be an environment variable.
# For demo, generate one if it doesn't exist, or use a hardcoded one.
SECRET_KEY = os.getenv("APP_SECRET_KEY")
if not SECRET_KEY:
    # 32-url-safe base64 string
    SECRET_KEY = Fernet.generate_key().decode()
    os.environ["APP_SECRET_KEY"] = SECRET_KEY

cipher = Fernet(SECRET_KEY.encode())

def encrypt_secret(secret: str) -> str:
    """Encrypts a string and returns a base64 encoded string."""
    return cipher.encrypt(secret.encode()).decode()

def decrypt_secret(encrypted_secret: str) -> str:
    """Decrypts a base64 encoded string back to plaintext."""
    return cipher.decrypt(encrypted_secret.encode()).decode()
