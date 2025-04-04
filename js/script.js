document.addEventListener('DOMContentLoaded', () => {
    const postList = document.getElementById('post-list');
    const searchInput = document.getElementById('search'); // Large screen search
    const mobileSearchInput = document.getElementById('mobile-search'); // Small screen search
    const themeToggle = document.querySelector('.theme-toggle');
    const featuredContent = document.getElementById('featured-content');
    const searchToggle = document.querySelector('.search-toggle');
    const searchBar = document.querySelector('.search-bar');
    let posts = [];

    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const icon = themeToggle.querySelector('i');
            icon.classList.toggle('fa-moon');
            icon.classList.toggle('fa-sun');
        });
    }

    // Search toggle functionality for small screens
    if (searchToggle && searchBar) {
        searchToggle.addEventListener('click', () => {
            searchBar.classList.toggle('active');
        });
    } else {
        console.error('Search toggle or bar not found in the DOM');
    }

    // Get all posts from the HTML
    function getPostsFromHTML() {
        const postCards = document.querySelectorAll('#post-list .post-card');
        return Array.from(postCards).map(card => {
            const title = card.querySelector('h3').textContent;
            // No <p> excerpt in post-card, so use title as fallback for search
            const excerpt = title; 
            const date = card.querySelector('.post-meta span:first-child')?.textContent.replace(/.*\s/, '') || new Date().toLocaleDateString();
            const readTime = card.querySelector('.post-meta span:last-child')?.textContent.replace(/.*\s/, '') || '3 min read';
            const image = card.querySelector('img')?.src || 'https://picsum.photos/800/400?random=' + Math.floor(Math.random() * 1000);
            const file = card.getAttribute('href');

            return {
                file,
                title,
                excerpt,
                date,
                readTime,
                image
            };
        });
    }

    // Calculate reading time (not used currently, but kept for future)
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

    // Create post card HTML (matches generatePostHtml from generateArticles.js)
    function createPostCard(post) {
        return `
            <a href="${post.file}" class="post-card">
                <img src="${post.image}" alt="${post.title}">
                <div class="post-content">
                    <h3>${post.title}</h3>
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

    // Shared search functionality
    function applySearch(input) {
        if (!input) return;
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredPosts = posts.filter(post => 
                post.title.toLowerCase().includes(searchTerm) || 
                post.excerpt.toLowerCase().includes(searchTerm)
            );
            if (postList) {
                postList.innerHTML = filteredPosts.map(post => createPostCard(post)).join('');
            }

            if (searchTerm.length > 0 && featuredContent) {
                featuredContent.style.display = 'none';
            } else if (featuredContent) {
                featuredContent.style.display = 'block';
            }
        });
    }

    // Apply search to both inputs if they exist
    applySearch(searchInput);
    applySearch(mobileSearchInput);

    if (!searchInput && !mobileSearchInput) {
        console.error('No search inputs (#search or #mobile-search) found in the DOM');
    }

    if (!postList) {
        console.error('Post list (#post-list) not found in the DOM');
    }
});