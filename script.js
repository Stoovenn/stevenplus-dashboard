const sheets = {
  logs: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRFumqor16-F0quFqSfj1jle2_ruVI1HI02vFwv1cHxE9qaEkMFcgcfLU1eK7izc1r-9nFmhTCOZ_4R/pub?output=csv',
  goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGimPMHu0yME6QJsVVRbOBeDsQLIZh4eKafc2g87_tXbmVfBUM7tAz2x9D5viaZQsy5pHm5aDjMYF7/pub?output=csv',
  journal: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQKWKtMObQN6VQqztJ92c30XaGudHjseAflB5lu5TQBsos8InBfwsJozakDtScETaoYqB5isEMW07rP/pub?output=csv'
};

async function fetchCSV(url) {
  const res = await fetch(url);
  const text = await res.text();
  return text.split('\n').map(row => row.split(','));
}

function updateList(id, data, formatter) {
  const ul = document.getElementById(id);
  ul.innerHTML = '';
  data.forEach(row => {
    const li = document.createElement('li');
    li.innerHTML = formatter(row);
    ul.appendChild(li);
  });
}

function getWeekRows(data) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return data.filter(row => {
    const date = new Date(row[0]);
    return date >= weekAgo;
  });
}

function countLogs(rows) {
  let gym = 0, focus = 0, missed = 0;
  rows.forEach(r => {
    const action = r[1]?.toLowerCase();
    if (!action) return;
    if (action.includes('gym')) gym++;
    else if (action.includes('focus')) focus++;
    else if (action.includes('missed')) missed++;
  });
  return { gym, focus, missed };
}

function drawBarChart(canvasId, labels, values, colors) {
  new Chart(document.getElementById(canvasId), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'This Week',
        data: values,
        backgroundColor: colors
      }]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
}

function drawPieChart(canvasId, labels, values, colors) {
  new Chart(document.getElementById(canvasId), {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors
      }]
    },
    options: { responsive: true }
  });
}

(async () => {
  const [logDataRaw, goalData, journalData] = await Promise.all([
    fetchCSV(sheets.logs),
    fetchCSV(sheets.goals),
    fetchCSV(sheets.journal)
  ]);

  const logData = logDataRaw.filter(r => r.length >= 2);
  const recentLogs = getWeekRows(logData);
  const totals = countLogs(recentLogs);

  // 🧠 Streak
  const streakDays = new Set();
  recentLogs.forEach(row => {
    const date = row[0]?.split(' ')[0];
    const act = row[1]?.toLowerCase();
    if (date && (act.includes('gym') || act.includes('focus'))) {
      streakDays.add(date);
    }
  });
  document.getElementById('streakCount').textContent = `${streakDays.size} days`;

  // 📊 Stats list + chart
  const statsList = [
    `🏋️ Gym: <span class='highlight'>${totals.gym}</span>`,
    `🧠 Focus: <span class='highlight'>${totals.focus}</span>`,
    `❌ Missed: <span class='missed'>${totals.missed}</span>`
  ];
  updateList('statsList', statsList.map(s => [s]), r => r[0]);
  drawBarChart('statsChart', ['Gym', 'Focus', 'Missed'], [totals.gym, totals.focus, totals.missed], ['#0f0', '#0ff', '#f33']);

  // 🎯 Goals
  const current = { gym: totals.gym, focus: totals.focus };
  updateList('goalList', goalData.slice(1), ([type, val]) => {
    const done = current[type] || 0;
    const hit = done >= parseInt(val);
    return `✔️ ${type}: ${done}/${val} ${hit ? "<span class='highlight'>(Met)</span>" : "<span class='missed'>(Missed)</span>"}`;
  });

  // 📘 Journal
  const entries = journalData.slice(1).reverse().slice(0, 5);
  updateList('journalFeed', entries, ([date, mood]) => `<strong>${date}:</strong> ${mood}`);

  // 🧠 Mood Chart
  const moodCounts = {};
  entries.forEach(([_, mood]) => {
    const m = mood.trim().toLowerCase();
    moodCounts[m] = (moodCounts[m] || 0) + 1;
  });
  drawPieChart('moodChart',
    Object.keys(moodCounts),
    Object.values(moodCounts),
    ['#0f0', '#0ff', '#f33', '#ff0', '#f0f']
  );
})();
