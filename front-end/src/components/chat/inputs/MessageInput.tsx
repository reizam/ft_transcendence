import BasicInput from '@/components/app/inputs/BasicInput';
import Spinner from '@/components/utils/Spinner';
import React from 'react';
import { FiSend } from 'react-icons/fi';

interface MessageInputProps {
  loading?: boolean;
  onSend: (
    message: string,
    setMessage: React.Dispatch<React.SetStateAction<string>>
  ) => void;
}

function MessageInput({
  loading = false,
  onSend,
}: MessageInputProps): React.ReactElement {
  const [message, setMessage] = React.useState<string>('');
  const canSend = message.length > 0;

  const onSubmit = (): void => {
    onSend(message, setMessage);
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' && canSend) {
      onSubmit();
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (!loading) {
      setMessage(event.target.value);
    }
  };

  return (
    <div className="flex flex-row items-center space-x-4">
      <BasicInput
        onKeyPress={onKeyPress}
        value={message}
        onChange={onChange}
        className="bg-purple/50 text-white outline-0 placeholder:text-light-white/50 text-sm w-full rounded-full p-3"
        placeholder="Veuillez saisir votre message"
      />
      <button
        className="flex items-center justify-center ease-in-out transition-opacity duration-200 hover:opacity-50 active:opacity-100 w-10 h-10"
        style={{
          cursor: canSend ? 'pointer' : 'not-allowed',
          opacity: canSend ? undefined : 0.5,
        }}
        onClick={onSubmit}
      >
        {loading ? <Spinner size={12} /> : <FiSend size={18} />}
      </button>
    </div>
  );
}

export default MessageInput;
