import os
import sqlite3
import subprocess
from dotenv import load_dotenv

def test_aws_connection():
    tf_dir = os.path.join(os.path.dirname(__file__), 'test_tf')
    env_path = os.path.join(tf_dir, '.env')
    load_dotenv(dotenv_path=env_path)
    
    root_access_key = os.getenv('AWS_ACCESS_KEY_ID')
    root_secret_key = os.getenv('AWS_SECRET_ACCESS_KEY')
    
    if not root_access_key or not root_secret_key:
        print("[ERROR] CloudKraft Root Credentials not found in backend/test_tf/.env")
        return

    print("[SUCCESS] Loaded CloudKraft Root Credentials")

    # 2. Get the latest user connection details from CloudKraft DB
    db_path = os.path.join(os.path.dirname(__file__), 'cloudkraft.db')
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT role_arn, external_id, region 
            FROM aws_credentials 
            WHERE auth_method = 'assume_role' 
            ORDER BY id DESC LIMIT 1
        """)
        
        row = cursor.fetchone()
        if not row:
            print("[ERROR] No 'Assume Role' credentials found in the database. Please sign up via the UI first.")
            return
            
        role_arn, external_id, region = row
        print(f"[SUCCESS] Found DB Connection Record:")
        print(f"   Role ARN: {role_arn}")
        print(f"   External ID: {external_id}")
        
    except sqlite3.Error as e:
        print(f"[ERROR] Database error: {e}")
        return
    finally:
        if 'conn' in locals():
            conn.close()

    # 3. Run Terraform Plan using subprocess
    print("\n[INFO] Running Terraform Plan to validate connection...")
    
    env = os.environ.copy()
    env["TF_VAR_role_arn"] = role_arn
    env["TF_VAR_external_id"] = external_id
    env["AWS_DEFAULT_REGION"] = region

    try:
        # Initialize terraform silently
        subprocess.run(["terraform", "init"], cwd=tf_dir, env=env, check=True, capture_output=True)
        
        # Run plan and stream output
        result = subprocess.run(["terraform", "plan"], cwd=tf_dir, env=env, capture_output=True, text=True)
        
        print("\n" + "="*50)
        print(result.stdout)
        
        if result.returncode == 0:
            print("[SUCCESS] Terraform successfully validated the assumed role connection!")
        else:
            print("[FAILED] Terraform could not validate the connection.")
            print(result.stderr)
            print("\nTroubleshooting tips:")
            print("1. Did you attach an IAM Policy to your CloudKraft Root User granting 'sts:AssumeRole'?")
            print("2. Does the Target IAM Role Trust Policy correctly list the CloudKraft Root User ARN as the Principal?")
            print(f"3. Does the Target IAM Role Trust Policy precisely match this External ID: {external_id}?")
            
    except FileNotFoundError:
        print("\n[ERROR] Terraform is not installed or not in your PATH.")
    except Exception as e:
        print(f"\n[ERROR] Error running Terraform: {e}")

if __name__ == "__main__":
    test_aws_connection()
