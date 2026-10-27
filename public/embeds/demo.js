(() => {
  "use strict";
  const controls = document.getElementById("controls");
  const preview = document.getElementById("preview");
  const code = document.getElementById("placement-code");
  const status = document.getElementById("copy-status");
  const campaign = document.getElementById("campaign");
  const theme = document.getElementById("theme");
  const destination = document.getElementById("destination");
  const width = document.getElementById("width");
  const initial = new URLSearchParams(location.search);
  for (const control of [campaign, theme, destination]) {
    const value = initial.get(control.id);
    if (Array.from(control.options).some(option => option.value === value)) control.value = value;
  }
  const initialWidth = Number(initial.get("width"));
  if (initial.has("width") && Number.isFinite(initialWidth)) width.value = String(Math.max(160, Math.min(1440, initialWidth)));
  function render() {
    preview.style.width = `${width.value}px`;
    document.getElementById("width-label").textContent = `${width.value} px`;
    preview.replaceChildren();
    const script = document.createElement("script");
    script.async = true;
    script.src = new URL("srivari-catering.js?v=diwali-string-lights-1", location.href).href;
    script.dataset.campaign = campaign.value;
    script.dataset.theme = theme.value;
    script.dataset.destination = destination.value;
    script.dataset.placement = "homepage-banner";
    script.dataset.source = "placement-preview";
    preview.append(script);
    code.textContent = `<script async\n  src="https://srivaricatering.com/embeds/srivari-catering.js"\n  data-campaign="${campaign.value}"\n  data-theme="${theme.value}"\n  data-destination="${destination.value}"\n  data-placement="homepage-banner">\n</script>\n<noscript><a href="https://srivaricatering.com/#occasions">Explore Srivari vegetarian catering</a></noscript>`;
    status.textContent = "";
    const url = new URL(location.href);
    for (const control of [campaign, theme, destination, width]) url.searchParams.set(control.id, control.value);
    history.replaceState(null, "", url);
  }
  controls.addEventListener("submit", event => event.preventDefault());
  controls.addEventListener("change", render);
  width.addEventListener("input", () => {
    preview.style.width = `${width.value}px`;
    document.getElementById("width-label").textContent = `${width.value} px`;
  });
  document.getElementById("copy").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(code.textContent); status.textContent = "Placement tag copied."; }
    catch {
      const range = document.createRange(); range.selectNodeContents(code);
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
      status.textContent = "The tag is selected. Copy it with your browser’s Copy command.";
    }
  });
  render();
})();
