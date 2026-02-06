// Slideshow Hero Section
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    currentSlide = (n + totalSlides) % totalSlides;
    slides[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

// Auto-advance slideshow every 4 seconds
setInterval(nextSlide, 4000);

// Testimonials Carousel
let currentTestimonialIndex = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
const totalTestimonials = testimonialCards.length;

function showTestimonial(n) {
    // Remove active class from all cards and dots
    testimonialCards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Handle wraparound
    currentTestimonialIndex = (n + totalTestimonials) % totalTestimonials;

    // Add active class to current card and dot
    testimonialCards[currentTestimonialIndex].classList.add('active');
    dots[currentTestimonialIndex].classList.add('active');
}

function moveTestimonial(direction) {
    showTestimonial(currentTestimonialIndex + direction);
}

function currentTestimonial(n) {
    showTestimonial(n);
}

// Auto-advance testimonials every 6 seconds
setInterval(() => {
    moveTestimonial(1);
}, 6000);