const CONVERSATIONS_KEY = 'ask-william-conversations';

export function getStoredConversations() {
	const storedConversations = localStorage.getItem(CONVERSATIONS_KEY);
	return storedConversations ? JSON.parse(storedConversations) : [];
}

export function updateStoredConversations(updatedConversation) {
	const storedConversations = getStoredConversations();
	const updatedConversations = storedConversations.filter(({ id }) => id !== updatedConversation.id);
	updatedConversations.push(updatedConversation);
	localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updatedConversations));
}
