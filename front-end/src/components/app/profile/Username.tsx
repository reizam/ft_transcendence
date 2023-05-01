import { BACKEND_URL } from '@/constants/env';
import { getCookie } from 'cookies-next';
import { useState } from 'react';
import BasicInput from '../inputs/BasicInput';

interface UsernameProps {
  canEdit: boolean;
  value: string;
}

function Username({ canEdit, value }: UsernameProps) {
  const [username, setUsername] = useState(value);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(`${BACKEND_URL}/profile`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${getCookie('jwt')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ changeUsername: true, username }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      // setUsername to value if username already used
      .catch((err) => console.error(err));
  };

  return (
    <div className="relative mb-3" data-te-input-wrapper-init>
      {canEdit ? (
        <form onSubmit={handleSubmit}>
          <BasicInput
            className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-100 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
        </form>
      ) : (
        <h1>{value}</h1>
      )}
    </div>
  );
}

export default Username;
