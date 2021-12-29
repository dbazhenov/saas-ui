/// <reference types="cypress" />
// to specify data-testid attribute selector add prefix 'testid:' to the locator

export const loginForm = () => cy.get('testid:login-form');
export const emailFieldLabel = () => cy.get('testid:email-field-label');
export const emailField = () => cy.get('testid:email-text-input');
export const loginButton = () => cy.get('testid:login-button');
export const signUpLink = () => cy.get('testid:signup-link');
export const termsCheckbox = () => cy.get('testid:consent-checkbox-input');
export const termsText = () => cy.get('testid:consent-field-label');
export const termsValidation = () => cy.get('testid:consent-field-error-message');
export const firstNameFieldLabel = () => cy.get('testid:firstName-field-label');
export const lastNameFieldLabel = () => cy.get('testid:lastName-field-label');
export const firstNameField = () => cy.get('testid:firstName-text-input');
export const firstNameValidation = () => cy.get('testid:firstName-field-error-message');
export const lastNameField = () => cy.get('testid:lastName-text-input');
export const lastNameValidation = () => cy.get('testid:lastName-field-error-message');
export const resetPasswordLink = () => cy.get('testid:login-reset-password-link');
export const loginHelpLink = () => cy.get('testid:login-help-link');
