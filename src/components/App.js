import { h, Component, render } from 'preact'

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: ''
        }
    }

    componentDidMount() {
        const title = 'Hello world'
        this.setState({ title })
    }

    // componentDidUpdate(_, prevState) {
    // }



    render() {
        const { title } = this.state
        return h('div', { class: 'app-view' },
            h('div', { class: 'main-view' },
                h('p', { id: 'title' }, title)
            )
        )
    }
}
