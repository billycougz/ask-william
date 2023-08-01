import React from 'react';
import styled from 'styled-components';
import { archiveConversation, getStoredConversations } from '../storage';

const Item = styled.p`
	cursor: pointer;
	text-decoration: none;
	display: flex;
	justify-content: space-between;
	button:hover {
		cursor: pointer;
	}
`;

export default function HistoryPane({ onConversationSelected }) {
	const conversations = getStoredConversations(true);
	const handleArchiveClick = (e, conversation) => {
		e.stopPropagation();
		const doArchive = window.confirm(`Archive ${conversation.name}?`);
		if (doArchive) {
			archiveConversation(conversation.id);
		}
	};
	return (
		<div>
			<h1 style={{ marginTop: 0 }}>Ask William</h1>
			<hr />
			{Boolean(conversations.length) && (
				<h2 onClick={() => onConversationSelected()}>
					<Item>+ New Conversation</Item>
				</h2>
			)}

			<h2>History</h2>
			{conversations.map((conversation) => (
				<div key={conversation.id} onClick={() => onConversationSelected(conversation)}>
					<Item>
						{conversation.name} <button onClick={(e) => handleArchiveClick(e, conversation)}>X</button>
					</Item>
				</div>
			))}
			{!Boolean(conversations.length) && 'No history on this browser'}
		</div>
	);
}
