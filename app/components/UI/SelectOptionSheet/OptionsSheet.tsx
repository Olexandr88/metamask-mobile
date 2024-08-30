import BottomSheet, {
  BottomSheetRef,
} from '../../../component-library/components/BottomSheets/BottomSheet';
import SheetHeader from '../../../component-library/components/Sheet/SheetHeader';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import IconCheck from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useRef } from 'react';
import {
  createNavigationDetails,
  useParams,
} from '../../../util/navigation/navUtils';
import { OptionsSheetParams } from './types';
import { useTheme } from '../../../util/theme';
import createStyles from './styles';
import Routes from '../../../constants/navigation/Routes';

export const createOptionsSheetNavDetails = (params: OptionsSheetParams) =>
  createNavigationDetails<OptionsSheetParams>(Routes.OPTIONS_SHEET)({
    ...params,
  });

const OptionsSheet = () => {
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const params = useParams<OptionsSheetParams>();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const options = params.options;

  const onSelectedValueChange = (val?: string) => {
    if (!val) {
      return;
    }
    params.onValueChange(val);
    setTimeout(() => {
      bottomSheetRef.current?.onCloseBottomSheet();
    }, 1000);
  };

  return (
    <BottomSheet ref={bottomSheetRef}>
      <SheetHeader title={params.label} />
      <ScrollView style={styles.list}>
        <View style={styles.listWrapper}>
          {options.map((option) => (
            <TouchableOpacity
              onPress={() =>
                option.value && onSelectedValueChange(option.value)
              }
              style={styles.optionButton}
              key={option.key}
            >
              <Text style={styles.optionLabel} numberOfLines={1}>
                {option.label}
              </Text>
              {params.selectedValue === option.value ? (
                <IconCheck
                  style={styles.icon}
                  name="check"
                  size={24}
                  color={colors.primary.default}
                />
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

export default OptionsSheet;
