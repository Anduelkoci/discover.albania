document.addEventListener("DOMContentLoaded", () => {
const images = document.querySelectorAll(
    ".city-images img, .city-pro-image img, .history-img"
  );
  const isAdmin = localStorage.getItem("adminLogged");

  if (isAdmin === "true") {
    enableEditing();
    showAdminLink();
  }

  function enableEditing() {
    document.querySelectorAll("[data-edit]").forEach(el => {
      el.contentEditable = true;
      el.style.outline = "2px dashed red";
    });
  }

  function showAdminLink() {
    const adminLink = document.getElementById("adminLink");
    if (adminLink) {
      adminLink.style.display = "inline-block";
    }
  }
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.shiftKey && e.key === "A") {
      window.location.href = "admin.html";
    }
  });
  let clicks = 0;
  const logo = document.querySelector(".logo");

  if (logo) {
    logo.addEventListener("click", () => {
      clicks++;
      if (clicks === 5) {
        window.location.href = "admin.html";
      }
    });
  }

});
  const container = document.getElementById("citiesContainer");
  if (container) {
  fetch("/api/cities")
    .then(res => res.json())
    .then(data => {
      data.forEach(city => {
        container.innerHTML += `
          <div class="city">
            <div class="city-images">
              <img src="${city.image}">
            </div>
            <h3 class="city-title">${city.name}</h3>
            <p class="city-text">${city.description}</p>
          </div>
        `;
      });
    })
    .catch(() => {
      console.log("No dynamic cities found.");
    });
}
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const nextBtn = document.getElementById("next");
  const prevBtn = document.getElementById("prev");

  const closeBtn = document.getElementById("close");

  if (!lightbox) return;

  let currentIndex = 0;
  let scale = 1;
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 6;

  let isDragging = false;
  let translateX = 0;
  let translateY = 0;
  let startX = 0;
  let startY = 0;

  function updateTransform() {
    lightboxImg.style.transform =
      `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  function resetTransform() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
  }

  images.forEach((img, index) => {
    img.addEventListener("click", () => {
      currentIndex = index;
      lightbox.style.display = "flex";
      lightboxImg.src = img.src;
      resetTransform();
    });
  });
  nextBtn?.addEventListener("click", e => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex].src;
    resetTransform();
  });

  prevBtn?.addEventListener("click", e => {
    e.stopPropagation();
    currentIndex =
      (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex].src;
    resetTransform();
  });
  closeBtn?.addEventListener("click", () => {
    lightbox.style.display = "none";
  });

  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
    }
  });

  document.addEventListener("keydown", e => {
    if (lightbox.style.display !== "flex") return;

    if (e.key === "ArrowRight") nextBtn?.click();
    if (e.key === "ArrowLeft") prevBtn?.click();
    if (e.key === "Escape") lightbox.style.display = "none";
  });
  lightboxImg.addEventListener("wheel", e => {
    e.preventDefault();

    scale += e.deltaY * -0.0015;
    scale = Math.min(Math.max(MIN_ZOOM, scale), MAX_ZOOM);

    updateTransform();
  });
  lightboxImg.addEventListener("dblclick", e => {
    e.stopPropagation();

    if (scale === 1) {
      scale = 2.5;
    } else {
      resetTransform();
      return;
    }

    updateTransform();
  });
  lightboxImg.addEventListener("mousedown", e => {
    if (scale <= 1) return;

    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;

    lightboxImg.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", e => {
    if (!isDragging) return;

    translateX = e.clientX - startX;
    translateY = e.clientY - startY;

    updateTransform();
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    lightboxImg.style.cursor = "grab";
  });

function enableEditing(){

  document.querySelectorAll("[data-edit]").forEach(el => {

    el.contentEditable = true;
    el.style.outline = "2px dashed red";

    el.addEventListener("input", () => {
      localStorage.setItem(el.id, el.innerHTML);
    });

    const saved = localStorage.getItem(el.id);
    if(saved){
      el.innerHTML = saved;
    }

  });

}

