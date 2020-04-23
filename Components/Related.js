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

    onPress(track) {
        this.props.navigation.navigate('Player')
        playNow(track, action => this.props.dispatch(action), this.props.cache)
    }

    _loadNextPage() {
        this.setState({ loadingNextPage: true })
        ytRelatedNextPage(this.props.track.related.continuationInfos)
            .then(({ results, continuationInfos }) => {
                this.props.dispatch({
                    type: 'ADD_RELATED',
                    value: { results, continuationInfos }
                })

                this.setState({
                    loadingNextPage: false
                })
            })
    }

    _showRelated() {
        if (this.props.track !== undefined)
            return (
                <JOTrackList
                    data={this.props.track.related.results}
                    onEndReached={() => { this._loadNextPage() }}
                    loadingNextPage={this.state.loadingNextPage}
                    ListFooterComponentStyle={{ height: 40 }}
                    onPress={(track) => this.onPress(track)}
                />

            )
    }

    render() {
        return (
            <JOScreen>
                <JOTitle>Autres titres semblables</JOTitle>
                {this._showRelated()}
            </JOScreen>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        track: state.playerState.cache[state.playerState.currentTrack],
        cache: state.playerState.cache
    }
}


export default connect(mapStateToProps)(Related)