import { useSendMessagePost } from '@/api/channel/channel.api';
import BasicInput from '@/components/app/inputs/BasicInput';
import Spinner from '@/components/utils/Spinner';
import React from 'react';
import { FiSend } from 'react-icons/fi';

interface MessageInputProps {
  channelId: number;
}

function MessageInput({ channelId }: MessageInputProps): React.ReactElement {
  const [message, setMessage] = React.useState<string>('');
  const canSend = message.length > 0;

  const { mutate, isLoading } = useSendMessagePost(channelId);

  const onSubmit = (): void => {
    mutate(
      { channelId, message },
      {
        onSuccess: () => setMessage(''),
      }
    );
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' && canSend) {
      onSubmit();
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (!isLoading) {
      setMessage(event.target.value);
    }
  };

  return (
    <div className="flex flex-row items-center space-x-4">
      <BasicInput
        type="input"
        name="write message"
        onKeyPress={onKeyPress}
        value={message}
        onChange={onChange}
        className="bg-purple/50 text-white outline-0 placeholder:text-light-white/50 text-sm w-full rounded-full p-3"
        placeholder="Enter your message"
      />
      <button
        className="flex items-center justify-center ease-in-out transition-opacity duration-200 hover:opacity-50 active:opacity-100 w-10 h-10"
        style={{
          cursor: canSend ? 'pointer' : 'not-allowed',
          opacity: canSend ? undefined : 0.5,
        }}
        onClick={onSubmit}
      >
        {isLoading ? <Spinner size={12} /> : <FiSend size={18} />}
      </button>
    </div>
  );
}

export default MessageInput;
