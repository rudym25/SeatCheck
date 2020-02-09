import React, { useState } from 'react';
import { StyleSheet, Button, Text, View, TextInput } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import firebase from './firebase';
import Fire from './Fire';
import AuthenticationScreen from './screens/AuthenticationScreen';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import SettingsScreen from './screens/SettingsScreen';
import ScannerScreen from './screens/ScannerScreen';

//console.log("in app.js");

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
//const AuthStack = createStackNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currUser, setCurrUser] = useState({});
  const [selectedMap, setSelectedMap] = useState({});

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

  const HomeTabNavigator = () => (
    <Tab.Navigator>
      <Tab.Screen name="Home">
        {props => <HomeScreen {...props} currUser={currUser} onSelectMap={selectMap} />}
      </Tab.Screen>
      <Tab.Screen name="Scan" >
        {props => <ScannerScreen {...props} currUser={currUser} />}
      </Tab.Screen>
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )



  let content = (
    <Stack.Navigator>
      <Stack.Screen name="Authenticate" component={AuthenticationScreen} />
    </Stack.Navigator>
  );
  //let currScreen = "Authenticate";
  if (loggedIn) {
    content = (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeTabNavigator} />
        <Stack.Screen name="Map">
          {props => <MapScreen {...props} mapSelected={selectedMap} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
    //console.log("Logged in (App.js 52)");
    //currScreen = "Home";
    //() => navigation.navigate('Home')
  } else {
    //console.log("Not Logged In (App.js 56)");
    content = (
      <Stack.Navigator>
        <Stack.Screen name="Authenticate" component={AuthenticationScreen} />
      </Stack.Navigator>
    );
    //currScreen = "Authenticate"
  }
  /*<NavigationNativeContainer>
        <Stack.Navigator>
          <Stack.Screen name="Authenticate" component={AuthenticationScreen} />
          <Stack.Screen name="Home">
            {props => <HomeScreen {...props} currUser={currUser} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationNativeContainer>*/

  const selectMap = map => {
    //console.log("setSelectedMap(" , map , ") (App.js)");
    setSelectedMap(map);
  }

  return (
    <NavigationNativeContainer>
      {content}
    </NavigationNativeContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    margin: 10
  }
});
