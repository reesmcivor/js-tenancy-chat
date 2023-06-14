import { TouchableOpacity, Text } from "react-native";
import { navigationRef } from "js-tenancy-core/hooks/rootNavigation";

export const ListItem = ({ conversation }) => {

    const redirectToConversation = ( conversationId ) => {
        navigationRef.current?.navigate('Conversation', { navigator: 'Conversations', conversationId: conversationId })
    }

    return (
        <TouchableOpacity 
            className="border border-gray-200 shadow-lg mb-5 p-5"
            onPress={() => redirectToConversation(conversation.id)}
        >
            
            <Text>{ conversation.subject }</Text>
            
            
        </TouchableOpacity>
    )
}