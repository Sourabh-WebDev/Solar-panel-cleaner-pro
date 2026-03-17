import { Text, TouchableOpacity } from "react-native";

export default function Button({ title, onPress }: any) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Text>{title}</Text>
        </TouchableOpacity>
    );
}