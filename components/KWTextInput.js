import { Text, View, TextInput, StyleSheet } from 'react-native';
import KWText from '../components/KWText';
import { colors } from "../theme/colors";

const KWTextInput = ({ label, ...props }) => {
    return (
        <View style={styles.container}>
            <Text style={[styles.label, props.error && { color: colors.error[0] }]}>{label}</Text>
            <View style={[styles.inputWrapper, props.error && { borderColor: colors.error[0] } ]}>
                <TextInput {...props} style={styles.textInput} />
            </View>
            {props.error && <KWText type="inputError" style={styles.inputError}>{props.error}</KWText>}
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
        backgroundColor: colors.background[0],
        paddingHorizontal: 5,
        color: colors.input[0],
        fontWeight: 'bold',
        zIndex: 1,
    },
    inputWrapper: {
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.input[0],
    },
    textInput: {
        padding: 15,
        paddingTop: 15,
    },
    inputError: {
        position: 'absolute',
        bottom: -15,
        right: 15,
        backgroundColor: colors.background[0],
        paddingHorizontal: 5,
        color: colors.error[0],
        fontWeight: 'bold',
        zIndex: 1,
    },
});

export default KWTextInput;
