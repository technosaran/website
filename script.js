window.onload = async function() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // data now contains { portfolio: [], skills: [], experience: [] }

        // Function to apply staggered animation
        const applyStaggeredAnimation = (elements, animationName, duration, delayIncrement) => {
            elements.forEach((el, index) => {
                el.style.animation = `${animationName} ${duration}s ease-out forwards`;
                el.style.animationDelay = `${index * delayIncrement}s`;
            });
        };

        // Populate Portfolio
        const portfolioGrid = document.querySelector('.portfolio-grid');
        const portfolioItems = []; // Store created items for animation
        if (portfolioGrid && data.portfolio) {
            const loadingIndicator = portfolioGrid.querySelector('.loading-indicator');
            if (loadingIndicator) loadingIndicator.remove(); // Remove loading indicator
            // portfolioGrid.innerHTML = ''; // Clear existing static content if any - Replaced by removing indicator
            data.portfolio.forEach(item => {
                const portfolioItem = document.createElement('div');
                portfolioItem.classList.add('portfolio-item');
                // Determine links
                const liveLink = item.liveLink && item.liveLink !== '#' ? item.liveLink : null;
                const sourceLink = item.sourceLink && item.sourceLink !== '#' ? item.sourceLink : null;

                // Generate image tag, optionally wrapped in a link to the live demo
                // Added loading="lazy" attribute
                const imageHtml = `<img src="${item.image}" alt="Screenshot of ${item.title}" loading="lazy">`;
                const imageContainerContent = liveLink
                    ? `<a href="${liveLink}" target="_blank">${imageHtml}</a>`
                    : imageHtml;

                // Generate links HTML
                let linksHtml = '';
                if (liveLink) {
                    linksHtml += `<a href="${liveLink}" target="_blank" rel="noopener noreferrer" class="portfolio-link">Live Demo</a>`;
                }
                if (sourceLink) {
                    linksHtml += `<a href="${sourceLink}" target="_blank" rel="noopener noreferrer" class="portfolio-link">View Source</a>`;
                }

                // Construct the full item HTML
                portfolioItem.innerHTML = `
                    <div class="image-container">
                        ${imageContainerContent}
                    </div>
                    <h3>${item.title}</h3>
                    <p>${item.description || ''}</p>
                    <div class="portfolio-links">
                        ${linksHtml}
                    </div>
                `;
                portfolioGrid.appendChild(portfolioItem);
                portfolioItems.push(portfolioItem); // Add to array for animation
            });
            applyStaggeredAnimation(portfolioItems, 'subtleFadeInScaleUp', 0.5, 0.1); // Apply animation
        }

        // Populate Skills
        const skillsList = document.querySelector('.skills-list');
        const skillItems = []; // Store created items for animation
        if (skillsList && data.skills) {
            const loadingIndicator = skillsList.querySelector('.loading-indicator');
            if (loadingIndicator) loadingIndicator.remove(); // Remove loading indicator
            // skillsList.innerHTML = ''; // Clear placeholder comment - Replaced by removing indicator
            data.skills.forEach(skill => {
                const skillItem = document.createElement('li');
                skillItem.classList.add('skill-item', skill.class || ''); // Add specific class if provided
                skillItem.textContent = skill.name;
                skillsList.appendChild(skillItem);
                skillItems.push(skillItem); // Add to array for animation
            });
            applyStaggeredAnimation(skillItems, 'subtleFadeInScaleUp', 0.4, 0.08); // Apply animation
        }

        // Populate Experience
        const experienceList = document.querySelector('.experience-list');
        const experienceItems = []; // Store created items for animation
        if (experienceList && data.experience) {
            const loadingIndicator = experienceList.querySelector('.loading-indicator');
            if (loadingIndicator) loadingIndicator.remove(); // Remove loading indicator
            // experienceList.innerHTML = ''; // Clear placeholder comment - Replaced by removing indicator
            data.experience.forEach(exp => {
                const experienceItem = document.createElement('li');
                experienceItem.classList.add('experience-item');
                experienceItem.innerHTML = `
                    <h4>${exp.role} at ${exp.company}</h4>
                    <p class="duration">${exp.duration || ''}</p>
                    <p>${exp.description || ''}</p>
                `;
                experienceList.appendChild(experienceItem);
                experienceItems.push(experienceItem); // Add to array for animation
            });
            applyStaggeredAnimation(experienceItems, 'subtleFadeInScaleUp', 0.5, 0.15); // Apply animation
        }

    } catch (error) {
        console.error("Error fetching or processing data:", error);
        // Display error message to the user in the relevant sections
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (portfolioGrid) {
            portfolioGrid.innerHTML = '<p style="color: #ff6b6b; text-align: center;">Failed to load portfolio projects. Please try refreshing the page.</p>';
        }
        // Optionally add similar error messages for skills and experience sections if desired
        const skillsList = document.querySelector('.skills-list');
         if (skillsList) {
             skillsList.innerHTML = '<p style="color: #ff6b6b; text-align: center;">Failed to load skills.</p>';
         }
         const experienceList = document.querySelector('.experience-list');
         if (experienceList) {
             experienceList.innerHTML = '<p style="color: #ff6b6b; text-align: center;">Failed to load experience.</p>';
         }
    }

    // Display a random quote in the footer
    const quotes = [
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Innovation distinguishes between a leader and a follower. - Steve Jobs",
        "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
        "The best way to predict the future is to create it. - Peter Drucker",
        "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt"
    ];
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const footerQuoteElement = document.querySelector('#footer-quote');
    if (footerQuoteElement) {
        footerQuoteElement.textContent = quote;
    }

    // Add smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('header nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Ensure it's an internal link starting with #
            if (href && href.startsWith('#')) {
                e.preventDefault(); // Prevent default anchor jump
                const targetId = href.substring(1); // Remove #
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start' // Align to top
                    });
                }
            }
        });
    });

    // Back to Top Button Logic
    const backToTopButton = document.getElementById("back-to-top-btn");

    // Show button when user scrolls down 20px from the top
    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    }

    // When the user clicks on the button, scroll to the top of the document smoothly
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });

    // Set Copyright Year
    const copyrightYearSpan = document.getElementById('copyright-year');
    if (copyrightYearSpan) {
        copyrightYearSpan.textContent = new Date().getFullYear();
    }
};
