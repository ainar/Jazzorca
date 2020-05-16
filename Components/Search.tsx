import React from 'react'
import { View, StyleSheet, ActivityIndicator, StyleProp, TextInputSubmitEditingEventData } from 'react-native'
import Screen from './Screen'
import TrackList from './Elements/TrackList'
import JOSearchInput from './Elements/SearchInput'
import { ytSearch, ytSearchNextPage, ContinuationInfos } from '../API/YouTubeAPI'
import { appendTracksWithoutDuplicate, filterResults } from '../helpers/utils'
import { connect } from 'react-redux'
import { playNow } from '../store/actions'
import { JOThunkDispatch, JOTrack, ResultJOTrack } from '../helpers/types'

interface SearchProps {
    style: StyleProp<typeof Screen>,
    dispatch: JOThunkDispatch
}

class Search extends React.Component<SearchProps> {
    query: string
    continuationInfos: ContinuationInfos | undefined
    results: ResultJOTrack[]

    state: {
        results: ResultJOTrack[],
        loading: boolean,
        loadingNextPage: boolean,
    }

    constructor(props: SearchProps) {
        super(props)
        this.state = {
            results: [],
            loading: false,
            loadingNextPage: false,
        }
        this.results = []
        this.query = ''
        this.continuationInfos = undefined
    }

    async _search(nativeEvent: TextInputSubmitEditingEventData) {
        this.query = nativeEvent.text
        this.setState({ loading: true, results: [] })

        await ytSearch(nativeEvent.text)
            .then((results) => {
                this.continuationInfos = results.continuationInfos
                this.setState({
                    results: filterResults(results.results),
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
        if (this.continuationInfos)
            ytSearchNextPage(this.query, this.continuationInfos)
                .then(({ results, continuationInfos }) => {
                    this.results = results
                    this.continuationInfos = continuationInfos
                    this.setState({
                        results: appendTracksWithoutDuplicate(this.state.results, filterResults(results)),
                        loadingNextPage: false
                    })
                })
    }

    async _onPress(track: JOTrack) {
        const { dispatch } = this.props
        return dispatch(playNow(track))
    }

    render() {
        return (
            <Screen style={[styles.main_component, this.props.style]}>
                <TrackList
                    data={this.state.results}
                    onEndReached={() => { this._loadNextPage() }}
                    loadingNextPage={this.state.loadingNextPage}
                    ListHeaderComponentStyle={{ height: 85 }}
                    ListFooterComponentStyle={{ height: 40 }}
                    onPress={(track: JOTrack) => this._onPress(track)}
                />
                <View style={styles.search_box}>
                    <JOSearchInput
                        onSubmitEditing={({ nativeEvent }) => this._search(nativeEvent)}
                    />
                </View>
                {this._displayLoading()}
            </Screen>
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

export default connect()(Search)