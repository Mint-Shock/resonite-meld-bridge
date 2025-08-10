function logPreview(label, obj) {
  const str = JSON.stringify(obj);
  console.log(`${label}: ${str.slice(0, 500)}${str.length > 500 ? "…" : ""}`, obj);
}

module.exports = { logPreview };
