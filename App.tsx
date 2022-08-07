import { NativeBaseProvider, StatusBar } from 'native-base';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

import { Routes } from './src/routes';
import { Loading } from './src/screens/components/Loading';

import { THEME } from './src/screens/styles/theme';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });
  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar 
      barStyle="light-content"
      backgroundColor="transparent"
      translucent
      />

      {fontsLoaded ? <Routes /> : <Loading />}
    </NativeBaseProvider>

  );
}

