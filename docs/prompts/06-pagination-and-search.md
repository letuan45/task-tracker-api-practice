Review the AGENTS.md.

Implement **search and pagination** for Tasks with the following requirements:

### Backend

* Add support for query parameters:

  * `page` (default: 1)
  * `limit` (default: 5)
  * `search` (optional, filter by task title using partial match)
* Return paginated results with:

  * `items` (array of tasks)
  * `total` (total number of matched tasks)
  * `page`
  * `limit`
* Searching must work together with pagination (i.e., filter first, then paginate)

### Frontend

* Display only **5 items per page**
* Default to **page 1**
* Use URL query params (`page`, `search`) to control state
* Implement pagination UI:

  * Show page numbers
  * Allow navigating between pages
* Implement search by task title:

  * Update URL query param `search`
  * Reset to page 1 when search changes
* Keep pagination working when search is applied

### Constraints

* DO NOT implement:

  * Load more
  * Infinite scroll

### Notes

* Ensure frontend and backend are consistent in query param usage
* Update existing code, do not rewrite from scratch
