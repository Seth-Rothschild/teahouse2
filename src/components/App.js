import { h, Component, render } from 'preact'
  
import signalhub from 'signalhub'
import uuid from 'uuid/v4'

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: '',
            userRank: '',
            visiblePage: '',
            chatLog: [],
            chatContent: '',
            games: []
        }
        this.hub = signalhub('teahouse2', ['http://localhost:8000'])
        this.sabaki = 'file:///Users/seth/Desktop/Repositories/p2p-goban/index.html#'
    }
    handleLogin(evt) {
        const { userName, userRank } = this.state
        evt.preventDefault()
        if (userName === '') {
            this.setState({ 
                userName: 'Guest',
            })
        } 
        if (userRank === '') {
            this.setState({
                userRank: '??'
            })
        }
        this.setState({ visiblePage: 'lobby' })
    }
    handleLogout(evt) {
        this.setState({ visiblePage: 'loginPage' })

    }

    handleNewGame(evt) {
        const { userName } = this.state
        let gameId = uuid()
        const dateCreated = new Date().toLocaleString()
        window.open(this.sabaki+`${gameId}`, `gameWindow${gameId}`)
        this.hub.broadcast('gameClick', { gameId, userName, dateCreated }, () => {})
    }

    handleGameClick(g) {
        return () => {
            const { gameId, userName, dateCreated } = g
            this.hub.broadcast('gameClick', { gameId, userName, dateCreated }, () => {})
            window.open(this.sabaki+`${gameId}`, `gameWindow${gameId}`)
        }
    }

    sendMessage(evt) {
        
        const { hub } = this

        evt.preventDefault()
        const { userName, userRank, chatLog, chatContent } = this.state
        this.setState({ chatContent: '' })
        hub.broadcast('sendMessage', { userName, userRank, chatContent }, () => {
        })
    }
    componentDidMount() {
        const { hub } = this
        const { visiblePage, chatLog } = this.state
        
        if (visiblePage === '') { this.setState({ visiblePage: 'loginPage' })}
        hub.subscribe('sendMessage').on('data',  (message) => {
            if ( message.chatContent ) {
                chatLog.push(message)
            }
            this.setState({ chatLog })
        })
        hub.subscribe('gameClick').on('data', (message) => {
            const { gameId } = message
            let { games } = this.state
            const gameIds = games.map(g => g.gameId)
            if (!gameIds.includes(gameId)) {
                games.push(message)
            }
            this.setState({ games })
        })

    }

    // componentDidUpdate(_, prevState) {
    // }


    render() {
        const { userName, userRank, visiblePage, 
            chatLog, chatContent, games 
        } = this.state

        const loginPage = (

            h('div', { id: 'loginPage' }, 
                h('h2', { id: 'title' }, 'Welcome to Teahouse Go!'),
                h('form', { id: 'loginForm', onSubmit: this.handleLogin.bind(this) },
                    h('input', {
                        id: 'userName',
                        placeholder: 'Your Name',
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
                h('div', { id: 'lobbyTitle' },
                    h('h3', {}, 'Teahouse Go'),
                    h('button', { 
                        id: 'logoutButton',
                        onClick: this.handleLogout.bind(this)
                        
                    }, 'Log Out'),
                ),

                h('div', { id: 'games' }, 
                    games.map((g) => h('div', 
                        {
                            class: 'gameItem',
                            onClick: this.handleGameClick.bind(this)(g)
                        }, 
                        h('div', { class: 'gameIdentifier' }, `Game ${g.gameId.slice(0, 4)}`),
                        h('div', { class: 'gameMetadata' }, 
                            h('div', {}, `Created by: ${g.userName}`),
                            h('div', {}, `Date: ${g.dateCreated}`)
                        )
                    )),    
                    h('button', { 
                        id: 'newGameButton',
                        onClick: this.handleNewGame.bind(this)
                    }, 'New Game'),
                ),
                h('div', { id: 'chatLog' },
                    chatLog.map(m => (h('li', { class: 'logItem' }, `${m.userName} (${m.userRank}): ${m.chatContent}`)))
                ),
                h('form', 
                    { 
                        id: 'chatInputForm',
                        onSubmit: this.sendMessage.bind(this)
                    },
                    h('input', {
                        id: 'chatInput',
                        placeholder: 'Chat...',
                        value: chatContent,
                        onInput: evt => this.setState({ chatContent: evt.currentTarget.value })
                    }),
                ),

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
