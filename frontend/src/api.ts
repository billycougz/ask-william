import axios from 'axios';
import { FileUploadMap } from './models';

const __MOCK__ = false;

const API_ENDPOINT = 'https://ce5siinwh3.execute-api.us-east-1.amazonaws.com/default/eli5ify';

function mockRequest<T>(ms: number, response: T): Promise<T> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(response);
		}, ms);
	});
}

type AskQuestionResponse = { answer: string };
export async function askQuestion(s3Filenames: string[], question?: string): Promise<AskQuestionResponse> {
	if (__MOCK__) {
		return mockRequest(500, { answer: 'Test' });
	}
	const payload = {
		operation: 'generate-response',
		extract_names: s3Filenames,
		question
	};
	const response = await axios.post(API_ENDPOINT, payload);
	if (response?.data?.response) {
		return { answer: response.data.response };
	}
	throw new Error('There was an error with the askQuestion() request.');
}

type InitializeConversationResponse = { summary: string, s3Filenames: string[] };
export async function initializeConversation(files: File[]): Promise<InitializeConversationResponse> {
	if (__MOCK__) {
		return mockRequest<InitializeConversationResponse>(500, { summary: 'HELLO WORLD', s3Filenames: ['uuid.jpg'] });
	}

	async function generatePresignedUrls(files: File[]): Promise<FileUploadMap> {
		const filenames = files.map(({ name }) => name);
		const response = await axios.post(API_ENDPOINT, {
			operation: 'generate-presigned-urls',
			filenames
		});
		if (response?.data) {
			return response.data;
		}
		throw new Error('There was an error inside generatePresignedUrls()');
	}

	async function uploadFiles(files: File[], fileUploadMap: FileUploadMap): Promise<void> {
		const promises = files.map((file) => {
			const { uploadUrl } = fileUploadMap[file.name];
			return axios.put(uploadUrl, file, { headers: { 'Content-Type': file.type } })
		});
		await Promise.all(promises);
	}

	// Orchestrate file upload and initial document summary
	const fileUploadMap = await generatePresignedUrls(files);
	await uploadFiles(files, fileUploadMap);
	const s3Filenames = Object.values(fileUploadMap).map(({ s3Filename }) => s3Filename)
	const { answer } = await askQuestion(s3Filenames);
	return {
		summary: answer,
		s3Filenames
	};
}
