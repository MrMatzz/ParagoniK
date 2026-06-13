import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../contexts/UserContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { theme } = useUser();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const BRAND_BLUE = '#000066';

  const handleRegister = async () => {
    // 1. Sprawdzamy, czy wszystkie pola są wypełnione
    if (!name || !email || !phone || !password) {
      Alert.alert('Błąd', 'Proszę wypełnić wszystkie pola.');
      return;
    }

    // 2. Sprawdzamy, czy hasła są takie same
    if (password !== confirmPassword) {
      Alert.alert('Błąd', 'Hasła nie pasują do siebie.');
      return;
    }

    // 3. Wysyłamy dane do bazy
    try {
      const response = await fetch('http://192.168.0.73:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, password })
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Sukces!', 'Konto zostało utworzone.', [
          { text: 'Zaloguj się', onPress: () => router.replace('/login') }
        ]);
      } else {
        Alert.alert('Błąd rejestracji', data.message);
      }
    } catch (error) {
      Alert.alert('Błąd serwera', 'Brak połączenia z bazą danych.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Rejestracja</Text>
            <View style={{ width: 24 }} />
          </View>

          <Text style={[styles.title, { color: theme.text }]}>Zaczynajmy</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Wygląda na to, że jesteś tu nowy.{'\n'}Skonfigurujmy Twój profil.
          </Text>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Imię i nazwisko</Text>
            <View style={[styles.inputContainer, { borderColor: theme.border, backgroundColor: theme.cardBg }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="np. Anna Kowalska"
                placeholderTextColor={theme.textSecondary}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>E-Mail</Text>
            <View style={[styles.inputContainer, { borderColor: theme.border, backgroundColor: theme.cardBg }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="np. Anna.Kowalska@gmail.com"
                placeholderTextColor={theme.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Telefon</Text>
            <View style={[styles.inputContainer, { borderColor: theme.border, backgroundColor: theme.cardBg }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="np. +48 484 848 48"
                placeholderTextColor={theme.textSecondary}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Hasło</Text>
            <View style={[styles.inputContainer, { borderColor: theme.border, backgroundColor: theme.cardBg }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Wprowadź hasło"
                placeholderTextColor={theme.textSecondary}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Potwierdź Hasło</Text>
            <View style={[styles.inputContainer, { borderColor: theme.border, backgroundColor: theme.cardBg }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Powtórz hasło"
                placeholderTextColor={theme.textSecondary}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={[styles.registerBtn, { backgroundColor: BRAND_BLUE }]} onPress={handleRegister}>
            <Text style={styles.registerBtnText}>Zarejestruj się</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { paddingHorizontal: 25, paddingTop: 10, paddingBottom: 40, flexGrow: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 13, lineHeight: 18, marginBottom: 25 },
  formGroup: { marginBottom: 15 },
  label: { fontSize: 12, fontWeight: '500', marginBottom: 6 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, height: 48, paddingHorizontal: 15 },
  input: { flex: 1, fontSize: 14 },
  eyeIcon: { padding: 5 },
  registerBtn: { height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  registerBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});