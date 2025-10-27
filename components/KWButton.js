import { Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const KWButton = ({ title, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#80CEC7',
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