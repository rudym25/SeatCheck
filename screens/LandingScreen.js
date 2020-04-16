import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Button, TouchableOpacity, KeyboardAvoidingView, Modal } from 'react-native';

import firebase from '../firebase';
import LoginScreen from './LoginScreen';
import RegistrationScreen from './RegistrationScreen';


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

    const loginHandler = () => {
        props.setOpenModal(false);
    }

    const registerHandler = () => {
        props.setOpenModal(false);
    }

    let createObjectView = (
        <View>
            <Modal
                visible={props.openModal}
                transparent={true}
            >
                <View style={{ alignItems: 'center', flex:1 }}>
                    <View style={styles.createObjectModal}>

                        <TouchableOpacity style={styles.buttonContainer} onPress={() => loginHandler()}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonContainer} onPress={() => registerHandler()}>
                            <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
        </View>
    );

    /* <Button title="Logout" onPress={logoutInputHandler} />
             <Button title="Test" onPress={testInputHandler} />
              <Button title="Login" onPress={loginInputHandler} />*/

    if(props.openModal===true)
        console.log("true modal");

    return (
        
        <View  style={styles.container}>
            <View style={styles.logoContainer}>
                {createObjectView}
            <Text style={styles.title}>Welcome to Social Compass</Text>
                <Text style={styles.text}>{"A seating platform for\nprofessionals and students"}</Text>
                <Image
                    style={styles.logo}
                    source={require('../images/stock.jpg')}
                />
                <Text style={styles.text}>
                    {"To begin, create an account by clicking on the profile icon. \n" + 
                    "Afterwards, the left menu lets you access the application features. \n"}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({

    buttonContainer: {
        marginVertical: 20,
        //borderColor: 'black',
        //borderWidth: 1
    },
    mapContainer: {
        //borderColor: 'green',
        //borderWidth: 1,
        height: 450,
        alignItems: 'center',

    },
    floorButtonsContainer: {
        //borderColor: 'black',
        //borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    map: {
        //borderColor: 'red',
        //borderWidth: 2,
    },
    mapObjectsContainer: {
        //borderColor: 'black',
        //borderWidth: 1,
        flex: 1
    },
    createObjectModal: {
        margin: 40,
        borderRadius: 20,
        padding: 70,
        backgroundColor: "#fafafa",
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
        //borderColor: 'red', borderWidth: 1
    },
    button: {
        flex: 1,
        backgroundColor: '#3f51b5',
        padding: 40,
        margin: 10,
        alignItems: 'center',
    },
    objButton: {
        backgroundColor: '#3f51b5',
        padding: 5,
        marginBottom: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 17
    },
    pickerContainer: {

    },
    picker: {
        //borderColor: 'red',
        //borderWidth: 1,
        height: 100
    },
    objPicker: {
        height: 65

    },
    floorText: {
        fontSize: 20,
        color: 'white'
    },
    SquareShapeView: {
        width: 25,
        height: 25,
        borderColor: '#000',
        borderWidth: .25,
        backgroundColor: '#00BCD4'
    },
    CircleShapeView: {
        width: 25,
        height: 25,
        borderRadius: 25 / 2,
        backgroundColor: '#00BCD4',
        marginRight: 5
    },
    input: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.6)',
        marginBottom: 15,
        color: '#000',
        paddingHorizontal: 10
    },
    container: {
        flex: 1,
        backgroundColor: "#fafafa",
        padding: 20
    },
    logoContainer: {
        alignItems: 'center',
        flexGrow: 1,
    },
    logo: {
        width: "100%",
        height: "50%"
    },
    title: {
        color: '#000000',
        marginBottom: 30,
        width: 190,
        textAlign: 'center',
        opacity: 0.9,
        fontWeight: '700',
        fontSize: 25
    },
    text: {
        color: '#000000',
        marginBottom: 30,
        width: 190,
        textAlign: 'center',
        opacity: 0.9,
        fontWeight: '700',
        fontSize: 17
        
    },
    input: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 15,
        color: '#FFF',
        paddingHorizontal: 10
    },
    buttonContainer: {
        backgroundColor: '#3f51b5',
        paddingVertical: 40,
        paddingHorizontal: 30,
        marginBottom: 20
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: '700'
    }
});

export default AuthenticationScreen;