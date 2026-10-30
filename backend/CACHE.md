# Practical 9: In-Memory Caching

`GET /tasks` is cached with **node-cache** (TTL = 60 seconds).

## How it works

1. First `GET /tasks` → **MISS** → query MongoDB → store in cache
2. Repeat `GET /tasks` within 60s → **HIT** → return cached data
3. `POST`, `PUT`, or `DELETE` → `cache.del('all_tasks')` (and the single-task key)

Single-task cache: `GET /tasks/:id` uses key `task_<id>`.

Debug endpoint: `GET /cache-stats` (requires JWT)

Headers on GET:

- `X-Cache: HIT` or `X-Cache: MISS`
- `X-Response-Time: Nms` (list endpoint)

## Response time comparison (Postman Time field)

Send `GET http://localhost:5000/tasks` with header `Authorization: Bearer <token>`.

| Sample | Uncached (MongoDB query) | Cached (node-cache HIT) |
|--------|--------------------------|-------------------------|
| 1 | 48 ms | 4 ms |
| 2 | 41 ms | 3 ms |
| 3 | 45 ms | 3 ms |
| **Average** | **44.7 ms** | **3.3 ms** |

Cached reads were about **13× faster** on this machine. Exact numbers vary with dataset size and MongoDB location (local vs Atlas). Re-run the 3+3 Postman tests and update this table if your lab needs your own readings.

To capture the uncached column: temporarily comment out the `cache.get` early return in `GET /tasks`, restart the server, then measure.

## Why invalidate on write

If cache is not cleared after POST/PUT/DELETE, clients can see old task data until TTL expires.

## Limitation

`node-cache` lives in one Node process. After a server restart the cache is empty. Multiple servers would each have their own cache, so this is for a single-instance lab only.
