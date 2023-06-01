import { View, Text, TextInput, Button, TouchableHighlight, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import conversations from "js-tenancy-chat/api/conversations";


import { usePrivateChannels } from 'js-tenancy-core/store/channels';
import Toast from 'react-native-root-toast';
import ChatMessage from "../../../components/ChatMessage";
import { FlashList } from "@shopify/flash-list";

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
    const [conversation, setConversation] = useState([]);
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
                <View className="border rounded-full bg-grey-300 mb-2">
                  <View className="flex flex-row p-4">
                    <Text>{JSON.stringify(item.content)}</Text>
                  </View>
                </View>
              )
            }}
          />
          <TextInput className="bg-gray-100 border p-2" onChangeText={onMessageChange} />
          <Button title="Send" onPress={sendMessageHandler} />
        </>
    );
    
};

export default ConversationScreen;