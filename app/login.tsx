import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../contexts/UserContext';

export default function LoginScreen() {
  const router = useRouter();
  const { theme, isDarkMode, setUserData } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const BRAND_BLUE = '#000066';

  const handleLogin = async () => {
    // 1. Проверяем заполненность полей
    if (!email || !password) {
      Alert.alert('Błąd', 'Proszę wpisać e-mail i hasło.');
      return;
    }

    // 2. Отправляем запрос авторизации к бэкенду
    try {
      const response = await fetch('http://192.168.0.73:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        // Подставляем данные успешного пользователя в контекст приложения
        setUserData({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          birthDate: '20.08.1991', // Заглушки, если в БД пока нет этих полей
          gender: 'Mężczyzna'
        });

        // Перенаправляем в основную систему
        router.replace('/(tabs)');
      } else {
        Alert.alert('Błąd logowania', data.message);
      }
    } catch (error) {
      Alert.alert('Błąd serwera', 'Brak połączenia z bazą danych.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          
          <Text style={[styles.title, { color: theme.text }]}>Witaj ponownie!</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Zaloguj się do swojego konta</Text>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>E-Mail</Text>
            <View style={[styles.inputContainer, { borderColor: theme.border, backgroundColor: theme.cardBg }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Wprowadź swój e-mail"
                placeholderTextColor={theme.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Hasło</Text>
            <View style={[styles.inputContainer, { borderColor: theme.border, backgroundColor: theme.cardBg }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Wprowadź swoje hasło"
                placeholderTextColor={theme.textSecondary}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Zapomniałeś hasła?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.loginBtn, { backgroundColor: BRAND_BLUE }]} onPress={handleLogin}>
            <Text style={styles.loginBtnText}>Zaloguj się</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.textSecondary }]}>lub</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>

          <TouchableOpacity style={[styles.socialBtn, { borderColor: theme.border, backgroundColor: theme.cardBg }]}>
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text style={[styles.socialBtnText, { color: theme.text }]}>Zaloguj się przez Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialBtn, { borderColor: theme.border, backgroundColor: theme.cardBg }]}>
            <Ionicons name="logo-apple" size={22} color={isDarkMode ? '#FFF' : '#000'} />
            <Text style={[styles.socialBtnText, { color: theme.text }]}>Zaloguj się przez Apple</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Nie masz jeszcze konta? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.registerText}>Zarejestruj się</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { paddingHorizontal: 25, paddingTop: 60, paddingBottom: 40, flexGrow: 1, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 40 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '500', marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, height: 50, paddingHorizontal: 15 },
  input: { flex: 1, fontSize: 14 },
  eyeIcon: { padding: 5 },
  forgotPassword: { textAlign: 'right', color: '#000066', fontSize: 11, fontWeight: 'bold', marginTop: 8 },
  loginBtn: { height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  loginBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 15, fontSize: 14 },
  socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 8, height: 50, marginBottom: 15 },
  socialBtnText: { fontSize: 13, fontWeight: '600', marginLeft: 10 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  registerText: { color: '#000066', fontSize: 12, fontWeight: 'bold' },
});