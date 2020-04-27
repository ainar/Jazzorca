import React from 'react'
import JOScreen from './JOScreen'
import JOTitle from './Elements/JOTitle'
import JOTrackList from './JOTrackList'
import { ytRelatedNextPage } from '../API/YouTubeAPI'
import { connect } from 'react-redux'
import { playNow } from '../helpers/playerControls'

class Related extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loadingNextPage: false,
            trackId: undefined
        }
    }

    _onPress(track) {
        const { navigation, dispatch, cache } = this.props
        navigation.navigate('Player')
        return dispatch(playNow(track, cache))
    }

    _loadNextPage() {
        const { track, cache, dispatch } = this.props
        this.setState({ loadingNextPage: true })
        ytRelatedNextPage(cache[track.videoId].related.continuationInfos)
            .then(({ results, continuationInfos }) => {
                dispatch({
                    type: 'ADD_RELATED',
                    value: { results, continuationInfos }
                })

                this.setState({
                    loadingNextPage: false
                })
            })
    }

    _showRelated() {
        const { track, cache } = this.props
        if (track !== undefined && cache[track.videoId] !== undefined)
            return (
                <JOTrackList
                    data={cache[track.videoId].related.results}
                    onEndReached={() => { this._loadNextPage() }}
                    loadingNextPage={this.state.loadingNextPage}
                    ListFooterComponentStyle={{ height: 40 }}
                    onPress={(track) => this._onPress(track)}
                />

            )
    }

    render() {
        return (
            <JOScreen>
                <JOTitle>Recommandations</JOTitle>
                {this._showRelated()}
            </JOScreen>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        track: state.playerState.currentTrack,
        cache: state.playerState.cache
    }
}


export default connect(mapStateToProps)(Related)