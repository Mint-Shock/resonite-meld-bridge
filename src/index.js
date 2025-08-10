const { connectToMeld } = require("./bridge/meldConnection");
const { startBridgeServer } = require("./bridge/bridgeServer");

connectToMeld();
startBridgeServer();
