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
                    it('should have text "Welcome to TeaHouse!"', () => {
                        const actual = wrapper.find('#title').text()
                        const expected = 'Welcome to Teahouse!'
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
                        it('should have placeholder "User Name"', () => {
                            const actual = wrapper.find('#userName').prop('placeholder')
                            const expected = 'User Name'
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
                it('should show the userName', () => {
                    const userName = 'thegreatxxx'
                    wrapper.setState({ userName })
                    const actual = wrapper.find('#lobby').text()
                    const expected = userName
                    assert.include(actual, expected)
                })
                it('should show the rank', () => {
                    const userRank = '2p'
                    wrapper.setState({ userRank })
                    const actual = wrapper.find('#lobby').text()
                    const expected = userRank
                    assert.include(actual, expected)
                })
            })
            
        })
    })
    describe('Class Methods', () => {
        it('should have handleSubmit', () => {
            const actual = (wrapper.instance().handleSubmit)
            assert.exists(actual)
        })
        it('should call preventdefault', () => {
            const spy = jest.fn()
            wrapper.instance().handleSubmit({ preventDefault: spy })
            const actual = spy.mock.calls.length
            const expected = 1
            assert.equal(actual, expected)
            
        })
        it('should set visiblePage to lobby', () => {
            wrapper.instance().handleSubmit({ preventDefault: () => {} })
            const actual = wrapper.state('visiblePage')
            const expected = 'lobby'
            assert.equal(actual, expected)
        })
    })
    
})