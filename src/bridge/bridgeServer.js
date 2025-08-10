const WebSocket = require("ws");
const fs = require("fs");
const { parseJSONSafe } = require("../utils/json");
const { subscribeToSignal } = require("../commands/signals");
const { callMeldMethod } = require("../commands/methods");
const { getMeld } = require("./meldConnection");

const CONFIG = JSON.parse(fs.readFileSync("config.json", "utf8"));
const SECRET_KEY = CONFIG.secret;
const BRIDGE_PORT = 8855;
const BRIDGE_HOST = "127.0.0.2";

let activeClientSocket = null;

function startBridgeServer() {
  const bridgeServer = new WebSocket.Server({ port: BRIDGE_PORT, host: BRIDGE_HOST });
  console.log(`🧠 Bridge listening on ws://${BRIDGE_HOST}:${BRIDGE_PORT}`);

  bridgeServer.on("connection", (clientSocket) => {
    console.log("🔌 Resonite connected");
    activeClientSocket = clientSocket;

    clientSocket.on("message", (message) => {
      const data = parseJSONSafe(message);
      if (!data) return console.error("❌ Invalid JSON received");

      if (data.secret !== SECRET_KEY) {
        console.warn("❗ Invalid secret");
        return;
      }

      const { meld, meldConnected } = getMeld();
      if (!meldConnected || !meld) {
        console.warn("⚠️ Meld is not ready");
        return;
      }

      if (data.subscribe) {
        subscribeToSignal(meld, data.subscribe, sendToResonite);
        return;
      }

      if (data.method) {
        callMeldMethod(meld, data.method, data.args || []);
      }
    });

    clientSocket.on("close", () => {
      console.log("❌ Resonite disconnected");
      activeClientSocket = null;
    });
  });
}

function sendToResonite(event, value) {
  if (activeClientSocket?.readyState === WebSocket.OPEN) {
    activeClientSocket.send(JSON.stringify({ event, value }));
  }
}

module.exports = { startBridgeServer, sendToResonite };
