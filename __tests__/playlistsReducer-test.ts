/**
 * @format
 */

import { PlaylistsState, playlists } from '../store/reducers/playlistsReducer';

it('add track to playlist', () => {
    const initState: PlaylistsState = {
        playlists: [
            {
                id: 'playlist-1',
                name: 'Playlist 1',
                tracks: [
                    {
                        id: 'track-1',
                        url: undefined,
                        title: 'title-1',
                        artist: 'artist-1'
                    },
                ]
            }
        ]
    }

    const track = {
        id: 'track-2'
    }

    const action = {
        type: 'ADD_TRACK_TO_PLAYLIST',
        value: {
            playlistId: 'playlist-1',
            track: track
        }
    }

    const newState = playlists(initState, action);

    expect(newState)
        .toEqual({
            playlists: [
                {
                    id: 'playlist-1',
                    name: 'Playlist 1',
                    tracks: [
                        {
                            id: 'track-1',
                            url: undefined,
                            title: 'title-1',
                            artist: 'artist-1'
                        },
                        {
                            id: 'track-2',
                        },
                    ]
                }
            ]
        });
});

it('remove track from playlist', () => {
    const initState: PlaylistsState = {
        playlists: [
            {
                id: 'playlist-1',
                name: 'Playlist 1',
                tracks: [
                    {
                        id: 'track-1',
                        url: undefined,
                        title: 'title-1',
                        artist: 'artist-1'
                    },
                    {
                        id: 'track-2',
                        url: undefined,
                        title: 'title-2',
                        artist: 'artist-2'
                    },
                ]
            }
        ]
    }

    const track = {
        id: 'track-2'
    }

    const action = {
        type: 'REMOVE_TRACK_FROM_PLAYLIST',
        value: {
            playlistId: 'playlist-1',
            trackId: track.id
        }
    }

    const newState = playlists(initState, action);

    expect(newState)
        .toEqual({
            playlists: [
                {
                    id: 'playlist-1',
                    name: 'Playlist 1',
                    tracks: [
                        {
                            id: 'track-1',
                            url: undefined,
                            title: 'title-1',
                            artist: 'artist-1'
                        },
                    ]
                }
            ]
        });
});

it('remove first track from playlist', () => {
    const initState: PlaylistsState = {
        playlists: [
            {
                id: 'playlist-1',
                name: 'Playlist 1',
                tracks: [
                    {
                        id: 'track-1',
                        url: undefined,
                        title: 'title-1',
                        artist: 'artist-1'
                    },
                    {
                        id: 'track-2',
                        url: undefined,
                        title: 'title-2',
                        artist: 'artist-2'
                    },
                ]
            }
        ]
    }

    const track = {
        id: 'track-1'
    }

    const action = {
        type: 'REMOVE_TRACK_FROM_PLAYLIST',
        value: {
            playlistId: 'playlist-1',
            trackId: track.id
        }
    }

    const newState = playlists(initState, action);

    expect(newState)
        .toEqual({
            playlists: [
                {
                    id: 'playlist-1',
                    name: 'Playlist 1',
                    tracks: [
                        {
                            id: 'track-2',
                            url: undefined,
                            title: 'title-2',
                            artist: 'artist-2'
                        },
                    ]
                }
            ]
        });
});

it('add playlist', () => {
    const initState: PlaylistsState = {
        playlists: [
            {
                id: 'playlist-1',
                name: 'Playlist 1',
                tracks: [
                    {
                        id: 'track-1',
                        url: undefined,
                        title: 'title-1',
                        artist: 'artist-1'
                    },
                    {
                        id: 'track-2',
                        url: undefined,
                        title: 'title-2',
                        artist: 'artist-2'
                    },
                ]
            }
        ]
    }

    const playlist = {
        id: 'playlist-2',
        name: 'Playlist 2',
        tracks: [
            {
                id: 'track-3',
                url: undefined,
                title: 'title-3',
                artist: 'artist-3'
            },
            {
                id: 'track-4',
                url: undefined,
                title: 'title-4',
                artist: 'artist-4'
            }
        ]
    }

    const action = {
        type: 'ADD_PLAYLIST',
        value: playlist
    }

    const newState = playlists(initState, action);

    expect(newState)
        .toEqual({
            playlists: [
                {
                    id: 'playlist-1',
                    name: 'Playlist 1',
                    tracks: [
                        {
                            id: 'track-1',
                            url: undefined,
                            title: 'title-1',
                            artist: 'artist-1'
                        },
                        {
                            id: 'track-2',
                            url: undefined,
                            title: 'title-2',
                            artist: 'artist-2'
                        },
                    ]
                },
                {
                    id: 'playlist-2',
                    name: 'Playlist 2',
                    tracks: [
                        {
                            id: 'track-3',
                            url: undefined,
                            title: 'title-3',
                            artist: 'artist-3'
                        },
                        {
                            id: 'track-4',
                            url: undefined,
                            title: 'title-4',
                            artist: 'artist-4'
                        }
                    ]
                }
            ]
        });
});

it('remove playlist', () => {
    const initState: PlaylistsState = {
        playlists: [
            {
                id: 'playlist-1',
                name: 'Playlist 1',
                tracks: [
                    {
                        id: 'track-1',
                        url: undefined,
                        title: 'title-1',
                        artist: 'artist-1'
                    },
                    {
                        id: 'track-2',
                        url: undefined,
                        title: 'title-2',
                        artist: 'artist-2'
                    },
                ]
            }
        ]
    }

    const playlist = {
        id: 'playlist-1',
        name: 'Playlist 1',
        tracks: [
            {
                id: 'track-1',
                url: undefined,
                title: 'title-1',
                artist: 'artist-1'
            },
            {
                id: 'track-2',
                url: undefined,
                title: 'title-2',
                artist: 'artist-2'
            }
        ]
    }

    const action = {
        type: 'REMOVE_PLAYLIST',
        value: playlist.id
    }

    const newState = playlists(initState, action);

    expect(newState)
        .toEqual({ playlists: [] });
});

it('remove second playlist', () => {
    const initState: PlaylistsState = {
        playlists: [
            {
                id: 'playlist-1',
                name: 'Playlist 1',
                tracks: [
                    {
                        id: 'track-1',
                        url: undefined,
                        title: 'title-1',
                        artist: 'artist-1'
                    },
                    {
                        id: 'track-2',
                        url: undefined,
                        title: 'title-2',
                        artist: 'artist-2'
                    },
                ]
            },
            {
                id: 'playlist-2',
                name: 'Playlist 2',
                tracks: [
                    {
                        id: 'track-1',
                        url: undefined,
                        title: 'title-1',
                        artist: 'artist-1'
                    },
                    {
                        id: 'track-2',
                        url: undefined,
                        title: 'title-2',
                        artist: 'artist-2'
                    },
                ]
            }
        ]
    }

    const playlist = {
        id: 'playlist-2',
        name: 'Playlist 2',
        tracks: [
            {
                id: 'track-1',
                url: undefined,
                title: 'title-1',
                artist: 'artist-1'
            },
            {
                id: 'track-2',
                url: undefined,
                title: 'title-2',
                artist: 'artist-2'
            }
        ]
    }

    const action = {
        type: 'REMOVE_PLAYLIST',
        value: playlist.id
    }

    const newState = playlists(initState, action);

    expect(newState)
        .toEqual({
            playlists: [
                {
                    id: 'playlist-1',
                    name: 'Playlist 1',
                    tracks: [
                        {
                            id: 'track-1',
                            url: undefined,
                            title: 'title-1',
                            artist: 'artist-1'
                        },
                        {
                            id: 'track-2',
                            url: undefined,
                            title: 'title-2',
                            artist: 'artist-2'
                        },
                    ]
                }]
        });
});