import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import TransactionForm from "../../src/components/TransactionForm";
import { listTransactions } from "../../src/db/queries";
import { thisMonth } from "../../src/utils/date";
import { formatTL } from "../../src/utils/money";

export default function Transactions() {
  const [rows, setRows] = useState<any[]>([]);
  const [month] = useState(thisMonth());

  async function load() {
    const data = await listTransactions(month);
    setRows(data);
  }

  useEffect(() => {
    load();
  }, []);

  // Sekme her odağa geldiğinde yenile
  useFocusEffect(
    useCallback(() => {
      load();
    }, [month])
  );

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <TransactionForm onAdded={load} />

      <Text style={{ fontWeight: "700", marginTop: 8 }}>
        Bu Ay İşlemler
      </Text>

      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 8, borderBottomWidth: 0.5 }}>
            <Text style={{ fontWeight: "600" }}>
              {item.tx_date} • {item.category_name ?? "Kategori Yok"}
            </Text>
            <Text>{item.note ?? "-"}</Text>
            <Text style={{ color: item.amount < 0 ? "crimson" : "green" }}>
              {formatTL(item.amount)}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text>Henüz işlem yok.</Text>}
      />
    </View>
  );
}
