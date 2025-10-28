import { Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const KWText = ({ children, ...props }) => {
    const type = props.type || 'text'
    return (
        <Text style={[styles.text, styles[type]]}>{children}</Text>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        fontFamily: 'JosefinSans_400Regular',
    },
    h1: {
        fontSize: 28,
        fontFamily: 'Gluten_500Medium',
        textAlign: 'center',
        padding: 10,
    },
    h2: {
        fontSize: 22,
        fontFamily: 'Gluten_500Medium',
        textAlign: 'center',
        padding: 10,
    },
    h3: {

    },
    inputError: {
        color: '#8b2020ff',
        paddingBottom: 10,
        paddingHorizontal: 15,
        fontWeight: 'bold',
        fontSize: 12,
    }
});

export default KWText;