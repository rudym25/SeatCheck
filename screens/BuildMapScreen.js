import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Button } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import EditMapScreen from './EditMapScreen';
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

/*
tiles._0_0_0.QRcode = "QR0";
tiles._0_0_1.QRcode = "QR1";
tiles._0_0_2.QRcode = "QR2";
tiles._0_1_1.QRcode = "QR3";
tiles._1_0_1.QRcode = "QR4";
tiles._0_5_5.QRcode = "QR5";
tiles._0_10_1.QRcode = "QR6";*/

const BuildMapScreen = props => {
    const [showIntro, setShowIntro] = useState(true);
    const [selectedMap, setSelectedMap] = useState('');
    const [enteredMapName, setEnteredMapName] = useState();
    const [enteredMapCode, setEnteredMapCode] = useState();
    const [createSelected, setCreateSelected] = useState(false);
    const [editSelected, setEditSelected] = useState(false);
    const [enteredLevels, setEnteredLevels] = useState();
    const [enteredWidth, setEnteredWidth] = useState();
    const [enteredLength, setEnteredLength] = useState();
    const [enteredMapCoordinates, setEnteredMapCoordinates] = useState();
    const [mapCoordinates, setMapCoordinates] = useState({});

    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused

            return () => {
                //alert('Screen was unfocused');
                // Do something when the screen is unfocused
                // Useful for cleanup functions
                setSelectedMap('');
                setCreateSelected(false);
                setEditSelected(false);
                setShowIntro(true);
            };
        }, [])
    );


    const intro = (
        <View style={styles.introContainer}>
            <TouchableOpacity style={styles.createButton} onPress={() => createMapInputHandler()}>
                <Text style={styles.buttonText}>Create New Map</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={() => editMapInputHandler()}>
                <Text style={styles.buttonText}>Edit Existing Map</Text>
            </TouchableOpacity>
        </View>
    );


    let content = (<View></View>);

    const createMapInputHandler = () => {
        setCreateSelected(true);
        setEditSelected(false);
        setShowIntro(false);
    }

    const editMapInputHandler = () => {
        console.log("edit clicked")
        setCreateSelected(false);
        setEditSelected(true);
        setShowIntro(false);
    }

    const goBackHandler = () => {
        setCreateSelected(false);
        setEditSelected(false);
        setShowIntro(true);

    }

    const mapCoordsInputHandler = (input) => {
        var arr = input.split(", ");
        setMapCoordinates({ latitude: parseInt(arr[0]), longitude: parseInt(arr[1]) });
        setEnteredMapCoordinates(input);
    }


    const buildNewMapHandler = () => {

        if (enteredMapName == null || enteredMapCode == null || enteredLevels == null || enteredLength == null || enteredWidth == null || enteredMapCoordinates == null) {
            alert("Fill in Every Entry")
        } else {

            var numFloors = parseInt(enteredLevels);
            var width = parseInt(enteredWidth);
            var length = parseInt(enteredLength);
            var floors = {};
            //each tile is equal to 5 ftsq of the room
            for (var i = 0; i < numFloors; i++) {
                floors["_" + i] = { floor: i, length: Math.ceil(length / 5), width: Math.ceil(width / 5) }
            }


            var tiles = {};
            Object.keys(floors).forEach(function (floor) {
                //console.log("In Here: ", tiles.floors[floor].floor);
                for (var num2 = 0; num2 < floors[floor].length; num2++) {
                    for (var num3 = 0; num3 < floors[floor].width; num3++) {
                        tiles["_" + floors[floor].floor + "_" + num2 + "_" + num3] = { coordinates: [floors[floor].floor, num2, num3], QRcode: "", location: "(" + floors[floor].floor + ", " + num2 + ", " + num3 + ")" };
                    }
                }
            });
            console.log(tiles)


            firebase.firestore().collection('maps').doc(enteredMapName).set({
                name: enteredMapName,
                code: enteredMapCode,
                creator: props.currUser.uid,
                members: { [props.currUser.uid]: true },
                matrix: tiles,
                QRcodes: {},
                floors: floors,
                coords: mapCoordinates
            });

            console.log(enteredMapName + " map created by ", props.currUser.uid);

            var mapCode = "allMyMaps." + enteredMapName;
            var userRef = firebase.firestore().collection('users').doc(props.currUser.uid);
            userRef.update({
                [mapCode]: { code: enteredMapName, name: enteredMapName, authUser: true }
            });
            setSelectedMap(enteredMapName);
            editMapInputHandler();

        }
    }


    const getCoordinates = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                //console.log(" ", position.coords)
                setMapCoordinates(position.coords);
                setEnteredMapCoordinates(position.coords.latitude + ", " + position.coords.longitude)
                /* const userRef = firebase.firestore().collection('users').doc(props.currUser.uid);
                 userRef.update({
                     coords: position.coords
                 })*/

                //this.setState({ location });
            },
            error => alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    };

    if (createSelected) {
        content = (
            <View>
                <Text>Map Name</Text>
                <TextInput placeholder="Office HQ" autocorrect={false} autoCapitalize='none' placeholderTextColor="rgba(255,255,255,0.7)" style={styles.input} onChangeText={(inputText) => setEnteredMapName(inputText)} value={enteredMapName} />
                <Text>Map Code</Text>
                <TextInput placeholder="Code" autocorrect={false} autoCapitalize='none' placeholderTextColor="rgba(255,255,255,0.7)" style={styles.input} onChangeText={(inputText) => setEnteredMapCode(inputText)} value={enteredMapCode} />
                <Text>How Many Levels Are There?</Text>
                <TextInput placeholder="1" autocorrect={false} autoCapitalize='none' placeholderTextColor="rgba(255,255,255,0.7)" style={styles.input} onChangeText={(inputText) => setEnteredLevels(inputText)} value={enteredLevels} />
                <Text>Avg. Floor Width in Ft</Text>
                <TextInput placeholder="100" autocorrect={false} autoCapitalize='none' placeholderTextColor="rgba(255,255,255,0.7)" style={styles.input} onChangeText={(inputText) => setEnteredWidth(inputText)} value={enteredWidth} />
                <Text>Avg. Floor Length in Ft</Text>
                <TextInput placeholder="100" autocorrect={false} autoCapitalize='none' placeholderTextColor="rgba(255,255,255,0.7)" style={styles.input} onChangeText={(inputText) => setEnteredLength(inputText)} value={enteredLength} />
                <Text>Geographical Coordinates: </Text>
                <TextInput placeholder="100, 100" autocorrect={false} autoCapitalize='none' placeholderTextColor="rgba(255,255,255,0.7)" style={styles.input} onChangeText={(inputText) => mapCoordsInputHandler(inputText)} value={enteredMapCoordinates} />
                <Button title="Use My Location" onPress={() => getCoordinates()} />
                <View style={styles.buttonContainers}>
                    <TouchableOpacity style={styles.buildButton} onPress={() => buildNewMapHandler()}>
                        <Text style={styles.buttonText}>Build New Map</Text>
                    </TouchableOpacity>
                </View>
                <Button title="Go Back" onPress={() => goBackHandler()} />
            </View>
        );
    } else if (editSelected) {
        content = (
            <View>
                <TextInput placeholder="Map Name" autocorrect={false} autoCapitalize='none' placeholderTextColor="rgba(255,255,255,0.7)" style={styles.input} onChangeText={(inputText) => setEnteredMapName(inputText)} value={enteredMapName} />
                <Button title="Go Back" onPress={() => goBackHandler()} />
            </View>
        );
    }

    if (showIntro) {
        return (
            <View style={styles.container}>
                {intro}
            </View>
        )
    }
    else if (createSelected) {
        return (
            <View style={styles.container}>
                {content}
            </View>
        )
    }
    else {
        return (
            <EditMapScreen currUser={props.currUser} goBack={() => goBackHandler()} selectedMap={selectedMap} />
        )
    }
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#fafafa",
        padding: 20

    },
    introContainer: {
        flex: 1,
        margin: 40
    },
    createButton: {
        flex: 1,
        backgroundColor: '#3f51b5',
        padding: 5,
        marginBottom: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    editButton: {
        flex: 1,
        backgroundColor: '#3f51b5',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 20
    },
    input: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.6)',
        marginBottom: 15,
        color: '#000',
        paddingHorizontal: 10
    },
    buildButton: {
        backgroundColor: '#3f51b5',
        padding: 5,
        marginHorizontal: 5,
        alignItems: 'center',
    }

});

export default BuildMapScreen;