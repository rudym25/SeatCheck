import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, FlatList } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import firebase from '../firebase';


//let listComponent = <Text>No Maps</Text>;

/*var array = {
    Floor0: {
        Row0: { tile0: { taken: false, location: "0, 0, 0" }, tile1: { taken: false, location: "0, 0, 1" }, tile2: { taken: false, location: "0, 0, 2" } },
        Row1: { tile0: { taken: false, location: "0, 1, 0" }, tile1: { taken: false, location: "0, 1, 1" }, tile2: { taken: false, location: "0, 1, 2" } },
        Row2: { tile0: { taken: false, location: "0, 2, 0" }, tile1: { taken: false, location: "0, 2, 1" }, tile2: { taken: false, location: "0, 2, 2" } }
    },
    Floor1: {
        Row0: { tile0: { taken: false, location: "1, 0, 0" }, tile1: { taken: false, location: "1, 0, 1" }, tile2: { taken: false, location: "1, 0, 2" } },
        Row1: { tile0: { taken: false, location: "1, 1, 0" }, tile1: { taken: false, location: "1, 1, 1" }, tile2: { taken: false, location: "1, 1, 2" } },
        Row2: { tile0: { taken: false, location: "1, 2, 0" }, tile1: { taken: false, location: "1, 2, 1" }, tile2: { taken: false, location: "1, 2, 2" } }
    },
    Floor2: {
        Row0: { tile0: { taken: false, location: "2, 0, 0" }, tile1: { taken: false, location: "2, 0, 1" }, tile2: { taken: false, location: "2, 0, 2" } },
        Row1: { tile0: { taken: false, location: "2, 1, 0" }, tile1: { taken: false, location: "2, 1, 1" }, tile2: { taken: false, location: "2, 1, 2" } },
        Row2: { tile0: { taken: false, location: "2, 2, 0" }, tile1: { taken: false, location: "2, 2, 1" }, tile2: { taken: false, location: "2, 2, 2" } }
    }
};*/

/*var array = [
    {
        Floor: 0, Length: [
            {
                Col: 0, Width: [
                    { Row: 0, taken: false, location: "0, 0, 0" },
                    { Row: 1, taken: false, location: "0, 0, 1" },
                    { Row: 2, taken: false, location: "0, 0, 2" }
                ]
            },
            {
                Col: 1, Width: [
                    { Row: 0, taken: false, location: "0, 1, 0" },
                    { Row: 1, taken: false, location: "0, 1, 1" },
                    { Row: 2, taken: false, location: "0, 1, 2" }
                ]
            },
            {
                Col: 2, Width: [
                    { Row: 0, taken: false, location: "0, 2, 0" },
                    { Row: 1, taken: false, location: "0, 2, 1" },
                    { Row: 2, taken: false, location: "0, 2, 2" }
                ]
            }

        ]
    },
    {
        Floor: 1, Length: [
            {
                Col: 0, Width: [
                    { Row: 0, taken: false, location: "1, 0, 0" },
                    { Row: 1, taken: false, location: "1, 0, 1" },
                    { Row: 2, taken: false, location: "1, 0, 2" }
                ]
            },
            {
                Col: 1, Width: [
                    { Row: 0, taken: false, location: "1, 1, 0" },
                    { Row: 1, taken: false, location: "1, 1, 1" },
                    { Row: 2, taken: false, location: "1, 1, 2" }
                ]
            },
            {
                Col: 2, Width: [
                    { Row: 0, taken: false, location: "1, 2, 0" },
                    { Row: 1, taken: false, location: "1, 2, 1" },
                    { Row: 2, taken: false, location: "1, 2, 2" }
                ]
            }
        ]
    }
]*/


var tiles = {
    floors: {
        _0: { floor: 0, length: 3, width: 4 },
        _1: { floor: 1, length: 4, width: 3 }
    }
}
Object.keys(tiles.floors).forEach(function (floor) {
    //console.log("In Here: ", tiles.floors[floor].floor);
    for (var num2 = 0; num2 < tiles.floors[floor].length; num2++) {
        for (var num3 = 0; num3 < tiles.floors[floor].width; num3++) {
            tiles["_" + tiles.floors[floor].floor + "_" + num2 + "_" + num3] = { coordinates: [tiles.floors[floor].floor, num2, num3], taken: false, location: "("+tiles.floors[floor].floor + ", " + num2 + ", " + num3+")"};
        }
    }
})
//console.log("tiles: ", tiles);
/*var array = {
    Floor0: {
        Row0: [{tile: {taken: false, location: "0, 0, 0"}}, {tile: {taken: false, location: "0, 0, 1"}}, {tile: {taken: false, location: "0, 0, 2"}}],
        Row1: [{tile: {taken: false, location: "0, 1, 0"}}, {tile: {taken: false, location: "0, 1, 1"}}, {tile: {taken: false, location: "0, 1, 2"}}],
        Row2: [{tile: {taken: false, location: "0, 2, 0"}}, {tile: {taken: false, location: "0, 2, 1"}}, {tile: {taken: false, location: "0, 2, 2"}}]
    },
    Floor1: {
        Row0: [{tile: {taken: false, location: "1, 0, 0"}}, {tile: {taken: false, location: "1, 0, 1"}}, {tile: {taken: false, location: "1, 0, 2"}}],
        Row1: [{tile: {taken: false, location: "0, 1, 0"}}, {tile: {taken: false, location: "1, 1, 1"}}, {tile: {taken: false, location: "1, 1, 2"}}],
        Row2: [{tile: {taken: false, location: "0, 2, 0"}}, {tile: {taken: false, location: "1, 2, 1"}}, {tile: {taken: false, location: "1, 2, 2"}}]
    },
    Floor2: {
        Row0: [{tile: {taken: false, location: "2, 0, 0"}}, {tile: {taken: false, location: "2, 0, 1"}}, {tile: {taken: false, location: "2, 0, 2"}}],
        Row1: [{tile: {taken: false, location: "2, 1, 0"}}, {tile: {taken: false, location: "2, 1, 1"}}, {tile: {taken: false, location: "2, 1, 2"}}],
        Row2: [{tile: {taken: false, location: "2, 2, 0"}}, {tile: {taken: false, location: "2, 2, 1"}}, {tile: {taken: false, location: "2, 2, 2"}}]
    }
};*/

const HomeScreen = props => {
    //console.log("in HomeScreen");
    const [enteredMapCode, setEnteredMapCode] = useState('');
    const [enteredMapName, setEnteredMapName] = useState('');
    const [allMapsList, setAllMapsList] = useState([]);
    const [myMapsList, setMyMapsList] = useState([]);


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
            members: [props.currUser.email],
            matrix: tiles
        });
        console.log(enteredMapName + " map created by ", props.currUser.uid);

        var userRef = firebase.firestore().collection('users').doc(props.currUser.uid);
        userRef.update({
            allMyMaps: firebase.firestore.FieldValue.arrayUnion({ code: enteredMapName, name: enteredMapName, authUser: true })
        });
        makeMyMapsList();
    };

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
            makeMyMapsList();
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
         console.log("in useEffect []");
         //makeList();
     }, [])*/


    useEffect(() => {
        console.log("in useEffect [email]");
        //console.log(props.currUser.email);
        if (props.currUser.email != null) {
            //console.log("currUser.email != null");
            makeMyMapsList();
        }
    }, [props.currUser.email])


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
                        allMyMaps: firebase.firestore.FieldValue.arrayUnion({ code: map.data().code, name: map.data().name, authUser: false })
                    });
                    //console.log(props.currUser.uid);
                    makeMyMapsList();
                } else {
                    console.log("No document corresponding to the query!");
                }
            });


    };

    const selectMapHandler = mapCode => {
        //console.log("it works: ", mapCode);
        props.onSelectMap(mapCode);
        props.navigation.navigate("Map")
    };



    const userInputHandler = () => {
        console.log(props.currUser.email);
        makeMyMapsList();
    };


    /* <Text>ALL MAPS!!!</Text>
     {allMapsList.map(map => <Text key={map.code}>{map.code}    {map.members.length}</Text>)}
     <Text>MY MAPS!!!</Text>
            {myMapsList.map(map => <Button key={map.code} title={map.code} onPress={selectMapHandler} />)}*/

    return (
        <View>
            <Text>Hi, {props.currUser.email}</Text>
            <Text>Join Map</Text>
            <TextInput style={styles.input} onChangeText={mapCodeInputHandler} value={enteredMapCode} />
            <Button title="Join Map" onPress={joinMapInputHandler} />
            <Text>Create Map (debugger)</Text>
            <TextInput style={styles.input} onChangeText={mapNameInputHandler} value={enteredMapName} />
            <Button title="Create Map" onPress={createMapInputHandler} />
            <Button title="Logout" onPress={logoutInputHandler} />
            <Button title="Show me user" onPress={userInputHandler} />
            <Text>My Maps</Text>
            <FlatList
                keyExtractor={(item) => item.code}
                data={myMapsList}
                renderItem={({ item }) => (
                    <Button title={item.code} onPress={() => selectMapHandler(item)} />
                )}
            />

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