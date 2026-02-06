// FAQ Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Gestion de l'accordéon FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Option 1: Fermer tous les autres items (un seul ouvert à la fois)
            // Décommenter si vous voulez ce comportement
            // faqItems.forEach(otherItem => {
            //     if (otherItem !== item) {
            //         otherItem.classList.remove('active');
            //     }
            // });
            
            // Toggle l'item cliqué
            item.classList.toggle('active');
            
            // Animation smooth
            const answer = item.querySelector('.faq-answer');
            if (!isActive) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0px';
            }
        });
    });

    // Fonctionnalité de recherche
    const searchInput = document.getElementById('faqSearch');
    const faqCategories = document.querySelectorAll('.faq-category');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            let hasResults = false;

            // Si la recherche est vide, afficher tout
            if (searchTerm === '') {
                faqCategories.forEach(category => {
                    category.style.display = 'block';
                    const items = category.querySelectorAll('.faq-item');
                    items.forEach(item => {
                        item.style.display = 'block';
                    });
                });
                hideNoResultsMessage();
                return;
            }

            // Rechercher dans les questions et réponses
            faqCategories.forEach(category => {
                const items = category.querySelectorAll('.faq-item');
                let categoryHasResults = false;

                items.forEach(item => {
                    const question = item.querySelector('.faq-question span').textContent.toLowerCase();
                    const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
                    
                    if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                        item.style.display = 'block';
                        categoryHasResults = true;
                        hasResults = true;
                        
                        // Ouvrir automatiquement l'item s'il correspond
                        if (!item.classList.contains('active')) {
                            item.classList.add('active');
                            const answerDiv = item.querySelector('.faq-answer');
                            answerDiv.style.maxHeight = answerDiv.scrollHeight + 'px';
                        }
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('active');
                    }
                });

                // Afficher/cacher la catégorie selon les résultats
                category.style.display = categoryHasResults ? 'block' : 'none';
            });

            // Afficher ou cacher le message "Aucun résultat"
            if (hasResults) {
                hideNoResultsMessage();
            } else {
                showNoResultsMessage();
            }
        });
    }

    function showNoResultsMessage() {
        let noResultsDiv = document.querySelector('.no-results');
        
        if (!noResultsDiv) {
            noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results';
            noResultsDiv.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <h3>Aucun résultat trouvé</h3>
                <p>Essayez avec d'autres mots-clés ou <a href="contact.html">contactez-nous</a> directement</p>
            `;
            document.querySelector('.faq-container').appendChild(noResultsDiv);
        }
        
        noResultsDiv.classList.add('show');
    }

    function hideNoResultsMessage() {
        const noResultsDiv = document.querySelector('.no-results');
        if (noResultsDiv) {
            noResultsDiv.classList.remove('show');
        }
    }

    // Smooth scroll pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Animation au scroll (optionnel)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer les catégories pour l'animation
    faqCategories.forEach(category => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(30px)';
        category.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(category);
    });
});
