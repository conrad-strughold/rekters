const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Function to generate featured story HTML (rich details, fully clickable)
function generateFeaturedHtml(article) {
  return `
    <a href="posts/${article.slug}.html" class="featured-card">
      <img src="https://picsum.photos/800/400?random=${Math.floor(Math.random() * 1000)}" alt="${article.title}">
      <div class="featured-content">
        <span class="post-category">${article.category}</span>
        <h3>${article.title}</h3>
        <div class="post-meta">
          <span><i class="far fa-calendar"></i> ${article.date}</span>
          <span><i class="far fa-clock"></i> ${article.readTime}</span>
        </div>
        <p class="post-excerpt">${article.content[0].substring(0, 150)}...</p>
      </div>
    </a>
  `;
}

// Function to generate post HTML for the grid (rich details, fully clickable)
function generatePostHtml(article) {
  return `
    <a href="posts/${article.slug}.html" class="post-card">
      <img src="https://picsum.photos/800/400?random=${Math.floor(Math.random() * 1000)}" alt="${article.title}">
      <div class="post-content">
        <span class="post-category">${article.category}</span>
        <h3>${article.title}</h3>
        <p class="post-excerpt">${article.content[0].substring(0, 100)}...</p>
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

// Function to generate individual article HTML files
function generateArticleHtml(article) {
  const { slug, title, category, date, readTime, tags, content } = article;
  const navLinks = `
    <a href="../index.html">Breaking News</a>
    <a href="#" class="${category === 'Markets' ? 'active' : ''}">Markets</a>
    <a href="#" class="${category === 'Technology' ? 'active' : ''}">Technology</a>
    <a href="#" class="${category === 'Politics' ? 'active' : ''}">Politics</a>
  `;
  const articleContent = content.map(p => `<p>${p}</p>`).join('');
  const tagsHtml = tags.map(tag => `<span class="article-tag">${tag}</span>`).join('');
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="../css/post.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
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
                <span class="article-category">${category}</span>
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

// Update index.html
const indexPath = 'index.html';
const indexHtml = fs.readFileSync(indexPath, 'utf8');
const $ = cheerio.load(indexHtml);

// Sort articles by date descending (newest first)
articles.sort((a, b) => new Date(b.date) - new Date(a.date));

// Get the featured article (newest one)
const featuredArticle = articles[0];

// Generate HTML for featured section
const featuredHtml = generateFeaturedHtml(featuredArticle);

// Update featured story explicitly
const featuredElement = $('#featured-content');
if (featuredElement.length === 0) {
  console.error('Error: #featured-content not found in index.html');
} else {
  featuredElement.empty().append(featuredHtml);
}

// Update posts list (Latest Rekts) with all articles EXCEPT the featured one
const latestRektsArticles = articles.filter(article => article.slug !== featuredArticle.slug);
const postsHtml = latestRektsArticles.map(generatePostHtml).join('');
const postListElement = $('#post-list');
if (postListElement.length === 0) {
  console.error('Error: #post-list not found in index.html');
} else {
  postListElement.empty().append(postsHtml);
}

// Update sidebar with all articles
const sidebarHtml = articles.map(generateSidebarHtml).join('');
$('.sidebar-news').empty().append(sidebarHtml);

// Update tags with all unique tags
const allTags = [...new Set(articles.flatMap(article => article.tags))];
const tagsHtml = generateTagsHtml(allTags);
$('#tags').empty().append(tagsHtml);

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