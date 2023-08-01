import os
import json
import requests
import concurrent.futures
import boto3
import time

def generate_response(question, extract_names):
    s3_client = boto3.client('s3')
    bucket_name = os.getenv('FILE_BUCKET_NAME')
    api_key = os.environ['OPENAI_API_KEY']
    api_url = 'https://api.openai.com/v1/chat/completions'

    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
    }

    # ToDo: Update this content
    contextMessage = {
        "role": "system",
        "content": "The context of this conversation is that a user has extracted text from a document with the intent of having you summarize or answer questions about the document."
    }

    prompt = "Answer this question using the text that follows: [Question] " + question if question else "Summarize the following text: "

    # Fetch all JSON files from S3 in parallel
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future_to_data = {
            executor.submit(fetch_json_from_s3_with_retry, s3_client, bucket_name, extract_name): extract_name
            for extract_name in extract_names
        }

        messages = []
        for future in concurrent.futures.as_completed(future_to_data):
            extract_name = future_to_data[future]
            try:
                json_data = future.result()
                json_dict = json.loads(json_data)
                content = json_dict['extracted_text']
                messages.append({"role": "user", "content": content})
            except Exception as e:
                print(f"Error fetching JSON for {extract_name}: {e}")

    # Concatenate the content from all JSON files
    text_to_summarize = " ".join(message['content'] for message in messages)

    message = prompt + " [Text] " + text_to_summarize

    payload = {
        'model': "gpt-3.5-turbo",
        "messages": [contextMessage, {"role": "user", "content": message}],
        'max_tokens': 500
    }

    response = requests.post(api_url, headers=headers, json=payload)

    if response.status_code == 200:
        summary = response.json()['choices'][0]['message']['content']
        usageLog = response.json()['usage']
        usageLog['finish_reason'] = response.json()['choices'][0]['finish_reason']
        print("Token Usage: " + json.dumps(usageLog))
        return summary
    else:
        return f'Error: {response.status_code} - {response.text}'

def fetch_json_from_s3(s3_client, bucket_name, extract_name):
    file_name_without_extension = os.path.splitext(extract_name)[0]
    object_key = 'file-extracts/' + file_name_without_extension + '.json'
    response = s3_client.get_object(Bucket=bucket_name, Key=object_key)
    json_data = response['Body'].read()
    return json_data.decode('utf-8')

def fetch_json_from_s3_with_retry(s3_client, bucket_name, extract_name):
    max_retries = 10
    retries = 0

    while retries <= max_retries:
        try:
            json_data = fetch_json_from_s3(s3_client, bucket_name, extract_name)
            return json_data
        except Exception as e:
            print(f"Error fetching JSON for {extract_name}: {e}")
            retries += 1
            if retries <= max_retries:
                print(f"Retrying ({retries}/{max_retries}) after 1 second...")
                time.sleep(1)
            else:
                print(f"Max retries exceeded for {extract_name}.")
                raise  # Re-raise the exception after exhausting retries

    return None  # Return None if max retries are exceeded (optional)