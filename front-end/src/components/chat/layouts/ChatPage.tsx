import { preventDefault } from '@/utils/react.util';
import Link from 'next/link';
import React from 'react';
import { FiSettings } from 'react-icons/fi';

interface ChatPageProps {
  title?: string;
  children: React.ReactNode;
  topRight?: {
    icon?: React.ReactNode;
    href: string;
  };
}

function ChatPage({
  title,
  children,
  topRight,
}: ChatPageProps): React.ReactElement {
  return (
    <div className="h-full w-full bg-dark-purple rounded-xl p-6">
      {title && (
        <div className="flex flex-row items-center justify-between border-b-2 w-full pb-3">
          <p className="font-semibold antialiased">{title}</p>
          {topRight && (
            <Link href={topRight.href} onMouseDown={preventDefault}>
              {topRight.icon || <FiSettings size={16} />}
            </Link>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export default ChatPage;
