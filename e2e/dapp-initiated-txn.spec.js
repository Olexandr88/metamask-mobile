'use strict';
import TestHelpers from './helpers';

const Correct_Seed_Words = 'fold media south add since false relax immense pause cloth just raven';
const Correct_Password = `12345678`;
const Ropsten = 'Ropsten Test Network';
const Ropsten_Faucet = 'https://faucet.metamask.io';
const Crypto_K = 'https://www.cryptokitties.co';
const ETH_Faucet = 'Test Ether Faucet';

describe('Import seedphrase flow', () => {
	beforeEach(() => {
		jest.setTimeout(150000);
	});

	it('should import wallet via seed phrase', async () => {
		// Check that we are on the home screen
		await TestHelpers.checkIfVisible('home-screen');
		// Check that Sync or import your wallet CTA is visible & tap it
		await TestHelpers.waitAndTap('onboarding-import-button');
		// Check that we are on the import wallet screen
		await TestHelpers.checkIfVisible('import-wallet-screen');
		// Check that Import using seed phrase CTA is visible & tap it
		await TestHelpers.waitAndTap('import-wallet-import-from-seed-button');
		// Check that we are on the import from seed screen
		await TestHelpers.checkIfVisible('import-from-seed-screen');
		// Input seed phrase
		await TestHelpers.typeTextAndHideKeyboard(`input-seed-phrase`, Correct_Seed_Words);
		// Input password
		await TestHelpers.typeTextAndHideKeyboard(`input-password-field`, Correct_Password);
		// Input password confirm
		await TestHelpers.typeTextAndHideKeyboard(`input-password-field-confirm`, Correct_Password);
		// Check that we are on the metametrics optIn screen
		await TestHelpers.checkIfVisible('metaMetrics-OptIn');
		// Check that I Agree CTA is visible and tap it
		await TestHelpers.waitAndTap('agree-button');
		// Check that we are on the wallet screen
		await TestHelpers.checkIfExists('wallet-screen');
		// Check that No thanks CTA is visible and tap it
		await TestHelpers.waitAndTap('onboarding-wizard-back-button');
		// Check that the onboarding wizard is gone
		await TestHelpers.checkIfNotVisible('onboarding-wizard-step1-view');
		// Ensure ETH Value is correct
		await TestHelpers.checkIfElementHasString('balance', '0 ETH');
	});

	it('should switch to ropsten network and validate ETH value', async () => {
		// Tap on Ethereum Main Network to prompt modal
		await TestHelpers.tapAtPoint('wallet-screen', { x: 200, y: -5 });
		// Check that the Networks modal pops up
		await TestHelpers.checkIfVisible('networks-list');
		// Tap on Ropsten Test Nework
		await TestHelpers.tapByText(Ropsten);
		// Check that we are on Ropsten network
		await TestHelpers.checkIfElementWithTextIsVisible(Ropsten);
		// Ensure ETH Value is correct
		await TestHelpers.checkIfElementHasString('balance', '1.9');
	});

	it('should go to browser and navigate to MM Ropsten faucet', async () => {
		// Open Drawer
		await TestHelpers.tapAtPoint('wallet-screen', { x: 30, y: -5 });
		// Check that the drawer is visbile
		await TestHelpers.checkIfVisible('drawer-screen');
		// Tap on Browser
		await TestHelpers.tapByText('Browser');
		// Check that we are on the browser screen
		await TestHelpers.checkIfVisible('browser-screen');
		// Tap on search in bottom navbar
		await TestHelpers.tap('search-button');
		// Navigate to URL
		await TestHelpers.typeTextAndHideKeyboard('url-input', Ropsten_Faucet);
		// Check that we are still on the browser screen
		await TestHelpers.checkIfVisible('browser-screen');
		// Tap on header URL
		await TestHelpers.tapAtPoint('browser-screen', { x: 200, y: -5 });
		// Clear text
		await TestHelpers.replaceTextInField('url-input', Crypto_K);
		// Tap on an autocomplete option
		await element(by.text('CryptoKitties'))
			.atIndex(1)
			.tap();
		// Check that we are still on the browser screen
		await TestHelpers.checkIfVisible('browser-screen');
		// Tap on options
		await TestHelpers.waitAndTap('options-button');
		// Tap on New tab
		await TestHelpers.tapByText('New tab');
		// Tap on tabs on bottom navbar
		await TestHelpers.tap('show-tabs-button');
		// Tap on faucet tab
		await TestHelpers.tapAtPoint('browser-screen', { x: 220, y: 120 });
		// Check that we are still on the browser screen
		await TestHelpers.checkIfVisible('browser-screen');
		// Tap back button
		await TestHelpers.waitAndTap('go-back-button');
	});

	it('should donate ETH on MM Ropsten', async () => {
		// Tap to donate 1 ETH
		await TestHelpers.tapAtPoint('browser-screen', { x: 76, y: 189 });
		// Check that account approval is displayed with correct dapp name
		await TestHelpers.checkIfHasText('dapp-name-title', ETH_Faucet);
		// Tap on CONNECT button
		await TestHelpers.tapByText('CONNECT');
		// Check that we are on the confirm transaction screen
		await TestHelpers.checkIfVisible('confirm-transaction-screen');
		// Tap on CONFIRM button
		await TestHelpers.tapByText('CONFIRM');
		// Check that we are on the browser screen
		await TestHelpers.checkIfVisible('browser-screen');
		// Open Drawer
		await TestHelpers.tapAtPoint('browser-screen', { x: 30, y: -5 });
		// Check that the drawer is visbile
		await TestHelpers.checkIfVisible('drawer-screen');
		// Tap on Transaction History
		await TestHelpers.tapByText('Transaction History');
		// Dismiss alert
		await TestHelpers.tapAlertWithButton('No, thanks');
		// Check that we are on the transactions screen
		await TestHelpers.checkIfVisible('transactions-screen');
		// Open Drawer
		await TestHelpers.tapAtPoint('transactions-screen', { x: 30, y: -5 });
		// Check that the drawer is visbile
		await TestHelpers.checkIfVisible('drawer-screen');
		// Tap on Wallet
		await TestHelpers.tapByText('Wallet');
		// Check that we are on the wallet screen
		await TestHelpers.checkIfVisible('wallet-screen');
		// Ensure ETH Value is correct
		await TestHelpers.checkIfElementHasString('balance', '0.9 ETH');
	});

	it('should go back to browser to request ETH', async () => {
		// Open Drawer
		await TestHelpers.tapAtPoint('wallet-screen', { x: 30, y: -5 });
		// Check that the drawer is visbile
		await TestHelpers.checkIfVisible('drawer-screen');
		// Tap on Browser
		await TestHelpers.tapByText('Browser');
		// Check that we are on the browser screen
		await TestHelpers.checkIfVisible('browser-screen');
		// Tap to request 1 ETH
		await TestHelpers.tapAtPoint('browser-screen', { x: 95, y: 95 });
		// Tap on header URL
		await TestHelpers.tapAtPoint('browser-screen', { x: 200, y: -5 });
		// Tap cancel
		await TestHelpers.waitAndTap('cancel-url-button');
	});

	it('should log out', async () => {
		// Open Drawer
		await TestHelpers.tapAtPoint('browser-screen', { x: 30, y: -5 });
		// Check that the drawer is visbile
		await TestHelpers.checkIfVisible('drawer-screen');
		// Tap on Log Out
		await TestHelpers.tapByText('Log Out');
		// Tap YES
		await TestHelpers.tapAlertWithButton('YES');
		// Check that we are on the wallet screen
		await TestHelpers.checkIfVisible('login');
	});
});
