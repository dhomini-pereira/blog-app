import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { SignIn } from "./screens/signin/SignIn";
import { SignUp } from "./screens/signup/SignUp";
import { Posts } from "./screens/posts/Posts";
import { Post } from "./screens/post/Post";
import { Main } from "./screens/main/Main";

export const Routes = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="main" component={Main} />
        <Stack.Screen name="signin" component={SignIn} />
        <Stack.Screen name="signup" component={SignUp} />
        <Stack.Screen name="posts" component={Posts} />
        <Stack.Screen name="post" component={Post} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
