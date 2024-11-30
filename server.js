const express = require('express');
const { JSONRPCServer } = require('json-rpc-2.0');
const cors = require('cors');

const app = express();
const port = 3000;

const ruangan = [
    { gedung: 'RKBF', kode: 'F203' },
    { gedung: 'RKBF', kode: 'F304' },
    { gedung: 'RKBF', kode: 'F401' },
    { gedung: 'RKBF', kode: 'F406' },
    { gedung: 'RKBF', kode: 'F407' },
    { gedung: 'LAB-FT', kode: 'Lab. CC' },
    { gedung: 'LAB-FT', kode: 'Lab. TIA' },
    { gedung: 'LAB-FT', kode: 'Lab. MULTIMEDIA' },
    { gedung: 'LAB-FT', kode: 'Lab. RISET' }
  ];

// Dummy data untuk jadwal
let jadwalDosen = [
  { dosen: 'Dr. Budi', mataKuliah: 'Algoritma', ruangan: 'Lab 1', hari: 'Senin', start: '9:30', end: '11:30'},
  { dosen: 'Dr. Siti', mataKuliah: 'Pemrograman Web', ruangan: 'Lab 2', hari: 'Selasa', start: '9:30', end: '11:30'}
];

// middleware cors untuk mengizinkan permintaan dari domain yang berbeda.
app.use(cors());
// Middleware untuk parsing JSON
app.use(express.json());

// Membuat server JSON-RPC
const server = new JSONRPCServer();

// Menambahkan method RPC untuk mengelola jadwal
server.addMethod('getJadwal', () => {
  return jadwalDosen;
});

server.addMethod('getRuangan', () => {
    return ruangan;
});

server.addMethod('addJadwal', ({ dosen, mataKuliah, ruangan, hari, start, end }) => {
  const jadwalBaru = { dosen, mataKuliah, ruangan, hari, start, end };
  jadwalDosen.push(jadwalBaru);
  return { success: true, jadwal: jadwalBaru };
});

server.addMethod('deleteJadwal', ({ dosen, mataKuliah }) => {
  const index = jadwalDosen.findIndex(jadwal => jadwal.dosen === dosen && jadwal.mataKuliah === mataKuliah);
  if (index > -1) {
    jadwalDosen.splice(index, 1);
    return { success: true };
  }
  return { success: false, message: 'Jadwal tidak ditemukan' };
});

// Endpoint untuk menerima permintaan JSON-RPC
app.post('/rpc', (req, res) => {
  server.receive(req.body).then((response) => {
    res.json(response);
  });
});

// Menghidupkan server
app.listen(port, () => {
  console.log(`Server RPC berjalan di http://localhost:${port}`);
});
