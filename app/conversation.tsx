import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { IconButton, Menu } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Mock data for messages
const MOCK_MESSAGES = [
  { id: '1', text: '¡Hola! ¿Qué tal?', sender: 'other', timestamp: '10:30' },
  { id: '2', text: '¡Hey! Todo bien, ¿y tú?', sender: 'me', timestamp: '10:31' },
  { id: '3', text: 'Genial 😊 ¿Has visto el nuevo Now que he publicado?', sender: 'other', timestamp: '10:32' },
  { id: '4', text: '¡Sí! Me ha encantado la idea', sender: 'me', timestamp: '10:33' },
];

export default function ChatScreen() {
  const params = useLocalSearchParams<{
    id: string;
    name: string;
    avatar: string;
    subtitle?: string;
    lastMessage?: string;
  }>();
  console.log('Chat Params:', params);
  const [menuVisible, setMenuVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [isBlocked, setIsBlocked] = useState(false);

  const handleBlock = async () => {
    try {
      // In a real app, you would make an API call here
      setIsBlocked(prev => !prev);
      setMenuVisible(false);
      // Clear messages when blocked
      if (!isBlocked) {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleReport = async () => {
    try {
      // In a real app, you would make an API call here
      setMenuVisible(false);
      // Show confirmation
      alert('Usuario reportado. Revisaremos el caso lo antes posible.');
    } catch (error) {
      console.error('Error reporting user:', error);
    }
  };

  const sendMessage = () => {
    if (message.trim() && !isBlocked) {
      const newMessage = {
        id: Date.now().toString(),
        text: message,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString().slice(0, 5)
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerContent}>
          <IconButton
            icon="arrow-left"
            iconColor="white"
            size={24}
            onPress={() => router.back()}
            style={styles.backButton}
          />
          <Pressable 
            style={styles.userInfo}
            onPress={() => router.push({
              pathname: '/(tabs)/profile',
              params: { userId: params.id }
            })}
          >            <Image 
              source={{ uri: params.avatar as string }}
              style={styles.avatar}
            />
            <View style={styles.userTextInfo}>
              <Text style={styles.userName}>{params.name}</Text>
              {params.subtitle && (
                <Text style={styles.userStatus}>{params.subtitle}</Text>
              )}
            </View>
          </Pressable>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                iconColor="white"
                size={24}
                onPress={() => setMenuVisible(true)}
              />
            }
            contentStyle={styles.menuContent}
          >
            <Menu.Item 
              onPress={() => {
                setMenuVisible(false);
                handleBlock();
              }} 
              title={isBlocked ? "Desbloquear usuario" : "Bloquear usuario"}
              leadingIcon="block"
              titleStyle={styles.menuItemText}
            />
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                handleReport();
              }}
              title="Reportar"
              leadingIcon="flag"
              titleStyle={[styles.menuItemText, styles.reportText]}
            />
          </Menu>
        </View>
        <View style={styles.divider} />
      </SafeAreaView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >          {messages.map((msg) => (            <View key={msg.id} style={[
                styles.messageWrapper,
                msg.sender === 'me' && { alignSelf: 'flex-end' }
              ]}>
              <View 
                style={[
                  styles.messageBubble,
                  msg.sender === 'me' ? styles.myMessage : styles.otherMessage
                ]}
              >
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
              <View style={[styles.messageInfo, msg.sender === 'me' ? styles.myMessageInfo : styles.otherMessageInfo]}>
                <Text style={styles.timestamp}>{msg.timestamp}</Text>
                {msg.sender === 'me' && (
                  <Ionicons 
                    name="checkmark-done" 
                    size={14} 
                    color="rgba(255,255,255,0.5)" 
                  />
                )}
              </View>
            </View>
          ))}
          {isBlocked && (
            <View style={styles.blockedMessageContainer}>
              <MaterialIcons name="block" size={24} color="rgba(255,255,255,0.6)" />
              <Text style={styles.blockedMessageText}>Has bloqueado a este usuario</Text>
            </View>
          )}
        </ScrollView>        {!isBlocked ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Mensaje"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <Pressable 
              style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
              onPress={sendMessage}
            >
              <Ionicons name="send" size={20} color="white" />
            </Pressable>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#000',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SCREEN_WIDTH * 0.02,
    height: SCREEN_WIDTH * 0.14,
  },
  backButton: {
    margin: 0,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SCREEN_WIDTH * 0.02,
  },
  avatar: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_WIDTH * 0.1,
    borderRadius: SCREEN_WIDTH * 0.05,
  },
  userTextInfo: {
    marginLeft: SCREEN_WIDTH * 0.03,
  },
  userName: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: '600',
  },
  userStatus: {
    color: '#7A9AEC',
    fontSize: SCREEN_WIDTH * 0.032,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  menuContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    marginTop: 45,
  },
  menuItemText: {
    color: 'white',
  },
  reportText: {
    color: '#ff4444',
  },
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: SCREEN_WIDTH * 0.04,
    gap: SCREEN_WIDTH * 0.02,
  },  messageWrapper: {
    maxWidth: '75%',
    marginVertical: 1,
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: SCREEN_WIDTH * 0.025,
    borderRadius: SCREEN_WIDTH * 0.02,
  },
  myMessage: {
    backgroundColor: '#7A9AEC',
    borderBottomRightRadius: SCREEN_WIDTH * 0.005,
  },
  otherMessage: {
    backgroundColor: '#2a2a2a',
    borderBottomLeftRadius: SCREEN_WIDTH * 0.005,
  },
  messageText: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.038,
    lineHeight: SCREEN_WIDTH * 0.052,
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 2,
    marginTop: 2,
  },
  myMessageInfo: {
    alignSelf: 'flex-end',
  },
  otherMessageInfo: {
    alignSelf: 'flex-start',
  },
  timestamp: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: SCREEN_WIDTH * 0.028,
  },  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingVertical: SCREEN_WIDTH * 0.02,
    marginTop: -SCREEN_WIDTH * 0.02,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.038,
    maxHeight: SCREEN_WIDTH * 0.25,
    paddingHorizontal: SCREEN_WIDTH * 0.035,
    paddingVertical: SCREEN_WIDTH * 0.02,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: SCREEN_WIDTH * 0.02,
  },
  sendButton: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_WIDTH * 0.1,
    borderRadius: SCREEN_WIDTH * 0.05,
    backgroundColor: '#7A9AEC',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SCREEN_WIDTH * 0.02,
  },
  blockedMessageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SCREEN_WIDTH * 0.06,
    flexDirection: 'row',
    gap: SCREEN_WIDTH * 0.02,
  },
  blockedMessageText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: SCREEN_WIDTH * 0.035,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
