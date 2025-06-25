import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Dimensions, Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Divider, RadioButton, Text, useTheme } from 'react-native-paper';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = Math.min(120, SCREEN_WIDTH * 0.3); // 30% of screen width, max 120px
const BANNER_HEIGHT = IMAGE_SIZE * 0.6; // 80% of image size
const TEXT_CENTER_OFFSET = SCREEN_WIDTH * 0.35; // Punto de centrado del texto
const MAX_TEXT_WIDTH = SCREEN_WIDTH * 0.5; // Ancho máximo para el texto

/**
 * ProfileBanner component
 */
type ProfileBannerProps = {
  statusText?: string;
  statusColor?: string;
  onStatusChange?: (status: string, color: string) => void;
  imageUri?: string;
  onImageChange?: (uri: string) => void;
  isEditable?: boolean;
};

export default function ProfileBanner(props: ProfileBannerProps) {
  const {
    statusText = '',
    statusColor = 'rgb(88, 101, 242)',
    onStatusChange = () => {},
    imageUri = '',
    onImageChange = () => {},
    isEditable = true
  } = props;
  const theme = useTheme();
  const [editVisible, setEditVisible] = useState(false);
  const [tempStatus, setTempStatus] = useState(statusText);
  const [tempColor, setTempColor] = useState(statusColor);

  // Actualizar estado temporal cuando cambien las props
  React.useEffect(() => {
    setTempStatus(statusText);
    setTempColor(statusColor);
  }, [statusText, statusColor]);
  const presetColors = [
    'rgb(88, 101, 242)',   // Azul Discord
    'rgb(250, 38, 38)',    // Rojo
    'rgb(53, 36, 230)',    // Verde
    'rgb(250, 179, 226)'   // Rosa
  ];
  const presetStatuses = ['Estudiante', 'Aura', 'Imparable', 'No molestar'];

  const openImagePicker = async () => {
    if (!isEditable) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      onImageChange(result.assets[0].uri);
    }
  };

  const handleBannerPress = () => {
    if (isEditable) {
      setEditVisible(true);
    }
  };

  return (
    <View style={styles.container}>      <TouchableOpacity 
        style={[styles.banner, { backgroundColor: statusColor }]} 
        onPress={handleBannerPress}
        disabled={!isEditable}
      >        
        <Text style={styles.statusText}>{statusText.toUpperCase()}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.imageWrapper} 
        onPress={openImagePicker}
        disabled={!isEditable}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.surfaceVariant }]} />
        )}
      </TouchableOpacity>

      {isEditable && (
        <Modal visible={editVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
              <Text variant="titleMedium" style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
                Editar estado
              </Text>
              <Divider />            <View>
                {presetStatuses.map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={styles.optionRow}
                    onPress={() => setTempStatus(status)}
                  >
                    <RadioButton
                      value={status}
                      status={tempStatus === status ? 'checked' : 'unchecked'}
                      onPress={() => setTempStatus(status)}
                    />
                    <Text style={{ color: theme.colors.onSurface }}>{status}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text variant="titleMedium" style={[styles.modalTitle, { marginTop: 16, color: theme.colors.onSurface }]}>
                Color de fondo
              </Text>
              <Divider />
              <View style={styles.colorsRow}>
                {presetColors.map(color => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorDot,
                      { backgroundColor: color },
                      tempColor === color && styles.colorDotSelected
                    ]}
                    onPress={() => setTempColor(color)}
                  />
                ))}
              </View>
              <View style={styles.modalButtons}>
                <Button
                  onPress={() => setEditVisible(false)}
                  textColor={theme.colors.onSurface}
                >
                  Cancelar
                </Button>              <Button
                  mode="contained"
                  onPress={() => {
                    if (tempStatus !== statusText || tempColor !== statusColor) {
                      onStatusChange(tempStatus, tempColor);
                    }
                    setEditVisible(false);
                  }}
                >
                  Guardar
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({  container: {
    width: '100%',
    height: BANNER_HEIGHT * 0.75, // Reducimos la altura del contenedor
    position: 'relative',
    marginTop: IMAGE_SIZE * 0.5,
  },
  banner: {
    width: '100%',
    height: BANNER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -BANNER_HEIGHT * 0.5
  },
  statusText: {
    position: 'absolute',
    left: SCREEN_WIDTH * 0.13,
    transform: [
      { skewX: '-10deg' }
    ],
    color: 'white',
    fontSize: BANNER_HEIGHT * 0.4,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 0.5,
    maxWidth: MAX_TEXT_WIDTH,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  imageWrapper: {
    position: 'absolute',
    right: 20,
    top: -IMAGE_SIZE * 0.5, // Mantenemos la posición original de la imagen
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'white',
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.85,
    maxWidth: 400,
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  colorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  colorDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 8,
  },
});
