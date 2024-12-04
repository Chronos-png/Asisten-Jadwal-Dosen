<h1>Sistem Pengelolaan Jadwal Dosen dan Kelas</h1>

<h2>Tambah Jadwal</h2>
<label for="dosen">Nama Dosen:</label><br>
<input type="text" id="dosen" required><br>

<label for="mataKuliah">Mata Kuliah:</label><br>
<select id="mataKuliah" required>
    <!-- Opsi mata kuliah akan ditambahkan secara dinamis di sini -->
</select><br>

<label for="ruangan">Ruangan:</label><br>
<select id="ruangan" required>
    <!-- Opsi ruangan akan ditambahkan secara dinamis di sini -->
</select><br>

<label for="hari">Hari:</label><br>
<select id="hari" required>
    <option value="Senin">Senin</option>
    <option value="Selasa">Selasa</option>
    <option value="Rabu">Rabu</option>
    <option value="Kamis">Kamis</option>
    <option value="Jumat">Jumat</option>
    <option value="Sabtu">Sabtu</option>
</select><br>

<label for="waktu">Waktu:</label><br>
<select id="waktu" required>
    <option value="07:00">07:00</option>
    <option value="09:30">09:30</option>
    <option value="13:00">13:00</option>
    <option value="15:00">15:00</option>
</select><br>

<button id="addJadwalBtn">Tambah Jadwal</button>
<button id="deleteJadwalBtn">Hapus Jadwal</button>

<h2>Jadwal Dosen</h2>
<ul id="jadwal-list"></ul>