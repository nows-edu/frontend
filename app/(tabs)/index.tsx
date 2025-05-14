import TopBar from '@/components/Home/TopBar';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  // Ejemplo de datos para el TopBar
  const exampleFilterOptions: string[] = ['Populares', 'Nuevos', 'Cercanos', 'Favoritos'];
  const exampleSelectedOptions: string[] = ['Populares', 'Nuevos'];
  
  const handleOptionToggle = (option: string) => {
    console.log('Opción seleccionada:', option);
  };

  const handleSearchPress = () => {
    console.log('Búsqueda presionada');
  };

  const handleNotificationsPress = () => {
    console.log('Notificaciones presionadas');
  };

  return (
    <TopBar
      points={1250}
      filterOptions={exampleFilterOptions}
      selectedOptions={exampleSelectedOptions}
      onOptionToggle={handleOptionToggle}
      onSearchPress={handleSearchPress}
      onNotificationsPress={handleNotificationsPress}
    />
  );
}

const styles = StyleSheet.create({
  // Mantener estilos vacíos por si necesitas agregar más adelante
});
