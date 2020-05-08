import React, { ComponentProps } from 'react';
import { Provider } from 'react-redux';
import Store from './store/configureStore'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import RNBootSplash from 'react-native-bootsplash';
import Navigation from './Navigation/Navigation';
import TrackPlayer, { Track, State, addEventListener } from 'react-native-track-player';
import { autoSetCurrentTrack, autoAddToQueue, resetQueue } from './store/actions';
import { Action } from 'redux';
import setupPlayer from './helpers/setupPlayer';

const DarkTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#000'
    },
};

class App extends React.Component {
    constructor(props: ComponentProps<any>) {
        super(props)
        RNBootSplash.show();

        setupPlayer()

        addEventListener(
            'playback-state',
            ({ state }: { state: State }) => this._setPlayerState(state)
        );

        addEventListener(
            'playback-track-changed',
            ({ nextTrack }: { nextTrack: string }) => this._setCurrentTrack(nextTrack)
        );
    }

    _setPlayerState(state: State) {
        const { dispatch } = Store

        dispatch({
            type: 'SET_STATE',
            value: state
        })
    }

    _setCurrentTrack(queueId: string) {
        const { dispatch } = Store
        const { queue } = Store.getState().playerState

        if (queueId !== undefined) {
            if (queue === undefined) {
                console.error('queue should be defined here')
                return
            }

            const track = queue.find((t: Track) => t.id === queueId)
            if (track !== undefined) {
                dispatch(autoSetCurrentTrack(track) as unknown as Action)

                // if it's the last track, add a related track
                if (queue.length > 0 && queue[queue.length - 1].id === queueId) {
                    this._addRelatedTrackToQueue(track)
                }
            }
        }
    }

    async _addRelatedTrackToQueue(track: Track) {
        const { dispatch } = Store
        const { queue } = Store.getState().playerState
        const related = track.related.results
        const unseenRelatedTrack = related.find(
            (t: Track) => queue.findIndex(tq => tq.videoId === t.videoId) === -1
        )
        dispatch(autoAddToQueue(unseenRelatedTrack) as unknown as Action)
    }

    componentDidMount() {
        const { dispatch } = Store
        const { queue: queueState } = Store.getState().playerState
        TrackPlayer.getQueue()
            .then((queue: Track[]) => {
                if (queue !== undefined
                    && queue.length === 0
                    && queueState.length > 0) {
                    dispatch(resetQueue())
                }
            })
    }

    render() {
        let persistor = persistStore(
            Store,
            null,
            () => RNBootSplash.hide({ duration: 250 })
        )

        return (
            <Provider store={Store}>
                <PersistGate persistor={persistor}>
                    <NavigationContainer theme={DarkTheme}>
                        <Navigation />
                    </NavigationContainer>
                </PersistGate>
            </Provider>
        );
    }
};

export default App;
