const quickHelpButton = document.querySelector("[data-scroll-target]");
const quickHelpBar = document.querySelector(".quick-help-bar");
const contactForm = document.querySelector("#contactForm");
const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const interestMap = {
  "Home value estimate": "Free home valuation",
};

function prefillContactForm() {
  if (!quickHelpBar || !contactForm) {
    return;
  }

  const quickData = new FormData(quickHelpBar);
  const interest = quickData.get("quickInterest") || "";
  const timeline = quickData.get("quickTimeline") || "";
  const location = quickData.get("quickLocation") || "";
  const cleanLocation = location === "Your City or Area" ? "" : location;
  const interestField = contactForm.elements.interest;
  const messageField = contactForm.elements.message;
  const timelineField = contactForm.elements.quick_timeline;
  const locationField = contactForm.elements.quick_location;
  const mappedInterest = interestMap[interest] || interest;

  if (mappedInterest && interestField) {
    interestField.value = mappedInterest;
  }

  if (timelineField) {
    timelineField.value = timeline;
  }

  if (locationField) {
    locationField.value = cleanLocation;
  }

  if (messageField) {
    const details = [
      interest ? `I need help with: ${interest}` : "",
      timeline ? `Timeline: ${timeline}` : "",
      cleanLocation ? `Location: ${cleanLocation}` : "",
    ].filter(Boolean);

    messageField.value = `${details.join("\n")}\n\n`;
    messageField.focus({ preventScroll: true });
  }
}

if (quickHelpButton) {
  quickHelpButton.addEventListener("click", () => {
    const target = document.querySelector(quickHelpButton.dataset.scrollTarget);

    prefillContactForm();

    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

if (quickHelpBar) {
  quickHelpBar.addEventListener("submit", (event) => {
    event.preventDefault();
    prefillContactForm();
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function setActiveNavLink(sectionId) {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${sectionId}`);
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const sectionId = link.getAttribute("href")?.slice(1);

    if (sectionId) {
      setActiveNavLink(sectionId);
    }
  });
});

if ("IntersectionObserver" in window && navSections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const activeEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

      if (activeEntry) {
        setActiveNavLink(activeEntry.target.id);
      }
    },
    {
      rootMargin: "-28% 0px -55% 0px",
      threshold: [0.12, 0.28, 0.45, 0.65],
    }
  );

  navSections.forEach((section) => sectionObserver.observe(section));
}
