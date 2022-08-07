import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center } from 'native-base';
import Logo from '../screens/assets/logo_secondary.svg';
import { SignOut } from 'phosphor-react-native';
import { ChatTeardropText } from 'phosphor-react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';
import { Loading } from './components/Loading';

import { dateFormat } from '../utils/firestoreDateFormat';

import { Filter } from './components/Filter';
import { Button } from './components/Button';
import { Order, OrderProps } from './components/Order';
import { color } from 'native-base/lib/typescript/theme/styled-system';

export function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open');
    const [orders, setOrders] = useState<OrderProps[]>([]);

    const navigation = useNavigation();
    const { colors } = useTheme();

    function handleNewOrder() {
        navigation.navigate('new');
    }

    function handleOpenDetails(orderId: string) {
        navigation.navigate('details', { orderId });
    }

    function handleLogout() {
        auth()
            .signOut()
            .catch(error => {
                console.log(error);
                return Alert.alert('Sair', 'Não foi possível sair.')
            });
    }

    useEffect(() => {
        setIsLoading(true);

        const subscriber = firestore()
            .collection('orders')
            .where('status', '==', statusSelected)
            .onSnapshot(snapshot => {
                const data = snapshot.docs.map(doc => {
                    const { patrimony, description, status, create_at } = doc.data();

                    return {
                        id: doc.id,
                        patrimony,
                        description,
                        status,
                        when: dateFormat(create_at)
                    }
                });

                setOrders(data);
                setIsLoading(false);
            });

        return subscriber;
    }, [statusSelected]);

    return (
        <VStack flex={1} pb={6} bg="gray.700">
            <HStack
                w="full"
                justifyContent="space-between"
                alignItems="center"
                bg="gray.600"
                pt={12}
                pb={5}
                px={6}
            >
                <Logo />

                <IconButton
                    icon={<SignOut size={26} color={colors.gray[300]} />}
                    onPress={handleLogout}
                />
            </HStack>

            <VStack flex={1} px={6}>
                <HStack w="full" mt={8} mb={4} justifyContent="space-between" alignItems="center">
                    <Heading color="gray.100" fontSize="xl">
                        Solicitações
                    </Heading>

                    <Text color="gray.100" fontSize="md">
                        {orders.length}
                    </Text>
                </HStack>

                <HStack space={4} mb={8}>
                    <Filter
                        type="open"
                        title="Em Andamento"
                        onPress={() => setStatusSelected('open')}
                        isActive={statusSelected === 'open'}
                    />

                    <Filter
                        type="closed"
                        title="Finalizados"
                        onPress={() => setStatusSelected('closed')}
                        isActive={statusSelected === 'closed'}
                    />
                </HStack>
                {
                    isLoading ? <Loading /> : 
                    <FlatList
                        data={orders}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <Order data={item} onPress={() => handleOpenDetails(item.id)} />}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        ListEmptyComponent={() => (
                            <Center>
                                <ChatTeardropText color={colors.gray[300]} size={50} />
                                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                                    Você ainda não possui {'\n'}
                                    solicitações {statusSelected === 'open' ? 'em andamento' : 'finalizadas'}
                                </Text>
                            </Center>
                        )}
                    />
                }
                <Button title="Nova Solicitação" onPress={handleNewOrder} />
            </VStack>
        </VStack>
    );
}