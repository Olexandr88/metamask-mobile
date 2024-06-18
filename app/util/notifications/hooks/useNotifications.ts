import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Logger from '../../../util/Logger';
import type {
  Notification,
  MarkAsReadNotificationsParam,
} from '../../../util/notifications/types/notification';
import Creators from '../../../store/ducks/notifications';
import {
  ListNotificationsReturn,
  CreateNotificationsReturn,
  EnableNotificationsReturn,
  DisableNotificationsReturn,
  MarkNotificationAsReadReturn,
} from './types';

/**
 * Custom hook to fetch and update the list of notifications.
 * Manages loading and error states internally.
 *
 * @returns An object containing the `listNotifications` function, loading state, and error state.
 */
export function useListNotifications(): ListNotificationsReturn {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [notificationsData, setNotificationsData] = useState<
    Notification[] | undefined
  >(undefined);

  const listNotifications = useCallback(async (): Promise<
    Notification[] | undefined
  > => {
    setLoading(true);
    setError(null);

    try {
      const data = await dispatch(
        Creators.fetchAndUpdateMetamaskNotificationsRequest(),
      );
      setNotificationsData(data as unknown as Notification[]);
      return data as unknown as Notification[];
    } catch (e: any) {
      Logger.error(e);
      setError(e instanceof Error ? e.message : 'An unexpected error occurred');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return {
    listNotifications,
    notificationsData,
    isLoading: loading,
    error,
  };
}
/**
 * Custom hook to enable notifications by creating on-chain triggers.
 * It manages loading and error states internally.
 *
 * @returns An object containing the `enableNotifications` function, loading state, and error state.
 */
export function useCreateNotifications(): CreateNotificationsReturn {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(Creators.createOnChainTriggersByAccountRequest());
      dispatch(Creators.setMetamaskNotificationsFeatureSeenRequest());
    } catch (e: any) {
      setError(e instanceof Error ? e.message : 'An unexpected error occurred');
      Logger.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return {
    createNotifications,
    loading,
    error,
  };
}
/**
 * Custom hook to enable MetaMask notifications.
 * This hook encapsulates the logic for enabling notifications, handling loading and error states.
 * It uses Redux to dispatch actions related to notifications.
 *
 * @returns An object containing:
 * - `enableNotifications`: A function that triggers the enabling of notifications.
 * - `loading`: A boolean indicating if the enabling process is ongoing.
 * - `error`: A string or null value representing any error that occurred during the process.
 */
export function useEnableNotifications(): EnableNotificationsReturn {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const enableNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(Creators.enablePushNotificationsRequest());
      dispatch(Creators.setMetamaskNotificationsFeatureSeenRequest());
    } catch (e: any) {
      setError(e instanceof Error ? e.message : 'An unexpected error occurred');
      Logger.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return {
    enableNotifications,
    loading,
    error,
  };
}
/**
 * Custom hook to disable notifications by deleting on-chain triggers associated with accounts.
 * It also disables snap and feature announcements. Manages loading and error states internally.
 *
 * @returns An object containing the `disableNotifications` function, loading state, and error state.
 */
export function useDisableNotifications(): DisableNotificationsReturn {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const disableNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(Creators.disablePushNotificationsRequest());
    } catch (e: any) {
      setError(e instanceof Error ? e.message : 'An unexpected error occurred');
      Logger.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return {
    disableNotifications,
    loading,
    error,
  };
}
/**
 * Custom hook to mark specific notifications as read.
 * It accepts a parameter of notifications to be marked as read and manages loading and error states internally.
 *
 * @param notifications - The notifications to mark as read.
 * @returns An object containing the `markNotificationAsRead` function, loading state, and error state.
 */
export function useMarkNotificationAsRead(): MarkNotificationAsReadReturn {
  const dispatch = useDispatch();

  const markNotificationAsRead = useCallback(
    async (notifications: MarkAsReadNotificationsParam) => {
      try {
        dispatch(
          Creators.markMetamaskNotificationsAsReadRequest(notifications),
        );
      } catch (e: any) {
        Logger.error(e);
        throw e;
      }
    },
    [dispatch],
  );

  return {
    markNotificationAsRead,
  };
}
