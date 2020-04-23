import React from 'react'
import { WebView } from 'react-native-webview'
import { durationTextToSeconds } from '../helpers/utils'

class JOYTWebView extends React.Component {

    constructor(props) {
        super(props)
        this._webView = undefined
    }

    _getRecommendations(message) {
        let data = Object.values(
            JSON.parse(message.nativeEvent.data)
        )

        if (data.length) {
            let recommendations = data.map(v => {
                return new Object({
                    videoId: v.data.videoId,
                    title: v.data.title.runs[0].text,
                    duration: durationTextToSeconds(v.data.lengthText.runs[0].text),
                    thumbnailUrl: v.data.thumbnail.thumbnails[0].url
                })
            })

            if (this.props.onRecommendations !== undefined)
                this.props.onRecommendations(recommendations)
            return recommendations
        }
    }

    _recommendationsInjectionGetter() {
        return `window.ReactNativeWebView.postMessage(JSON.stringify(document.getElementsByTagName('ytm-compact-video-renderer')))`
    }

    render() {
        let url = 'https://m.youtube.com/watch?v=' + this.props.videoId
        console.log(url)
        return (
            <WebView
                source={{ uri: url }}
                onMessage={message => this._getRecommendations(message)}
                onLoadEnd={() => this._webView.injectJavaScript(this._recommendationsInjectionGetter())}
                ref={r => this._webView = r}
            />
        )
    }
}

export default JOYTWebView