import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../contexts/UserContext';

export default function BudgetScreen() {
  const router = useRouter();
  const { theme } = useUser();
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  const generateInviteLink = async () => {
    setShowInviteModal(true);
    setIsLoading(true);
    setInviteLink('');

    try {
      const response = await fetch('http://192.168.0.73:3000/api/budget/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          budgetId: 'family-123',
          role: 'member'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setInviteLink(`paragonik.app/invite/${data.inviteCode}`);
      } else {
        setInviteLink('Błąd serwera');
      }
    } catch (error) {
      setInviteLink('Brak połączenia z serwerem');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (inviteLink && !inviteLink.includes('Brak') && !inviteLink.includes('Błąd')) {
      Alert.alert("Skopiowano", "Link zaproszenia został skopiowany do schowka.");
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Budżet rodzinny</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={[styles.mainCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <View style={styles.cardLeft}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Kto ile wydał w kwietniu</Text>
            <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>Łącznie wydatki :</Text>
            <Text style={styles.cardAmount}>5 000 Zł</Text>
          </View>
          <View style={styles.fakePieChart}>
            <View style={styles.pieSegmentRed} />
            <View style={styles.pieSegmentBlue} />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Członkowie rodzinny</Text>
          <TouchableOpacity style={styles.addBtn} onPress={generateInviteLink}>
            <Ionicons name="person-add-outline" size={16} color="#4A90E2" style={styles.addBtnIcon} />
            <Text style={styles.addBtnText}>Dodaj osobę</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.listCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <View style={[styles.listItem, { borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
            <Text style={[styles.listName, { color: theme.text }]}>Anna Kowalska</Text>
            <View style={styles.listRight}>
              <Text style={[styles.listAmount, { color: '#9067C6' }]}>2 700 Zł</Text>
              <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
            </View>
          </View>
          <View style={[styles.listItem, { borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
            <Text style={[styles.listName, { color: theme.text }]}>Marcin Kowalski</Text>
            <View style={styles.listRight}>
              <Text style={[styles.listAmount, { color: '#FF6B6B' }]}>1 500 Zł</Text>
              <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
            </View>
          </View>
          <View style={styles.listItem}>
            <Text style={[styles.listName, { color: theme.text }]}>Janek Kowalski</Text>
            <View style={styles.listRight}>
              <Text style={[styles.listAmount, { color: '#4FC3F7' }]}>800 Zł</Text>
              <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Ostatnie wydatki</Text>
          <TouchableOpacity>
            <Text style={styles.addBtnText}>Zobacz wszystkie</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.listCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <View style={[styles.listItem, { borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
            <View style={styles.expenseLeft}>
              <View style={[styles.expenseIcon, { backgroundColor: theme.border }]} />
              <Text style={[styles.listName, { color: theme.text }]}>Zakupy w Lidl</Text>
            </View>
            <Text style={[styles.expenseAmount, { color: theme.text }]}>- 155 Zł</Text>
          </View>
          <View style={[styles.listItem, { borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
            <View style={styles.expenseLeft}>
              <View style={[styles.expenseIcon, { backgroundColor: theme.border }]} />
              <Text style={[styles.listName, { color: theme.text }]}>Obiad w restauracji</Text>
            </View>
            <Text style={[styles.expenseAmount, { color: theme.text }]}>- 75 Zł</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.expenseLeft}>
              <View style={[styles.expenseIcon, { backgroundColor: theme.border }]} />
              <Text style={[styles.listName, { color: theme.text }]}>Paliwo</Text>
            </View>
            <Text style={[styles.expenseAmount, { color: theme.text }]}>- 60 Zł</Text>
          </View>
        </View>

      </ScrollView>

      <Modal visible={showInviteModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setShowInviteModal(false)}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>

            <Text style={[styles.modalTitle, { color: theme.text }]}>Zaproś do budżetu</Text>
            <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
              Zeskanuj kod QR lub wyślij link znajomemu, aby wspólnie zarządzać wydatkami.
            </Text>

            <View style={styles.qrContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#000066" style={{ height: 150, justifyContent: 'center' }} />
              ) : (
                <Ionicons name="qr-code" size={150} color="#000" />
              )}
            </View>

            <View style={[styles.linkBox, { backgroundColor: theme.iconBg, borderColor: theme.border }]}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#4A90E2" style={{ flex: 1, alignItems: 'flex-start' }} />
              ) : (
                <Text style={[styles.linkText, { color: theme.textSecondary }]} numberOfLines={1}>
                  {inviteLink}
                </Text>
              )}
              <TouchableOpacity style={styles.copyBtn} onPress={handleCopyLink} disabled={isLoading}>
                <Ionicons name="copy-outline" size={22} color={isLoading ? theme.textSecondary : "#4A90E2"} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.shareBtn, isLoading && { backgroundColor: theme.border }]} 
              onPress={handleCopyLink}
              disabled={isLoading}
            >
              <Text style={styles.shareBtnText}>Udostępnij link</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 25 },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  mainCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderRadius: 12, borderWidth: 1, marginBottom: 30 },
  cardLeft: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '600', marginBottom: 15 },
  cardSubtitle: { fontSize: 12, marginBottom: 10 },
  cardAmount: { fontSize: 24, fontWeight: 'bold', color: '#32CD32' },
  fakePieChart: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#9067C6', overflow: 'hidden', position: 'relative' },
  pieSegmentRed: { position: 'absolute', top: 0, left: 0, width: 45, height: 45, backgroundColor: '#FF8A80' },
  pieSegmentBlue: { position: 'absolute', top: 0, right: 0, width: 45, height: 45, backgroundColor: '#4FC3F7' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  addBtn: { flexDirection: 'row', alignItems: 'center', padding: 5 },
  addBtnIcon: { marginRight: 5 },
  addBtnText: { color: '#4A90E2', fontSize: 13, fontWeight: '500' },
  listCard: { borderRadius: 12, borderWidth: 1, overflow: 'hidden', marginBottom: 25 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
  listName: { fontSize: 15 },
  listRight: { flexDirection: 'row', alignItems: 'center' },
  listAmount: { fontSize: 15, fontWeight: '600', marginRight: 10 },
  expenseLeft: { flexDirection: 'row', alignItems: 'center' },
  expenseIcon: { width: 20, height: 20, borderRadius: 10, marginRight: 15 },
  expenseAmount: { fontSize: 15, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', borderRadius: 24, padding: 25, alignItems: 'center', position: 'relative' },
  closeModalBtn: { position: 'absolute', top: 15, right: 15, padding: 10, zIndex: 1 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 10, marginBottom: 10, textAlign: 'center' },
  modalSubtitle: { fontSize: 14, textAlign: 'center', marginBottom: 25, lineHeight: 22 },
  qrContainer: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 20, marginBottom: 25, minWidth: 190, alignItems: 'center' },
  linkBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, paddingVertical: 14, width: '100%', marginBottom: 20 },
  linkText: { flex: 1, fontSize: 15, marginRight: 10 },
  copyBtn: { padding: 5 },
  shareBtn: { backgroundColor: '#000066', paddingVertical: 16, width: '100%', borderRadius: 12, alignItems: 'center' },
  shareBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});