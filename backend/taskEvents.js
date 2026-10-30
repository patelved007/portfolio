const EventEmitter = require("events");

const taskEmitter = new EventEmitter();

function timestamp() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const millis = String(now.getMilliseconds()).padStart(3, "0");
  return `${hours}:${minutes}:${seconds}.${millis}`;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendTaskCreatedNotification(payload) {
  const startedAt = timestamp();
  console.log(`[${startedAt}] Background notification started.`);

  await delay(2000);

  const finishedAt = timestamp();
  console.log(
    `[${finishedAt}] Notification: "${payload.title}" assigned to ${payload.assignedUser} (task ${payload.id}, created ${payload.createdAt})`,
  );
  console.log(`[${finishedAt}] Background notification completed.`);
}

taskEmitter.on("task-created", (payload) => {
  setImmediate(() => {
    sendTaskCreatedNotification(payload).catch((err) => {
      console.error(
        `[${timestamp()}] Background notification failed: ${err.message}`,
      );
    });
  });
});

module.exports = { taskEmitter, timestamp };
