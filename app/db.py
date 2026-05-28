import boto3
from app.config import Config

def get_dynamodb_resource():
    return boto3.resource('dynamodb', region_name=Config.AWS_REGION)

def get_table():
    dynamodb = get_dynamodb_resource()
    return dynamodb.Table(Config.DYNAMODB_TABLE)
