import { CareerItem } from '@/types/career';
import React, { useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type CareerModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (item: CareerItem) => void;
  onDelete?: () => void;
  color: string;
  initialValues?: CareerItem;
  isEditing?: boolean;
};

export default function CareerModal({ 
  visible, 
  onClose, 
  onSave,
  onDelete, 
  color,
  initialValues,
  isEditing
}: CareerModalProps) {
  const [year, setYear] = useState(initialValues?.year || '');
  const [university, setUniversity] = useState(initialValues?.university || '');
  const [universityAcronym, setUniversityAcronym] = useState(initialValues?.universityAcronym || '');
  const [degree, setDegree] = useState(initialValues?.degree || '');
  const [achievement, setAchievement] = useState(initialValues?.achievement || '');
  const [description, setDescription] = useState(initialValues?.description || '');

  const handleSave = () => {
    if (year && university && universityAcronym && degree && achievement) {
      onSave({ 
        year, 
        university,
        universityAcronym,
        degree,
        achievement,
        description 
      });
      setYear('');
      setUniversity('');
      setUniversityAcronym('');
      setDegree('');
      setAchievement('');
      setDescription('');
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {isEditing ? 'Editar experiencia académica' : 'Nueva experiencia académmica'}
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Año</Text>
            <TextInput
              style={[styles.input, { borderColor: color }]}
              value={year}
              onChangeText={setYear}
              placeholder="Ej: 2025"
              placeholderTextColor="rgba(255,255,255,0.4)"
              keyboardType="numeric"
              maxLength={4}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Universidad</Text>
            <TextInput
              style={[styles.input, { borderColor: color }]}
              value={university}
              onChangeText={setUniversity}
              placeholder="Ej: Universidad Politécnica de Catalunya"
              placeholderTextColor="rgba(255,255,255,0.4)"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Acrónimo Universidad</Text>
            <TextInput
              style={[styles.input, { borderColor: color }]}
              value={universityAcronym}
              onChangeText={setUniversityAcronym}
              placeholder="Ej: UPC"
              placeholderTextColor="rgba(255,255,255,0.4)"
              autoCapitalize="characters"
              maxLength={10}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Título o Grado</Text>
            <TextInput
              style={[styles.input, { borderColor: color }]}
              value={degree}
              onChangeText={setDegree}
              placeholder="Ej: Grado en Ingeniería Informática"
              placeholderTextColor="rgba(255,255,255,0.4)"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Logro o Especialización</Text>
            <TextInput
              style={[styles.input, { borderColor: color }]}
              value={achievement}
              onChangeText={setAchievement}
              placeholder="Ej: Especialización en Software y Mobile"
              placeholderTextColor="rgba(255,255,255,0.4)"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea, { borderColor: color }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe tu experiencia..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>          <View style={styles.buttonContainer}>
            {isEditing && (
              <Pressable 
                style={[styles.button, styles.deleteButton]} 
                onPress={() => {
                  onDelete?.();
                  onClose();
                }}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </Pressable>
            )}
            <View style={styles.rightButtons}>
              <Pressable 
                style={[styles.button, styles.cancelButton]} 
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>
              <Pressable 
                style={[styles.button, styles.saveButton, { backgroundColor: color }]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>{isEditing ? 'Actualizar' : 'Guardar'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: '#1A1A1A',
    borderRadius: SCREEN_WIDTH * 0.03,
    padding: SCREEN_WIDTH * 0.05,
  },
  modalTitle: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: '600',
    marginBottom: SCREEN_WIDTH * 0.04,
  },
  inputContainer: {
    marginBottom: SCREEN_WIDTH * 0.04,
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: SCREEN_WIDTH * 0.035,
    marginBottom: SCREEN_WIDTH * 0.02,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderRadius: SCREEN_WIDTH * 0.02,
    padding: SCREEN_WIDTH * 0.03,
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.035,
  },
  textArea: {
    minHeight: SCREEN_WIDTH * 0.2,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SCREEN_WIDTH * 0.03,
    marginTop: SCREEN_WIDTH * 0.02,
  },
  button: {
    paddingVertical: SCREEN_WIDTH * 0.025,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    borderRadius: SCREEN_WIDTH * 0.015,
    minWidth: SCREEN_WIDTH * 0.2,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },  buttonText: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.035,
    fontWeight: '600',
  },
  rightButtons: {
    flexDirection: 'row',
    gap: SCREEN_WIDTH * 0.03,
  },
  deleteButton: {
    backgroundColor: '#DC3545',
    marginRight: 'auto',
  }
});