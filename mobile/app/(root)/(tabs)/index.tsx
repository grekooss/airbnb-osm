import { Text, View } from 'react-native';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text className="text-primary-50 font-Cereal-Bold text-3xl">
        Edit app/index.tsx to edit this screen.
      </Text>
    </View>
  );
}
