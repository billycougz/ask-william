const MOCK = true;

function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});
}

export async function askQuestion({ encodedFiles, question }) {
	if (MOCK) {
		await delay(500);
		return { answer: 'Test' };
	}
	try {
		const payload = {
			image: encodedFiles,
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
