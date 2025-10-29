import { useDispatch } from 'react-redux';
import { setCurrentChannel } from '../store/channelsSlice';
import { useAddChannelMutation, useRenameChannelMutation, useRemoveChannelMutation } from '../api/chatApi';
import { hasProfanity } from '../utils/profanityFilter';

export const useChannelHandlers = () => {
  const dispatch = useDispatch();

  const [addChannel, { isLoading: isAddingChannel }] = useAddChannelMutation();
  const [renameChannel, { isLoading: isRenamingChannel }] = useRenameChannelMutation();
  const [removeChannel, { isLoading: isRemovingChannel }] = useRemoveChannelMutation();

  const handleAddChannel = async (channelName) => {
    const trimmed = channelName?.trim();

    if (!trimmed || trimmed.length < 3 || trimmed.length > 20) {
      return { success: false, error: 'invalid' };
    }

    if (hasProfanity(trimmed)) {
      return { success: false, error: 'profanity' };
    }

    try {
      const result = await addChannel({ name: trimmed, removable: true }).unwrap();
      dispatch(setCurrentChannel(result.id));
      return { success: true, channelId: result.id };
    } catch (error) {
      return { success: false, error: error.status === 409 ? 'exists' : 'network' };
    }
  };

  const handleRemoveChannel = async (channelId) => {
    try {
      await removeChannel(channelId).unwrap();
      return { success: true };
    } catch {
      return { success: false, error: 'network' };
    }
  };

  const handleRenameChannel = async (channelId, newName) => {
    const trimmed = newName?.trim();

    if (!trimmed || trimmed.length < 3 || trimmed.length > 20) {
      return { success: false, error: 'invalid' };
    }

    if (hasProfanity(trimmed)) {
      return { success: false, error: 'profanity' };
    }

    try {
      await renameChannel({ id: channelId, name: trimmed }).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.status === 409 ? 'exists' : 'network' };
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
