'use strict';

import TestHelpers from '../../helpers';
import { Smoke } from '../../tags';
import WalletView from '../../pages/WalletView';
import TokenOverview from '../../pages/TokenOverview';
import { switchToGoreliNetwork, CreateNewWallet } from '../../viewHelper';
import Networks from '../../resources/networks.json';

describe(Smoke('Token Chart Tests'), () => {
  beforeEach(async () => {
    jest.setTimeout(150000);
  });

  it('should import wallet and go to the wallet view', async () => {
    await CreateNewWallet();
  });

  it('should view the token chart', async () => {
    await TestHelpers.delay(7000);
    await WalletView.tapOnToken();
    await TokenOverview.isVisible();
    await TokenOverview.TokenQuoteIsNotZero();
    await TokenOverview.checkIfChartIsVisible();
    await TokenOverview.scrollOnScreen();
    await TokenOverview.isReceiveButtonVisible();
    await TokenOverview.isBuyButtonVisible();
    await TokenOverview.isSendButtonVisible();
    await TokenOverview.isSwapButtonVisible();
    await TokenOverview.tapBackButton();
  });

  it('should not display the chart when using Goerli test network', async () => {
    await switchToGoreliNetwork();
    await WalletView.tapOnToken(Networks.Goerli.providerConfig.ticker);
    await TokenOverview.isVisible();
    await TokenOverview.ChartNotVisible();
    await TokenOverview.TokenQuoteIsNotZero();
  });
});
