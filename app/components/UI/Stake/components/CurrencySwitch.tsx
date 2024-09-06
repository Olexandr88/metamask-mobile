import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon, {
  IconName,
} from '../../../../component-library/components/Icons/Icon';
import { useTheme } from '../../../../util/theme';
import type { Colors } from '../../../../util/theme/models';

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    amount: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.background.alternative,
      backgroundColor: colors.background.alternative,
      marginRight: 5,
      minWidth: 78,
      padding: 7,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    switchWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    switchText: {
      fontSize: 14,
      textTransform: 'uppercase',
      color: colors.text.alternative,
    },
    iconDropdown: {
      paddingLeft: 10,
    },
  });

interface CurrencySwitchProps {
  isUsd: boolean;
  onPress: () => void;
  labelUsd?: string;
  labelEth?: string;
}

const CurrencySwitch = ({ isUsd, onPress }: CurrencySwitchProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity onPress={onPress} style={styles.amount}>
      <View style={styles.switchWrapper}>
        <Text style={styles.switchText}>{isUsd ? 'USD' : 'ETH'}</Text>
        <Icon name={IconName.SwapVertical} color={colors.primary.default} />
      </View>
    </TouchableOpacity>
  );
};

export default CurrencySwitch;
