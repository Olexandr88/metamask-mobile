import Button, {
  ButtonSize,
  ButtonVariants,
} from '../../../component-library/components/Buttons/Button';
import { zeroAddress } from 'ethereumjs-util';
import React, { useCallback, useEffect } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { strings } from '../../../../locales/i18n';
import {
  TOKEN_ASSET_OVERVIEW,
  TOKEN_OVERVIEW_SEND_BUTTON,
  TOKEN_OVERVIEW_RECEIVE_BUTTON,
} from '../../../../wdio/screen-objects/testIDs/Screens/TokenOverviewScreen.testIds';
import generateTestId from '../../../../wdio/utils/generateTestId';
import { toggleReceiveModal } from '../../../actions/modals';
import { newAssetTransaction } from '../../../actions/transaction';
import AppConstants from '../../../core/AppConstants';
import Engine from '../../../core/Engine';
import {
  selectChainId,
  selectTicker,
} from '../../../selectors/networkController';
import {
  selectConversionRate,
  selectCurrentCurrency,
} from '../../../selectors/currencyRateController';
import { selectContractExchangeRates } from '../../../selectors/tokenRatesController';
import { selectAccountsByChainId } from '../../../selectors/accountTrackerController';
import { selectContractBalances } from '../../../selectors/tokenBalancesController';
import { selectSelectedInternalAccountChecksummedAddress } from '../../../selectors/accountsController';
import Logger from '../../../util/Logger';
import { safeToChecksumAddress } from '../../../util/address';
import {
  balanceToFiat,
  hexToBN,
  renderFromTokenMinimalUnit,
  renderFromWei,
  toHexadecimal,
  weiToFiat,
} from '../../../util/number';
import { getEther } from '../../../util/transactions';
import Text from '../../Base/Text';
import { createWebviewNavDetails } from '../../Views/SimpleWebview';
import useTokenHistoricalPrices, {
  TimePeriod,
} from '../../hooks/useTokenHistoricalPrices';
import Balance from './Balance';
import ChartNavigationButton from './ChartNavigationButton';
import Price from './Price';
import styleSheet from './AssetOverview.styles';
import { useStyles } from '../../../component-library/hooks';
import TokenDetails from './TokenDetails';
import { RootState } from '../../../reducers';
import { TokenI } from '../Tokens/types';

interface AssetOverviewProps {
  navigation: {
    // TODO: Replace "any" with type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate: (route: string, props?: any) => void;
  };
  asset: TokenI;
}

const AssetOverview: React.FC<AssetOverviewProps> = ({
  navigation,
  asset,
}: AssetOverviewProps) => {
  const [timePeriod, setTimePeriod] = React.useState<TimePeriod>('1d');
  const currentCurrency = useSelector(selectCurrentCurrency);
  const conversionRate = useSelector(selectConversionRate);
  const accountsByChainId = useSelector(selectAccountsByChainId);
  const primaryCurrency = useSelector(
    (state: RootState) => state.settings.primaryCurrency,
  );
  const selectedAddress = useSelector(
    selectSelectedInternalAccountChecksummedAddress,
  );
  const tokenExchangeRates = useSelector(selectContractExchangeRates);
  const tokenBalances = useSelector(selectContractBalances);
  const chainId = useSelector((state: RootState) => selectChainId(state));
  const ticker = useSelector((state: RootState) => selectTicker(state));

  const { data: prices = [], isLoading } = useTokenHistoricalPrices({
    address: asset.isETH ? zeroAddress() : asset.address,
    chainId,
    timePeriod,
    vsCurrency: currentCurrency,
  });

  const { styles } = useStyles(styleSheet, {});
  const dispatch = useDispatch();

  useEffect(() => {
    // TODO: Replace "any" with type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { SwapsController } = Engine.context as { SwapsController: any };
    const fetchTokenWithCache = async () => {
      try {
        await SwapsController.fetchTokenWithCache();
        // TODO: Replace "any" with type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        Logger.error(
          error,
          'Swaps: error while fetching tokens with cache in AssetOverview',
        );
      }
    };
    fetchTokenWithCache();
  }, []);

  const onReceive = () => {
    dispatch(toggleReceiveModal(asset));
  };

  const onSend = async () => {
    if (asset.isETH && ticker) {
      dispatch(newAssetTransaction(getEther(ticker)));
    } else {
      dispatch(newAssetTransaction(asset));
    }
    navigation.navigate('SendFlowView');
  };

  const goToBrowserUrl = (url: string) => {
    navigation.navigate(
      ...createWebviewNavDetails({
        url,
      }),
    );
  };

  const renderWarning = () => (
    <View style={styles.warningWrapper}>
      <TouchableOpacity
        onPress={() => goToBrowserUrl(AppConstants.URLS.TOKEN_BALANCE)}
      >
        <Text style={styles.warning}>
          {strings('asset_overview.were_unable')} {(asset as TokenI).symbol}{' '}
          {strings('asset_overview.balance')}{' '}
          <Text style={styles.warningLinks}>
            {strings('asset_overview.troubleshooting_missing')}
          </Text>{' '}
          {strings('asset_overview.for_help')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const handleSelectTimePeriod = useCallback((_timePeriod: TimePeriod) => {
    setTimePeriod(_timePeriod);
  }, []);

  const renderChartNavigationButton = useCallback(
    () =>
      (['1d', '1w', '1m', '3m', '1y', '3y'] as TimePeriod[]).map((label) => (
        <ChartNavigationButton
          key={label}
          label={strings(
            `asset_overview.chart_time_period_navigation.${label}`,
          )}
          onPress={() => handleSelectTimePeriod(label)}
          selected={timePeriod === label}
        />
      )),
    [handleSelectTimePeriod, timePeriod],
  );

  const itemAddress = safeToChecksumAddress(asset.address);
  const exchangeRate = itemAddress
    ? tokenExchangeRates?.[itemAddress]?.price
    : undefined;

  let balance, balanceFiat;
  if (asset.isETH) {
    balance = renderFromWei(
      //@ts-expect-error - This should be fixed at the accountsController selector level, ongoing discussion
      accountsByChainId[toHexadecimal(chainId)][selectedAddress]?.balance,
    );
    balanceFiat = weiToFiat(
      hexToBN(
        //@ts-expect-error - This should be fixed at the accountsController selector level, ongoing discussion
        accountsByChainId[toHexadecimal(chainId)][selectedAddress]?.balance,
      ),
      conversionRate,
      currentCurrency,
    );
  } else {
    balance =
      itemAddress && tokenBalances?.[itemAddress]
        ? renderFromTokenMinimalUnit(tokenBalances[itemAddress], asset.decimals)
        : 0;
    balanceFiat = balanceToFiat(
      balance,
      conversionRate,
      exchangeRate,
      currentCurrency,
    );
  }

  let mainBalance, secondaryBalance;
  if (primaryCurrency === 'ETH') {
    mainBalance = `${balance} ${asset.symbol}`;
    secondaryBalance = balanceFiat;
  } else {
    mainBalance = !balanceFiat ? `${balance} ${asset.symbol}` : balanceFiat;
    secondaryBalance = !balanceFiat
      ? balanceFiat
      : `${balance} ${asset.symbol}`;
  }

  let currentPrice = 0;
  let priceDiff = 0;

  if (asset.isETH) {
    currentPrice = conversionRate || 0;
  } else if (exchangeRate && conversionRate) {
    currentPrice = exchangeRate * conversionRate;
  }

  const comparePrice = prices[0]?.[1] || 0;
  if (currentPrice !== undefined && currentPrice !== null) {
    priceDiff = currentPrice - comparePrice;
  }

  return (
    <View
      style={styles.wrapper}
      {...generateTestId(Platform, TOKEN_ASSET_OVERVIEW)}
    >
      {asset.balanceError ? (
        renderWarning()
      ) : (
        <View>
          <Price
            asset={asset}
            prices={prices}
            priceDiff={priceDiff}
            currentCurrency={currentCurrency}
            currentPrice={currentPrice}
            comparePrice={comparePrice}
            isLoading={isLoading}
            timePeriod={timePeriod}
          />
          <View style={styles.chartNavigationWrapper}>
            {renderChartNavigationButton()}
          </View>
          <View>
            <Balance
              asset={asset}
              mainBalance={mainBalance}
              secondaryBalance={secondaryBalance}
            />
            <View style={styles.balanceButtons}>
              <Button
                style={{ ...styles.footerButton, ...styles.receiveButton }}
                variant={ButtonVariants.Secondary}
                size={ButtonSize.Lg}
                label={strings('asset_overview.receive_button')}
                onPress={onReceive}
                {...generateTestId(Platform, TOKEN_OVERVIEW_RECEIVE_BUTTON)}
              />
              <Button
                style={{ ...styles.footerButton, ...styles.sendButton }}
                variant={ButtonVariants.Secondary}
                size={ButtonSize.Lg}
                label={strings('asset_overview.send_button')}
                onPress={onSend}
                {...generateTestId(Platform, TOKEN_OVERVIEW_SEND_BUTTON)}
              />
            </View>
          </View>
          <View style={styles.tokenDetailsWrapper}>
            <TokenDetails asset={asset} />
          </View>
          {/*  Commented out since we are going to re enable it after curating content */}
          {/* <View style={styles.aboutWrapper}>
            // <AboutAsset asset={asset} chainId={chainId} />
          </View> */}
        </View>
      )}
    </View>
  );
};

export default AssetOverview;
