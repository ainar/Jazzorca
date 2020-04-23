import React from 'react';

import { Provider } from 'react-redux';
import Store from './store/configureStore'
import setupPlayer from './helpers/setupPlayer';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import RNBootSplash from "react-native-bootsplash";
import ConnectedApp from './ConnectedApp';

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#000'
    },
};

class App extends React.Component {
    constructor(props) {
        super(props)
        setupPlayer()
            .then(() => RNBootSplash.hide({ duration: 250 }))
    }

    render() {

        return (
            <Provider store={Store}>
                <NavigationContainer theme={MyTheme}>
                    <ConnectedApp />
                </NavigationContainer>
            </Provider>
        );
    }
};

export default App;
