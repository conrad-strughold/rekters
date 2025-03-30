const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Paths
const indexPath = path.join(__dirname, '../index.html');
const postsDir = path.join(__dirname, '../posts');

// Default HTML structure
const defaultHTML = `<!DOCTYPE html><html lang="en"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rekters - Breaking News, Breaking Hearts</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head><body>
    <nav class="navbar">
        <div class="nav-brand">
            <div class="logo">
                <a href="index.html" class="logo-link">
                    <span class="logo-text">REKTERS</span>
                </a>
            </div>
        </div>
        <div class="nav-links">
            <a href="#" class="active">Breaking News</a>
            <a href="#">Markets</a>
      
            <div class="search-container">
                <input type="text" id="search" placeholder="Search news...">
                <i class="fas fa-search"></i>
            </div>
        </div>
        <div class="theme-toggle">
            <i class="fas fa-moon"></i>
        </div>
    </nav>

    <header class="hero">
        <div id="tags" class="tags-container"></div>
    </header>

    <main>
        <div class="main-content">
            <section class="featured-post">
                <div id="featured-content"></div>
            </section>

            <section class="posts-section">
                <h2>Latest Rekts</h2>
                <div id="post-list" class="post-grid"></div>
            </section>
        </div>

        <aside class="sidebar">
            <div class="sidebar-section">
                <h3>Latest News</h3>
                <div class="sidebar-news"></div>
            </div>
        </aside>
    </main>

    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h3>About Rekters</h3>
                <p>Your trusted source for the latest market crashes, tech fails, and political disasters.</p>
            </div>
            <div class="footer-section">
                <h3>Connect</h3>
                <div class="social-links">
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    <a href="#"><i class="fab fa-github"></i></a>
                    <a href="#"><i class="fab fa-linkedin"></i></a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>© 2024 Rekters. All rights rekt.</p>
        </div>
    </footer>

    <script src="js/script.js"></script>

</body></html>`;

// Read index.html
fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err || !data.trim()) {
        data = defaultHTML; // Use default HTML if file is empty or error occurs
    }
    const $ = cheerio.load(data);
    
    // Track existing articles separately for each section
    const existingSidebarLinks = new Set();
    const existingRektLinks = new Set();

    // Collect existing article links from both sections
    $('.sidebar-news-item').each((i, elem) => {
        const link = $(elem).attr('href');
        existingSidebarLinks.add(link);
    });

    $('.post-card a').each((i, elem) => {
        const link = $(elem).attr('href');
        existingRektLinks.add(link);
    });

    // Function to extract title and snippet from an article
    function extractTitleAndSnippet(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const $ = cheerio.load(content);
        const title = $('h1.article-title').text();
        const snippet = $('p').first().text();
        return { title, snippet };
    }

    // Read posts directory
    fs.readdir(postsDir, (err, files) => {
        if (err) throw err;

        files.forEach(file => {
            const filePath = path.join(postsDir, file);
            const relativePath = path.join('posts', file);
            
            // Extract title and snippet
            const { title, snippet } = extractTitleAndSnippet(filePath);
            
            // Add to sidebar if not already there
            if (!existingSidebarLinks.has(relativePath)) {
                const newSidebarArticle = `<a href="${relativePath}" class="sidebar-news-item">
                    <h4>${title}</h4>
                    <div class="meta">
                        <span><i class="far fa-clock"></i> Just now</span>
                    </div>
                </a>`;
                $('.sidebar-news').append(newSidebarArticle);
            }

            // Add to Latest Rekts if not already there
            if (!existingRektLinks.has(relativePath)) {
                const newRektArticle = `<div class="post-card">
                    <a href="${relativePath}">
                        <h3>${title}</h3>
                        <p>${snippet}</p>
                    </a>
                </div>`;
                $('#post-list').append(newRektArticle);
            }
        });

        // Write back to index.html
        fs.writeFile(indexPath, $.html(), 'utf8', (err) => {
            if (err) throw err;
            console.log('Index updated with new articles.');
        });
    });
});