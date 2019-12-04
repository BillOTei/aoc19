const low = 134792;
const high = 675810;
const hasAdjacentDouble = x => {
  const arr = x.toString().split("");

  for (let i = 1; i < 6; i++) {
    if (arr[i] === arr[i - 1]) return true;
  }

  return false;
};
const hasIncreasingDigits = x => {
  const arr = x
    .toString()
    .split("")
    .map(v => parseInt(v, 10));

  for (let i = 1; i < 6; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }

  return true;
};
const hasAdjacentDoubleOnly = x => {
  const arr = x
    .toString()
    .split("")
    .reduce((acc, d) => {
      if (acc.has(d)) acc.set(d, acc.get(d) + 1);
      else acc.set(d, 1);

      return acc;
    }, new Map());

  return [...arr].filter(v => v[1] === 2).length > 0;
};
let count1 = 0;
let count2 = 0;

for (let x = low; x <= high; x++) {
  if (hasAdjacentDouble(x) && hasIncreasingDigits(x)) count1++;
  if (hasAdjacentDoubleOnly(x) && hasIncreasingDigits(x)) count2++;
}

console.log(count1, count2);
