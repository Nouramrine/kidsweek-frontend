import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setAvtivities } from "../reducers/activities";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const activities = useSelector((state) => state.activities.value);
  const members = useSelector((state) => state.members.value);
  const user = useSelector((state) => state.user.value);

  const [selectedDate, setSelectedDate] = useState(new Date());

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
