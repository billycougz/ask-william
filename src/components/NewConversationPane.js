import React, { useState } from 'react';
import LoadingCursor from './LoadingCursor';
import { uploadAndSummarizeFiles } from '../api';

// Get presigned URL
// Upload file
// Store S3 ID
// Poll for ready
// Get summary

const useCaseList = [
	'Summarize this prescription',
	'What is the most popular IPA on this draught menu?',
	'What are the key points made in this privacy disclosure?',
];

export default function NewConversationPane({ onConversationStarted }) {
	const [selectedFiles, setSelectedFiles] = useState(null);
	const [conversationName, setConversationName] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleBeginConversation = async () => {
		setIsLoading(true);
		const { id, summary, error } = await uploadAndSummarizeFiles(selectedFiles);
		if (error) {
			alert(error);
		} else {
			onConversationStarted({ id, summary, name: conversationName });
		}
		setIsLoading(false);
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
							onChange={(e) => setConversationName(e.target.value)}
						/>
						<button onClick={handleBeginConversation} disabled={isLoading || !conversationName}>
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
			</div>
		</div>
	);
}
