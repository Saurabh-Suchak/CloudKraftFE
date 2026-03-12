terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

variable "role_arn" {
  type        = string
  description = "The target IAM Role ARN to assume"
}

variable "external_id" {
  type        = string
  description = "The External ID associated with the Trust Policy"
}

provider "aws" {
  region = "us-west-2"

  assume_role {
    # Using the credentials passed dynamically from the python script
    role_arn    = var.role_arn
    external_id = var.external_id
  }
}

# Find the latest Amazon Linux 2 AMI
data "aws_ami" "amazon_linux_2" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# Create a tiny EC2 instance to prove the connection works
resource "aws_instance" "test_connection" {
  ami           = data.aws_ami.amazon_linux_2.id
  instance_type = "t2.micro"

  tags = {
    Name = "CloudKraft-Connection-Test"
  }
}
