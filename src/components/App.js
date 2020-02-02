import { h, Component, render } from 'preact'
  
import signalhub from 'signalhub'
import uuid from 'uuid/v4'
import config from '../../config.json'

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
        if (process.env.NODE_ENV == 'production'){
            this.hub = signalhub('teahouse', [config.signalhub.prod])
        } else {
            this.hub = signalhub('teahouse-local', [config.signalhub.local])
        }
        this.sabaki = config.sabaki
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
        this.hub.broadcast('loggedIn', { userName, userRank }, () => {})
    }
    handleLogout(evt) {
        const { userName, userRank } = this.state
        this.setState({ visiblePage: 'loginPage' })
        this.hub.broadcast('loggedOut', { userName, userRank }, () => {})
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

    getSubscriptions() {
        const { hub } = this

        const sendMessage = hub.subscribe('sendMessage')
        const gameClick = hub.subscribe('gameClick')
        const loggedIn = hub.subscribe('loggedIn')
        const loggedOut = hub.subscribe('loggedOut')

        return { sendMessage, gameClick, loggedIn, loggedOut }
        
    }

    componentDidMount() {

        const subscriptions = this.getSubscriptions()
        const { visiblePage, chatLog } = this.state
        
        if (visiblePage === '') { this.setState({ visiblePage: 'loginPage' })}

        subscriptions.sendMessage.on('data',  (message) => {
            if ( message.chatContent ) {
                chatLog.push(message)
            }
            this.setState({ chatLog })
        })

        subscriptions.gameClick.on('data', (message) => {
            const { gameId } = message
            let { games } = this.state
            const gameIds = games.map(g => g.gameId)
            if (!gameIds.includes(gameId)) {
                games.push(message)
            }
            this.setState({ games })
        })

        subscriptions.loggedIn.on('data',  (message) => {
            const { userName, userRank } = message
            if ( userName ) {
                chatLog.push({ userName, userRank, chatContent: 'has joined' })
            }
            this.setState({ chatLog })
        })
        
        subscriptions.loggedOut.on('data',  (message) => {
            const { userName, userRank } = message

            if ( message.userName ) {
                chatLog.push({ userName, userRank, chatContent: 'has left' })
            }
            this.setState({ chatLog })
        })
    }


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
                        placeholder: 'Firstname Lastname',
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
