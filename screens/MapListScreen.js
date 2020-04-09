import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import firebase from '../firebase';


/*var tiles = {
    floors: {
        _0: { floor: 0, length: 3, width: 4 },
        _1: { floor: 1, length: 4, width: 3 }
    }
}
Object.keys(tiles.floors).forEach(function (floor) {
    //console.log("In Here: ", tiles.floors[floor].floor);
    for (var num2 = 0; num2 < tiles.floors[floor].length; num2++) {
        for (var num3 = 0; num3 < tiles.floors[floor].width; num3++) {
            tiles["_" + tiles.floors[floor].floor + "_" + num2 + "_" + num3] = { coordinates: [tiles.floors[floor].floor, num2, num3], QRcode: "", location: "("+tiles.floors[floor].floor + ", " + num2 + ", " + num3+")"};
        }
    }
})
tiles._0_0_0.QRcode = "QR0";
tiles._0_0_1.QRcode = "QR1";
*/
//console.log("tiles: ", tiles);


const MapListScreen = props => {
    //const [enteredMapCode, setEnteredMapCode] = useState('');
    //const [enteredMapName, setEnteredMapName] = useState('');
    //const [allMapsList, setAllMapsList] = useState([]);
    const [myMapsList, setMyMapsList] = useState([]);



    useFocusEffect(
        React.useCallback(() => {
            //alert('Screen was focused');
            // Do something when the screen is focused
            if (props.currUser.email != null) {
                makeMyMapsList();
                findCoordinates();
                //findDistance(29.631178, -82.380433, 29.6480, -82.3439)
            }
            return () => {
                //alert('Screen was unfocused');
                // Do something when the screen is unfocused
                // Useful for cleanup functions
                setMyMapsList([]);
            };
        }, [])
    );

    /*const findDistance = (lat1, lon1, lat2, lon2) => {
        var R = 6371; // Radius of the earth in km
        var dLat = (lat2 - lat1).toRad();  // Javascript functions in radians
        var dLon = (lon2 - lon1).toRad();
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        console.log(d + " kilometers apart")
        return d;
    }*/

    /** Converts numeric degrees to radians */
    if (typeof (Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function () { 
            return this * Math.PI / 180;
        }
    }
    const findCoordinates = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                //const location = JSON.stringify(position);
                //console.log(" ", position.coords)
                const userRef = firebase.firestore().collection('users').doc(props.currUser.uid);
                userRef.update({
                    coords: position.coords
                })

                //this.setState({ location });
            },
            error => alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    };



    /*const mapCodeInputHandler = inputText => {
        setEnteredMapCode(inputText);
    };*/

    /*const mapNameInputHandler = inputText => {
        setEnteredMapName(inputText);
    };*/

    /*const createMapInputHandler = () => {
        firebase.firestore().collection('maps').doc(enteredMapName).set({
            name: enteredMapName,
            code: enteredMapName,
            creator: props.currUser.uid,
            members: {[props.currUser.email]: true},
            matrix: tiles,
            QRcodes: { QR0:{ name: "QR0", taken: false, occupants: {} }, QR1:{ name: "QR1", taken: false, occupants: {}} }
        });
        console.log(enteredMapName + " map created by ", props.currUser.uid);

        var mapCode = "allMyMaps."+enteredMapName;
        var userRef = firebase.firestore().collection('users').doc(props.currUser.uid);
        userRef.update({
            //allMyMaps: firebase.firestore.FieldValue.arrayUnion({ code: enteredMapName, name: enteredMapName, authUser: true })
            [mapCode]: { code: enteredMapName, name: enteredMapName, authUser: true }
        });
        makeMyMapsList();
    };
*/
    const makeMyMapsList = () => {
        // setMyMapsList([]);
        var uid = props.currUser.uid;
        //console.log(props.currUser.uid);
        var userRef = firebase.firestore().collection('users').doc(uid);
        userRef.get().then(function (doc) {
            if (doc.exists) {
                //console.log("User:", doc.data().allMyMaps);
                setMyMapsList(doc.data().allMyMaps);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
            //makeMyMapsList();
        });

    }

    /*const makeList = () => {
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
                //makeMyMapsList();
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }*/

    /*useEffect(() => {
         console.log("in useEffect [] (MapListScreen)");
         makeMyMapsList();
         //props.stackNav.setOptions({ title: "My Maps" });

     }, [])*/


    useEffect(() => {
        console.log("in useEffect [email] (MapListScreen)");
        //console.log(props.currUser.email);
        if (props.currUser.email != null) {
            //console.log("currUser.email != null");
            makeMyMapsList();
        }
    }, [props.currUser.email])


    /*const joinMapInputHandler = () => {

        firebase.firestore().collection("maps").where("code", "==", enteredMapCode)
            .get()
            .then(querySnapshot => {
                if (!querySnapshot.empty) {
                    //We know there is one doc in the querySnapshot
                    const map = querySnapshot.docs[0];
                    console.log("Joining map ", map.id, map.data().name);

                    var mapRef = firebase.firestore().collection('maps').doc(map.id);
                    var userEmail = "members."+props.currUser.email;
                    mapRef.update({
                        [userEmail]: true
                    });

                    var userRef = firebase.firestore().collection('users').doc(props.currUser.uid);
                    var mapCode = "allMyMaps."+map.data().code;
                    userRef.update({
                        //allMyMaps: firebase.firestore.FieldValue.arrayUnion({ code: map.data().code, name: map.data().name, authUser: false })
                        [mapCode]: { code: map.data().code, name: map.data().name, authUser: false }
                    });
                    //console.log(props.currUser.uid);
                    makeMyMapsList();
                } else {
                    console.log("No document corresponding to the query!");
                }
            });
    };
*/
    const selectMapHandler = mapCode => {
        //console.log("it works: ", mapCode);
        props.onSelectMap(mapCode);
        props.navigation.navigate("Map")
    };



    /*const userInputHandler = () => {
        console.log(props.currUser.email);
        makeMyMapsList();
    };*/


    /* <Text>ALL MAPS!!!</Text>
     {allMapsList.map(map => <Text key={map.code}>{map.code}    {map.members.length}</Text>)}
     <Text>MY MAPS!!!</Text>
            {myMapsList.map(map => <Button key={map.code} title={map.code} onPress={selectMapHandler} />)}
            <Button title="Logout" onPress={logoutInputHandler} />
            <Button title="Show me user" onPress={userInputHandler} />
            
            <Text>Create Map (for testing)</Text>
            <TextInput style={styles.input} onChangeText={mapNameInputHandler} value={enteredMapName} />
            <Button title="Create Map" onPress={createMapInputHandler} />
            <Text>Join Map</Text>
            <TextInput style={styles.input} onChangeText={mapCodeInputHandler} value={enteredMapCode} />
            <Button title="Join Map" onPress={joinMapInputHandler} />*/

    const getStyles = item => {
        if (item.authUser) {
            return { fontWeight: 'bold' }
        }
        else {
            return {}
        }
    }
    function Map({ item }) {
        return (
            <TouchableOpacity
                onPress={() => selectMapHandler(item)}
                style={styles.mapItem}
            >
                <Text style={getStyles(item)}>{item.name}</Text>
            </TouchableOpacity>
        );
    }



    //<Button title={myMapsList[item].code} onPress={() => selectMapHandler(myMapsList[item])} />
    return (
        <View style={styles.view}>
            <View style={styles.title}>
                <Text style={styles.title}>My Maps</Text>
            </View>
            <SafeAreaView>
                <FlatList
                    keyExtractor={(item) => myMapsList[item].code}
                    data={Object.keys(myMapsList)}
                    renderItem={({ item }) => (
                        <Map item={myMapsList[item]} />
                    )}
                />
            </SafeAreaView>

        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        alignContent: 'center',
        alignItems: 'center',
        fontSize: 20,
        marginBottom: 10
    },
    input: {
        height: 30,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        marginVertical: 10
    },
    view: {
        margin: 10,
        marginBottom: 60
    },
    mapItem: {
        backgroundColor: '#C2DEEB',
        padding: 20,
        marginVertical: 8
    }
});

export default MapListScreen;