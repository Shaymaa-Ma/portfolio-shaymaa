// ==========================================================================
// Preloader
// ==========================================================================
const preloader = document.getElementById("preloader");
const hidePreloader = () => preloader && preloader.classList.add("hidden");
window.addEventListener("load", () => setTimeout(hidePreloader, 500));
setTimeout(hidePreloader, 2500); // safety net if an image or font stalls

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
// Projects: filter tabs + swipeable row on mobile (has a real start and end)
// ==========================================================================
(function projectsSection() {
  const grid = document.querySelector(".projects-grid");
  if (!grid) return;

  const FILTERS = [
    { key: "all", label: "All" },
    { key: "fullstack", label: "Full-Stack" },
    { key: "client", label: "Client Work" },
    { key: "frontend", label: "Frontend" },
    { key: "ui", label: "UI/UX" },
  ];
  // match = text found in the project title
  const CATEGORIES = [
    { match: "AUTO MOTORS", tags: ["fullstack", "client"] },
    { match: "AI Career Coach", tags: ["fullstack"] },
    { match: "Constructify", tags: ["fullstack"] },
    { match: "LIWAN", tags: ["fullstack"] },
    { match: "Alibaba", tags: ["frontend"] },
    { match: "InnerGlow", tags: ["fullstack"] },
    { match: "BloomsHug", tags: ["frontend"] },
    { match: "Planora", tags: ["ui"] },
  ];

  const cards = Array.from(grid.querySelectorAll(".project-card"));
  cards.forEach((card) => {
    // scroll-reveal would leave cards invisible after filtering, so drop it here
    card.removeAttribute("data-aos");
    card.removeAttribute("data-aos-delay");
    card.classList.remove("aos-init", "aos-animate");
    const title = card.querySelector("h3").textContent;
    const hit = CATEGORIES.find((c) => title.includes(c.match));
    card.dataset.category = hit ? hit.tags.join(" ") : "";
  });

  const bar = document.createElement("div");
  bar.className = "project-filters";
  bar.setAttribute("role", "group");
  bar.setAttribute("aria-label", "Filter projects");

  const applyFilter = (key) => {
    cards.forEach((card) => {
      const show = key === "all" || card.dataset.category.split(" ").includes(key);
      card.classList.toggle("is-hidden", !show);
    });
    bar.querySelectorAll("button").forEach((b) => {
      const on = b.dataset.filter === key;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    grid.scrollLeft = 0;
    grid.classList.remove("is-switching");
    void grid.offsetWidth; // restart the fade animation
    grid.classList.add("is-switching");
  };

  FILTERS.forEach((f) => {
    const count = f.key === "all" ? cards.length : cards.filter((c) => c.dataset.category.split(" ").includes(f.key)).length;
    if (!count) return; // skip empty categories
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter-btn" + (f.key === "all" ? " active" : "");
    btn.dataset.filter = f.key;
    btn.setAttribute("aria-pressed", String(f.key === "all"));
    btn.innerHTML = `${f.label}<span class="filter-count">${count}</span>`;
    btn.addEventListener("click", () => applyFilter(f.key));
    bar.appendChild(btn);
  });
  grid.parentNode.insertBefore(bar, grid);
})();

// ==========================================================================
// Skills (mobile): pagination dots for the swipeable row
// ==========================================================================
(function skillsDots() {
  const grid = document.querySelector(".skills-grid");
  if (!grid) return;
  const items = Array.from(grid.querySelectorAll(".skill-card"));
  const dots = document.createElement("div");
  dots.className = "skills-dots";
  items.forEach((item, i) => {
    const d = document.createElement("button");
    d.type = "button";
    d.setAttribute("aria-label", `Go to skill group ${i + 1}`);
    d.addEventListener("click", () => grid.scrollTo({ left: item.offsetLeft - grid.offsetLeft - 20, behavior: "smooth" }));
    dots.appendChild(d);
  });
  grid.parentNode.insertBefore(dots, grid.nextSibling);

  const update = () => {
    const max = grid.scrollWidth - grid.clientWidth;
    let idx = 0;
    if (grid.scrollLeft >= max - 4) idx = items.length - 1;
    else {
      let best = Infinity;
      items.forEach((item, i) => {
        const dist = Math.abs(item.offsetLeft - grid.offsetLeft - 20 - grid.scrollLeft);
        if (dist < best) { best = dist; idx = i; }
      });
    }
    Array.from(dots.children).forEach((d, i) => d.classList.toggle("active", i === idx));
  };
  grid.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
})();

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