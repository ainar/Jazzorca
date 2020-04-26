const initState = {
    history: new Map()
}

export function historyReducer(state = initState, action) {
    let newState

    switch (action.type) {
        case 'ADD_TO_HISTORY':
            let newHistory = new Map(history)
            const newTrack = action.value
            newHistory.set(newTrack.videoId, newTrack)
            newState = {
                ...state,
                history: newHistory
            }
            return newState || state
    
        default:
            break;
    }
}