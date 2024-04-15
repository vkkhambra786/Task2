const os = require("os");

// Function to get CPU utilization
function getCPUUsage() {
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;

  cpus.forEach((cpu) => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });

  return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
}

// Function to restart the server
async function restartServer() {
  console.log("Restarting server...");
  try {
    const { execa } = await import("execa");
    const { stdout } = await execa("npm", ["run", "start"]);
    console.log(`Server restarted: ${stdout}`);
  } catch (error) {
    console.error(`Server restart failed: ${error.message}`);
  }
}

// Interval for checking CPU utilization (in milliseconds)
const interval = 5000; // Check every 5 seconds

setInterval(async () => {
  const usage = getCPUUsage();
  const idleDifference = usage.total - usage.idle;
  const percentageCPU = 100 - Math.floor((idleDifference / usage.total) * 100);

  console.log(`Current CPU usage: ${percentageCPU}%`);

  if (percentageCPU >= 70) {
    await restartServer();
  }
}, interval);
