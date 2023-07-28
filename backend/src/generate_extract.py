import os
import json
import boto3

def main(object_key):
    bucket_name = os.getenv('FILE_BUCKET_NAME')
    textract_client = boto3.client('textract')
    s3 = boto3.client('s3')

    response = textract_client.detect_document_text(
        Document={
            'S3Object': {
                'Bucket': bucket_name,
                'Name': object_key
            }
        }
    )

    # Extract text from the response
    extracted_text = ''
    for item in response['Blocks']:
        if item['BlockType'] == 'LINE':
            extracted_text += item['Text'] + '\n'

    json_filename = object_key.rsplit('.', 1)[0] + '.json'

    json_data = {
        'filename': object_key,
        'extracted_text': extracted_text
    }

    s3.put_object(
        Bucket=bucket_name,
        Key='file-extracts/' + json_filename,
        Body=json.dumps(json_data),
        ContentType='application/json'
    )

if __name__ == "__main__":
    main()
