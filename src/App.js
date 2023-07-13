import React, { useState } from 'react';
import IntroPane from './components/IntroPane';
import UploadFilePane from './components/UploadFilePane';
import ConversationPane from './components/ConversationPane';
import SendMessagePane from './components/SendMessagePane';
import { updateStoredConversations } from './storage';

export default function App() {
	const [selectedFiles, setSelectedFiles] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [{ id, exchanges }, setConversation] = useState({ id: null, exchanges: [] });

	const updateConversation = (newExchange) => {
		const updatedConversation = {
			id: id || Date.now(),
			exchanges: [...exchanges, newExchange],
		};
		setConversation(updatedConversation);
		updateStoredConversations(updatedConversation);
	};

	return (
		<div style={{ margin: '1em', marginBottom: '100px' }}>
			<IntroPane selectedFiles={selectedFiles} />

			<UploadFilePane {...{ selectedFiles, setSelectedFiles }} />

			{selectedFiles && !exchanges.length && (
				<p style={{ marginTop: '2em', textAlign: 'center' }}>
					Ask a question or leave the box empty to request a general summary.
				</p>
			)}

			{Boolean(exchanges.length) && <ConversationPane {...{ exchanges, isLoading }} />}

			<SendMessagePane {...{ selectedFiles, isLoading, setIsLoading, updateConversation }} />
		</div>
	);
}
