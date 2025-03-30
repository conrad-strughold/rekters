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

    // Get all posts from the HTML (updated for Node.js <a class="post-card">)
    function getPostsFromHTML() {
        const postCards = document.querySelectorAll('#post-list .post-card');
        return Array.from(postCards).map(card => {
            const title = card.querySelector('h3').textContent;
            const excerpt = card.querySelector('p').textContent;
            const date = card.querySelector('.post-meta span:first-child')?.textContent.replace(/.*\s/, '') || new Date().toLocaleDateString();
            const readTime = card.querySelector('.post-meta span:last-child')?.textContent.replace(/.*\s/, '') || '3 min read';
            const image = card.querySelector('img')?.src || 'https://picsum.photos/800/400?random=' + Math.floor(Math.random() * 1000);
            const category = card.querySelector('.post-category')?.textContent || 'News';

            return {
                file: card.getAttribute('href'), // Get href from <a class="post-card">
                title,
                excerpt,
                date,
                readTime,
                image,
                category
            };
        });
    }

    // Calculate reading time (unchanged)
    function calculateReadingTime(text) {
        const wordsPerMinute = 200;
        const words = text.trim().split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    }

    // Format date (unchanged)
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Create post card HTML (whole card clickable, no "Read more")
    function createPostCard(post) {
        return `
            <a href="${post.file}" class="post-card">
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
                </div>
            </a>
        `;
    }

    // Initialize posts from HTML
    posts = getPostsFromHTML();

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredPosts = posts.filter(post => 
                post.title.toLowerCase().includes(searchTerm) || 
                post.excerpt.toLowerCase().includes(searchTerm)
            );
            postList.innerHTML = filteredPosts.map(post => createPostCard(post)).join('');
        });
    } else {
        console.error('Search input (#search) not found in the DOM');
    }

    // Initialize post list (no featured content update)
    postList.innerHTML = posts.map(post => createPostCard(post)).join('');
});