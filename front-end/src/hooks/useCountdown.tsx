import { useBoolean } from '@/hooks/useBoolean';
import { useCounter } from '@/hooks/useCounter';
import { useInterval } from '@/hooks/useInterval';
import { Dispatch, SetStateAction, useCallback } from 'react';

interface CountdownOption {
  countStart: number;
  intervalMs?: number;
  isIncrement?: boolean;
  countStop?: number;
}
interface CountdownControllers {
  startCountdown: () => void;
  stopCountdown: () => void;
  resetCountdown: () => void;
  setCountdown: Dispatch<SetStateAction<number>>;
}

export function useCountdown(
  countdownOption: CountdownOption
): [number, CountdownControllers] {
  let countStart: number | undefined;
  let intervalMs: number | undefined;
  let isIncrement: boolean | undefined;

  // eslint-disable-next-line prefer-const
  ({ countStart, intervalMs, isIncrement } = countdownOption);

  intervalMs = intervalMs ?? 1000;
  isIncrement = isIncrement ?? false;

  const {
    count,
    increment,
    decrement,
    reset: resetCounter,
    setCount: setCountdown,
  } = useCounter(countStart);

  const {
    value: isCountdownRunning,
    setTrue: startCountdown,
    setFalse: stopCountdown,
  } = useBoolean(false);

  const resetCountdown = (): void => {
    stopCountdown();
    resetCounter();
  };

  const countdownCallback = useCallback(() => {
    isIncrement ? increment() : decrement();
  }, [decrement, increment, isIncrement]);

  useInterval(countdownCallback, isCountdownRunning ? intervalMs : null);

  return [
    count,
    {
      startCountdown,
      stopCountdown,
      resetCountdown,
      setCountdown,
    } as CountdownControllers,
  ];
}
