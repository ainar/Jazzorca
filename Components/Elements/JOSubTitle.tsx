import React from 'react'
import { StyleSheet } from 'react-native'
import JOText, { JOTextProps } from './JOText'

interface JOSubTitleProps extends JOTextProps { }

const JOSubTitle = (props: JOSubTitleProps) => {
    return (
        <JOText style={[props.style, styles.jo_title]}>
            {props.children}
        </JOText>
    )
}

const styles = StyleSheet.create({
    jo_title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginVertical: 10,
        marginLeft: 10
    }
})

export default JOSubTitle
