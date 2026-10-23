export function render({ status, items, error }) {
  const statusEl = document.querySelector("#status")

  if (status === "loading") statusEl.textContent = "Loading products..."
  if (status === "error") statusEl.textContent = `Error: ${error}`
  if (status === "success") statusEl.textContent = `${items.length} products loaded`
}