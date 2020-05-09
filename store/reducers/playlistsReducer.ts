import { Playlist, Action } from "../../helpers/types";

export interface PlaylistsState {
    playlists: Playlist[],
}

const initState: PlaylistsState = {
    playlists: []
}

export function playlists(state: PlaylistsState = initState, action: Action): PlaylistsState {
    let newState: PlaylistsState;

    switch (action.type) {
        case 'ADD_TRACK_TO_PLAYLIST': {
            const playlistIndex = state.playlists.findIndex(p => p.id === action.value.playlistId);
            const playlist = state.playlists[playlistIndex];
            if (playlist !== undefined) {
                const newTrackList = [...playlist.tracks]
                newTrackList.push(action.value.track);

                const newPlaylists = [...state.playlists];

                newPlaylists[playlistIndex] = {
                    ...playlist,
                    tracks: newTrackList
                }

                newState = {
                    ...state,
                    playlists: newPlaylists
                }
                return newState || state;
            }

            return state;
        }

        case 'REMOVE_TRACK_FROM_PLAYLIST': {
            const playlistIndex = state.playlists.findIndex(p => p.id === action.value.playlistId);
            const playlist = state.playlists[playlistIndex];
            if (playlist !== undefined) {
                const newTrackList = [...playlist.tracks]
                const trackIndex = newTrackList.findIndex(t => t.id === action.value.trackId);
                if (trackIndex > -1) {
                    newTrackList.splice(trackIndex, 1);
                }

                const newPlaylists = [...state.playlists];

                newPlaylists[playlistIndex] = {
                    ...playlist,
                    tracks: newTrackList
                }

                newState = {
                    ...state,
                    playlists: newPlaylists
                }
                return newState || state;
            }

            return state;
        }

        case 'ADD_PLAYLIST': {
            const newPlaylists = [...state.playlists];
            newPlaylists.push(action.value);
            newState = {
                playlists: newPlaylists
            };
            return newState || state;
        }

        case 'REMOVE_PLAYLIST': {
            const newPlaylists = [...state.playlists];
            newPlaylists.splice(action.value, 1);

            newState = {
                playlists: newPlaylists
            };
            return newState || state;
        }
    }

    return state;
}