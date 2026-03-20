import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../../screens/profile/Profile';
import EditProfile from '../../screens/profile/EditProfile';
import ChatListScreen from '../../screens/chat/ChatListScreen';
import ChatConversationScreen from '../../screens/chat/ChatConversationScreen';

const Stack = createNativeStackNavigator();

const ProfileStack: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="ChatConversation" component={ChatConversationScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
