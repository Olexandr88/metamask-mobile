import { TRIGGER_TYPES } from '../../constants';
import { ExtractedNotification, isOfTypeNodeGuard } from '../node-guard';
import { NotificationState } from '../types/NotificationState';
import { getNotificationBadge } from '../../notification.util';
import METAMASK_FOX from '../../../../images/fox.png';

type FeatureAnnouncementNotification =
  ExtractedNotification<TRIGGER_TYPES.FEATURES_ANNOUNCEMENT>;

const isFeatureAnnouncementNotification = isOfTypeNodeGuard([
  TRIGGER_TYPES.FEATURES_ANNOUNCEMENT,
]);

const state: NotificationState<FeatureAnnouncementNotification> = {
  guardFn: isFeatureAnnouncementNotification,
  createMenuItem: (notification) => ({
    title: notification.data.title,

    description: {
      start: notification.data.shortDescription,
    },

    image: {
      url: METAMASK_FOX,
    },

    badgeIcon: getNotificationBadge(notification.type),

    createdAt: notification.createdAt,
  }),
};

export default state;
