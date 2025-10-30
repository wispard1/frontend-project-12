import { Button, Nav, Dropdown } from 'react-bootstrap';
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

  const displayChannels =
    channels?.length > 0 ? channels : [{ id: '1', name: 'general', removable: false }];

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
          }}
        >
          {t('chatPage.addChannelButton')}
        </Button>
      </div>

      <Nav variant='pills' className='flex-column px-2 py-2 flex-grow-1 overflow-auto'>
        {displayChannels.map((channel) => (
          <Nav.Item key={channel.id} className='w-100 mb-1'>
            {channel.removable ? (
              <div className='d-flex align-items-center position-relative'>
                <Button
                  variant={channel.id === currentChannelId ? 'primary' : 'light'}
                  className={`w-100 text-start text-truncate ${channel.id === currentChannelId ? 'text-white' : ''}`}
                  style={{
                    border: 'none',
                    borderRadius: '0.375rem',
                    padding: '0.5rem 0.75rem',
                  }}
                  onClick={() => onChannelClick(channel.id)}
                  aria-label={channel.name}
                  data-testid={`channel-${channel.name}`}
                >
                  <span className='me-1'>{t('chatPage.channelPrefix')}</span>
                  {channel.name}
                </Button>
                <Dropdown className='position-absolute' style={{ right: '10px' }}>
                  <Dropdown.Toggle
                    variant='link'
                    data-testid={`channel-${channel.name}-menu`}
                    className={`p-0 border-0 ${channel.id === currentChannelId ? 'text-white' : 'text-muted'}`}
                    style={{
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                    }}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      fill='currentColor'
                      viewBox='0 0 16 16'
                    >
                      <path d='M1 3l7 7 7-7' />
                    </svg>
                    <span className='visually-hidden'>{t('chatPage.channelManagement')}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => onRenameChannelClick(channel.id, channel.name)}>
                      {t('chatPage.renameChannel')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => onRemoveChannelClick(channel.id, channel.name)}
                      className='text-danger'
                    >
                      {t('chatPage.removeChannel')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            ) : (
              <Button
                variant={channel.id === currentChannelId ? 'primary' : 'light'}
                className={`w-100 text-start text-truncate ${channel.id === currentChannelId ? 'text-white' : ''}`}
                style={{
                  border: 'none',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 0.75rem',
                }}
                onClick={() => onChannelClick(channel.id)}
                aria-label={channel.name}
                data-testid={`channel-${channel.name}`}
              >
                <span className='me-1'>{t('chatPage.channelPrefix')}</span>
                {channel.name}
              </Button>
            )}
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};
