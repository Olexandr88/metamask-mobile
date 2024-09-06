import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text, {
  TextColor,
  TextVariant,
} from '../../../../component-library/components/Texts/Text';
import { useTheme } from '../../../../util/theme';
import type { Colors } from '../../../../util/theme/models';

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      padding: 16,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    rewardCard: {
      backgroundColor: colors.background.default,
      borderColor: colors.border.default,
      borderRadius: 8,
      padding: 16,
      borderWidth: 0.5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rewardRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    poolText: {
      color: colors.text.default,
      fontSize: 14,
      fontWeight: '600',
    },
    rewardRateContainer: {
      alignItems: 'flex-end',
    },
    annualRewardRate: {
      color: colors.success.default,
      fontSize: 14,

      textAlign: 'right',
    },
    estimatedRewardsText: {
      color: colors.text.muted,
      fontSize: 12,
      textAlign: 'right',
    },
  });

interface AnnualRewardRateCardProps {
  annualRewardRate: string;
}

const AnnualRewardRateCard = ({
  annualRewardRate,
}: AnnualRewardRateCardProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.rewardCard}>
      <View style={styles.rewardRow}>
        <Text variant={TextVariant.BodyMDMedium}>MetaMask Pool</Text>
        <View style={styles.rewardRateContainer}>
          <Text color={TextColor.Success} variant={TextVariant.BodyMDMedium}>
            {annualRewardRate}
          </Text>
          <Text variant={TextVariant.BodySMMedium} color={TextColor.Muted}>
            Est. annual rewards
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AnnualRewardRateCard;
