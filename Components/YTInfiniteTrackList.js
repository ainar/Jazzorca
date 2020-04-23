import React, { Component } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import JOTrackList from './JOTrackList'
import { ytNextPage } from '../API/YouTubeAPI'

export default class YTInfiniteTrackList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            results: [],
            loadingNextPage: false,
        }

        this.continuationInfos = undefined
    }

    updateData(results) {
        console.log(results)
        this.setState({
            results: [...this.state.results, ...results.results],
            loading: false,
            continuationInfos: results.continuationInfos
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
        ytNextPage(this.continuationInfos, this.props.type).then(() => this.updateData())
    }

    _displayLoadingNextPage() {
        if (this.state.loadingNextPage) {
            return (
                <View>
                    <ActivityIndicator size='large' />
                </View>
            )
        } else {
            return <></>
        }
    }

    componentDidMount() {
        this.setState({ loading: true })
        this.props.dataFunction().then(results => this.updateData(results))
    }

    render() {
        return (
            <>
                <JOTrackList
                    data={this.state.results}
                    ListFooterComponentStyle={{ height: 40 }}
                    ListFooterComponent={() => this._displayLoadingNextPage()}
                    onEndReached={() => { this._loadNextPage() }}
                    {...this.props}
                />
                {this._displayLoading()}
            </>
        )
    }
}

const styles = StyleSheet.create({
    
    loading_container: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
})