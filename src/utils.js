export const escapeHTML = (str) =>
  String(str).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c])

export function getVisibleItems({ items, query, filter, sort }) {
  const q = query.trim().toLowerCase()

  const filtered = items
    .filter(({ title }) => title.toLowerCase().includes(q))
    .filter(({ category }) => filter === "all" || category === filter)

  const sorters = {
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    "name": (a, b) => a.title.localeCompare(b.title),
  }

  return sorters[sort] ? filtered.toSorted(sorters[sort]) : filtered
}