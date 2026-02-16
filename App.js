import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  useFonts,
  Gluten_700Bold,
  Gluten_500Medium,
} from "@expo-google-fonts/gluten";
import {
  JosefinSans_400Regular,
  JosefinSans_300Light,
} from "@expo-google-fonts/josefin-sans";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import AddScreen from "./screens/AddActivity/AddScreen";
import AuthScreen from "./screens/AuthScreen";
import CalendarScreen from "./screens/CalendarScreen";
import FamillyScreen from "./screens/FamillyScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ActivityDetailsScreen from "./screens/ActivityDetailsScreen";
import user from "./reducers/user";
import members from "./reducers/members";
import activities from "./reducers/activities";
import zones from "./reducers/zones";
import notifications from "./reducers/notifications";
import invites from "./reducers/invites";
import { Provider, useSelector } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useRef } from "react";

const userPersistConfig = {
  key: "user",
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, user),
  members,
  activities,
  zones,
  notifications,
  invites,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

/*persistor.pause();
persistor.flush().then(() => {
  return persistor.purge();
});*/

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
          } else if (route.name === "Famille") {
            iconName = "people-outline";
          } else if (route.name === "Profil") {
            iconName = "person-outline";
          } else if (route.name === "add") {
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
          tabBarLabel: "",
        }}
      />
      <Tab.Screen name="Famille" component={FamillyScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Gluten_700Bold,
    Gluten_500Medium,
    JosefinSans_400Regular,
    JosefinSans_300Light,
  });

  const navigationRef = useRef();

  if (!fontsLoaded) {
    return null;
  }

  const DisplayIsLogged = () => {
    const userData = useSelector((state) => state.user.value);

    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!userData?.isLogged ? (
            <Stack.Screen name="auth" component={AuthScreen} />
          ) : (
            <>
              <Stack.Screen name="TabNavigator" component={TabNavigator} />
              <Stack.Screen name="AddScreen" component={AddScreen} />
              <Stack.Screen
                name="ActivityDetails"
                component={ActivityDetailsScreen}
              />
              <Stack.Screen name="FamillyScreen" component={FamillyScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <DisplayIsLogged />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    alignItems: "center",
    justifyContent: "center",
  },
});
