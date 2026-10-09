document.addEventListener('DOMContentLoaded', () => {
    const html = document.documentElement;

    /* --------------------------------------------------------------------------
       1. 主題切換 (Light / Dark Theme)
       -------------------------------------------------------------------------- */
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const curTheme = html.getAttribute('data-theme');
            const nextTheme = curTheme === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', nextTheme);
            
            const isZh = html.getAttribute('lang') === 'zh-TW';
            themeBtn.textContent = nextTheme === 'light' 
                ? (isZh ? '🌙 暗色' : '🌙 Dark') 
                : (isZh ? '☀️ 亮色' : '☀️ Light');
        });
    }

    /* --------------------------------------------------------------------------
       2. 雙語切換 (Bilingual Toggle)
       -------------------------------------------------------------------------- */
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const curLang = html.getAttribute('lang');
            const isZh = curLang === 'zh-TW';
            const nextLang = isZh ? 'en' : 'zh-TW';
            
            html.setAttribute('lang', nextLang);
            langBtn.textContent = isZh ? '中文' : 'EN';

            document.querySelectorAll('[data-zh][data-en]').forEach(el => {
                el.innerHTML = isZh ? el.getAttribute('data-en') : el.getAttribute('data-zh');
            });

            document.querySelectorAll('[data-zh-placeholder][data-en-placeholder]').forEach(input => {
                input.placeholder = isZh ? input.getAttribute('data-en-placeholder') : input.getAttribute('data-zh-placeholder');
            });

            const curTheme = html.getAttribute('data-theme');
            if (themeBtn) {
                themeBtn.textContent = curTheme === 'light' 
                    ? (!isZh ? '🌙 暗色' : '🌙 Dark') 
                    : (!isZh ? '☀️ 亮色' : '☀️ Light');
            }
        });
    }

    /* --------------------------------------------------------------------------
       3. 手機版選單控制
       -------------------------------------------------------------------------- */
    const menuBtn = document.getElementById('menu-toggle');
    const siteNav = document.getElementById('site-nav');

    if (menuBtn && siteNav) {
        menuBtn.addEventListener('click', () => {
            const isOpen = siteNav.classList.toggle('open');
            menuBtn.setAttribute('aria-expanded', isOpen);
        });

        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', () => {
                siteNav.classList.remove('open');
                menuBtn.setAttribute('aria-expanded', false);
            });
        });
    }

    /* --------------------------------------------------------------------------
       4. 論文關鍵字搜尋與分類篩選器
       -------------------------------------------------------------------------- */
    const filterBtns = document.querySelectorAll('.filter');
    const pubSearch = document.getElementById('pub-search');
    const pubItems = document.querySelectorAll('.pub');

    let currentFilter = 'all';

    function filterPubs() {
        const query = pubSearch ? pubSearch.value.toLowerCase().trim() : '';

        pubItems.forEach(item => {
            const type = item.getAttribute('data-type');
            const text = item.textContent.toLowerCase();
            
            const matchFilter = (currentFilter === 'all' || type === currentFilter);
            const matchSearch = text.includes(query);

            if (matchFilter && matchSearch) {
                item.removeAttribute('hidden');
            } else {
                item.setAttribute('hidden', 'true');
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
            btn.setAttribute('aria-pressed', 'true');
            currentFilter = btn.getAttribute('data-filter');
            filterPubs();
        });
    });

    if (pubSearch) {
        pubSearch.addEventListener('input', filterPubs);
    }

    /* --------------------------------------------------------------------------
       5. MCDM 動態權重與即時排序動畫
       -------------------------------------------------------------------------- */
    const w1 = document.getElementById('w1');
    const w2 = document.getElementById('w2');
    const w3 = document.getElementById('w3');

    if (w1 && w2 && w3) {
        const alternatives = [
            { id: 0, rowEl: document.getElementById('rk-row-0'), meterEl: document.getElementById('m1'), scoreEl: document.getElementById('s1'), baseScores: [0.90, 0.75, 0.85] },
            { id: 1, rowEl: document.getElementById('rk-row-1'), meterEl: document.getElementById('m2'), scoreEl: document.getElementById('s2'), baseScores: [0.65, 0.95, 0.60] },
            { id: 2, rowEl: document.getElementById('rk-row-2'), meterEl: document.getElementById('m3'), scoreEl: document.getElementById('s3'), baseScores: [0.80, 0.60, 0.90] }
        ];

        function updateMCDM() {
            const val1 = parseFloat(w1.value) || 0;
            const val2 = parseFloat(w2.value) || 0;
            const val3 = parseFloat(w3.value) || 0;

            document.getElementById('w1-val').textContent = val1.toFixed(2);
            document.getElementById('w2-val').textContent = val2.toFixed(2);
            document.getElementById('w3-val').textContent = val3.toFixed(2);

            const sumWeights = (val1 + val2 + val3) || 1;

            // 計算權重加權綜合得分
            alternatives.forEach(alt => {
                const score = (alt.baseScores[0] * val1 + alt.baseScores[1] * val2 + alt.baseScores[2] * val3) / sumWeights;
                alt.currentScore = score;
            });

            // 依得分降序排序
            const sorted = [...alternatives].sort((a, b) => b.currentScore - a.currentScore);

            // 即時更新排名與動畫位移
            sorted.forEach((item, index) => {
                const pct = Math.min(100, Math.max(0, Math.round(item.currentScore * 100)));
                if (item.meterEl) item.meterEl.style.width = `${pct}%`;
                if (item.scoreEl) item.scoreEl.textContent = item.currentScore.toFixed(2);

                if (item.rowEl) {
                    item.rowEl.style.transform = `translateY(${index * 44}px)`;
                    const rkSpan = item.rowEl.querySelector('.rk');
                    if (rkSpan) rkSpan.textContent = index + 1;

                    if (index === 0) {
                        item.rowEl.classList.add('top');
                    } else {
                        item.rowEl.classList.remove('top');
                    }
                }
            });
        }

        [w1, w2, w3].forEach(input => {
            input.addEventListener('input', updateMCDM);
            input.addEventListener('change', updateMCDM);
        });

        // 頁面載入後立即計算一次
        updateMCDM();
    }
});
