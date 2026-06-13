import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
// Важно: добавили Image в импорты из react-native
import { Alert, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../contexts/UserContext';

export default function ManualEntryScreen() {
  const router = useRouter();
  const { theme, isDarkMode, expenses, setExpenses } = useUser();

  const [amount, setAmount] = useState(''); 
  const [selectedCategory, setSelectedCategory] = useState(''); 
  const [place, setPlace] = useState('');

  const [date, setDate] = useState(new Date()); 
  const [showDatePicker, setShowDatePicker] = useState(false); 
  const [dateText, setDateText] = useState(''); 

  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeText, setTimeText] = useState('');

  const [imageUri, setImageUri] = useState<string | null>(null);

  const BRAND_GREEN = '#1DB954';

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      setDateText(`${year}-${month}-${day}`); 
    }
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
      const hours = String(selectedTime.getHours()).padStart(2, '0');
      const minutes = String(selectedTime.getMinutes()).padStart(2, '0');
      setTimeText(`${hours}:${minutes}`);
    }
  };

  const handleSave = () => {
    if (!amount || !selectedCategory) {
      Alert.alert("Błąd", "Podaj kwotę i wybierz kategorię przed zapisaniem.");
      return;
    }

    const newExpense = {
      id: Date.now().toString(),
      amount: parseFloat(amount.replace(',', '.')), 
      shop: place || "Inne", 
      category: selectedCategory,
      date: dateText || new Date().toISOString().split('T')[0],
      image: imageUri // Добавили сохранение пути к картинке в историю расходов
    };

    setExpenses([...expenses, newExpense]);

    Alert.alert('Sukces', 'Wydatek został zapisany!', [
      { 
        text: 'OK', 
        onPress: () => {
          router.push('/wydatki');
        }
      }
    ]);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };
  
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={28} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Wprowadź ręcznie{'\n'}wydatki</Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>Kwota</Text>
            <View style={[styles.inputContainer, { borderColor: theme.border, backgroundColor: theme.cardBg }]}>
              <Ionicons name="cash-outline" size={24} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput 
                style={[styles.input, { color: theme.text }]} 
                placeholder="0,00" 
                placeholderTextColor={theme.textSecondary} 
                keyboardType="numeric"
                value={amount} 
                onChangeText={setAmount} 
              />
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: '600' }}>Zł</Text>
            </View>
            <View style={styles.quickAmounts}>
              {['10', '15', '30', '35'].map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.amountChip, { borderColor: BRAND_GREEN, backgroundColor: theme.iconBg }]} 
                  onPress={() => setAmount(item)}
                >
                  <Text style={[styles.amountChipText, { color: BRAND_GREEN }]}>{item} zł</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>Kategoria</Text>
            
            <View style={styles.categoryContainer}>
              <View style={styles.categoryColumn}>
                {[
                  { id: 'Medycyna', icon: 'pills', IconProv: FontAwesome5, bg: '#FFD6D6', border: '#FF5C5C', size: 16 },
                  { id: 'Jedzenie', icon: 'coffee-outline', IconProv: MaterialCommunityIcons, bg: '#FFF5CC', border: '#F4D03F', size: 18 },
                  { id: 'Edukacja', icon: 'graduation-cap', IconProv: FontAwesome5, bg: '#D6FFEB', border: '#2ECC71', size: 14 },
                  { id: 'Kosmetyki', icon: 'brush', IconProv: MaterialCommunityIcons, bg: '#FFD6F5', border: '#FF6BEB', size: 18 },
                ].map((item) => {
                  const isSelected = selectedCategory === item.id;
                  return (
                    <TouchableOpacity 
                      key={item.id}
                      style={[
                        styles.categoryBtn, 
                        { 
                          backgroundColor: item.bg,
                          borderColor: item.border,
                          borderWidth: isSelected ? 2 : 1,
                          opacity: selectedCategory ? (isSelected ? 1 : 0.4) : 1 
                        }
                      ]} 
                      onPress={() => setSelectedCategory(item.id)}
                    >
                      <item.IconProv name={item.icon} size={item.size} color="#000" style={styles.catIcon}/>
                      <Text style={[styles.categoryBtnText, { color: '#000' }]}>{item.id}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={[styles.verticalDivider, { backgroundColor: theme.border }]} />

              <View style={styles.categoryColumn}>
                {[
                  { id: 'Rachunki', icon: 'receipt-outline', IconProv: Ionicons, bg: '#D6EAF8', border: '#3498DB', size: 16 },
                  { id: 'Transport', icon: 'car-outline', IconProv: Ionicons, bg: '#FDEBD0', border: '#F39C12', size: 18 },
                  { id: 'Rozrywka', icon: 'ticket-outline', IconProv: Ionicons, bg: '#E8DAEF', border: '#9B59B6', size: 18 },
                  { id: 'Inne', icon: 'person-outline', IconProv: Ionicons, bg: '#D6EAF8', border: '#3498DB', size: 16 },
                ].map((item) => {
                  const isSelected = selectedCategory === item.id;
                  return (
                    <TouchableOpacity 
                      key={item.id}
                      style={[
                        styles.categoryBtn, 
                        { 
                          backgroundColor: item.bg,
                          borderColor: item.border,
                          borderWidth: isSelected ? 2 : 1,
                          opacity: selectedCategory ? (isSelected ? 1 : 0.4) : 1 
                        }
                      ]} 
                      onPress={() => setSelectedCategory(item.id)}
                    >
                      <item.IconProv name={item.icon as any} size={item.size} color="#000" style={styles.catIcon}/>
                      <Text style={[styles.categoryBtnText, { color: '#000' }]}>{item.id}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>Miejsce</Text>
            <View style={[styles.inputContainer, { borderColor: theme.border, backgroundColor: theme.cardBg }]}>
              <Ionicons name="location-outline" size={24} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput style={[styles.input, { color: theme.text }]} placeholder="Np. Biedronka" placeholderTextColor={theme.textSecondary} value={place} onChangeText={setPlace} />
            </View>
          </View>

          <View style={styles.rowSection}>
            <View style={[styles.section, { flex: 1, marginRight: 10 }]}>
              <Text style={[styles.label, { color: theme.text }]}>Data</Text>
              <TouchableOpacity style={[styles.inputContainer, { borderColor: theme.border, backgroundColor: theme.cardBg }]} onPress={() => setShowDatePicker(true)}>
                <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                <Text style={[styles.input, !dateText && { color: theme.textSecondary }, dateText && { color: theme.text }]}>{dateText ? dateText : "Dziś"}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                Platform.OS === 'ios' ? (
                  <Modal transparent={true} animationType="fade" visible={showDatePicker}>
                    <View style={styles.modalContainer}>
                      <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
                        <DateTimePicker value={date} mode="date" display="inline" themeVariant={isDarkMode ? "dark" : "light"} onChange={onChangeDate} />
                        <TouchableOpacity style={[styles.modalButton, { backgroundColor: BRAND_GREEN }]} onPress={() => setShowDatePicker(false)}><Text style={styles.modalButtonText}>Gotowe</Text></TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                ) : (
                  <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />
                )
              )}
            </View>

            <View style={[styles.section, { flex: 1, marginLeft: 10 }]}>
              <Text style={[styles.label, { color: theme.text }]}>Godzina</Text>
              <TouchableOpacity style={[styles.inputContainer, { borderColor: theme.border, backgroundColor: theme.cardBg }]} onPress={() => setShowTimePicker(true)}>
                <Ionicons name="time-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                <Text style={[styles.input, !timeText && { color: theme.textSecondary }, timeText && { color: theme.text }]}>{timeText ? timeText : "Teraz"}</Text>
                <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
              {showTimePicker && (
                Platform.OS === 'ios' ? (
                  <Modal transparent={true} animationType="fade" visible={showTimePicker}>
                    <View style={styles.modalContainer}>
                      <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
                        <DateTimePicker value={time} mode="time" display="spinner" themeVariant={isDarkMode ? "dark" : "light"} onChange={onChangeTime} />
                        <TouchableOpacity style={[styles.modalButton, { backgroundColor: BRAND_GREEN }]} onPress={() => setShowTimePicker(false)}><Text style={styles.modalButtonText}>Gotowe</Text></TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                ) : (
                  <DateTimePicker value={time} mode="time" display="default" onChange={onChangeTime} />
                )
              )}
            </View>
          </View>

          {/* ОБНОВЛЕННЫЙ БЛОК С ФОТО */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>Dodaj zdjęcie paragonu</Text>
            
            {imageUri ? (
              <TouchableOpacity onPress={pickImage} style={{ marginTop: 5, alignItems: 'center' }}>
                <Image 
                  source={{ uri: imageUri }} 
                  style={{ width: '100%', height: 200, borderRadius: 12, resizeMode: 'cover' }} 
                />
                <Text style={{ color: theme.textSecondary, marginTop: 8 }}>Kliknij zdjęcie, aby zmienić</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.uploadBox, { borderColor: BRAND_GREEN, backgroundColor: isDarkMode ? theme.iconBg : 'rgba(29, 185, 84, 0.05)' }]}
                onPress={pickImage}
              >
                <Ionicons name="camera-outline" size={32} color={BRAND_GREEN} />
                <Text style={[styles.uploadText, { color: BRAND_GREEN }]}>Dodaj zdjęcie</Text>
                <Text style={[styles.uploadSubtext, { color: theme.textSecondary }]}>PNG, JPG do 10 MB</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={[styles.saveButton, { backgroundColor: BRAND_GREEN }]} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Zapisz wydatek</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  section: { marginBottom: 20 },
  rowSection: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, height: 50 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, paddingVertical: 0 },
  quickAmounts: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  amountChip: { borderWidth: 1, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  amountChipText: { fontWeight: '600' },
  categoryContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  categoryColumn: { flex: 1 },
  verticalDivider: { width: 1, marginHorizontal: 15 },
  categoryBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: 'transparent' },
  catIcon: { marginRight: 10, width: 20, textAlign: 'center' },
  categoryBtnText: { fontSize: 14, fontWeight: 'bold' },
  uploadBox: { borderWidth: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingVertical: 25, borderStyle: 'dashed' },
  uploadText: { fontSize: 16, fontWeight: '500', marginTop: 8 },
  uploadSubtext: { fontSize: 12, marginTop: 4 },
  saveButton: { paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { margin: 20, borderRadius: 20, padding: 20, alignItems: 'center' },
  modalButton: { marginTop: 15, paddingVertical: 10, paddingHorizontal: 40, borderRadius: 10 },
  modalButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});