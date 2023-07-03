export function exclude<T extends Record<string, unknown>, K extends keyof T>(
  user: T,
  keys: K[],
): Omit<T, K> {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key as K)),
  ) as Omit<T, K>;
}
