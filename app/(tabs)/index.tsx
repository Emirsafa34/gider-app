// app/(tabs)/index.tsx
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { monthSummary, MonthSummary } from "../../src/db/queries";
import { thisMonth } from "../../src/utils/date";
import { formatTL } from "../../src/utils/money";

export default function Dashboard() {
  const [summary, setSummary] = useState<MonthSummary>({
    income: 0,
    expense: 0,
    net: 0,
  });

  const m = thisMonth();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const load = async () => {
        const data = await monthSummary(m);
        if (isActive) {
          setSummary(data);
        }
      };

      load();

      return () => {
        isActive = false;
      };
    }, [m])
  );

  const { income, expense, net } = summary;

  const netColor =
    net > 0 ? "green" : net < 0 ? "crimson" : "gray";

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Özet – {m}</Text>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <View
          style={{
            flex: 1,
            padding: 16,
            borderWidth: 1,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontWeight: "600" }}>Bu Ay Toplam Gider</Text>
          <Text style={{ fontSize: 22, color: "crimson" }}>
            {formatTL(expense)}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            padding: 16,
            borderWidth: 1,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontWeight: "600" }}>Bu Ay Toplam Gelir</Text>
          <Text style={{ fontSize: 22, color: "green" }}>
            {formatTL(income)}
          </Text>
        </View>
      </View>

      <View
        style={{
          padding: 16,
          borderWidth: 1,
          borderRadius: 12,
        }}
      >
        <Text style={{ fontWeight: "600" }}>Net (Gelir - Gider)</Text>
        <Text style={{ fontSize: 26, color: netColor }}>
          {formatTL(net)}
        </Text>
      </View>

      <Text>
        İşlemler sekmesinde gider için "Gider (-)", gelir için "Gelir (+)" kullan.
      </Text>
    </View>
  );
}
