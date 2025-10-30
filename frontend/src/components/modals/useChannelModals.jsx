import { useState } from 'react'
import { AddChannelModal } from './AddChannelModal'
import { RenameChannelModal } from './RenameChannelModal'
import { RemoveChannelModal } from './RemoveChannelModal'

export const useChannelModals = ({
  onAdd,
  onRename,
  onRemove,
  isAdding,
  isRenaming,
  isRemoving,
}) => {
  const [modalType, setModalType] = useState(null)
  const [selectedChannel, setSelectedChannel] = useState(null)

  const showAddModal = () => {
    setModalType('add')
    setSelectedChannel(null)
  }

  const showRenameModal = channel => {
    setModalType('rename')
    setSelectedChannel(channel)
  }

  const showRemoveModal = channel => {
    setModalType('remove')
    setSelectedChannel(channel)
  }

  const hideModal = () => {
    setModalType(null)
    setSelectedChannel(null)
  }

  const Modals = () => (
    <>
      <AddChannelModal
        show={modalType === 'add'}
        onHide={hideModal}
        onAdd={onAdd}
        isAdding={isAdding}
      />
      <RenameChannelModal
        show={modalType === 'rename'}
        onHide={hideModal}
        onRename={onRename}
        isRenaming={isRenaming}
        channel={selectedChannel}
      />
      <RemoveChannelModal
        show={modalType === 'remove'}
        onHide={hideModal}
        onRemove={onRemove}
        isRemoving={isRemoving}
        channel={selectedChannel}
      />
    </>
  )

  return {
    showAddModal,
    showRenameModal,
    showRemoveModal,
    hideModal,
    Modals,
  }
}
