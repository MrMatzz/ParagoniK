import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image, PanResponder,
  ScrollView,
  StyleSheet, Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useUser } from '../../contexts/UserContext';

export default function SkanujScreen() {
  const router = useRouter();
  const { theme } = useUser();
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  // Возвращаем старый добрый хук из 54 SDK
  const isFocused = useIsFocused();
  const cameraRef = useRef<CameraView>(null);
  
  const [photo, setPhoto] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [frameSize, setFrameSize] = useState({ width: 280, height: 400 });
  const currentFrameSize = useRef(frameSize);
  const initialDistance = useRef(0);
  const initialSize = useRef({ width: 280, height: 400 });

  const BRAND_GREEN = '#1DB954'; 

  useEffect(() => {
    currentFrameSize.current = frameSize;
  }, [frameSize]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => evt.nativeEvent.touches.length === 2,
      onMoveShouldSetPanResponder: (evt) => evt.nativeEvent.touches.length === 2,
      onPanResponderGrant: (evt) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length === 2) {
          const dx = touches[0].pageX - touches[1].pageX;
          const dy = touches[0].pageY - touches[1].pageY;
          initialDistance.current = Math.sqrt(dx * dx + dy * dy);
          initialSize.current = currentFrameSize.current;
        }
      },
      onPanResponderMove: (evt) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length === 2 && initialDistance.current > 0) {
          const dx = touches[0].pageX - touches[1].pageX;
          const dy = touches[0].pageY - touches[1].pageY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const scale = distance / initialDistance.current;

          let newWidth = initialSize.current.width * scale;
          let newHeight = initialSize.current.height * scale;

          newWidth = Math.max(150, Math.min(350, newWidth));
          newHeight = Math.max(150, Math.min(650, newHeight));

          setFrameSize({ width: newWidth, height: newHeight });
        }
      },
      onPanResponderRelease: () => {
        initialDistance.current = 0;
      },
    })
  ).current;

  useEffect(() => {
    if (!isFocused) {
      setIsCameraActive(false);
      setPhoto(null);
      setBase64Image(null);
    }
  }, [isFocused]);

  const handleOpenCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert("Błąd", "Potrzebujemy dostępu do kamery.");
        return;
      }
    }
    setIsCameraActive(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync({ quality: 1 });
        if (!photoData) return;

        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;
        const frameX = (screenWidth - frameSize.width) / 2;
        const frameY = (screenHeight - frameSize.height) / 2;

        const xPercent = frameX / screenWidth;
        const yPercent = frameY / screenHeight;
        const widthPercent = frameSize.width / screenWidth;
        const heightPercent = frameSize.height / screenHeight;

        const imgWidth = photoData.width;
        const imgHeight = photoData.height;

        const croppedImage = await ImageManipulator.manipulateAsync(
          photoData.uri,
          [
            {
              crop: {
                originX: xPercent * imgWidth,
                originY: yPercent * imgHeight,
                width: widthPercent * imgWidth,
                height: heightPercent * imgHeight,
              },
            },
          ],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );

        setPhoto(croppedImage.uri);
        setBase64Image(croppedImage.base64 || null);
      } catch (error) {
        Alert.alert("Błąd", "Nie udało się zrobić i przyciąć zdjęcia.");
      }
    }
  };

const handleSaveAndImport = async () => {
    if (!photo) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setIsAnalyzing(true);

    try {
      const response = await fetch('http://192.168.0.73:3000/api/receipt/analyze', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify({ imageBase64: base64Image })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        router.push({
          pathname: '/wydatki',
          params: { 
            imageUri: photo,
            shop: result.data.shop,
            amount: result.data.amount,
            category: result.data.category,
            date: result.data.date
          }
        });
      } else {
        throw new Error(result.message || 'Błąd serwera API');
      }
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      console.error("Błąd sieci/API:", error);
      Alert.alert("Błąd serwera", `Nie udało się połączyć z agentem AI.\nSzczegóły: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
      setPhoto(null);
      setBase64Image(null);
      setIsCameraActive(false);
    }
  };

  if (photo) {
    return (
      <View style={styles.cameraContainer}>
        <Image source={{ uri: photo }} style={styles.camera} resizeMode="contain" />
        
        {isAnalyzing && (
          <View style={styles.analyzingOverlay}>
            <ActivityIndicator size="large" color={BRAND_GREEN} />
            <Text style={styles.analyzingText}>Analizowanie paragonu...</Text>
          </View>
        )}

        <View style={styles.previewControls}>
          <TouchableOpacity style={styles.previewButton} onPress={() => setPhoto(null)} disabled={isAnalyzing}>
            <Ionicons name="trash-outline" size={36} color={isAnalyzing ? "#666" : "white"} />
            <Text style={[styles.previewText, { color: isAnalyzing ? "#666" : "white" }]}>Odrzuć</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.previewButton} onPress={handleSaveAndImport} disabled={isAnalyzing}>
            <Ionicons name="checkmark-circle-outline" size={36} color={isAnalyzing ? "#666" : BRAND_GREEN} />
            <Text style={[styles.previewText, { color: isAnalyzing ? "#666" : BRAND_GREEN }]}>Analizuj i Importuj</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isCameraActive && isFocused) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={StyleSheet.absoluteFillObject} facing="back" ref={cameraRef} />
        
        <View style={[StyleSheet.absoluteFillObject, styles.cameraOverlay]} {...panResponder.panHandlers}>
          <View style={styles.overlayTop}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsCameraActive(false)}>
              <Ionicons name="close-circle" size={40} color="white" />
            </TouchableOpacity>
          </View>

          <View style={[styles.overlayMiddle, { height: frameSize.height }]}>
            <View style={styles.overlaySide} />
            <View style={[styles.scanFrame, { width: frameSize.width, borderColor: BRAND_GREEN }]} />
            <View style={styles.overlaySide} />
          </View>

          <View style={styles.overlayBottom}>
            <Text style={styles.scanInstruction}>
              Umieść paragon w ramce{'\n'}(Użyj dwóch palców, aby zmienić rozmiar)
            </Text>
            <View style={styles.shutterContainer}>
              <TouchableOpacity style={styles.shutterButton} onPress={takePicture}>
                <View style={[styles.shutterInner, { backgroundColor: BRAND_GREEN }]} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.content, { backgroundColor: theme.background }]}>
      <Text style={[styles.welcomeText, {color: theme.text}]}>Witamy w aplikacji</Text>
      <Text style={[styles.brandName, { color: BRAND_GREEN }]}>ParagoniK</Text>
      <Text style={[styles.description, { color: theme.textSecondary }]}>
        Skanuj paragony, kontroluj wydatki i oszczędzaj czas oraz pieniądze, mając wszystko w jednym miejscu.
      </Text>
      
      <View style={styles.scanSection}>
        <TouchableOpacity style={[styles.scanBox, { backgroundColor: BRAND_GREEN }]} onPress={handleOpenCamera}>
          <Ionicons name="camera-outline" size={70} color="white" />
        </TouchableOpacity>
        <Text style={[styles.scanTitle, { color: theme.text }]}>Zeskanuj paragon</Text>
        
        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          <Text style={[styles.orText, { color: theme.textSecondary }]}>lub</Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
        </View>

        <TouchableOpacity style={[styles.manualButton, { borderColor: BRAND_GREEN }]} onPress={() => router.push('/manual')}>
          <Text style={[styles.manualButtonText, { color: BRAND_GREEN }]}>Wprowadź ręcznie wydatki</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cameraContainer: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1 },
  cameraOverlay: { backgroundColor: 'transparent' },
  overlayTop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'flex-end', paddingTop: 50, paddingRight: 20 },
  overlayMiddle: { flexDirection: 'row' },
  overlaySide: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  scanFrame: { borderWidth: 2, borderRadius: 15, backgroundColor: 'transparent' },
  overlayBottom: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'flex-end' },
  scanInstruction: { color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 30, textAlign: 'center' },
  closeButton: {},
  shutterContainer: { alignItems: 'center', marginBottom: 90 },
  shutterButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255, 255, 255, 0.3)', justifyContent: 'center', alignItems: 'center' },
  shutterInner: { width: 60, height: 60, borderRadius: 30 },
  previewControls: { position: 'absolute', bottom: 70, width: '100%', flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(0,0,0,0.8)', paddingVertical: 20, paddingHorizontal: 20 },
  previewButton: { alignItems: 'center' },
  previewText: { fontSize: 16, marginTop: 5, fontWeight: 'bold' },
  
  analyzingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  analyzingText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginTop: 15 },

  content: { alignItems: 'center', paddingHorizontal: 30, paddingTop: 60, paddingBottom: 110, flexGrow: 1 },
  welcomeText: { fontSize: 18, fontWeight: '500', marginBottom: 5 },
  brandName: { fontSize: 36, fontWeight: 'bold', marginBottom: 25 },
  description: { textAlign: 'center', lineHeight: 22, marginBottom: 40, fontSize: 15 },
  scanSection: { alignItems: 'center', width: '100%' },
  scanBox: { width: 140, height: 140, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  scanTitle: { fontSize: 18, fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: 30 },
  dividerLine: { flex: 1, height: 1 },
  orText: { marginHorizontal: 15, fontSize: 16, fontWeight: '500' },
  manualButton: { paddingVertical: 15, paddingHorizontal: 30, borderRadius: 8, width: '100%', alignItems: 'center', borderWidth: 1, backgroundColor: 'transparent' },
  manualButtonText: { fontSize: 16, fontWeight: '500' },
});