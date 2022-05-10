export function debounce(f, ms) {
  let isCooldown = false;
  return function () {
    if (isCooldown) return;

    isCooldown = true;
    f.apply(this, arguments);
    setTimeout(() => (isCooldown = false), ms);
  };
}
