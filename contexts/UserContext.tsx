import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext<any>(null);

const lightTheme = {
  background: '#FAFAFA',
  text: '#1A1A1A',
  textSecondary: '#666666',
  border: '#E8E8E8',
  iconBg: '#F0F0FF',
  cardBg: '#FFFFFF',
};

const darkTheme = {
  background: '#121212',
  text: '#FFFFFF',
  textSecondary: '#A9A9A9',
  border: '#2C2C2E',
  iconBg: '#1C1C1E',
  cardBg: '#1C1C1E',
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState({
    name: 'Jan Kowalski',
    email: 'jan.kowalski@email.com',
    phone: '+48 484 848 48',
    birthDate: '20.08.1991',
    gender: 'Mężczyzna'
  });

  const [expenses, setExpenses] = useState([
    { id: '1', amount: 340, category: 'Jedzenie', shop: 'Biedronka', date: '2024-04-10' },
    { id: '2', amount: 280, category: 'Medycyna', shop: 'Apteka', date: '2024-04-11' },
    { id: '3', amount: 165, category: 'Rozrywka', shop: 'Kino', date: '2024-04-12' },
    { id: '4', amount: 220, category: 'Edukacja', shop: 'Empik', date: '2024-04-12' }
  ]);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedExpenses = await AsyncStorage.getItem('@paragonik_expenses');
        if (savedExpenses !== null) {
          setExpenses(JSON.parse(savedExpenses));
        }
      } catch (error) {
        console.error('Błąd ładowania wydatków:', error);
      } finally {
        setIsDataLoaded(true);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      const saveData = async () => {
        try {
          await AsyncStorage.setItem('@paragonik_expenses', JSON.stringify(expenses));
        } catch (error) {
          console.error('Błąd zapisu wydatków:', error);
        }
      };
      saveData();
    }
  }, [expenses, isDataLoaded]);

  return (
    <UserContext.Provider value={{ 
      userData, setUserData, 
      isDarkMode, setIsDarkMode, 
      theme,
      expenses, setExpenses
    }}>
      {isDataLoaded ? children : null}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);