const initState = {
    history: {}
}

export function history(state = initState, action) {
    let newState

    switch (action.type) {
        case 'ADD_TO_HISTORY':
            const newTrack = action.value
            const newHistory = { ...state.history }
            newHistory[newTrack.videoId] = {
                ...newTrack,
                lastListened: new Date().getTime()
            }

            newState = {
                ...state,
                history: newHistory
            }
            return newState || state

        default:
            break;
    }

    return state
}