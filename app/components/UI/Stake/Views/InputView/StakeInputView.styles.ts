import { StyleSheet } from 'react-native';
import type { Theme } from '../../../../../util/theme/models';

const styleSheet = (params: { theme: Theme }) => {
  const { theme } = params;
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.default,
      justifyContent: 'space-between',
    },
    inputContainer: {
      flex: 1,
      backgroundColor: colors.background.default,
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 16,
    },
    balanceText: {
      color: colors.text.default,
      textAlign: 'center',
    },
    amountRow: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: 4,
    },
    amountContainer: {
      alignItems: 'center',
      marginBottom: 0,
      marginTop: 50,
    },
    amountText: {
      fontSize: 28,
      color: colors.text.alternative,
    },
    currencyText: {
      fontSize: 28,
      color: colors.text.alternative,
    },
    actionSwitch: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 999,
      flexDirection: 'row',
      borderColor: colors.text.muted,
      borderWidth: 1,
      right: -2,
      alignItems: 'center',
    },
    currencySwitch: {
      alignItems: 'center',
    },
    switchText: {
      fontSize: 16,
      color: colors.primary.default,
    },
    stakeButton: {
      marginVertical: 5,
      paddingHorizontal: 16, // Added padding around the stake button
      paddingVertical: 16, // Added padding around the stake button
    },
    stakeButtonText: {
      fontSize: 18,
      color: colors.text.alternative,
    },
    keypad: {
      marginBottom: 0,
      padding: 8, // Added padding around the keypad
    },
    rewardsRateContainer: {
      marginBottom: 20,
    },
    buttonNextWrapper: {
      paddingHorizontal: 20,
      paddingBottom: 0,
    },
  });
};

export default styleSheet;
