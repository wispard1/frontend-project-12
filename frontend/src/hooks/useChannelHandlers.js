// src/hooks/useChannelHandlers.js
import { useDispatch } from 'react-redux';
import { setCurrentChannel } from '../store/channelsSlice';
import { useAddChannelMutation, useRenameChannelMutation, useRemoveChannelMutation } from '../api/chatApi';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { hasProfanity } from '../utils/profanityFilter';

export const useChannelHandlers = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [addChannel, { isLoading: isAddingChannel }] = useAddChannelMutation();
  const [renameChannel, { isLoading: isRenamingChannel }] = useRenameChannelMutation();
  const [removeChannel, { isLoading: isRemovingChannel }] = useRemoveChannelMutation();

  const handleAddChannel = async (channelName) => {
    const trimmed = channelName?.trim();

    if (!trimmed || trimmed.length < 3 || trimmed.length > 20) {
      toast.error(t('chatPage.notifications.channelNameInvalid'));
      return;
    }

    if (hasProfanity(trimmed)) {
      toast.error(t('chatPage.notifications.channelNameContainsProfanity'));
      return;
    }

    try {
      const result = await addChannel({ name: trimmed, removable: true }).unwrap();
      toast.success(t('chatPage.notifications.channelAdded'));
      dispatch(setCurrentChannel(result.id));
    } catch (error) {
      if (error.status === 409) {
        toast.error(t('chatPage.notifications.channelExists'));
      } else {
        toast.error(t('chatPage.notifications.channelAddError'));
      }
    }
  };

  const handleRemoveChannel = async (channelId) => {
    try {
      await removeChannel(channelId).unwrap();
      toast.success(t('chatPage.notifications.channelRemoved'));
    } catch {
      toast.error(t('chatPage.notifications.channelRemoveError'));
    }
  };

  const handleRenameChannel = async (channelId, newName) => {
    const trimmed = newName?.trim();

    if (!trimmed || trimmed.length < 3 || trimmed.length > 20) {
      toast.error(t('chatPage.notifications.channelNameInvalid'));
      return;
    }

    if (hasProfanity(trimmed)) {
      toast.error(t('chatPage.notifications.channelNameContainsProfanity'));
      return;
    }

    try {
      await renameChannel({ id: channelId, name: trimmed }).unwrap();
      toast.success(t('chatPage.notifications.channelRenamed', { name: trimmed }));
    } catch (error) {
      if (error.status === 409) {
        toast.error(t('chatPage.notifications.channelExists'));
      } else {
        toast.error(t('chatPage.notifications.channelRenameError'));
      }
    }
  };

  return {
    handleAddChannel,
    handleRemoveChannel,
    handleRenameChannel,
    isAddingChannel,
    isRemovingChannel,
    isRenamingChannel,
  };
};
