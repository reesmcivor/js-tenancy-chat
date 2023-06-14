import { useState, useEffect } from "react";
import { View, Text, ScrollView, Button } from "react-native";
import conversations from "js-tenancy-chat/api/conversations";
import { ListItem } from "js-tenancy-chat/components/conversations/ListItem";

const ListScreen = () => {

  const [loading, setLoading] = useState(false);
  const [convos, setConvos] = useState([]);

  const fetchConversations = async () => {
    setLoading(true);
    const response = await conversations.getConversations();
    if(!response.ok) {
      console.error(response);
    } else {
      setConvos(response.data.data)
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
            
            <Button title="Start New Conversation" onPress={newConversation} />

          
          <View>
              { convos?.length > 0 && convos?.map((conversation) => {
                  return (
                      <ListItem key={conversation.id} conversation={conversation} />
                  )
                })  
              }
            </View>
            
        </ScrollView>
      
    );
}

export default ListScreen;