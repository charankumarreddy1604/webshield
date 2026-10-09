```javascript
const SECURITY_HEADERS = [
    {
        name: "Content-Security-Policy",
        description: "Helps protect against XSS and code injection.",
        advice: "Configure a Content-Security-Policy that permits only trusted resources."
    },
    {
        name: "X-Frame-Options",
        description: "Helps prevent clickjacking.",
        advice: "Set X-Frame-Options to DENY or SAMEORIGIN, or configure CSP frame-ancestors."
    },
    {
        name: "X-Content-Type-Options",
        description: "Helps prevent MIME-type sniffing.",
        advice: "Set X-Content-Type-Options: nosniff."
    },
    {
        name: "Strict-Transport-Security",
        description: "Enforces HTTPS in supporting browsers.",
        advice: "Configure HSTS after verifying HTTPS works correctly across your site."
    },
    {
        name: "Referrer-Policy",
        description: "Controls referrer information shared by browsers.",
        advice: "Choose a suitable Referrer-Policy, such as strict-origin-when-cross-origin."
    },
    {
        name: "Permissions-Policy",
        description: "Controls browser features and permissions.",
        advice: "Disable browser features your website does not need."
    }
];

const $ = id => document.getElementById(id);

function normalizeUrl(value) {
    value = value.trim();

    if (!value) {
        throw new Error("Please enter a website URL.");
    }

    if (!/^https?:\/\//i.test(value)) {
        value = "https://" + value;
    }

    let url;

    try {
        url = new URL(value);
    } catch {
        throw new Error("Invalid URL. Example: https://example.com");
    }

    if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("Only HTTP and HTTPS URLs are supported.");
    }

    return url;
}

function renderHeaders(results) {
    const list = $("headerList");
    list.replaceChildren();

    let passed = 0;
    let unknown = 0;

    SECURITY_HEADERS.forEach(header => {
        const status = results[header.name];

        if (status === true) passed++;
        if (status === null) unknown++;

        const row = document.createElement("div");
        row.className = "header-row";

        const content = document.createElement("div");

        const name = document.createElement("div");
        name.className = "header-name";
        name.textContent = header.name;

        const desc = document.createElement("div");
        desc.className = "header-desc";
        desc.textContent = header.description;

        content.append(name, desc);

        const badge = document.createElement("span");
        badge.className = "header-status " +
            (status === true ? "pass" :
             status === false ? "miss" : "unknown");

        badge.textContent = status === true ? "PRESENT" :
            status === false ? "MISSING" : "UNKNOWN";

        row.append(content, badge);
        list.append(row);
    });

    $("headerCount").textContent =
        `${passed}/6 present` + (unknown ? ` · ${unknown} unknown` : "");

    return { passed, unknown };
}

function renderRecommendations(results, httpsStatus) {
    const list = $("recommendationList");
    list.replaceChildren();

    const recommendations = [];

    if (httpsStatus === false) {
        recommendations.push({
            title: "Enable HTTPS",
            description: "Install a valid TLS certificate and redirect HTTP traffic to HTTPS."
        });
    }

    SECURITY_HEADERS.forEach(header => {
        if (results[header.name] !== true) {
            recommendations.push({
                title: results[header.name] === null
                    ? `Verify ${header.name}`
                    : `Add ${header.name}`,
                description: header.advice
            });
        }
    });

    if (recommendations.length === 0) {
        const item = document.createElement("div");
        item.className = "recommendation-row";
        item.textContent =
            "All checked headers were detected. Review their actual configurations as well.";
        list.append(item);
        return;
    }

    recommendations.forEach(rec => {
        const item = document.createElement("div");
        item.className = "recommendation-row";

        const title = document.createElement("div");
        title.className = "recommendation-title";
        title.textContent = "⚠ " + rec.title;

        const desc = document.createElement("div");
        desc.className = "recommendation-desc";
        desc.textContent = rec.description;

        item.append(title, desc);
        list.append(item);
    });
}

function setLink(id, value) {
    const link = $(id);
    link.textContent = value;
    link.href = value;
}

function displayResults(data) {
    const stats = renderHeaders(data.headers);

    // HTTPS + six security headers = seven possible checks.
    const score = (data.https ? 1 : 0) + stats.passed;
    const total = 7;
    const percentage = Math.round((score / total) * 100);

    // The score follows the original Python thresholds.
    // Partial results are explicitly labeled because browser CORS may hide headers.
    const risk = stats.unknown > 0
        ? "PARTIAL"
        : percentage >= 80 ? "LOW"
        : percentage >= 50 ? "MEDIUM"
        : "HIGH";

    $("scoreValue").textContent = `${score}/${total}`;
    $("scorePercent").textContent =
        stats.unknown ? `${percentage}% · Some checks unknown` : `${percentage}% passed`;
    $("scoreBar").style.width = `${percentage}%`;

    $("riskValue").textContent = risk;
    $("riskValue").className = risk.toLowerCase();
    $("riskDescription").textContent =
        stats.unknown ? "Browser could not read every header" : "Based on these checks";

    $("httpsValue").textContent = data.https ? "Enabled" : "Not enabled";
    $("httpsValue").style.color = data.https ? "var(--green)" : "var(--red)";
    $("httpsDescription").textContent =
        data.https ? "HTTPS URL" : "HTTP URL";

    $("httpValue").textContent = data.status;
    $("serverValue").textContent = "Server: " + data.server;

    setLink("targetUrl", data.target);
    setLink("finalUrl", data.finalUrl);

    renderRecommendations(data.headers, data.https);
    $("results").hidden = false;
}

async function scanWebsite() {
    const error = $("errorMessage");
    const button = $("scanButton");

    error.textContent = "";
    button.disabled = true;
    button.textContent = "Analyzing...";

    try {
        const url = normalizeUrl($("websiteUrl").value);

        // Browser fetch is restricted by the target site's CORS policy.
        const response = await fetch(url.href, {
            method: "GET",
            mode: "cors",
            redirect: "follow",
            cache: "no-store"
        });

        const headerResults = {};

        SECURITY_HEADERS.forEach(header => {
            // A null value may mean missing OR not exposed by CORS.
            // Treat it as unknown instead of claiming the header is missing.
            const value = response.headers.get(header.name);
            headerResults[header.name] = value === null ? null : true;
        });

        displayResults({
            target: url.href,
            finalUrl: response.url || url.href,
            https: url.protocol === "https:",
            status: response.status,
            server: response.headers.get("Server") || "Not disclosed / not exposed",
            headers: headerResults
        });

        $("results").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } catch (err) {
        error.textContent = err instanceof TypeError
            ? "The browser could not read this website. CORS or network restrictions may be blocking the request. Use your Python backend for reliable scanning."
            : err.message;
    } finally {
        button.disabled = false;
        button.textContent = "Analyze Website";
    }
}

$("websiteUrl").addEventListener("keydown", event => {
    if (event.key === "Enter") {
        scanWebsite();
    }
});
```
