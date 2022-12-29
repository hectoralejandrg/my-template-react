describe('Marketcenter', () => {
  beforeEach(() => {
    cy.visit('localhost:8080/login')
    cy.get('#email').type('hector.guamanquispe@enviame.io')
    cy.get('#password').type('isabella@1530')
    cy.contains('Iniciar sesión').click()
    cy.wait(5000)
  })
  it('show view marketcenter', () => {
    cy.visit('localhost:8080/marketcenter')    
    cy.contains('Marketcenter').should('be.visible')
  })

  it.only('request', () => {
    cy.visit('localhost:8080/marketcenter')
    cy.request({
      url: 'https://stage.front.ottawa.enviame.io/v1/marketcenters',
      heaaders: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    }).then((res) => {
      expect(res.body).to.have.property('code')
      expect(res.body).to.have.property('data')
      expect(res.body.code).to.equal('success')
      expect(res.body.data.length).to.be.gte(0)
    })
  })

  // describe.only('get request for marketcenters', () => {
  //   beforeEach(() => {
  //     cy.visit('localhost:8080/marketcenter')
  //     cy.request({
  //       url: 'https://stage.front.ottawa.enviame.io/v1/marketcenters',
  //       heaaders: {
  //         Authorization: `Bearer ${localStorage.getItem('accessToken')}`
  //       }
  //     }).then((res) => {
  //       expect(res.body).to.have.property('code')
  //       expect(res.body).to.have.property('data')
  //       expect(res.body.code).to.equal('success')
  //       expect(res.body.data.length).to.be.gte(0)
  //     })
  //   })
  // })
})