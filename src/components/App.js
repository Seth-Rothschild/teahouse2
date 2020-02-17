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
                userName: 'Guest ' + uuid().slice(0, 4),
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
        window.open(this.sabaki+`${gameId}`, '_blank')
        this.hub.broadcast('gameClick', { gameId, userName, dateCreated }, () => {})
    }

    handleGameClick(g) {
        return () => {
            const { gameId, userName, dateCreated } = g
            this.hub.broadcast('gameClick', { gameId, userName, dateCreated }, () => {})
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
                h('div', { id: 'titlebar-background' }, 
                ),
                h('h1', { id: 'title' }, 'Teahouse'),
                h('h2', { id: 'subtitle' }, 'A Social Go Server'),

                h('div', { id: 'button-container' },
                    h('button', {
                        id: 'loginButton',
                        onClick: this.handleLogin.bind(this)
                    }, 'Visit Lobby'),
                ),
                h('div', { class: 'text-block' },
                    h('div', { id: 'first-section-left', class: 'text-section' }, 
                        h('h3', {}, 'Beginner Friendly'),
                        h('p', {}, 'No users, no ranks, just Go. Like an ordinary club  we don\'t store user data. Your focus here should be on learning and having fun.'),
                        h('p', {}, 'This site is beginner friendly. Design choices are made with both new players and expert players in mind.'),

                    ),
                    h('div', { id: 'first-section-right', class: 'image-section' },
                        h('img', { class: 'image' , src: 'chatexample.jpeg' })
                    ), 
                ),
                h('div', { class: 'text-block', id: 'second-section' },
                    h('div', { id: 'second-section-left', class: 'image-section' },

                        h('img', { id: 'gameplay', class: 'image' , src: 'gameplay2.gif' })


                    ),
                    h('div', { id: 'second-segment-right', class: 'text-section' },
                        h('h3', {}, 'Play with Sabaki'),
                        h('p', {}, 'Use a deployed fork of Sabaki Web to play online.'),
                        h('p', {}, 'Our boards don\'t require a login, so you can play online with anyone however you like.')
                    )
                ),
 
            )
        )

        const lobby =  (
            h('div', { id: 'lobby' },
                h('div', { id: 'lobbyTitle' },
                    h('div', { id: 'title-box' },
                        h('h3', {}, 'Teahouse Go'),
                        h('input', {
                            id: 'userName',
                            placeholder: 'Name',
                            value: userName,
                            onInput: evt => this.setState({ userName: evt.currentTarget.value })
                        }),
                        h('input', {
                            id: 'userRank',
                            placeholder: 'Rank (e.g. 20k)',
                            value: userRank,
                            onInput: evt => this.setState({ userRank: evt.currentTarget.value })
                        }),
                    ),
                   
                    h('button', { 
                        id: 'logoutButton',
                        onClick: this.handleLogout.bind(this)
                        
                    }, 'Log Out'),
                ),

                h('div', { id: 'games' }, 
                    games.map((g) => h('a', 
                        {
                            class: 'gameItem',
                            href: this.sabaki+`${g.gameId}`,
                            target: '_blank',
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
            ( visiblePage === 'loginPage' && loginPage ), 
            ( visiblePage === 'lobby' && lobby ), 
            h('div', {id: 'footer'}, 
                h('a', { href: 'https://github.com/Seth-Rothschild/teahousego' }, 'Github'),
                h('span', {}, ' | '),
                h('a', { href:'https://github.com/Seth-Rothschild/teahousego/issues' }, 'Feature Requests'),
                h('span', {}, ' | '),
                h('a', { href:'https://github.com/Seth-Rothschild/p2p-goban' }, 'Sabaki Fork')
            )
        )
    }
}
