import os
import json
from dotenv import load_dotenv
from src import ask_william

load_dotenv()

def main():
    event = retrieve_event()
    context = None
    print('Calling lambda_handler')
    response = ask_william.lambda_handler(event, context)
    print("lambda_handler response:")
    print(response)

def retrieve_event():
    dotenv_event = os.getenv('EVENT')

    if not dotenv_event:
        print('A mock_events filename was not provided, the default event will have a body that is an empty string')
        print('You can provide a mock_events filename by setting EVENT in .env, e.g., EVENT=hello_world.json')
        return { 'body': '' }

    json_file_path = './mock_events/' + dotenv_event

    with open(json_file_path, "r") as json_file:
        data = json.load(json_file)
        data['body'] = json.dumps(data['body'])
        print('Event data successfully retrieved')
        return data

if __name__ == "__main__":
    main()
