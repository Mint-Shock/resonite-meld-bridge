function callMeldMethod(meld, method, args) {
  if (typeof meld[method] === "function") {
    meld[method](...args);
    console.log(`➡️ Called meld.${method}(${args.map(a => JSON.stringify(a)).join(", ")})`);
  } else {
    console.warn(`⚠️ Meld has no method '${method}'`);
  }
}

module.exports = { callMeldMethod };
