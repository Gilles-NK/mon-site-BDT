// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const nom = document.getElementById('nom').value.trim();
            const email = document.getElementById('email').value.trim();
            const telephone = document.getElementById('telephone').value.trim();
            const sujet = document.getElementById('sujet').value;
            const message = document.getElementById('message').value.trim();

            // Validate form
            if (!nom || !email || !sujet || !message) {
                showMessage('Veuillez remplir tous les champs obligatoires.', 'error');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Veuillez entrer une adresse e-mail valide.', 'error');
                return;
            }

            // Simulate form submission (replace with actual backend call)
            submitForm({
                nom: nom,
                email: email,
                telephone: telephone,
                sujet: sujet,
                message: message
            });
        });
    }

    function submitForm(formData) {
        // Show loading state
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="btn-text">Envoi en cours...</span>';
        submitBtn.disabled = true;

        // Simulate API call (replace with actual backend endpoint)
        setTimeout(() => {
            // Success simulation
            showMessage('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Log form data (for demonstration - remove in production)
            console.log('Form submitted:', formData);

            /* 
            // Example of actual API call:
            fetch('https://votre-backend.com/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                showMessage('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.', 'success');
                contactForm.reset();
            })
            .catch(error => {
                showMessage('Une erreur est survenue. Veuillez réessayer.', 'error');
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
            */
        }, 1500);
    }

    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';

        // Auto-hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);

        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Real-time validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = '';
            }
        });
    }

    // Phone number formatting (optional)
    const phoneInput = document.getElementById('telephone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            // Format: +237 6XX XX XX XX
            if (value.length > 0) {
                if (!value.startsWith('237')) {
                    value = '237' + value;
                }
            }
            e.target.value = value ? '+' + value : '';
        });
    }
});