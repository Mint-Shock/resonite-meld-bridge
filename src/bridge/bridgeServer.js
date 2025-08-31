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
let lastSession = null;
let sessionMsgIndex = 0;

function startBridgeServer() {
  const bridgeServer = new WebSocket.Server({
    port: BRIDGE_PORT,
    host: BRIDGE_HOST,
  });
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
        subscribeToSignal(meld, data.subscribe, (event, value) => {
          if (data.subscribe === "sessionChanged") {
            const newSession = JSON.parse(JSON.stringify(value));
            const diff = diffObjects(lastSession, newSession);
            if (diff !== undefined) {
              sessionMsgIndex++;
              sendToResonite("sessionChanged", { diff, index: sessionMsgIndex });
              lastSession = newSession;
            } else {
              console.log("No diff to send for sessionChanged event");
              lastSession = newSession;
            }
          } else {
            // Always use the signal name as the event
            sendToResonite(data.subscribe, value);
          }
        });
        return;
      }

      if (data.method === "requestFullSession") {
        sessionMsgIndex++;
        sendToResonite("sessionChanged", { full: lastSession, index: sessionMsgIndex });
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

function diffObjects(prev, next) {
  if (typeof prev !== "object" || typeof next !== "object" || prev === null || next === null) {
    // Primitive or null: only include if changed
    return prev !== next ? next : undefined;
  }
  const diff = {};
  // Added or changed keys
  for (const key of Object.keys(next)) {
    const subDiff = diffObjects(prev?.[key], next[key]);
    if (subDiff !== undefined) {
      // Always include 'type' if present in the new object
      if (
        typeof next[key] === "object" &&
        next[key] !== null &&
        "type" in next[key]
      ) {
        diff[key] = { ...subDiff, type: next[key].type };
      } else {
        diff[key] = subDiff;
      }
    }
  }
  // Deleted keys
  for (const key of Object.keys(prev || {})) {
    if (!(key in next)) {
      diff[key] = null;
    }
  }
  return Object.keys(diff).length > 0 ? diff : undefined;
}

module.exports = { startBridgeServer, sendToResonite };
