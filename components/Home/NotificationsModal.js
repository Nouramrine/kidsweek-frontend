import React from "react";
import { View, FlatList } from "react-native";
import KWModal from "../KWModal";
import { KWCard, KWCardBody } from "../KWCard";
import KWText from "../KWText";
import KWButton from "../KWButton";
import { colors } from "../../theme/colors";

const NotificationsModal = ({
  visible,
  onClose,
  loading,
  notifications,
  onAccept,
  onRefuse,
  onDismissReminder,
}) => {
  return (
    <KWModal visible={visible} onRequestClose={onClose}>
      <KWText type="h2" style={{ marginBottom: 10, color: colors.purple[2] }}>
        Notifications
      </KWText>

      {loading ? (
        <KWText>Chargement...</KWText>
      ) : !notifications || notifications.length === 0 ? (
        <KWText>Aucun notification.</KWText>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => (
            <KWCard
              style={{
                width: "100%",
                marginBottom: 10,
                backgroundColor:
                  item.type === "reminder" ? colors.purple[0] : colors.pink[0],
              }}
            >
              <KWCardBody>
                <KWText>{item.message}</KWText>

                {item.type === "validation" && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      gap: 10,
                      marginTop: 10,
                    }}
                  >
                    <KWButton
                      title="Accepter"
                      bgColor={colors.green[1]}
                      onPress={() => onAccept(item.activityId)}
                      style={{ minWidth: 100 }}
                    />
                    <KWButton
                      title="Refuser"
                      bgColor={colors.red[1]}
                      onPress={() => onRefuse(item.activityId)}
                      style={{ minWidth: 100 }}
                    />
                  </View>
                )}

                {item.type === "reminder" && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      marginTop: 10,
                    }}
                  >
                    <KWButton
                      title="OK"
                      bgColor={colors.purple[1]}
                      onPress={() => onDismissReminder(item.id)}
                      style={{ minWidth: 100 }}
                    />
                  </View>
                )}
              </KWCardBody>
            </KWCard>
          )}
        />
      )}
    </KWModal>
  );
};

export default NotificationsModal;
