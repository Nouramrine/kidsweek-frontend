import { Text, View, TextInput, StyleSheet } from 'react-native';

const KWTextInput = ({ label, ...props }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputWrapper}>
                <TextInput {...props} style={styles.textInput} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        position: 'relative',
    },
    label: {
        position: 'absolute',
        top: -10,
        left: 15,
        backgroundColor: 'white',
        paddingHorizontal: 5,
        color: "#90CEDD",
        fontWeight: 'bold',
        zIndex: 1,
    },
    inputWrapper: {
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#90CEDD",
    },
    textInput: {
        padding: 15,
        paddingTop: 15,
    },
});

export default KWTextInput;