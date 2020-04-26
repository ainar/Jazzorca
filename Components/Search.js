import React from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import JOScreen from './JOScreen'
import JOTrackList from './JOTrackList'
import JOSearchInput from './Elements/JOSearchInput'
import { ytSearch, ytSearchNextPage } from '../API/YouTubeAPI'
import { appendTracksWithoutDuplicate } from '../helpers/utils'
import { connect } from 'react-redux'
import { playNow } from '../helpers/playerControls'

class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            results: [],
            loading: false,
            loadingNextPage: false,
        }
        this.query = ''
    }

    async _search(nativeEvent) {
        this.query = nativeEvent.text
        this.setState({ loading: true, results: [] })

        await ytSearch(nativeEvent.text)
            .then(results => {
                this.continuationInfos = results.continuationInfos
                this.setState({
                    results: results.results,
                    loading: false
                })
            })
    }

    _displayLoading() {
        if (this.state.loading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
    }

    _loadNextPage() {
        this.setState({ loadingNextPage: true })
        ytSearchNextPage(this.query, this.continuationInfos)
            .then(({ results, continuationInfos }) => {
                this.results = results
                this.continuationInfos = continuationInfos
                this.setState({
                    results: appendTracksWithoutDuplicate(this.state.results, results),
                    loadingNextPage: false
                })
            })
    }

    _onPress(track) {
        const { dispatch, cache } = this.props
        const action = playNow(track, cache)
        dispatch(action)
    }

    render() {
        return (
            <JOScreen style={[styles.main_component, this.props.style]}>
                <JOTrackList
                    data={this.state.results}
                    onEndReached={() => { this._loadNextPage() }}
                    loadingNextPage={this.state.loadingNextPage}
                    ListHeaderComponentStyle={{ height: 85 }}
                    ListFooterComponentStyle={{ height: 40 }}
                    onPress={track => this._onPress(track)}
                />
                <View style={styles.search_box}>
                    <JOSearchInput
                        onSubmitEditing={({ nativeEvent }) => this._search(nativeEvent)}
                    />
                </View>
                {this._displayLoading()}
            </JOScreen>
        )
    }
}

const styles = StyleSheet.create({
    main_component: {
    },
    loading_container: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    search_box: {
        position: "absolute",
        top: 30,
        left: 0,
        right: 0,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 100,
    }
})

const mapStateToProps = (state) => ({
    cache: state.playerState.cache
})

export default connect(mapStateToProps)(Search)