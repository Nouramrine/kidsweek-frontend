import { useEffect, useState, useCallback } from "react";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  createActivityAsync,
  deleteActivityAsync,
  updateActivityAsync,
  fetchActivitiesAsync,
} from "../../../reducers/activities";
import { fetchMembersAsync } from "../../../reducers/members";
import { useFocusEffect } from "@react-navigation/native";

export default function useActivityForm({ route, navigation }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value);
  const members = useSelector((state) => state.members.value);

  const { activityToEdit } = route.params || {};
  const isEditMode = activityToEdit && Object.keys(activityToEdit).length !== 0;

  // States

  const [activityName, setActivityName] = useState("");
  const [activityPlace, setActivityPlace] = useState("");
  const [dateBegin, setDateBegin] = useState(new Date());
  const [timeBegin, setTimeBegin] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [timeEnd, setTimeEnd] = useState(new Date());
  const [reminderNumber, setReminderNumber] = useState("10");
  const [reminderUnit, setReminderUnit] = useState("minutes");
  const [addMembers, setAddMembers] = useState([]);
  const [checklistItems, setChecklistItems] = useState([]);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [note, setNote] = useState("");
  const [colorAct, setColorAct] = useState("skin");

  // Effects

  useEffect(() => {
    if (user.token) {
      dispatch(fetchMembersAsync(user.token));
    }
  }, [user.token]);

  useFocusEffect(
    useCallback(() => {
      if (!isEditMode) resetForm();
    }, [isEditMode]),
  );

  useEffect(() => {
    if (isEditMode) {
      hydrateForm(activityToEdit);
    }
  }, [activityToEdit?._id]);

  // Helpers

  const combineDateAndTime = (date, time) => {
    const combined = new Date(date);
    combined.setHours(time.getHours());
    combined.setMinutes(time.getMinutes());
    combined.setSeconds(0);
    combined.setMilliseconds(0);
    return combined;
  };

  const calculateReminderDate = (activityDate) => {
    const reminderDate = new Date(activityDate);
    const number = parseInt(reminderNumber);

    switch (reminderUnit) {
      case "minutes":
        reminderDate.setMinutes(reminderDate.getMinutes() - number);
        break;
      case "heures":
        reminderDate.setHours(reminderDate.getHours() - number);
        break;
      case "jours":
        reminderDate.setDate(reminderDate.getDate() - number);
        break;
    }
    return reminderDate;
  };

  const validateForm = () => {
    const fullDateBegin = combineDateAndTime(dateBegin, timeBegin);
    const fullDateEnd = combineDateAndTime(dateEnd, timeEnd);

    if (!activityName.trim()) {
      Alert.alert("Oups!", "Le nom est obligatoire");
      return false;
    }

    if (activityName.trim().length < 3) {
      Alert.alert("Oups!", "Le nom doit faire au moins 3 caractères");
      return false;
    }

    if (addMembers.length === 0) {
      Alert.alert("Oups!", "Veuillez sélectionner au moins un enfant");
      return false;
    }

    if (fullDateBegin < Date.now()) {
      Alert.alert("Oups!", "La date de début ne doit pas être passée");
      return false;
    }

    if (fullDateEnd <= fullDateBegin) {
      Alert.alert("Oups!", "La date de fin doit être après la date de début");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setActivityName("");
    setActivityPlace("");
    setDateBegin(new Date());
    setTimeBegin(new Date());
    setDateEnd(new Date());
    setTimeEnd(new Date());
    setReminderNumber("10");
    setReminderUnit("minutes");
    setAddMembers([]);
    setChecklistItems([]);
    setNewChecklistItem("");
    setNote("");
    setColorAct("skin");
  };

  const hydrateForm = (activity) => {
    setActivityName(activity.name || "");
    setActivityPlace(activity.place || "");
    setAddMembers(activity.members || []);
    setChecklistItems(activity.tasks || []);
    setNote(activity.note || "");
    setColorAct(activity.color || "skin");

    if (activity.dateBegin) {
      const db = new Date(activity.dateBegin);
      setDateBegin(new Date(db.setHours(0, 0, 0, 0)));
      setTimeBegin(new Date(activity.dateBegin));
    }

    if (activity.dateEnd) {
      const de = new Date(activity.dateEnd);
      setDateEnd(new Date(de.setHours(0, 0, 0, 0)));
      setTimeEnd(new Date(activity.dateEnd));
    }

    // Calcul du reminder depuis la différence entre dateBegin et reminder
    if (activity.reminder && activity.dateBegin) {
      const date1 = new Date(activity.dateBegin);
      const date2 = new Date(activity.reminder);
      const diffInMs = Math.abs(date1 - date2);

      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      let unit, value;

      if (diffInDays > 0) {
        unit = "jours";
        value = diffInDays;
      } else if (diffInHours > 0) {
        unit = "heures";
        value = diffInHours;
      } else {
        unit = "minutes";
        value = diffInMinutes;
      }

      setReminderNumber(value.toString());
      setReminderUnit(unit);
    }
  };

  // Actions

  const handleSave = async () => {
    if (!validateForm()) return;

    const fullDateBegin = combineDateAndTime(dateBegin, timeBegin);
    const fullDateEnd = combineDateAndTime(dateEnd, timeEnd);
    const memberIds = addMembers.map((m) => m._id);

    try {
      await dispatch(
        createActivityAsync({
          name: activityName,
          place: activityPlace,
          dateBegin: fullDateBegin,
          dateEnd: fullDateEnd,
          reminder: calculateReminderDate(fullDateBegin),
          tasks: checklistItems,
          note,
          token: user.token,
          members: memberIds,
          color: colorAct,
        }),
      ).unwrap();

      dispatch(fetchActivitiesAsync(user.token));
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erreur", error.message || "Impossible de créer l'activité");
      console.error("Erreur création activité:", error);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    const fullDateBegin = combineDateAndTime(dateBegin, timeBegin);
    const fullDateEnd = combineDateAndTime(dateEnd, timeEnd);
    const memberIds = addMembers.map((m) => m._id);

    try {
      await dispatch(
        updateActivityAsync({
          activityId: activityToEdit._id,
          name: activityName,
          place: activityPlace,
          dateBegin: fullDateBegin,
          dateEnd: fullDateEnd,
          reminder: calculateReminderDate(fullDateBegin),
          tasks: checklistItems,
          note,
          token: user.token,
          members: memberIds,
          color: colorAct || "skin",
        }),
      ).unwrap();

      dispatch(fetchActivitiesAsync(user.token));
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Erreur",
        error.message || "Impossible de mettre à jour l'activité",
      );
      console.error("Erreur mise à jour activité:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(
        deleteActivityAsync({
          activityId: activityToEdit._id,
          token: user.token,
        }),
      ).unwrap();

      console.log("Activité supprimée avec succès");
      navigation.navigate("calendrier");
    } catch (error) {
      Alert.alert("Erreur", "Suppression impossible");
      console.error("Erreur suppression activité:", error);
    }
  };

  return {
    isEditMode,
    state: {
      activityName,
      activityPlace,
      dateBegin,
      timeBegin,
      dateEnd,
      timeEnd,
      reminderNumber,
      reminderUnit,
      addMembers,
      checklistItems,
      newChecklistItem,
      note,
      colorAct,
    },
    setters: {
      setActivityName,
      setActivityPlace,
      setDateBegin,
      setTimeBegin,
      setDateEnd,
      setTimeEnd,
      setReminderNumber,
      setReminderUnit,
      setAddMembers,
      setChecklistItems,
      setNewChecklistItem,
      setNote,
      setColorAct,
    },
    handlers: {
      handleSave,
      handleUpdate,
      handleDelete,
      resetForm,
    },
  };
}
