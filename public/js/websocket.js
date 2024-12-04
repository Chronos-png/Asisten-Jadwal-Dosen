// Hubungkan ke WebSocket server
const ws = new WebSocket("ws://localhost:8080");

// Tangani pesan WebSocket
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "updateJadwal") {
    console.log("Pembaruan jadwal diterima:", data.data);

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
  }
};

ws.onopen = () => {
  console.log("Terhubung ke WebSocket server");
};

ws.onerror = (error) => {
  console.error("Kesalahan WebSocket:", error);
};
