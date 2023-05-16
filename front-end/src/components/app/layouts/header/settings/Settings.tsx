import React from 'react';
import { FiSettings } from 'react-icons/fi';
import Link from 'next/link';

function Settings(): React.ReactElement {
  return (
    <Link href="/profile">
      <FiSettings size={24} />
    </Link>
  );
}

export default Settings;
