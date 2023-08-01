import json
from generate_presigned_urls import generate_presigned_urls
from generate_extract import generate_extract
from generate_response import generate_response

print('Loading function')

# ToDo: Handle CORS headers better and review conflict with API Gateway
def create_response(statusCode, body={}):
    return {
        'statusCode': statusCode,
        'headers': {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*'
        },
        'body': json.dumps(body)
    }


def lambda_handler(event, context):
    print('Received event: ' + json.dumps(event))
    print('httpMethod: ' + event.get('httpMethod', 'NONE'))
    
    if event.get('httpMethod') == 'OPTIONS':
        return create_response(200)
    
    try:
        event_source = 's3' if 'Records' in event else 'api'
        event_data = event['Records'] if event_source == 's3' else json.loads(event['body'])
        operation = 'generate-extract' if event_source == 's3' else event_data['operation']
        
        print('event source: ' + event_source)
        print('operation: ' + operation)
        print('event data: ' + json.dumps(event_data))

        response_body = {}

        if operation == 'generate-presigned-urls':
            filenames = event_data['filenames']
            response_body['urls'] = generate_presigned_urls(filenames)
        elif operation == 'generate-extract':
            s3_event = event_data[0]['s3']
            object_key = s3_event['object']['key']
            generate_extract(object_key)
        elif operation == 'generate-response':
            question = event_data.get('question', None)
            extract_names = event_data['extract_names']
            response_body['response'] = generate_response(question, extract_names)
        else:
            raise ValueError("Invalid operation")

        return create_response(200, response_body)

    except ValueError as ve:
        print(f"ValueError: {ve}")
        return create_response(400, { 'error': str(ve) })

    except Exception as e:
        print(f"Exception: {e}")
        return create_response(500, { 'error': str(e) })
    

    