
describe("Loging into LibreView using 2FA", () =>{

    beforeEach( () => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit("/");

    });
    
    it("login to libreview and verify the upload button", () => {
        
       //cy.GetVerificationCode();
        
       
       //select country and lanuage
        cy.get('#country-select').select('United States');
        cy.get('#language-select').select('English');
        cy.get('#submit-button').click({force : true});       

        // //input usernme and password
        cy.get('#loginForm-email-input').type(Cypress.env('username'));
        cy.get('#loginForm-password-input').type(Cypress.env('password'));
        cy.get('#loginForm-submit-button').click('right', {force : true});


        //Click on Send Code button 
        cy.get('#twoFactor-step1-next-button').click('right', {force :  true});
        cy.wait(1000);

        // // confirm browser has redirected successfully
        cy.location('pathname').should('eq' , '/auth/finishlogin');

        // // send and enter the verfication code
        // cy.get('#twoFactor-step1-next-button').click({force: true});
        cy.wait(10000);
        cy.GetVerificationCode()
            .then(value =>{
                cy.log("Verification Code:"+ value);
                cy.get('#twoFactor-step2-code-input').type(String(value));
                cy.get('#twoFactor-step2-next-button').click({force: true});
            })
        

        //confirm browser has redirected successfully
        cy.location('pathname').should('eq', '/meter');

        //confirm upload button is displayed
        cy.get('#meterUpload-linkedUpload-pat-button').should('exist');

    });


})