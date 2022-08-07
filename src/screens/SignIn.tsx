import { useState } from 'react';
import { Alert } from 'react-native';
import { VStack, Heading, Icon, useTheme } from 'native-base';
import { Envelope, Key, User } from 'phosphor-react-native';
import auth from '@react-native-firebase/auth';

import Logo from '../screens/assets/logo_primary.svg';

import { Input } from './components/Input';
import { Button } from './components/Button';
import { useNavigation } from '@react-navigation/native';

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { colors } = useTheme();
    const navigation = useNavigation();

    function handleSignIn() {
        if (!email || !password) {
            return Alert.alert('Entrar', 'Informe e-mail e senha');
        }

        setIsLoading(true);

        auth()
        .signInWithEmailAndPassword(email, password)
        .catch((error) => {
            console.log(error);
            setIsLoading(false);

            if(error.code === 'auth/invalid-email'){
                return Alert.alert('Entrar', 'E-mail inválido.');
            }

            if(error.code === 'auth/wrong-password'){
                return Alert.alert('Entrar', 'E-mail ou senha inválidos.');
            }

            if(error.code === 'auth/user-not-found'){
                return Alert.alert('Entrar', 'E-mail ou senha inválidos.');
            }

            return Alert.alert('Entrar', 'Não foi possível acessar');
        });
    }

    function handleGoSignUp() {
        navigation.navigate('signUp');
      }

    return (
        <VStack flex={1} alignItems="center" bg="gray.500" px={8} pt={24}>
            <Logo />

            <Heading color="gray.100" fontSize="2xl" mt={16} mb={8}>
                Acesse sua conta 
            </Heading>

            <Input
                placeholder="E-mail"
                mb={4}
                InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
                onChangeText={setEmail}
            />
            <Input
                placeholder="Senha"
                mb={8}
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                secureTextEntry
                onChangeText={setPassword}
            />

            <Button 
            title="Entrar" 
            w="full" 
            onPress={handleSignIn}
            isLoading={isLoading}
            />
             <Button 
             w="full"  
             title="Cadastrar" 
             onPress={handleGoSignUp} 
             mt={4} />
        </VStack>
    )
}