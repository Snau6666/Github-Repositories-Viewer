let currentPage = 1;
let repositoriesPerPage = 10;

function getRepositories() {
  const username = document.getElementById('username').value;
  repositoriesPerPage = Math.min(100, parseInt(document.getElementById('perPage').value, 10));

  const apiUrl = `https://api.github.com/users/${username}/repos?page=${currentPage}&per_page=${repositoriesPerPage}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => displayRepositories(data))
    .catch(error => console.error('Error fetching data:', error));
}

function displayRepositories(repositories) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (repositories.length === 0) {
    resultsDiv.innerHTML = '<p>No repositories found.</p>';
    return;
  }

  const userInfo = `<p>Repositories for ${repositories[0].owner.login}:</p>`;
  const repoList = repositories.map(repo => {
    const topicsList = repo.topics ? `<p><strong>Topics:</strong> ${repo.topics.join(', ')}</p>` : '';
    return `<div class="repository"><p><strong>>>${repo.name}</strong></p>${topicsList}<p>${repo.description || 'No description'}</p></div>`;
  });

  resultsDiv.innerHTML = userInfo + '<div class="repository-grid">' + repoList.join('') + '</div>';

  // Add pagination controls
  const paginationControls = createPaginationControls();
  resultsDiv.insertAdjacentHTML('beforeend', paginationControls);
}

function createPaginationControls() {
  const maxPages = 10; // You can adjust the maximum number of pages shown

  const totalPages = Math.ceil(repositoriesPerPage / currentPage);
  const startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
  const endPage = Math.min(totalPages, startPage + maxPages - 1);

  let paginationHTML = '<div class="pagination">';
  paginationHTML += `<span>Page ${currentPage} of ${totalPages}</span>`;

  if (currentPage > 1) {
    paginationHTML += `<button onclick="changePage(${currentPage - 1})">Previous</button>`;
  }

  for (let page = startPage; page <= endPage; page++) {
    paginationHTML += `<button onclick="changePage(${page})" ${page === currentPage ? 'class="active"' : ''}>${page}</button>`;
  }

  if (currentPage < totalPages) {
    paginationHTML += `<button onclick="changePage(${currentPage + 1})">Next</button>`;
  }

  paginationHTML += '</div>';
  return paginationHTML;
}

function changePage(newPage) {
  currentPage = newPage;
  getRepositories();
}
