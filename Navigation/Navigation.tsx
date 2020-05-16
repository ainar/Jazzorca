import * as React from 'react';
import { createMaterialBottomTabNavigator, MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import Player from '../Components/Player';
import Search from '../Components/Search';
import Icon from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import CompactPlayer from '../Components/Elements/CompactPlayer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Related from '../Components/Related';
import Queue from '../Components/Queue';
import { Dimensions } from 'react-native';
import Home from '../Components/Home';
import Library from '../Components/Library';
import PlaylistScreen from '../Components/Playlist';
import { Playlist } from '../helpers/types';
import { RouteProp } from '@react-navigation/core';


const PlaylistStack = createStackNavigator();

type PlaylistStackParamList = {
    Library: undefined;
    PlaylistScreen: { playlist: Playlist };
};

export type LibraryNavigationProp =  StackNavigationProp<PlaylistStackParamList, "Library">;
export type LibraryRouteProp =  RouteProp<PlaylistStackParamList, "Library">;
export type PlaylistScreenNavigationProp =  StackNavigationProp<PlaylistStackParamList, "PlaylistScreen">;
export type PlaylistScreenRouteProp =  RouteProp<PlaylistStackParamList, "PlaylistScreen">;

class PlaylistStackContainer extends React.Component {
    render() {
        return (
            <PlaylistStack.Navigator>
                <PlaylistStack.Screen
                    name="Library"
                    component={Library}
                    options={{
                        title: "Listes de lecture"
                    }}
                />
                <PlaylistStack.Screen
                    name="PlaylistScreen"
                    component={PlaylistScreen}
                />
            </PlaylistStack.Navigator>
        )
    }
}


const Tab = createMaterialBottomTabNavigator();

type TabParamList = {
    Home: undefined;
    Search: undefined;
    Library: undefined;
};

export type HomeTabNavigationProp =  MaterialBottomTabNavigationProp<TabParamList, "Home">;
export type SearchTabNavigationProp =  MaterialBottomTabNavigationProp<TabParamList, "Search">;
export type LibraryTabNavigationProp =  MaterialBottomTabNavigationProp<TabParamList, "Library">;

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
                <Tab.Screen name="Library" component={PlaylistStackContainer} options={{
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

type PlayerTabParamList = {
    Queue: undefined;
    Player: undefined;
    Related: undefined;
};

export type QueueTabNavigationProp =  MaterialBottomTabNavigationProp<PlayerTabParamList, "Queue">;
export type PlayerTabNavigationProp =  MaterialBottomTabNavigationProp<PlayerTabParamList, "Player">;
export type RelatedTabNavigationProp =  MaterialBottomTabNavigationProp<PlayerTabParamList, "Related">;

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