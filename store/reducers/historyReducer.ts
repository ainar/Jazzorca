import { JOAction, HistoryJOTrack } from '../../helpers/types'

export interface HistoryState {
    history: HistoryJOTrack[]
}

const initState: HistoryState = {
    history: []
}


export function history(state = initState, action: JOAction) {
    let newState

    switch (action.type) {
        case 'ADD_TO_HISTORY':
            const newTrack = action.value
            const newHistory = [ ...state.history ]
            newHistory.unshift({
                ...newTrack,
                timestamp: new Date().getTime()
            })

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