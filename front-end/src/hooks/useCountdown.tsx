import { useBoolean } from '@/hooks/useBoolean';
import { useCounter } from '@/hooks/useCounter';
import { useInterval } from '@/hooks/useInterval';
import { useCallback } from 'react';

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
}

export function useCountdown(
  countdownOption: CountdownOption
): [number, CountdownControllers] {
  let countStart, intervalMs, isIncrement: boolean | undefined;

  // eslint-disable-next-line prefer-const
  ({ countStart, intervalMs, isIncrement } = countdownOption);

  intervalMs = intervalMs ?? 1000;
  isIncrement = isIncrement ?? false;

  const {
    count,
    increment,
    decrement,
    reset: resetCounter,
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
    } as CountdownControllers,
  ];
}
