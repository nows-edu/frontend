import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect from the / path to the /home path
  return <Redirect href="/home" />;
}