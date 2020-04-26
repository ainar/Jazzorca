import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import JOPlayer from '../Components/JOPlayer';
import Search from '../Components/Search';
import Icon from 'react-native-vector-icons/AntDesign'
import { createStackNavigator } from '@react-navigation/stack';
import CompactPlayer from '../Components/CompactPlayer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Related from '../Components/Related';
import Queue from '../Components/Queue';
import { Dimensions } from 'react-native';
import Home from '../Components/Home';

const Tab = createMaterialBottomTabNavigator();

class TabContainer extends React.Component {
    render() {
        return <>
            <Tab.Navigator
                barStyle={{
                    backgroundColor: 'black',
                    marginTop: 60
                }}
                tabBarOptions={{
                    activeTintColor: 'white',
                    labelPosition: 'beside-icon',
                    labelStyle: {
                    },
                    tabStyle: {
                        padding: 5,
                    },
                }}
            >
                <Tab.Screen name="Home" component={Home} options={{
                    tabBarIcon: () => (<Icon name='home' size={20} />),
                    title: 'Accueil'
                }} />
                <Tab.Screen name="Search" component={Search} options={{
                    tabBarIcon: () => (<Icon name='search1' size={20} />),
                    title: 'Rechercher'
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
            <PlayerTab.Screen name="Player" component={JOPlayer} />
            <PlayerTab.Screen name="Related" component={Related} />
        </PlayerTab.Navigator>
    }
}


export default function Navigation() {
    return (
        <PlayerStackContainer />
    );
}