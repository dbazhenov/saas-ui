import {getUser} from 'pages/auth/getUser';
import signUpPage from 'pages/auth/signUp.page';
import signInPage from 'pages/auth/signIn.page';
import commonPage from 'pages/common.page';

context('Sign Up', () => {
    let newUser;
    const mailosaurServerId = Cypress.env('mailosaur_ui_tests_server_id');

    beforeEach(() => {
        newUser = getUser();
        cy.visit('/');
        cy.get(signInPage.locators.signUpLink).click();
        cy.get(signUpPage.locators.registrationContainer).isVisible();
    });

    it('SAAS-T78 - Verify Sign Up on Percona Portal', () => {
        cy.log('This test also covers: SAAS-T124 - Verify user can see notification about Account confirmation email sent');
        cy.log('This test also covers: SAAS-T122 - Verify confirmation email is sent during Portal registration');
        newUser.email = signUpPage.methods.getMailosaurEmailAddress(newUser);
        signUpPage.methods.fillOutSignUpForm(newUser);
        cy.get(signUpPage.locators.termsOfService).check({force: true});
        cy.get(signUpPage.locators.registerButton).isEnabled().click();
        cy.get(signUpPage.locators.registrationCompleteTitle)
            .should('be.visible')
            .hasText(signUpPage.constants.messages.verificationEmailSentTitle);
        cy.get(signUpPage.locators.registrationCompleteDesc)
            .should('be.visible')
            .hasText(signUpPage.constants.messages.verificationEmailSentDesc);
        /*
            Due to timing issue cypress was finding link in sign up form.
            That is why we are looking inside registration complete container
        */
        cy.get(signUpPage.locators.registrationCompleteContainer).then((element) => {
            cy.get(signUpPage.locators.registrationCompleteBackLink, {withinSubject: element})
                .hasText(signUpPage.constants.messages.verificationEmailBackToSignIn)
                .hasAttr('href', '#');
        });
        cy.mailosaurGetMessage(mailosaurServerId, {sentTo: newUser.email}, {timeout: 20000})
            .then((message) => {
                expect(message.text.body)
                    .to
                    .contain(`Hi ${newUser.firstName},`)
                    .contain(signUpPage.constants.labels.activateEmailHeader)
                    .contain(signUpPage.constants.labels.activateEmailVerifyAccount)
                    .contain(signUpPage.constants.labels.activateEmailFooter);
                expect(message.metadata.headers.find(({field}) => field === 'Subject').value)
                    .to.be.equal(signUpPage.constants.labels.activateEmailSubject);
                const activateLink = message.html.links
                    .find(({text}) => text.trim() === signUpPage.constants.labels.activateAccount).href;

                // cy.visit() cannot visit different page, that is why we are replacing address
                cy.document().then((doc) => doc.location.replace(activateLink));
                cy.mailosaurDeleteMessage(message.id);
            });
        cy.url().should('contain', signUpPage.constants.links.loginAddress);
        cy.visit('');
        signInPage.methods.fillOutSignInUserDetails(newUser.email, newUser.password);
        cy.get(signInPage.locators.signInButton).isEnabled().click();    
        commonPage.methods.uiLogoutUser();
        signInPage.methods.fillOutSignInUserDetails(newUser.email, newUser.password);
        cy.get(signInPage.locators.signInButton).isEnabled().click();    
        commonPage.methods.commonPageLoaded();  
        cy.cleanUpAfterTest([newUser]);      
    });

    it('SAAS-T85 - Verify Sign Up if user already has Percona account', () => {
        cy.oktaCreateUser(newUser);
        signUpPage.methods.fillOutSignUpForm(newUser);
        cy.get(signUpPage.locators.termsOfService).check({force: true});
        cy.get(signUpPage.locators.registerButton).isEnabled().click();
        cy.get(signUpPage.locators.registrationAlert)
            .hasText(signUpPage.constants.messages.emailAlreadyRegistered);
        cy.cleanUpAfterTest([newUser]);
    });

    it('SAAS-T113 - Verify Sign up redirects to Okta widget', () => {
        cy.url().should('contain', signUpPage.constants.links.loginAddress);
        cy.get(signUpPage.locators.inputEmail)
            .children()
            .hasAttr('placeholder', signUpPage.constants.labels.emailPlaceholder);
        cy.get(signUpPage.locators.inputPassword)
            .children(signUpPage.locators.inputPasswordChildren)
            .hasAttr('placeholder', signUpPage.constants.labels.passwordPlaceholder);
        cy.get(signUpPage.locators.inputFirstName)
            .children()
            .hasAttr('placeholder', signUpPage.constants.labels.firstNamePlaceholder);
        cy.get(signUpPage.locators.inputLastName)
            .children()
            .hasAttr('placeholder', signUpPage.constants.labels.lastNamePlaceholder);
        cy.get(signUpPage.locators.termsOfServiceLabel).should((element) => {
            const trimmedText = element.text().replace(/\s\s+/g, ' ').trim();

            expect(trimmedText).to.contain(signUpPage.constants.messages.termsOfServiceText);
        })
            .isVisible().find('a').hasAttr('href', signUpPage.constants.links.platformTerms)
            .next().hasAttr('href', signUpPage.constants.links.platformPrivacy);
        cy.get(signUpPage.locators.registerButton).isDisabled();
    });

    it('SAAS-T115 - Verify validation for email on Sign Up', () => {
        signUpPage.methods.fillOutSignUpForm({
            email: 'Some Email',
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            password: newUser.password,
        });
        cy.get(signUpPage.locators.inputEmail).next().hasText(signUpPage.constants.messages.invalidEmail);
        cy.get(signUpPage.locators.termsOfService).check({force: true});
        cy.get(signUpPage.locators.registerButton).click();
        signUpPage.methods.verifyValidationSignUp({});
        cy.reload();
        cy.get(signInPage.locators.signUpLink).click();
        signUpPage.methods.fillOutSignUpForm({
            email: 'email@test.com.test',
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            password: newUser.password,
        });
        cy.contains(signUpPage.constants.messages.invalidEmail).should('not.exist');
        cy.get(signUpPage.locators.termsOfService).check({force: true});
        cy.get(signUpPage.locators.registerButton).isEnabled();
        cy.get(signUpPage.locators.termsOfService).uncheck({force: true});
        cy.get(signUpPage.locators.registerButton).isDisabled();
    });

    it('SAAS-T121 - Verify Sign Up to Platform is not possible without Last Name and First Name', () => {
        signUpPage.methods.fillOutSignUpForm({email: newUser.email, password: newUser.password});
        cy.get(signUpPage.locators.termsOfService).check({force: true});
        cy.get(signUpPage.locators.registerButton).click();
        signUpPage.methods.verifyValidationSignUp({firstName: true, lastName: true});
        cy.reload();
        cy.get(signInPage.locators.signUpLink).click();
        signUpPage.methods.fillOutSignUpForm({
            email: newUser.email,
            lastName: newUser.lastName,
            password: newUser.password,
        });
        cy.get(signUpPage.locators.termsOfService).check({force: true});
        cy.get(signUpPage.locators.registerButton).click();
        signUpPage.methods.verifyValidationSignUp({firstName: true});
        cy.reload();
        cy.get(signInPage.locators.signUpLink).click();
        signUpPage.methods.fillOutSignUpForm({
            email: newUser.email,
            firstName: newUser.firstName,
            password: newUser.password,
        });
        cy.get(signUpPage.locators.termsOfService).check({force: true});
        cy.get(signUpPage.locators.registerButton).click();
        signUpPage.methods.verifyValidationSignUp({lastName: true});
        cy.reload();
        cy.get(signInPage.locators.signUpLink).click();
        signUpPage.methods.fillOutSignUpForm({
            firstName: newUser.firstName,
            lastName: newUser.label,
            password: newUser.password,
        });
        cy.get(signUpPage.locators.termsOfService).check({force: true});
        cy.get(signUpPage.locators.registerButton).click();
        signUpPage.methods.verifyValidationSignUp({email: true});
        cy.reload();
        cy.get(signInPage.locators.signUpLink).click();
        signUpPage.methods.fillOutSignUpForm(newUser);
        cy.get(signUpPage.locators.termsOfService).check({force: true});
        cy.get(signUpPage.locators.registerButton).isEnabled();
        cy.get(signUpPage.locators.termsOfService).uncheck({force: true});
        cy.get(signUpPage.locators.registerButton).isDisabled();
    });

});
