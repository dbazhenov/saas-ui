/// <reference types="cypress" />

import { timeouts } from '../../fixtures/timeouts';

export const popUp = () => cy.findByRole('alert', { timeout: timeouts.ONE_MIN });
