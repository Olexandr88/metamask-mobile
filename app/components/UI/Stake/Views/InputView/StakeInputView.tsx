import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import Button, {
  ButtonSize,
  ButtonVariants,
  ButtonWidthTypes,
} from '../../../../../component-library/components/Buttons/Button';
import Keypad from '../../../../Base/Keypad';
import { useStyles } from '../../../../hooks/useStyles';
import { getStakeInputNavbar } from '../../../Navbar';
import ScreenLayout from '../../../Ramp/components/ScreenLayout';
import AnnualRewardsRateCard from '../../components/AnnualRewardsRateCard';
import CurrencySwitch from '../../components/CurrencySwitch';
import QuickAmounts from '../../components/QuickAmounts';
import styleSheet from './StakeInputView.styles';

const StakeInputView = () => {
  const navigation = useNavigation();
  const { styles, theme } = useStyles(styleSheet, {});

  const [amount, setAmount] = useState<string>('0');
  const [isUsd, setIsUsd] = useState<boolean>(true);

  useEffect(() => {
    navigation.setOptions(getStakeInputNavbar(navigation, theme.colors));
  }, [navigation, theme.colors]);

  /* Keypad Handlers */
  const handleKeypadChange = useCallback(
    ({ value }) => {
      if (value === amount) {
        return;
      }

      setAmount(value);
    },
    [amount],
  );

  const handleCurrencySwitch = useCallback(() => {
    setIsUsd(!isUsd);
  }, [isUsd]);

  const handleStakePress = useCallback(() => {
    // Add your logic here
  }, []);

  const percentageOptions = [
    { value: 0.25, label: '25%' },
    { value: 0.5, label: '50%' },
    { value: 0.75, label: '75%' },
    { value: 1, label: 'Max', isNative: true },
  ];

  const balance = useSelector((state: { balance: number }) => state.balance);

  const handleAmountPress = useCallback(
    (option) => {
      const selectedValue = String(option.value * balance);
      setAmount(selectedValue);
    },
    [balance],
  );

  return (
    <ScreenLayout style={styles.container}>
      <View style={styles.inputContainer}>
        <View>
          <Text style={styles.balanceText}>Balance</Text>
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountText}>{String(amount)}</Text>
          <Text style={styles.currencyText}>{isUsd ? 'USD' : 'ETH'}</Text>
        </View>
        <View style={styles.currencySwitch}>
          <CurrencySwitch isUsd={isUsd} onPress={handleCurrencySwitch} />
        </View>
      </View>
      <View style={styles.rewardsRateContainer}>
        <AnnualRewardsRateCard annualRewardRate="2.6%" />
      </View>
      <View style={styles.keypadContainer}>
        <QuickAmounts
          disabled={false}
          amounts={percentageOptions}
          onAmountPress={handleAmountPress}
        />

        <Keypad
          value={amount}
          onChange={handleKeypadChange}
          style={styles.keypad}
        />
      </View>

      <View style={styles.buttonNextWrapper}>
        <Button
          label={amount === '0' ? 'Enter amount' : 'Review'}
          variant={ButtonVariants.Primary}
          isDisabled={amount === '0'}
          size={ButtonSize.Lg}
          width={ButtonWidthTypes.Full}
          onPress={handleStakePress}
          style={styles.stakeButton}
        />
      </View>
    </ScreenLayout>
  );
};

export default StakeInputView;
