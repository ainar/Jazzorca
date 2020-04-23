import { Component } from 'react'
import TrackPlayer from 'react-native-track-player'

export default class Player extends Component {
    constructor(props) {
        super(props)

        this.state = {
            track: undefined
        }


        // Events

        TrackPlayer.addEventListener('playback-track-changed', (() => {
            TrackPlayer.getQueue().then(queue => this.trackChangeListener(queue[0]))
        }))

        // Init

        TrackPlayer.getCurrentTrack()
            .then(trackId => {
                if (trackId !== null)
                    TrackPlayer.getTrack(trackId).then(track => this.trackChangeListener(track))
            })
    }

    componentDidMount() {
        this._ismounted = true;
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    async trackChangeListener(track) {
        if (this._ismounted)
            this.setState({ track: track })
    }
}
