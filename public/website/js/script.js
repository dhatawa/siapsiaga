// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add scroll effect to header
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 100) {
    header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
  } else {
    header.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
  }
});

// Animate elements on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document
  .querySelectorAll(".disaster-card, .edu-card, .cctv-card, .news-item-small")
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    observer.observe(el);
  });

// Weather data update simulation
function updateWeather() {
  const temp = document.querySelector(".temperature");
  const currentTemp = parseInt(temp.textContent);
  const newTemp = currentTemp + (Math.random() > 0.5 ? 1 : -1);
  temp.innerHTML = `${newTemp}<sup>Â°C</sup>`;
}

// Update weather every 5 minutes
setInterval(updateWeather, 300000);
