import axios from 'axios';

// Use to stub responses
const __MOCK__ = true;

const lambdaEndpoint = 'https://ce5siinwh3.execute-api.us-east-1.amazonaws.com/default/eli5ify';

// Creates an async/await timeout
function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});
}

export async function askQuestion({ filenames, question }) {
	if (__MOCK__) {
		await delay(500);
		return { answer: 'Test' };
	}
	try {
		const payload = { filenames, question };
		const response = await axios.post(lambdaEndpoint, payload);
		return { answer: response.data.summary };
	} catch (e) {
		return { error: e.message };
	}
}

export async function uploadAndSummarizeFiles(files) {
	if (__MOCK__) {
		await delay(500);
		return { id: Date.now(), summary: 'HELLO WORLD' };
	}
	try {
		const filenames = files.map(({ name }) => name);
		const { presignedUrls, sourceFilenames } = await createPresignedUrls(filenames);

		// Upload files to S3
		await Promise.all(
			files.map(async (file, index) => {
				const presignedUrl = presignedUrls[index];
				await axios.put(presignedUrl, file);
			})
		);

		const summary = await askQuestion({ sourceFilenames });
		return { summary, sourceFilenames };
	} catch (error) {
		console.error(error);
	}
}

async function createPresignedUrls(filenames) {
	// ToDo: Check params and response structure
	// Also need access to UUID-based source filenames from presigned_url response
	const response = await axios.post(lambdaEndpoint, { filenames });
	return response?.data;
}
