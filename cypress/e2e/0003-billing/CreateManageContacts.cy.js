describe('Billing - CreateManageContacts: CREATE', () => {
  beforeEach(() => {
      cy.visit('localhost:8080/login')
      cy.get('#email').type('tucorreo@enviame.io')
      cy.get('#password').type('***')
      cy.contains('Iniciar sesión').click()
      cy.wait(5000)
  })
  
  it('displays: address, place_name, city and business_activity', () => {    
    cy.visit('localhost:8080/billing/manage/create') 
    cy.get('#address').within(() => {
      cy.get('input[name="address"]')
    })
    cy.get('#place_name').within(() => {
      cy.get('input[name="place_name"]')
    })
    cy.get('#city').within(() => {
      cy.get('input[name="city"]')
    })
    cy.get('#business_activity').within(() => {
      cy.get('input[name="business_activity"]')
    })
    // cy.get('#business_activity').within(() => {
    //   cy.get('input[name="business_activity"]').invoke('val').should('not.be.empty')
    // })
  })

  it('displays: business_activity as required element', () => {    
    cy.visit('localhost:8080/billing/manage/create') 
    cy.get('#business_activity').within(() => {
      cy.get('label').children('.text-danger')
    })
  })

  it('Validated: business_activity as required from back', () => {   
    cy.visit('localhost:8080/billing/manage/create') 
    cy.wait(5000)
    cy.get('button').contains('Crear contacto').click()
    .get('input[name="business_activity"]').should('have.attr', 'aria-invalid', 'true')
  })
})


describe('Billing - CreateManageContacts: EDIT', () => {
  beforeEach(() => {
      cy.visit('localhost:8080/login')
      cy.get('#email').type('tucorreo@enviame.io')
      cy.get('#password').type('***')
      cy.contains('Iniciar sesión').click()
      cy.wait(5000)
  })
  
  it('displays: address, place_name, city and business_activity with values', () => {    
    cy.visit('localhost:8080/billing/manage/edit/2582') 
    cy.get('#address').within(() => {
      cy.get('input[name="address"]').invoke('val').should('not.be.empty')
    })
    cy.get('#place_name').within(() => {
      cy.get('input[name="place_name"]').invoke('val').should('not.be.empty')
    })
    cy.get('#city').within(() => {
      cy.get('input[name="city"]').invoke('val').should('not.be.empty')
    })
    cy.get('#business_activity').within(() => {
      cy.get('input[name="business_activity"]').invoke('val').should('not.be.empty')
    })
    // cy.get('#business_activity').within(() => {
    //   cy.get('input[name="business_activity"]').invoke('val').should('be.empty')
    // })
  })
})
