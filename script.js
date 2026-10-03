/* =====================================
   KISHORE OPINION WEBSITE
   Login + Opinion Form + Admin Dashboard
===================================== */

const $ = (id) => document.getElementById(id);

// ---------- PAGE NAVIGATION ----------

function showPage(pageId) {
    document.querySelectorAll("body > section").forEach((section) => {
        section.classList.add("hidden");
    });

    const page = $(pageId);

    if (page) {
        page.classList.remove("hidden");
    }
}

// ---------- USER LOGIN ----------
// DEMO ONLY: Do not use hardcoded passwords
// for a real public website.

function login() {
    const username = $("username").value.trim();
    const password = $("password").value;

    if (username === "kishore" && password === "1234") {
        sessionStorage.setItem("loggedIn", "yes");
        $("loginMessage").textContent = "";
        showPage("opinionPage");
    } else {
        $("loginMessage").textContent =
            "Username அல்லது Password தவறு!";
    }
}

function logout() {
    sessionStorage.removeItem("loggedIn");
    $("username").value = "";
    $("password").value = "";
    showPage("loginPage");
}

// ---------- OPINION FORM ----------

function getOpinions() {
    try {
        const data = JSON.parse(
            localStorage.getItem("opinions") || "[]"
        );

        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Could not read opinions:", error);
        return [];
    }
}

function saveOpinions(opinions) {
    try {
        localStorage.setItem("opinions", JSON.stringify(opinions));
        return true;
    } catch (error) {
        console.error("Could not save opinions:", error);
        return false;
    }
}

const opinionForm = $("opinionForm");

if (opinionForm) {
    opinionForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (sessionStorage.getItem("loggedIn") !== "yes") {
            showPage("loginPage");
            return;
        }

        const name = $("personName").value.trim();
        const opinion = $("opinionText").value.trim();

        if (!name || !opinion) {
            $("submitMessage").textContent =
                "பெயர் மற்றும் கருத்தை உள்ளிடவும்!";
            return;
        }

        const opinions = getOpinions();

        opinions.push({
            id: Date.now().toString(),
            name: name,
            opinion: opinion,
            date: new Date().toLocaleString()
        });

        if (saveOpinions(opinions)) {
            opinionForm.reset();

            $("submitMessage").textContent =
                "உன் கருத்து வெற்றிகரமாக சேமிக்கப்பட்டது! ✅";
        } else {
            $("submitMessage").textContent =
                "சேமிக்க முடியவில்லை. Browser storage-ஐ சரிபார்.";
        }
    });
}

// ---------- ADMIN LOGIN ----------
// DEMO ONLY: Not secure authentication.

function showAdminLogin() {
    $("adminMessage").textContent = "";
    showPage("adminLoginPage");
}

function adminLogin() {
    const username = $("adminUser").value.trim();
    const password = $("adminPass").value;

    if (username === "admin" && password === "admin123") {
        sessionStorage.setItem("adminLoggedIn", "yes");

        $("adminMessage").textContent = "";
        renderOpinions();
        showPage("dashboardPage");
    } else {
        $("adminMessage").textContent =
            "Admin username அல்லது password தவறு!";
    }
}

// ---------- ADMIN DASHBOARD ----------

function renderOpinions() {
    if (sessionStorage.getItem("adminLoggedIn") !== "yes") {
        showPage("adminLoginPage");
        return;
    }

    const opinions = getOpinions();
    const list = $("opinionsList");

    $("totalCount").textContent =
        "Total Opinions: " + opinions.length;

    list.replaceChildren();

    if (opinions.length === 0) {
        list.textContent =
            "இன்னும் கருத்துகள் எதுவும் சமர்ப்பிக்கப்படவில்லை.";
        return;
    }

    opinions.slice().reverse().forEach((item) => {
        const card = document.createElement("div");
        card.className = "opinion";

        const name = document.createElement("strong");
        name.textContent = "👤 " + item.name;

        const date = document.createElement("div");
        date.className = "small";
        date.textContent = item.date || "";

        const message = document.createElement("p");
        message.textContent = item.opinion;

        card.append(name, date, message);
        list.appendChild(card);
    });
}

// ---------- EXPORT OPINIONS ----------

function exportOpinions() {
    if (sessionStorage.getItem("adminLoggedIn") !== "yes") {
        alert("முதலில் Admin Login செய்யவும்!");
        showPage("adminLoginPage");
        return;
    }

    const opinions = getOpinions();

    const content = opinions.map((item, index) =>
        `${index + 1}. ${item.name}\n` +
        `${item.date || ""}\n` +
        `${item.opinion}`
    ).join("\n\n--------------------\n\n");

    const blob = new Blob(
        [content || "No opinions yet."],
        { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "kishore-opinions.txt";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}

// ---------- CLEAR OPINIONS ----------

function clearOpinions() {
    if (sessionStorage.getItem("adminLoggedIn") !== "yes") {
        alert("முதலில் Admin Login செய்யவும்!");
        showPage("adminLoginPage");
        return;
    }

    const confirmDelete = confirm(
        "எல்லா கருத்துகளையும் நிரந்தரமாக அழிக்க வேண்டுமா?"
    );

    if (!confirmDelete) {
        return;
    }

    localStorage.removeItem("opinions");
    renderOpinions();
}

// ---------- RETURN TO WEBSITE ----------

function backToOpinions() {
    if (sessionStorage.getItem("loggedIn") === "yes") {
        showPage("opinionPage");
    } else {
        showPage("loginPage");
    }
}

// ---------- INITIAL PAGE ----------

showPage("loginPage");