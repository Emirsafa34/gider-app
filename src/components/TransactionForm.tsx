import { useState } from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { addTransaction } from "../db/queries";
import { todayISO } from "../utils/date";
import CategoryPicker from "./CategoryPicker";

function uuid() {
  return "tx-" + Math.random().toString(36).slice(2, 10);
}

type Props = {
  onAdded?: () => void;
};

export default function TransactionForm({ onAdded }: Props) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayISO());

  const [category, setCategory] = useState<any | null>(null);
  const [catModal, setCatModal] = useState(false);

  async function handleAdd(sign: -1 | 1) {
    const parsed = Number(amount.replace(",", "."));
    if (isNaN(parsed) || parsed <= 0) return;

    const kurus = Math.round(parsed * 100) * sign;

    await addTransaction({
      id: uuid(),
      account_id: "acc-default",
      category_id: category?.id ?? null,
      amount: kurus,
      note: note || null,
      tx_date: date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    setAmount("");
    setNote("");
    setCategory(null);

    onAdded?.();
  }

  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontWeight: "700" }}>İşlem Ekle</Text>

      <TouchableOpacity
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 8,
          backgroundColor: "#fafafa",
        }}
        onPress={() => setCatModal(true)}
      >
        <Text>
          {category ? `Kategori: ${category.name}` : "Kategori Seç"}
        </Text>
      </TouchableOpacity>

      <CategoryPicker
        visible={catModal}
        onClose={() => setCatModal(false)}
        onSelect={(c) => setCategory(c)}
      />

      <TextInput
        placeholder="Tutar (TL)"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Not"
        value={note}
        onChangeText={setNote}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Tarih (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Button title="Gider (-)" onPress={() => handleAdd(-1)} />
        <Button title="Gelir (+)" onPress={() => handleAdd(1)} />
      </View>
    </View>
  );
}
