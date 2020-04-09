import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import firebase from '../firebase';

const ContactsScreen = props => {
    const [contactList, setContactList] = useState({});

    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused
            if (props.currUser.email != null) {
                makeContactList();
            }
            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
                setContactList({});
            };
        }, [])
    );

    const makeContactList = () => {

        var uid = props.currUser.uid;
        //console.log(props.currUser.uid);
        var userRef = firebase.firestore().collection('users').doc(uid);
        userRef.get().then(function (doc) {
            if (doc.exists && ("contacts" in doc.data())) {
                console.log("User:", doc.data().contacts);
                setContactList(doc.data().contacts);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);

        });

    }

    function Contact({ item }) {
        //console.log("request:" , item);
        return (
            <View style={styles.contactItem} >
                <Text style={styles.email}>{item.email}</Text>
                <View style={styles.buttonContainers}>
                    <TouchableOpacity style={styles.button} onPress={() => console.log("Button pressed")}>
                        <Text style={styles.buttonText}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Ignore</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Contacts</Text>
            </View>
            <View style={styles.listContainer}>
                <FlatList
                    keyExtractor={(item) => contactList[item].email}
                    data={Object.keys(contactList)}
                    renderItem={({ item }) => (
                        <Contact item={contactList[item]} />
                    )}
                />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 3
    },
    listContainer: {
        flex: 8,
        alignItems: 'center'
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    contactItem: {
        backgroundColor: '#C2DEEB',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 350
    },
    email: {
        flex: 3
    },
    buttonContainers: {
        flexDirection: 'row'
    },
    buttonText: {
        color: 'white'
    },
    title: {
        fontSize: 20,
    },
    button: {
        backgroundColor: '#2980b9',
        padding: 5,
        marginHorizontal: 5,
        alignItems: 'center',
    },
});

export default ContactsScreen;