import { Text, View, TextInput, StyleSheet } from 'react-native';

const KWTextInput = ({ children, ...props }) => {
    return (
        <View>
            <Text style={styles.label}>{props.label}</Text>
            <TextInput {...props} style={styles.textInput}>{children}</TextInput>
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        position: 'absolute',
        top: 0,
        left: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        color: "#90CEDD",
    },
    textInput: {
        marginVertical: 10,
        padding: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#90CEDD",
    },
});

export default KWTextInput;