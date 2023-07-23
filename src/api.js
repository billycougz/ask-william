const MOCK = true;

function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});
}

export async function askQuestion({ id, question }) {
	if (MOCK) {
		await delay(500);
		return { answer: 'Test' };
	}
	try {
		const payload = {
			id,
			question,
		};
		const response = await fetch('https://ce5siinwh3.execute-api.us-east-1.amazonaws.com/default/eli5ify', {
			method: 'POST',
			body: JSON.stringify(payload),
		});
		const data = await response.json();
		if (!response.ok || !data.summary) {
			const message = typeof data === 'object' ? data.message : 'There was an error.';
			return { error: message };
		}
		return { answer: data.summary };
	} catch (e) {
		return { error: e.message };
	}
}

function uploadFileToS3() {}

function pollForReadyDocument() {}

export async function uploadAndSummarizeFiles() {
	if (MOCK) {
		await delay(500);
		return { id: Date.now(), summary: 'HELLO WORLD' };
	}
}

// const handleFileUpload = () => {
// 	if (selectedFile) {
// 		axios
// 			.put('PRESIGNED_URL', selectedFile, {
// 				headers: {
// 					'Content-Type': selectedFile.type,
// 				},
// 			})
// 			.then((response) => {
// 				// Handle successful upload response
// 				console.log('Upload successful!', response);
// 			})
// 			.catch((error) => {
// 				// Handle error during upload
// 				console.error('Upload error:', error);
// 			});
// 	}
// };
