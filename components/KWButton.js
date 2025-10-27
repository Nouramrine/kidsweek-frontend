import { Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const KWButton = ({ children, ...props }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={props.onPress}>
            <Text style={styles.text}>{props.title}</Text>
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