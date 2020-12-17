import React, {Component} from 'react'

interface Props {

}
interface State {
    hasError: boolean
}
export default class ErrorBoundary extends Component<Props, State> {
    
    
    constructor(props: Props) {
        super(props)
        this.state = {
            hasError: false
        }
    }
    
     static getDerivedStateFromError(error: Error) {
        return { hasError: true }
     }
    componentDidCatch(error: Error){
        this.setState({ hasError: true})
    }
    render() {
        if(this.state.hasError){
            return(
                <div>
                    <h2>Something went wrong please reload the page. We are tyring to fix that.</h2>
                </div>
            )
        }
        return this.props.children
    }

}
