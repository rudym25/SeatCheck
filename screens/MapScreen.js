import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import firebase from '../firebase';

let content = <Text>Waiting</Text>;

const MapScreen = props => {
    const [matrix, setMatrix] = useState([]);
    const [test, setTest] = useState(); //using to refresh page
    const [floors, setFloors] = useState([]);
    const [currFloor, setCurrFloor] = useState();
    const [test1, setTest1] = useState([]);

    useEffect(() => {
        console.log("useEffect[] (MapScreen)");
        props.navigation.setOptions({ title: props.mapSelected.name });
        var mapRef = firebase.firestore().collection("maps").doc(props.mapSelected.code);
        mapRef.get().then(function (map) {
            //setMatrix(map.data().matrix);

            var arr = [];
            Object.keys(map.data().matrix.floors).forEach(function (floor) {
                arr[map.data().matrix.floors[floor].floor] = [];
                //console.log("In Here: ", tiles.floors[floor].floor);
                for (var num2 = 0; num2 < map.data().matrix.floors[floor].length; num2++) {
                    arr[map.data().matrix.floors[floor].floor][num2] = [];
                    for (var num3 = 0; num3 < map.data().matrix.floors[floor].width; num3++) {
                        arr[map.data().matrix.floors[floor].floor][num2][num3] = {};
                    }
                }
            })
            Object.keys(map.data().matrix).forEach(function (tile) {
                //console.log("!!!arr!!!!: ",map.data().matrix[tile]);
                if (tile != "floors"){
                    var floor = map.data().matrix[tile].coordinates[0];
                    var length = map.data().matrix[tile].coordinates[1];
                    var width = map.data().matrix[tile].coordinates[2];
                    //console.log("floor: "+ floor + " length: "+ length + " width: "+ width);
                    arr[floor][length][width] = map.data().matrix[tile];
                }
            })
            console.log("!!!arr!!!! \n", arr);
            setMatrix(arr);

        })
        /*setTest1(
            [
                [
                    ['1'], ['2']
                ],
                [
                    ['3']
                ]
            ]
        )*/
        
        //createDisplay();
    }, []);

    const displayFloor = floorNum => {
        setCurrFloor(floorNum);
    }

    const createDisplay = () => {
        if (matrix.length != 0) {
            setFloors([]);
            for (var i = 0; i < matrix.length; i++) {
                var temp;
                temp = (
                    <View>
                        {
                            matrix[0].map(length => <View key={Math.random()} flexDirection='row'>{
                                length.map(tile => <Text key={tile.location}>{tile.location}</Text>
                                )
                            }
                            </View>
                            )
                        }
                    </View>
                );

                setFloors(floors => [...floors, temp])
                console.log("floors.length: " + floors.length);
            }

            /*content = (
                <View>
                    <Text>Testing iteration here</Text>
                    {
                        matrix[0].Length.map(length => <View flexDirection='row'>{
                            length.Width.map(tile => <Text key={tile.location}>{tile.location}</Text>
                            )
                        }
                        </View>
                        )
                    }
                </View>
            );*/
            setTest("Doing this to refresh page");
            displayFloor(0);
            console.log("content has been set");
            for (var j = 0; j < matrix[0].length; j++) {
                //console.log(map.data().matrix[0].Length[0].Width[i].location);
                for (var i = 0; i < matrix[0][0].length; i++) {
                    console.log(matrix[0][j][i].location);
                }
            }

        }
    }
    useEffect(() => {
        console.log("useEffect[matrix] (MapScreen)");
        createDisplay();
    }, [matrix]);

    useEffect(() => {
        console.log("useEffect[floors] (MapScreen)");
        if (floors.length > 0) {
            content = floors[currFloor];
            setTest("test");
        }
        if(test1.length != 0){
            console.log("test1: ",test1[0][0][0]);
        }
    }, [floors, currFloor]);

    return (
        <View>
            <Text>MAP Selected is {props.mapSelected.name}</Text>
            {content}
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

export default MapScreen;