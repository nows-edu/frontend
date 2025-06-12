import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AmbassadorCTA() {
  const [modalVisible, setModalVisible] = useState(false);

  const benefits = [
    'Eventos privados exclusivos',
    'Certificado oficial de embajador',
    'Visibilidad ante estudiantes y empresas',
    'Red de contactos universitaria',
    'Acceso a descuentos especiales'
  ];

  const responsibilities = [
    'Compartir tu experiencia universitaria',
    'Crear contenido relevante',
    'Participar en eventos ocasionales',
    'Mantener una actitud positiva'
  ];

  return (
    <View style={styles.container}>
      <View style={styles.warningIcon}>
        <MaterialIcons name="campaign" size={24} color="#FFD700" />
      </View>
      
      <Text style={styles.title}>¡Conviértete en embajador/a!</Text>
      
      <View style={styles.bulletPoints}>
        {benefits.slice(0, 3).map((benefit, index) => (
          <View key={index} style={styles.bulletPoint}>
            <MaterialIcons name="check-circle" size={16} color="#7A9AEC" />
            <Text style={styles.bulletText}>{benefit}</Text>
          </View>
        ))}
      </View>      <Button 
        mode="contained"
        onPress={() => setModalVisible(true)}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={{ color: 'white' }}
      >
        Más información
      </Button>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Programa de Embajadores</Text>
            
            <Text style={styles.sectionTitle}>Beneficios</Text>
            {benefits.map((benefit, index) => (
              <View key={index} style={styles.modalBulletPoint}>
                <MaterialIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.modalBulletText}>{benefit}</Text>
              </View>
            ))}

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Responsabilidades</Text>
            {responsibilities.map((responsibility, index) => (
              <View key={index} style={styles.modalBulletPoint}>
                <MaterialIcons name="check" size={16} color="#7A9AEC" />
                <Text style={styles.modalBulletText}>{responsibility}</Text>
              </View>
            ))}

            <View style={styles.modalButtons}>
              <Button 
                mode="outlined" 
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
                textColor="white"
              >
                Cerrar
              </Button>
              <Button 
                mode="contained"
                onPress={() => {
                  setModalVisible(false);
                  // TODO: Implementar formulario de solicitud
                }}
                style={[styles.modalButton, styles.applyButton]}
              >
                Solicitar
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({  container: {
    width: '100%',
    padding: SCREEN_WIDTH * 0.04,
    marginTop: -SCREEN_WIDTH * 0.04,
    marginBottom: SCREEN_WIDTH * 0.02,
  },
  warningIcon: {
    position: 'absolute',
    top: SCREEN_WIDTH * 0.04,
    right: SCREEN_WIDTH * 0.04,
  },
  title: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: 'bold',
    marginBottom: SCREEN_WIDTH * 0.03,
  },
  bulletPoints: {
    marginBottom: SCREEN_WIDTH * 0.03,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SCREEN_WIDTH * 0.02,
  },
  bulletText: {
    color: 'white',
    marginLeft: SCREEN_WIDTH * 0.02,
    fontSize: SCREEN_WIDTH * 0.035,
  },  button: {
    marginTop: SCREEN_WIDTH * 0.02,
    backgroundColor: '#7A9AEC',
    borderRadius: SCREEN_WIDTH * 0.015,
  },
  buttonContent: {
    height: SCREEN_WIDTH * 0.1,
    paddingHorizontal: SCREEN_WIDTH * 0.02,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.85,
    backgroundColor: '#1A1A1A',
    borderRadius: SCREEN_WIDTH * 0.03,
    padding: SCREEN_WIDTH * 0.05,
  },
  modalTitle: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.05,
    fontWeight: 'bold',
    marginBottom: SCREEN_WIDTH * 0.04,
  },
  sectionTitle: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: '600',
    marginBottom: SCREEN_WIDTH * 0.02,
  },
  modalBulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SCREEN_WIDTH * 0.02,
  },
  modalBulletText: {
    color: 'white',
    marginLeft: SCREEN_WIDTH * 0.02,
    fontSize: SCREEN_WIDTH * 0.035,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SCREEN_WIDTH * 0.04,
    gap: SCREEN_WIDTH * 0.02,
  },
  modalButton: {
    minWidth: SCREEN_WIDTH * 0.25,
  },
  applyButton: {
    backgroundColor: '#7A9AEC',
  },
});