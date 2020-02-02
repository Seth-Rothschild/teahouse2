import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-preact-pure'
import { shallow } from 'enzyme'
import { h } from 'preact'
import { assert } from 'chai'
import App from '../src/components/App'
configure({ adapter: new Adapter })

describe('App', () => {
    let wrapper
    beforeEach(() => {
        wrapper = shallow(h(App))
    })
    describe('Render', () => {
        describe('Log In Page', () => {
            it('should not show the #loginPage if visiblepage is not loginPage', () => {
                wrapper.setState({ 'visiblePage': '' })
                const actual = wrapper.exists('#loginPage')
                const expected = false
                assert.equal(actual, expected)
            })
            describe('When visiblePage is loginPage', () => {
                beforeEach(() => {
                    wrapper.setState({ visiblePage: 'loginPage' })
                })
                describe('Title', () => {
                    it('should have a component with id "title"', () => {
                        const actual = wrapper.exists('#title')
                        const expected = true
                        assert.equal(actual, expected)
                    })
                    it('should have text "Welcome to Teahouse Go!"', () => {
                        const actual = wrapper.find('#title').text()
                        const expected = 'Welcome to Teahouse Go!'
                        assert.equal(actual, expected)
                    })
                })
                describe('Log In Form', () => {
                    it('should have a component with id "loginForm"', () => {
                        const actual = wrapper.exists('#loginForm')
                        const expected = true
                        assert.equal(actual, expected)
                    })
                    describe('Username Input', () => {
                        it('should have id userName', () => {
                            const actual = wrapper.exists('#userName')
                            const expected = true
                            assert.equal(actual, expected)
                        })
                        it('should have placeholder "Firstname Lastname"', () => {
                            const actual = wrapper.find('#userName').prop('placeholder')
                            const expected = 'Firstname Lastname'
                            assert.equal(actual, expected)
                        })
                        it('should have value state.userName', () => {
                            let userName = 'Steve'
                            wrapper.setState({ userName })
                            const actual = wrapper.find('#userName').prop('value')
                            const expected = userName
                            assert.equal(actual, expected)
                        })
                        it('should set state.userName on input', () => {
                            const onInput = wrapper.find('#userName').prop('onInput')
                            onInput({ currentTarget: { value: 'hi' } })
                            const actual = wrapper.state('userName')
                            const expected = 'hi'
                            assert.equal(actual, expected)

                        })
                    })
                    describe('Rank Input', () => {
                        it('should have id userRank', () => {
                            const actual = wrapper.exists('#userRank')
                            const expected = true
                            assert.equal(actual, expected)
                        })
                        it('should have placeholder "Rank (e.g. 20k)"', () => {
                            const actual = wrapper.find('#userRank').prop('placeholder')
                            const expected = 'Rank (e.g. 20k)'
                            assert.equal(actual, expected)
                        })
                        it('should have value state.userRank', () => {
                            let userRank = '9k'
                            wrapper.setState({ userRank })
                            const actual = wrapper.find('#userRank').prop('value')
                            const expected = userRank
                            assert.equal(actual, expected)
                        })
                        it('should set userRank onInput', () => {
                            const onInput = wrapper.find('#userRank').prop('onInput')
                            onInput({ currentTarget: { value: 'rank' } })
                            const actual = wrapper.state('userRank')
                            const expected = 'rank'
                            assert.equal(actual, expected)
                        })
                    })
                    describe('Login Button', () => {
                        it('should have id loginButton', () => {
                            const actual = wrapper.exists('#loginButton')
                            const expected = true
                            assert.equal(actual, expected)
                        })
                    })
                })
            })
        })
        describe('Lobby', () => {
            it('should not show the #lobby if visiblepage is not lobby', () => {
                wrapper.setState({ 'visiblePage': '' })
                const actual = wrapper.exists('#lobby')
                const expected = false
                assert.equal(actual, expected)
            })
            describe('When visiblePage is lobby', () => {
                beforeEach(() => {
                    wrapper.setState({ visiblePage: 'lobby' })
                })
                it('should have id lobby', () => {
                    const actual = wrapper.exists('#lobby')
                    const expected = true
                    assert.equal(actual, expected)
                })
                describe('Logout Button', () => {
                    it('should have id #logout', () => {
                        const actual = wrapper.exists('#logoutButton')
                        const expected = true
                        assert.equal(actual, expected)
                    })
                    
                })
                describe('Chat', () => {
                    it('should have an input field #chatInput', () => {
                        const actual = wrapper.exists('#chatInput')
                        const expected = true
                        assert.equal(actual, expected)
                    })
                    it('should have a div #chatLog', () => {
                        const actual = wrapper.exists('#chatLog')
                        const expected = true
                        assert.equal(actual, expected)
                    })
                    it('should use state.chatLog in chatlog', () => {
                        const chatLog = [{ chatContent: 'Hello', userName: 'Me' }]
                        wrapper.setState({ chatLog })
                        const actual = wrapper.find('#chatLog').text()
                        const expected = 'Hello'
                        assert.include(actual, expected)
                    })
                    it('should set state.chatContent on input', () => {
                        const onInput = wrapper.find('#chatInput').prop('onInput')
                        onInput({ currentTarget: { value: 'hi' } })
                        const actual = wrapper.state('chatContent')
                        const expected = 'hi'
                        assert.equal(actual, expected)

                    })
                })
            })
            
        })
    })
    describe('Class Methods', () => {
        describe('handleLogin', () => {
            it('should exist', () => {
                const actual = (wrapper.instance().handleLogin)
                assert.exists(actual)
            })
            it('should call preventdefault', () => {
                const spy = jest.fn()
                wrapper.instance().handleLogin({ preventDefault: spy })
                const actual = spy.mock.calls.length
                const expected = 1
                assert.equal(actual, expected)
                
            })
            it('should set userName to "Guest" when userName is empty', () => {
                wrapper.setState({ userName: '' })
                wrapper.instance().handleLogin({ preventDefault: () => {} })
                const actual = wrapper.state('userName')
                const expected = 'Guest'
                assert.equal(actual, expected)
            })   
            it('should set userRank to ?? when userRank is empty', () => {
                wrapper.setState({ userRank: '' })
                wrapper.instance().handleLogin({ preventDefault: () => {} })
                const actual = wrapper.state('userRank')
                const expected = '??'
                assert.equal(actual, expected)
            })   
            it('should set visiblePage to lobby', () => {
                wrapper.instance().handleLogin({ preventDefault: () => {} })
                const actual = wrapper.state('visiblePage')
                const expected = 'lobby'
                assert.equal(actual, expected)
            })
            it('should broadcast loggedIn and send userName and userRank', () => {
                const spy = jest.fn()
                const instance = wrapper.instance()
                instance.hub.broadcast = spy
                instance.handleLogin({ preventDefault: () => {} })
                
                const actual = spy.mock.calls
                assert.equal(actual.length, 1)
                assert.equal(actual[0][0], 'loggedIn')
                assert.exists(actual[0][1]['userName'])
                assert.exists(actual[0][1]['userRank'])
            })
        })
        describe('handleLogout', () => {
            it('should exist', () => {
                const actual = (wrapper.instance().handleLogout)
                assert.exists(actual)
            })
            it('should set visiblePage to "loginPage"', () => {
                wrapper.setState({ visiblePage: 'lobby' })
                wrapper.instance().handleLogout()
                const actual = wrapper.state('visiblePage')
                const expected = 'loginPage'
                assert.equal(actual, expected)
            }) 
            it('should broadcast loggedOut with userName and userRank', () => {
                const spy = jest.fn()
                const instance = wrapper.instance()
                instance.hub.broadcast = spy
                instance.handleLogout()
                
                const actual = spy.mock.calls
                assert.equal(actual.length, 1)
                assert.equal(actual[0][0], 'loggedOut')
                assert.exists(actual[0][1]['userName'])
                assert.exists(actual[0][1]['userRank'])
            })
        })

        describe('handleNewGame', () => {
            it('should exist', () => {
                const actual = (wrapper.instance().handleNewGame)
                assert.exists(actual)
            })
            it('should set open a window to this.sabaki + gameId', () => {
                const spy = jest.fn()
                global.open = spy
                const instance = wrapper.instance()
                instance.sabaki = 'https://fake'
                instance.handleNewGame({ preventDefault: () => {} })

                const actual = spy.mock.calls
                assert.equal(actual.length, 1)
                assert.include(actual[0][0], 'https://fake')
                assert.include(actual[0][1], 'gameWindow')
            }) 
            it('should broadcast gameClick with gameId, userName and dateCreated', () => {
                const spy = jest.fn()
                const instance = wrapper.instance()
                global.open = () => {}
                instance.hub.broadcast = spy
                instance.handleNewGame()
                
                const actual = spy.mock.calls
                assert.equal(actual.length, 1)
                assert.equal(actual[0][0], 'gameClick')
                assert.exists(actual[0][1]['gameId'])
                assert.exists(actual[0][1]['userName'])
                assert.exists(actual[0][1]['dateCreated'])


            })
        })

        describe('handleGameClick', () => {
            it('should exist', () => {
                const actual = (wrapper.instance().handleGameClick)
                assert.exists(actual)
            })
            it('should set open a window to this.sabaki + gameId', () => {
                const spy = jest.fn()
                global.open = spy
                const instance = wrapper.instance()
                instance.sabaki = 'https://fake'
                const g = { gameId: '', userName: '', dateCreated: '' }
                instance.handleGameClick(g)({ preventDefault: () => {} })

                const actual = spy.mock.calls
                assert.equal(actual.length, 1)
                assert.include(actual[0][0], 'https://fake')
                assert.include(actual[0][1], 'gameWindow')
            }) 
            it('should broadcast gameClick with gameId, userName and dateCreated', () => {
                const spy = jest.fn()
                global.open = () => {}
                const instance = wrapper.instance()
                instance.hub.broadcast = spy
                const g = { gameId: '', userName: '', dateCreated: '' }
                instance.handleGameClick(g)()
                
                const actual = spy.mock.calls
                assert.equal(actual.length, 1)
                assert.equal(actual[0][0], 'gameClick')
                assert.exists(actual[0][1]['gameId'])
                assert.exists(actual[0][1]['userName'])
                assert.exists(actual[0][1]['dateCreated'])
            })
        })

        describe('sendMessage', () => {
            it('should exist', () => {
                assert.exists(wrapper.instance().sendMessage)
            })
            it('should call preventdefault', () => {
                const spy = jest.fn()
                wrapper.instance().sendMessage({ preventDefault: spy })
                const actual = spy.mock.calls.length
                const expected = 1
                assert.equal(actual, expected)
                
            })
            it('should set state.chatContent to empty', () => {
                const chatContent = 'Hello world!'
                wrapper.setState({ chatContent })
                wrapper.instance().sendMessage({ preventDefault: () => {} })
                const actual = wrapper.state('chatContent')
                assert.equal(actual, '')
            })
            it('should broadcast sendMessage with userName, userRank and chatContent', () => {
                const spy = jest.fn()
                const instance = wrapper.instance()
                instance.hub.broadcast = spy
                instance.sendMessage({ preventDefault: () => {} })
                
                const actual = spy.mock.calls
                assert.equal(actual.length, 1)
                assert.equal(actual[0][0], 'sendMessage')
                assert.exists(actual[0][1]['userName'])
                assert.exists(actual[0][1]['userRank'])
                assert.exists(actual[0][1]['chatContent'])
            })

        })

        describe('getSubscriptions', () => {
            it('should subscribe to subscriptions', () => {
                const spy = jest.fn()
                const instance = wrapper.instance()
                instance.hub.subscribe = spy
                instance.getSubscriptions()
                const actual = spy.mock.calls
                assert.equal(actual.length, 4)
                
            })    
        })
    })  
})