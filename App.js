import React, { useState } from 'react';
import { StyleSheet, Alert, Text, Modal,  View, TouchableHighlight, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { SearchBar } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { Button } from 'react-native'
import firebase from './firebase';
import AuthenticationScreen from './screens/AuthenticationScreen';
import MapListScreen from './screens/MapListScreen';
import MapScreen from './screens/MapScreen';
import JoinMapScreen from './screens/JoinMapScreen';
import ScannerScreen from './screens/ScannerScreen';
import ContactsScreen from './screens/ContactsScreen';
import AddContactScreen from './screens/AddContactScreen';
import BuildMapScreen from './screens/BuildMapScreen';

import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import LandingScreen from './screens/LandingScreen';

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    MenuProvider,
  } from 'react-native-popup-menu';

const Stack = createStackNavigator();
const SettingsStack = createStackNavigator();

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currUser, setCurrUser] = useState({});
  const [selectedMap, setSelectedMap] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

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
      <Drawer.Screen name="Create Map" component={BuildMapStackNavigation} />
      <Drawer.Screen name="Join Map" component={JoinMapStackNavigation} />
      <Drawer.Screen name="View Maps" component={ViewMapNavigator} />
      <Drawer.Screen name="Scan QR Code" component={ScanScreeNavigator} />
    </Drawer.Navigator>
  )

  
  const menuFunc = () => (
    <MenuProvider>
    <Menu >
    <MenuTrigger>
        <Icon
        name='user-circle-o'
        type='font-awesome' 
        color='#ffffff'/>
    </MenuTrigger> 
    <MenuOptions>

        (loggedIn==true
        ?
            <MenuOption onPress={LoginScreen}>Log In</MenuOption>
            <MenuOption onPress={RegistrationScreen}>Register</MenuOption>
        :
            <MenuOption onPress={ContactsScreen}>Contacts</MenuOption>
            <MenuOption onPress={MapListScreen}>View Your Maps</MenuOption>
            <MenuOption onPress={logoutInputHandler}>Log out</MenuOption>
        )
    </MenuOptions>
</Menu>
</MenuProvider>
  )

//stackNav={props.navigat} />}

  const HomeTabNavigator = () => (
    <Tab.Navigator>
    {/* 
      <Tab.Screen name="Maps List">
        {props => <MapListScreen {...props} currUser={currUser} onSelectMap={selectMap} />}
      </Tab.Screen>
      <Tab.Screen name="Scan" >
        {props => <ScannerScreen {...props} currUser={currUser} />}
      </Tab.Screen> */}
      <Tab.Screen name="Contacts">
        {props => <ContactsScreen {...props} currUser={currUser} />}
      </Tab.Screen>
    </Tab.Navigator>
  )

  const ScanScreeNavigator  = ({ navigation }) => (
    <SettingsStack.Navigator screenOptions={{
        headerStyle: {
            backgroundColor: "#3f51b5"
        },
        headerTintColor: '#FFFFFF',
            headerTitleStyle: {
            fontWeight: 'bold',
        }
}}>
      <SettingsStack.Screen name="Setting" options={{
        headerTitle: "Scan QR Code",
        headerLeft: () => (
            <Icon
            name='bars'
            type='font-awesome' color='#ffffff'
            onPress={() => navigation.openDrawer()}
          />),
        headerRight: () => (
        <Icon
        name='user-circle-o'
        type='font-awesome' color='#ffffff'
        onPress={() => setModalVisible(true)}
        />),

      }} >
        {props => <ScannerScreen {...props} currUser={currUser} />}
      </SettingsStack.Screen>
    </SettingsStack.Navigator>
  
  )

  const JoinMapStackNavigation = ({ navigation }) => (
    <SettingsStack.Navigator screenOptions={{
        headerStyle: {
            backgroundColor: "#3f51b5"
        },
        headerTintColor: '#FFFFFF',
            headerTitleStyle: {
            fontWeight: 'bold',
        }
}}>
      <SettingsStack.Screen name="Setting" options={{
        headerTitle: "Join Map",
        headerLeft: () => (
            <Icon
            name='bars'
            type='font-awesome' color='#ffffff'
            onPress={() => navigation.openDrawer()}
          />),
          headerRight: () => (
            <Icon
            name='user-circle-o'
            type='font-awesome' color='#ffffff'
            onPress={() => setModalVisible(true)}
            />)
      }} >
        {props => <JoinMapScreen {...props} currUser={currUser} />}
      </SettingsStack.Screen>
    </SettingsStack.Navigator>
  )

  const BuildMapStackNavigation = ({ navigation }) => (
    <SettingsStack.Navigator screenOptions={{
        headerStyle: {
            backgroundColor: "#3f51b5"
        },
        headerTintColor: '#FFFFFF',
            headerTitleStyle: {
            fontWeight: 'bold',
        }
}}>
      <SettingsStack.Screen name="Setting" options={{
        headerTitle: "Build Map",
        headerLeft: () => (
            <Icon
            name='bars'
            type='font-awesome' color='#ffffff'
            onPress={() => navigation.openDrawer()}
          />),
          headerRight: () => (
            <Icon
            name='user-circle-o'
            type='font-awesome' color='#ffffff'
            onPress={() => setModalVisible(true)}
            />)
      }} >
        {props => <BuildMapScreen {...props} currUser={currUser} />}
      </SettingsStack.Screen>
    </SettingsStack.Navigator>
  )
  
  const StackNavigation = ({ navigation }) => (
    <Stack.Navigator 
        screenOptions={{
            headerStyle: {
                backgroundColor: "#3f51b5"
            },
            headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                fontWeight: 'bold',
            }
    }}>
      <Stack.Screen name="Social Compass" options={{
        headerTitle: "Social Compass",
        headerLeft: () => (
            <Icon
            name='bars'
            type='font-awesome'
            color='#ffffff'
            onPress={() => navigation.openDrawer()}
          />),
          headerRight: () => (
                <Icon
                name='user-circle-o'
                type='font-awesome' color='#ffffff'
                onPress={() => setModalVisible(true)}
                />
          )
      }}>
        {props => <LandingScreen {...props} openModal={modalVisible} setOpenModal={setModalVisible}/>}
    </Stack.Screen>
    </Stack.Navigator>
  )

  const LoginNavigation = ({ navigation }) => (
    <SettingsStack.Navigator screenOptions={{
        headerStyle: {
            backgroundColor: "#3f51b5"
        },
        headerTintColor: '#FFFFFF',
            headerTitleStyle: {
            fontWeight: 'bold',
        }
}}>
      <SettingsStack.Screen name="LoginScreen" options={{
        headerTitle: "Login",
        headerLeft: () => (
            <Icon
            name='bars'
            type='font-awesome' color='#ffffff'
            onPress={() => navigation.openDrawer()}
          />),
        headerRight: () => (
            <Icon
            name='user-circle-o'
            type='font-awesome' color='#ffffff'
            onPress={() => setModalVisible(true)}
            />)
      }} >
        {props => <LoginScreen {...props} currUser={currUser} />}
      </SettingsStack.Screen>
    </SettingsStack.Navigator>
  )
  const RegisterNavigation = ({ navigation }) => (
    <SettingsStack.Navigator screenOptions={{
        headerStyle: {
            backgroundColor: "#3f51b5"
        },
        headerTintColor: '#FFFFFF',
            headerTitleStyle: {
            fontWeight: 'bold',
        }
}}>
      <SettingsStack.Screen name="RegistrationScreen" options={{
        headerTitle: "Register",
        headerLeft: () => (
            <Icon
            name='bars'
            type='font-awesome' color='#ffffff'
            onPress={() => navigation.openDrawer()}
          />),
        headerRight: () => (
            <Icon
            name='user-circle-o'
            type='font-awesome' color='#ffffff'
            onPress={() => setModalVisible(true)}
          />)
      }} >
        {props => <RegistrationScreen {...props} currUser={currUser} />}
      </SettingsStack.Screen>
    </SettingsStack.Navigator>
  )
  const ViewMapNavigator = ({ navigation }) => (
    <SettingsStack.Navigator screenOptions={{
        headerStyle: {
            backgroundColor: "#3f51b5"
        },
        headerTintColor: '#FFFFFF',
            headerTitleStyle: {
            fontWeight: 'bold',
        }
}}>
      <SettingsStack.Screen name="Account Options" options={{
        headerTitle: "View Your Maps",
        headerLeft: () => (
            <Icon
            name='bars'
            type='font-awesome' color='#ffffff'
            onPress={() => navigation.openDrawer()}
          />),
        headerRight: () => (
            <Icon
            name='user-circle-o'
            type='font-awesome' color='#ffffff'
            onPress={() => setModalVisible(true)}
            />)
      }} >
        {props => <MapListScreen {...props} currUser={currUser} />}
      </SettingsStack.Screen>
    </SettingsStack.Navigator>
  )
  const ContactStackNavigation = ({ navigation }) => (
    <SettingsStack.Navigator screenOptions={{
        headerStyle: {
            backgroundColor: "#3f51b5"
        },
        headerTintColor: '#FFFFFF',
            headerTitleStyle: {
            fontWeight: 'bold',
        }
}}>
      <SettingsStack.Screen name="Account Options" options={{
        headerTitle: "Contacts",
        headerRight: () => (
            <Icon
            name='user-circle-o'
            type='font-awesome' 
            color='#ffffff'
            onPress={() => navigation.openDrawer()}
          />)
      }} >
        {props => <ContactsScreen {...props} currUser={currUser} />}
      </SettingsStack.Screen>
    </SettingsStack.Navigator>
  )

  let content = (
    <Stack.Navigator screenOptions={{
        headerStyle: {
            backgroundColor: "#3f51b5"
        },
        headerTintColor: '#FFFFFF',
            headerTitleStyle: {
            fontWeight: 'bold',
        }
        
    }}>
      <Stack.Screen name="Social Compass" component={AuthenticationScreen}  options={{
        headerTitle: "Social Compass"
      }}

      
      />
    </Stack.Navigator>
  );

  //let currScreen = "Authenticate";
  if (loggedIn) {
    content = SettingsDrawer();
  } else {
    content = (
        <Stack.Navigator screenOptions={{
            headerStyle: {
                backgroundColor: "#3f51b5"
            },
            headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                fontWeight: 'bold',
            } 
        }}>
          <Stack.Screen name="Social Compass" component={AuthenticationScreen}  options={{
            headerTitle: "Social Compass"
          }}
          />
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
    container: {
        flex: 1,
        backgroundColor: "#fafafa",
        padding: 20
    },
    logoContainer: {
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    logo: {
        width: "100%",
        height: "50%"
    },
    title: {
        color: '#FFF',
        marginBottom: 30,
        width: 190,
        textAlign: 'center',
        opacity: 0.9,
        fontWeight: '700',
        fontSize: 25
    },
    input: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 15,
        color: '#FFF',
        paddingHorizontal: 10
    },
    buttonContainer: {
        backgroundColor: '#3f51b5',
        paddingVertical: 15,
        marginBottom: 10
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: '700'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      openButton: {
        backgroundColor: "#3f51b5",
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      },
      headerStyle: {
        backgroundColor: "#3f51b5",
        tintColor: "#FFFFFF",
        fontWeight: "bold"
      }
});

