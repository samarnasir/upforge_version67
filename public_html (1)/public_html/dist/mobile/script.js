// Always start at top on reload
window.onbeforeunload = function () { window.scrollTo(0, 0); };



// Mobile Menu Functionality
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuToggle.addEventListener('click', function() {
  mobileMenuToggle.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on a link
mobileMenu.addEventListener('click', function(e) {
  if (e.target.tagName === 'A') {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    
    mobileMenuToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
    
    // Smooth scroll to target section
    if (targetId.startsWith('#')) {
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        setTimeout(() => {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 300);
      }
    }
  }
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
  if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenuToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close mobile menu when scrolling
let scrollTimeout;
window.addEventListener('scroll', function() {
  if (mobileMenu.classList.contains('active')) {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      mobileMenuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }, 100);
  }
}); 

// Process steps scroll animation
const processSteps = document.querySelectorAll('.process-step');
const processObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { 
  threshold: 0.4,
  rootMargin: '0px 0px -40px 0px'
});

processSteps.forEach(step => processObserver.observe(step)); 

// Timeline scroll effect
function updateTimelineGradient() {
  const timeline = document.querySelector('.timeline-gradient-line');
  const circles = document.querySelectorAll('.timeline-circle');
  const boxes = document.querySelectorAll('.process-box');
  if (!timeline || circles.length === 0) return;

  // Calculate scroll progress (0 = first circle, 1 = last circle)
  let progress = 0;
  let lastActive = 0;
  const windowHeight = window.innerHeight;
  circles.forEach((circle, idx) => {
    const circleRect = circle.getBoundingClientRect();
    if (circleRect.top < windowHeight * 0.5) {
      lastActive = idx + 1;
    }
  });
  progress = lastActive / circles.length;

  // Smooth gradient: interpolate stops
  const grad = `linear-gradient(180deg, #3462FC 0%, #3462FC ${(progress * 100).toFixed(1)}%, #092D53 ${(progress * 100).toFixed(1)}%, #092D53 100%)`;
  timeline.style.background = grad;

  // Remove top/height setting so the line always fills the column
  // Center timeline line between first and last circle (removed for full height)
  // const offsetTop = firstCircle.offsetTop + firstCircle.offsetHeight / 2;
  // const offsetBottom = lastCircle.offsetTop + lastCircle.offsetHeight / 2;
  // timeline.style.top = offsetTop + 'px';
  // timeline.style.height = (offsetBottom - offsetTop) + 'px';

  // Update circle and box colors
  circles.forEach((circle, idx) => {
    if (idx < lastActive) {
      circle.classList.add('active');
      if (boxes[idx]) boxes[idx].classList.add('active');
    } else {
      circle.classList.remove('active');
      if (boxes[idx]) boxes[idx].classList.remove('active');
    }
  });
}

window.addEventListener('scroll', updateTimelineGradient);
window.addEventListener('resize', updateTimelineGradient);
setTimeout(updateTimelineGradient, 300); 

// Enhanced Lazy Loading Scroll Observer
const lazyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Add staggered animation delays for child elements
      const children = entry.target.querySelectorAll('.stagger-1, .stagger-2, .stagger-3, .stagger-4, .stagger-5');
      children.forEach(child => {
        child.classList.add('visible');
      });
    }
  });
}, { 
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

// Apply enhanced lazy loading to sections
document.addEventListener('DOMContentLoaded', function() {
  // Add animation classes to elements with staggered delays
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    // Add fade-in to section titles
    const titles = section.querySelectorAll('h1, h2');
    titles.forEach((title, titleIndex) => {
      title.classList.add('fade-in', `stagger-${titleIndex + 1}`);
      lazyObserver.observe(title);
    });

    // Add slide-in-left to left-aligned content
    const leftContent = section.querySelectorAll('.process-box.left, .whatwedo-card:nth-child(odd)');
    leftContent.forEach((item, itemIndex) => {
      item.classList.add('slide-in-left', `stagger-${itemIndex + 1}`);
      lazyObserver.observe(item);
    });

    // Add slide-in-right to right-aligned content
    const rightContent = section.querySelectorAll('.process-box.right, .whatwedo-card:nth-child(even)');
    rightContent.forEach((item, itemIndex) => {
      item.classList.add('slide-in-right', `stagger-${itemIndex + 1}`);
      lazyObserver.observe(item);
    });

    // Add scale-in to cards and team members, EXCEPT testimonial cards
    const cards = section.querySelectorAll('.wmic-card, .wwa-member, .hero-card');
    cards.forEach((card, cardIndex) => {
      card.classList.add('scale-in', `stagger-${cardIndex + 1}`);
      lazyObserver.observe(card);
    });

    // Add bounce-in to special elements
    const specialElements = section.querySelectorAll('.hero-btn, .cs-btn');
    specialElements.forEach((element, elementIndex) => {
      element.classList.add('bounce-in', `stagger-${elementIndex + 1}`);
      lazyObserver.observe(element);
    });

    // Add fade-in to descriptions and paragraphs
    const descriptions = section.querySelectorAll('p, .hero-subtitle, .hero-support');
    descriptions.forEach((desc, descIndex) => {
      desc.classList.add('fade-in', `stagger-${descIndex + 1}`);
      lazyObserver.observe(desc);
    });
  });

  // Special handling for hero section with enhanced timing
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    const heroElements = heroContent.children;
    Array.from(heroElements).forEach((element, index) => {
      element.classList.add('fade-in');
      element.style.animationDelay = `${0.3 + index * 0.2}s`;
      lazyObserver.observe(element);
    });
  }

  // --- TESTIMONIALS FADE-IN AS GROUP ---
  const testimonialsSection = document.querySelector('.testimonials-section');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  if (testimonialsSection && testimonialCards.length > 0) {
    const testimonialsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          testimonialCards.forEach(card => {
            card.classList.add('fade-in', 'visible');
            // Also fade in testimonial-content inside each card
            const content = card.querySelector('.testimonial-content');
            if (content) {
              content.classList.add('fade-in', 'visible');
            }
          });
          testimonialsObserver.disconnect();
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    testimonialsObserver.observe(testimonialsSection);
  }

  // --- MATCH TESTIMONIALS MARQUEE SPEED ON MOBILE TO DESKTOP ---
  const marqueeTrack = document.querySelector('.testimonials-marquee-track');
  if (marqueeTrack) {
    marqueeTrack.style.animationDuration = '40s';
  }

  // Simple fade for What We Do cards on mobile (show back for 5s, then auto-revert)
  if (window.innerWidth <= 768) {
    const whatWeDoCards = document.querySelectorAll('.whatwedo-card');
    whatWeDoCards.forEach(card => {
      let backTimeout;
      card.addEventListener('click', function(e) {
        if (card.classList.contains('placeholder')) return;
        card.classList.add('show-back');
        clearTimeout(backTimeout);
        backTimeout = setTimeout(() => {
          card.classList.remove('show-back');
        }, 5000);
      });
    });
  }
});

// Enhanced scroll effects
window.addEventListener('scroll', function() {
  // Parallax effect for hero gradient (disabled on mobile for performance)
  const heroGradient = document.querySelector('.hero-gradient-bg');
  if (heroGradient && window.innerWidth > 768) {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.3;
    heroGradient.style.transform = `translateY(${rate}px) rotate(${scrolled * 0.02}deg)`;
  }

  // Navbar scroll effect with enhanced styling
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 100) {
    navbar.style.background = 'rgba(237, 239, 244, 0.95)';
    navbar.style.backdropFilter = 'blur(25px)';
    navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
  } else {
    navbar.style.background = 'rgba(237, 239, 244, 0.8)';
    navbar.style.backdropFilter = 'blur(20px)';
    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
  }
});

// Mobile-specific optimizations
if (window.innerWidth <= 768) {
  // Disable hover effects on mobile
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      .whatwedo-card:hover .card-inner,
      .wmic-card:hover,
      .wwa-member:hover,
      .process-box:hover .step-box,
      .hero-card:hover,
      .navbar-links a:hover::before {
        transform: none !important;
        box-shadow: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}

// --- REMOVE FLIP LOGIC FOR MOBILE ---
if (window.innerWidth <= 768) {
  // Remove any inline transform or transition from previous logic
  document.querySelectorAll('.whatwedo-card').forEach(card => {
    card.style.transform = '';
    card.style.transition = '';
  });
}

// Enhanced team member hover effects
document.querySelectorAll('.wwa-member').forEach(member => {
  member.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-8px) scale(1.03)';
    this.style.boxShadow = '0 15px 35px rgba(46, 102, 252, 0.15)';
  });
  
  member.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
    this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
  });
});

// Smooth scroll for navigation links with enhanced behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop - 80; // Account for fixed navbar
      if (window.innerWidth > 768) {
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      } else {
        window.scrollTo(0, offsetTop);
      }
    }
  });
}); 

if (window.innerWidth > 768) {
  // Custom scroll speed for the whole page except process section (desktop only)
  (function() {
    let isInProcessSection = false;
    const processSection = document.querySelector('.process-section');
    function isSectionInView() {
      if (!processSection) return false;
      const rect = processSection.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    }
    function onWheel(e) {
      if (isInProcessSection) {
        e.preventDefault();
        window.scrollBy({ top: e.deltaY * 0.3, behavior: 'auto' });
      } else {
        e.preventDefault();
        window.scrollBy({ top: e.deltaY * 0.5, behavior: 'auto' }); // Faster than process section
      }
    }
    function onTouchMove(e) {
      if (isInProcessSection) {
        e.preventDefault();
      }
    }
    function checkSection() {
      isInProcessSection = isSectionInView();
    }
    window.addEventListener('scroll', checkSection, { passive: true });
    window.addEventListener('resize', checkSection);
    if (processSection) {
      processSection.addEventListener('mouseenter', checkSection);
      processSection.addEventListener('mouseleave', checkSection);
    }
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
  })();
} 