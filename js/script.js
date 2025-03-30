document.addEventListener('DOMContentLoaded', () => {
    const postList = document.getElementById('post-list');
    const searchInput = document.getElementById('search');
    const themeToggle = document.querySelector('.theme-toggle');
    let posts = [];

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const icon = themeToggle.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });

    // Get all posts from the HTML
    function getPostsFromHTML() {
        const postCards = document.querySelectorAll('#post-list .post-card'); // Scope to #post-list
        return Array.from(postCards).map(card => {
            const link = card.querySelector('a');
            const title = card.querySelector('h3').textContent;
            const excerpt = card.querySelector('p').textContent;
            const date = new Date().toLocaleDateString(); // Placeholder; consider using actual dates
            const readTime = '3 min read'; // Placeholder; consider actual read times
            const image = 'https://picsum.photos/800/400?random=' + Math.floor(Math.random() * 1000);
            const category = 'News'; // Placeholder; consider actual categories

            return {
                file: link.getAttribute('href'),
                title,
                excerpt,
                date,
                readTime,
                image,
                category
            };
        });
    }

    // Calculate reading time
    function calculateReadingTime(text) {
        const wordsPerMinute = 200;
        const words = text.trim().split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Create post card HTML
    function createPostCard(post) {
        return `
            <div class="post-card">
                <div class="post-image">
                    <img src="${post.image}" alt="${post.title}">
                </div>
                <div class="post-content">
                    <span class="post-category">${post.category}</span>
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <div class="post-meta">
                        <span><i class="far fa-calendar"></i> ${formatDate(post.date)}</span>
                        <span><i class="far fa-clock"></i> ${post.readTime}</span>
                    </div>
                    <a href="${post.file}" class="read-more">Read more</a>
                </div>
            </div>
        `;
    }

    // Initialize posts from HTML
    posts = getPostsFromHTML();

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredPosts = posts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) || 
            post.excerpt.toLowerCase().includes(searchTerm)
        );

        postList.innerHTML = filteredPosts.map(post => createPostCard(post)).join('');
    });

    // Initialize post list (no featured content update)
    postList.innerHTML = posts.map(post => createPostCard(post)).join('');
});