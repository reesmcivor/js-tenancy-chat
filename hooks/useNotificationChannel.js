import { useEffect } from 'react';
import { usePrivateChannels } from 'js-tenancy-core/store/channels';

export default function useNotificationChannel(notificationEvent, authUserId, onChange) {
    const channels = usePrivateChannels(authUserId);
    useEffect(() => {
      if (channels) {
        channels.listen(notificationEvent, onChange);
        return () => {
          channels.stopListening(notificationEvent);
        };
      }
    }, [channels, onChange]);
  }