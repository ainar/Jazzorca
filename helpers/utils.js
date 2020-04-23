import moment from 'moment'

export function formatSeconds(seconds) {
    return Math.floor(seconds / 60) + ':' + ('0' + Math.floor(seconds % 60)).slice(-2)
}


export function durationTextToSeconds(txt) {
    let durationArray = txt.split(':')
    let durationObject = {
        seconds: durationArray[durationArray.length - 1],
        minutes: durationArray[durationArray.length - 2] || 0,
        hours: durationArray[durationArray.length - 3] || 0,
        days: durationArray[durationArray.length - 4] || 0
    }
    return moment.duration(durationObject).asSeconds()
}

export function appendTracksWithoutDuplicate(old, append) {
    const newAppend = append.filter(
        new_item => old
            .map(old_item => old_item.videoId)
            .indexOf(new_item.videoId) === -1
    )
    return [...old, ...newAppend]
}