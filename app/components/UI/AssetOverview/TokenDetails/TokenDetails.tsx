import { zeroAddress } from 'ethereumjs-util';
import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import i18n from '../../../../../locales/i18n';
import { useStyles } from '../../../../component-library/hooks';
import styleSheet from './TokenDetails.styles';
import { formatAddress, safeToChecksumAddress } from '../../../../util/address';
import { selectTokenList } from '../../../../selectors/tokenListController';
import { selectContractExchangeRates } from '../../../../selectors/tokenRatesController';
import {
  selectConversionRate,
  selectCurrentCurrency,
} from '../../../../selectors/currencyRateController';
import {
  convertDecimalToPercentage,
  localizeLargeNumber,
} from '../../../../util/number';
import { formatCurrency } from '../../../../util/confirm-tx';
import Logger from '../../../../util/Logger';
import TokenDetailsList from './TokenDetailsList';
import MarketDetailsList from './MarketDetailsList';
import { Asset } from '../AssetOverview.types';

export interface TokenDetails {
  contractAddress: string | null;
  tokenDecimal: number | null;
  tokenList: string | null;
}

export interface MarketDetails {
  marketCap: string | null;
  totalVolume: number | null;
  volumeToMarketCap: string | null;
  circulatingSupply: number | null;
  allTimeHigh: string | null;
  allTimeLow: string | null;
  fullyDiluted: number | null;
}

interface TokenDetailsProps {
  asset: Asset;
}

const TokenDetails: React.FC<TokenDetailsProps> = ({ asset }) => {
  const { styles } = useStyles(styleSheet, {});
  const tokenList = useSelector(selectTokenList);
  const tokenExchangeRates = useSelector(selectContractExchangeRates);
  const conversionRate = useSelector(selectConversionRate);
  const currentCurrency = useSelector(selectCurrentCurrency);
  const tokenContractAddress = safeToChecksumAddress(asset.address);

  let tokenMetadata;
  let marketData;

  if (asset.isETH) {
    marketData = tokenExchangeRates[zeroAddress() as `0x${string}`];
  } else if (!asset.isETH && tokenContractAddress) {
    tokenMetadata = tokenList[tokenContractAddress.toLowerCase()];
    marketData = tokenExchangeRates[tokenContractAddress];
  } else {
    Logger.log('cannot find contract address');
    return null;
  }

  if (!conversionRate || conversionRate < 0) {
    Logger.log('invalid conversion rate');
    return null;
  }

  const tokenDetails: TokenDetails = asset.isETH
    ? {
        contractAddress: formatAddress(zeroAddress(), 'short'),
        tokenDecimal: 18,
        tokenList: '',
      }
    : {
        contractAddress:
          formatAddress(tokenContractAddress as string, 'short') || null,
        tokenDecimal: tokenMetadata?.decimals || null,
        tokenList: tokenMetadata?.aggregators.join(', ') || null,
      };

  const marketDetails: MarketDetails = {
    marketCap:
      marketData?.marketCap > 0
        ? localizeLargeNumber(i18n, conversionRate * marketData.marketCap)
        : null,
    totalVolume:
      marketData?.totalVolume > 0
        ? localizeLargeNumber(i18n, conversionRate * marketData.totalVolume)
        : null,
    volumeToMarketCap:
      marketData?.marketCap > 0
        ? convertDecimalToPercentage(
            marketData.totalVolume / marketData.marketCap,
          )
        : null,
    circulatingSupply:
      marketData?.circulatingSupply > 0
        ? localizeLargeNumber(i18n, marketData.circulatingSupply)
        : null,
    allTimeHigh:
      marketData?.allTimeHigh > 0
        ? formatCurrency(
            conversionRate * marketData.allTimeHigh,
            currentCurrency,
          )
        : null,
    allTimeLow:
      marketData?.allTimeLow > 0
        ? formatCurrency(
            conversionRate * marketData.allTimeLow,
            currentCurrency,
          )
        : null,
    fullyDiluted:
      marketData?.dilutedMarketCap > 0
        ? localizeLargeNumber(i18n, marketData.dilutedMarketCap)
        : null,
  };

  console.log('MARKET DETAILS: ', marketDetails);
  console.log('TOKEN DETAILS: ', tokenDetails);

  return (
    <View style={styles.wrapper}>
      {(asset.isETH || tokenMetadata) && (
        <TokenDetailsList tokenDetails={tokenDetails} />
      )}
      {marketData && <MarketDetailsList marketDetails={marketDetails} />}
    </View>
  );
};

export default TokenDetails;
