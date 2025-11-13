// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="index" options={{ title: "Özet" }} />
      <Tabs.Screen name="transactions" options={{ title: "İşlemler" }} />
      <Tabs.Screen name="budgets" options={{ title: "Bütçeler" }} />
      <Tabs.Screen name="settings" options={{ title: "Ayarlar" }} />
    </Tabs>
  );
}
