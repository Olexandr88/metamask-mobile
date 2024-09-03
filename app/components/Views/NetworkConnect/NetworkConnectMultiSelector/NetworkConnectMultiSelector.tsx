// Third party dependencies.
import React, { useCallback, useState } from 'react';
import { Platform, View } from 'react-native';

// External dependencies.
import { strings } from '../../../../../locales/i18n';
import generateTestId from '../../../../../wdio/utils/generateTestId';
import Button, {
  ButtonSize,
  ButtonVariants,
} from '../../../../component-library/components/Buttons/Button';
import SheetHeader from '../../../../component-library/components/Sheet/SheetHeader';

import { useStyles } from '../../../../component-library/hooks';
import { USER_INTENT } from '../../../../constants/permissions';
import HelpText, {
  HelpTextSeverity,
} from '../../../../component-library/components/Form/HelpText';

// Internal dependencies.
import ConnectNetworkModalSelectorsIDs from '../../../../../e2e/selectors/Modals/ConnectNetworkModal.selectors';
import styleSheet from './NetworkConnectMultiSelector.styles';
import { NetworkConnectMultiSelectorProps } from './NetworkConnectMultiSelector.types';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../../../constants/navigation/Routes';
import Checkbox from '../../../../component-library/components/Checkbox';
import NetworkSelectorList from '../../../UI/NetworkSelectorList/NetworkSelectorList';
import { PopularList } from '../../../../util/networks/customNetworks';
import { Network } from '../../../../components/UI/NetworkSelectorList/NetworkSelectorList.types';

const NetworkConnectMultiSelector = ({
  isLoading,
  onUserAction,
  urlWithProtocol,
  hostname,
  onBack,
}: NetworkConnectMultiSelectorProps) => {
  const { styles } = useStyles(styleSheet, {});
  const { navigate } = useNavigation();
  const [selectedNetworkIds, setSelectedNetworkIds] = useState<string[]>([]);

  const mockNetworks: Network[] = PopularList.map((network) => ({
    id: network.chainId,
    name: network.nickname,
    rpcUrl: network.rpcUrl,
    isSelected: false,
    imageSource: network.rpcPrefs.imageSource,
  }));

  const onSelectNetwork = useCallback(
    (clickedNetworkId) => {
      const selectedAddressIndex = selectedNetworkIds.indexOf(clickedNetworkId);
      // Reconstruct selected network ids.
      const newNetworkList = mockNetworks.reduce((acc, { id }) => {
        if (clickedNetworkId === id) {
          selectedAddressIndex === -1 && acc.push(id);
        } else if (selectedNetworkIds.includes(id)) {
          acc.push(id);
        }
        return acc;
      }, [] as string[]);
      setSelectedNetworkIds(newNetworkList);
    },
    [mockNetworks, selectedNetworkIds],
  );

  const toggleRevokeAllNetworkPermissionsModal = useCallback(() => {
    navigate(Routes.MODAL.ROOT_MODAL_FLOW, {
      screen: Routes.SHEET.REVOKE_ALL_ACCOUNT_PERMISSIONS,
      params: {
        hostInfo: {
          metadata: {
            origin: urlWithProtocol && new URL(urlWithProtocol).hostname,
          },
        },
      },
    });
  }, [navigate, urlWithProtocol]);

  const areAllNetworksSelected = mockNetworks
    .map(({ id }) => id)
    .every((id) => selectedNetworkIds.includes(id));

  const areAnyNetworksSelected = selectedNetworkIds?.length !== 0;
  const areNoNetworksSelected = selectedNetworkIds?.length === 0;

  const renderSelectAllCheckbox = useCallback((): React.JSX.Element | null => {
    const areSomeNetworksSelectedButNotAll =
      areAnyNetworksSelected && !areAllNetworksSelected;

    const selectAll = () => {
      if (isLoading) return;
      const allSelectedNetworkIds = mockNetworks.map(({ id }) => id);
      setSelectedNetworkIds(allSelectedNetworkIds);
    };

    const unselectAll = () => {
      if (isLoading) return;
      setSelectedNetworkIds([]);
    };

    const onPress = () => {
      areAllNetworksSelected ? unselectAll() : selectAll();
    };

    return (
      <View>
        <Checkbox
          style={styles.selectAll}
          label={strings('networks.select_all')}
          isIndeterminate={areSomeNetworksSelectedButNotAll}
          isChecked={areAllNetworksSelected}
          onPress={onPress}
        ></Checkbox>
      </View>
    );
  }, [
    areAllNetworksSelected,
    areAnyNetworksSelected,
    mockNetworks,
    isLoading,
    setSelectedNetworkIds,
    styles.selectAll,
  ]);

  const renderCtaButtons = useCallback(() => {
    const isConnectDisabled = Boolean(!selectedNetworkIds.length) || isLoading;

    return (
      <View style={styles.ctaButtonsContainer}>
        <View style={styles.connectOrUpdateButtonContainer}>
          {areAnyNetworksSelected && (
            <Button
              variant={ButtonVariants.Primary}
              label={strings('networks.update')}
              onPress={() => onUserAction(USER_INTENT.Confirm)}
              size={ButtonSize.Lg}
              style={{
                ...styles.button,
                ...(isConnectDisabled && styles.disabled),
              }}
              disabled={isConnectDisabled}
              {...generateTestId(
                Platform,
                ConnectNetworkModalSelectorsIDs.SELECT_MULTI_BUTTON,
              )}
            />
          )}
        </View>
        {areNoNetworksSelected && (
          <View style={styles.disconnectAllContainer}>
            <View style={styles.helpTextContainer}>
              <HelpText severity={HelpTextSeverity.Error}>
                {strings('common.disconnect_you_from', {
                  dappUrl: hostname,
                })}
              </HelpText>
            </View>
            <View style={styles.disconnectAllButtonContainer}>
              <Button
                variant={ButtonVariants.Primary}
                label={strings('common.disconnect')}
                onPress={toggleRevokeAllNetworkPermissionsModal}
                isDanger
                size={ButtonSize.Lg}
                style={{
                  ...styles.button,
                }}
              />
            </View>
          </View>
        )}
      </View>
    );
  }, [
    areAnyNetworksSelected,
    isLoading,
    onUserAction,
    selectedNetworkIds,
    styles,
    areNoNetworksSelected,
    hostname,
    toggleRevokeAllNetworkPermissionsModal,
  ]);

  const renderNetworkConnectMultiSelector = useCallback(
    () => (
      <View style={styles.container}>
        <SheetHeader
          title={strings('networks.edit_networks_title')}
          onBack={onBack}
        />
        <View style={styles.body}>{renderSelectAllCheckbox()}</View>
        <NetworkSelectorList
          networks={mockNetworks}
          selectedNetworkIds={selectedNetworkIds}
          onSelectNetwork={onSelectNetwork}
        ></NetworkSelectorList>
        <View style={styles.body}>{renderCtaButtons()}</View>
      </View>
    ),
    [
      mockNetworks,
      onSelectNetwork,
      renderCtaButtons,
      selectedNetworkIds,
      styles.body,
      styles.container,
      onBack,
      renderSelectAllCheckbox,
    ],
  );
  return renderNetworkConnectMultiSelector();
};

export default NetworkConnectMultiSelector;
