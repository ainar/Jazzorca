// Application name 	Jazzorca
// API key 	68acaaae76fc204770281c3f2de97377
// Shared secret 	0c77dea40b6b80233ef75098d237ca15
// Registered to 	ainarasoldier

const API_KEY = "68acaaae76fc204770281c3f2de97377"
const SHARED_SECRET = "0c77dea40b6b80233ef75098d237ca15"
const API_ROOT_URL = "http://ws.audioscrobbler.com/2.0/"

export class LastFMCharts {
    static async getTopTracks(limit = 50) {
        return fetch(API_ROOT_URL + "?method=chart.gettoptracks&limit=" + limit + "&api_key=" + API_KEY + "&format=json")
            .then(data => data.json())
            .then(data => data.tracks.track)
    }

    static async getTopArtists(limit = 50) {
        return fetch(API_ROOT_URL + "?method=chart.gettopartists&limit=" + limit + "&api_key=" + API_KEY + "&format=json")
            .then(data => data.json())
            .then(data => data.artists.artist)
    }
}

export class LastFMTracks {
    static async getInfo(artist, track) {
        let url = API_ROOT_URL + "?method=track.getInfo&api_key=" + API_KEY + "&artist= " + encodeURIComponent(artist) + "&track=" + encodeURIComponent(track) + "&format=json"
        return fetch(url)
            .then(data => data.json())
    }
}