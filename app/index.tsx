// app/index.tsx
import { Redirect } from "expo-router";

export default function Index() {
  // Uygulama açılınca direkt tab'lere gitsin
  return <Redirect href="/(tabs)" />;
}
