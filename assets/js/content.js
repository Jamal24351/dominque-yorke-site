async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null) el.textContent = value;
}

function monthShort(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleString("en-US", { month: "short" });
}

function dayNum(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.getDate();
}

(async function init() {
  try {
    const settings = await loadJSON("/content/settings.json");
    const events = await loadJSON("/content/events.json");
    const gallery = await loadJSON("/content/gallery.json");

    // Top brand
    setText("candidateNameBrand", settings.candidateName);
    setText("partyBrand", settings.party);

    // Hero
    setText("heroKicker", settings.heroKicker);
    setText("heroTitleLine1", settings.heroTitleLine1);
    setText("heroTitleLine2", settings.heroTitleLine2);
    setText("heroSubtitle", settings.heroSubtitle);

    // About
    setText("aboutHeading", settings.aboutHeading);
    setText("aboutP1", settings.aboutP1);
    setText("aboutP2", settings.aboutP2);
    setText("aboutP3", settings.aboutP3);
    setText("signatureName", settings.candidateName);

    // Contact
    setText("contactAddress", settings.contactAddress);
    setText("contactPhone", settings.contactPhone);
    setText("contactEmail", settings.contactEmail);

    // Events (render)
    const eventsWrap = document.getElementById("eventsList");
    if (eventsWrap) {
      eventsWrap.innerHTML = events.map(e => `
        <div class="event-item">
          <div class="event-date-box">
            <span class="day">${dayNum(e.date)}</span>
            <span class="month">${monthShort(e.date)}</span>
          </div>
          <div class="event-info">
            <div class="event-meta">
              <i class="fa-regular fa-clock"></i> ${e.time} &nbsp;|&nbsp;
              <i class="fa-solid fa-location-dot"></i> ${e.location}
            </div>
            <h3 class="event-title">${e.title}</h3>
            <p>${e.description}</p>
          </div>
        </div>
      `).join("");
    }

    // Gallery (render)
    const galleryWrap = document.getElementById("galleryList");
    if (galleryWrap) {
      galleryWrap.innerHTML = gallery.map(g => `
        <div class="masonry-item">
          <img src="${g.imageUrl}" alt="${g.caption || "Gallery"}">
          <div class="masonry-overlay"><h4>${g.caption || ""}</h4></div>
        </div>
      `).join("");
    }

  } catch (err) {
    console.error(err);
  }
})();