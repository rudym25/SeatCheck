import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useFocusEffect } from '@react-navigation/native';

import firebase from '../firebase';

const ScannerScreen = props => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            //alert('Screen was focused');
            // Do something when the screen is focused

            return () => {
                //alert('Screen was unfocused');
                // Do something when the screen is unfocused
                // Useful for cleanup functions

            };
        }, [])
    );

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        //await getCoords();
        //something like this would go in the QR code
        /*{
            "type": "mapLocation",
            "key": "QR0",
            "mapName": "Five"
            }*/
        //console.log("obj: ", obj)
        var qrObj = JSON.parse(data);
        //const userPosition = findCoordinates();
        if (qrObj.type == "mapLocation") {

            var mapRef = firebase.firestore().collection("maps").doc(qrObj.mapName);
            await mapRef.get().then(async function (map) {
                if (map.data().members[props.currUser.uid] && await findDistance(map.data().coords)) {
                    var taken = "QRcodes." + qrObj.key + ".taken"
                    var users = "QRcodes." + qrObj.key + ".occupants." + props.currUser.uid
                    console.log(taken, ": true");
                    console.log(users, ": true")
                    mapRef.update({
                        [taken]: true,
                        [users]: true
                    })

                    //update users location///////
                    mapRef.get().then(function (updatedMap) {
                        var userRef = firebase.firestore().collection("users").doc(props.currUser.uid);
                        //userRef.get().then(function (user) {
                        var location = updatedMap.data().QRcodes[qrObj.key].name;
                        var QRname = "scannedLocation.QR";
                        userRef.update({
                            [QRname]: location
                        })
                    })
                    console.log(qrObj.key + " has been scanned");
                }
                else { alert("You are not a memeber of this map"); }
            })

        } else {
            alert("This QR code is not supported");
        }

        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        props.navigation.navigate('Maps List')
    };



    const getPosition = async () => {
        console.log("in getPostion()")
        let promise = new Promise((position, error) => {
            navigator.geolocation.getCurrentPosition(
                position, error, {
                enableHighAccuracy: true, timeout: 20000, maximumAge: 1000
            });
        })
        return await promise;
    };




    const findDistance = async (mapCoords) => {
        let position = await getPosition();
        console.log("Testing: ", position);
        let userCoordinates = position.coords;

        var lat1 = userCoordinates.latitude;
        var lon1 = userCoordinates.longitude;
        var lat2 = mapCoords.latitude;
        var lon2 = mapCoords.longitude;
        var R = 6371; // Radius of the earth in km
        var dLat = (lat2 - lat1).toRad();  // Javascript functions in radians
        var dLon = (lon2 - lon1).toRad();
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        console.log("You are " + d + " kilometers away");
        alert("You are " + d + " kilometers away from Marston");
        if (d < 1 || true) {
            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }
    }

    /** Converts numeric degrees to radians */
    if (typeof (Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function () {
            return this * Math.PI / 180;
        }
    }


    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-end',
            }}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            <Button title={'TEST'} onPress={() => handleBarCodeScanned({
                type: "test", data: "{\"type\": \"mapLocation\", \"key\": \"QR2069\",\"mapName\": \"Presentation\"}"
            }
            )} />
            {scanned && (
                <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
            )}
        </View>
    );
}

export default ScannerScreen;
