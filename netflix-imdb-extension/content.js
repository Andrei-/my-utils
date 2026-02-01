// Netflix IMDb Ratings Extension
(function() {
    'use strict';

    // Get your free API key from https://www.omdbapi.com/apikey.aspx
    const OMDB_API_KEY = 'd68347ad'; // Replace with your API key
    
    const cache = new Map();
    const processedTitles = new WeakSet();

    // Extract title from Netflix elements
    function extractTitle(element) {
        // Try different selectors for title
        const titleElement = element.querySelector('.fallback-text, .title-card-title, [class*="title"]');
        if (titleElement) {
            return titleElement.textContent.trim();
        }
        
        // Try aria-label
        const ariaLabel = element.getAttribute('aria-label');
        if (ariaLabel) {
            return ariaLabel.trim();
        }
        
        return null;
    }

    // Fetch IMDb rating from OMDb API
    async function fetchIMDbRating(title) {
        if (cache.has(title)) {
            return cache.get(title);
        }

        try {
            const response = await fetch(
                `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`
            );
            const data = await response.json();
            
            if (data.Response === 'True' && data.imdbRating !== 'N/A') {
                const rating = {
                    imdb: data.imdbRating,
                    year: data.Year,
                    type: data.Type
                };
                cache.set(title, rating);
                return rating;
            }
        } catch (error) {
            console.error('Error fetching IMDb rating:', error);
        }
        
        cache.set(title, null);
        return null;
    }

    // Add rating badge to Netflix title card
    function addRatingBadge(element, rating) {
        if (!rating || processedTitles.has(element)) {
            return;
        }

        const badge = document.createElement('div');
        badge.className = 'imdb-rating-badge';
        badge.innerHTML = `
            <span class="imdb-logo">IMDb</span>
            <span class="imdb-score">${rating.imdb}</span>
        `;
        
        element.style.position = 'relative';
        element.appendChild(badge);
        processedTitles.add(element);
    }

    // Process all visible title cards
    async function processTitleCards() {
        // Netflix uses various classes for title cards
        const selectors = [
            '.title-card',
            '.slider-refocus',
            '[class*="titleCard"]',
            '.bob-card'
        ];

        for (const selector of selectors) {
            const titleCards = document.querySelectorAll(selector);
            
            for (const card of titleCards) {
                if (processedTitles.has(card)) {
                    continue;
                }

                const title = extractTitle(card);
                if (title) {
                    const rating = await fetchIMDbRating(title);
                    if (rating) {
                        addRatingBadge(card, rating);
                    }
                }
            }
        }
    }

    // Debounce function to avoid excessive processing
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Observe DOM changes to catch dynamically loaded content
    const observer = new MutationObserver(debounce(() => {
        processTitleCards();
    }, 500));

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial processing
    setTimeout(processTitleCards, 2000);

    console.log('Netflix IMDb Ratings extension loaded');
})();
