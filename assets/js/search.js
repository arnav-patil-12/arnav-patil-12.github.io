document.addEventListener('DOMContentLoaded', function () {
  fetch('/index.json')
    .then(response => response.json())
    .then(data => {
      const options = {
        keys: ['title', 'content', 'tags', 'category'], // Fields to search
        threshold: 0.3 // Sensitivity of search
      };
      const fuse = new Fuse(data, options);
      const searchInput = document.getElementById('search-input');
      const searchResults = document.getElementById('search-results');

      searchInput.addEventListener('input', function (e) {
        const query = e.target.value;
        const results = fuse.search(query);

        // Display search results
        searchResults.innerHTML = results.map(result => `
          <div class="search-result">
            <a href="${result.item.url}">${result.item.title}</a>
            <p>${result.item.content.substring(0, 150)}...</p>
          </div>
        `).join('');
      });
    });
});
