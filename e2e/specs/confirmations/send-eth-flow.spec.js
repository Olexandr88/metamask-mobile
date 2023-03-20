'use strict';

import AmountView from '../../pages/AmountView';
import SendView from '../../pages/SendView';
import TransactionConfirmationView from '../../pages/TransactionConfirmView';
import WalletView from '../../pages/WalletView';
import {
  importWalletWithRecoveryPhrase,
  addLocalhostNetwork,
} from '../../viewHelper';
import Accounts from '../../../wdio/helpers/Accounts';
import Ganache from '../../../app/util/test/ganache';

const validAccount = Accounts.getValidAccount();
const MYTH_ADDRESS = '0x1FDb169Ef12954F20A15852980e1F0C122BfC1D6';

describe('Send ETH Tests', () => {
  let ganacheServer;
  beforeEach(async () => {
    jest.setTimeout(150000);

    ganacheServer = new Ganache();
    await ganacheServer.start({ mnemonic: validAccount.seedPhrase });
  });

  afterEach(async () => {
    await ganacheServer.quit();
  });

  it('should go to send view', async () => {
    await importWalletWithRecoveryPhrase();
    await addLocalhostNetwork();
    // Navigate to send flow
    await WalletView.tapSendIcon();
    // Make sure view with my accounts visible
    await SendView.isTransferBetweenMyAccountsButtonVisible();
  });

  it('should input a valid address to send to', async () => {
    await SendView.inputAddress(MYTH_ADDRESS);
    await SendView.noEthWarningMessageIsVisible();
    await SendView.tapNextButton();
    // Check that we are on the amount view
    await AmountView.isVisible();
  });

  // TODO: Add support for conversion rate on localhost during e2e tests
  // it('should switch currency from crypto to fiat and back to crypto', async () => {
  //   await AmountView.typeInTransactionAmount('0.004');
  //   await AmountView.tapCurrencySwitch();
  //   await AmountView.isTransactionAmountConversionValueCorrect('0.004 TST');
  //   await AmountView.tapCurrencySwitch();
  //   await AmountView.isTransactionAmountCorrect('0.004');
  // });

  it('should input and validate amount', async () => {
    // Input acceptable value
    await AmountView.typeInTransactionAmount('0');
    await AmountView.tapNextButton();

    // Check that we are on the confirm view
    await TransactionConfirmationView.isVisible();
  });

  it('should send ETH to Account 2', async () => {
    // Check that the amount is correct
    await TransactionConfirmationView.isTransactionTotalCorrect('0 TST');
    // Tap on the Send CTA
    await TransactionConfirmationView.tapConfirmButton();
    // Check that we are on the wallet screen
    await WalletView.isVisible();
  });
});
