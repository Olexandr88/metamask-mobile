import React from 'react';
import renderWithProvider from '../../../util/test/renderWithProvider';
import SelectOptionSheet from './';
import { iSelectOption } from './types';
import { useNavigation } from '@react-navigation/native';
import { fireEvent } from '@testing-library/react-native';
import { SELECT_DROP_DOWN } from './constants';

jest.mock('../../../core/Engine', () => ({
  context: {
    colors: {},
  },
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

describe('SelectOptionSheet', () => {
  it('renders correctly', () => {
    const options: iSelectOption[] = [
      { key: 'key 1', value: 'val 1', label: 'option 1' },
      { key: 'key 2', value: 'val 2', label: 'option 2' },
    ];

    const mockOnValueChange = jest.fn();

    const { toJSON } = renderWithProvider(
      <SelectOptionSheet
        options={options}
        selectedValue={'val 2'}
        label={'Choose an option'}
        defaultValue={options[0].value}
        onValueChange={mockOnValueChange}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('shows the correct selected value', () => {
    const options: iSelectOption[] = [
      { key: 'key 1', value: 'val 1', label: 'option 1' },
      { key: 'key 2', value: 'val 2', label: 'option 2' },
    ];

    const mockOnValueChange = jest.fn();

    const { getByText } = renderWithProvider(
      <SelectOptionSheet
        options={options}
        selectedValue={'val 2'}
        label={'Choose an option'}
        defaultValue={options[0].value}
        onValueChange={mockOnValueChange}
      />,
    );

    expect(getByText('option 2')).toBeTruthy();
  });

  it('shows default value when selectedValue is not provided', () => {
    const options: iSelectOption[] = [
      { key: 'key 1', value: 'val 1', label: 'option 1' },
      { key: 'key 2', value: 'val 2', label: 'option 2' },
    ];

    const mockOnValueChange = jest.fn();

    const { getByText } = renderWithProvider(
      <SelectOptionSheet
        options={options}
        label={'Choose an option'}
        defaultValue={'default value'}
        onValueChange={mockOnValueChange}
      />,
    );

    expect(getByText('default value')).toBeTruthy();
  });

  it('shows empty string when selectedValue is not provided and defaultValue is not provided', () => {
    const options: iSelectOption[] = [
      { key: 'key 1', value: 'val 1', label: 'option 1' },
      { key: 'key 2', value: 'val 2', label: 'option 2' },
    ];

    const mockOnValueChange = jest.fn();

    const { getByText } = renderWithProvider(
      <SelectOptionSheet
        options={options}
        label={'Choose an option'}
        onValueChange={mockOnValueChange}
      />,
    );

    expect(getByText('')).toBeTruthy();
  });

  it('calls navigation.navigate with correct params', () => {
    const options: iSelectOption[] = [
      { key: 'key 1', value: 'val 1', label: 'option 1' },
      { key: 'key 2', value: 'val 2', label: 'option 2' },
    ];

    const navigateMock = {
      navigate: jest.fn(),
    };
    useNavigation.mockReturnValue(navigateMock);

    const mockOnValueChange = jest.fn();

    const { getByTestId } = renderWithProvider(
      <SelectOptionSheet
        options={options}
        label={'Choose an option'}
        onValueChange={mockOnValueChange}
      />,
    );

    fireEvent(getByTestId(SELECT_DROP_DOWN), 'press');
    expect(navigateMock.navigate).toHaveBeenCalled();
  });
});
