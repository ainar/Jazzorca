import React from 'react';

import { Provider } from 'react-redux';
import Store from './store/configureStore'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import ConnectedApp from './ConnectedApp';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import RNBootSplash from 'react-native-bootsplash';
import TrackPlayer from 'react-native-track-player'

const DarkTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#000'
    },
};

class App extends React.Component {
    constructor(props) {
        super(props)
        RNBootSplash.show();
        this.trackPlayer = TrackPlayer
    }

    render() {
        let persistor = persistStore(Store, null, () => RNBootSplash.hide({ duration: 250 }))
        return (
            <Provider store={Store}>
                <PersistGate persistor={persistor}>
                    <NavigationContainer theme={DarkTheme}>
                        <ConnectedApp />
                    </NavigationContainer>
                </PersistGate>
            </Provider>
        );
    }
};

export default App;
