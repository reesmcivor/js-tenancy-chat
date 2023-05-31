import { View, Text, TextInput, Button, TouchableHighlight, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import conversations from "js-tenancy-chat/api/conversations";



import { usePrivateChannels } from 'js-tenancy-core/store/channels';
import Toast from 'react-native-root-toast';
import ChatMessage from "../../../components/ChatMessage";

const NOTIFICATION_EVENT =
  ".App\\Events\\NewChatMessage"


function useNotificationChannel(authUserId, onChange) {
    const channels = usePrivateChannels(authUserId);
    useEffect(() => {
      if (channels) {
        channels.listen(NOTIFICATION_EVENT, onChange);
        // same as channels.notification(onChange)
        return () => {
          channels.stopListening(NOTIFICATION_EVENT);
        };
      }
    }, [channels, onChange]);
  }

const Notifications = () => {

    const { user: { id: authUserId } } = useAuth();
    //const conversation = useApi(conversations.getConversation);

    //console.log(conversation);


    const [notifications, setNotifications] = useState([]);
    const handleNotificationsEvent = useCallback(notification => {
      Toast.show(notification.message);
      setNotifications(existingNotifications =>
        [notification].concat(existingNotifications)
      );
    }, []);

    useNotificationChannel(authUserId, handleNotificationsEvent);
  

    return (
      <ScrollView>
        {notifications.map(n => {
          return (
            <ChatMessage 
              key={n.id}
              message={n.message} 
              sender="Alice" 
              isSender={Math.random() < 0.5} 
              avatar="https://example.com/alice-avatar.png" 
            />
          );
        })}
      </ScrollView>
    );
  }
  
const ConversationScreen = ({ route }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [conversation, setConversation] = useState(false);
    const [message, setMessage] = useState('');
    const { conversationId } = route.params;

    const fetchConversation = async () => {

        setIsLoading(true);
        const response = await conversations.getConversation(conversationId);
        if(!response.ok) {
            console.log(response);
        } else {
            console.log(response.data);
            setConversation(response.data);
        }
        setIsLoading(false);
        
    };

    useEffect(() => {
        //console.log('conversationId', conversationId);
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
            console.log(response);
        } else {
            console.log(response.data);
            setMessage('');
            await fetchConversation();
        }
        setIsLoading(false);
    };
    
    
    return (
        <View className="flex flex-1">
            <View>
                <TouchableHighlight onPress={fetchConversation}>
                    <Text>REFRESH</Text>
                </TouchableHighlight>
                
    
                <ScrollView>
                { 
                    conversation && conversation?.map((message) => {
                        return (
                            <View key={message.id} className={`p-2 flex bg-red-100 m-2`}>
                                <Text>{message.content}</Text>
                                <Text>{message?.user?.email}</Text>
                            </View>
                        );
                    })
                }
                    <TextInput className="bg-gray-100 border p-2" onChangeText={onMessageChange} />
                    <Button title="Send" onPress={sendMessageHandler} />
                </ScrollView>
            </View>
        </View>
      
    );
}

export default ConversationScreen;