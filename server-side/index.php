<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Log Server</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
    }
    #log-container {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #ddd;
      padding: 10px;
      background: #f9f9f9;
    }
    .log-entry {
      margin: 5px 0;
      padding: 5px;
      border-bottom: 1px solid #eee;
    }
  </style>
</head>
<body>
  <h1>Log Server</h1>
  <div id="log-container">
    <!-- Log entries will be dynamically added here -->
  </div>

  <script>
    let logContainer = document.getElementById('log-container');

    // Function to add logs dynamically to the page
    function addLog(message) {
      const logEntry = document.createElement('div');
      logEntry.className = 'log-entry';
      logEntry.textContent = message;
      logContainer.appendChild(logEntry);

      // Scroll to the latest log
      logContainer.scrollTop = logContainer.scrollHeight;
    }

    // WebSocket connection to the server (the server needs to be running on localhost:8080)
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = function() {
      console.log('WebSocket Connected');
    };

    socket.onmessage = function(event) {
      const message = JSON.parse(event.data);
      if (message.type === 'logUpdate') {
        addLog(message.log);  // Add the log message to the container
      } else if (message.type === 'logInit') {
        // Initialize logs on page load
        message.logs.forEach(log => addLog(log));
      }
    };

    socket.onerror = function(error) {
      console.error('WebSocket Error:', error);
    };

    socket.onclose = function() {
      console.log('WebSocket Disconnected');
    };
  </script>
  <script src="./server.js"></script>
</body>
</html>
