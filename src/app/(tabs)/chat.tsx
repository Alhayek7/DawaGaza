// src/app/chat/[id].tsx
import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Colors = {
  primary: '#0f5238',
  surface: '#f8faf6',
  surfaceContainerHigh: '#e7e9e5',
  onPrimary: '#ffffff',
  onSurface: '#191c1a',
  onSurfaceVariant: '#404943',
  secondary: '#5a5f62',
  success: '#10b981',
};

export default function ChatDetailScreen() {
  const { id, name } = useLocalSearchParams();
  const [messages, setMessages] = useState([
    { id: '1', text: 'مرحباً، كيف يمكنني مساعدتك؟', sender: 'pharmacist', time: '10:30' },
    { id: '2', text: 'بدي اسأل عن دواء', sender: 'user', time: '10:32' },
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString(),
    };
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name || 'صيدلية'}</Text>
        <View style={styles.statusDot} />
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        renderItem={({ item }) => (
          <View style={[styles.messageRow, item.sender === 'user' ? styles.userRow : styles.pharmacistRow]}>
            <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.pharmacistBubble]}>
              <Text style={item.sender === 'user' ? styles.userText : styles.pharmacistText}>
                {item.text}
              </Text>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="اكتب رسالتك..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendIcon}>📤</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: Colors.surfaceContainerHigh },
  backIcon: { fontSize: 24, color: Colors.primary },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: Colors.onSurface },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.success },
  messagesList: { padding: 16, gap: 12 },
  messageRow: { flexDirection: 'row' },
  userRow: { justifyContent: 'flex-end' },
  pharmacistRow: { justifyContent: 'flex-start' },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16 },
  userBubble: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  pharmacistBubble: { backgroundColor: Colors.surfaceContainerHigh, borderBottomLeftRadius: 4 },
  userText: { color: Colors.onPrimary },
  pharmacistText: { color: Colors.onSurface },
  timeText: { fontSize: 10, color: Colors.secondary, marginTop: 4, textAlign: 'right' },
  inputContainer: { flexDirection: 'row', padding: 16, gap: 12, borderTopWidth: 1, borderTopColor: Colors.surfaceContainerHigh },
  input: { flex: 1, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10 },
  sendButton: { backgroundColor: Colors.primary, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  sendIcon: { fontSize: 20, color: Colors.onPrimary },
});