// =====================================
// CONFIGURATION - À PERSONNALISER
// =====================================

// Configuration Email
const EMAIL_CONFIG = {
    destinataire: 'gillesngomkap@gmail.com',  // 🔧 Remplacer par votre email
    sujet: 'Nouvelle demande de devis - BDT'
};

// Configuration WhatsApp
const WHATSAPP_CONFIG = {
    phoneNumber: '237689665893'
};

// =====================================
// GESTION DU FORMULAIRE
// =====================================

document.addEventListener('DOMContentLoaded', function() {
    const devisForm = document.getElementById('devisForm');
    const devisMessage = document.getElementById('devisMessage');

    if (devisForm) {
        devisForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const formData = {
                // Informations personnelles
                nom: document.getElementById('nom').value.trim(),
                entreprise: document.getElementById('entreprise').value.trim() || 'Non spécifié',
                email: document.getElementById('email').value.trim(),
                telephone: document.getElementById('telephone').value.trim(),
                ville: document.getElementById('ville').value.trim(),
                
                // Services sélectionnés
                services: getSelectedServices(),
                
                // Détails du projet
                typeBatiment: document.getElementById('type-batiment').value,
                surface: document.getElementById('surface').value,
                budget: document.getElementById('budget').value,
                delai: document.getElementById('delai').value,
                description: document.getElementById('description').value.trim(),
                
                // Préférences de contact
                contactPreference: document.querySelector('input[name="contact-preference"]:checked').value,
                disponibilite: document.getElementById('disponibilite').value.trim() || 'Non spécifié'
            };

            // Validate form
            if (!validateForm(formData)) {
                return;
            }

            // Déterminer la méthode d'envoi selon la préférence de contact
            if (formData.contactPreference === 'whatsapp') {
                sendByWhatsApp(formData);
            } else {
                // Pour email et téléphone, on ouvre le client email
                sendByEmail(formData);
            }
        });
    }

    // =====================================
    // FONCTIONS UTILITAIRES
    // =====================================

    function getSelectedServices() {
        const checkboxes = document.querySelectorAll('input[name="services"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    function validateForm(data) {
        // Check required fields
        if (!data.nom || !data.email || !data.telephone || !data.ville || !data.description) {
            showMessage('⚠️ Veuillez remplir tous les champs obligatoires.', 'error');
            return false;
        }

        // Check at least one service selected
        if (data.services.length === 0) {
            showMessage('⚠️ Veuillez sélectionner au moins un service.', 'error');
            return false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showMessage('⚠️ Veuillez entrer une adresse e-mail valide.', 'error');
            return false;
        }

        return true;
    }

    // =====================================
    // ENVOI PAR EMAIL (mailto:)
    // =====================================

    function sendByEmail(formData) {
        try {
            const emailBody = formatEmailBody(formData);
            const subject = encodeURIComponent(EMAIL_CONFIG.sujet);
            const body = encodeURIComponent(emailBody);
            
            // Créer le lien mailto avec CC vers le client
            const mailtoLink = `mailto:${EMAIL_CONFIG.destinataire}?subject=${subject}&body=${body}&cc=${formData.email}`;
            
            // Ouvrir le client email
            window.location.href = mailtoLink;
            
            showMessage('✅ Votre client email va s\'ouvrir avec votre demande de devis pré-remplie. Cliquez sur "Envoyer" pour finaliser votre demande. Vous recevrez une copie de votre demande.', 'success');
            
            // Reset form après un délai
            setTimeout(() => {
                devisForm.reset();
            }, 2000);

        } catch (error) {
            console.error('Erreur lors de l\'ouverture du client email:', error);
            showMessage('❌ Erreur lors de l\'ouverture de votre client email. Veuillez nous contacter directement par téléphone au 671 84 41 63.', 'error');
        }
    }

    function formatEmailBody(data) {
        const servicesLabels = data.services.map(s => getServiceLabel(s)).join('\n   • ');
        
        return `DEMANDE DE DEVIS - BDT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INFORMATIONS CLIENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nom : ${data.nom}
Entreprise : ${data.entreprise}
Email : ${data.email}
Téléphone : ${data.telephone}
Ville : ${data.ville}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SERVICES DEMANDÉS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   • ${servicesLabels}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DÉTAILS DU PROJET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Type de bâtiment : ${getBatimentLabel(data.typeBatiment)}
Surface : ${data.surface}
Budget : ${getBudgetLabel(data.budget)}
Délai : ${getDelaiLabel(data.delai)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESCRIPTION DU PROJET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${data.description}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRÉFÉRENCES DE CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Méthode préférée : ${getContactLabel(data.contactPreference)}
Disponibilité : ${data.disponibilite}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ce message a été envoyé depuis le formulaire de demande de devis de BDT.`;
    }

    // =====================================
    // ENVOI PAR WHATSAPP
    // =====================================

    function sendByWhatsApp(formData) {
        try {
            const message = formatWhatsAppMessage(formData);
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMessage}`;

            // Ouvrir WhatsApp dans un nouvel onglet
            window.open(whatsappUrl, '_blank');

            showMessage('✅ WhatsApp va s\'ouvrir avec votre demande de devis pré-remplie. Cliquez sur "Envoyer" dans WhatsApp pour finaliser votre demande.', 'success');
            
            // Réinitialiser le formulaire après un délai
            setTimeout(() => {
                devisForm.reset();
            }, 2000);

        } catch (error) {
            console.error('Erreur lors de l\'ouverture de WhatsApp:', error);
            showMessage('❌ Erreur lors de l\'ouverture de WhatsApp. Veuillez vérifier que WhatsApp est installé sur votre appareil.', 'error');
        }
    }

    function formatWhatsAppMessage(data) {
        const servicesLabels = data.services.map(s => getServiceLabel(s)).join('\n   • ');
        
        return `🔷 *DEMANDE DE DEVIS - BDT*

━━━━━━━━━━━━━━━━━━━━━━
👤 *INFORMATIONS CLIENT*
━━━━━━━━━━━━━━━━━━━━━━

*Nom :* ${data.nom}
*Entreprise :* ${data.entreprise}
*Email :* ${data.email}
*Téléphone :* ${data.telephone}
*Ville :* ${data.ville}

━━━━━━━━━━━━━━━━━━━━━━
💼 *SERVICES DEMANDÉS*
━━━━━━━━━━━━━━━━━━━━━━

   • ${servicesLabels}

━━━━━━━━━━━━━━━━━━━━━━
📋 *DÉTAILS DU PROJET*
━━━━━━━━━━━━━━━━━━━━━━

*Type de bâtiment :* ${getBatimentLabel(data.typeBatiment)}
*Surface :* ${data.surface}
*Budget :* ${getBudgetLabel(data.budget)}
*Délai :* ${getDelaiLabel(data.delai)}

━━━━━━━━━━━━━━━━━━━━━━
📝 *DESCRIPTION*
━━━━━━━━━━━━━━━━━━━━━━

${data.description}

━━━━━━━━━━━━━━━━━━━━━━
📞 *PRÉFÉRENCES DE CONTACT*
━━━━━━━━━━━━━━━━━━━━━━

*Méthode préférée :* ${getContactLabel(data.contactPreference)}
*Disponibilité :* ${data.disponibilite}`;
    }

    // =====================================
    // FONCTIONS DE FORMATAGE DES LABELS
    // =====================================

    function getServiceLabel(value) {
        const services = {
            'videosurveillance': 'Vidéosurveillance',
            'maintenance-surveillance': 'Maintenance Surveillance',
            'installation-informatique': 'Installation Informatique',
            'maintenance-informatique': 'Maintenance Informatique',
            'cybersecurite': 'Cybersécurité',
            'cloud': 'Solutions Cloud',
            'reseau': 'Réseau & Infrastructure',
            'audit': 'Audit & Formation'
        };
        return services[value] || value;
    }

    function getBatimentLabel(value) {
        const batiments = {
            'maison': 'Maison individuelle',
            'appartement': 'Appartement',
            'bureau': 'Bureau / Local commercial',
            'entreprise': 'Entreprise / Usine',
            'immeuble': 'Immeuble résidentiel',
            'autre': 'Autre'
        };
        return batiments[value] || value;
    }

    function getBudgetLabel(value) {
        const budgets = {
            'moins-500k': 'Moins de 500 000 FCFA',
            '500k-1m': '500 000 - 1 000 000 FCFA',
            '1m-2m': '1 000 000 - 2 000 000 FCFA',
            '2m-5m': '2 000 000 - 5 000 000 FCFA',
            'plus-5m': 'Plus de 5 000 000 FCFA',
            'a-definir': 'À définir ensemble'
        };
        return budgets[value] || value;
    }

    function getDelaiLabel(value) {
        const delais = {
            'urgent': 'Urgent (moins d\'1 mois)',
            '1-3mois': '1 à 3 mois',
            '3-6mois': '3 à 6 mois',
            'flexible': 'Flexible'
        };
        return delais[value] || value;
    }

    function getContactLabel(value) {
        const contacts = {
            'email': 'Par e-mail',
            'telephone': 'Par téléphone',
            'whatsapp': 'Par WhatsApp'
        };
        return contacts[value] || value;
    }

    // =====================================
    // AFFICHAGE DES MESSAGES
    // =====================================

    function showMessage(text, type) {
        devisMessage.textContent = text;
        devisMessage.className = 'form-message ' + type;
        devisMessage.style.display = 'block';

        // Auto-hide success message after 10 seconds
        if (type === 'success') {
            setTimeout(() => {
                devisMessage.style.display = 'none';
            }, 10000);
        }

        // Scroll to message
        devisMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // =====================================
    // VALIDATIONS EN TEMPS RÉEL
    // =====================================

    // Real-time validation for email
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = '#e74c3c';
                showMessage('⚠️ Format d\'email invalide', 'error');
            } else {
                this.style.borderColor = '';
                if (devisMessage.textContent.includes('Format d\'email invalide')) {
                    devisMessage.style.display = 'none';
                }
            }
        });
    }

    // Phone number formatting
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

    // Character counter for description
    const descriptionTextarea = document.getElementById('description');
    if (descriptionTextarea) {
        const maxLength = 1000;
        const counter = document.createElement('div');
        counter.style.cssText = 'text-align: right; margin-top: 0.5rem; font-size: 0.85rem; color: #666;';
        counter.textContent = `0 / ${maxLength} caractères`;
        descriptionTextarea.parentElement.appendChild(counter);

        descriptionTextarea.addEventListener('input', function() {
            const length = this.value.length;
            counter.textContent = `${length} / ${maxLength} caractères`;
            
            if (length > maxLength) {
                counter.style.color = '#e74c3c';
                this.value = this.value.substring(0, maxLength);
            } else {
                counter.style.color = '#666';
            }
        });
    }

    // Smooth scroll to form sections on error
    const formGroups = document.querySelectorAll('.form-group input[required], .form-group textarea[required]');
    formGroups.forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            this.focus();
        });
    });
});
