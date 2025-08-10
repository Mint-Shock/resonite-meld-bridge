function subscribeToSignal(meld, signalName, sendCallback) {
  const signal = meld[signalName];
  if (!signal || typeof signal.connect !== "function") {
    console.warn(`⚠️ Signal '${signalName}' not found or not connectable`);
    return;
  }

  signal.connect((...args) => {
    let value;
    const propertyName = signalName.replace(/Changed$/, "");

    if (args.length === 0 && typeof meld[propertyName] !== "undefined") {
      value = meld[propertyName];
    } else if (args.length === 1) {
      value = args[0];
    } else {
      value = args;
    }

    console.log(`📡 Signal '${signalName}':`, value);
    sendCallback(signalName, value);
  });

  console.log(`✅ Subscribed to signal '${signalName}'`);
}

module.exports = { subscribeToSignal };
