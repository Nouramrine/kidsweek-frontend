import { StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

const KWCard = ({ children, ...props }) => {
    const color = props.color || "background"
    return (
        <TouchableOpacity style={[styles.card, props.style, { backgroundColor: colors[color] }]}>
            {children}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});

export default KWCard;