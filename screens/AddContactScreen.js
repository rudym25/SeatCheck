import React, { useState } from 'react';
import { View, Button, TextInput, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import firebase from '../firebase';

const AddContactScreen = props => {
    const [enteredContactEmail, setEnteredContactEmail] = useState('');
    const [contactRequestList, setContactRequestList] = useState({});
    const [refresh, setRefresh] = useState();


    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused
            if (props.currUser.email != null) {
                makeContactRequestList();
            }
            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
                setContactRequestList({});
            };
        }, [])
    );

    const makeContactRequestList = () => {

        var uid = props.currUser.uid;
        //console.log(props.currUser.uid);
        var userRef = firebase.firestore().collection('users').doc(uid);
        userRef.get().then(function (doc) {
            if (doc.exists && ("recRequests" in doc.data())) {
                console.log("User:", doc.data().recRequests);
                setContactRequestList(doc.data().recRequests);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);

        });

    }

    const addContactInputHandler = () => {
        firebase.firestore().collection("users").where("email", "==", enteredContactEmail.toLowerCase())
            .get()
            .then(querySnapshot => {
                if (!querySnapshot.empty) {
                    console.log(querySnapshot.docs[0].data());
                    const recUid = querySnapshot.docs[0].data().uid
                    var receiverRef = firebase.firestore().collection('users').doc(recUid);

                    var receives = "recRequests." + props.currUser.uid;
                    var senderEmail = props.currUser.email;
                    receiverRef.update({
                        [receives]: { notIgnored: true, email: senderEmail }
                    });

                    var senderRef = firebase.firestore().collection('users').doc(props.currUser.uid);
                    var sends = "sentRequests." + recUid;
                    senderRef.update({
                        [sends]: true
                    });

                } else {
                    console.log("empty");
                }
            })
    }

    const acceptContactInputHandler = (item) => {
        //console.log("in AC: " , item);
        firebase.firestore().collection("users").where("email", "==", item.email)
            .get()
            .then(querySnapshot => {
                if (!querySnapshot.empty) {
                    const senderUid = querySnapshot.docs[0].data().uid;
                    const senderEmail = querySnapshot.docs[0].data().email;
                    var senderRef = firebase.firestore().collection('users').doc(senderUid);
                    
                    var acceptor = "contacts." + props.currUser.uid;
                    var sentReq = "sentRequests."+props.currUser.uid;
                    senderRef.update({
                        [acceptor]: {contact: true, email: props.currUser.email },
                        [sentReq]: firebase.firestore.FieldValue.delete()
                    });

                    var acceptorRef = firebase.firestore().collection('users').doc(props.currUser.uid);
                    var sender = "contacts." + senderUid;
                    var recReq = "recRequests." + senderUid;
                    //acceptorRef[sent].remove();
                    acceptorRef.update({
                        [sender]: {contact: true, email: senderEmail },
                        [recReq]: firebase.firestore.FieldValue.delete()
                    });
                    console.log("finished")
                }
                else {
                    console.log("empty in AC")
                }

                makeContactRequestList();

                //setRefresh(Math.random());
            })
            
    }

    function Request({ item }) {
        //console.log("request:" , item);
        return (
            <View style={styles.contactItem} >
                <Text style={styles.email}>{item.email}</Text>
                <View style={styles.buttonContainers}>
                    <TouchableOpacity style={styles.acceptButton} onPress={() => acceptContactInputHandler(item)}>
                        <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ignoreButton}>
                        <Text style={styles.buttonText}>Ignore</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }

    const getStyles = item => {
        if (false) {
            return { fontWeight: 'bold' }
        }
        else {
            return {}
        }
    }


    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Text>Add Contact</Text>
                <TextInput autoCapitalize='none' style={styles.input} onChangeText={inputText => { setEnteredContactEmail(inputText) }} value={enteredContactEmail} />
                <Button title="Add Contact" onPress={addContactInputHandler} />
            </View>
            <View style={styles.listContainer}>
                <Text style={styles.title}>Contact Requests</Text>
                <FlatList
                    keyExtractor={(item) => contactRequestList[item].email}
                    data={Object.keys(contactRequestList)}
                    renderItem={({ item }) => (
                        <Request item={contactRequestList[item]} />
                    )}
                />
            </View>
        </View>)
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 3
    },
    inputContainer: {
        flex: 1
    },
    listContainer: {
        flex: 4,
        alignItems: 'center'
    },
    input: {
        height: 30,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        marginVertical: 10
    },

    contactItem: {
        backgroundColor: '#C2DEEB',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 350
    },
    title: {
        fontSize: 20,
        margin: 5
    },
    email: {
        flex: 3
    },
    buttonContainers: {
        flexDirection: 'row'
    },
    acceptButton: {
        backgroundColor: '#2980b9',
        padding: 5,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    ignoreButton: {
        backgroundColor: '#ff4c4c',
        padding: 5,
        marginHorizontal: 5,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white'
    }
});

export default AddContactScreen;