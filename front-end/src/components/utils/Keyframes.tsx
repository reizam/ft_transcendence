import { CSSProperties, ReactElement } from 'react';

interface IProps {
  name: string;
  [key: string]: CSSProperties | string;
}

export const Keyframes = (props: IProps): ReactElement => {
  const toCss = (cssObject: CSSProperties | string): string =>
    typeof cssObject === 'string'
      ? cssObject
      : Object.entries(cssObject).reduce((accumulator, [key, value]) => {
          if (typeof value === 'string') {
            value = value.replace("'", '');
          }
          const cssKey = key.replace(/[A-Z]/g, (v) => `-${v.toLowerCase()}`);
          return `${accumulator}${cssKey}:${value};`;
        }, '');

  return (
    <style>
      {`@keyframes ${props.name} {
        ${Object.keys(props)
          .map((key) => {
            return ['from', 'to'].includes(key)
              ? `${key} { ${toCss(props[key])} }`
              : /^_[0-9]+$/.test(key)
              ? `${key.replace('_', '')}% { ${toCss(props[key])} }`
              : '';
          })
          .join(' ')}
      }`}
    </style>
  );
};
