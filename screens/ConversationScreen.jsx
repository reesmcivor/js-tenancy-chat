import { View, Text, TextInput, Button, TouchableHighlight } from "react-native";
import { useEffect, useState, useCallback } from "react";
import conversations from "js-tenancy-chat/api/conversations";
import useNotificationChannel from "js-tenancy-chat/hooks/useNotificationChannel";
import { FlashList } from "@shopify/flash-list";
import ChatMessage from "../../../components/ChatMessage";

const ConversationScreen = ({ route }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [conversation, setConversation] = useState([]);
    const [message, setMessage] = useState('');
    const { conversationId } = route.params;

    // Channels
    const NOTIFICATION_EVENT = ".ReesMcIvor\\Chat\\Events\\NewChatMessage"
    const { user: { id: authUserId } } = useAuth();
    
    const handleNotificationsEvent = useCallback(message => {
      fetchConversation();
      setConversation(existingConversation =>
        existingConversation.concat(message.data)
      );
    }, []);

    useNotificationChannel(NOTIFICATION_EVENT, authUserId, handleNotificationsEvent);


    const fetchConversation = async () => {

        setIsLoading(true);
        const response = await conversations.getConversation(conversationId);
        if(!response.ok) {
            console.error(response);
        } else {
            setConversation(response.data);
        }
        setIsLoading(false);
        
    };

    useEffect(() => {
        fetchConversation();
    }, []);

    if(isLoading) {
        return <View><Text>loading...</Text></View>
    }

    const onMessageChange = (message) => {
        setMessage(message);
    };

    const sendMessageHandler = async () => {
        setIsLoading(true);
        const response = await conversations.sendMessage(conversationId, {
            content: message
        });
        if(!response.ok) {
            console.warn(response);
        } else {
            //setMessage('');
            setConversation(existingConversation =>
              existingConversation.concat([response?.data?.data])
            );
        }
        setIsLoading(false);
    };
    
    return (
      <>
        <TouchableHighlight onPress={fetchConversation}>
          <Text>REFRESH!</Text>
        </TouchableHighlight>
        <FlashList
            estimatedItemSize={30}
            inverted
            data={[...conversation].reverse()}
            renderItem={({ item }) => {
              return (
                <ChatMessage 
                  key={item.created_at.toString()}
                  message={item.content ?? item.message} 
                  sender="Alice"
                  avatar="https://example.com/alice-avatar.png" 
                />
              )
            }}
          />
          <TextInput className="bg-gray-100 border p-2" onChangeText={onMessageChange} />
          <Button title="Send" onPress={sendMessageHandler} />
        </>
    );
    
};

export default ConversationScreen;