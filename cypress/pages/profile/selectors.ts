/// <reference types="cypress" />
// to specify data-testid attribute selector add prefix 'testid:' to the locator

export const updateProfileButton = () => cy.get('[data-qa=profile-submit-button]');
export const profileForm = () => cy.get('testid:profile-form');
export const changeEmailLink = () => cy.get('testid:profile-edit-button');
