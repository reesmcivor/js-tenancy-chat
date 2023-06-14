
import { createStackNavigator } from '@react-navigation/stack';
import ConversationScreen from 'js-tenancy-chat/screens/ConversationScreen';
import ListScreen from 'js-tenancy-chat/screens/ListScreen';

const ChatNavigator = () => {
    
    
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="List" component={ListScreen} />
            <Stack.Screen name="Conversation" component={ConversationScreen} />
        </Stack.Navigator>
    );
}

export default ChatNavigator;