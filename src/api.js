import axios from 'axios';

// Use to stub responses
const __MOCK__ = false;

const lambdaEndpoint = 'https://ce5siinwh3.execute-api.us-east-1.amazonaws.com/default/eli5ify';

// Creates an async/await timeout
function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});
}

export async function askQuestion({ extract_names, question }) {
	if (__MOCK__) {
		await delay(500);
		return { answer: 'Test' };
	}
	try {
		const payload = { operation: 'generate-response', extract_names, question };
		const response = await axios.post(lambdaEndpoint, payload);
		return response.data.response;
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
		const presignedUrls = await createPresignedUrls(filenames);

		// Upload files to S3
		await Promise.all(
			Object.values(presignedUrls).map(async (presignedUrl, index) => {
				await axios.put(presignedUrl, files[index], { headers: { 'Content-Type': files[index].type } });
			})
		);

		const answer = await askQuestion({ extract_names: Object.keys(presignedUrls) });
		// ToDo: Update ID and store file names
		return { summary: answer, id: Date.now(), extract_names: Object.keys(presignedUrls) };
	} catch (error) {
		console.error(error);
	}
}

async function createPresignedUrls(filenames) {
	const response = await axios.post(lambdaEndpoint, { operation: 'generate-presigned-urls', filenames });
	return response?.data?.urls;
}
