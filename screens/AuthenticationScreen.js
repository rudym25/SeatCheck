import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Button, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

import firebase from '../firebase';


const AuthenticationScreen = props => {
    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    

    //console.log("in AuthenticationScreen.js")

    const emailInputHandler = inputText => {
        setEnteredEmail(inputText);
    };
    const passwordInputHandler = inputText => {
        setEnteredPassword(inputText);

    };

    const loginInputHandler = () => {
        //console.log(enteredUsername);


        firebase.auth().signInWithEmailAndPassword(enteredEmail.toLowerCase(), enteredPassword)
            .then(function (user) {
                //console.log("In AuthenticationScreen: ", user);
                console.log("Logged in (AuthScreen 26)");
                //navigation.navigate('Home')
            })
            //props.checkAuth;
            .catch(function (error) {
                alert(error.toString());
                console.log(error.toString());
                return;

            })
    };


    const signupInputHandler = () => {


        firebase.auth().createUserWithEmailAndPassword(enteredEmail.toLowerCase(), enteredPassword)
            .then(function (user) {
                //console.log("user.uid: ", user.user.uid);
                firebase.firestore().collection('users').doc(user.user.uid).set({
                    uid: user.user.uid,
                    email: enteredEmail.toLowerCase(),
                    allMyMaps: {},
                    scannedLocation: {}
                });
            })


            .catch(function (error) {
                if (enteredEmail == '' || enteredPassword == '') {
                    alert("Type in your email and create a password");
                }
                else {
                    alert(error.toString());
                }
                console.log(error.toString());
                return;
            })
    };


    const logoutInputHandler = () => {
        firebase.auth().signOut().then(function () {
            // sign out successful
            console.log("logout from authentication  screen");
        }, function (error) {
            //an error
        });
    };

    const testInputHandler = () => {
        console.log("in test");
    };

    /* <Button title="Logout" onPress={logoutInputHandler} />
             <Button title="Test" onPress={testInputHandler} />
              <Button title="Login" onPress={loginInputHandler} />*/

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <View style={styles.logoContainer}>
            <Text style={styles.title}>Social Compass</Text>
                <Image
                    style={styles.logo}
                    source={require('../images/stock.jpg')}
                />
            </View>
            <View style={styles.formContainer}>
                <TextInput placeholder="email" autocorrect={false} autoCapitalize='none' placeholderTextColor="#000000" style={styles.input} onChangeText={emailInputHandler} value={enteredEmail} />
                <TextInput placeholder="password" autocorrect={false} autoCapitalize='none' secureTextEntry={true} placeholderTextColor="#000000" style={styles.input} onChangeText={passwordInputHandler} value={enteredPassword} />
                <TouchableOpacity style={styles.buttonContainer} onPress={loginInputHandler}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer} onPress={signupInputHandler}>
                    <Text style={styles.buttonText}>Sign Up for Social Compass</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fafafa",
        padding: 20
    },
    logoContainer: {
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    logo: {
        width: 100,
        height: 100
    },
    title: {
        color: '#FFF',
        marginBottom: 30,
        width: 190,
        textAlign: 'center',
        opacity: 0.9,
        fontWeight: '700',
        fontSize: 25
    },
    input: {
        height: 40,
        backgroundColor: '#ffffff',
        marginBottom: 15,
        color: '#000000',
        paddingHorizontal: 10,
        borderColor: 'gray'
        
    },
    buttonContainer: {
        backgroundColor: '#2980b9',
        paddingVertical: 15,
        marginBottom: 10
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: '700'
    }
});

export default AuthenticationScreen;