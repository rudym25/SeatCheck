import React, { useState } from 'react';
import { StyleSheet, Button, Text, View, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { SearchBar } from 'react-native-elements';

import firebase from './firebase';
import AuthenticationScreen from './screens/AuthenticationScreen';
import MapListScreen from './screens/MapListScreen';
import MapScreen from './screens/MapScreen';
import JoinMapScreen from './screens/JoinMapScreen';
import ScannerScreen from './screens/ScannerScreen';
import ContactsScreen from './screens/ContactsScreen';
import AddContactScreen from './screens/AddContactScreen';
import BuildMapScreen from './screens/BuildMapScreen';


const Stack = createStackNavigator();
const SettingsStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

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

  const logoutInputHandler = () => {
    firebase.auth().signOut().then(function () {
      // sign out successful
      console.log("Sign out successful (MapListScreen.js)")
      //props.checkAuth;
    }, function (error) {
      //an error
    });
  };

  function CustomDrawer(props) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Logout"
          onPress={logoutInputHandler}
        />
      </DrawerContentScrollView>

    );
  }

  const SettingsDrawer = () => (
    <Drawer.Navigator initialRouteName="Home" drawerContent={props => CustomDrawer(props)}>
      <Drawer.Screen name="Home" component={StackNavigation} />
      <Drawer.Screen name="Join Map" component={JoinMapStackNavigation} />
      <Drawer.Screen name="Add Contact" component={AddContactStackNavigation} />
      <Drawer.Screen name="Build Map" component={BuildMapStackNavigation} />
    </Drawer.Navigator>
  )
//stackNav={props.navigat} />}
  const HomeTabNavigator = () => (
    <Tab.Navigator>
      <Tab.Screen name="Maps List">
        {props => <MapListScreen {...props} currUser={currUser} onSelectMap={selectMap} />}
      </Tab.Screen>
      <Tab.Screen name="Scan" >
        {props => <ScannerScreen {...props} currUser={currUser} />}
      </Tab.Screen>
      <Tab.Screen name="Contacts">
        {props => <ContactsScreen {...props} currUser={currUser} />}
      </Tab.Screen>
    </Tab.Navigator>
  )

  const AddContactStackNavigation = ({ navigation }) => (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Setting" options={{
        headerTitle: "Add Contact",
        headerLeft: () => (
          <Button
            onPress={() => navigation.openDrawer()}
            title="Settings"
          />)
      }} >
        {props => <AddContactScreen {...props} currUser={currUser} />}
      </SettingsStack.Screen>
    </SettingsStack.Navigator>
  )

  const JoinMapStackNavigation = ({ navigation }) => (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Setting" options={{
        headerTitle: "Join Map",
        headerLeft: () => (
          <Button
            onPress={() => navigation.openDrawer()}
            title="Settings"
          />)
      }} >
        {props => <JoinMapScreen {...props} currUser={currUser} />}
      </SettingsStack.Screen>
    </SettingsStack.Navigator>
  )

  const BuildMapStackNavigation = ({ navigation }) => (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Setting" options={{
        headerTitle: "Build Map",
        headerLeft: () => (
          <Button
            onPress={() => navigation.openDrawer()}
            title="Settings"
          />)
      }} >
        {props => <BuildMapScreen {...props} currUser={currUser} />}
      </SettingsStack.Screen>
    </SettingsStack.Navigator>
  )

  const StackNavigation = ({ navigation }) => (
    <Stack.Navigator>
      <Stack.Screen name="Social Compass" component={HomeTabNavigator} options={{
        headerLeft: () => (
          <Button
            onPress={() => navigation.openDrawer()}
            title="Settings"
          />)
      }} />
      <Stack.Screen name="Map">
        {props => <MapScreen {...props} mapSelected={selectedMap} />}
      </Stack.Screen>
    </Stack.Navigator>
  )


  let content = (
    <Stack.Navigator>
      <Stack.Screen name="Authenticate" component={AuthenticationScreen} />
    </Stack.Navigator>
  );

  //let currScreen = "Authenticate";
  if (loggedIn) {
    content = SettingsDrawer();
  } else {
    content = (
      <Stack.Navigator>
        <Stack.Screen name="Authenticate" component={AuthenticationScreen} />
      </Stack.Navigator>
    );
  }

  const selectMap = map => {
    setSelectedMap(map);
  }

  return (
    <NavigationContainer>
      {content}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({

});
