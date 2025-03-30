const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Fallback template for index.html with search-toggle, search-bar, favicon, and meta tags
const fallbackTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rekters - Breaking News, Breaking Hearts</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤡</text></svg>" type="image/svg+xml">
    <meta name="description" content="Your trusted source for the latest market crashes, tech fails, and political disasters.">
    <meta property="og:title" content="Rekters - Breaking News, Breaking Hearts">
    <meta property="og:description" content="Your trusted source for the latest market crashes, tech fails, and political disasters.">
    <meta property="og:image" content="https://www.rekters.com/images/image1.png">
    <meta property="og:url" content="https://www.rekters.com/">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Rekters - Breaking News, Breaking Hearts">
    <meta name="twitter:description" content="Your trusted source for the latest market crashes, tech fails, and political disasters.">
    <meta name="twitter:image" content="https://www.rekters.com/images/image1.png">
</head>
<body>
    <nav class="navbar">
        <div class="nav-brand">
            <div class="logo">
                <a href="index.html" class="logo-link">
                    <span class="logo-text">REKTERS</span>
                </a>
            </div>
        </div>
        <div class="nav-links">
            <a href="#" class="active">BREAKING NEWS</a>
            <a href="#">MARKETS</a>
            <div class="search-container">
                <input type="text" id="search" placeholder="Search news...">
                <i class="fas fa-search"></i>
            </div>
        </div>
        <div class="theme-toggle">
            <i class="fas fa-moon"></i>
        </div>
        <div class="search-toggle">
            <i class="fas fa-search"></i>
        </div>
        <div class="search-bar">
            <input type="text" id="mobile-search" placeholder="Search news...">
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
</body>
</html>
`;

// List of cover images for featured article
const featuredCoverImages = [
    'https://www.rekters.com/images/cover1.png',
    'https://www.rekters.com/images/cover2.png',
    'https://www.rekters.com/images/cover3.png',
    'https://www.rekters.com/images/cover4.png',
    'https://www.rekters.com/images/cover5.png',
    'https://www.rekters.com/images/cover6.png',
    'https://www.rekters.com/images/cover7.png'
];

// List of remote images hosted at rekters.com for other sections
const remoteImages = [
    'https://www.rekters.com/images/image1.png',
    'https://www.rekters.com/images/image2.png',
    'https://www.rekters.com/images/image3.png',
    'https://www.rekters.com/images/image4.png',
    'https://www.rekters.com/images/image5.png',
    'https://www.rekters.com/images/image6.png',
    'https://www.rekters.com/images/image7.png',
    'https://www.rekters.com/images/image8.png',
    'https://www.rekters.com/images/image9.png'
];

// Sets to track available images
let availableCoverImages = new Set(featuredCoverImages);
let availableRemoteImages = new Set(remoteImages);

// Function to get a random cover image for featured article without repetition
function getRandomCoverImage() {
    if (availableCoverImages.size === 0) {
        availableCoverImages = new Set(featuredCoverImages); // Reset if exhausted
    }
    const imagesArray = Array.from(availableCoverImages);
    const randomIndex = Math.floor(Math.random() * imagesArray.length);
    const selectedImage = imagesArray[randomIndex];
    availableCoverImages.delete(selectedImage); // Remove from available pool
    return selectedImage;
}

// Function to get a random remote image for other sections without repetition
function getRandomImage() {
    if (availableRemoteImages.size === 0) {
        availableRemoteImages = new Set(remoteImages); // Reset if exhausted
    }
    const imagesArray = Array.from(availableRemoteImages);
    const randomIndex = Math.floor(Math.random() * imagesArray.length);
    const selectedImage = imagesArray[randomIndex];
    availableRemoteImages.delete(selectedImage); // Remove from available pool
    return selectedImage;
}

// Function to generate featured story HTML using cover images
function generateFeaturedHtml(article) {
    const imageUrl = getRandomCoverImage();
    return `
        <a href="posts/${article.slug}.html" class="featured-card">
            <div class="featured-image" style="background-image: url('${imageUrl}');">
                <div class="featured-overlay">
                    <h3>${article.title}</h3>
                    <div class="post-meta">
                        <span><i class="far fa-calendar"></i> ${article.date}</span>
                        <span><i class="far fa-clock"></i> ${article.readTime}</span>
                    </div>
                    <p class="post-excerpt">${article.content[0].substring(0, 150)}...</p>
                </div>
            </div>
        </a>
    `;
}

// Function to generate post HTML for the grid
function generatePostHtml(article) {
    return `
        <a href="posts/${article.slug}.html" class="post-card">
            <img src="${getRandomImage()}" alt="${article.title}">
            <div class="post-content">
                <h3>${article.title}</h3>
                <div class="post-meta">
                    <span><i class="far fa-calendar"></i> ${article.date}</span>
                    <span><i class="far fa-clock"></i> ${article.readTime}</span>
                </div>
            </div>
        </a>
    `;
}

// Function to generate sidebar HTML
function generateSidebarHtml(article) {
    return `
        <a href="posts/${article.slug}.html" class="sidebar-news-item">
            <h4>${article.title}</h4>
            <div class="meta">
                <span><i class="far fa-clock"></i> ${article.date}</span>
            </div>
        </a>
    `;
}

// Function to generate tags HTML
function generateTagsHtml(tags) {
    return tags.map(tag => `<span class="tag">${tag}</span>`).join('');
}

// Function to generate individual article HTML files with favicon and meta tags
function generateArticleHtml(article) {
    const { slug, title, category, date, readTime, tags, content } = article;
    const navLinks = `
        <a href="../index.html">Breaking News</a>
        <a href="#" class="${category === 'Markets' ? 'active' : ''}">Markets</a>
    `;
    const articleContent = content.map(p => `<p>${p}</p>`).join('');
    const tagsHtml = tags.map(tag => `<span class="article-tag">${tag}</span>`).join('');
    const randomImage = getRandomImage();
    const excerpt = content[0].substring(0, 150) + '...';
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="../css/post.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤡</text></svg>" type="image/svg+xml">
    <meta name="description" content="${excerpt}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${excerpt}">
    <meta property="og:image" content="${randomImage}">
    <meta property="og:url" content="https://www.rekters.com/posts/${slug}.html">
    <meta property="og:type" content="article">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${excerpt}">
    <meta name="twitter:image" content="${randomImage}">
</head>
<body>
    <nav class="navbar">
        <div class="nav-brand"><div class="logo"><a href="../index.html" class="logo-link"><span class="logo-text">REKTERS</span></a></div></div>
        <div class="nav-links">${navLinks}</div>
        <div class="theme-toggle"><i class="fas fa-moon"></i></div>
    </nav>
    <main>
        <article>
            <header class="article-header">
                <h1 class="article-title">${title}</h1>
                <div class="article-meta">
                    <span><i class="far fa-calendar"></i> ${date}</span>
                    <span><i class="far fa-clock"></i> ${article.readTime}</span>
                </div>
            </header>
            <div class="article-content">${articleContent}</div>
            <div class="article-tags">${tagsHtml}</div>
            <a href="../index.html" class="back-to-home"><i class="fas fa-arrow-left"></i> Back to Latest Rekts</a>
        </article>
    </main>
    <script>
        document.querySelector('.theme-toggle').addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const icon = document.querySelector('.theme-toggle i');
            icon.classList.toggle('fa-moon');
            icon.classList.toggle('fa-sun');
        });
    </script>
</body>
</html>
    `;
    return html;
}

// Read articles from JSON file
const articles = JSON.parse(fs.readFileSync('articles.json', 'utf8'));

// Create posts directory if it doesn’t exist
const postsDir = 'posts';
if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir);
}

// Generate individual article HTML files
articles.forEach(article => {
    const html = generateArticleHtml(article);
    const filePath = path.join(postsDir, `${article.slug}.html`);
    fs.writeFileSync(filePath, html, 'utf8');
});

// Update or create index.html
const indexPath = 'index.html';
let indexHtml;

if (!fs.existsSync(indexPath) || fs.readFileSync(indexPath, 'utf8').trim() === '') {
    console.log('index.html not found or empty, using fallback template');
    indexHtml = fallbackTemplate;
} else {
    indexHtml = fs.readFileSync(indexPath, 'utf8');
}

const $ = cheerio.load(indexHtml);

// Ensure favicon and meta tags are in the <head> of index.html
$('head link[rel="icon"]').remove(); // Remove any existing favicon
$('head').append('<link rel="icon" href="data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'.9em\' font-size=\'90\'>🤡</text></svg>" type="image/svg+xml">');

// Remove existing meta tags to avoid duplicates, then add new ones
$('head meta[name="description"]').remove();
$('head meta[property^="og:"]').remove();
$('head meta[name^="twitter:"]').remove();
$('head').append(`
    <meta name="description" content="Your trusted source for the latest market crashes, tech fails, and political disasters.">
    <meta property="og:title" content="Rekters - Breaking News, Breaking Hearts">
    <meta property="og:description" content="Your trusted source for the latest market crashes, tech fails, and political disasters.">
    <meta property="og:image" content="https://www.rekters.com/images/image1.png">
    <meta property="og:url" content="https://www.rekters.com/">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Rekters - Breaking News, Breaking Hearts">
    <meta name="twitter:description" content="Your trusted source for the latest market crashes, tech fails, and political disasters.">
    <meta name="twitter:image" content="https://www.rekters.com/images/image1.png">
`);

// Sort articles by date descending (newest first)
articles.sort((a, b) => new Date(b.date) - new Date(a.date));

// Get the featured article (newest one)
const featuredArticle = articles[0];

// Generate HTML for featured section
const featuredHtml = generateFeaturedHtml(featuredArticle);

// Update featured story
const featuredElement = $('#featured-content');
if (featuredElement.length === 0) {
    console.error('Error: #featured-content not found in index.html - adding it');
    $('section.featured-post').append('<div id="featured-content"></div>');
    $('#featured-content').append(featuredHtml);
} else {
    featuredElement.empty().append(featuredHtml);
}

// Update posts list (Latest Rekts) with all articles except the featured one
const latestRektsArticles = articles.filter(article => article.slug !== featuredArticle.slug);
const postsHtml = latestRektsArticles.map(generatePostHtml).join('');
const postListElement = $('#post-list');
if (postListElement.length === 0) {
    console.error('Error: #post-list not found in index.html - adding it');
    $('section.posts-section').append('<div id="post-list" class="post-grid"></div>');
    $('#post-list').append(postsHtml);
} else {
    postListElement.empty().append(postsHtml);
}

// Update sidebar with all articles
const sidebarHtml = articles.map(generateSidebarHtml).join('');
const sidebarNewsElement = $('.sidebar-news');
if (sidebarNewsElement.length === 0) {
    console.error('Error: .sidebar-news not found in index.html - adding it');
    $('aside.sidebar .sidebar-section').append('<div class="sidebar-news"></div>');
    $('.sidebar-news').append(sidebarHtml);
} else {
    sidebarNewsElement.empty().append(sidebarHtml);
}

// Update tags with all unique tags
const allTags = [...new Set(articles.flatMap(article => article.tags))];
const tagsHtml = generateTagsHtml(allTags);
const tagsElement = $('#tags');
if (tagsElement.length === 0) {
    console.error('Error: #tags not found in index.html - adding it');
    $('header.hero').append('<div id="tags" class="tags-container"></div>');
    $('#tags').append(tagsHtml);
} else {
    tagsElement.empty().append(tagsHtml);
}

// Verify the featured article in the updated HTML
const updatedHtml = $.html();
if (!updatedHtml.includes(`<h3>${featuredArticle.title}</h3>`)) {
    console.error(`Error: Featured article "${featuredArticle.title}" not found in updated HTML`);
}

// Write the updated index.html back to disk
fs.writeFileSync(indexPath, updatedHtml, 'utf8');

console.log('HTML files generated and index.html updated successfully.');
console.log('Featured article:', featuredArticle.title);
console.log('Latest Rekts articles:', latestRektsArticles.map(a => a.title));