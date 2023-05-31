import apiClient from "js-tenancy-core/api/client";

const conversationsEndpoint = '/chat/conversations';
const getConversations = () => apiClient.get(conversationsEndpoint);

const newConversationEndpoint = '/chat/conversations/create';
const newConversation = (data) => apiClient.post(newConversationEndpoint, data);

const conversationEndpoint = '/chat/conversations/view/:id';
const getConversation = (id) => apiClient.get(conversationEndpoint.replace(':id', id));

const sendMessageEndpoint = '/chat/conversations/:id/messages/create';
const sendMessage = (id, data) => apiClient.post(sendMessageEndpoint.replace(':id', id), data);

export default {
    getConversations, 
    newConversation, 
    getConversation, 
    sendMessage
}