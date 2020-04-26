import React from 'react';

import { Provider } from 'react-redux';
import Store from './store/configureStore'
import setupPlayer from './helpers/setupPlayer';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import RNBootSplash from "react-native-bootsplash";
import ConnectedApp from './ConnectedApp';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

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
        let persistor = persistStore(Store)
        return (
            <Provider store={Store}>
                <PersistGate persistor={persistor}>
                    <NavigationContainer theme={MyTheme}>
                        <ConnectedApp />
                    </NavigationContainer>
                </PersistGate>
            </Provider>
        );
    }
};

export default App;
