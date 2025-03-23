document.addEventListener('DOMContentLoaded', () => {
    const postList = document.getElementById('post-list');
    const searchInput = document.getElementById('search');
    const tagsDiv = document.getElementById('tags');
    let posts = [];
    let allTags = new Set();

    // List of posts (add new posts here manually or dynamically fetch later)
    const postFiles = [
        { file: 'posts/first-post.html', title: 'First Post' }
    ];

    // Fetch and display posts
    function loadPosts(filter = '', tag = '') {
        postList.innerHTML = '<h2>Latest Posts</h2>';
        posts = [];

        postFiles.forEach(post => {
            fetch(post.file)
                .then(response => response.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const title = doc.querySelector('title').textContent;
                    const tags = doc.querySelector('meta[name="tags"]')?.getAttribute('content')?.split(', ') || [];

                    tags.forEach(tag => allTags.add(tag));
                    posts.push({ title, file: post.file, tags });

                    if ((!filter || title.toLowerCase().includes(filter.toLowerCase())) &&
                        (!tag || tags.includes(tag))) {
                        const link = document.createElement('a');
                        link.href = post.file;
                        link.textContent = title;
                        postList.appendChild(link);
                    }
                });
        });

        // Populate tags
        tagsDiv.innerHTML = '';
        allTags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.textContent = tag;
            tagSpan.onclick = () => loadPosts('', tag);
            tagsDiv.appendChild(tagSpan);
        });
    }

    // Search functionality
    searchInput.addEventListener('input', () => {
        loadPosts(searchInput.value);
    });

    // Initial load
    loadPosts();
});