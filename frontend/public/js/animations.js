// Global Animation Setup
// =====================

// Staggered Card Reveal with Intersection Observer
function initCardReveals() {
  const cards = document.querySelectorAll('.card-reveal, .plan-card, .card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  cards.forEach((card) => {
    if (!card.classList.contains('show')) {
      card.classList.add('card-reveal');
      observer.observe(card);
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initCardReveals);

// Re-initialize on dynamic content load
const observer = new MutationObserver(() => {
  initCardReveals();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
