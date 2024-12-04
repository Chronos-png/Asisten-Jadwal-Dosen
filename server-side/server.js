const express = require("express");
const { JSONRPCServer } = require("json-rpc-2.0");
const cors = require("cors");
const WebSocket = require("ws"); // Node.js WebSocket library
const path = require("path");
const { queryDatabase } = require("./database");
const app = express();
const port = 5000;
const server = new JSONRPCServer(); // JSON-RPC Server Setup

app.use(cors());
app.use(express.json());

async function initializeRPC() {
  try {
    //Pass
  } catch (error) {
    //Pass
  }
}

jadwalDosen = queryDatabase(
  "SELECT * FROM jadwal JOIN dosen ON dosen.NIP = jadwal.NIP JOIN mata_kuliah ON mata_kuliah.KODE_MATKUL = jadwal.KODE_MATKUL JOIN ruangan ON ruangan.KODE_RUANGAN = jadwal.KODE_RUANGAN"
);
mataKuliah = queryDatabase("SELECT * FROM mata_kuliah");
ruangan = queryDatabase("SELECT * FROM ruangan");

// Add Methods for handling schedules
server.addMethod("getJadwal", () => jadwalDosen);
server.addMethod("getRuangan", () => ruangan);
server.addMethod("getMataKuliah", () => mataKuliah);
server.addMethod("getSKS", ({ kode }) => {
  queryDatabase(
    "SELECT mata_kuliah.sks FROM mata_kuliah WHERE mata_kuliah.KODE_MATKUL = ?",
    [kode]
  );
});
server.addMethod(
  "addJadwal",
  async ({ dosen, mataKuliah, ruangan, hari, start, end }) => {
    const newJadwal = {
      NIP: 220411100130, // Dosen's NIP
      KODE_RUANGAN: ruangan, // Room code
      KODE_MATKUL: mataKuliah, // Course code
      HARI: hari, // Day of the week
      WAKTU_MULAI: start, // Start time
      WAKTU_BERAKHIR: end, // End time
    };

    // First, check if there is already a schedule in the same room at the same time
    const conflictCheckQuery =
      "SELECT * FROM jadwal WHERE KODE_RUANGAN = ? AND HARI = ? AND WAKTU_MULAI = ?";

    const existingSchedules = await queryDatabase(conflictCheckQuery, [
      newJadwal.KODE_RUANGAN,
      newJadwal.HARI,
      newJadwal.WAKTU_MULAI,
    ]);

    if (existingSchedules.length > 0) {
      return {
        success: false,
        message: "Jadwal bertabrakan dengan jadwal yang ada.",
      };
    }

    await queryDatabase(
      "INSERT INTO `jadwal`(`NIP`, `KODE_RUANGAN`, `KODE_MATKUL`, `HARI`, `WAKTU_MULAI`, `WAKTU_BERAKHIR`) VALUES (?, ?, ?, ?, ?, ?)",
      [
        newJadwal.NIP,
        newJadwal.KODE_RUANGAN,
        newJadwal.KODE_MATKUL,
        newJadwal.HARI,
        newJadwal.WAKTU_MULAI,
        newJadwal.WAKTU_BERAKHIR,
      ]
    );

    logMessage(`Jadwal baru ditambahkan: ${JSON.stringify(newJadwal)}`);
    broadcastJadwalUpdate();
    return { success: true };
  }
);
server.addMethod("deleteJadwal", async ({ kodeJadwal }) => {
  try {
    const result = await queryDatabase(
      "DELETE FROM jadwal WHERE KODE_JADWAL = ?",
      [kodeJadwal]
    );
    logMessage(`Terdapat Penghapusan Jadwal`);
    broadcastJadwalUpdate();
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus jadwal:", error);
    return { success: false, message: "Terjadi kesalahan pada server." };
  }
});

// server.addMethod('deleteJadwal', ({ dosen, mataKuliah }) => {
//   const index = jadwalDosen.findIndex((jadwal) => jadwal.dosen === dosen && jadwal.mataKuliah === mataKuliah);
//   if (index > -1) {
//     jadwalDosen.splice(index, 1);
//     logMessage(`Jadwal ${mataKuliah} oleh ${dosen} dihapus.`);
//     broadcastJadwalUpdate();
//     return { success: true };
//   }
//   return { success: false, message: 'Jadwal tidak ditemukan' };
// });
// WebSocket Server Setup
const wss = new WebSocket.Server({ port: 8080 });

let serverLogs = [];

wss.on("connection", (ws) => {
  console.log("Klien terhubung ke WebSocket");
  ws.send(JSON.stringify({ type: "logInit", logs: serverLogs }));

  ws.on("message", (message) => {
    console.log("Pesan dari klien:", message);
  });

  ws.on("close", () => {
    console.log("Klien terputus");
  });

  ws.onerror = function (error) {
    console.error("WebSocket Error:", error);
  };
});

function logMessage(message) {
  const timestamp = new Date().toISOString();
  const log = `[${timestamp}] ${message}`;
  serverLogs.push(log);
  console.log(log);

  // Broadcast log update to all WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "logUpdate", log }));
    }
  });
}

// Broadcast Jadwal Updates to clients
function broadcastJadwalUpdate() {
  jadwalDosen = queryDatabase(
    "SELECT * FROM jadwal JOIN dosen ON dosen.NIP = jadwal.NIP JOIN mata_kuliah ON mata_kuliah.KODE_MATKUL = jadwal.KODE_MATKUL JOIN ruangan ON ruangan.KODE_RUANGAN = jadwal.KODE_RUANGAN"
  );
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "updateJadwal", data: jadwalDosen }));
    }
  });
}

// Handle RPC requests
app.post("/rpc", (req, res) => {
  server
    .receive(req.body)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Express server and routes
app.listen(port, () => {
  logMessage(`Server berjalan di http://localhost:${port}`);
});
