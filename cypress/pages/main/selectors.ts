/// <reference types="cypress" />
// to specify data-testid attribute selector add prefix 'testid:' to the locator

export const logoutButton = () => cy.get('testid:menu-bar-profile-dropdown-logout');
export const profileButton = () => cy.get('testid:menu-bar-profile-dropdown-profile');
export const gettingStartedContainer = () => cy.get('testid:getting-started-container');
export const profileIcon = () => cy.get('testid:menu-bar-profile-dropdown-toggle');
export const dropdownMenu = () => cy.get('testid:dropdown-menu-menu');
export const userEmail = () => cy.get('testid:user-email');
export const homeIcon = () => cy.get('testid:menu-bar-home-link');
