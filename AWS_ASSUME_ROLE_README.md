
1. Our Frontend generates a secure, randomized **External ID** for the user.
2. The User creates an IAM Role in their AWS Account that trusts CloudKraft's root AWS Identity Account (`arn:aws:iam::059801127401:user/cloudkraft`) and explicitly requires the generated External ID.
3. The User pastes their new `Role ARN` into CloudKraft.
4. Our Backend stores the `Role ARN` and `External ID` in the local `cloudkraft.db` SQLite database.
5. Whenever there is a need to deploy or read resources on the User's behalf, our Backend uses its root AWS credentials via `boto3` (or Terraform) to physically assume the User's Role ARN and successfully pass the External ID condition.

---


### Step A: Starting the Backend
To run the FastAPI backend locally, execute the following from the project root:

```bash
cd backend
source venv/bin/activate
export PYTHONPATH=.
uvicorn main:app --port 8000 --reload
```

### Step B: Setting up the `.env` File
To simulate the backend "assuming" a user's role, your local environment needs CloudKraft's root AWS keys.
Create a file exactly at `backend/test_tf/.env` and insert the root credentials:

```dotenv
AWS_ACCESS_KEY_ID="PUT THE ROOT CLOUDKRAFT ACCESS KEY HERE"
AWS_SECRET_ACCESS_KEY="PUT THE ROOT CLOUDKRAFT SECRET KEY HERE"
AWS_REGION="us-west-2"
```

---

## 3. Verifying the Connection Flow

### Connecting via the UI
1. Run the Frontend UI locally using `npm run dev` in the root folder.
2. Navigate to `http://localhost:5173/signup-aws`.
3. Choose the **Using Assume Role** tab and follow the detailed JSON Trust Policy instructions on the screen to configure an IAM Role in your personal test AWS Account.
4. Hit **Connect AWS Account**.

### Checking the Database
To verify that your submission successfully persisted to the backend SQLite database, you can run a manual SQL query from your terminal:

```bash
cd backend
sqlite3 cloudkraft.db "SELECT * FROM aws_credentials;"
```

You should see a row printed that looks something like this, with your `role_arn` and `external_id` clearly populated while the secret root keys remain blank:
`2|1|assume_role|||arn:aws:iam::123456789012:role/temporary-role|13bbd49b-e3d8-4811-9e9a-f50b533681a7|us-west-2`

---

## 4. Testing End-to-End Role Federation

### How `test_connection.py` Works:
1. It loads the CloudKraft root AWS keys you provided in `backend/test_tf/.env`.
2. It queries `cloudkraft.db` to automatically extract the very last `Role ARN` and `External ID` that was successfully saved in the database.
3. It passes these DB credentials dynamically as `TF_VAR_role_arn` and `TF_VAR_external_id` variables into a subprocess.
4. The subprocess executes `terraform init && terraform plan` natively on the isolated `backend/test_tf/main.tf` configuration module.
5. **Success:** If the Cross-Account Trust Policy & External ID match perfectly, Terraform will successfully federate and output an execution plan ready to deploy an EC2 Instance on the target account!

### Running the Test Script:

```bash
cd backend
source venv/bin/activate
python test_connection.py
```

If it succeeds, you'll see a green `SUCCESS!` message at the bottom with the Terraform metadata footprint. If it fails, Terraform will clearly output an `AccessDenied` error message detailing why the Trust Policy rejected the authentication request.
