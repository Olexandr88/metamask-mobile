/* global driver */
import { WALLET_CONTAINER_ID, NAVBAR_TITLE_NETWORKS2 } from '../testIDs/Screens/WalletScreen-testIds.js';
import {
  ONBOARDING_WIZARD_STEP_1_CONTAINER_ID,
  ONBOARDING_WIZARD_STEP_1_NO_THANKS_ID,
} from '../testIDs/Components/OnboardingWizard.testIds';
import Selectors from '../helpers/Selectors';
import { WALLET_VIEW_BURGER_ICON_ID,
        HAMBURGER_MENU_BUTTON } from '../testIDs/Screens/WalletView.testIds';
import Gestures from '../helpers/Gestures.js';
import { DRAWER_VIEW_SETTINGS_TEXT_ID } from '../testIDs/Screens/DrawerView.testIds';


class WalletMainScreen {

  get wizardContainer() {
    return Selectors.getElementByPlatform(ONBOARDING_WIZARD_STEP_1_CONTAINER_ID);
  }

  get noThanks() {
    return Selectors.getElementByPlatform(ONBOARDING_WIZARD_STEP_1_NO_THANKS_ID);
  }

  get burgerIcon() {
    return Selectors.getElementByPlatform(WALLET_VIEW_BURGER_ICON_ID);
  }

  get HamburgerButton() {
    return Selectors.getElementByPlatform(HAMBURGER_MENU_BUTTON);
  }

  get WalletScreenContainer() {
    return Selectors.getElementByPlatform(WALLET_CONTAINER_ID);
  }

  get networkNavBarWalletTitle() {
    return Selectors.getElementByPlatform(NAVBAR_TITLE_NETWORKS2);
  }

  get drawerSettings() {
    return Selectors.getElementByPlatform(DRAWER_VIEW_SETTINGS_TEXT_ID);
  }

  async isOnboardingWizardVisible() {
    await expect(this.wizardContainer).toBeDisplayed();
  }

  async tapNoThanks() {
    await Gestures.waitAndTap(this.noThanks);
  }

  async tapBurgerIcon() {
    await Gestures.waitAndTap(this.burgerIcon);
  }

  async tapBurgerButton() {
    await Gestures.tap(this.HamburgerButton);
  }

  async tapBurgerButtonByXpath() {
    await Gestures.tap(await Selectors.getXpathElementByContentDescription(this.HamburgerButton));
  }

  async isVisible() {
    await expect(this.WalletScreenContainer).toBeDisplayed();
  }

  async tapNetworkNavBar() {
    const wait = 500;
    await driver.pause(wait);
    await Gestures.tap(this.networkNavBarWalletTitle);
  }

  async isNetworkNameCorrect(network) {
    const textFromElement = await this.networkNavBarWalletTitle;
    const networkName = await textFromElement.getText();
    await expect(networkName).toContain(network);
  }

  async tapSettings() {
    await Gestures.tap(this.drawerSettings);
  }

  async tapSendIcon(text){
    await Gestures.tapTextByXpath(text);
  }

}

export default new WalletMainScreen();
