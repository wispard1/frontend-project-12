// src/components/toasts/ModalToasts.jsx
import { toast } from 'react-toastify';
import { AddChannelToastContent } from './AddChannelToastContent';
import { RenameChannelToastContent } from './RenameChannelToastContent';
import { RemoveChannelToastContent } from './RemoveChannelToastContent';

export const showAddChannelToast = ({ onAdd, isAdding, t }) => {
  toast(({ closeToast }) => <AddChannelToastContent onAdd={onAdd} isAdding={isAdding} t={t} closeToast={closeToast} />);
};

export const showRenameChannelToast = ({ channel, onRename, isRenaming, t }) => {
  toast(({ closeToast }) => (
    <RenameChannelToastContent
      channel={channel}
      onRename={onRename}
      isRenaming={isRenaming}
      t={t}
      closeToast={closeToast}
    />
  ));
};

export const showRemoveChannelToast = ({ channel, onRemove, isRemoving, t }) => {
  toast(({ closeToast }) => (
    <RemoveChannelToastContent
      channel={channel}
      onRemove={onRemove}
      isRemoving={isRemoving}
      t={t}
      closeToast={closeToast}
    />
  ));
};
