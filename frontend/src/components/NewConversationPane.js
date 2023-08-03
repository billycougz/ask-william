import React, { useEffect, useRef, useState } from 'react';
import LoadingCursor from './LoadingCursor';
import { initializeConversation } from '../api';
import { getStoredConversations } from '../storage';

const useCaseList = [
	'Summarize this prescription',
	'What is the most popular IPA on this draught menu?',
	'What are the key points made in this privacy disclosure?',
];

export default function NewConversationPane({ onConversationStarted }) {
	const [selectedFiles, setSelectedFiles] = useState(null);
	const [conversationName, setConversationName] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const fileInputRef = useRef(null);

	useEffect(() => {
		if (selectedFiles) {
			// Clear the error once the user has reselected a file
			setError('');
		}
	}, [selectedFiles]);

	const handleBeginConversation = async () => {
		setIsLoading(true);
		try {
			const { summary, s3Filenames } = await initializeConversation(selectedFiles);
			onConversationStarted({ summary, name: conversationName, s3Filenames });
		} catch (e) {
			setSelectedFiles(null);
			fileInputRef.current.value = '';
			setConversationName('');
			setError('There was an error. Please try again.');
			console.error(e);
		} finally {
			setIsLoading(false);
		}
	};

	const isReadyToBegin = isLoading || !conversationName || error;

	const handleKeyDown = (event) => {
		if (!isReadyToBegin && event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleBeginConversation();
		}
	};

	const handleNameChange = (newName) => {
		const existingConversations = getStoredConversations();
		const sameName = existingConversations.find(({ name }) => name === newName);
		if (sameName) {
			const { archived } = sameName;
			let message = 'The name must be unique and right now it matches an existing name.';
			if (archived) {
				message += ' Note the conversation with the matching name is archived.';
			}
			setError(message);
		} else {
			setError('');
		}
		setConversationName(newName);
	};

	return (
		<div style={{ margin: '1em 0' }}>
			<details open={!Boolean(selectedFiles)}>
				<summary>
					<strong>Ask William</strong> is an AI that helps you answer questions about documents.
				</summary>
				<ul>
					{useCaseList.map((useCase) => (
						<li key={useCase}>"{useCase}"</li>
					))}
				</ul>
			</details>

			<div>
				<details open={!Boolean(selectedFiles)}>
					<summary>
						<strong>Upload Documents</strong>
					</summary>
					<p>Select one or more documents (PDF, JPG, or PNG).</p>
				</details>
				<p />
				<input
					ref={fileInputRef}
					type='file'
					accept='image/jpeg,image/png,application/pdf'
					multiple
					onChange={(e) => setSelectedFiles(Object.values(e.target.files))}
					disabled={isLoading}
				/>
				{selectedFiles && (
					<>
						<p>Provide a name that will help you identify this thread in your history.</p>

						<input
							type='text'
							disabled={isLoading}
							value={conversationName}
							onChange={(e) => handleNameChange(e.target.value)}
							onKeyDown={handleKeyDown}
						/>
						<button onClick={handleBeginConversation} disabled={isReadyToBegin}>
							Begin
						</button>
					</>
				)}

				{isLoading && (
					<>
						<p>
							<strong>Disclaimer:</strong> The information provided on this platform is for general informational
							purposes only, and William shall not be held liable for any actions, decisions, or outcomes resulting from
							its use.
						</p>
						<LoadingCursor />
					</>
				)}

				{error && <p style={{ color: 'red' }}>[ ! ] {error}</p>}
			</div>
		</div>
	);
}
