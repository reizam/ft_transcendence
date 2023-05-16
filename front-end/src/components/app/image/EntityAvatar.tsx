/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface EntityAvatarProps {
  image?: string;
  size?: number;
  className?: string;
  acronym?: string;
}

function EntityAvatar({
  image,
  size = 16,
  className,
  acronym,
}: EntityAvatarProps): React.ReactElement {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      className="rounded-full bg-purple/25"
    >
      {image ? (
        <img
          src={image}
          alt="avatar"
          className={`w-full h-full rounded-full ${className}`}
        />
      ) : (
        <div className="flex justify-center items-center w-full h-full rounded-full text-purple">
          {acronym}
        </div>
      )}
    </div>
  );
}

export default EntityAvatar;
