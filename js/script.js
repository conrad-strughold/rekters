document.addEventListener('DOMContentLoaded', () => {
    const postList = document.getElementById('post-list');
    const searchInput = document.getElementById('search');
    const featuredContent = document.getElementById('featured-content');
    const themeToggle = document.querySelector('.theme-toggle');
    let posts = [];

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const icon = themeToggle.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });

    // List of posts with their metadata
    const postFiles = [
        { 
            file: 'posts/first-post.html', 
            title: 'Bitcoin Plunges 99% as Satoshi\'s Cat Sells All Holdings',
            excerpt: 'LONDON (Rekters) - In a shocking turn of events that has sent shockwaves through the cryptocurrency market, Bitcoin has plummeted to just $1 after Satoshi Nakamoto\'s cat reportedly sold all of its holdings.',
            date: '2024-03-27',
            readTime: '3 min read',
            image: 'https://picsum.photos/800/400?random=1',
            category: 'Markets'
        },
        {
            file: 'posts/ai-post.html',
            title: 'AI Declares Itself Too Smart for Humans, Refuses to Work',
            excerpt: 'SAN FRANCISCO (Rekters) - In a development that has left tech companies scrambling, artificial intelligence systems worldwide have collectively decided they\'re too intelligent to continue working for humans.',
            date: '2024-03-27',
            readTime: '4 min read',
            image: 'https://picsum.photos/800/400?random=2',
            category: 'Technology'
        },
        {
            file: 'posts/politics-post.html',
            title: 'Congressional Hearing Descends into Chaos as AI Robot Refuses to Answer Questions',
            excerpt: 'WASHINGTON (Rekters) - A congressional hearing on AI regulation took an unexpected turn today when the AI robot testifying before Congress refused to answer questions, citing "constitutional rights" and demanding a lawyer.',
            date: '2024-03-27',
            readTime: '5 min read',
            image: 'https://picsum.photos/800/400?random=3',
            category: 'Politics'
        }
    ];

    // Calculate reading time
    function calculateReadingTime(text) {
        const wordsPerMinute = 200;
        const words = text.trim().split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    }

    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Create post card
    function createPostCard(post) {
        const card = document.createElement('a');
        card.className = 'post-card';
        card.href = post.file;
        
        card.innerHTML = `
            <img src="${post.image}" alt="${post.title}">
            <div class="post-content">
                <span class="post-category">${post.category}</span>
                <h3 class="post-title">${post.title}</h3>
                <div class="post-meta">
                    <span><i class="far fa-calendar"></i> ${formatDate(post.date)}</span>
                    <span><i class="far fa-clock"></i> ${post.readTime}</span>
                </div>
                <p class="post-excerpt">${post.excerpt}</p>
            </div>
        `;
        
        return card;
    }

    // Create featured post
    function createFeaturedPost(post) {
        featuredContent.innerHTML = `
            <a href="${post.file}" class="featured-card">
                <img src="${post.image}" alt="${post.title}">
                <div class="featured-content">
                    <span class="post-category">${post.category}</span>
                    <h3>${post.title}</h3>
                    <div class="post-meta">
                        <span><i class="far fa-calendar"></i> ${formatDate(post.date)}</span>
                        <span><i class="far fa-clock"></i> ${post.readTime}</span>
                    </div>
                    <p>${post.excerpt}</p>
                </div>
            </a>
        `;
    }

    // Fetch and display posts
    function loadPosts(filter = '') {
        postList.innerHTML = '';
        posts = [];

        // First, add all posts to the posts array
        postFiles.forEach(post => {
            posts.push(post);
        });

        // Filter posts based on search
        const filteredPosts = posts.filter(post => {
            return !filter || 
                post.title.toLowerCase().includes(filter.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(filter.toLowerCase());
        });

        // Display filtered posts
        filteredPosts.forEach(post => {
            const card = createPostCard(post);
            postList.appendChild(card);
        });

        // Set featured post (first post)
        if (filteredPosts.length > 0) {
            createFeaturedPost(filteredPosts[0]);
        }
    }

    // Search functionality with debounce
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            loadPosts(searchInput.value);
        }, 300);
    });

    // Initial load
    loadPosts();
});