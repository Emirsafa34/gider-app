import { Text, View } from "react-native";

export default function Dashboard() {
  return (
    <View style={{ flex: 1, padding: 16, gap: 8 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Gider Takip</Text>
      <Text>İskelet hazır, şimdi veritabanına geçiyoruz.</Text>
    </View>
  );
}
