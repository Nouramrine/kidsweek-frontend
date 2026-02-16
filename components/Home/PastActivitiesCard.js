import React from "react";
import { View } from "react-native";
import {
  KWCard,
  KWCardHeader,
  KWCardTitle,
  KWCardBody,
  KWCardIcon,
} from "../KWCard";
import KWText from "../KWText";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

const PastActivitiesCard = ({ pastActivities, formatTime }) => {
  return (
    <KWCard style={{ backgroundColor: colors.background[0], marginBottom: 15 }}>
      <KWCardHeader>
        <KWCardIcon>
          <Ionicons name="time-outline" size={30} color={colors.purple[2]} />
        </KWCardIcon>
        <KWCardTitle>
          <KWText type="h2" style={{ color: colors.purple[2] }}>
            Activités passées
          </KWText>
        </KWCardTitle>
      </KWCardHeader>

      <KWCardBody>
        {pastActivities.length === 0 ? (
          <KWText style={{ width: "100%", textAlign: "center" }}>
            Aucune activité récente.
          </KWText>
        ) : (
          pastActivities.map((a) => {
            const palette = colors[a.color] || colors.gray;
            return (
              <View
                key={a._id}
                style={{
                  marginBottom: 10,
                  backgroundColor: palette[0],
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <KWText
                  type="h3"
                  style={{ color: palette[2], fontweight: "bold" }}
                >
                  {a.name}
                </KWText>
                <KWText>
                  📅 {new Date(a.dateBegin).toLocaleDateString("fr-FR")}
                </KWText>
                <KWText>
                  🕒 {formatTime(a.dateBegin)} → {formatTime(a.dateEnd)}
                </KWText>
                {a.place && <KWText>📍 {a.place}</KWText>}
              </View>
            );
          })
        )}
      </KWCardBody>
    </KWCard>
  );
};

export default PastActivitiesCard;
