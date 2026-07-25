document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ main.js 已成功載入並執行！");

    // 1. DOM 元素選擇器
    const themeToggleBtn = document.getElementById("theme-toggle");
    const langToggleBtn = document.getElementById("lang-toggle");
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    // 2. 主題切換 (Theme Toggle)
    if (themeToggleBtn) {
        const currentTheme = localStorage.getItem("theme") || "dark";
        if (currentTheme === "light") {
            document.body.classList.add("light-theme");
            themeToggleBtn.textContent = "🌙 暗色";
        } else {
            themeToggleBtn.textContent = "☀️ 亮色";
        }

        themeToggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-theme");
            let theme = "dark";
            if (document.body.classList.contains("light-theme")) {
                theme = "light";
                themeToggleBtn.textContent = "🌙 暗色";
            } else {
                themeToggleBtn.textContent = "☀️ 亮色";
            }
            localStorage.setItem("theme", theme);
        });
    } else {
        console.warn("⚠️ 找不到 #theme-toggle 按鈕");
    }

    // 3. 雙語語言切換 (Language Toggle)
    if (langToggleBtn) {
        let currentLang = localStorage.getItem("lang") || "zh";

        function updateLanguage(lang) {
            const translatableElements = document.querySelectorAll("[data-zh][data-en]");
            translatableElements.forEach(el => {
                if (lang === "en") {
                    el.textContent = el.getAttribute("data-en");
                } else {
                    el.textContent = el.getAttribute("data-zh");
                }
            });
            langToggleBtn.textContent = lang === "en" ? "中文" : "EN";
            document.title = lang === "en" ? "Tony Y. L. Chiang - Personal Website" : "江育霖 (Tony Y. L. Chiang) - 個人網站";
        }

        // 初始化語言
        updateLanguage(currentLang);

        langToggleBtn.addEventListener("click", () => {
            currentLang = currentLang === "zh" ? "en" : "zh";
            localStorage.setItem("lang", currentLang);
            updateLanguage(currentLang);
        });
    } else {
        console.warn("⚠️ 找不到 #lang-toggle 按鈕");
    }

    // 4. 手機版 Hamburger 選單切換
    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }
});
