document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const resBox = document.getElementById("results");
  const input = document.getElementById("queryInput");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = input.value.trim();

    if (!query) {
      resBox.innerHTML = `<p>Please enter a drug name to search.</p>`;
      return;
    }

    resBox.innerHTML = `<p>Searching for "${query}"...</p>`;

    try {
      const response = await fetch(
        `http://localhost:80/api/drug?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        resBox.innerHTML = `<p>No results found for "${query}".</p>`;
        return;
      }

      resBox.innerHTML = data
        .map(
          (drug) => `
        <div class="card">
          <h2>💊 ${drug.brand_name} <small>(${drug.generic_name})</small></h2>

          <div class="section">
            <h3>🎯 Purpose</h3>
            <p>${drug.purpose || "—"}</p>
          </div>

          <div class="section">
            <h3>📏 Dosage</h3>
            <p>${drug.dosage || "—"}</p>
          </div>

          <div class="section">
            <h3>⚠️ Warnings</h3>
            ${formatAsList(drug.warnings)}
          </div>

          <div class="section">
            <h3>😣 Side Effects</h3>
            ${formatAsList(drug.side_effects)}
          </div>
        </div>
      `
        )
        .join("");
    } catch (error) {
      console.error("Fetch error:", error);
      resBox.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
    }
  });

  function formatAsList(input) {
    if (!input) return "<p>—</p>";

    let items = [];

    if (Array.isArray(input)) {
      items = input;
    }

    if (typeof input === "string") {
      items = input
        .split(" • ")
        .map((i) => i.trim())
        .filter(Boolean);
    }

    if (items.length === 0) return "<p>—</p>";

    return `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
  }
});
