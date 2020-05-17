import React, { ComponentProps } from 'react';
import { Provider } from 'react-redux';
import Store from './store/configureStore'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import RNBootSplash from 'react-native-bootsplash';
import Navigation from './Navigation/Navigation';
import TrackPlayer, { Track, State, addEventListener } from 'react-native-track-player';
import { autoSetCurrentTrack, autoAddToQueue, resetQueue, setPlayerState } from './store/actions';
import { Action } from 'redux';
import setupPlayer from './helpers/setupPlayer';
import { PlayerState, Device } from './store/reducers/playerStateReducer';


const DarkTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#000'
    },
};


// create a path you want to write to

class App extends React.Component {
    loadingRelatedTrack: boolean;

    constructor(props: ComponentProps<any>) {
        super(props)
        RNBootSplash.show();

        setupPlayer();

        addEventListener(
            'playback-state',
            ({ state }: { state: State }) => this._setPlayerState(state)
        );

        addEventListener(
            'playback-track-changed',
            ({ nextTrack }: { nextTrack: string }) => this._setCurrentTrack(nextTrack)
        );

        this.loadingRelatedTrack = false;

        global.server.isRunning().then(isRunning => {
            if (Store.getState().playerState.device !== Device.Sonos && isRunning) {
                global.server.stop();
            }
        });
    }


    _setPlayerState(state: State) {
        const { dispatch } = Store
        const { queue, currentTrack }: PlayerState = Store.getState().playerState;

        dispatch(setPlayerState(state));

        // if it's the last track, add a related track
        if (queue.length > 0
            && currentTrack !== undefined
            && queue[queue.length - 1].id === currentTrack.id
            && state === TrackPlayer.STATE_PLAYING) {
            this._addRelatedTrackToQueue(currentTrack);
        }
    }

    _setCurrentTrack(queueId: string) {
        const { dispatch } = Store;
        const { queue }: PlayerState = Store.getState().playerState;

        if (queueId === undefined) {
            return
        }

        if (queue === undefined) {
            console.error('queue should be defined here');
            return
        }

        const track = queue.find((t: Track) => t.id === queueId);
        if (track === undefined) {
            return
        }

        dispatch(autoSetCurrentTrack(track) as unknown as Action);
    }

    async _addRelatedTrackToQueue(track: Track) {
        if (!this.loadingRelatedTrack) {
            this.loadingRelatedTrack = true;

            const { dispatch } = Store;
            const { queue } = Store.getState().playerState;
            const related = track.related.results;
            const unseenRelatedTrack = related.find(
                (t: Track) => queue.findIndex(tq => tq.videoId === t.videoId) === -1
            );
            dispatch(autoAddToQueue(unseenRelatedTrack) as unknown as Action);
            this.loadingRelatedTrack = false;
        }
    }

    componentDidMount() {
        const { dispatch } = Store;
        const { queue: queueState } = Store.getState().playerState;
        TrackPlayer.getQueue()
            .then((queue: Track[]) => {
                // reset queue if queue of TrackPlayer is empty
                if (queue !== undefined
                    && queue.length === 0
                    && queueState.length > 0) {
                    dispatch(resetQueue())
                }
            });
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
