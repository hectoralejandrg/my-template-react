describe('Access', () => {
  beforeEach(() => {
    cy.visit('localhost:8080/login')
  })
  it('.type() - type into a DOM element', () => {
    // https://on.cypress.io/type
    cy.get('#email').type('pablo.sepulveda@enviame.io').should('have.value', 'pablo.sepulveda@enviame.io')
    cy.get('#password').type('123123123').should('have.value', 'pablo.sepulveda@enviame.io')
  })
})