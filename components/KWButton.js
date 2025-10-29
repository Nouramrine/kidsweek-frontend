import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { FontAwesome5 } from '@expo/vector-icons';
import KWText from './KWText';

const KWButton = ({ icon, title, bgColor, color, onPress }) => {
    return (
        <TouchableOpacity style={[styles.button, { backgroundColor: bgColor ? bgColor : colors.green[1] }]} onPress={onPress}>
            {icon && <FontAwesome5 name={icon} size={12} color={color ? color : 'white'} style={styles.icon} /> }
            <KWText style={[styles.text, { color: color ? color : 'white' }]}>{title}</KWText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 10,
    },
    icon: {
        marginRight: 10,
    },
    text: {
        alignItems: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
});

export default KWButton;