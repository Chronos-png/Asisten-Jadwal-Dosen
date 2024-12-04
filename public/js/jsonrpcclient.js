let mataKuliah = [];

function getEndTime(start, sks) {
  const startDate = new Date(`1970-01-01T${start}:00`);
  const durationInMinutes = sks * 30;
  startDate.setMinutes(startDate.getMinutes() + durationInMinutes);
  const hours = String(startDate.getHours()).padStart(2, "0");
  const minutes = String(startDate.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

async function sendRPCRequest(method, params) {
  const response = await fetch("http://localhost:8000/rpc", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: method,
      params: params,
      id: 1,
    }),
  });
  const text = await response.text();
  console.log("Response Text: ", text);

  const data = JSON.parse(text);
  return data.result;
}

async function deleteJadwal(kodeJadwal, jadwalDiv) {
  try {
    const result = await sendRPCRequest("deleteJadwal", { kodeJadwal });
    console.log(kodeJadwal);

    if (result.success) {
      alert("Jadwal berhasil dihapus.");
    } else {
      alert("Gagal menghapus jadwal.");
    }
    getJadwal();
  } catch (error) {
    console.error("Gagal menghapus jadwal:", error);
    alert("Terjadi kesalahan saat menghapus jadwal.");
  }
}

async function getJadwal() {
  try {
    const jadwal = await sendRPCRequest("getJadwal", {});
    const ruangan = await sendRPCRequest("getRuangan", {});
    const jadwalContainer = document.getElementById("jadwal-container");

    jadwalContainer.innerHTML = ""; // Clear existing jadwal

    ruangan.forEach((ruanganItem) => {
      jadwal.forEach((jadwalItem) => {
        if (ruanganItem.KODE_RUANGAN === jadwalItem.KODE_RUANGAN) {
          const jadwalDiv = document.createElement("div");
          jadwalDiv.className =
            "flex flex-col gap-2 py-4 sm:gap-6 sm:flex-row sm:items-center";

          // Add the delete button here
          jadwalDiv.innerHTML = `
            <p class="w-32 text-lg font-normal text-gray-500 sm:text-right dark:text-gray-400 shrink-0">
              ${jadwalItem.WAKTU_MULAI} - ${jadwalItem.WAKTU_BERAKHIR}
            </p>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              <a href="#" class="hover:underline">${jadwalItem.NAMA_MATKUL}</a>
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              ${jadwalItem.NAMA_DOSEN} di ${jadwalItem.NOMOR_RUANGAN} (${jadwalItem.HARI})
            </p>
            <button class="delete-btn text-red-600 hover:text-red-800">
              Hapus
            </button>
            <button class="delete-btn text-red-600 hover:text-red-800">
            Hapus
          </button>
          `;

          const deleteButton = jadwalDiv.querySelector(".delete-btn");
          deleteButton.addEventListener("click", () =>
            deleteJadwal(jadwalItem.KODE_JADWAL, jadwalDiv)
          );

          const editButton = jadwalDiv.querySelector(".edit-btn");
          editButton.addEventListener("click", () => openEditForm(jadwalItem));
          jadwalContainer.appendChild(jadwalDiv);
        }
      });
    });
  } catch (error) {
    console.error("Gagal mengambil data jadwal:", error);
  }
}

async function getRuangan() {
  const ruangan = await sendRPCRequest("getRuangan", {});
  const ruanganSelect = document.getElementById("ruangan");
  ruangan.forEach((ruanganItem) => {
    const option = document.createElement("option");
    option.value = `${ruanganItem.KODE_RUANGAN}`;
    option.textContent = `${ruanganItem.KODE_RUANGAN}`;
    ruanganSelect.appendChild(option);
  });
}

async function getMataKuliah() {
  mataKuliah = await sendRPCRequest("getMataKuliah", {});
  const mataKuliahSelect = document.getElementById("mataKuliah");
  mataKuliah.forEach((mataKuliahItem) => {
    const option = document.createElement("option");
    option.value = mataKuliahItem.KODE_MATKUL;
    option.textContent = `${mataKuliahItem.NAMA_MATKUL} (${mataKuliahItem.sks} SKS)`;
    mataKuliahSelect.appendChild(option);
  });
}

async function addJadwal() {
  const dosen = document.getElementById("dosen").value;
  const mataKuliah = document.getElementById("mataKuliah").value;
  const ruangan = document.getElementById("ruangan").value;
  const hari = document.getElementById("hari").value;
  const start = document.getElementById("waktu").value;
  // const end = getEndTime(start, getMataKuliahSks(mataKuliah));
  const end = getEndTime(start, getMataKuliahSks(mataKuliah));

  const result = await sendRPCRequest("addJadwal", {
    dosen,
    mataKuliah,
    ruangan,
    hari,
    start,
    end,
  });
  if (result.success) {
    alert("Jadwal berhasil ditambahkan!");
    getJadwal();
  } else {
    alert("Gagal menambahkan jadwal.");
  }
}
function getMataKuliahSks(mataKuliahNama) {
  const mataKuliahItem = mataKuliah.find(
    (item) => item.KODE_MATKUL === mataKuliahNama
  );
  if (mataKuliahItem) {
    return mataKuliahItem.sks;
  } else {
    console.error(`Mata kuliah "${mataKuliahNama}" tidak ditemukan.`);
    return 0;
  }
}

window.onload = function () {
  getMataKuliah();
  getRuangan();
  getJadwal();

  // Add event listeners
  document.getElementById("addJadwalBtn").addEventListener("click", addJadwal);
  document
    .getElementById("deleteJadwalBtn")
    .addEventListener("click", deleteJadwal);
};
