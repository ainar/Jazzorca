import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Player from '../Components/Screens/Player';
import Search from '../Components/Screens/Search';
import Icon from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { createStackNavigator } from '@react-navigation/stack';
import CompactPlayer from '../Components/Elements/CompactPlayer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Related from '../Components/Screens/Related';
import Queue from '../Components/Screens/Queue';
import { Dimensions } from 'react-native';
import Home from '../Components/Screens/Home';
import Library from '../Components/Screens/Library';

const Tab = createMaterialBottomTabNavigator();

class TabContainer extends React.Component {
    render() {
        return <>
            <Tab.Navigator
                barStyle={{
                    backgroundColor: 'black',
                    marginTop: 60
                }}
                keyboardHidesNavigationBar={false}
            >
                <Tab.Screen name="Home" component={Home} options={{
                    tabBarIcon: () => (<Icon name='home' size={20} />),
                    title: 'Accueil'
                }} />
                <Tab.Screen name="Search" component={Search} options={{
                    tabBarIcon: () => (<Icon name='search1' size={20} />),
                    title: 'Rechercher'
                }} />
                <Tab.Screen name="Library" component={Library} options={{
                    tabBarIcon: () => (<MaterialIcons name='library-music' size={20} />),
                    title: 'Bibliothèque'
                }} />
            </Tab.Navigator>
            <CompactPlayer />
        </>
    }
}


const PlayerStack = createStackNavigator()

class PlayerStackContainer extends React.Component {
    render() {
        return <PlayerStack.Navigator
            headerMode={"none"}
        >
            <PlayerStack.Screen name="Base" component={TabContainer} />
            <PlayerStack.Screen name="Player" component={PlayerTabContainer} />
        </PlayerStack.Navigator>
    }
}

const PlayerTab = createMaterialTopTabNavigator()

class PlayerTabContainer extends React.Component {
    render() {
        return <PlayerTab.Navigator
            tabBar={() => <></>}
            backBehavior='initialRoute'
            initialRouteName='Player'
            initialLayout={{
                height: 0,
                width: Dimensions.get('window').width,
            }}
        >
            <PlayerTab.Screen name="Queue" component={Queue} />
            <PlayerTab.Screen name="Player" component={Player} />
            <PlayerTab.Screen name="Related" component={Related} />
        </PlayerTab.Navigator>
    }
}


export default function Navigation() {
    return (
        <PlayerStackContainer />
    );
}