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
import ProfileScreen from "./screens/ProfileScreen";
import user from "./reducers/user";
import { Provider } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
//async storage pour react-native car lacal storage ne fonctione pas
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
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
            //Style personnalisé pour le bouton Add
            return (
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: "#8E7EED",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="add" size={32} color="white" />
              </View>
            );
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
      <Tab.Screen
        name="add"
        component={AddScreen}
        options={{
          tabBarLabel: "", // Pas de label pour le bouton add
        }}
      />
      <Tab.Screen name="famille" component={FamillyScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// affichage de authScreen si non connecté sinon arrivé sur homeScreen
const DisplayIsLogged = () => {
  const userData = useSelector((state) => state.user.value);
  console.log(userData?.isLogged);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userData?.isLogged ? (
          <Stack.Screen name="auth" component={AuthScreen} />
        ) : (
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <DisplayIsLogged />
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