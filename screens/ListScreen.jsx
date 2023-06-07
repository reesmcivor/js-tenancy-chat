import { useState, useEffect } from "react";
import { View, Text, ScrollView, Button, TouchableOpacity } from "react-native";

import conversations from "js-tenancy-chat/api/conversations";
import { navigationRef } from "js-tenancy-core/hooks/rootNavigation";


const ListScreen = () => {

  const [loading, setLoading] = useState(false);
  const [convos, setConvos] = useState([]);

  const fetchConversations = async () => {
    setLoading(true);
    const response = await conversations.getConversations();
    if(!response.ok) {
      console.warn(response);
    } else {
      setConvos(response.data)
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
            
        </ScrollView>
      
    );
}

export default ListScreen;