const API_ROOT_URL = "https://musicbrainz.org/ws/2/"

const IDENTIFIATION_HEADER = { "User-Agent": "Jazzorca/0.1 ( aina.rasoldier@hotmail.fr )" }

export class MusicBrainzAPI {

    static async fetchMB(url) {
        const fetchURL = API_ROOT_URL + url
        return fetch(fetchURL, { headers: IDENTIFIATION_HEADER })
    }

    static async searchQuery(type, query) {
        return MusicBrainzAPI.fetchMB(type + "/?query=" + encodeURIComponent(query) + "&fmt=json")
            .then(data => data.json())
    }

    static async searchTrack(artist, title) {
        const query = 'artist:"' + artist + '" AND recording:"' + title + '"'

        return MusicBrainzAPI.searchQuery('recording', query)
            .then(data => data.recordings)
    }

    static async getTrackMBID(artist, title) {
        return MusicBrainzAPI.searchTrack(artist, title)
            .then(recordings => {
                if (recordings !== undefined && recordings.length > 0) {
                    return recordings[0].id
                }
            })
    }

    static async getReleaseMBIDFromTrack(artist, title) {
        return MusicBrainzAPI.searchTrack(artist, title)
            .then(recordings => {
                if (recordings !== undefined && recordings.length > 0
                    && recordings[0].releases !== undefined && recordings[0].releases.length > 0) {
                    return recordings[0].releases[0]["release-group"].id
                }
            })
    }

    static async getEntity(type, mbid) {
        return MusicBrainzAPI.fetchMB(type + "?label=" + mbid + "&fmt=json")
            .then(data => data.json())
    }
}