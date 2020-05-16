import moment from 'moment'
import TrackPlayer, { Track, State } from 'react-native-track-player'
import { ResultJOTrack } from './types'

export function formatSeconds(seconds: number) {
    return Math.floor(seconds / 60) + ':' + ('0' + Math.floor(seconds % 60)).slice(-2)
}


export function durationTextToSeconds(txt: string) {
    let durationArray = txt.split(':')
    let durationObject: moment.DurationInputObject = {
        seconds: Number(durationArray[durationArray.length - 1]),
        minutes: Number(durationArray[durationArray.length - 2] || 0),
        hours: Number(durationArray[durationArray.length - 3] || 0),
        days: Number(durationArray[durationArray.length - 4] || 0)
    }
    return moment.duration(durationObject).asSeconds()
}

export function appendTracksWithoutDuplicate(old: ResultJOTrack[], append: ResultJOTrack[]) {
    const newAppend = append.filter(
        new_item => old
            .map((old_item: ResultJOTrack) => old_item.videoId)
            .indexOf(new_item.videoId) === -1
    )
    return [...old, ...newAppend]
}

export default (state: State) => {
    switch (state) {
        case TrackPlayer.STATE_PLAYING:
            console.log('STATE_PLAYING')
            break;

        case TrackPlayer.STATE_NONE:
            console.log('STATE_NONE')
            break;

        case TrackPlayer.STATE_PAUSED:
            console.log('STATE_PAUSED')
            break;

        case TrackPlayer.STATE_STOPPED:
            console.log('STATE_STOPPED')
            break;

        case TrackPlayer.STATE_BUFFERING:
            console.log('STATE_BUFFERING')
            break;

        default:
            break;
    }
}


export function filterResults(results: ResultJOTrack[]) {
    return results.filter(({ duration }) => duration !== undefined && duration > 0)
}