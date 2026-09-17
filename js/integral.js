(function () {
  const launchTime = document.querySelector("[data-launch-time]");
  if (!launchTime) return;

  const duration = 30 * 24 * 60 * 60 * 1000;
  const storageKey = "integral-launch-target-v2";
  let target = Number(localStorage.getItem(storageKey));

  if (!target || target < Date.now()) {
    target = Date.now() + duration;
    localStorage.setItem(storageKey, String(target));
  }

  const pad = (value) => String(value).padStart(2, "0");

  function tick() {
    const remaining = Math.max(target - Date.now(), 0);
    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    launchTime.textContent = `${days}D ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  tick();
  setInterval(tick, 1000);
}());
