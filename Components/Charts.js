import React from 'react'
import { ScrollView, StyleSheet, Text, View, ListView, FlatList } from 'react-native'
import JOText from './Elements/JOText'
import JOTitle from './Elements/JOTitle'
import { LastFMCharts } from '../API/LastFMAPI'
import JOSubTitle from './Elements/JOSubTitle'
import JOHorizontalItem from './Elements/JOHorizontalItem'
import { MusicBrainzAPI } from '../API/MusicBrainzAPI'
import { CoverArtArchive } from '../API/CoverArtArchiveAPI'
import JOHorizontalList from './Elements/JOHorizontalList'

class Charts extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            topTracks: []
        }
    }

    async _getTrackCoverArt(artist, track) {
        return MusicBrainzAPI.getReleaseMBIDFromTrack(artist, track)
            .then(mbid => CoverArtArchive.getReleaseGroupFrontCover(mbid))
    }

    componentDidMount() {
        LastFMCharts.getTopTracks(20)
            .then(data => this.setState({ topTracks: data }))
        LastFMCharts.getTopArtists(20)
            .then(console.log)
            // .then(data => this.setState({ topArtists: data }))
    }

    _displayTopTracks() {
        if (this.state.topTracks.length > 0) {
            return (
                <JOHorizontalList
                    data={this.state.topTracks}
                    renderItem={({ item }) =>
                        <JOHorizontalItem
                            title={item.name}
                            imagePromise={() => this._getTrackCoverArt(item.artist.name, item.name)}
                        />}
                />
            )
        }
    }

    _displayTopArtists() {
        if (this.state.topArtists.length > 0) {
            return (
                <JOHorizontalList
                    data={this.state.topArtists}
                    renderItem={({ item }) =>
                        <JOHorizontalItem
                            title={item.name}
                            image={() => {}}
                        />}
                />
            )
        }
    }

    render() {
        return (
            <ScrollView style={styles.main_container}>
                <JOTitle>Hit-parade</JOTitle>
                <JOSubTitle>Top titres</JOSubTitle>
                {this._displayTopTracks()}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
    }
})

export default Charts