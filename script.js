document.addEventListener("DOMContentLoaded", () => {
    const timeline = document.getElementById("timeline");
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-desc");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.getElementById("modal-close");

    fetch("events.json")
        .then(res => res.json())
        .then(events => {
            events.forEach(ev => {
                const marker = document.createElement("div");
                marker.className = "event-marker";
                marker.textContent = ev.year;

                marker.addEventListener("click", () => {
                    modalTitle.textContent = ev.title;
                    modalDesc.textContent = ev.description;
                    modalImg.src = ev.imageURL;
                    modal.style.display = "block";
                });

                timeline.appendChild(marker);
            });
        })
        .catch(err => console.error("Error loading events:", err));

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", e => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});
