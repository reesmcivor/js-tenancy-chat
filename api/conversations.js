import apiClient from "js-tenancy-core/api/client";

const conversationsEndpoint = '/conversations';
const getConversations = () => apiClient.get(conversationsEndpoint);

export default {
    getConversations
}