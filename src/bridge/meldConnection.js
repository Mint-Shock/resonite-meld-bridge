const WebSocket = require("ws");
const fs = require("fs");
const vm = require("vm");
const path = require("path");
const { logPreview } = require("../utils/logger");
const { parseJSONSafe } = require("../utils/json");

const MELD_URL = "ws://127.0.0.1:13376";

let meld = null;
let meldConnected = false;
let meldSocket = null;

function connectToMeld() {
  // Load QWebChannel from file
  const sandbox = { module: {}, console };
  const qwcScript = fs.readFileSync(path.join(__dirname, "../../qwebchannel.min.js"), "utf8");
  vm.createContext(sandbox);
  vm.runInContext(qwcScript, sandbox);
  const QWebChannel = sandbox.module.exports.QWebChannel;

  meldSocket = new WebSocket(MELD_URL);

  meldSocket.on("open", () => {
    meldConnected = true;
    console.log("✅ Connected to Meld Studio");

    const transport = {
      send: (data) => meldSocket.send(data),
      onmessage: null,
    };

    meldSocket.on("message", (data) => {
      if (typeof data === "object" && data.toString) data = data.toString();
      const parsed = parseJSONSafe(data);

      if (parsed) {
        logPreview("🧾 Meld RAW", parsed);
      } else {
        console.log("🧾 Meld RAW (non-JSON):", data);
      }

      if (transport.onmessage) transport.onmessage({ data });
    });

    new QWebChannel(transport, (channel) => {
      meld = channel.objects.meld;
      console.log("🔁 QWebChannel initialized. Meld interface ready.");
    });
  });

  meldSocket.on("close", () => {
    meldConnected = false;
    meld = null;
    console.log("❌ Meld disconnected. Reconnecting in 5s...");
    setTimeout(connectToMeld, 5000);
  });

  meldSocket.on("error", (err) => {
    meldConnected = false;
    console.error("Meld error:", err.message);
  });
}

function getMeld() {
  return { meld, meldConnected };
}

module.exports = { connectToMeld, getMeld };
