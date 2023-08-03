import React, { useState } from 'react';
import styled from 'styled-components';
import NewConversationPane from './components/NewConversationPane';
import ConversationPane from './components/ConversationPane';
import SendMessagePane from './components/SendMessagePane';
import { updateStoredConversations } from './storage';
import HistoryPane from './components/HistoryPane';
import { Conversation, Exchange } from './models';

const AppContainer = styled.div`
	display: flex;
`;

const SideContainer = styled.nav`
	@media only screen and (max-width: 400px) {
		display: none;
	}
	width: 300px;
	margin: 1em;
`;

const MainContainer = styled.main`
	@media only screen and (min-width: 401px) {
		width: calc(100vw - 300px);
	}
	@media only screen and (max-width: 400px) {
		width: 100%;
	}
	margin: auto 1em;
`;

const MainHeader = styled.div`
	display: flex;
	justify-content: center;
	gap: 1em;
	margin: 1em 0;
`;

const MainContent = styled.div`
	height: calc(100vh - 50px);
	overflow: scroll;
`;

export default function App() {
	const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const updateConversation = (newExchange: Exchange) => {
		if (!activeConversation) return;
		const timestamp = Date.now();
		newExchange.createdAt = timestamp;
		const updatedConversation = {
			...activeConversation,
			exchanges: [...activeConversation!.exchanges, newExchange],
			lastUpdated: timestamp,
		};
		setActiveConversation(updatedConversation);
		updateStoredConversations(updatedConversation);
	};

	const handleConversationStarted = ({ summary, name, s3Filenames }) => {
		const timestamp = Date.now();
		const conversation: Conversation = {
			name,
			s3Filenames,
			exchanges: [
				{
					question: 'You started a new conversation.',
					answer: summary,
					createdAt: timestamp,
				},
			],
			createdAt: timestamp,
			lastUpdated: timestamp,
		};
		updateStoredConversations(conversation);
		setActiveConversation(conversation);
	};

	const handleShowDocument = (type: 'source' | 'extract') => {
		const docCount = activeConversation!.s3Filenames!.length;
		if (docCount > 1) {
			const message = `This conversation contains ${docCount} documents and your browser may only allow one to open at once.\n\nCheck the right-side of your search bar for a 'blocked popup' icon and click it to see the list of additional documents.`
			alert(message);
		}
		activeConversation?.s3Filenames.forEach((name) => {
			const docName = type === 'source' ? `source-files/${name}` : `file-extracts/${swapFileTypeToJSON(name)}`;
			const url = `https://ask-william-bucket-dev.s3.us-east-1.amazonaws.com/${docName}`;
			window.open(url, '_blank');
		});
		function swapFileTypeToJSON(filename) {
			const parts = filename.split('.');
			parts[parts.length - 1] = 'json';
			return parts.join('.');
		}
	};

	return (
		<AppContainer>
			<SideContainer>
				<HistoryPane key={activeConversation} onConversationSelected={setActiveConversation} />
			</SideContainer>

			<MainContainer>
				{activeConversation && (
					<MainHeader>
						<strong>{activeConversation.name}</strong>
						<button onClick={() => handleShowDocument('source')}>Show Original</button>
						<button onClick={() => handleShowDocument('extract')}>Show Extract</button>
					</MainHeader>
				)}

				<MainContent>
					{!activeConversation && <NewConversationPane onConversationStarted={handleConversationStarted} />}

					{activeConversation && (
						<>
							<ConversationPane {...{ activeConversation, isLoading }} />
							<SendMessagePane {...{ activeConversation, isLoading, setIsLoading, updateConversation }} />
						</>
					)}
				</MainContent>
			</MainContainer>
		</AppContainer>
	);
}
