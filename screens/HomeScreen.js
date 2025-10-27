import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setActivities } from "../reducers/activities";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const activities = useSelector((state) => state.activities.value);
  const user = useSelector((state) => state.user.value);

  // recupérer les activité du membre connecté

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user.token) return;
      try {
        const response = await fetch("http://localhost:3000/activities/", {
          headers: {
            Authorization: user.token,
          },
        });
        const data = await response.json();

        if (data.result) {
          dispatch(setActivities(data.activities));
        } else {
          console.log("Erreur fetch activities", data.message);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchActivities();
  }, [user.token]);

  return (
    <View style={styles.container}>
      <Text>Homepage</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
