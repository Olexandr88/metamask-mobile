import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../../util/theme';
import type { Colors } from '../../../../util/theme/models';

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      padding: 16,
      borderRadius: 8,
      backgroundColor: colors.background.alternative,
      marginBottom: 16,
    },
    title: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text.default,
    },
    rewards: {
      fontSize: 12,
      color: colors.text.muted,
      marginTop: 4,
    },
  });

const AnnualRewardsRate = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MetaMask Pool</Text>
      <Text style={styles.rewards}>2.6% Est. annual rewards</Text>
    </View>
  );
};

export default AnnualRewardsRate;
