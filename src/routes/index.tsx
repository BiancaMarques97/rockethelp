import { NavigationContainer } from "@react-navigation/native";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import { SignIn } from "../screens/SignIn";
import { AppRoutes } from "./app.routes";
import { AuthRoutes } from './auth.routes';
import { useState, useEffect } from "react";
import { isLoaded, isLoading } from "expo-font";
import { Loading } from "../screens/components/Loading";

export function Routes() {
    const [loading, setIsLoading] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User>();

    useEffect(() => {
        const subscriber = auth()
            .onAuthStateChanged(response => {
                setUser(response);
                setIsLoading(false);
            });

        return subscriber;
    }, []);

    if(loading){
        return <Loading />
    }

    return (
        <NavigationContainer>{user ? <AppRoutes /> : <AuthRoutes />}</NavigationContainer>
    )
}