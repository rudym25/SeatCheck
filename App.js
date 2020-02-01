import React, { useState } from 'react';
import { StyleSheet, Button, Text, View, TextInput } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import firebase from './firebase';
import Fire from './Fire';
import AuthenticationScreen from './screens/AuthenticationScreen';
import HomeScreen from './screens/HomeScreen';

//console.log("in app.js");

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currUser, setCurrUser] = useState({});

    firebase.auth().onAuthStateChanged(user => {
      //console.log("In onAuthStateChange (App.js)")
      if (user && !loggedIn) {
        //console.log(user.email + " logged in (App.js)");
          setLoggedIn(true);
          setCurrUser(user);
      } else if (!user && loggedIn) {
        //console.log("Not logged in (App.js)");
        setLoggedIn(false);
        setCurrUser({});
      }
    });

  let content = <AuthenticationScreen />

  if (loggedIn) {
    //console.log("set content to HomeScreen (App.js)");
    content = <HomeScreen currUser={currUser}/>;
  } else {
    //console.log("set content to AuthenticationScreen (App.js)");
    content = <AuthenticationScreen />;
  }


  return (
    <View style={styles.screen}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    margin: 10
  }
});
