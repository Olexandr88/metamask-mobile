import React from 'react';
import PermissionsSummary from './';
import { backgroundState } from '../../../util/test/initial-root-state';
import renderWithProvider from '../../../util/test/renderWithProvider';
import { MOCK_ACCOUNTS_CONTROLLER_STATE } from '../../../util/test/accountsControllerTestUtils';

const mockInitialState = {
  wizard: {
    step: 1,
  },
  engine: {
    backgroundState: {
      ...backgroundState,
      AccountsController: MOCK_ACCOUNTS_CONTROLLER_STATE,
    },
  },
};
describe('PermissionsSummary', () => {
  it('should render correctly', () => {
    const { toJSON } = renderWithProvider(
      <PermissionsSummary
        customNetworkInformation={{ chainName: '' }}
        currentPageInformation={{ currentEnsName: '', icon: '', url: '' }}
      />,
      { state: mockInitialState },
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
