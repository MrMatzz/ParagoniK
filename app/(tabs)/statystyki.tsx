import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../contexts/UserContext';

export default function StatystykiScreen() {
  const { theme, isDarkMode, expenses } = useUser();
  const [activeTab, setActiveTab] = useState('Dzień');

  const tabs = ['Dzień', 'Tydzień', 'Miesiąc', 'Rok'];

  const chartData = [
    { day: 'Pn', value: 60 },
    { day: 'Wt', value: 105 },
    { day: 'Śr', value: 150 },
    { day: 'Czw', value: 120 },
    { day: 'Pt', value: 130 },
    { day: 'Sob', value: 45 },
    { day: 'Ndz', value: 105 },
  ];
  const Y_MAX = 180;
  const yAxisLabels = [180, 160, 140, 120, 100, 80, 60, 40, 20];

  const getCategoryTotal = (catName: string) => {
    return expenses
      .filter((e: any) => e.category.toLowerCase() === catName.toLowerCase())
      .reduce((sum: number, e: any) => sum + Number(e.amount), 0)
      .toFixed(2);
  };

  const categories = [
    { name: 'Medycyna', amount: getCategoryTotal('Medycyna'), icon: 'pill', lib: 'mci', color: '#F44336', bg: '#FFEBEE' },
    { name: 'Rozrywka', amount: getCategoryTotal('Rozrywka'), icon: 'gamepad-variant-outline', lib: 'mci', color: '#9C27B0', bg: '#F3E5F5' },
    { name: 'Jedzenie', amount: getCategoryTotal('Jedzenie'), icon: 'fast-food-outline', lib: 'ion', color: '#FF9800', bg: '#FFF3E0' },
    { name: 'Edukacja', amount: getCategoryTotal('Edukacja'), icon: 'school-outline', lib: 'ion', color: '#2196F3', bg: '#E3F2FD' }
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <Text style={[styles.pageTitle, { color: theme.text }]}>Statystyki</Text>

        <View style={[styles.tabContainer, { backgroundColor: isDarkMode ? '#1C1C1E' : '#E5E5EA' }]}>
          {tabs.map((tab) => (
            <TouchableOpacity 
              key={tab} 
              style={[
                styles.tabButton, 
                activeTab === tab && { backgroundColor: isDarkMode ? '#FFFFFF' : '#000000' }
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText, 
                { color: activeTab === tab ? (isDarkMode ? '#000' : '#FFF') : theme.textSecondary }
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.chartWrapper}>
          <Text style={[styles.yAxisTitle, { color: theme.text }]}>Zł</Text>
          
          <View style={styles.chartMainArea}>
            <View style={styles.yAxis}>
              {yAxisLabels.map((val) => (
                <View key={val} style={styles.yAxisTickContainer}>
                  <Text style={[styles.yAxisLabel, { color: theme.text }]}>{val}</Text>
                  <View style={[styles.yAxisTickMark, { backgroundColor: theme.text }]} />
                </View>
              ))}
              <View style={[styles.yAxisLine, { backgroundColor: theme.text }]} />
              <Ionicons name="caret-up" size={14} color={theme.text} style={styles.yAxisArrow} />
            </View>

            <View style={styles.barsContainer}>
              {chartData.map((item, index) => {
                const heightPercent = (item.value / Y_MAX) * 100;
                return (
                  <View key={index} style={styles.barCol}>
                    <View style={[styles.bar, { height: `${heightPercent}%`, backgroundColor: '#CFCFCF' }]} />
                  </View>
                );
              })}
              <View style={[styles.xAxisLine, { backgroundColor: theme.text }]} />
              <Ionicons name="caret-forward" size={14} color={theme.text} style={styles.xAxisArrow} />
            </View>
          </View>

          <View style={styles.xAxisLabelsContainer}>
            {chartData.map((item, index) => (
              <Text key={index} style={[styles.xAxisLabel, { color: theme.text }]}>
                {item.day}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.gridContainer}>
          {categories.map((cat, index) => (
            <View key={index} style={[styles.card, { backgroundColor: isDarkMode ? '#1C1C1E' : '#E5E5EA' }]}>
              
              <View style={[styles.iconWrapper, { backgroundColor: isDarkMode ? cat.bg + '20' : cat.bg }]}>
                {cat.lib === 'ion' ? (
                  <Ionicons name={cat.icon as any} size={24} color={cat.color} />
                ) : (
                  <MaterialCommunityIcons name={cat.icon as any} size={24} color={cat.color} />
                )}
              </View>

              <Text style={[styles.categoryName, { color: theme.text }]}>{cat.name}</Text>
              
              <View style={styles.cardBottomRow}>
                <View style={[styles.zlBadge, { backgroundColor: isDarkMode ? '#333' : '#000' }]}>
                  <Text style={styles.zlBadgeText}>Zł</Text>
                </View>
                <Text style={[styles.amount, { color: theme.text }]}>{cat.amount}</Text>
              </View>

            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 110 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  tabContainer: { flexDirection: 'row', borderRadius: 12, padding: 4, marginBottom: 30 },
  tabButton: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabText: { fontSize: 14, fontWeight: '600' },
  chartWrapper: { marginBottom: 30, paddingRight: 10 },
  yAxisTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: -10, marginLeft: 5, zIndex: 10 },
  chartMainArea: { flexDirection: 'row', height: 180, marginTop: 15 },
  yAxis: { width: 35, justifyContent: 'space-between', position: 'relative', paddingVertical: 5 },
  yAxisTickContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', height: 20 },
  yAxisLabel: { fontSize: 10, marginRight: 4 },
  yAxisTickMark: { width: 4, height: 1 },
  yAxisLine: { position: 'absolute', right: 0, top: 0, bottom: -1, width: 1 },
  yAxisArrow: { position: 'absolute', right: -6.5, top: -10 },
  barsContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', position: 'relative', paddingLeft: 5, paddingBottom: 1 },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' },
  bar: { width: '70%', borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  xAxisLine: { position: 'absolute', left: 0, right: -10, bottom: 0, height: 1 },
  xAxisArrow: { position: 'absolute', right: -15, bottom: -6.5 },
  xAxisLabelsContainer: { flexDirection: 'row', paddingLeft: 40, marginTop: 5 },
  xAxisLabel: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', borderRadius: 16, padding: 15, marginBottom: 15 },
  iconWrapper: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  categoryName: { fontSize: 15, fontWeight: 'bold', marginBottom: 15 },
  cardBottomRow: { flexDirection: 'row', alignItems: 'center' },
  zlBadge: { paddingHorizontal: 6, paddingVertical: 4, borderRadius: 4, marginRight: 8 },
  zlBadgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  amount: { fontSize: 16, fontWeight: '500' },
});