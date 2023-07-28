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

export default function SendMessagePane({ id, isLoading, setIsLoading, updateConversation }) {
	const [question, setQuestion] = useState('');
	const myRef = useRef(null);

	const askWilliam = async () => {
		if (question) {
			setIsLoading(true);
			const { answer, error } = await askQuestion({ id, question });
			if (answer) {
				updateConversation({ question, answer });
				setQuestion('');
				// ToDo myRef.current.focus();
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
				ref={myRef}
				style={{ width: 'calc(100% - 69px)' }}
				placeholder={id ? 'Ask a question' : 'Start by uploading a document'}
				onChange={(e) => setQuestion(e.target.value)}
				disabled={!Boolean(id) || isLoading}
				value={question}
				onKeyDown={handleKeyDown}
			></textarea>
			<button onClick={askWilliam} disabled={!question || isLoading}>
				→
			</button>
		</FixedContainer>
	);
}