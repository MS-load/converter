import React from 'react' 


interface Props{
    imageSrc: string
    imageWidth: string
}

export default function Image(props: Props) {
    return (
       <img style={{width: props.imageWidth}} src={props.imageSrc} alt=""/>
    )
}


