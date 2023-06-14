import { View, Text, TextInput, Button, TouchableHighlight, KeyboardAvoidingView } from "react-native";
import { useEffect, useState, useCallback } from "react";
import conversations from "js-tenancy-chat/api/conversations";
import { FlashList } from "@shopify/flash-list";
import ChatMessage from "../../../components/ChatMessage";
import useNotificationChannel from "js-tenancy-chat/hooks/useNotificationChannel";

const ConversationScreen = ({ route }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [conversation, setConversation] = useState([]);
  
    
    const [message, setMessage] = useState('');
    const { conversationId } = route.params;

    // Channels
    const NOTIFICATION_EVENT = ".ReesMcIvor\\Chat\\Events\\NewChatMessage"
    const { user: { id: authUserId } } = useAuth();
    
    const handleNotificationsEvent = useCallback(({ message })  => {      
      setConversation(existingConversation => existingConversation.concat([message]));
    }, [conversation]);
    
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
        console.debug('fetchConversation');
    }, []);

    if(isLoading) {
        return <View><Text>loading...</Text></View>
    }

    console.debug('reload');

    const onMessageChange = (message) => {
        setMessage(message);
    };

    const sendMessageHandler = async () => {
    
      //return;
        //setIsLoading(true);
        const response = await conversations.sendMessage(conversationId, {
            content: message
        });
        
        
        
        if(!response.ok) {
            console.warn(response);
        } else {


            setMessage('');
            setConversation(existingConversation =>
              existingConversation.concat([response?.data?.data])
            );
        }
        //setIsLoading(false);
    };

    const conversationIdsFinal = conversation.map(message => message.id).reverse();
    
    
    return (
      <>
        <TouchableHighlight onPress={fetchConversation}>
          <Text>REFRESH!</Text>
        </TouchableHighlight>

        <FlashList
            estimatedItemSize={30}
            inverted
            KeyboardAvoidingView={true}
            data={conversationIdsFinal.sort(function(a, b){return a.index < b.index})}
            renderItem={({ item }) => {
              const message = conversation.find(message => message.id === item);
              return (
          
                
                <ChatMessage 
                  key={message.created_at.toString()}
                  message={message?.content ?? message?.message} 
                  sender="Alice"
                  avatar="https://example.com/alice-avatar.png" 
                />
           
              )
            }}
          />
          <KeyboardAvoidingView>
            <TextInput className="bg-gray-100 border p-2" onChangeText={onMessageChange} />
            <Button title="Send" onPress={sendMessageHandler} />
          </KeyboardAvoidingView>
        </>
    );
    
};

export default ConversationScreen;