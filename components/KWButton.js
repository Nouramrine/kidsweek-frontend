import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

const KWButton = ({ title, color, onPress }) => {
    return (
        <TouchableOpacity style={[styles.button, { backgroundColor: color ? color : colors.green[1] }]} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default KWButton;