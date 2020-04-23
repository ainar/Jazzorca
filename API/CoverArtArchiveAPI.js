const API_ROOT_URL = "https://coverartarchive.org/"

export class CoverArtArchive {
    static async getReleaseGroupFrontCover(mbid) {
        if (mbid !== undefined)
            return fetch(
                API_ROOT_URL + 'release-group/' + mbid + '/front-250',
            ).then(data => data.url)
    }
}