describe('When I visit my app', () => {    
    it('should load the page', function() {
        cy.visit('/')
    })
    it('should have a loginButton', () => {
        cy.get('#loginButton').click()
            .get('#lobbyTitle')
    })
    it('should have a chatInput', () => {
        cy.get('#chatInput')
            .type('Hello world{enter}')
            .type('This is a functioning test{enter}')
        cy.get('#chatLog').contains('This is a functioning test')
    })
})
