# ParagoniK

ParagoniK to nowoczesna, inteligentna aplikacja do śledzenia wydatków, stworzona przy użyciu React Native i Node.js. Eliminuje problem ręcznego wprowadzania danych, wykorzystując sztuczną inteligencję Google Gemini do automatycznego wyodrębniania danych z paragonów (nazwa sklepu, dokładna kwota i kategoria) bezpośrednio ze zdjęć.

## Kluczowe funkcje

* **Skaner paragonów AI:** Zrób zdjęcie paragonu lub wybierz je z galerii. Backend aplikacji łączy się z Gemini AI, aby błyskawicznie przeanalizować dane i przypisać wydatek do odpowiedniej kategorii.
* **Szybkie wprowadzanie ręczne:** Uproszczony interfejs do wprowadzania codziennych wydatków gotówkowych, zawierający przyciski szybkiego wyboru kwot oraz estetyczne, oznaczone kolorami kategorie.
* **Zapis danych offline:** Cała historia finansowa jest bezpiecznie przechowywana w pamięci urządzenia za pomocą `AsyncStorage`. Twoje dane zostają z Tobą, nawet bez połączenia z internetem.
* **Intuicyjne gesty:** Pomyłka przy dodawaniu? Po prostu przesuń palcem w lewo na dowolnym wydatku w historii, aby płynnie go usunąć.
* **Dynamiczne motywy:** Pełne wsparcie dla trybu jasnego i ciemnego, automatycznie dostosowujące się do preferencji systemowych użytkownika.
* **Reakcja haptyczna:** Uczucie obcowania z aplikacją premium dzięki delikatnym wibracjom (`expo-haptics`) podczas interakcji z kluczowymi elementami interfejsu.

## Technologie

**Frontend (Aplikacja mobilna)**
* React Native & Expo (Expo Router)
* TypeScript
* `react-native-gesture-handler` (Usuwanie gestem przesunięcia)
* `@react-native-async-storage/async-storage` (Lokalna baza danych)
* `expo-camera`, `expo-image-picker`, `expo-image-manipulator` (Obsługa multimediów)

**Backend (API)**
* Node.js & Express
* `@google/generative-ai` (Integracja z modelem Gemini)
* `multer` (Obsługa przesyłania plików)

## Jak uruchomić lokalnie

1. Sklonuj repozytorium.
2. Zainstaluj zależności:
```bash
   npm install
```
1. Uruchom serwer deweloperski Expo:
```bash
 npx expo start -c
```
Zeskanuj kod QR za pomocą aplikacji Expo Go na swoim fizycznym urządzeniu.

* Stworzone jako inteligentne rozwiązanie do zarządzania finansami osobistymi.
