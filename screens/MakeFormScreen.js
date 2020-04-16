import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, TextInput, Button, Picker, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';

import firebase from '../firebase';


/*maps.questions: {
    username: true, bio: true, 
    question1:{
        subquestion: true
    },
    question2: {
        subquestion: true,
        subquestion2: true
    }
}
*/
const MakeFormScreen = props => {
    const [usernameCheck, setUsernameCheck] = useState();
    const [bioCheck, setBioCheck] = useState();

    const [modalOpen, setModalOpen] = useState(false);
    const [questionEntered, setQuestionEntered] = useState();
    const [nest, setNest] = useState();

    const [dbForm, setDbForm] = useState();

    useEffect(() => {
        updateQuestionList();
    }, [])

 

    const addQuestionHandler = () => {
        var mapRef = firebase.firestore().collection('maps').doc(props.mapName);
        var objName = "form." + questionEntered;
        var name = questionEntered;
        if (nest != null) {
            objName = "form." + nest + "." + questionEntered
            name = nest + "." + questionEntered;
        }
        mapRef.update({
            [objName]: { name: name }
        });
        setModalOpen(false);
        setQuestionEntered();
        setNest();
        updateQuestionList();
    }

    const updateQuestionList = () => {
        var mapRef = firebase.firestore().collection('maps').doc(props.mapName);
        mapRef.get().then(function (map) {
            if (map.data().form) {
                setDbForm(map.data().form);
                if (map.data().form.username != null) {
                    setUsernameCheck(map.data().form.username);
                    setBioCheck(map.data().form.bio);
                }
                // var arr = [];
                // for(var question in map.data().form){
                //     console.log(form[question]);
                //     arr.push(form[question]);
                // }
                // console.log(arr);
            }
        });
    }

    

    const addButtonHandler = (name) => {
        setModalOpen(true);
        setNest(name);
    }
    const subButtonHandler = (name) => {
        setModalOpen(true);
        console.log(name)
        setNest(name);
    }


    const questionDisplay = (question, currObj) => {

        if (question !== 'bio' && question !== 'username' && question !== 'name') {
            if (Object.keys(currObj[question]).length == 1) {
                return (
                    <View key={question} flexDirection='row'>
                        <Text style={styles.question}>{question}</Text>
                        <TouchableOpacity style={styles.subButton} onPress={() => subButtonHandler(currObj[question].name)}>
                            <Text style={styles.buttonText}>+ Subsection</Text>
                        </TouchableOpacity>
                    </View>)
            } else {
                var newObj = currObj[question]
                return (
                    <View key={question}>
                        <Text style={styles.question}>{question}</Text>
                        <View style={{ marginLeft: 35 }}>
                            {Object.keys(newObj).map((newQuestion) =>
                                questionDisplay(newQuestion, newObj)
                            )}
                            <TouchableOpacity style={styles.addButton} onPress={() => addButtonHandler(newObj.name)}>
                                <Text style={styles.buttonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }
        }
    }

    let questionsView = <View><Text>Empty</Text></View>
    if (dbForm) {
        questionsView = (
            <View>
                {Object.keys(dbForm).map((question) =>
                    questionDisplay(question, dbForm)
                )}
            </View>
        )
    }


    let modalView = (
        <View>
            <Modal
                visible={modalOpen}
                transparent={true}>
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <View style={styles.createQuestionModal}>
                        <Text style={styles.text}>Create a Categorical Question Relevant to this Map</Text>
                        <TextInput placeholder="Question" placeholderTextColor="rgba(255,255,255,0.7)" style={styles.input} onChangeText={(inputText) => setQuestionEntered(inputText)} value={questionEntered} />
                        <TouchableOpacity style={styles.objButton} onPress={() => addQuestionHandler()}>
                            <Text style={styles.buttonText}>Done</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.objButton} onPress={() => { setModalOpen(false); setQuestionEntered(); updateQuestionList(); }}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );

    const updateUsernameHandler = () => {
        var mapRef = firebase.firestore().collection('maps').doc(props.mapName);
        var username = "form.username";
        mapRef.update({
            [username]: !usernameCheck,
        });
        setUsernameCheck(!usernameCheck)
    }

    const updateBioHandler = () => {
        var mapRef = firebase.firestore().collection('maps').doc(props.mapName);
        var bio = "form.bio";
        mapRef.update({
            [bio]: !bioCheck
        });
        setBioCheck(!bioCheck);
    }

    return (
        <ScrollView style={styles.container}>
            <View style={{ alignItems: 'center' }}>
                <Text style={[styles.text, { fontSize: 30, marginTop: 10, marginBottom: 15 }]}>Form</Text>
            </View>
            
{/*
            <CheckBox
                center
                title='Ask Members for a Username'
                checked={usernameCheck}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                onPress={() => {updateUsernameHandler()}}
                textStyle={{ color: 'white' }}
                style={{ color: 'white' }}
                checkedColor='white'
                uncheckedColor='white'
                containerStyle={{ backgroundColor: "#3498db", borderColor: '#3498db', margin: 0 }}
            />
            <CheckBox
                center
                title='Ask Members for a Bio'
                checked={bioCheck}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                onPress={() => {updateBioHandler()}}
                textStyle={{ color: 'white' }}
                style={{ color: 'white' }}
                checkedColor='white'
                uncheckedColor='white'
                containerStyle={{ backgroundColor: "#3498db", borderColor: '#3498db', margin: 0 }}
            />
        */}
            <Button title="back" onPress={() => props.goBack()} />
            <View style={{ alignItems: 'center' }}>
                <Text style={[styles.text, { fontSize: 30, marginTop: 35, marginBottom: 25 }]}>Form Questions</Text>
            </View>
            {questionsView}
            <TouchableOpacity style={styles.objButton} onPress={() => addButtonHandler()}>
                <Text style={styles.buttonText}>Create a Categorical  Question</Text>
            </TouchableOpacity>
            {modalView}
        </ScrollView>)
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#3498db",
        padding: 10,
        flex: 1
    },
    objButton: {
        backgroundColor: '#2980b9',
        padding: 5,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addButton: {
        backgroundColor: '#2980b9',
        marginBottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        width: 20,
        height: 20,
        borderRadius: 20 / 2,
    },
    subButton: {
        backgroundColor: '#2980b9',
        marginBottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15,
        width: 120,
        height: 20,
        borderRadius: 20 / 2,
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 17
    },
    createQuestionModal: {
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
        elevation: 5,
        width: 300
        //borderColor: 'red', borderWidth: 1
    },
    input: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.6)',
        marginBottom: 55,
        color: '#000',
        paddingHorizontal: 10
    },
    text: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 17,
        marginBottom: 15
    },
    question: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 17,
        marginBottom: 10
    }
});

export default MakeFormScreen;