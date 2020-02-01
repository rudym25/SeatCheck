import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';

import firebase from '../firebase';

console.log("in AuthenticationScreen.js")

const AuthenticationScreen = props => {
    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');

    const emailInputHandler = inputText => {
        setEnteredEmail(inputText);
    };
    const passwordInputHandler = inputText => {
        setEnteredPassword(inputText);

    };

    const loginInputHandler = () => {
        //console.log(enteredUsername);
        try {
            firebase.auth().signInWithEmailAndPassword(enteredEmail, enteredPassword).then(function (user) {
                //console.log("In AuthenticationScreen: ", user);
            });
            //props.checkAuth;
        } catch(error){
            console.log(error.toString());
            return;
        }
    };


    const signupInputHandler = () => {

        try {
            firebase.auth().createUserWithEmailAndPassword(enteredEmail, enteredPassword).then(function (user) {
                //console.log("user.uid: ", user.user.uid);
                firebase.firestore().collection('users').doc(user.user.uid).set({
                    uid: user.user.uid,
                    email: enteredEmail,
                    joinedMaps: [],
                    createdMaps: []
                });
            });
            //props.checkAuth;

        } catch (error) {
            console.log(error.toString());
        }
        //
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

    return (
        <View>
            <Text>Email</Text>
            <TextInput style={styles.input} onChangeText={emailInputHandler} value={enteredEmail} />
            <Text>Password</Text>
            <TextInput style={styles.input} onChangeText={passwordInputHandler} value={enteredPassword} />
            <Button title="Login" onPress={loginInputHandler} />
            <Button title="Sign Up" onPress={signupInputHandler} />
            <Button title="Logout" onPress={logoutInputHandler} />
            <Button title="Test" onPress={testInputHandler} />
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 30,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        marginVertical: 10
    }
});

export default AuthenticationScreen;