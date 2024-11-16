function fib(n) {
  if (n === 1) {
    return 1;
  }
  if (n === 2) {
    return 1;
  }
  const fibArr = [1, 1];
  for (let i = 1; i < n - 1; i++) {
    fibArr.push(fibArr[i - 1] + fibArr[i]);
  }
  return fibArr[n - 1]
}

console.log(
  fib(50)
);

