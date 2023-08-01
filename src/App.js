import React, { useState } from 'react';
import styled from 'styled-components';
import NewConversationPane from './components/NewConversationPane';
import ConversationPane from './components/ConversationPane';
import SendMessagePane from './components/SendMessagePane';
import { updateStoredConversations } from './storage';
import HistoryPane from './components/HistoryPane';

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
	const [{ id, name, exchanges, extract_names }, setConversation] = useState({ id: null, exchanges: [] });
	const [isLoading, setIsLoading] = useState(false);

	const updateConversation = (newExchange) => {
		const updatedConversation = {
			id,
			name,
			extract_names,
			exchanges: [...exchanges, newExchange],
		};
		setConversation(updatedConversation);
		updateStoredConversations(updatedConversation);
	};

	const handleConversationStarted = ({ id, summary, name, extract_names }) => {
		const conversation = {
			id,
			name,
			extract_names,
			exchanges: [
				{
					question: 'You started a new conversation.',
					answer: summary,
				},
			],
		};
		setConversation(conversation);
		updateStoredConversations(conversation);
	};

	const handleConversationSelected = (selectedConversation) => {
		setConversation(selectedConversation || { id: null, exchanges: [] });
	};

	return (
		<AppContainer>
			<SideContainer>
				<HistoryPane onConversationSelected={handleConversationSelected} />
			</SideContainer>

			<MainContainer>
				{id && (
					<MainHeader>
						<strong>{name}</strong>
						<button>Show Original</button>
						<button>Show Extract</button>
					</MainHeader>
				)}
				<MainContent>
					{!id && <NewConversationPane onConversationStarted={handleConversationStarted} />}

					{id && !exchanges.length && (
						<p style={{ marginTop: '2em', textAlign: 'center' }}>
							Ask a question or leave the box empty to request a general summary.
						</p>
					)}

					{Boolean(exchanges.length) && <ConversationPane {...{ exchanges, isLoading }} />}

					<SendMessagePane {...{ id, extract_names, isLoading, setIsLoading, updateConversation }} />
				</MainContent>
			</MainContainer>
		</AppContainer>
	);
}
