document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // --- Constants ---
        const ANIMATION_NAME = 'subtleFadeInScaleUp';
        const PORTFOLIO_ANIM_DURATION = 0.5;
        const PORTFOLIO_ANIM_DELAY = 0.1;
        const SKILL_ANIM_DURATION = 0.4;
        const SKILL_ANIM_DELAY = 0.08;
        const EXPERIENCE_ANIM_DURATION = 0.5;
        const EXPERIENCE_ANIM_DELAY = 0.15;

        // --- Helper Functions ---

        // Function to apply staggered animation
        const applyStaggeredAnimation = (elements, animationName, duration, delayIncrement) => {
            elements.forEach((el, index) => {
                el.style.animation = `${animationName} ${duration}s ease-out forwards`;
                el.style.animationDelay = `${index * delayIncrement}s`;
            });
        };

        // Function to display error message in a section
        const displaySectionError = (selector, message) => {
            const section = document.querySelector(selector);
            if (section) {
                const loadingIndicator = section.querySelector('.loading-indicator');
                if (loadingIndicator) loadingIndicator.remove();
                section.innerHTML = `<p style="color: #ff6b6b; text-align: center;">${message}</p>`;
            }
        };

        // --- Population Functions ---

        const populatePortfolio = (portfolioData) => {
            const portfolioGrid = document.querySelector('.portfolio-grid');
            if (!portfolioGrid) return; // Exit if grid not found

            try {
                if (!Array.isArray(portfolioData)) {
                    throw new Error("Portfolio data is not an array.");
                }
                const loadingIndicator = portfolioGrid.querySelector('.loading-indicator');
                if (loadingIndicator) loadingIndicator.remove();

                const portfolioItems = [];
                portfolioData.forEach(item => {
                    const portfolioItem = document.createElement('div');
                    portfolioItem.classList.add('portfolio-item');
                    const liveLink = item.liveLink && item.liveLink !== '#' ? item.liveLink : null;
                    const sourceLink = item.sourceLink && item.sourceLink !== '#' ? item.sourceLink : null;
                    const imageHtml = `<img src="${item.image}" alt="Screenshot of ${item.title}" loading="lazy">`;
                    const imageContainerContent = liveLink ? `<a href="${liveLink}" target="_blank" rel="noopener noreferrer">${imageHtml}</a>` : imageHtml;
                    let linksHtml = '';
                    if (liveLink) linksHtml += `<a href="${liveLink}" target="_blank" rel="noopener noreferrer" class="portfolio-link">Live Demo</a>`;
                    if (sourceLink) linksHtml += `<a href="${sourceLink}" target="_blank" rel="noopener noreferrer" class="portfolio-link">View Source</a>`;

                    portfolioItem.innerHTML = `
                        <div class="image-container">${imageContainerContent}</div>
                        <h3>${item.title || 'Untitled Project'}</h3>
                        <p>${item.description || ''}</p>
                        <div class="portfolio-links">${linksHtml}</div>
                    `;
                    portfolioGrid.appendChild(portfolioItem);
                    portfolioItems.push(portfolioItem);
                });
                applyStaggeredAnimation(portfolioItems, ANIMATION_NAME, PORTFOLIO_ANIM_DURATION, PORTFOLIO_ANIM_DELAY);
            } catch (error) {
                console.error("Error populating portfolio:", error);
                displaySectionError('.portfolio-grid', 'Failed to load portfolio projects.');
            }
        };

        const populateSkills = (skillsData) => {
            const skillsList = document.querySelector('.skills-list');
            if (!skillsList) return;

            try {
                if (!Array.isArray(skillsData)) {
                    throw new Error("Skills data is not an array.");
                }
                const loadingIndicator = skillsList.querySelector('.loading-indicator');
                if (loadingIndicator) loadingIndicator.remove();

                const skillItems = [];
                skillsData.forEach(skill => {
                    const skillItem = document.createElement('li');
                    skillItem.classList.add('skill-item', skill.class || '');
                    skillItem.textContent = skill.name || 'Unnamed Skill';
                    skillsList.appendChild(skillItem);
                    skillItems.push(skillItem);
                });
                applyStaggeredAnimation(skillItems, ANIMATION_NAME, SKILL_ANIM_DURATION, SKILL_ANIM_DELAY);
            } catch (error) {
                console.error("Error populating skills:", error);
                displaySectionError('.skills-list', 'Failed to load skills.');
            }
        };

        const populateExperience = (experienceData) => {
            const experienceList = document.querySelector('.experience-list');
            if (!experienceList) return;

            try {
                if (!Array.isArray(experienceData)) {
                    throw new Error("Experience data is not an array.");
                }
                const loadingIndicator = experienceList.querySelector('.loading-indicator');
                if (loadingIndicator) loadingIndicator.remove();

                const experienceItems = [];
                experienceData.forEach(exp => {
                    const experienceItem = document.createElement('li');
                    experienceItem.classList.add('experience-item');
                    experienceItem.innerHTML = `
                        <h4>${exp.role || 'Role'} at ${exp.company || 'Company'}</h4>
                        <p class="duration">${exp.duration || ''}</p>
                        <p>${exp.description || ''}</p>
                    `;
                    experienceList.appendChild(experienceItem);
                    experienceItems.push(experienceItem);
                });
                applyStaggeredAnimation(experienceItems, ANIMATION_NAME, EXPERIENCE_ANIM_DURATION, EXPERIENCE_ANIM_DELAY);
            } catch (error) {
                console.error("Error populating experience:", error);
                displaySectionError('.experience-list', 'Failed to load experience.');
            }
        };

        // --- Main Execution ---
        populatePortfolio(data.portfolio);
        populateSkills(data.skills);
        populateExperience(data.experience);

    } catch (error) {
        // This catch block now primarily handles the initial fetch error
        console.error("Error fetching data.json:", error);
        // Display error messages in all dynamic sections if fetch fails
        displaySectionError('.portfolio-grid', 'Failed to load portfolio projects. Please try refreshing the page.');
        displaySectionError('.skills-list', 'Failed to load skills.');
        displaySectionError('.experience-list', 'Failed to load experience.');
    }

    // --- Footer Quote ---
    const quotes = [
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Innovation distinguishes between a leader and a follower. - Steve Jobs",
        "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
        "The best way to predict the future is to create it. - Peter Drucker",
        "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt"
    ];
    const displayRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        const footerQuoteElement = document.querySelector('#footer-quote');
        if (footerQuoteElement) {
            footerQuoteElement.textContent = quote;
        }
    };
    displayRandomQuote(); // Call the function

    // --- Smooth Scrolling ---
    const setupSmoothScrolling = () => {
        const navLinks = document.querySelectorAll('header nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    };
    setupSmoothScrolling(); // Call the function

    // --- Back to Top Button ---
    const setupBackToTopButton = () => {
        const backToTopButton = document.getElementById("back-to-top-btn");
        if (!backToTopButton) return; // Exit if button not found

        const scrollFunction = () => {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                backToTopButton.style.display = "block";
            } else {
                backToTopButton.style.display = "none";
            }
        };

        window.addEventListener('scroll', scrollFunction); // Use addEventListener

        backToTopButton.addEventListener('click', function() {
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
    };
    setupBackToTopButton(); // Call the function

    // --- Copyright Year ---
    const setCopyrightYear = () => {
        const copyrightYearSpan = document.getElementById('copyright-year');
        if (copyrightYearSpan) {
            copyrightYearSpan.textContent = new Date().getFullYear();
        }
    };
    setCopyrightYear(); // Call the function
});
