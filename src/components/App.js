import { h, Component, render } from 'preact'

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
    }

    // componentDidUpdate(_, prevState) {
    // }



    render() {
        return h('div', {class: 'app-view'},
            h('div', {class: 'main-view'},
                h('p', {id: 'title'}, 'Hello world')
            )
        )
    }
}
