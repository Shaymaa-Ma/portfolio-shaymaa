// ==========================================================================
// Preloader
// ==========================================================================
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  setTimeout(() => {
    preloader.classList.add("hidden");
  }, 500);
});

// ==========================================================================
// AOS init
// ==========================================================================
if (window.AOS) {
  AOS.init({
    duration: 800,
    easing: "ease-out-cubic",
    once: true,
    offset: 60,
  });
}

// ==========================================================================
// Sticky nav background on scroll
// ==========================================================================
const header = document.getElementById("site-header");
const onScroll = () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ==========================================================================
// Mobile nav toggle
// ==========================================================================
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  hamburger.classList.toggle("open", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});

// ==========================================================================
// Scroll-spy: highlight active nav link
// ==========================================================================
const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll(".nav-link");

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navItems.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  },
  { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
);
sections.forEach((section) => spyObserver.observe(section));

// ==========================================================================
// Hero monogram entrance (GSAP)
// ==========================================================================
if (window.gsap) {
  const tl = gsap.timeline({ delay: 0.6 });

  tl.from(".hero-title-line", { y: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" })
    .from(".hero-role, .hero-desc", { y: 20, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" }, "-=0.5")
    .from(".hero-actions .btn", { y: 16, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }, "-=0.4")
    .from(".hero-meta, .social-row", { opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.3")
    .from(".mono-letter", { strokeDasharray: 1400, strokeDashoffset: 1400, duration: 1.8, ease: "power2.inOut" }, "-=1.2")
    .from(".mono-ring", { scale: 0.7, opacity: 0, duration: 1, ease: "power3.out" }, "-=1.6")
    .from(".float-chip", { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }, "-=0.8");
}

// ==========================================================================
// Contact form (Formspree) — inline confirmation, no page reload
// ==========================================================================
const contactForm = document.querySelector(".contact-form");
const formNote = document.getElementById("formNote");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector("button[type='submit']");
    const originalLabel = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = "<span>Sending…</span>";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        formNote.textContent = "Thanks — your message is on its way. I'll reply soon.";
        contactForm.reset();
      } else {
        formNote.textContent = "Something went wrong. Please email me directly instead.";
      }
    } catch (err) {
      formNote.textContent = "Something went wrong. Please email me directly instead.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalLabel;
    }
  });
}

// ==========================================================================
// Footer year
// ==========================================================================
document.getElementById("year").textContent = new Date().getFullYear();