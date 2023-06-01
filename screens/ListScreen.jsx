import { useState, useCallback, useEffect } from "react";
import { View, Text, ScrollView, Button, TouchableOpacity } from "react-native";
import useAuth from "js-tenancy-auth/hooks/useAuth";

import { usePrivateChannels } from 'js-tenancy-core/store/channels';
import Toast from 'react-native-root-toast';
import ChatMessage from "../../../components/ChatMessage";
import conversations from "js-tenancy-chat/api/conversations";
import { navigationRef } from "js-tenancy-core/hooks/rootNavigation";

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

const ListScreen = () => {

  const [loading, setLoading] = useState(false);
  const [convos, setConvos] = useState([]);

  const fetchConversations = async () => {
    setLoading(true);
    const response = await conversations.getConversations();
    if(!response.ok) {
      console.log(response);
    } else {
      console.log(response.data);
      setConvos(response.data)
      console.log(response);
    }
    setLoading(false);
  }

  const newConversation = async () => {
    setLoading(true);
    const response = await conversations.newConversation({subject: 'test'});
    if(!response.ok) {
    } else {
      await fetchConversations();
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchConversations();
}, []);





    if(loading) {
        return <View><Text>loading123...</Text></View>
    }


    return (
        <ScrollView className="bg-red">
            <Text>CHAT</Text>
            <Button title="New Conversation" onPress={newConversation} />

          
            { convos?.length > 0 && convos?.map((convo) => {
                return (
                    <TouchableOpacity key={convo.id} className="mx-5 mb-5 border p-2 bg-gray-400 z-10" 
                        onPress={() => navigationRef.current?.navigate(
                            'Conversation', {
                                navigator: 'Conversations',
                                conversationId: convo.id
                            })}>
                        <Text>{convo.created_at} - {convo.subject} oksahjd khgas d</Text>
                        <Text>sdfohsdfkj</Text>
                    </TouchableOpacity>
                )
              })  
            }
            <Notifications />
            
        </ScrollView>
      
    );
}

export default ListScreen;