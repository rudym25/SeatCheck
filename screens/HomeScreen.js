import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';

import firebase from '../firebase';



const HomeScreen = props => {
    //console.log("in HomeScreen");
    const [enteredMapCode, setEnteredMapCode] = useState('');
    const [enteredMapName, setEnteredMapName] = useState('');
    const [allMapsList, setAllMapsList] = useState([]);
    const [myMapsList, setMyMapsList] = useState([{}]);

    const logoutInputHandler = () => {
        firebase.auth().signOut().then(function () {
            // sign out successful
            console.log("Sign out successful (HomeScreen.js)")
            //props.checkAuth;
        }, function (error) {
            //an error
        });
    };

    const mapCodeInputHandler = inputText => {
        setEnteredMapCode(inputText);
    };

    const mapNameInputHandler = inputText => {
        setEnteredMapName(inputText);
    };

    const createMapInputHandler = () => {
        firebase.firestore().collection('maps').doc(enteredMapName).set({
            name: enteredMapName,
            code: enteredMapName,
            creator: props.currUser.uid,
            members: []
        });
        console.log(enteredMapName + " map created by " + props.currUser.uid);

        var userRef = firebase.firestore().collection('users').doc(props.currUser.uid);
        userRef.update({
            allMyMaps: firebase.firestore.FieldValue.arrayUnion({ code: enteredMapName, authUser: true })
        });
        makeList();
    };

    const makeMyMapsList = () => {
        // setMyMapsList([]);
        var uid = props.currUser.uid;
        //console.log(props.currUser.uid);
        var userRef = firebase.firestore().collection('users').doc(uid);
        userRef.get().then(function (doc) {
            if (doc.exists) {
                //console.log("User:", doc.data().allMyMaps[0]);
                setMyMapsList(doc.data().allMyMaps);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });

    }

    const makeList = () => {
        setAllMapsList([]);
        firebase.firestore().collection("maps")
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.data().name);
                    // try adding doc instead of doc.data()
                    setAllMapsList(allMapsList => [...allMapsList, doc.data()]);

                });
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }

    useEffect(() => {
        console.log("in useEffect");
        console.log(props.currUser.email);
        makeList();
        if (props.currUser !== null) {
            makeMyMapsList();
        }
    }, [])

    const joinMapInputHandler = () => {

        firebase.firestore().collection("maps").where("code", "==", enteredMapCode)
            .get()
            .then(querySnapshot => {
                if (!querySnapshot.empty) {
                    //We know there is one doc in the querySnapshot
                    const map = querySnapshot.docs[0];
                    console.log("Joining map ", map.id, map.data().name);

                    var mapRef = firebase.firestore().collection('maps').doc(map.id);

                    mapRef.update({
                        members: firebase.firestore.FieldValue.arrayUnion(props.currUser.email)
                    });

                    var userRef = firebase.firestore().collection('users').doc(props.currUser.uid);
                    userRef.update({
                        allMyMaps: firebase.firestore.FieldValue.arrayUnion({ code: map.id, authUser: false })
                    });

                    makeList();
                } else {
                    console.log("No document corresponding to the query!");
                }
            });


    };

    const userInputHandler = () => {
        console.log(props.currUser.email);
    };



    return (
        <View>
            <Text> {props.currUser.email} is current user</Text>
            <Text>Join Map</Text>
            <TextInput style={styles.input} onChangeText={mapCodeInputHandler} value={enteredMapCode} />
            <Button title="Join Map" onPress={joinMapInputHandler} />
            <Text>Create Map (debugger)</Text>
            <TextInput style={styles.input} onChangeText={mapNameInputHandler} value={enteredMapName} />
            <Button title="Create Map" onPress={createMapInputHandler} />
            <Button title="Logout" onPress={logoutInputHandler} />
            <Button title="Show me user" onPress={userInputHandler} />
            <Text>ALL MAPS!!!</Text>
            {allMapsList.map(map => <Text key={map.code}>{map.code}    {map.members.length}</Text>)}
            <Text>MY MAPS!!!</Text>
            {myMapsList.map(map => <Text key={map.code}>{map.code}    </Text>)}

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

export default HomeScreen;