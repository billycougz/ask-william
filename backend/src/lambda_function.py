import json
import generate_presigned_urls
import generate_extract
import generate_response

print('Loading function')

def lambda_handler(event, context):
    try:
        print('Received event: {}'.format(json.dumps(event)))        

        event_source = 's3' if 'Records' in event else 'api'
        event_data = event['Records'] if event_source == 's3' else json.loads(event['body'])
        operation = 'generate-extract' if event_source == 's3' else event_data['operation']
        result = {}

        if operation == 'generate-presigned-url':
            filenames = event_data['filenames']
            result.url = generate_presigned_urls(filenames)
        elif operation == 'generate_extract':
            s3_event = event_data[0]['s3']
            object_key = s3_event['object']['key']
            generate_extract(object_key)
        elif operation == 'generate-response':
            question = event_data['question']
            extract_names = event_data['extract_names']
            result.response = generate_response(question, extract_names)
        else:
            raise ValueError("Invalid operation")

        response = {
            'statusCode': 200,
            'body': result
        }

    except ValueError as ve:
        response = {
            'statusCode': 400,
            'body': {
                'error': str(ve)
            }
        }

    except Exception as e:
        response = {
            'statusCode': 500,
            'body': {
                'error': str(e)
            }
        }

    return response
