const CONVERSATIONS_KEY = 'ask-william-conversations';

export function getStoredConversations(excludeArchived) {
	const storageValue = localStorage.getItem(CONVERSATIONS_KEY);
	const conversations = storageValue ? JSON.parse(storageValue) : [];
	return excludeArchived ? conversations.filter(({ archived }) => !archived) : conversations;
}

export function updateStoredConversations(updatedConversation) {
	const conversations = getStoredConversations();
	updatedConversation.lastUpdated = Date.now();
	const updatedConversations = conversations.filter(({ id }) => id !== updatedConversation.id);
	updatedConversations.unshift(updatedConversation);
	localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updatedConversations));
}

export function archiveConversation(id) {
	const conversations = getStoredConversations();
	const updatedConversations = conversations.map((conversation) => {
		if (conversation.id === id) {
			return {
				...conversation,
				archived: true,
			};
		}
		return conversation;
	});
	localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updatedConversations));
}
