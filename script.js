<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Steven+ Dashboard</title>
  <link rel="stylesheet" href="style.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <header>
    <img src="https://avatars.githubusercontent.com/u/159002346?v=4" alt="Avatar">
    <h1>Welcome, Steven 🧠</h1>
    <p class="subtitle">Your week. Your progress. Your mirror.</p>
  </header>

  <section>
    <h2>🔥 Streak</h2>
    <p id="streakCount">Loading...</p>
  </section>

  <section>
    <h2>📊 Weekly Stats</h2>
    <ul id="statsList">Loading...</ul>
    <canvas id="statsChart" height="200"></canvas>
  </section>

  <section>
    <h2>🎯 Goals</h2>
    <ul id="goalList">Loading...</ul>
  </section>

  <section>
    <h2>📘 Reflection Journal</h2>
    <ul id="journalFeed">Loading...</ul>
    <canvas id="moodChart" height="200"></canvas>
  </section>

  <footer>
    <p>Built with ❤️ by Steven+</p>
  </footer>

  <script src="script.js"></script>
</body>
</html>
