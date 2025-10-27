import { useDispatch } from 'react-redux';
import { setCurrentChannel } from '../store/channelsSlice';
import { useAddChannelMutation, useRenameChannelMutation, useRemoveChannelMutation, chatApi } from '../api/chatApi';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { hasProfanity } from '../utils/profanityFilter';

export const useChannelHandlers = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [addChannel, { isLoading: isAddingChannel }] = useAddChannelMutation();
  const [renameChannel, { isLoading: isRenamingChannel }] = useRenameChannelMutation();
  const [removeChannel, { isLoading: isRemovingChannel }] = useRemoveChannelMutation();

  const handleSetCurrentChannel = (channelId) => {
    dispatch(setCurrentChannel(channelId));
  };

  const handleAddChannel = async (channelName) => {
    if (!channelName || channelName.trim().length < 3 || channelName.trim().length > 20) {
      toast.error(t('chatPage.notifications.channelNameInvalid'));
      return;
    }

    if (hasProfanity(channelName.trim())) {
      toast.error(t('chatPage.notifications.channelNameContainsProfanity'));
      return;
    }

    try {
      const result = await addChannel({ name: channelName.trim() }).unwrap();
      console.log('Channel added successfully:', result);
      // toast.success(t('chatPage.notifications.channelAdded'));
      dispatch(chatApi.util.invalidateTags([{ type: 'Channel', id: 'LIST' }]));
      dispatch(setCurrentChannel(result.id));
    } catch (error) {
      console.error('Error adding channel:', error);
      if (error.status === 409) {
        toast.error(t('chatPage.notifications.channelExists'));
      } else {
        toast.error(t('chatPage.notifications.channelAddError'));
      }
    }
  };

  const handleRemoveChannel = async (channelId) => {
    if (!channelId) return;

    try {
      await removeChannel(channelId).unwrap();
      console.log('Channel removed successfully:', channelId);
      toast.success(t('chatPage.notifications.channelRemoved'));
      dispatch(
        chatApi.util.invalidateTags([
          { type: 'Channel', id: 'LIST' },
          { type: 'Message', id: 'LIST' },
        ])
      );
    } catch (error) {
      console.error('Error removing channel:', error);
      toast.error(t('chatPage.notifications.channelRemoveError'));
    }
  };

  const handleRenameChannel = async (channelId, newChannelName) => {
    if (!channelId || !newChannelName || newChannelName.trim().length < 3 || newChannelName.trim().length > 20) {
      toast.error(t('chatPage.notifications.channelNameInvalid'));
      return;
    }

    if (hasProfanity(newChannelName.trim())) {
      toast.error(t('chatPage.notifications.channelNameContainsProfanity'));
      return;
    }

    const trimmedName = newChannelName.trim();

    try {
      const result = await renameChannel({ id: channelId, name: trimmedName }).unwrap();
      console.log('Channel renamed successfully:', result);
      toast.success(t('chatPage.notifications.channelRenamed', { name: trimmedName }));
      dispatch(chatApi.util.invalidateTags([{ type: 'Channel', id: 'LIST' }]));
    } catch (error) {
      console.error('Error renaming channel:', error);
      if (error.status === 409) {
        toast.error(t('chatPage.notifications.channelExists'));
      } else {
        toast.error(t('chatPage.notifications.channelRenameError'));
      }
    }
  };

  return {
    handleSetCurrentChannel,
    handleAddChannel,
    handleRemoveChannel,
    handleRenameChannel,
    isAddingChannel,
    isRemovingChannel,
    isRenamingChannel,
  };
};
