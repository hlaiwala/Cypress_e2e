// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('GetVerificationCode', GetVerificationCode);

function GetVerificationCode(){
    var searchItem = 'subject:LibreView Verification Code';
    var snippet = "";

    cy.request({
        method: 'POST',
        url: 'https://accounts.google.com/o/oauth2/token',
        form: true,
        body:{
            client_id:
          "1080712786914-bq05escecffjaq346n88p82pujctn7gk.apps.googleusercontent.com",
        client_secret: "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",
        refresh_token:
          "1//06VecS1b-0gt8CgYIARAAGAYSNwF-L9IrKbxPWjpbfK2rt4uJ6V-qmOVHPdy2iIw-uhdyP80ofgcUhD9NLra1nOvj0raeMcGPVpY",
        grant_type: "refresh_token",
        }
    }).then(response => {
        const token =  response.body.access_token;
        // cy.log(JSON.stringify(response));
        // cy.log(response.body.access_token);
        // cy.log("Variable:"+token);

        cy.request({
            method: 'GET',
            url: 'https://www.googleapis.com/gmail/v1/users/me/messages?q='+searchItem,
            headers: {
                'Authorization': 'Bearer '+ response.body.access_token
            }
        }).then(response => {
            // cy.log(JSON.stringify(response));
            // cy.log(response.body.messages[0].id);

            cy.request({
                method: 'GET',
            url: 'https://www.googleapis.com/gmail/v1/users/me/messages/'+response.body.messages[0].id,
            headers: {
                'Authorization': 'Bearer '+ token
            }
            }).then(response => {
                snippet = response.body.snippet;
                String(snippet).substring(
                    snippet.indexOf(':') + 1,
                    snippet.lastIndexOf('T')
                )
                // cy.log(JSON.stringify(response));
                 cy.log("Snippet is: " + snippet);
                               
            })

        })
    })
    return cy.wrap(snippet);
}