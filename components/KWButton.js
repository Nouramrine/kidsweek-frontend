import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

const KWButton = ({ title, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.green,
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