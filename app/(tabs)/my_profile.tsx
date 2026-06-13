import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../contexts/UserContext';

export default function MyProfileScreen() {
  const router = useRouter();
  const { userData, setUserData, theme } = useUser(); 

  const [name, setName] = useState(userData.name);
  const [birthDate, setBirthDate] = useState(userData.birthDate);
  const [gender, setGender] = useState(userData.gender);
  const [email, setEmail] = useState(userData.email);
  const [phone, setPhone] = useState(userData.phone);

  const handleSave = () => {
    setUserData({
      name: name,
      birthDate: birthDate,
      gender: gender,
      email: email,
      phone: phone
    });

    Alert.alert(
      "Sukces", 
      "Twoje dane zostały pomyślnie zaktualizowane.", 
      [
        { text: "OK", onPress: () => router.back() } 
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={theme.text}/>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Mój profil</Text>
          <View style={{ width: 28 }}/>
        </View>

        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: theme.iconBg }]}>
            <Ionicons name="person" size={60} color={theme.textSecondary}/>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Dane Bazowe</Text>
          
          <Text style={[styles.label, { color: theme.textSecondary }]}>Imię i nazwisko</Text>
          <TextInput 
            style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.cardBg }]} 
            value={name} 
            onChangeText={setName} 
          />

          <Text style={[styles.label, { color: theme.textSecondary }]}>data urodzenia</Text>
          <View style={[styles.inputContainer, { borderColor: theme.border, backgroundColor: theme.cardBg }]}>
            <TextInput 
              style={[styles.inputFlex, { color: theme.text }]} 
              value={birthDate} 
              onChangeText={setBirthDate}
            />
            <Ionicons name="chevron-down" size={20} color={theme.textSecondary} style={styles.inputIcon}/>
          </View>

          <Text style={[styles.label, { color: theme.textSecondary }]}>płeć</Text>
          <View style={styles.genderRow}>
            <TouchableOpacity 
              style={[
                styles.genderBtn, 
                { borderColor: theme.border, backgroundColor: theme.cardBg },
                gender === 'Mężczyzna' && { borderColor: theme.text }
              ]} 
              onPress={() => setGender('Mężczyzna')} 
            >
              <Text style={[styles.genderText, { color: theme.text }]}>Mężczyzna</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.genderBtn, 
                { borderColor: theme.border, backgroundColor: theme.cardBg },
                gender === 'Kobieta' && { borderColor: theme.text }
              ]} 
              onPress={() => setGender('Kobieta')} 
            >
              <Text style={[styles.genderText, { color: theme.text }]}>Kobieta</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Dane Kontaktowe</Text>
          
          <Text style={[styles.label, { color: theme.textSecondary }]}>E-Mail</Text>
          <TextInput 
            style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.cardBg }]} 
            value={email} 
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={[styles.label, { color: theme.textSecondary }]}>Telefon</Text>
          <TextInput 
            style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.cardBg }]} 
            value={phone} 
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Zapisz zmiany</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  avatarContainer: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
  label: { fontSize: 14, marginBottom: 5 },
  input: { borderWidth: 1, borderRadius: 4, paddingHorizontal: 12, height: 45, fontSize: 16, marginBottom: 15 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 4, height: 45, marginBottom: 15 },
  inputFlex: { flex: 1, paddingHorizontal: 12, fontSize: 16 },
  inputIcon: { paddingRight: 10 },
  genderRow: { flexDirection: 'row', justifyContent: 'space-between' },
  genderBtn: { flex: 1, borderWidth: 1, borderRadius: 4, height: 45, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 },
  genderText: { fontSize: 16 },
  saveButton: { backgroundColor: '#000066', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 10, marginBottom: 20 },
  saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});