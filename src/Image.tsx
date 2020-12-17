import React from 'react' 


interface Props{
    imageSrc: string
    imageWidth: string
}

export default class Image extends React.Component<Props> {
    render() {
        return (
            <img style={{width: this.props.imageWidth}} src={this.props.imageSrc} alt=""/>
        )
    }
}


