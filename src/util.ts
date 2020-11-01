export function indexOfSmallest(a: number[]) {
  let lowest = 0
  for (let i = 1; i < a.length; i++) {
    if (a[i] < a[lowest]) lowest = i
  }
  return lowest
}

export class Debouncer {
  private timerHandle: any = null
  constructor(private debounceFn: () => void) {}

  trigger(debounceMs: number) {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle)
    }
    this.timerHandle = setTimeout(this.debounceFn, debounceMs)
  }
}
