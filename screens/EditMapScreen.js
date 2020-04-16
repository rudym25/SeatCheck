import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, TextInput, Button, Picker, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';

import MakeFormScreen from './MakeFormScreen';
import firebase from '../firebase';

let content = <View />
let colors = ['#f69f8c', '#ffd2ab', '#ff0000', '#5201cf', '#ffd700', '#cee92f', '#e94a2f', '#a72fe9', '#2fe9a7', '#3399ff', '#2f71e9', '#e9a72f', '#e92f71', '#2fcee9', '#2fe94a']
const EditMapScreen = props => {
    const [editScreen, setEditScreen] = useState(true);
    const [formScreen, setFormScreen] = useState(false);

    const [selectedMapName, setSelectedMapName] = useState();
    const [usersMaps, setUsersMaps] = useState([]);
    const [objSelectedName, setObjSelectedName] = useState();
    const [selectedMapObjects, setSelectedMapObjects] = useState([]);

    const [currFloor, setCurrFloor] = useState(0);
    const [floors, setFloors] = useState();
    const [floorMatrix, setFloorMatrix] = useState();

    const [qrOneForAll, setQrOneForAll] = useState(false);
    const [qrOneEach, setQrOneEach] = useState(false);

    const [selectedTiles, setSelectedTiles] = useState([]);
    const [openCreateObjectView, setOpenCreateObjectView] = useState(false);
    const [newObjectName, setNewObjectName] = useState();
    //const [newObjectSize, setNewObjectSize] = useState();
    const [newObjectColor, setNewObjectColor] = useState(colors[0]);
    //const [qrObjectCheck, setQrObjectCheck] = useState(false);
    const [newObjectCapacity, setNewObjectCapacity] = useState();

    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused

            return () => {
                //alert('Screen was unfocused');
                // Do something when the screen is unfocused
                // Useful for cleanup functions
                setFloorMatrix();
                setFloors();
                setCurrFloor();
            };
        }, [])
    );

    useEffect(() => {
        //console.log("props.selectedMap: ", props.selectedMap);
        setEditScreen(true);
        setUsersMaps([]);
        setSelectedTiles([]);

        var userRef = firebase.firestore().collection('users').doc(props.currUser.uid);
        userRef.get().then(function (doc) {
            //console.log(doc.data().allMyMaps)
            var allMaps = doc.data().allMyMaps;
            var arr = [];
            for (var map in allMaps) {
                //console.log(allMaps[map].name);
                if (allMaps[map].authUser) {
                    //setUsersMaps((usersMaps) => [...usersMaps, allMaps[map].name]);
                    arr.push(allMaps[map].name);
                }
            }
            setUsersMaps(arr);

            if (props.selectedMap != null && props.selectedMap != '') {
                console.log("props.selectedMap is not null")
                //setSelectedMap(props.selectedMap);
                setSelectedMapName(props.selectedMap);
                mapSelectedChanged(props.selectedMap);
            } else if (arr.length) {
                setSelectedMapName(arr[0]);
                mapSelectedChanged(arr[0]);
            }
        })

    }, [])



    const colorCircleStyle = (color) => {
        if (color === newObjectColor) {
            return {
                backgroundColor: color,
                borderColor: 'black',
                borderWidth: 3,
                width: 30,
                height: 30,
                borderRadius: 30 / 2,
            }
        }
        else {
            return { backgroundColor: color }
        }
    }

    const createButtonHandler = () => {
        if (newObjectName == null) {
            alert("Fill in Every Entry")
        } else {


            var obj = "mapObjects." + newObjectName;
            var mapRef = firebase.firestore().collection('maps').doc(selectedMapName);
            mapRef.update({
                [obj]: { name: newObjectName, color: newObjectColor }
            });

            mapObjectsChanged();
            setOpenCreateObjectView(false);
            setNewObjectName();
        }
    }

    let createObjectView = (
        <View>
            <Modal
                visible={openCreateObjectView}
                transparent={true}
            >
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <View style={styles.createObjectModal}>
                        <TextInput placeholder="Object Name" autocorrect={false} autoCapitalize='none' placeholderTextColor="rgba(255,255,255,0.7)" style={styles.input} onChangeText={(inputText) => setNewObjectName(inputText)} value={newObjectName} />

                        <View style={{ height: 70 }}>
                            <ScrollView horizontal={true} >
                                {colors.map((color) => {
                                    return <TouchableOpacity key={color} style={[styles.CircleShapeView, colorCircleStyle(color)]}
                                        onPress={() => setNewObjectColor(color)}
                                    />
                                })}
                            </ScrollView>
                        </View>

                        <TouchableOpacity style={styles.objButton} onPress={() => createButtonHandler()}>
                            <Text style={styles.buttonText}>Create</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.objButton} onPress={() => setOpenCreateObjectView(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );


    let chosenMapView = (
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={selectedMapName}
                itemStyle={styles.picker}
                onValueChange={(itemValue) => mapSelectedChanged(itemValue)
                }>
                {usersMaps.map((item, index) => {
                    return (<Picker.Item label={item} value={item} key={index} />)
                })}
            </Picker>
        </View>
    );

    const mapObjectsChanged = () => {
        var mapRef = firebase.firestore().collection('maps').doc(selectedMapName);
        mapRef.get().then(function (map) {
            if (map.data().mapObjects != null) {
                var arr = [];
                for (var object in map.data().mapObjects) {
                    arr.push(object)
                }
                setSelectedMapObjects(arr);
                setObjSelectedName(arr[0]);
            }
        })
    }

    const mapSelectedChanged = (mapName) => {
        setSelectedMapName(mapName);
        var mapRef = firebase.firestore().collection('maps').doc(mapName);
        mapRef.get().then(function (map) {

            if (map.data().mapObjects != null) {
                var arr = [];
                for (var object in map.data().mapObjects) {
                    arr.push(object)
                }
                setSelectedMapObjects(arr);
                setObjSelectedName(arr[0]);
            }
            //copying  start
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


            //copying end
        })
    }


    const mapStyle = () => {
        if (currFloor.length * 25 > 400) {
            return { height: 400 };
        } else {
            return { height: currFloor.length * 25 };
        }
    }

    const mapContainerStyle = () => {
        if (currFloor.length * 25 > 400) {
            return { height: 450 };
        } else {
            return { height: currFloor.length * 25 + 50 };
        }
    }

    if (floorMatrix != null) {
        //console.log("currFloor: ", currFloor)
        //console.log("floorMatrix: ", floorMatrix)
        content = (
            <View style={[styles.mapContainer, mapContainerStyle()]}>
                <View style={styles.floorButtonsContainer}>
                    <Text style={styles.floorText}>Floor: </Text>
                    {Object.keys(floors).map((floor, index) =>
                        <Button color='white' key={floor} title={(index + 1).toString()} onPress={() => setCurrFloor(floors[floor])} />)}
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

    const oneEachCheckHandler = () => {
        if (qrOneEach)
            setQrOneEach(false)
        else {
            setQrOneEach(true)
            setQrOneForAll(false)
        }
    }

    const oneAllCheckHandler = () => {
        if (qrOneForAll)
            setQrOneForAll(false)
        else {
            setQrOneForAll(true)
            setQrOneEach(false)
        }
    }

    const doneButtonHandler = () => {

        var mapRef = firebase.firestore().collection('maps').doc(selectedMapName);
        var objSelected = {};
        var objColor;
        mapRef.get().then(function (doc) {
            objSelected = doc.data().mapObjects[objSelectedName];

            objColor = objSelected.color;

            var random;
            var QRname;
            var QR;
            var limit = 0;
            if (newObjectCapacity)
                limit = parseInt(newObjectCapacity);

            if (qrOneForAll) {
                random = Math.floor(Math.random() * 10000);
                QRname = "QR" + random;
                while (doc.data().qrCodes && doc.data().qrCodes[QRname]) {
                    random = Math.floor(Math.random() * 10000);
                    QRname = "QR" + random;
                }
                QR = "QRcodes." + QRname;
                mapRef.update({
                    [QR]: { name: QRname, type: objSelectedName, capacity: limit, taken: false, occupants: {} }
                })
            }


            for (var tile in selectedTiles) {
                var tileName = "matrix." + selectedTiles[tile] + ".object";
                mapRef.update({
                    [tileName]: { name: objSelectedName, color: objColor }
                })


                if (qrOneForAll) {
                    var tileQr = "matrix." + selectedTiles[tile] + ".QRcode";
                    mapRef.update({
                        [tileQr]: [QRname],
                    })
                }
                else if (qrOneEach) {
                    random = Math.floor(Math.random() * 10000);
                    QRname = "QR" + random;
                    while (doc.data().qrCodes && doc.data().qrCodes[QRname]) {
                        random = Math.floor(Math.random() * 10000);
                        QRname = "QR" + random;
                    }

                    var tileQr = "matrix." + selectedTiles[tile] + ".QRcode"
                    QR = "QRcodes." + QRname;

                    mapRef.update({
                        [tileQr]: [QRname],
                        [QR]: { name: QRname, type: objSelectedName, capacity: limit, taken: false, occupants: {} }
                    })
                }

                floorMatrix[currFloor.floor][selectedTiles[tile]].selected = false;
                floorMatrix[currFloor.floor][selectedTiles[tile]].object = {};
                floorMatrix[currFloor.floor][selectedTiles[tile]].object.color = objColor;

            }

            setNewObjectCapacity();
            setQrOneEach(false);
            setQrOneForAll(false);
            setSelectedTiles([]);
        })
    }

    const doneButton = () => {
        if (selectedTiles.length) {
            //console.log("in here")
            return (
                <View>
                    <CheckBox
                        center
                        title='Create a QR code for EACH tile selected'
                        checked={qrOneEach}
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        onPress={() => oneEachCheckHandler()}
                        textStyle={{ color: 'white' }}
                        style={{ color: 'white' }}
                        checkedColor='white'
                        uncheckedColor='white'
                        containerStyle={{ backgroundColor: "#3498db", borderColor: '#3498db', margin: 0 }}
                    />
                    <CheckBox
                        center
                        title='Create a QR code for ALL tiles selected  '
                        checked={qrOneForAll}
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        onPress={() => oneAllCheckHandler()}
                        textStyle={{ color: 'white' }}
                        style={{ color: 'white' }}
                        checkedColor='white'
                        uncheckedColor='white'
                        containerStyle={{ backgroundColor: "#3498db", borderColor: '#3498db', margin: 0 }}
                    />
                    {qrOneEach || qrOneForAll ? <TextInput placeholder="Occupant Capacity, leave blank if there is none " autocorrect={false} autoCapitalize='none' placeholderTextColor="rgba(255,255,255,0.7)" style={styles.input} onChangeText={(inputText) => setNewObjectCapacity(inputText)} value={newObjectCapacity} /> : <View />}
                    <TouchableOpacity style={styles.objButton} onPress={() => doneButtonHandler()}>
                        <Text style={styles.buttonText}>Done</Text>
                    </TouchableOpacity>
                </View>)
        } else {
            //console.log("herere")
        }
    }

    const showTile = (tile) => {
        return (
            <TouchableOpacity style={[styles.SquareShapeView, getStyles(tile)]}
                onPress={() => selectTile(tile)}
            />)
    }

    const selectTile = (tile) => {

        if (floorMatrix[currFloor.floor][tile].selected) {
            floorMatrix[currFloor.floor][tile].selected = false;
            setSelectedTiles(selectedTiles => selectedTiles.filter(name => name !== tile))
        } else {
            floorMatrix[currFloor.floor][tile].selected = true;
            setSelectedTiles([...selectedTiles, tile])
        }

        console.log(selectedTiles)

    }

    const getStyles = tile => {
        //console.log("tile: ", tile)
        var style = {};
        if (floorMatrix[currFloor.floor][tile] != null) {
            if (floorMatrix[currFloor.floor][tile].object) {
                style.backgroundColor = floorMatrix[currFloor.floor][tile].object.color;
            } else {
                style.backgroundColor = 'rgba(0,0,0,.3)';
            }
            if (floorMatrix[currFloor.floor][tile].selected) {
                style.backgroundColor = 'rgba(0,0,0,.8)'
            }

        }
        return style;
    }

    let mapObjectsPicker = (
        <Picker
            selectedValue={objSelectedName}
            itemStyle={styles.picker}
            onValueChange={(itemValue) => setObjSelectedName(itemValue)
            }>
            {selectedMapObjects.map((item, index) => {
                return (<Picker.Item label={item} value={item} key={index} />)
            })}
        </Picker>
    );

    const createFormInputHandler = () => {
        setEditScreen(false);
        setFormScreen(true);
    }

    const goBackHandler = () => {
        setEditScreen(true);
        setFormScreen(false);
    } 

    if (editScreen) {
        return (
            <ScrollView style={styles.container}>
                {chosenMapView}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => createFormInputHandler()}>
                        <Text style={styles.buttonText}>Map Form</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => createMapInputHandler()}>
                        <Text style={styles.buttonText}>Manage Members</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => editMapInputHandler()}>
                        <Text style={styles.buttonText}>More Options</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.mapObjectsContainer}>
                    {mapObjectsPicker}
                    <TouchableOpacity style={styles.objButton} onPress={() => setOpenCreateObjectView(true)}>
                        <Text style={styles.buttonText}>Create New Object</Text>
                    </TouchableOpacity>
                    {createObjectView}
                </View>
                {content}
                {doneButton()}
                <Button title="Cancel" onPress={() => props.goBack()} />
            </ScrollView>
        )
    }else if(formScreen){
        return(
        <MakeFormScreen currUser={props.currUser} mapName={selectedMapName} goBack={() => goBackHandler()} />)
    }


};

const styles = StyleSheet.create({

    container: {
        backgroundColor: "#3498db",
        padding: 10
    },
    buttonContainer: {
        marginVertical: 10,
        flexDirection: 'row',
        //borderColor: 'black',
        //borderWidth: 1
    },
    mapContainer: {
        //borderColor: 'green',
        //borderWidth: 1,
        height: 450,
        alignItems: 'center',

    },
    floorButtonsContainer: {
        //borderColor: 'black',
        //borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    map: {
        //borderColor: 'red',
        //borderWidth: 2,
    },
    mapObjectsContainer: {
        //borderColor: 'black',
        //borderWidth: 1,
        flex: 1
    },
    createObjectModal: {
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
        flex: 1,
        backgroundColor: '#2980b9',
        padding: 5,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    objButton: {
        backgroundColor: '#2980b9',
        padding: 5,
        marginBottom: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 17
    },
    pickerContainer: {

    },
    picker: {
        //borderColor: 'red',
        //borderWidth: 1,
        height: 100
    },
    objPicker: {
        height: 65

    },
    floorText: {
        fontSize: 20,
        color: 'white'
    },
    SquareShapeView: {
        width: 25,
        height: 25,
        borderColor: '#000',
        borderWidth: .25,
        backgroundColor: '#00BCD4'
    },
    CircleShapeView: {
        width: 25,
        height: 25,
        borderRadius: 25 / 2,
        backgroundColor: '#00BCD4',
        marginRight: 5
    },
    input: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.6)',
        marginBottom: 15,
        color: '#000',
        paddingHorizontal: 10
    }

});

export default EditMapScreen;