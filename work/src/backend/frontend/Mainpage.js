import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";

export default function MainScreen({ tasks, title, setTitle, addTask, toggleTask }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Work Tracker</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Enter task..."
          value={title}
          onChangeText={setTitle}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTask}>
          <Text style={styles.btnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleTask(item.id)}>
            <Text style={styles.task}>
              {item.completed ? "✅ " : "⬜ "} {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#0f172a" },
  title: { color: "#fff", fontSize: 24, textAlign: "center", marginBottom: 12 },
  row: { flexDirection: "row", marginBottom: 12 },
  input: { flex: 1, backgroundColor: "#fff", padding: 10, borderRadius: 8 },
  addBtn: { backgroundColor: "#22c55e", padding: 10, borderRadius: 8, marginLeft: 8 },
  btnText: { color: "#000", fontWeight: "600" },
  task: { color: "#fff", paddingVertical: 8 },
});
