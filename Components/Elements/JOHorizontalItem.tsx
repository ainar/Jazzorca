import React from 'react'
import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native'
import JOText from './JOText'

interface JOHorizontalItemProps {
    image: string,
    title: string,
    imagePromise: Function
}

class JOHorizontalItem extends React.Component {
    props: JOHorizontalItemProps
    state: {
        image: ImageSourcePropType
    }

    constructor(props: JOHorizontalItemProps) {
        super(props)
        this.state = {
            image: undefined
        }
    }

    _updateImage(imageURL: string) {
        if (imageURL !== undefined) {
            this.setState({ image: { uri: imageURL } })
        }
    }

    componentDidMount() {
        if (this.props.image !== undefined)
            this._updateImage(this.props.image)
        else if (this.props.imagePromise !== undefined)
            this.props.imagePromise()
                .then((imageURL: string) => this._updateImage(imageURL))
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