import React, { useState } from 'react';
import styled from 'styled-components';
import LoadingIndicator from './LoadingCursor';

const useCaseList = [
	'Medical documents and prescriptions',
	'Financial prospectuses and reports',
	'Technical manuals and user guides',
	'Terms and conditions',
	'Insurance policies',
	'Legal contracts',
	'Etc.',
];

const convertFileToBase64 = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result.split(',')[1]);
		reader.onerror = (error) => reject(error);
	});
};

const ImageUploader = () => {
	const [selectedFiles, setSelectedFiles] = useState(null);
	const [question, setQuestion] = useState('');
	const [conversation, setConversation] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const askWilliam = async () => {
		if (selectedFiles) {
			setIsLoading(true);

			const base64Array = await Promise.all(selectedFiles.map(convertFileToBase64));
			const payload = {
				image: base64Array.join(),
				question,
			};
			try {
				const response = await fetch('https://ce5siinwh3.execute-api.us-east-1.amazonaws.com/default/eli5ify', {
					method: 'POST',
					body: JSON.stringify(payload),
				});
				const data = await response.json();
				if (!response.ok) {
					const message = typeof data === 'object' ? data.message : 'There was an error.';
					throw new Error(message);
				}
				const updatedConversation = [...conversation, { question, answer: data.summary }];
				setConversation(updatedConversation);
				console.log(updatedConversation);
				// ToDo: localStorage.setItem('ask-william-conversations', updatedConversation);
				setQuestion('');
			} catch (e) {
				console.log(e);
				alert(e.message);
			}
			setIsLoading(false);
		}
	};

	const handleKeyDown = (event) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			askWilliam();
		}
	};

	return (
		<div style={{ margin: '1em', marginBottom: '100px' }}>
			<h1 style={{ textAlign: 'center' }}>Ask William</h1>

			<details open={!Boolean(selectedFiles)}>
				<summary>
					<strong>Ask William</strong> is an AI that can summarize and answer questions about verbose documents.
				</summary>
				<ul>
					{useCaseList.map((useCase) => (
						<li key={useCase}>{useCase}</li>
					))}
				</ul>
				<sub>
					<strong>Disclaimer:</strong> The information provided on this platform is for general informational purposes
					only, and William shall not be held liable for any actions, decisions, or outcomes resulting from its use.
				</sub>
			</details>

			<br />

			<details open={!Boolean(selectedFiles)}>
				<summary>
					<strong>Upload Documents</strong>
				</summary>
				<sub>
					Each document must be an image or PDF and the total size must be less than 6MB at this time. You can upload
					physical documents with your phone by taking one or more photos.
				</sub>

				<br />
				<br />
				<input
					type='file'
					accept='image/jpeg,image/png,application/pdf'
					multiple
					onChange={(e) => setSelectedFiles(Object.values(e.target.files))}
				/>
			</details>

			{selectedFiles && !conversation.length && (
				<p style={{ marginTop: '2em', textAlign: 'center' }}>
					Ask a question or leave the box empty to request a general summary.
				</p>
			)}

			{conversation.map(({ question, answer }, index) => (
				<div
					style={{
						padding: '1em',
						margin: '1em 0',
						borderRadius: '5px',
						background: index % 2 ? '#f2f2f2' : '#e6e6e6',
					}}
				>
					<div>
						<h2 style={{ marginTop: '0' }}>You</h2>
						{question || 'You requested a general summary.'}
					</div>
					<div>
						<h2>William</h2>
						{answer}
					</div>
				</div>
			))}

			{isLoading && (
				<>
					<LoadingIndicator />
				</>
			)}

			<FixedContainer>
				<textarea
					style={{ width: 'calc(100% - 69px)' }}
					placeholder={selectedFiles ? 'Ask a question' : 'Start by uploading a document'}
					onChange={(e) => setQuestion(e.target.value)}
					disabled={!Boolean(selectedFiles) || isLoading}
					value={question}
					onKeyDown={handleKeyDown}
				></textarea>
				<button onClick={askWilliam} disabled={!selectedFiles || isLoading}>
					→
				</button>
			</FixedContainer>
		</div>
	);
};

export default ImageUploader;

const FixedContainer = styled.div`
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	display: flex;
	justify-content: space-between;
	background-image: linear-gradient(to bottom, transparent, white);
	padding: 20px;
	box-sizing: border-box;
`;
