let startTime;
let elapsedTime = 0;
let stopwatchInterval;
let lapNumber = 1;

function startStopwatch() {
  if (!stopwatchInterval) {
    startTime = Date.now() - elapsedTime;
    stopwatchInterval = setInterval(updateStopwatch, 100);
    document.getElementById("startButton").disabled = true;
    document.getElementById("stopButton").disabled = false;
    document.getElementById("resetButton").disabled = false;
    document.getElementById("lapButton").disabled = false;
    document.getElementById("lapButton").classList.remove("lapButtonDisabled"); 
    updateShareButtonState(); 
  }
}

function stopResumeStopwatch() {
  if (stopwatchInterval) {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    elapsedTime = Date.now() - startTime;
    document.getElementById("startButton").disabled = false;
    document.getElementById("stopButton").disabled = true;
    document.getElementById("lapButton").disabled = true;
    document.getElementById("lapButton").classList.add("lapButtonDisabled"); 
    updateShareButtonState(); 
  } else {
    startStopwatch();
  }
}

function resetStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
  elapsedTime = 0;
  document.getElementById("timer").textContent = "00:00:00";
  document.getElementById("milliseconds").textContent = ".00";
  document.getElementById("startButton").disabled = false;
  document.getElementById("stopButton").disabled = true;
  document.getElementById("resetButton").disabled = true;
  document.getElementById("lapButton").disabled = true;
  document.getElementById("lapButton").classList.add("lapButtonDisabled"); 
  document.getElementById("shareButton").disabled = true;
  lapNumber = 1;
  clearLapHistory();
}

function recordLap() {
  if (stopwatchInterval) {
    const lapTime = calculateLapTime();
    const lapHistoryList = document.getElementById("lapHistoryList");
    const lapHistoryItem = document.createElement("li");
    lapHistoryItem.innerHTML = `<span>Lap ${lapNumber}:</span>${lapTime}`;
    lapHistoryList.appendChild(lapHistoryItem);
    lapNumber++;
    document.getElementById("shareButton").disabled = false; 
  }
}

function clearLapHistory() {
  const lapHistoryList = document.getElementById("lapHistoryList");
  lapHistoryList.innerHTML = "";
}

function calculateLapTime() {
  const totalMilliseconds = Date.now() - startTime;
  const lapMilliseconds = totalMilliseconds % 1000;
  const lapSeconds = Math.floor(totalMilliseconds / 1000) % 60;
  const lapMinutes = Math.floor(totalMilliseconds / 1000 / 60) % 60;
  const lapHours = Math.floor(totalMilliseconds / 1000 / 3600);

  return `${padZero(lapHours)}:${padZero(lapMinutes)}:${padZero(
    lapSeconds
  )}.${padMilliseconds(lapMilliseconds)}`;
}

function updateStopwatch() {
  const totalMilliseconds = Date.now() - startTime;
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((totalMilliseconds % 1000) / 10);

  document.getElementById("timer").textContent = `${padZero(hours)}:${padZero(
    minutes
  )}:${padZero(seconds)}`;

  document.getElementById("milliseconds").textContent = `.${padMilliseconds(
    milliseconds
  )}`;
}

function padMilliseconds(value) {
  return value < 10 ? `0${value}` : value;
}

function padZero(value) {
  return value < 10 ? `0${value}` : value;
}

function shareTimes() {
  const lapHistoryList = document.getElementById("lapHistoryList");
  const lapItems = lapHistoryList.getElementsByTagName("li");

  if (navigator.share) {
    const lapHistoryText = Array.from(lapItems)
      .map((item) => item.textContent)
      .join("\n");

    navigator
      .share({
        title: "Stopwatch Lap Times",
        text: lapHistoryText,
      })
      .then(() => console.log("Shared successfully"))
      .catch((error) => console.error("Error sharing:", error));
  } else {
    alert(
      "Web Share API not supported in your browser. You can manually copy lap times."
    );
  }
}

function updateShareButtonState() {
  const lapHistoryList = document.getElementById("lapHistoryList");
  const lapItems = lapHistoryList.getElementsByTagName("li");
  document.getElementById("shareButton").disabled = lapItems.length === 0;
}
