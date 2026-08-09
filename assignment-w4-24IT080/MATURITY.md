# Richardson Maturity Model Evaluation

**API:** Task Management API (Practical 4)  
**Student:** Ved Patel (24IT080)  
**Course:** ITUE301 – Advanced Web Development Frameworks

## Current Maturity Level: **Level 2**

The Task Management API uses resource-based URIs, correct HTTP verbs, and meaningful status codes on every endpoint. It does **not** include HATEOAS hypermedia links in responses, so it has not reached Level 3.

---

## Evaluation Table

| Level | Criterion | Does your API satisfy this? | Evidence |
|-------|-----------|----------------------------|----------|
| **Level 0 – The Swamp of POX** | All operations go through a single URI using one HTTP method (typically POST) | **No** (we are past Level 0) | The API exposes multiple routes: `GET /tasks`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`. Operations are not tunnelled through one endpoint. |
| **Level 1 – Resources** | URIs identify distinct resources rather than actions | **Yes** | `/tasks` represents the task collection; `/tasks/:id` represents an individual task resource identified by ID. |
| **Level 2 – HTTP Verbs & Status Codes** | Correct HTTP methods are used for each operation (GET = read, POST = create, PUT = update, DELETE = delete) | **Yes** | `GET /tasks` lists tasks; `POST /tasks` creates; `PUT /tasks/:id` updates; `DELETE /tasks/:id` removes a task. No verb is misused (e.g. GET is never used to delete). |
| **Level 2 – HTTP Verbs & Status Codes** | Meaningful HTTP status codes are returned for success and failure | **Yes** | `200` for successful GET/PUT/DELETE; `201` for successful POST with `Location` header; `400` for bad input; `404` for missing task or route; `500` for server errors. |
| **Level 2 – HTTP Verbs & Status Codes** | Request and response bodies use a consistent JSON format | **Yes** | Tasks are returned as JSON objects `{ id, title, completed }`. Errors use `{ error: "message" }` across all endpoints. |
| **Level 3 – Hypermedia (HATEOAS)** | Response bodies include `_links` so the client can discover next actions without hard-coded URLs | **No** | Responses return task data only. Links are not embedded (see HATEOAS Awareness section below). |

---

## Level 2 Compliance Summary

| Endpoint | Method | Success Code | Error Codes |
|----------|--------|--------------|-------------|
| `/tasks` | GET | 200 | — |
| `/tasks` | POST | 201 (+ Location header) | 400 |
| `/tasks/:id` | PUT | 200 | 400, 404 |
| `/tasks/:id` | DELETE | 200 | 400, 404 |
| Unknown route | * | — | 404 |
| Server error | * | — | 500 |

No Level 2 violations were found. A `Location` header was added on `POST /tasks` responses to follow REST create conventions.

---

## HATEOAS Awareness (Level 3 – not implemented)

If the API were upgraded to Level 3, each task response would include hypermedia links so clients could navigate without memorising URL patterns:

```json
{
  "id": 123,
  "title": "Task A",
  "completed": false,
  "_links": {
    "self": { "href": "/tasks/123", "method": "GET" },
    "delete": { "href": "/tasks/123", "method": "DELETE" }
  }
}
```

A collection response could also link to create actions:

```json
{
  "tasks": [ ... ],
  "_links": {
    "self": { "href": "/tasks", "method": "GET" },
    "create": { "href": "/tasks", "method": "POST" }
  }
}
```

---

## Why Most Production APIs Stop at Level 2

Most production APIs stop at **Level 2** because it already gives clients predictable resource URLs, standard HTTP semantics, and clear status codes—enough for mobile apps, SPAs, and third-party integrations to work reliably. **Level 3 (HATEOAS)** adds hypermedia links in every response, which increases payload size and implementation complexity without always improving developer experience. Modern clients typically hard-code or document known endpoints (OpenAPI/Swagger) rather than discover them at runtime from `_links`. HATEOAS is valuable in highly dynamic or long-lived systems where the server must evolve URLs without breaking clients, but for most CRUD APIs like task managers, **Level 2 is the practical sweet spot** between REST purity and maintainability.

---

## Files Updated

- `server.js` – POST `/tasks` now sets `Location: /tasks/:id` header on 201 responses
