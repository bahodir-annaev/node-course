const os = require('os');
const fs = require('fs');
const childProcess = require('child_process');

const WINDOWS_COMMAND = `powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + ' ' + $_.CPU + ' ' + $_.WorkingSet }"`;
const UNIX_COMMAND = 'ps -A -o %cpu,%mem,comm | sort -nr | head -n 1';

const isWindows = os.type() === 'Windows_NT';
const command = isWindows ? WINDOWS_COMMAND : UNIX_COMMAND;

// Function to get the most CPU-intensive running application
function getMostCpuIntensiveApplication(callback) {
  childProcess.exec(command, (error, stdout) => {
    if (error) {
      callback(`${Math.floor(Date.now() / 1000)} : Error: ${error}`);
    } else {
      callback(`${Math.floor(Date.now() / 1000)} : ${stdout}`);
    }
  });
}

// Function to update the console
function updateConsole(output) {
  process.stdout.clearLine();
  process.stdout.write(output + '\r');
}

// Function to write to file
function writeToLogFile(output) {
  fs.appendFile('activityMonitor.log', output, (error) => {
    if (error) {
      console.log(`File write error: ${error}`);
    }
  });
}

// Start updating the console
setInterval(() => getMostCpuIntensiveApplication(updateConsole), 100);
// Start writing to log file
setInterval(() => getMostCpuIntensiveApplication(writeToLogFile), 60000);
