import React, { useCallback, useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Text, {
  TextVariant,
} from '../../../../component-library/components/Texts/Text';
import Icon, {
  IconSize,
  IconName,
} from '../../../../component-library/components/Icons/Icon';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../../../../app/constants/navigation/Routes';
import { strings } from '../../../../../locales/i18n';
import BasicFunctionalityComponent from '../../../../components/UI/BasicFunctionality/BasicFunctionality';
import ManageNetworksComponent from '../../../../components/UI/ManageNetworks/ManageNetworks';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  description: {
    fontSize: 14,
    textAlign: 'left',
    marginTop: 10,
    lineHeight: 22,
    fontWeight: '400',
  },
  setting: {
    marginTop: 32,
  },
  toggle: {
    flexDirection: 'row',
    marginLeft: 16,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  networkPicker: {
    marginVertical: 16,
    alignSelf: 'flex-start',
  },
  backButton: {
    padding: 10,
  },
});

const DefaultSettings = () => {
  const navigation = useNavigation();

  const renderBackButton = useCallback(
    () => (
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Icon name={IconName.ArrowLeft} size={IconSize.Lg} color={'black'} />
      </TouchableOpacity>
    ),
    [navigation],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: renderBackButton,
      headerTitle: strings('onboarding_success.default_settings'),
    });
  }, [navigation, renderBackButton]);
  const handleSwitchToggle = () => {
    navigation.navigate(Routes.MODAL.ROOT_MODAL_FLOW, {
      screen: Routes.SHEET.BASIC_FUNCTIONALITY,
    });
  };

  return (
    <ScrollView style={styles.root}>
      <Text variant={TextVariant.BodyMD}>
        {strings('default_settings.description')}
      </Text>
      <BasicFunctionalityComponent handleSwitchToggle={handleSwitchToggle} />
      <ManageNetworksComponent />
    </ScrollView>
  );
};

export default DefaultSettings;
