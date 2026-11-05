# DevFinder Dashboard: GitHub Profile & Repository Explorer

A responsive front-end web application that integrates with the official GitHub REST API (`api.github.com`) to search developer profiles, inspect repository statistics, and filter projects by primary programming language.

## Features
- **GitHub REST API Integration:** Asynchronous data fetching (`GET /users/{username}` and `GET /users/{username}/repos`) using `async/await` and `fetch()`.
- **Repository Filtering & Sorting:** Filter repositories by language or search keyword and sort by star count or recent updates.
- **Error & Rate-Limit Handling:** Clear UI states for loading spinners, 404 user-not-found responses, and API rate limits.
- **Responsive Design:** Built with semantic HTML5, CSS Grid, Flexbox, and dark/light theme support.

## Tech Stack
- **Languages:** HTML5, CSS3, JavaScript (ES6+)
- **API:** GitHub REST API v3 (JSON)
- **Version Control:** Git & GitHub

## Usage
Open `index.html` directly in any modern browser and search for any GitHub username (e.g., `Ryderadzeee`, `torvalds`, `gaearon`).

