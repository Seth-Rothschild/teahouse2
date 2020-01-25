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
        it('should have a component with id "title"', () => {
            const expected = wrapper.exists('#title')
            const actual = true
            assert.equal(actual, expected)
        })
        it('should display Hello World', () => {
            const expected = 'Hello world'
            const actual = wrapper.find('#title').text()
            assert.equal(actual, expected)
        })
    })
    describe('Class Methods', () => {
        
    })
    
})