import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, TextInput, Button, Picker, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';

import firebase from '../firebase';

const EditFormScreen = props => {
    const [dbForm, setDbForm] = useState();

    useEffect(() => {
        updateFormDisplay();
    }, [])

    const updateFormDisplay = () => {
        var mapRef = firebase.firestore().collection('maps').doc(props.map);
        mapRef.get().then(function (map) {
            if (map.data().form) {
                setDbForm(map.data().form);
            }
        })
    }

    const questionListDisplay = (list) => {
        console.log("List name:", list.name);
        return (
            Object.keys(list).map((question) =>
                questionDisplay(question, list)
            )
        )
    }

    const expandList = (question, list) => {
        //console.log(list);
        
        if(list.name!=null){
            //console.log("ExpandList: ", list.name)
            //console.log(dbForm[list.name])
            dbForm[list.name].expand = true;
        }else{
            console.log("ExandList: Whole Form")
        }
        //console.log(dbForm)
        setDbForm(dbForm);
        //console.log(dbForm[question]);

    }

    const questionDisplay = (question, list) => {
        if (question !== 'bio' && question !== 'username' && question !== "name" && question != "expand") {
            let expand = null;
            //let subQuestion = null;
            //console.log("44 question", question)
            if (Object.keys(list[question]).length > 1) {
                expand = (
                    <TouchableOpacity onPress={() => expandList(question, list[question])}>
                        <Text>+</Text>
                    </TouchableOpacity>
                )
                if (list[question].expand != null && list[question].expand){

                    console.log("I make it in: ", dbForm[list[question].name]);
                    //console.log("53 question: ", question);
                    //subQuestion = questionListDisplay(list[question]);
                }
            }

            //{(Object.keys(list[question]).length > 1 && list[question].expand != null && list[question].expand) ? questionListDisplay(list[question]) : null}

            return (
                <View key={question}>
                    <View  flexDirection='row'>
                        <Text >{question}</Text>
                        {expand}
                    </View>
                    {(Object.keys(list[question]).length > 1 && dbForm[list[question].name].expand) ? <Text>Testing-----</Text> : null}
                </View>
            )
        }
    }

    let questions = null;
    if (dbForm) {
        let username = null;
        let bio = null;
        if (dbForm.username) {
            username = (
                <Text>Create a username for this map</Text>
            );
        }
        if (dbForm.bio) {
            bio = (
                <Text>Write a bio relevant to {props.map}</Text>
            )
        }

        questions = (
            <View>
                {username}{bio}
                <View>
                    {questionListDisplay(dbForm)}
                </View>
            </View>
        )

    }



    return (
        <View>
            {questions}
            <Button title="Map View" onPress={() => props.openMapView()} />
        </View>
    )
};

const styles = StyleSheet.create({

});

export default EditFormScreen;