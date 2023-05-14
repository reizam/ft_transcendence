import React from 'react';
import titleStyles from './title.module.css';

interface TitleProps {
  title: string;
}

function Title({ title }: TitleProps): React.ReactElement {
  return <h1 className={titleStyles.h1__title}>{title}</h1>;
}

export default Title;
