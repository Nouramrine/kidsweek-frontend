import { Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const KWText = ({ children, ...props }) => {
    const type = props.type || 'text'
    return (
        <Text style={styles[type]}>{children}</Text>
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

    },
    h3: {

    }
});

export default KWText;