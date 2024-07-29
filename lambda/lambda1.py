import json
import os
import boto3
from botocore.exceptions import ClientError
import logging

def lambda_handler(event, context):
    s3_client = boto3.client('s3')
    
    request = json.loads(event['body']);
    filename = request['filename']
    key = os.environ['PREFIX']+filename
    
    params = {
        'Bucket': os.environ['S3_BUCKET'],
        'Key': key
    }
    
    try:
        s3_url = s3_client.generate_presigned_url('put_object', Params=params, ExpiresIn=300)
    except ClientError as e:
        logging.error(e)
        return None
    
    return {
        'statusCode': 200,
        'body' : json.dumps({
            'url': s3_url
        })
    }