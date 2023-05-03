import React from 'react';
import titleStyles from './title.module.css';

interface titleProps {
  title?: string;
}

function Title({ title }: titleProps): React.ReactElement {
  return (
    <div className={titleStyles.title}>
      <h1 className={titleStyles.h1__title}>{title}</h1>
    </div>
  );
}

export default Title;
