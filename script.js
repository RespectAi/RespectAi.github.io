// ==========================================================================
// RESPECT PORTFOLIO 3.0 - CORE JAVASCRIPT
// Features:
// - Cursor Spotlight Glow (GPU-composited requestAnimationFrame)
// - IntersectionObserver Scroll-Spy for desktop indicator lines & top nav
// - Persistent Dark/Light Theme Switching
// - Mobile Drawer Navigation
// - Contact Form Validation & Instant WhatsApp Prefill
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initCursorSpotlight();
  initScrollSpy();
  initMobileMenu();
  initContactForm();
  initSmoothScroll();
  initVideoToggle();
});

// --------------------------------------------------------------------------
// 1. Theme Management (Dark / Light Mode)
// --------------------------------------------------------------------------
function initTheme() {
  const themeToggleBtn = document.getElementById("theme-toggle");
  const htmlRoot = document.documentElement;

  // Retrieve stored theme or system preference
  const savedTheme = localStorage.getItem("respect_theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme ? savedTheme : prefersDark ? "dark" : "light";

  setTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = htmlRoot.getAttribute("data-theme") || "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      setTheme(newTheme);
    });
  }

  function setTheme(theme) {
    htmlRoot.setAttribute("data-theme", theme);
    localStorage.setItem("respect_theme", theme);
  }
}

// --------------------------------------------------------------------------
// 2. Cursor Spotlight Glow (Brittany Chiang style)
// --------------------------------------------------------------------------
function initCursorSpotlight() {
  const spotlight = document.getElementById("cursor-spotlight");
  if (!spotlight) return;

  // Only enable on desktop pointer devices
  const isPointerFine = window.matchMedia("(pointer: fine)").matches;
  if (!isPointerFine) {
    spotlight.style.display = "none";
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 3;
  let rafId = null;

  window.addEventListener("pointermove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--cursor-x", `${mouseX}px`);
        document.documentElement.style.setProperty("--cursor-y", `${mouseY}px`);
        rafId = null;
      });
    }
  }, { passive: true });
}

// --------------------------------------------------------------------------
// 3. Scroll-Spy Navigation (Brittany Chiang & Cassidy Williams indicator lines)
// --------------------------------------------------------------------------
function initScrollSpy() {
  const sections = document.querySelectorAll("section[data-spy]");
  const spyLinks = document.querySelectorAll(".spy-link");
  const quickLinks = document.querySelectorAll(".quick-link");

  if (!sections.length) return;

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute("id");
        setActiveLink(activeId);
      }
    });
  }, observerOptions);

  sections.forEach((sec) => observer.observe(sec));

  function setActiveLink(id) {
    // Update left sidebar scroll-spy links
    spyLinks.forEach((link) => {
      const section = link.getAttribute("data-section");
      if (section === id) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Update top nav links
    quickLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${id}`) {
        link.style.color = "var(--text-primary)";
      } else {
        link.style.color = "";
      }
    });
  }
}

// --------------------------------------------------------------------------
// 4. Mobile Menu Drawer
// --------------------------------------------------------------------------
function initMobileMenu() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const drawer = document.getElementById("mobile-drawer");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener("click", () => {
    const isOpen = drawer.classList.toggle("open");
    toggleBtn.classList.toggle("active", isOpen);
    toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      drawer.classList.remove("open");
      toggleBtn.classList.remove("active");
      toggleBtn.setAttribute("aria-expanded", "false");
    });
  });
}

// --------------------------------------------------------------------------
// 5. Smooth In-Page Anchor Navigation
// --------------------------------------------------------------------------
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const topNavHeight = 65;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - topNavHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });

        // Update URL hash smoothly without jump
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });
}

// --------------------------------------------------------------------------
// 6. Contact Form Validation & Instant WhatsApp Prefill
// --------------------------------------------------------------------------
function initContactForm() {
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");
  const submitBtn = document.getElementById("btn-submit");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const projectType = form.projectType.value;
    const message = form.message.value.trim();

    let isValid = true;

    // Validate Name
    if (!name) {
      showError("name-error", "Please enter your name.");
      isValid = false;
    } else {
      clearError("name-error");
    }

    // Validate Email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("email-error", "Please enter a valid email address.");
      isValid = false;
    } else {
      clearError("email-error");
    }

    // Validate Message
    if (!message || message.length < 10) {
      showError("message-error", "Message must be at least 10 characters long.");
      isValid = false;
    } else {
      clearError("message-error");
    }

    if (!isValid) return;

    // Provide immediate interactive confirmation + direct WhatsApp option
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Sent!</span> <i class="fas fa-check"></i>`;

      // Build WhatsApp message with user input
      const waEncoded = encodeURIComponent(
        `Hello Respect! My name is ${name} (${email}). Project Inquiry: [${projectType}].\n\nMessage: ${message}`
      );
      const waUrl = `https://wa.me/2348104147196?text=${waEncoded}`;

      if (statusEl) {
        statusEl.className = "form-status success";
        statusEl.innerHTML = `
          <p>✓ Thank you, ${name}! Your inquiry has been prepared.</p>
          <p style="margin-top: 0.5rem;">
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-whatsapp); font-weight: 700; text-decoration: underline;">
              <i class="fab fa-whatsapp"></i> Click here to forward directly to my WhatsApp for immediate response!
            </a>
          </p>
        `;
      }

      form.reset();
    }, 600);
  });

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }

  function clearError(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  }
}

// --------------------------------------------------------------------------
// 7. Video Walkthrough Accordion Toggle
// --------------------------------------------------------------------------
function initVideoToggle() {
  const toggleBtn = document.getElementById("toggle-video-btn");
  const collapseBox = document.getElementById("video-collapse");

  if (!toggleBtn || !collapseBox) return;

  toggleBtn.addEventListener("click", () => {
    const isOpen = collapseBox.classList.toggle("open");
    toggleBtn.classList.toggle("open", isOpen);
    toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");

    const videoEl = collapseBox.querySelector("video");
    if (!isOpen && videoEl) {
      videoEl.pause();
    }
  });
}

