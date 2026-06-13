import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../contexts/UserContext';

function ProfileOption({ icon, title, rightElement, isDestructive, theme, onPress }: any) {
  return (
    <TouchableOpacity 
      style={[styles.optionContainer, { borderBottomColor: theme.border }]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.optionLeft}>
        <View style={[styles.iconWrapper, { backgroundColor: theme.iconBg }]}>
          <Ionicons name={icon} size={22} color={isDestructive ? '#FF3B30' : theme.text} />
        </View>
        <Text style={[styles.optionTitle, { color: isDestructive ? '#FF3B30' : theme.text }]}>
          {title}
        </Text>
      </View>
      {rightElement ? rightElement : <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />}
    </TouchableOpacity>
  );
}

export default function ProfilScreen() {
  const router = useRouter();
  const { userData, isDarkMode, setIsDarkMode, theme } = useUser();

  const handleLogout = () => {
    Alert.alert('Wyloguj się', 'Czy na pewno chcesz wylogować się z konta?', [
      { text: 'Anuluj', style: 'cancel' },
      { 
        text: 'Wyloguj', 
        style: 'destructive',
        onPress: () => {
          router.replace('/login');
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.header}>
          <View style={[styles.avatarPlaceholder, { borderColor: theme.border, backgroundColor: theme.iconBg }]}>
            <Ionicons name="person" size={50} color={theme.textSecondary} />
          </View>
          
          <Text style={[styles.userName, { color: theme.text }]}>{userData.name}</Text>
          <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{userData.email}</Text>

          <TouchableOpacity style={styles.editButton} onPress={() => router.push('/my_profile')}>
            <Text style={styles.editButtonText}>Edytuj profil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Ustawienia aplikacji</Text>
          <ProfileOption icon="cash-outline" title="Waluta (PLN)" theme={theme} />
          <ProfileOption icon="notifications-outline" title="Powiadomienia" theme={theme} />

          <ProfileOption 
            icon={isDarkMode ? "moon" : "moon-outline"} 
            title="Motyw (Ciemny)" 
            theme={theme}
            rightElement={
              <Switch
                value={isDarkMode}
                onValueChange={(value) => setIsDarkMode(value)}
                trackColor={{ false: '#767577', true: '#00D4FF' }}
                thumbColor="#FFF"
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Zarządzanie danymi</Text>
          <ProfileOption 
            icon="people-outline" 
            title="Budżet rodzinny" 
            theme={theme} 
            onPress={() => router.push('/budget')} 
          />
          <ProfileOption icon="document-text-outline" title="Eksportuj raporty (PDF/CSV)" theme={theme} />
          <ProfileOption icon="trash-outline" title="Wyczyść historię" isDestructive={true} theme={theme} />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Inne</Text>
          <ProfileOption icon="help-circle-outline" title="Pomoc i wsparcie" theme={theme} />
          
          {/* Добавили вызов handleLogout при нажатии на кнопку выхода */}
          <ProfileOption 
            icon="log-out-outline" 
            title="Wyloguj się" 
            isDestructive={true} 
            theme={theme} 
            onPress={handleLogout} 
          />
        </View>

        <Text style={[styles.versionText, { color: theme.textSecondary }]}>Wersja aplikacji 1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  userName: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  userEmail: { fontSize: 14, marginBottom: 15 },
  editButton: { backgroundColor: '#000066', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
  editButtonText: { color: 'white', fontWeight: '600', fontSize: 14 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', marginBottom: 10, letterSpacing: 0.5 },
  optionContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1 },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  optionTitle: { fontSize: 16, fontWeight: '500' },
  versionText: { textAlign: 'center', fontSize: 12, marginTop: 10, marginBottom: 20 },
});