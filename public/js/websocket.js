// Hubungkan ke WebSocket server
const ws = new WebSocket("ws://localhost:8000");

// Pastikan jadwalContainer sudah ada di DOM
const jadwalContainer = document.getElementById("jadwal-container");

if (!jadwalContainer) {
  console.error("Element with id 'jadwalContainer' not found.");
}

// Tangani pesan WebSocket
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  // Check the message type and handle it
  if (data.type === "updateJadwal") {
    console.log("Pembaruan jadwal diterima:", data.data);

    // Clear the existing jadwal before adding new ones
    jadwalContainer.innerHTML = "";

    // Iterate through the jadwal data to display
    data.data.forEach((jadwalItem) => {
      const jadwalDiv = document.createElement("div");
      jadwalDiv.className =
        "flex flex-col gap-2 py-4 sm:gap-6 sm:flex-row sm:items-center";

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
        <button class="edit-btn text-blue-600 hover:text-blue-800">
          Edit
        </button>
      `;

      // Attach delete and edit button event listeners
      const deleteButton = jadwalDiv.querySelector(".delete-btn");
      if (deleteButton) {
        deleteButton.addEventListener("click", () => {
          deleteJadwal(jadwalItem.KODE_JADWAL, jadwalDiv);
        });
      }

      // Optional: Add functionality for the edit button
      // const editButton = jadwalDiv.querySelector(".edit-btn");
      // if (editButton) {
      //   editButton.addEventListener("click", () => {
      //     editJadwal(jadwalItem.KODE_JADWAL);
      //   });
      // }

      // Append the new jadwal to the container
      jadwalContainer.appendChild(jadwalDiv);
    });
  }
};

// Tangani koneksi terbuka WebSocket
ws.onopen = () => {
  console.log("Terhubung ke WebSocket server");
};

// Tangani kesalahan WebSocket
ws.onerror = (error) => {
  console.error("Kesalahan WebSocket:", error);
};

// Tangani penutupan koneksi WebSocket
ws.onclose = () => {
  console.log("Koneksi WebSocket ditutup");
};
