import { ListGroup, Button, Dropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export const ChannelsList = ({
  channels,
  onChannelClick,
  onAddChannelClick,
  onRenameChannelClick,
  onRemoveChannelClick,
}) => {
  const { currentChannelId } = useSelector((state) => state.channels);
  const { t } = useTranslation();

  const displayChannels = channels?.length > 0 ? channels : [{ id: '1', name: 'general', removable: false }];

  console.log('ChannelsList: displayChannels=', displayChannels);
  return (
    <div className='border-end bg-light d-flex flex-column h-100'>
      <div className='d-flex justify-content-between align-items-center px-3 py-2 border-bottom'>
        <b>{t('chatPage.channelsHeader')}</b>
        <Button
          variant='outline-primary'
          className='p-0 d-flex align-items-center justify-content-center'
          onClick={onAddChannelClick}
          title={t('chatPage.addChannel')}
          data-testid='add-channel-button'
          style={{
            width: '24px',
            height: '24px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            border: '1px solid #0d6efd',
            lineHeight: 1,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          +
        </Button>
      </div>
      <div className='overflow-auto px-2 py-2 flex-grow-1'>
        {displayChannels.map((channel) => (
          <Button
            key={channel.id}
            variant={channel.id === currentChannelId ? 'primary' : 'light'}
            className={`w-100 text-start d-flex justify-content-between align-items-center mb-1 ${
              channel.id === currentChannelId ? 'text-white' : ''
            }`}
            style={{
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.5rem 0.75rem',
            }}
            onClick={() => onChannelClick(channel.id)}
            aria-label={channel.name}
            data-testid={`channel-${channel.name}`}
          >
            <span className='text-truncate'>
              <span className='me-1'>#</span>
              {channel.name}
            </span>
            {channel.removable && (
              <Dropdown onClick={(e) => e.stopPropagation()}>
                <Dropdown.Toggle
                  as='span'
                  variant='link'
                  className={`p-0 border-0 ${channel.id === currentChannelId ? 'text-white' : 'text-muted'}`}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  id={`dropdown-${channel.id}`}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    fill='currentColor'
                    className='bi bi-chevron-down'
                    viewBox='0 0 16 16'
                  >
                    <path
                      fillRule='evenodd'
                      d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'
                    />
                  </svg>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => onRenameChannelClick(channel.id, channel.name)}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      fill='currentColor'
                      className='bi bi-pencil me-2'
                      viewBox='0 0 16 16'
                    >
                      <path d='M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z' />
                    </svg>
                    {t('chatPage.renameChannel')}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => onRemoveChannelClick(channel.id, channel.name)} className='text-danger'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      fill='currentColor'
                      className='bi bi-trash me-2'
                      viewBox='0 0 16 16'
                    >
                      <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z' />
                      <path
                        fillRule='evenodd'
                        d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'
                      />
                    </svg>
                    {t('chatPage.removeChannel')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};
