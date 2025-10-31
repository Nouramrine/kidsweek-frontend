import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

export const KWCardIcon = ({ children, ...props }) => {
    return (
        <View style={[styles.cardIcon, props.style]}>
            {children}
        </View>
    );
};
KWCardIcon.displayName = 'KWCardIcon';

export const KWCardTitle = ({ children, ...props }) => {
    return (
        <View style={[styles.cardTitle, props.style]}>
            {children}
        </View>
    );
};
KWCardTitle.displayName = 'KWCardTitle';

export const KWCardButton = ({ children, ...props }) => {
    return (
        <View style={[styles.cardButton, props.style]}>
            {children}
        </View>
    );
};
KWCardButton.displayName = 'KWCardButton';

export const KWCardHeader = ({ children, ...props }) => {
  const childrenArray = React.Children.toArray(children);

  const icon = childrenArray.find(child => child.type?.displayName === 'KWCardIcon');
  const title = childrenArray.find(child => child.type?.displayName === 'KWCardTitle');
  const button = childrenArray.find(child => child.type?.displayName === 'KWCardButton');

  return (
    <View style={[styles.cardHeader, props.style]}>
      <View style={styles.leftContainer}>
        {icon}
        {title}
      </View>
      {button}
    </View>
  );
};

export const KWCardBody = ({ children, ...props }) => {
    return (
        <View style={[styles.cardBody, props.style]}>
            {children}
        </View>
    );
};

export const KWCard = ({ children, ...props }) => {
    const color = props.color || colors.background
    return (
        <View style={[styles.card, props.style, { backgroundColor: color }]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    cardTitle: {
        marginLeft: 15,
    },
    cardButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardBody: {
        width: '100%',
        marginTop: 10,

    },
});
