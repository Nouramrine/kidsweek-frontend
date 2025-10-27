import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AddScreen from "./screens/AddScreen";
import AuthScreen from "./screens/AuthScreen";
import CalendarScreen from "./screens/CalendarScreen";
import FamillyScreen from "./screens/FamillyScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import user from "./reducers/user";
import { Provider } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";

import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

const reducers = combineReducers({ user });
const persistConfig = { key: "KidsWeek", storage: AsyncStorage };
const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
const persistor = persistStore(store);
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          if (route.name === "Acceuil") {
            iconName = "home-outline";
          } else if (route.name === "calendrier") {
            iconName = "calendar-clear-outline";
          } else if (route.name === "famille") {
            iconName = "people-outline";
          } else if (route.name === "Profil") {
            iconName = "person-outline";
          } else if (route.name === "add") {
            iconName = "add-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#A78BFA",
        tabBarInactiveTintColor: "#94A3B8",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Acceuil" component={HomeScreen} />
      <Tab.Screen name="calendrier" component={CalendarScreen} />
      <Tab.Screen name="add" component={AddScreen} />
      <Tab.Screen name="famille" component={FamillyScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
