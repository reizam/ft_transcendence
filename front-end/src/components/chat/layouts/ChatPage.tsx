import React from 'react';

interface ChatPageProps {
  title?: string;
  children: React.ReactNode;
}

function ChatPage({ title, children }: ChatPageProps): React.ReactElement {
  return (
    <div className="h-full w-full bg-dark-purple rounded-xl p-6">
      {title && (
        <div className="border-b-2 w-full pb-3">
          <p className="font-semibold antialiased">{title}</p>
        </div>
      )}
      {children}
    </div>
  );
}

export default ChatPage;
