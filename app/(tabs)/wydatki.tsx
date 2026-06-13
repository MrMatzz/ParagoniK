import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../contexts/UserContext';

export default function WydatkiScreen() {
  const router = useRouter();
  const { theme, isDarkMode, expenses, setExpenses } = useUser();
  const params = useLocalSearchParams();

  const [isModalVisible, setModalVisible] = useState(false);

  const [amount, setAmount] = useState('');
  const [shop, setShop] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);

  const BRAND_GREEN = '#1DB954';

  useEffect(() => {
    if (params.amount || params.shop || params.imageUri) {
      setAmount(params.amount as string || '');
      setShop(params.shop as string || '');
      setCategory(params.category as string || '');
      setDate(params.date as string || '');
      setReceiptImage(params.imageUri as string || null);
      
      setModalVisible(true);
      
      router.setParams({ amount: '', shop: '', category: '', date: '', imageUri: '' });
    }
  }, [params]);

  const handleSave = () => {
    if (!amount || !shop || !category) {
      Alert.alert('Błąd', 'Proszę wypełnić wszystkie pola');
      return;
    }
    
    const newExpense = {
      id: Date.now().toString(),
      amount: parseFloat(amount.replace(',', '.')),
      shop: shop,
      category: category,
      date: date || new Date().toISOString().split('T')[0]
    };

    setExpenses([...expenses, newExpense]);
    
    setAmount('');
    setShop('');
    setCategory('');
    setDate('');
    setReceiptImage(null);
    setModalVisible(false);
  };

  const openManualAdd = () => {
    setAmount('');
    setShop('');
    setCategory('');
    setDate('');
    setReceiptImage(null);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter((item: any) => item.id !== id));
  };

  const getCategoryIcon = (catName: string) => {
    const name = catName.toLowerCase();
    if (name.includes('medycyna')) return { icon: 'pill', lib: 'mci', color: '#F44336', bg: '#FFEBEE' };
    if (name.includes('rozrywka')) return { icon: 'gamepad-variant-outline', lib: 'mci', color: '#9C27B0', bg: '#F3E5F5' };
    if (name.includes('jedzenie')) return { icon: 'fast-food-outline', lib: 'ion', color: '#FF9800', bg: '#FFF3E0' };
    if (name.includes('edukacja')) return { icon: 'school-outline', lib: 'ion', color: '#2196F3', bg: '#E3F2FD' };
    return { icon: 'cart-outline', lib: 'ion', color: '#757575', bg: '#EEEEEE' };
  };

  const sortedExpenses = [...expenses].reverse();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      
      <View style={styles.header}>
        <Text style={[styles.pageTitle, { color: theme.text }]}>Historia wydatków</Text>
        <TouchableOpacity style={styles.addIconBtn} onPress={openManualAdd}>
          <Ionicons name="add-circle" size={36} color={BRAND_GREEN} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {sortedExpenses.length === 0 ? (
          <Text style={{ color: theme.textSecondary, textAlign: 'center', marginTop: 50 }}>
            Brak historii wydatków. Zeskanuj swój pierwszy paragon!
          </Text>
        ) : (
          sortedExpenses.map((item) => {
            const catStyle = getCategoryIcon(item.category);
            return (
              <Swipeable
                key={item.id}
                containerStyle={styles.swipeableContainer}
                renderRightActions={() => (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Ionicons name="trash-outline" size={28} color="white" />
                  </TouchableOpacity>
                )}
              >
                <View style={[styles.expenseItem, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                  
                  <View style={styles.itemLeft}>
                    <View style={[styles.iconWrapper, { backgroundColor: isDarkMode ? catStyle.bg + '20' : catStyle.bg }]}>
                      {catStyle.lib === 'ion' ? (
                        <Ionicons name={catStyle.icon as any} size={24} color={catStyle.color} />
                      ) : (
                        <MaterialCommunityIcons name={catStyle.icon as any} size={24} color={catStyle.color} />
                      )}
                    </View>
                    <View>
                      <Text style={[styles.shopName, { color: theme.text }]}>{item.shop}</Text>
                      <Text style={[styles.categoryDate, { color: theme.textSecondary }]}>
                        {item.category} • {item.date}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.expenseAmount, { color: theme.text }]}>
                    - {Number(item.amount).toFixed(2)} Zł
                  </Text>

                </View>
              </Swipeable>
            );
          })
        )}
      </ScrollView>

      <Modal visible={isModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalSafeArea, { backgroundColor: theme.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalBtn}>
              <Text style={[styles.closeModalText, { color: theme.textSecondary }]}>Anuluj</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Nowy wydatek</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView contentContainerStyle={styles.modalScroll}>
            {receiptImage && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: receiptImage }} style={styles.receiptPreview} />
              </View>
            )}

            <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Kwota (Zł)</Text>
                <TextInput
                  style={[styles.input, { color: theme.text, backgroundColor: theme.iconBg, borderColor: theme.border }]}
                  placeholder="0.00"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                  value={amount.toString()}
                  onChangeText={setAmount}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Sklep / Miejsce</Text>
                <TextInput
                  style={[styles.input, { color: theme.text, backgroundColor: theme.iconBg, borderColor: theme.border }]}
                  placeholder="np. Biedronka"
                  placeholderTextColor={theme.textSecondary}
                  value={shop}
                  onChangeText={setShop}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Kategoria</Text>
                <TextInput
                  style={[styles.input, { color: theme.text, backgroundColor: theme.iconBg, borderColor: theme.border }]}
                  placeholder="np. Jedzenie"
                  placeholderTextColor={theme.textSecondary}
                  value={category}
                  onChangeText={setCategory}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Data</Text>
                <TextInput
                  style={[styles.input, { color: theme.text, backgroundColor: theme.iconBg, borderColor: theme.border }]}
                  placeholder="RRRR-MM-DD"
                  placeholderTextColor={theme.textSecondary}
                  value={date}
                  onChangeText={setDate}
                />
              </View>

              <TouchableOpacity style={[styles.saveButton, { backgroundColor: BRAND_GREEN }]} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Zapisz wydatek</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  pageTitle: { fontSize: 28, fontWeight: 'bold' },
  addIconBtn: { padding: 5 },
  
  container: { paddingHorizontal: 20, paddingBottom: 110 },
  
  swipeableContainer: { marginBottom: 15 },
  expenseItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 16, borderWidth: 1 },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: { width: 46, height: 46, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  shopName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  categoryDate: { fontSize: 13 },
  expenseAmount: { fontSize: 16, fontWeight: 'bold' },
  
  deleteButton: { backgroundColor: '#FF3B30', justifyContent: 'center', alignItems: 'center', width: 80, borderRadius: 16, marginLeft: 10 },

  modalSafeArea: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#E8E8E8' },
  closeModalBtn: { paddingVertical: 5, paddingRight: 15 },
  closeModalText: { fontSize: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  modalScroll: { padding: 20 },
  
  imageContainer: { width: '100%', height: 120, borderRadius: 12, overflow: 'hidden', marginBottom: 20 },
  receiptPreview: { width: '100%', height: '100%', resizeMode: 'cover' },
  card: { padding: 20, borderRadius: 16, borderWidth: 1 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { height: 50, borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, fontSize: 16 },
  saveButton: { height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});