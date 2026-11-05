const API_ROOT = "https://api.github.com/users";

const searchForm = document.getElementById("search-form");
const usernameInput = document.getElementById("username-input");
const statusMessage = document.getElementById("status-message");
const profileCard = document.getElementById("profile-card");
const reposSection = document.getElementById("repos-section");
const reposGrid = document.getElementById("repos-grid");
const repoFilter = document.getElementById("repo-filter");
const languageFilter = document.getElementById("language-filter");

let currentRepos = [];

async function fetchDeveloperData(username) {
  showStatus(`Fetching GitHub profile for "${username}"...`);
  profileCard.classList.add("hidden");
  reposSection.classList.add("hidden");

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`${API_ROOT}/${encodeURIComponent(username)}`),
      fetch(`${API_ROOT}/${encodeURIComponent(username)}/repos?sort=updated&per_page=30`),
    ]);

    if (userRes.status === 404) {
      showStatus(`User "${username}" was not found on GitHub.`);
      return;
    }
    if (!userRes.ok) {
      throw new Error(`GitHub API returned status ${userRes.status}`);
    }

    const user = await userRes.json();
    currentRepos = reposRes.ok ? await reposRes.json() : [];

    statusMessage.classList.add("hidden");
    renderProfile(user);
    populateLanguages(currentRepos);
    renderRepos();
  } catch (error) {
    showStatus(`Unable to load data: ${error.message}`);
  }
}

function renderProfile(user) {
  profileCard.innerHTML = `
    <img class="avatar" src="${user.avatar_url}" alt="${user.login}" />
    <div>
      <h2>${user.name || user.login} <span style="color:#94a3b8;font-size:0.95rem;font-weight:400;">@${user.login}</span></h2>
      <p style="color:#cbd5e1;margin-top:0.25rem;">${user.bio || "Software Developer on GitHub"}</p>
      <div class="profile-stats">
        <span>Public Repos: <strong>${user.public_repos}</strong></span>
        <span>Followers: <strong>${user.followers}</strong></span>
        <span>Following: <strong>${user.following}</strong></span>
        <a href="${user.html_url}" target="_blank" rel="noopener" style="color:#38bdf8;">View on GitHub →</a>
      </div>
    </div>
  `;
  profileCard.classList.remove("hidden");
  reposSection.classList.remove("hidden");
}

function populateLanguages(repos) {
  const languages = [...new Set(repos.map((r) => r.language).filter(Boolean))].sort();
  languageFilter.innerHTML = `<option value="ALL">All Languages</option>` +
    languages.map((lang) => `<option value="${lang}">${lang}</option>`).join("");
}

function renderRepos() {
  const query = repoFilter.value.trim().toLowerCase();
  const lang = languageFilter.value;

  const filtered = currentRepos.filter((repo) => {
    const matchesQuery =
      repo.name.toLowerCase().includes(query) ||
      (repo.description && repo.description.toLowerCase().includes(query));
    const matchesLang = lang === "ALL" || repo.language === lang;
    return matchesQuery && matchesLang;
  });

  if (filtered.length === 0) {
    reposGrid.innerHTML = `<p style="color:#94a3b8;">No matching repositories found.</p>`;
    return;
  }

  reposGrid.innerHTML = filtered
    .map(
      (repo) => `
      <article class="repo-card">
        <div>
          <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>
          <p class="repo-desc">${repo.description || "No description provided."}</p>
        </div>
        <div class="repo-meta">
          <span>${repo.language || "Code"}</span>
          <span>★ ${repo.stargazers_count} • Forks: ${repo.forks_count}</span>
        </div>
      </article>
    `
    )
    .join("");
}

function showStatus(msg) {
  statusMessage.textContent = msg;
  statusMessage.classList.remove("hidden");
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = usernameInput.value.trim();
  if (user) fetchDeveloperData(user);
});

repoFilter.addEventListener("input", renderRepos);
languageFilter.addEventListener("change", renderRepos);

fetchDeveloperData("Ryderadzeee");
