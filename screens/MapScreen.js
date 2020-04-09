import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SearchBar } from 'react-native-elements';
import _ from 'lodash'

import EditFormScreen from './EditFormScreen';
import firebase from '../firebase';
import { ScrollView } from 'react-native-gesture-handler';

let content = <View />;
//let testContent = <Text>Waiting</Text>
let buttonContent = null;
let searchResults = null;
let tileContent;


const MapScreen = props => {
    const [floors, setFloors] = useState([]);

    const [currFloor, setCurrFloor] = useState();

    const [enteredSearch, setEnteredSearch] = useState("");
    const [floorMatrix, setFloorMatrix] = useState();
    const [searchQR, setSearchQR] = useState("");

    const [searchResultsArr, setSearchResultsArr] = useState();
    const [openModal, setOpenModal] = useState(false);
    const [selectedTile, setSelectedTile] = useState();
    const [occupants, setOccupants] = useState({});

    const [mapViewOn, setMapViewOn] = useState(true);
    const [editFormOn, setEditFormOn] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            //alert('Screen was focused');
            // Do something when the screen is focused
            //tileContent;
            return () => {
                //alert('Screen was unfocused');
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );

    const buttonDisplay = () => {
        return (
            Object.keys(floors).map((floor, index) =>
                <Button key={floor} title={(index + 1).toString()} onPress={() => setCurrFloor(floors[floor])} />
            )
        )
    }

    useEffect(() => {
        console.log("useEffect[] (MapScreen)");

        var mapRef = firebase.firestore().collection("maps").doc(props.mapSelected.name);
        mapRef.get().then(function (map) {

            var floorArr = {};
            for (var i = 0; i < Object.keys(map.data().floors).length; i++) {
                floorArr[i] = {};
            }

            setFloors(map.data().floors);
            setCurrFloor(map.data().floors._0);
            var sortable = [];
            for (var tile in map.data().matrix) {
                var tileInfo = map.data().matrix[tile];
                var x = map.data().matrix[tile].coordinates[0];
                var y = map.data().matrix[tile].coordinates[1];//length
                var z = map.data().matrix[tile].coordinates[2];//width
                var str = "_" + x;
                var zLength = map.data().floors[str].width;
                var yLength = map.data().floors[str].length;
                //console.log(tile, ": ", z + y * zLength + x * zLength * yLength)
                sortable.push([tile, z + y * zLength + x * zLength * yLength, tileInfo]);
            }

            sortable.sort(function (a, b) {
                return a[1] - b[1];
            });

            sortable.forEach(function (item, index) {
                if (item[2].QRcode != "") {
                    var qr = item[2].QRcode;
                    item[2].QRdata = map.data().QRcodes[qr];
                }
                var floor = item[2].coordinates[0];
                floorArr[floor][item[0]] = item[2]
            })

            setFloorMatrix(floorArr);
        })

    }, []);



    const mapStyle = () => {
        //console.log("mapStyle")
        if (currFloor.length * 25 > 400) {
            return { height: 400 };
        } else {
            return { height: currFloor.length * 25 };
        }
    }
    const mapContainerStyle = () => {
        var style = {};
        //(currFloor)
        if (currFloor.length * 25 > 400) {
            return { height: 450 };
        } else {
            style.height = currFloor.length * 25 + 50;
            return style;
        }
    }

    if (floorMatrix != null && currFloor != null) {
        //console.log("currFloor: ", currFloor)
        //console.log("floorMatrix: ", floorMatrix[0])
        content = (
            <View style={[styles.mapContainer, mapContainerStyle()]}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.floorText}>Floor: </Text>
                    {buttonDisplay()}
                </View>
                <ScrollView
                    horizontal={true} maximumZoomScale={2}>
                    <FlatList
                        style={[styles.map, mapStyle()]}
                        key={currFloor.width}
                        keyExtractor={(item) => floorMatrix[currFloor.floor][item].location}
                        data={Object.keys(floorMatrix[currFloor.floor])}
                        renderItem={({ item, index }) => (
                            showTile(item)
                        )}
                        numColumns={currFloor.width}
                    />
                </ScrollView>
            </View>
        )
    }


    const displayTileInfo = async (tile) => {
        setSelectedTile(floorMatrix[currFloor.floor][tile]);
        setOpenModal(true);
        console.log(floorMatrix[currFloor.floor][tile].object);
        //let occ;
        let occupantArr = [];
        if (floorMatrix[currFloor.floor][tile].QRcode != "") {
            if (Object.keys(floorMatrix[currFloor.floor][tile].QRdata.occupants).length > 0) {
                console.log(floorMatrix[currFloor.floor][tile].QRdata.occupants);
                //var memberRef = firebase.firestore().collection("users").doc();

                for (const item in floorMatrix[currFloor.floor][tile].QRdata.occupants) {
                    //console.log("item: ",item);
                    await firebase.firestore().collection("users").doc(item).get().then(function (occupant) {
                        console.log(occupant.data().email);
                        occupantArr.push(occupant.data().email);
                    })
                }
                console.log(occupantArr);
            }
            setOccupants(occupantArr);

        }
    }
    if (selectedTile) {
        if (selectedTile.QRcode != "") {
            console.log(Object.keys(occupants).length)
            tileContent = (
                <View>
                    <Modal
                        visible={openModal}
                        transparent={true}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                            <View style={styles.Modal}>
                                <Text>{selectedTile.QRdata.type}</Text>
                                <View>
                                    {Object.keys(occupants).length !== 0 ? <View>{occupants.map((item) => <Text key={item}>{item}</Text>)}</View> : <View><Text>Vacant</Text></View>}
                                </View>
                                <TouchableOpacity style={styles.button} onPress={() => setOpenModal(false)}>
                                    <Text style={styles.buttonText}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            );
        } else if (typeof selectedTile.object != "undefined") {
            tileContent = (
                <View>
                    <Modal
                        visible={openModal}
                        transparent={true}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                            <View style={styles.Modal}>
                                <Text>{selectedTile.object.name}</Text>
                                <TouchableOpacity style={styles.button} onPress={() => setOpenModal(false)}>
                                    <Text style={styles.buttonText}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            );
        } else {
            tileContent = (
                <View>
                    <Modal
                        visible={openModal}
                        transparent={true}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                            <View style={styles.Modal}>
                                <Text>Undefined Tile</Text>
                                <TouchableOpacity style={styles.button} onPress={() => setOpenModal(false)}>
                                    <Text style={styles.buttonText}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View >
            );
        }
    }


    const showTile = (tile) => {
        return (
            <TouchableOpacity style={[styles.SquareShapeView, getStyles(tile)]} onPress={() => displayTileInfo(tile)}>
            </TouchableOpacity>)
    }



    const getStyles = tile => {
        //console.log(" test tile: ", floorMatrix[currFloor.floor][tile])
        var style = {};
        if (floorMatrix[currFloor.floor][tile].object) {
            style.backgroundColor = floorMatrix[currFloor.floor][tile].object.color;
            if (floorMatrix[currFloor.floor][tile].QRcode == searchQR && floorMatrix[currFloor.floor][tile].QRcode != "") {
                style.backgroundColor = '#e50096';
            } else if (floorMatrix[currFloor.floor][tile].QRcode != "" && floorMatrix[currFloor.floor][tile].QRdata.taken) {
                style.backgroundColor = 'red';
            }
        } else {
            style.backgroundColor = 'rgba(0,0,0,.3)';
        }

        return style;

    }


    useEffect(() => {
        if (floors != null) {
            console.log("256 searchQR: ", searchQR)
            searchResults = null;
            //testSetDisplay(0);
        }
    }, [searchQR])

    const handleSearchPress = async (item) => {
        console.log("263 item.scannedLocation.QR", item.scannedLocation.QR)
        if (item.scannedLocation.QR == null) {
            alert(item.email + " is not currently scanned in");
        }
        setSearchQR(item.scannedLocation.QR);
    }

    function ListItem({ item }) {
        return (
            <TouchableOpacity
                onPress={() => handleSearchPress(item)}
                style={styles.listItem}
            >
                <Text style={{ color: "black" }}>{item.email}</Text>
            </TouchableOpacity>
        );
    }

    const [t] = useState(() => _.debounce(search, 300));

    useEffect(() => {
        //console.log(enteredSearch)
        t(enteredSearch);
    }, [enteredSearch])

    async function search(inputText) {
        const memberArr = [];
        console.log("290 inputText: " + inputText);

        if (inputText != "") {

            const mapMemberRef = firebase.firestore().collection("maps").doc(props.mapSelected.name);
            await mapMemberRef.get().then(async function (map) {
                //console.log(map.id, " => ", map.data().members);
                //Object.keys(map.data().members).forEach(async function (doc) {
                for (var user in map.data().members) {
                    //console.log("user: ",  user );
                    const userRef = firebase.firestore().collection("users").doc(user);
                    await userRef.get().then(function (member) {
                        //console.log(member.id, " test=> ", member.data().email);
                        //console.log(member.data().email, " => ", member.data().email.includes(inputText));
                        if (member.data().email.includes(inputText) && memberArr.length < 5) {

                            memberArr.push({ email: member.data().email, uid: member.data().uid, scannedLocation: member.data().scannedLocation });
                        }

                    })
                }
                setSearchResultsArr(memberArr);
            }).catch(function (error) {
                console.log("Error getting documents: ", error);
            });
            //console.log("member array: ", memberArr);
            //console.log("Arr size: " + memberArr.length)
            /*searchResults = (
                <FlatList
                    keyExtractor={item => item.uid}
                    data={memberArr}
                    renderItem={({ item }) => (
                        <ListItem item={item} />
                    )}
                />
            );*/
        }
        else {
            /*console.log("327 search empty")
            searchResults = null;*/
            setSearchResultsArr();
        }
    }

    if (searchResultsArr) {
        searchResults = (
            <FlatList
                keyExtractor={item => item.uid}
                data={searchResultsArr}
                renderItem={({ item }) => (
                    <ListItem item={item} />
                )}
            />
        );
    } else {
        console.log("345 search empty")
        searchResults = null;
    }

    const openFormButtonHandler = () => {
        setMapViewOn(false);
        setEditFormOn(true);
    }

    const openMapView = () => {
        setMapViewOn(true);
        setEditFormOn(false);
    }

    if (mapViewOn) {
        return (
            <View style={styles.screenContainer}>
                <Text>Map Selected {props.mapSelected.name}</Text>
                <TouchableOpacity style={styles.objButton} onPress={() => openFormButtonHandler()}>
                    <Text style={styles.buttonText}>Edit My Form</Text>
                </TouchableOpacity>
                <SearchBar autoCapitalize='none' placeholder="Search" lightTheme round onChangeText={(inputText) => setEnteredSearch(inputText)} value={enteredSearch} />
                <View>{searchResults}</View>
                {content}
                <View>
                    {tileContent}
                </View>
            </View>
        );
    } else if (editFormOn){
        return (<EditFormScreen currUser={props.currUser} map={props.mapSelected.name} openMapView={() => openMapView()} />);
    }
};

const styles = StyleSheet.create({
    text: {
        color: 'white'
    },
    input: {
        height: 30,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        marginVertical: 10
    },
    screenContainer: {
        padding: 5
    },
    mapContainer: {
        height: 450,
        alignItems: 'center',
    },
    buttonContainer: {
        //borderColor: 'black',
        //borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    SquareShapeView: {
        width: 25,
        height: 25,
        borderColor: '#000',
        borderWidth: .25,
        backgroundColor: '#00BCD4'

    },
    Modal: {
        margin: 20,
        borderRadius: 20,
        padding: 35,
        justifyContent: "center",
        backgroundColor: "#3498db",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
        //borderColor: 'red', borderWidth: 1
    },
    button: {
        backgroundColor: '#2980b9',
        padding: 5,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 17
    },
    listItem: {
        backgroundColor: '#C2DEEB',
        padding: 10,
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 17
    },
    objButton: {
        backgroundColor: '#2980b9',
        padding: 5,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export default MapScreen;