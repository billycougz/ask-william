import React, { useState } from 'react';
import styled from 'styled-components';
import { askQuestion } from '../api';

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

export default function SendMessagePane({ selectedFiles, isLoading, setIsLoading, updateConversation }) {
	const [question, setQuestion] = useState('');

	const convertFileToBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result.split(',')[1]);
			reader.onerror = (error) => reject(error);
		});
	};

	const askWilliam = async () => {
		if (selectedFiles) {
			setIsLoading(true);
			const base64Array = await Promise.all(selectedFiles.map(convertFileToBase64));
			const { answer, error } = await askQuestion({ encodeFiles: base64Array.join(), question });
			if (answer) {
				updateConversation({ question, answer });
				setQuestion('');
			} else {
				alert(error);
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
	);
}
