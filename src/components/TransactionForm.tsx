import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { addTransaction } from "../db/queries";
import { todayISO } from "../utils/date";

function uuid() {
  return "tx-" + Math.random().toString(36).slice(2, 10);
}

type Props = {
  onAdded?: () => void;
};

export default function TransactionForm({ onAdded }: Props) {
  const [amount, setAmount] = useState(""); // TL cinsinden
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayISO());

  async function handleAdd(sign: -1 | 1) {
    const parsed = Number(amount.replace(",", "."));
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert("Hata", "Geçerli bir tutar gir.");
      return;
    }

    const kurus = Math.round(parsed * 100) * sign;

    try {
      await addTransaction({
        id: uuid(),
        account_id: "acc-default",
        category_id: undefined,
        amount: kurus,
        note: note || null,
        tx_date: date,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      setAmount("");
      setNote("");
      onAdded?.();
    } catch (e) {
      console.error(e);
      Alert.alert("Hata", "İşlem eklenemedi.");
    }
  }

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontWeight: "700", fontSize: 16 }}>İşlem Ekle</Text>

      <TextInput
        placeholder="Tutar (TL)"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
        style={{ borderWidth: 1, padding: 8, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Not (opsiyonel)"
        value={note}
        onChangeText={setNote}
        style={{ borderWidth: 1, padding: 8, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Tarih (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        style={{ borderWidth: 1, padding: 8, borderRadius: 8 }}
      />

      <View style={{ flexDirection: "row", gap: 8 }}>
        <Button title="Gider (-)" onPress={() => handleAdd(-1)} />
        <Button title="Gelir (+)" onPress={() => handleAdd(1)} />
      </View>
    </View>
  );
}
