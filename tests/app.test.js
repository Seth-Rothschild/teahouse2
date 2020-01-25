import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-preact-pure'
import { shallow } from 'enzyme'
import { h } from 'preact'
import { expect } from 'chai'
import App from '../src/components/App'
configure({ adapter: new Adapter })

describe('App', () => {
    let wrapper
    beforeEach(() => {
        wrapper = shallow(<App />)
    })
    it('should display Hello World', () => {
        const expected = 'Hello world'
        const real = wrapper.find('#title').text()

        expect(real).to.include(expected)
    })
})