import React, { useRef, useState } from 'react';
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

export default function SendMessagePane({ activeConversation, isLoading, setIsLoading, updateConversation }) {
	const [question, setQuestion] = useState('');
	const [error, setError] = useState('');

	const messageInputRef = useRef(null);

	const askWilliam = async () => {
		setIsLoading(true);
		try {
			const { answer } = await askQuestion(activeConversation.s3Filenames, question);
			updateConversation({ question, answer });
			setQuestion('');
		} catch (e) {
			setError('There was an error. Please try again.');
			console.error(e);
		} finally {
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
			{error && <p style={{ color: 'red' }}>[ ! ] {error}</p>}
			<textarea
				ref={messageInputRef}
				style={{ width: 'calc(100% - 69px)' }}
				placeholder='Ask a question'
				onChange={(e) => setQuestion(e.target.value)}
				disabled={isLoading}
				value={question}
				onKeyDown={handleKeyDown}
			></textarea>
			<button onClick={askWilliam} disabled={!question || isLoading}>
				→
			</button>
		</FixedContainer>
	);
}
