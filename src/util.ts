export function indexOfSmallest(a: number[]) {
  let lowest = 0
  for (let i = 1; i < a.length; i++) {
    if (a[i] < a[lowest]) lowest = i
  }
  return lowest
}
