let mataKuliah = [];  // Define mataKuliah globally

function getEndTime(start, sks) {
  const startDate = new Date(`1970-01-01T${start}:00`);
  const durationInMinutes = sks * 30; 
  startDate.setMinutes(startDate.getMinutes() + durationInMinutes);
  const hours = String(startDate.getHours()).padStart(2, '0');
  const minutes = String(startDate.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getMataKuliahSks(mataKuliahNama) {
    const mataKuliahItem = mataKuliah.find(item => item.nama === mataKuliahNama);
    if (mataKuliahItem) {
        return mataKuliahItem.sks;
    } else {
        console.error(`Mata kuliah "${mataKuliahNama}" tidak ditemukan.`);
        return 0;
    }
}

async function sendRPCRequest(method, params) {
  const response = await fetch('http://localhost:3000/rpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method: method, params: params, id: 1 })
  });
  const data = await response.json();
  return data.result;
}

async function getJadwal() {
  const jadwal = await sendRPCRequest('getJadwal', {});
  const jadwalList = document.getElementById('jadwal-list');
  jadwalList.innerHTML = '';
  jadwal.forEach(jadwal => {
    const li = document.createElement('li');
    li.textContent = `${jadwal.dosen} - ${jadwal.mataKuliah} di ${jadwal.ruangan} pada ${jadwal.hari}, ${jadwal.start} - ${jadwal.end}`;
    jadwalList.appendChild(li);
  });
}

async function getRuangan() {
  const ruangan = await sendRPCRequest('getRuangan', {});
  const ruanganSelect = document.getElementById('ruangan');
  ruangan.forEach(ruanganItem => {
    const option = document.createElement('option');
    option.value = `${ruanganItem.gedung} - ${ruanganItem.kode}`;
    option.textContent = `${ruanganItem.gedung} - ${ruanganItem.kode}`;
    ruanganSelect.appendChild(option);
  });
}

async function getMataKuliah() {
  mataKuliah = await sendRPCRequest('getMataKuliah', {});
  const mataKuliahSelect = document.getElementById('mataKuliah');
  mataKuliah.forEach(mataKuliahItem => {
    const option = document.createElement('option');
    option.value = mataKuliahItem.nama;
    option.textContent = `${mataKuliahItem.nama} (${mataKuliahItem.sks} SKS)`;
    mataKuliahSelect.appendChild(option);
  });
}

async function addJadwal() {
  const dosen = document.getElementById('dosen').value;
  const mataKuliah = document.getElementById('mataKuliah').value;
  const ruangan = document.getElementById('ruangan').value;
  const hari = document.getElementById('hari').value;
  const start = document.getElementById('waktu').value;
  const end = getEndTime(start, getMataKuliahSks(mataKuliah));

  const result = await sendRPCRequest('addJadwal', { dosen, mataKuliah, ruangan, hari, start, end });
  if (result.success) {
    alert('Jadwal berhasil ditambahkan!');
    getJadwal();
  } else {
    alert('Gagal menambahkan jadwal.');
  }
}

async function deleteJadwal() {
  const dosen = document.getElementById('dosen').value;
  const mataKuliah = document.getElementById('mataKuliah').value;

  const result = await sendRPCRequest('deleteJadwal', { dosen, mataKuliah });
  if (result.success) {
    alert('Jadwal berhasil dihapus!');
    getJadwal();
  } else {
    alert('Jadwal tidak ditemukan.');
  }
}

window.onload = function() {
  getMataKuliah();
  getRuangan();
  getJadwal();

  // Add event listeners
  document.getElementById('addJadwalBtn').addEventListener('click', addJadwal);
  document.getElementById('deleteJadwalBtn').addEventListener('click', deleteJadwal);
};