// ============================================
// Modern Portfolio Website - Interactive Features
// ============================================

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic'
  });

  // Initialize all features
  initThemeSystem();
  initPageTransitions();
  initScrollAnimations();
  initChatbot();
  initGameFeatures();
  initParticles();
  initCursorTrail();
  initProgressIndicator();
  initContactForm();
  initMobileMenu();
  initSkillBars();
});

// ============================================
// Theme System with Ruler Slider
// ============================================
function initThemeSystem() {
  const body = document.body;
  const themeSlider = document.querySelector('.theme-slider');
  const sliderTrack = document.querySelector('.slider-track');
  const themeThumb = document.getElementById('themeThumb');
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');
  
  // Detect system preference
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme') || (systemPrefersDark ? 'dark' : 'light');
  
  // Set initial theme
  setTheme(savedTheme);
  
  // Create ruler marks dynamically
  createRulerMarks();
  
  // Theme slider interaction
  let isDragging = false;
  let sliderRect;
  
  const updateSliderPosition = (x) => {
    if (!sliderRect) sliderRect = sliderTrack.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((x - sliderRect.left) / sliderRect.width) * 100));
    themeThumb.style.left = `${percentage}%`;
    
    // Determine theme based on position
    const theme = percentage < 50 ? 'light' : 'dark';
    setTheme(theme);
    localStorage.setItem('theme', theme);
  };
  
  themeThumb.addEventListener('mousedown', (e) => {
    isDragging = true;
    sliderRect = sliderTrack.getBoundingClientRect();
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      updateSliderPosition(e.clientX);
    }
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  // Click on track to jump
  sliderTrack.addEventListener('click', (e) => {
    if (e.target === themeThumb || e.target.closest('.slider-thumb')) return;
    updateSliderPosition(e.clientX);
  });
  
  // Touch support for mobile
  themeThumb.addEventListener('touchstart', (e) => {
    isDragging = true;
    sliderRect = sliderTrack.getBoundingClientRect();
    e.preventDefault();
  });
  
  document.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches[0]) {
      updateSliderPosition(e.touches[0].clientX);
    }
  });
  
  document.addEventListener('touchend', () => {
    isDragging = false;
  });
  
  function setTheme(theme) {
    body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    const percentage = theme === 'dark' ? 100 : 0;
    themeThumb.style.left = `${percentage}%`;
    
    // Update icons
    if (theme === 'dark') {
      sunIcon.style.opacity = '0';
      moonIcon.style.opacity = '1';
    } else {
      sunIcon.style.opacity = '1';
      moonIcon.style.opacity = '0';
    }
  }
  
  function createRulerMarks() {
    const rulerMarks = document.querySelector('.ruler-marks');
    if (!rulerMarks) return;
    
    for (let i = 0; i <= 100; i += 5) {
      const mark = document.createElement('div');
      mark.className = 'ruler-mark';
      if (i % 25 === 0) {
        mark.className += ' major-mark';
      }
      mark.style.left = `${i}%`;
      rulerMarks.appendChild(mark);
    }
  }
}

// ============================================
// Page Transitions (Slide/Fade Effects)
// ============================================
function initPageTransitions() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section-page');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        if (targetSection) {
          transitionToSection(targetSection, link);
        }
      }
    });
  });
  
  function transitionToSection(targetSection, clickedLink) {
    const currentSection = document.querySelector('.section-page.active') || document.querySelector('.section-page');
    const direction = getScrollDirection(currentSection, targetSection);
    
    // Add transition class
    currentSection.classList.add('transitioning-out', `slide-${direction}`);
    targetSection.classList.add('transitioning-in', `slide-${direction}`);
    
    // Remove active class
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    clickedLink.classList.add('active');
    
    setTimeout(() => {
      currentSection.classList.remove('active', 'transitioning-out', 'slide-left', 'slide-right', 'fade');
      targetSection.classList.add('active');
      targetSection.classList.remove('transitioning-in', 'slide-left', 'slide-right', 'fade');
      
      // Smooth scroll
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
  }
  
  function getScrollDirection(current, target) {
    const currentIndex = Array.from(sections).indexOf(current);
    const targetIndex = Array.from(sections).indexOf(target);
    
    if (currentIndex === -1 || targetIndex === -1) return 'fade';
    return targetIndex > currentIndex ? 'left' : 'right';
  }
  
  // Set initial active section
  window.addEventListener('scroll', updateActiveSection);
  updateActiveSection();
}

function updateActiveSection() {
  const sections = document.querySelectorAll('.section-page');
  const scrollPosition = window.scrollY + 200;
  
  sections.forEach((section, index) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${section.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

// ============================================
// Scroll Animations & Unveil Elements
// ============================================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100); // Stagger timing
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all cards and sections
  document.querySelectorAll('.card, .interest-card, .project-card, .skill-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ============================================
// Chatbot with Dynamic Content
// ============================================
function initChatbot() {
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbotWindow = document.getElementById('chatbotWindow');
  const chatbotClose = document.getElementById('chatbotClose');
  const chatbotBody = document.getElementById('chatbotBody');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotSend = document.getElementById('chatbotSend');
  const quickActions = document.querySelectorAll('.quick-action-btn');
  const chatbotContainer = document.getElementById('chatbotContainer');
  
  let isOpen = false;
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  
  // Toggle chatbot
  chatbotToggle.addEventListener('click', () => {
    isOpen = !isOpen;
    chatbotWindow.classList.toggle('open', isOpen);
    if (isOpen) {
      chatbotInput.focus();
    }
  });
  
  chatbotClose.addEventListener('click', () => {
    isOpen = false;
    chatbotWindow.classList.remove('open');
  });
  
  // Make chatbot draggable
  chatbotWindow.addEventListener('mousedown', (e) => {
    if (e.target.closest('.chatbot-header') && !e.target.closest('.chatbot-close')) {
      isDragging = true;
      dragOffset.x = e.clientX - chatbotWindow.getBoundingClientRect().left;
      dragOffset.y = e.clientY - chatbotWindow.getBoundingClientRect().top;
    }
  });
  
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const maxX = window.innerWidth - chatbotWindow.offsetWidth;
      const maxY = window.innerHeight - chatbotWindow.offsetHeight;
      let x = e.clientX - dragOffset.x;
      let y = e.clientY - dragOffset.y;
      
      x = Math.max(0, Math.min(x, maxX));
      y = Math.max(0, Math.min(y, maxY));
      
      chatbotWindow.style.left = `${x}px`;
      chatbotWindow.style.top = `${y}px`;
      chatbotWindow.style.right = 'auto';
      chatbotWindow.style.bottom = 'auto';
    }
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  // Quick action buttons
  quickActions.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      handleChatbotAction(action);
    });
  });
  
  // Send message
  chatbotSend.addEventListener('click', sendMessage);
  chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  function sendMessage() {
    const message = chatbotInput.value.trim();
    if (!message) return;
    
    addMessage(message, 'user');
    chatbotInput.value = '';
    
    // Simulate typing
    setTimeout(() => {
      const response = generateResponse(message);
      addMessage(response, 'bot');
    }, 500);
  }
  
  function handleChatbotAction(action) {
    let response = '';
    
    switch(action) {
      case 'contact':
        response = getContactInfo();
        break;
      case 'projects':
        response = getProjectsInfo();
        break;
      case 'advice':
        response = getAdvice();
        break;
      case 'hello':
        response = "Hello! 👋 Thanks for visiting my portfolio. I'm Respect, a passionate web developer. How can I help you today?";
        break;
      case 'job':
        openJobForm();
        response = "I'd love to hear about opportunities! I've opened a form for you. Please fill it out with the job details.";
        break;
    }
    
    if (response) {
      addMessage(response, 'bot');
    }
  }
  
  function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}-message`;
    
    if (type === 'bot') {
      messageDiv.innerHTML = `
        <div class="message-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
          <p>${text}</p>
        </div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="message-content">
          <p>${text}</p>
        </div>
      `;
    }
    
    chatbotBody.appendChild(messageDiv);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }
  
  function generateResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Extract information from website content
    if (lowerMessage.includes('name') || lowerMessage.includes('who')) {
      return "My name is Respect! I'm a passionate web developer specializing in creating modern and responsive web experiences.";
    }
    
    if (lowerMessage.includes('email') || lowerMessage.includes('contact')) {
      return getContactInfo();
    }
    
    if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
      return getProjectsInfo();
    }
    
    if (lowerMessage.includes('skill') || lowerMessage.includes('technology')) {
      return "I specialize in HTML, CSS, JavaScript, and Content Management Systems. Check out my Skills section for more details!";
    }
    
    if (lowerMessage.includes('education') || lowerMessage.includes('school')) {
      return "I'm currently studying Electrical and Electronics Engineering at Kwara State University, Nigeria. I graduated from Government Secondary School, Kuje with full credit in WAEC.";
    }
    
    if (lowerMessage.includes('interest') || lowerMessage.includes('hobby')) {
      return "I'm passionate about Web Development, Artificial Intelligence, Emerging Technologies, Data Analysis, and Problem Solving!";
    }
    
    // Default response
    return "That's interesting! Could you tell me more? You can also use the quick action buttons for specific information.";
  }
  
  function getContactInfo() {
    return `📧 Email: mabiodun611@gmail.com\n📱 Phone: +234-810-414-7196\n💻 GitHub: https://github.com/RespectAi\n🔗 LinkedIn: https://www.linkedin.com/in/moses-abiodun-141877390/\n\nFeel free to reach out anytime!`;
  }
  
  function getProjectsInfo() {
    return `Here are my projects:\n\n1. **Remittance App** - Helps make remittance calculations easy\n   🔗 https://grand-figolla-b1a8ae.netlify.app/\n\n2. **WasteLess App** - Mobile app to track fridge items and get expiry reminders\n   🔗 Pitch Deck: https://wasteless-smart-househol-52lytur.gamma.site/\n   💻 GitHub: https://github.com/RespectAi/Final-Project-\n\n3. **Responsive Portfolio** - This portfolio website!\n   🔗 https://respectai.github.io/\n\nCheck out the Projects section for more details!`;
  }
  
  function getAdvice() {
    const adviceTypes = {
      career: "💼 **Career Advice**: Always keep learning new technologies, build a strong portfolio, network with other developers, contribute to open source, and never stop practicing!",
      technical: "💻 **Technical Advice**: Start with the fundamentals, build projects to apply knowledge, read documentation regularly, join developer communities, and don't be afraid to ask questions.",
      general: "🌟 **General Advice**: Stay curious, embrace challenges as learning opportunities, maintain a work-life balance, and remember that every expert was once a beginner. Keep pushing forward!"
    };
    
    const randomAdvice = Object.values(adviceTypes)[Math.floor(Math.random() * Object.values(adviceTypes).length)];
    return `${randomAdvice}\n\nWould you like advice on career, technical, or general topics? Just ask!`;
  }
  
  function openJobForm() {
    // Create and show job offer form modal
    const modal = document.createElement('div');
    modal.className = 'job-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Job Opportunity</h3>
          <button class="modal-close">&times;</button>
        </div>
        <form id="jobForm" class="job-form">
          <div class="form-group">
            <label for="jobCompany">Company Name</label>
            <input type="text" id="jobCompany" required>
          </div>
          <div class="form-group">
            <label for="jobPosition">Position</label>
            <input type="text" id="jobPosition" required>
          </div>
          <div class="form-group">
            <label for="jobEmail">Your Email</label>
            <input type="email" id="jobEmail" required>
          </div>
          <div class="form-group">
            <label for="jobDetails">Job Details</label>
            <textarea id="jobDetails" rows="5" required></textarea>
          </div>
          <button type="submit" class="btn">Send via Email</button>
        </form>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    modal.querySelector('#jobForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const company = document.getElementById('jobCompany').value;
      const position = document.getElementById('jobPosition').value;
      const email = document.getElementById('jobEmail').value;
      const details = document.getElementById('jobDetails').value;
      
      const subject = encodeURIComponent(`Job Opportunity: ${position} at ${company}`);
      const body = encodeURIComponent(`Hello Respect,\n\nI'm reaching out regarding a job opportunity:\n\nCompany: ${company}\nPosition: ${position}\n\nDetails:\n${details}\n\nBest regards,\n${email}`);
      
      window.location.href = `mailto:mabiodun611@gmail.com?subject=${subject}&body=${body}`;
      modal.remove();
    });
  }
}

// ============================================
// Game-like Features
// ============================================
function initGameFeatures() {
  // Achievement system
  const achievements = {
    visitor: { name: 'Welcome!', icon: '👋', earned: true },
    scroller: { name: 'Explorer', icon: '🔍', earned: false },
    projects: { name: 'Project Viewer', icon: '📁', earned: false },
    contact: { name: 'Networker', icon: '🤝', earned: false },
    chatbot: { name: 'Chatter', icon: '💬', earned: false }
  };
  
  // Track scroll depth
  let maxScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    maxScroll = Math.max(maxScroll, scrollPercent);
    
    if (maxScroll > 50 && !achievements.scroller.earned) {
      showAchievement('scroller');
      achievements.scroller.earned = true;
    }
  });
  
  // Track project views
  document.querySelectorAll('.project-card').forEach(card => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !achievements.projects.earned) {
          showAchievement('projects');
          achievements.projects.earned = true;
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });
    observer.observe(card);
  });
  
  // Track contact section
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !achievements.contact.earned) {
          showAchievement('contact');
          achievements.contact.earned = true;
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });
    observer.observe(contactSection);
  }
  
  // Track chatbot usage
  const chatbotToggle = document.getElementById('chatbotToggle');
  if (chatbotToggle) {
    chatbotToggle.addEventListener('click', () => {
      if (!achievements.chatbot.earned) {
        showAchievement('chatbot');
        achievements.chatbot.earned = true;
      }
    });
  }
  
  function showAchievement(key) {
    const achievement = achievements[key];
    const badge = document.getElementById('achievementBadge');
    const text = badge.querySelector('.achievement-text');
    
    text.textContent = `${achievement.icon} ${achievement.name}`;
    badge.classList.add('show');
    
    setTimeout(() => {
      badge.classList.remove('show');
    }, 3000);
  }
  
  // Show welcome achievement on load
  setTimeout(() => showAchievement('visitor'), 1000);
}

// ============================================
// Particle Background
// ============================================
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const particleCount = 50;
  
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }
    
    draw() {
      ctx.fillStyle = `rgba(67, 97, 238, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    // Connect nearby particles
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          ctx.strokeStyle = `rgba(67, 97, 238, ${0.2 * (1 - distance / 120)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ============================================
// Cursor Trail Effect
// ============================================
function initCursorTrail() {
  const trail = document.querySelector('.cursor-trail');
  if (!trail) return;
  
  let trailElements = [];
  const trailLength = 10;
  
  for (let i = 0; i < trailLength; i++) {
    const element = document.createElement('div');
    element.className = 'trail-dot';
    element.style.opacity = (trailLength - i) / trailLength * 0.3;
    trail.appendChild(element);
    trailElements.push(element);
  }
  
  let mouseX = 0, mouseY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function animateTrail() {
    let x = mouseX;
    let y = mouseY;
    
    trailElements.forEach((dot, index) => {
      const nextDot = trailElements[index - 1] || { offsetLeft: x, offsetTop: y };
      const dx = nextDot.offsetLeft - x;
      const dy = nextDot.offsetTop - y;
      
      x += dx * 0.3;
      y += dy * 0.3;
      
      dot.style.left = x + 'px';
      dot.style.top = y + 'px';
    });
    
    requestAnimationFrame(animateTrail);
  }
  
  animateTrail();
}

// ============================================
// Progress Indicator
// ============================================
function initProgressIndicator() {
  const indicator = document.querySelector('.progress-indicator');
  if (!indicator) return;
  
  window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    indicator.style.width = `${scrollPercent}%`;
  });
}

// ============================================
// Contact Form Handler
// ============================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value
    };
    
    // Create mailto link
    const subject = encodeURIComponent(formData.subject);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
    
    window.location.href = `mailto:mabiodun611@gmail.com?subject=${subject}&body=${body}`;
    
    // Show success message
    showNotification('Message ready to send! Your email client will open.', 'success');
    form.reset();
  });
}

// ============================================
// Mobile Menu
// ============================================
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }
}

// ============================================
// Animated Skill Bars
// ============================================
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const progress = progressBar.getAttribute('data-progress');
        progressBar.style.width = `${progress}%`;
        observer.unobserve(progressBar);
      }
    });
  }, { threshold: 0.5 });
  
  skillBars.forEach(bar => observer.observe(bar));
}

// ============================================
// Notification System
// ============================================
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ============================================
// Smooth Scroll to Top
// ============================================
document.getElementById('scrollTop')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
  const scrollTop = document.getElementById('scrollTop');
  if (scrollTop) {
    scrollTop.style.opacity = window.scrollY > 300 ? '1' : '0';
  }
});

