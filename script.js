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
        const EDUCATION_ANIM_DURATION = 0.5; // Added for Education
        const EDUCATION_ANIM_DELAY = 0.15; // Added for Education

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

        const populateEducation = (educationData) => {
            const educationList = document.querySelector('.education-list');
            if (!educationList) return;

            try {
                if (!Array.isArray(educationData)) {
                    throw new Error("Education data is not an array.");
                }
                const loadingIndicator = educationList.querySelector('.loading-indicator'); // Check for loading indicator if added
                if (loadingIndicator) loadingIndicator.remove();

                const educationItems = [];
                educationData.forEach(edu => {
                    const educationItem = document.createElement('li');
                    educationItem.classList.add('education-item'); // Add class for potential styling/animation
                    educationItem.innerHTML = `
                        <h4>${edu.degree || 'Degree'} in ${edu.major || 'Major'}</h4>
                        <p class="institution">${edu.institution || 'Institution'}</p>
                        <p class="duration">${edu.duration || ''}</p>
                        <p>${edu.details || ''}</p>
                    `;
                    educationList.appendChild(educationItem);
                    educationItems.push(educationItem);
                });
                applyStaggeredAnimation(educationItems, ANIMATION_NAME, EDUCATION_ANIM_DURATION, EDUCATION_ANIM_DELAY);
            } catch (error) {
                console.error("Error populating education:", error);
                displaySectionError('.education-list', 'Failed to load education details.');
            }
        };

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
                // Check if skillsData is an object (for categories)
                if (typeof skillsData !== 'object' || skillsData === null || Array.isArray(skillsData)) {
                    throw new Error("Skills data is not in the expected category format (object).");
                }
                const loadingIndicator = skillsList.querySelector('.loading-indicator');
                if (loadingIndicator) loadingIndicator.remove();

                skillsList.innerHTML = ''; // Clear existing content/loading indicator
                const allSkillItems = []; // Collect all skill items for animation

                for (const category in skillsData) {
                    if (skillsData.hasOwnProperty(category)) {
                        // Create category heading
                        const categoryHeading = document.createElement('h3');
                        categoryHeading.classList.add('skills-category-heading');
                        categoryHeading.textContent = category;
                        skillsList.appendChild(categoryHeading);

                        // Create container for skills in this category
                        const categorySkillsContainer = document.createElement('div');
                        categorySkillsContainer.classList.add('skills-category-container');
                        skillsList.appendChild(categorySkillsContainer);

                        const skillsInCategory = skillsData[category];
                        if (!Array.isArray(skillsInCategory)) {
                             console.warn(`Skills data for category "${category}" is not an array.`);
                             continue; // Skip this category if data is malformed
                        }

                        // Add skills to the container
                        skillsInCategory.forEach(skill => {
                            const skillItem = document.createElement('li');
                            skillItem.classList.add('skill-item', skill.class || '');
                            skillItem.textContent = skill.name || 'Unnamed Skill';
                            categorySkillsContainer.appendChild(skillItem);
                            allSkillItems.push(skillItem); // Add to the list for animation
                        });
                    }
                }
                // Apply animation to all collected skill items
                applyStaggeredAnimation(allSkillItems, ANIMATION_NAME, SKILL_ANIM_DURATION, SKILL_ANIM_DELAY);
            } catch (error) {
                console.error("Error populating skills:", error);
                skillsList.innerHTML = ''; // Clear list on error
                displaySectionError('#skills', 'Failed to load skills.'); // Display error within the section
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
        populateEducation(data.education); // Call the new function
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
        displaySectionError('.education-list', 'Failed to load education details.'); // Add error display for education
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
