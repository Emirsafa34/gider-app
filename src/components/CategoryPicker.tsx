import { useEffect, useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { listCategories } from "../db/queries";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (cat: any) => void;
};

export default function CategoryPicker({ visible, onClose, onSelect }: Props) {
  const [cats, setCats] = useState<any[]>([]);

  async function load() {
    const data = await listCategories();
    setCats(data);
  }

  useEffect(() => {
    if (visible) load();
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 12,
            maxHeight: "70%",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>
            Kategori Seç
          </Text>

          <FlatList
            data={cats}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
                style={{
                  padding: 12,
                  borderBottomWidth: 0.5,
                  borderColor: "#ddd",
                }}
              >
                <Text style={{ fontSize: 16 }}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            onPress={onClose}
            style={{
              marginTop: 16,
              padding: 12,
              backgroundColor: "#eee",
              borderRadius: 8,
            }}
          >
            <Text style={{ textAlign: "center" }}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
