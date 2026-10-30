const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 60 });

const ALL_TASKS_KEY = "all_tasks";
const stats = { hits: 0, misses: 0 };

function taskKey(id) {
  return `task_${id}`;
}

function recordHit() {
  stats.hits += 1;
}

function recordMiss() {
  stats.misses += 1;
}

function getStats() {
  return {
    hits: stats.hits,
    misses: stats.misses,
    keys: cache.keys(),
    ttlSeconds: 60,
  };
}

function invalidateTasks(id) {
  cache.del(ALL_TASKS_KEY);
  if (id) {
    cache.del(taskKey(id));
  }
}

module.exports = {
  cache,
  ALL_TASKS_KEY,
  taskKey,
  recordHit,
  recordMiss,
  getStats,
  invalidateTasks,
};
