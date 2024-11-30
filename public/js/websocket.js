// Hubungkan ke WebSocket server
const ws = new WebSocket('ws://localhost:8080');

// Tangani pesan WebSocket
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'updateJadwal') {
    console.log('Pembaruan jadwal diterima:', data.data);

    // Perbarui daftar jadwal
    const jadwalList = document.getElementById('jadwal-list');
    jadwalList.innerHTML = '';
    data.data.forEach(jadwal => {
      const li = document.createElement('li');
      li.textContent = `${jadwal.dosen} - ${jadwal.mataKuliah} di ${jadwal.ruangan} pada ${jadwal.hari}, ${jadwal.start} - ${jadwal.end}`;
      jadwalList.appendChild(li);
    });
  }
};

ws.onopen = () => {
  console.log('Terhubung ke WebSocket server');
};

ws.onerror = (error) => {
  console.error('Kesalahan WebSocket:', error);
};
