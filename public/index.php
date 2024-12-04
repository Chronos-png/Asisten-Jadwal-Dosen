<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sistem Pengelolaan Jadwal Dosen dan Kelas</title>
  <link href="./css/output.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.css" rel="stylesheet" />
</head>

<body>
  <?php include('./components/create_modal.php') ?>
  <?php include('./components/edit_modal.php') ?>

  <section class="bg-white dark:bg-gray-900 antialiased">
    <div class="max-w-screen-xl px-4 py-8 mx-auto lg:px-6 sm:py-16 lg:py-24">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
          Schedule
        </h2>

        <div class="mt-4">
          <a href="#" title=""
            class="inline-flex items-center text-lg font-medium text-primary-600 hover:underline dark:text-primary-500">
            Learn more about our agenda
            <svg aria-hidden="true" class="w-5 h-5 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
              fill="currentColor">
              <path fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </a>
        </div>
        <div class="flex justify-center gap-5 mt-2">
          <!-- Modal toggle -->
          <button data-modal-target="create-modal" data-modal-toggle="create-modal" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
            Tambah Jadwal
          </button>
          <button data-modal-target="edit-modal" data-modal-toggle="edit-modal" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
            Edit Jadwal
          </button>
        </div>
      </div>

      <div class="flex flex-wrap gap-4 w-full mx-auto mt-8 sm:mt-12 lg:mt-16 justify-center">
        <div id="jadwal-container">
          <!-- JADWAL DI TAMPILKAN DISINI   -->
        </div>
      </div>
    </div>
  </section>
  <script src="./js/jsonrpcclient.js"></script>
  <script src="./js/websocket.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.js"></script>
</body>

</html>