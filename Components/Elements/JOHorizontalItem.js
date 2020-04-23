import React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import JOText from './JOText'

class JOHorizontalItem extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            image: undefined
        }
    }

    _updateImage(imageURL) {
        if (imageURL !== undefined) {
            this.setState({ image: { uri: imageURL } })
        }
    }

    componentDidMount() {
        if (this.props.image !== undefined)
            this._updateImage(this.props.image)
        else if (this.props.imagePromise !== undefined)
            this.props.imagePromise()
                .then(imageURL => this._updateImage(imageURL))
    }

    render() {
        return (
            <View style={styles.main_container}>
                <Image
                    style={{ height: 100, width: 100, backgroundColor: 'grey' }}
                    source={this.state.image}
                />
                <JOText>{this.props.title}</JOText>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        margin: 5,
        width: 100
    }
})

export default JOHorizontalItem