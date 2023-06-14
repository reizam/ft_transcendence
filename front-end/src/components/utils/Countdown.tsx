import styleCountdown from './Countdown.module.css';

interface CountdownProps {
  count: number;
  total: number;
  color: string;
}

const Countdown = ({ count, total, color }: CountdownProps): JSX.Element => {
  const zeroPad = (n: string): string => {
    return n.length >= 2 ? n : new Array(2 - n.length + 1).join('0') + n;
  };

  return (
    <div className={styleCountdown.div}>
      <svg
        width="22.5em"
        height="22.5em"
        viewBox="0 0 200 200"
        enableBackground="new 0 0 200 200"
        className={styleCountdown.svg__loader}
      >
        <defs>
          <filter id="glow" x="-120%" y="-120%" width="400%" height="400%">
            <feOffset
              result="offOut"
              in="SourceGraphic"
              dx="0"
              dy="0"
            ></feOffset>
            <feGaussianBlur
              result="blurOut"
              in="offOut"
              stdDeviation="10"
            ></feGaussianBlur>
            <feBlend in="SourceGraphic" in2="blurOut" mode="overlay"></feBlend>
          </filter>
        </defs>
        <g>
          <circle
            cx="6.25em"
            cy="6.25em"
            r="5em"
            className={styleCountdown.circle_gray}
            transform="scale(.8, .8) translate(25 25)"
          />
          <circle
            id="seconds_circle"
            fill="none"
            cx="6.25em"
            cy="6.25em"
            r="5em"
            className={styleCountdown.svg__loader_grow}
            role="progressbar"
            transform="rotate(-89 100 100) scale(.8, .8) translate(25 25)"
            filter="url(#glow)"
            style={{
              strokeDashoffset: 500 - (count / total) * 500,
              stroke: color,
            }}
          />
          <text
            id="second_text"
            x="50%"
            y="2.4em"
            fontFamily="'Open Sans', Verdana"
            fontSize="3em"
            fill="#fff"
            textAnchor="middle" // Center the text horizontally
          >
            {zeroPad(count.toString())}
          </text>
        </g>
      </svg>
    </div>
  );
};

export default Countdown;
