import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

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

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        //something like this would go in the QR code
        /*{
            "type": "mapLocation",
            "mapID": ""
             "coordinates": [0,0,0]
        }*/
        //console.log("obj: ", obj)
        var qrObj = JSON.parse(data);


        if (qrObj.type == "mapLocation") {


            var userRef = firebase.firestore().collection("users").doc(props.currUser.uid);
            userRef.get().then(function (user) {
                var validMap = false;
                for (var i = 0; i < user.data().allMyMaps.length; i++) {

                    if (user.data().allMyMaps[i].code == qrObj.mapID) {
                        validMap = true;
                        
                        var mapRef = firebase.firestore().collection("maps").doc(qrObj.mapID);
                        // mapRef.get().then(function(map) {
                        var floor = qrObj.coordinates[0];
                        var col = qrObj.coordinates[1];
                        var row = qrObj.coordinates[2];
                        var tile = "matrix._" + qrObj.coordinates[0] + "_" + qrObj.coordinates[1] + "_" + qrObj.coordinates[2] + ".taken";
                        console.log("Tile being changed: ", tile);
                        mapRef.update({
                            [tile]: true
                        })
                        // })
                        break;
                    }
                }
                if(!validMap) alert("You are not a memeber of this map");
            })



        } else {
            alert("This QR code is not supported");
        }

        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };

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

            {scanned && (
                <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
            )}
        </View>
    );
}

export default ScannerScreen;
