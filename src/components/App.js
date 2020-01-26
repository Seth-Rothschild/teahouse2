import { h, Component, render } from 'preact'

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: '',
            userRank: '',
            visiblePage: '',
        }
    }
    handleSubmit(evt) {
        evt.preventDefault()
        this.setState({ visiblePage: 'lobby' })
    }
    componentDidMount() {
        const { visiblePage } = this.state
        if (visiblePage === '') { this.setState({ visiblePage: 'loginPage' })}
    }

    // componentDidUpdate(_, prevState) {
    // }


    render() {
        const { userName, userRank, visiblePage } = this.state
        const loginPage = (
            h('div', { id: 'loginPage' }, 
                h('h2', { id: 'title' }, 'Welcome to Teahouse!'),
                h('form', { id: 'loginForm', onSubmit: this.handleSubmit.bind(this) },
                    h('input', {
                        id: 'userName',
                        placeholder: 'User Name',
                        value: userName,
                        onInput: evt => this.setState({ userName: evt.currentTarget.value })
                    }),
                    h('input', {
                        id: 'userRank',
                        placeholder: 'Rank (e.g. 20k)',
                        value: userRank,
                        onInput: evt => this.setState({ userRank: evt.currentTarget.value })
                    }),
                    h('button', {
                        id: 'loginButton'
                    }, 'Log In'),
                )
            )
        )

        const lobby =  (
            h('div', { id: 'lobby' },
                h('h2', {}, 'Lobby'),
                h('subtitle', {}, userName + ' ' + userRank)
            )
        )

        return h('div', { class: 'app-view' },
            h('div', { class: 'main-view' }, 
                ( visiblePage === 'loginPage' && loginPage ), 
                ( visiblePage === 'lobby' && lobby ), 
            )            
        )
    }
}
