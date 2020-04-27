import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import JOTrackList from './JOTrackList'
import JOScreen from './JOScreen'
import JOTitle from './Elements/JOTitle'
import { playNow } from '../helpers/playerControls'

export class Home extends Component {
    _onPress(track) {
        const { cache } = this.props
        return this.props.dispatch(playNow(track, cache))
    }

    render() {
        return (
            <JOScreen>
                <JOTitle>Dernières écoutes</JOTitle>
                <JOTrackList
                    data={this.props.history}
                    onPress={track => this._onPress(track)}
                />
            </JOScreen>
        )
    }
}

const styles = StyleSheet.create({

})

const mapStateToProps = (state) => {
    return {
        history: Object.values(state.history.history).sort((a, b) => b.lastListened - a.lastListened),
        cache: state.playerState.cache
    }
}


export default connect(mapStateToProps)(Home)
