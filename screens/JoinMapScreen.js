import React, { useState } from 'react';
import { View, Button, TextInput, Text, StyleSheet } from 'react-native';

import firebase from '../firebase';


var qrCodes = {
    QR0: { name: "QR0", id: "QR0", type: "desk", taken: false, occupants: {} },
    QR1: { name: "QR1", id: "QR1", type: "desk", taken: false, occupants: {} },
    QR2: { name: "QR2", id: "QR2", type: "desk", taken: false, occupants: {} },
    QR3: { name: "QR3", id: "QR3", type: "desk", taken: false, occupants: {} },
    QR4: { name: "QR4", id: "QR4", type: "desk", taken: false, occupants: {} },
    QR5: { name: "QR5", id: "QR5", type: "desk", taken: false, occupants: {} },
    QR6: { name: "QR6", id: "QR6", type: "desk", taken: false, occupants: {} }
}
var floors = {
    _0: { floor: 0, length: 20, width: 25 },
    _1: { floor: 1, length: 22, width: 23 }
}

var tiles = {
    /*floors: {
        _0: { floor: 0, length: 3, width: 4 },
        _1: { floor: 1, length: 4, width: 3 }
    }*/
}
Object.keys(floors).forEach(function (floor) {
    //console.log("In Here: ", tiles.floors[floor].floor);
    for (var num2 = 0; num2 < floors[floor].length; num2++) {
        for (var num3 = 0; num3 < floors[floor].width; num3++) {
            tiles["_" + floors[floor].floor + "_" + num2 + "_" + num3] = { coordinates: [floors[floor].floor, num2, num3], QRcode: "", location: "(" + floors[floor].floor + ", " + num2 + ", " + num3 + ")" };
        }
    }
})
tiles._0_0_0.QRcode = "QR0";
tiles._0_0_1.QRcode = "QR1";
tiles._0_0_2.QRcode = "QR2";
tiles._0_1_1.QRcode = "QR3";
tiles._1_0_1.QRcode = "QR4";
tiles._0_5_5.QRcode = "QR5";
tiles._0_10_1.QRcode = "QR6";

const JoinMapScreen = props => {
    const [enteredMapName, setEnteredMapName] = useState('');
    const [enteredMapCode, setEnteredMapCode] = useState('');

    /*const mapCodeInputHandler = inputText => {
        setEnteredMapCode(inputText);
    };*/

    const joinMapInputHandler = () => {
        firebase.firestore().collection("maps").doc(enteredMapCode)
            .get()
            .then(function (doc)  {
                if (doc.exists) {
                    //We know there is one doc in the querySnapshot
                    const map = doc;
                    console.log("Joining map ", map.id, map.data().name);

                    var mapRef = firebase.firestore().collection('maps').doc(map.id);
                    var userUid = "members." + props.currUser.uid;
                    console.log(userUid,": true");
                    mapRef.update({
                        [userUid]: true
                    });

                    var userRef = firebase.firestore().collection('users').doc(props.currUser.uid);
                    var mapCode = "allMyMaps." + map.data().code;
                    userRef.update({
                        //allMyMaps: firebase.firestore.FieldValue.arrayUnion({ code: map.data().code, name: map.data().name, authUser: false })
                        [mapCode]: { code: map.data().code, name: map.data().name, authUser: false }
                    });
                    //console.log(props.currUser.uid);
                    //makeMyMapsList();
                } else {
                    console.log("No document corresponding to the query!");
                }
            });
    };

    /*const createMapInputHandler = () => {
        firebase.firestore().collection('maps').doc(enteredMapName).set({
            name: enteredMapName,
            code: enteredMapCode,
            creator: props.currUser.uid,
            members: { [props.currUser.uid]: true },
            matrix: tiles,
            QRcodes: qrCodes,
            floors: floors,
            coords: {latitude: 29.6480, longitude: -82.3439}
        });
        console.log(enteredMapName + " map created by ", props.currUser.uid);

        var mapCode = "allMyMaps." + enteredMapName;
        var userRef = firebase.firestore().collection('users').doc(props.currUser.uid);
        userRef.update({
            //allMyMaps: firebase.firestore.FieldValue.arrayUnion({ code: enteredMapName, name: enteredMapName, authUser: true })
            [mapCode]: { code: enteredMapName, name: enteredMapName, authUser: true }
        });
        //makeMyMapsList();
    };*/


    return (
        <View>
            <Text>Join Map</Text>
            <TextInput style={styles.input} onChangeText={inputText => { setEnteredMapCode(inputText) }} value={enteredMapCode} />
            <Button title="Join Map" onPress={joinMapInputHandler} />
        </View>)
};

const styles = StyleSheet.create({
    input: {
        height: 30,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        marginVertical: 10
    }
});

export default JoinMapScreen;