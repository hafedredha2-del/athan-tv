let wakeLock = null;
// V11.2: Session Tracking
window._isCurrentSession = true;
window._isTestingMedia = false; // V11.6: Flag to bypass Iqama on test failures

// APK Sharing logic moved to index.html (V38.9.23)

// Legacy sharing code removed. logic_v2.js continues here.

// === STEP 8 & 9: BISMI SPLASH + TAUD BISMILLAH AUTOPLAY ===
(function() {
    // --- 1. Bismi Splash Screen ---
    const splash = document.createElement('div');
    splash.id = 'bismi-splash';
    Object.assign(splash.style, {
        position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
        zIndex: '1000000', background: 'black', // Below the max z-index of settings button
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'opacity 1s ease',
        pointerEvents: 'none'  // NEVER block mouse clicks
    });
    const splashImg = document.createElement('img');
    splashImg.src = 'assets/images/bismi.png';
    Object.assign(splashImg.style, {
        maxWidth: '80%', maxHeight: '80%', objectFit: 'contain',
        animation: 'bismiPulse 2s ease-in-out'
    });
    splash.appendChild(splashImg);
    document.body.appendChild(splash);

    // Add animation keyframes once
    if (!document.getElementById('bismi-style')) {
        const st = document.createElement('style');
        st.id = 'bismi-style';
        st.textContent = `@keyframes playBismiPulse { 0%{opacity:0;transform:scale(0.9)} 50%{opacity:1;transform:scale(1.02)} 100%{opacity:1;transform:scale(1)} }`;
        document.head.appendChild(st);
    }
    splashImg.style.animation = 'playBismiPulse 2s ease-in-out';

    // Auto-hide after 6s
    setTimeout(() => {
        splash.style.opacity = '0';
        setTimeout(() => splash.remove(), 1000);
    }, 6000);

    // --- 2. Taud bismillah after first user interaction (bypass autoplay block) ---
    let bismillahPlayed = false;
    function playBismillah() {
        if (bismillahPlayed) return;
        bismillahPlayed = true;
        const audio = new Audio('assets/audio/taud_bismillah.mp3');
        audio.volume = 0.8;
        audio.play().catch(e => console.log('Bismillah audio blocked:', e));
        document.removeEventListener('click', playBismillah);
        document.removeEventListener('keydown', playBismillah);
        document.removeEventListener('touchstart', playBismillah);
    }
    document.addEventListener('click', playBismillah, { once: true });
    document.addEventListener('keydown', playBismillah, { once: true });
    document.addEventListener('touchstart', playBismillah, { once: true });
})();

// MediaStorage and restoreMediaFromStorage moved to services.js

// V12.0: DEFAULT_ASSETS moved to constants.js

// V36.3: HEVC Codec Detection & H.264 Fallback
// Moved to utils.js

// Run detection on page load
// Moved to utils.js


// NOTE: For H.264 fallback on mobile, ensure these files exist:
// - assets/videos/Fajr_h264.mp4
// - assets/videos/Dhuhr_h264.mp4
// - assets/videos/Asr_h264.mp4
// - assets/videos/Maghrib_h264.mp4
// - assets/videos/Isha_h264.mp4
// - assets/videos/Sunrise_h264.mp4
// If they don't exist, video will fallback to HEVC and may show black on unsupported browsers


// Helper function to get correct video path based on codec support
// Moved to utils.js



// HYBRID_ATHKAR_CONFIG moved to constants.js



// CONFIG and I18N moved to constants.js


// ====  SIYAM WIDGET CONTROL (Centralisé) ====
// Ces 2 fonctions sont le SEUL point de masquage/affichage forcé.
// hideSiyamWidget() pose un verrou data-force-hidden qui empêche
// FastingWidget.update() de le réafficher toutes les secondes.
function hideSiyamWidget() {
    const w = document.getElementById('fasting-widget');
    if (w) {
        w.dataset.forceHidden = 'true';
        w.classList.add('hidden');
        w.style.display = 'none';
    }
}
function showSiyamWidget() {
    const w = document.getElementById('fasting-widget');
    if (w) {
        delete w.dataset.forceHidden;
        // Let FastingWidget.update() decide if it should show (based on fasting state)
    }
}
window.hideSiyamWidget = hideSiyamWidget;
window.showSiyamWidget = showSiyamWidget;

// State variables moved to constants.js
// Fasting Logic (Siyam) - Monday/Thursday, White Days, Ashura, Arafat (V35.15)
function updateFastingWidget(now, hijriDateString, pTimes) {
    if (typeof FastingWidget !== 'undefined') {
        FastingWidget.update(now, hijriDateString, currentLang, pTimes);
    }
}

// Souhour Visual logic
function setSouhourBackground(active) {
    if (typeof FastingWidget !== 'undefined') FastingWidget.setSouhourBackground(active);
}

function initDraggable() {
    if (typeof DraggableManager !== 'undefined') DraggableManager.init();
}

// Ensure initDraggable is called via init() only

// DOM Elements
const els = {
    body: document.body,
    clockTime: document.getElementById('clock-time'),
    clockDate: document.getElementById('clock-date'),
    weatherTemp: document.getElementById('temp-text'),
    weatherDesc: document.getElementById('weather-text'),
    weatherIcon: document.getElementById('weather-icon'),
    weatherWidget: document.getElementById('weather-widget'),
    prayerList: document.getElementById('prayer-list'),
    nextPrayerName: document.getElementById('next-prayer-name'),
    nextPrayerCountdown: document.getElementById('next-prayer-countdown'),
    athanContainer: document.getElementById('athan-player-container'),
    athanVideo: document.getElementById('athan-video'),
    closeAthanBtn: document.getElementById('close-athan'),
    bgImage: document.getElementById('bg-image'),
    bgVideo: document.getElementById('bg-video'),
    translatables: document.querySelectorAll('[data-i18n]'),
    toast: document.getElementById('toast-message'),

    // Weather Forecast Elements
    weatherWidget: document.getElementById('weather-widget'),
    weatherForecastModal: document.getElementById('weather-forecast-modal'),
    closeWeatherForecast: document.getElementById('close-weather-forecast'),
    hourlyForecast: document.getElementById('hourly-forecast'),
    dailyForecast: document.getElementById('daily-forecast'),
    tasbihListEdit: document.getElementById('tasbih-list-edit'),
    settingsModal: document.getElementById('settings-modal'),
    closeSettingsBtn: document.getElementById('close-settings'),
    layoutLockedToggle: document.getElementById('layout-locked-toggle')
};


// V35.1: Pro Error Tracker (Console only, no intrusive banners)
window.onerror = function (msg, url, lineNo, columnNo, error) {
    const debugEl = document.getElementById('debug-error-log');
    if (debugEl) {
        debugEl.style.display = 'block';
        debugEl.innerHTML += `<div>❌ ${msg} (Line: ${lineNo})</div>`;
    }
    console.error(`PRO JS ERROR: ${msg} [${url}:${lineNo}]`);
    return false;
};

// Moved to utils.js

// --- Localization ---
function setLanguage(lang) {
    currentLang = lang;
    els.body.className = `lang-${lang}`;

    // Update static and dynamic text
    // V41.8: Always re-query to catch injected elements
    const translatables = document.querySelectorAll('[data-i18n]');
    translatables.forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    // Refresh dynamic content
    updateClock();
    if (prayerTimes) renderPrayerList();
    fetchWeather();

    // Update active state of lang buttons (legacy)
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === lang) btn.classList.add('active');
        else btn.classList.remove('active');
    });
    // Update lang selector if exists
    const langSel = document.getElementById('lang-select');
    if (langSel) langSel.value = lang;

    localStorage.setItem('athan_lang', lang);
}

// Lang buttons removed from UI later
// document.querySelectorAll('.lang-btn').forEach(btn => {
//     btn.addEventListener('click', () => {
//         setLanguage(btn.dataset.lang);
//     });
// });

let _lastSecondForLogic = -1;
function updateClock() {
    const now = new Date();
    const currentSec = now.getSeconds();
    const isNewSecond = (_lastSecondForLogic !== currentSec);

    if (typeof ClockWidget !== 'undefined') {
        const { currentTime, hjDate } = ClockWidget.update(now, currentLang, I18N, CONFIG.hijriOffset);

        if (isNewSecond) {
            _lastSecondForLogic = currentSec;

            // Update Siyam widget every second to ensure visibility and correct text
            // V36.2: USE hjDate (LIVE) instead of globalHijriDateString (STALE)
            updateFastingWidget(now, hjDate, prayerTimes);

            // Logic triggers (Athkar, Prayer, etc.)
            if (CONFIG.athkarsEnabled !== false && now.getSeconds() === 0) {
                ['morning', 'evening', 'sleep', 'wakeup'].forEach(key => {
                    const athkar = CONFIG.athkars[key];
                    if (athkar && athkar.time === currentTime && (athkar.url || key === 'morning' || key === 'evening')) {
                        const trackKey = `lastTrigger_${key}`;
                        if (window[trackKey] !== currentTime) {
                            playAthkar(athkar.url, key);
                            window[trackKey] = currentTime;
                        }
                    }
                });
            }

            if (prayerTimes) {
                try { checkPrayerTime(now); } catch (e) { }
                try { updateNextPrayer(now); } catch (e) { }
                checkQuranTime(now);
                checkNeonFlash(now);
                ClockWidget.updateFridayOverlay(now, prayerTimes);
                monitorAudioPriority();
            }
        }
    }
}

/* SECONDS PROGRESS RING REMOVED (NOW ON CANVAS) */

// --- Hijri Date Logic ---
// Moved to utils.js

// --- Quran Scheduler ---
function checkQuranTime(now) {
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const currentDay = now.getDay(); // 5 = Friday

    // Surah Al-Kahf (Friday Only)
    if (currentDay === 5 && CONFIG.quran.kahf.url && CONFIG.quran.kahf.enabled) {
        if (currentTime === CONFIG.quran.kahf.time && now.getSeconds() === 0) {
            playAthkar(CONFIG.quran.kahf.url); // Reuse playAthkar for audio
            showToast("تلاوة سورة الكهف");
        }
    }

    // Surah Al-Mulk (Daily/Nightly)
    if (CONFIG.quran.mulk.url && CONFIG.quran.mulk.enabled) {
        if (currentTime === CONFIG.quran.mulk.time && now.getSeconds() === 0) {
            playAthkar(CONFIG.quran.mulk.url);
            showToast("تلاوة سورة الملك");
        }
    }
}

async function requestWakeLock() { if (typeof WakeLockService !== 'undefined') await WakeLockService.request(); }
async function releaseWakeLock() { if (typeof WakeLockService !== 'undefined') await WakeLockService.release(); }

function startWakeLockMonitoring() {
    console.log("🚀 Starting WakeLock Monitoring (once)...");
    setInterval(() => {
        if (!prayerTimes) return;

        const now = new Date();
        const nextPrayer = getNextPrayerTimeObj();
        if (!nextPrayer) return;

        const mUntil = Math.floor((nextPrayer - now) / 60000);

        // Wake screen 20 mins before and keep during prayer
        if (mUntil <= (CONFIG.wakeLockMinutes || 20) && mUntil > -10) {
            requestWakeLock();
        } else {
            releaseWakeLock();
        }
    }, 60000);
}

// --- Weather ---
// Moved to utils.js

async function fetchWeather() {
    if (typeof WeatherService !== 'undefined') {
        await WeatherService.fetchWeather(currentLang);
    }
}

// Moved to utils.js

function showWeatherForecast() {
    if (typeof WeatherService !== 'undefined') {
        WeatherService.showWeatherForecast(currentLang, els);
    }
}
window.showWeatherForecast = showWeatherForecast; // Export for inline HTML

// Moved to utils.js

// Weather Refresh Button
const refreshWeatherBtn = document.getElementById('refresh-weather');
if (refreshWeatherBtn) {
    refreshWeatherBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent drag event from firing
        fetchWeather();
        showToast(t("weather_refreshing") || "Actualisation météo...");
    });
}

// V36.2: RE-ADD weatherWidget click listener for forecast modal
if (els.weatherWidget) {
    console.log("🌦️ Weather widget listener attached");
    els.weatherWidget.style.cursor = 'pointer';
    els.weatherWidget.onclick = (e) => {
        console.log("🌦️ Weather widget clicked!");
        e.stopPropagation();
        showWeatherForecast();
    };
}

// --- Prayer Times ---
// Moved to utils.js

// V34.0: Accurate Offline Hijri Date for Ramadan/Ayam Bidh
// Moved to utils.js

async function fetchPrayerTimes(forceNetwork = false) {
    if (typeof PrayerService !== 'undefined') {
        const result = await PrayerService.fetchPrayerTimes(currentLang, forceNetwork);
        if (result) {
            prayerTimes = result.times;
            globalHijriDateString = result.hijri;
            updateDates(new Date(), globalHijriDateString);
            renderPrayerList();
            updateFastingWidget(new Date(), globalHijriDateString);
            updateConnectionStatus(result.status);
            scheduleNativeAlarms();
            // Re-check slideshow mode now that prayerTimes is loaded (fixes Jumu'ah detection)
            checkSlideshowMode(true);
        } else {
            // Calcul astronomique local fallback
            const offlineTimes = calculatePrayerTimesOffline(new Date());
            if (offlineTimes) {
                prayerTimes = offlineTimes;
                globalHijriDateString = getOfflineHijriDate(new Date());
                updateDates(new Date(), globalHijriDateString);
                renderPrayerList();
                updateFastingWidget(new Date(), globalHijriDateString);
                updateConnectionStatus('offline');
                scheduleNativeAlarms();
                checkSlideshowMode(true);
            }
        }
    }
}

function scheduleNativeAlarms() {
    if (typeof NativeAlarmService !== 'undefined') {
        NativeAlarmService.scheduleAlarms(prayerTimes);
    }
}

function updateDates(gregorianDate, hijriString) {
    const gregEl = document.getElementById('gregorian-text');
    const hijriEl = document.getElementById('hijri-text');

    if (gregEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        gregEl.textContent = gregorianDate.toLocaleDateString(t("date_locale"), options);
    }

    if (hijriEl) {
        hijriEl.textContent = hijriString.split('|')[0].trim();
    }
}

function renderPrayerList() {
    if (typeof PrayerWidget !== 'undefined') {
        PrayerWidget.renderList(prayerTimes, currentLang, I18N, els);
        // V38.6: Re-apply orientation AND item specific styles after re-render
        const list = document.getElementById('prayer-list');
        if (list && CONFIG.prayerListOrientation) {
            const isRow = CONFIG.prayerListOrientation === 'row';
            list.style.flexDirection = CONFIG.prayerListOrientation;
            list.style.flexWrap = isRow ? 'wrap' : 'nowrap';
            list.style.gap = isRow ? '15px' : '0';
            list.style.width = isRow ? 'max-content' : '380px';
            
            // Force items to correct width/style
            list.querySelectorAll('.prayer-item').forEach(item => {
                item.style.width = isRow ? 'auto' : '100%';
                if (isRow) {
                    item.style.minWidth = '110px';
                    item.style.flexDirection = 'column';
                }
            });
        }
    }
}

// --- Settings & Backgrounds ---
const settingsModal = document.getElementById('settings-modal');
const openSettingsBtn = document.getElementById('open-settings');
const closeSettingsBtn = document.getElementById('close-settings');
const bgGrid = document.getElementById('bg-grid');

openSettingsBtn.addEventListener('click', () => {
    console.log("Open Settings Clicked");
    settingsModal.classList.remove('hidden');
    renderBackgroundGrid();
    // Sync lang select with current language
    const langSel = document.getElementById('lang-select');
    if (langSel) langSel.value = currentLang;
    const orientSel = document.getElementById('orientation-select');
    if (orientSel && CONFIG.prayerListOrientation) orientSel.value = CONFIG.prayerListOrientation;
    try {
        if (typeof loadSettingsValues === 'function') {
            console.log("Calling loadSettingsValues UI generator...");
            loadSettingsValues();
        } else {
            console.error("loadSettingsValues is not a function!");
        }
    } catch (e) {
        console.error("Error in loadSettingsValues:", e);
        showToast("Erreur paramètres");
    }
    if (typeof renderTasbihList === 'function') renderTasbihList();
});


// --- Font Selection ---
function setFont(fontName) {
    if (fontName === 'aref') {
        document.body.style.fontFamily = "'Aref Ruqaa', serif";
        document.documentElement.style.setProperty('--font-ar', "'Aref Ruqaa', serif");
    } else {
        document.body.style.fontFamily = "'Cairo', sans-serif";
        document.documentElement.style.setProperty('--font-ar', "'Cairo', sans-serif");
    }
    localStorage.setItem('athan_font', fontName);
}

// --- Ticker Logic ---
let athkarsList = [
    "سبحان الله",
    "الحمد لله",
    "الله أكبر",
    "لا إله إلا الله",
    "أستغفر الله",
    "سبحان الله وبحمده",
    "سبحان الله العظيم",
    "لا حول ولا قوة إلا بالله"
];
let tickerIndex = 0;

function updateTicker() {
    if (typeof TickerWidget !== 'undefined') {
        TickerWidget.update(athkarsList);
    }
}

// Update ticker every minute
setInterval(updateTicker, 60000); // 60s for relaxed reading
setTimeout(updateTicker, 2000); // Initial delay

// --- Neon Flash Logic ---
function checkNeonFlash(now) {
    if (typeof VisualEffects !== 'undefined') {
        VisualEffects.checkNeonFlash(now);
    }
}

// --- SECONDS RING (CSS SPINNER ONLY - NO DOTS) ---
// The user requested the removal of "dots". We use a CSS border spinner instead.
function updateSecondsRing() {
    // Legacy Dot Logic Removed
    // V7 design uses pure CSS rotation on #seconds-ring
}

function generateSecondsRing() {
    // Legacy Dot Logic Removed
    const ring = document.getElementById('seconds-ring');
    if (ring) ring.innerHTML = ''; // Clear any dots
}

// WakeLock moved to services.js

// --- Athkar Audio ---
let athkarAudio = null;
let isAthkarPlaying = false;

function playAthkar(url, category = null) {
    // V41.6: Path Normalization for legacy settings
    let finalUrl = url;
    if (finalUrl && (finalUrl.startsWith('mp3/') || finalUrl.startsWith('assets/audio/'))) {
        const filename = finalUrl.split('/').pop();
        finalUrl = "assets/audio/" + filename;
        console.log("Normalized Audio Path:", finalUrl);
    }

    // stopBtn logic moved inside hybrid/audio blocks to avoid showing it for text-only

    // V38.2: HYBRID LOGIC FOR morning/evening
    // Text always scrolls for these categories, even if audio is custom (USB).
    if ((category === 'morning' || category === 'evening')) {
        const isBlob = url && (url.startsWith('blob:') || url.startsWith('data:'));
        if (isBlob) {
            showToast(`Mode Hybride (Texte + USB Audio) pour ${category}`, 2000);
        } else {
            showToast(`Mode Hybride (Texte) pour ${category}`, 2000);
        }

        showHybridAthkar(category, false); // Always false to show text

        // If it's default internal audio, we return because the background video/iframe might handle it?
        // Actually, the app uses Audio() objects for custom files. 
        // If isInternal && !isBlob, the original code returned. Let's see why.
        // It likely returns because internal Athkars are handled differently (maybe separate player).
        const isInternal = !url || url === 'Default' || url.startsWith('audio/') || url.startsWith('assets/audio/');
        if (isInternal && !isBlob) return;
    }

    if (athkarAudio) {
        athkarAudio.pause();
        if (athkarAudio.parentNode) athkarAudio.parentNode.removeChild(athkarAudio);
        athkarAudio = null;
    }

    athkarAudio = new Audio();
    athkarAudio.id = 'active-athkar-audio';
    athkarAudio.style.display = 'none';
    document.body.appendChild(athkarAudio);
    if (finalUrl && !finalUrl.startsWith('blob:') && !finalUrl.startsWith('data:') && finalUrl.includes('://')) {
        athkarAudio.crossOrigin = "anonymous";
    }

    if (finalUrl) {
        athkarAudio.src = finalUrl;

        athkarAudio.volume = 1.0;
        athkarAudio.muted = false; // V41.5: Explicitly unmute
        // Connect to visualizer for equalizer effect (V36-PRO)
        if (typeof AudioVisualizer !== 'undefined') {
            AudioVisualizer.unlockAudio();
            AudioVisualizer.connectSource(athkarAudio);
        }

        // Android TV / Chrome Autoplay Fix
        athkarAudio.load();

        // Show stop button for ALL audio playback
        const stopBtn = document.getElementById('stop-athkar');
        if (stopBtn) stopBtn.classList.remove('hidden');

        // Play audio natively without hijacking it for the visualizer
        // This guarantees sound on Android TV WebView

        athkarAudio.play().then(() => {
            isAthkarPlaying = true;
            showToast("Lecture de l'Audio...");
        }).catch(err => {
            console.error('Athkar playback error:', err);
            showToast("Erreur lecture audio");
        });
    }

    athkarAudio.onended = () => {
        isAthkarPlaying = false;
        const stopBtn = document.getElementById('stop-athkar');
        if (stopBtn) stopBtn.classList.add('hidden');
        closeHybridAthkar();
    };
}
window.playAthkar = playAthkar;

// --- Hybrid Athkar Content Populator & Scroller ---
let hybridScrollInterval = null;
function showHybridAthkar(category, audioOnly = false) {
    const overlay = document.getElementById('hybrid-athkar-overlay');
    const bgImg = document.getElementById('hybrid-athkar-bg');
    const track = document.getElementById('hybrid-scroll-track');
    const config = HYBRID_ATHKAR_CONFIG[category];

    if (!overlay || !config) {
        console.error("Hybrid display failure: missing overlay or config", category);
        return;
    }

    // V41.1: Hide Siyam widget to ensure no overlap
    hideSiyamWidget();

    // Force visibility
    overlay.style.display = "block";
    overlay.style.opacity = "1";
    overlay.style.zIndex = "500000";

    // V38.2: Use custom background if set, else default
    const customBg = CONFIG.athkarCustomBgs ? CONFIG.athkarCustomBgs[category] : null;
    bgImg.src = customBg || config.image;

    track.innerHTML = '';
    if (hybridScrollInterval) clearInterval(hybridScrollInterval);

    if (!audioOnly) {
        // Populate Text
        const textDiv = document.createElement('div');
        textDiv.className = 'hybrid-text';
        // Ensure text starts from a known state (hidden/down)
        textDiv.style.transform = 'translateY(80vh)';

        // Select text based on language (V38.2: Interleaved)
        let rawText = '';
        if (typeof config.text === 'string') {
            rawText = config.text;
        } else {
            rawText = config.text[currentLang] || config.text.ar || '';
        }

        // Clean up newlines for better layout
        const cleanedText = rawText
            .replace(/\r\n/g, '\n')
            .replace(/\n\n+/g, '<br><br>')
            .replace(/\n/g, '<br>');
        textDiv.innerHTML = cleanedText;
        track.appendChild(textDiv);

        // V41.14: Cleaned up trigger and fixed variable redeclaration
        textDiv.classList.remove('scrolling-active');
        void textDiv.offsetHeight; // Force reflow

        const cHeight = textDiv.scrollHeight || textDiv.offsetHeight || 2000;
        const duration = Math.max(80, cHeight / 10); // Vitesse très calme et douce

        textDiv.style.animationDuration = `${duration}s`;
        textDiv.style.webkitAnimationDuration = `${duration}s`;

        // Add class to start animation defined in CSS
        textDiv.classList.add('scrolling-active');

        const onEnd = () => {
            closeHybridAthkar();
        };
        textDiv.addEventListener('animationend', onEnd, { once: true });
        textDiv.addEventListener('webkitAnimationEnd', onEnd, { once: true });
    }
}


function closeHybridAthkar() {
    const overlay = document.getElementById('hybrid-athkar-overlay');
    const track = document.getElementById('hybrid-scroll-track');
    if (overlay) {
        overlay.style.display = 'none';
        overlay.style.opacity = '0';
    }
    if (track) {
        track.innerHTML = '';
    }
    if (hybridScrollInterval) {
        clearInterval(hybridScrollInterval);
        hybridScrollInterval = null;
    }

    if (athkarAudio) {
        athkarAudio.pause();
        isAthkarPlaying = false;
    }

    showSiyamWidget();
}


const closeHybridBtn = document.getElementById('close-hybrid-athkar');
if (closeHybridBtn) closeHybridBtn.onclick = closeHybridAthkar;

// --- Stop Audio Logic ---
const stopAthkarBtn = document.getElementById('stop-athkar');

function stopAthkarAudio() {
    if (athkarAudio) {
        athkarAudio.pause();
        athkarAudio.currentTime = 0;
        isAthkarPlaying = false;
        stopAthkarBtn.classList.add('hidden');
        showToast("تم إيقاف الصوت");
    }
}

if (stopAthkarBtn) {
    stopAthkarBtn.addEventListener('click', stopAthkarAudio);
}



// --- City Coordinates Map ---
const CITY_COORDINATES = {
    'Setif': { lat: 36.19, long: 5.41 },
    'Algiers': { lat: 36.75, long: 3.06 },
    'Oran': { lat: 35.69, long: -0.63 },
    'Constantine': { lat: 36.36, long: 6.61 },
    'Annaba': { lat: 36.90, long: 7.76 },
    'Batna': { lat: 35.55, long: 6.17 },
    'Ouargla': { lat: 31.95, long: 5.32 },
    'Bechar': { lat: 31.62, long: -2.22 }
};




// --- Load Settings Values (UI Generation) ---
function loadSettingsValues() {
    console.log("loadSettingsValues called");
    try {
        // General Settings
        const elements = {
            'city-input': CONFIG.city || '',
            'country-input': CONFIG.country || '',
            'weather-key-input': CONFIG.weatherApiKey || '',
            'hijri-offset': CONFIG.hijriOffset || 0,
            'slideshow-interval-select': CONFIG.slideshowIntervalSec || 15,
            'wakelock-input': CONFIG.wakeLockMinutes || 20,
            'font-select': localStorage.getItem('athan_font') || 'aref',
            // V13.0: Populate Time Inputs (with extreme safety)
            'time-wakeup': (CONFIG.athkars?.wakeup?.time) || '03:00',
            'time-morning': (CONFIG.athkars?.morning?.time) || '07:00',
            'time-evening': (CONFIG.athkars?.evening?.time) || '17:30',
            'time-sleep': (CONFIG.athkars?.sleep?.time) || '22:00',
            'time-kahf': (CONFIG.quran?.kahf?.time) || '10:00',
            'time-mulk': (CONFIG.quran?.mulk?.time) || '22:05'
        };

        // Helper for City Name in Arabic (Basic Map)
        const CITY_ARABIC_MAP = {
            'Algiers': 'الجزائر', 'Setif': 'سطيف', 'Oran': 'وهران',
            'Constantine': 'قسنطينة', 'Annaba': 'عنابة', 'Batna': 'باتنة',
            'Ouargla': 'ورقلة', 'Bechar': 'بشار', 'Tlemcen': 'تلمسان',
            'Ghardaia': 'غرداية', 'Adrar': 'أدرار', 'Biskra': 'بسكرة'
        };

        for (const [id, value] of Object.entries(elements)) {
            const el = document.getElementById(id);
            if (el) {
                if (id === 'city-input' && CITY_ARABIC_MAP[value]) {
                    el.value = CITY_ARABIC_MAP[value];
                } else {
                    el.value = value;
                }
            }
        }

        // V38.6: Masjid Mode Sync
        const mToggle = document.getElementById('masjid-mode-toggle');
        if (mToggle) mToggle.checked = !!CONFIG.masjidMode;
        
        const pToggle = document.getElementById('permanent-widgets-toggle');
        if (pToggle) pToggle.checked = !!CONFIG.permanentWidgets;

        // Imam Board Fields
        const iText = document.getElementById('imam-board-text');
        if (iText) iText.value = CONFIG.imamBoard?.text || "";
        
        const iMode = document.getElementById('imam-board-mode');
        if (iMode) iMode.value = CONFIG.imamBoard?.mode || "scrolling";
        
        const iDur = document.getElementById('imam-board-duration');
        if (iDur) iDur.value = CONFIG.imamBoard?.duration || 15;



        // Prayer Config Generation
        const container = document.getElementById('prayer-config-container');
        if (!container) {
            console.warn("prayer-config-container missing!");
            return;
        }
        container.innerHTML = '';

        const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

        prayers.forEach(pKey => {
            const prayerRow = document.createElement('div');
            prayerRow.className = 'prayer-config-row';
            prayerRow.style.cssText = 'margin-bottom: 2rem; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);';

            const pNameAr = (I18N.ar.prayers && (t("prayers") || {})[pKey]) ? (t("prayers") || {})[pKey] : pKey;

            const header = document.createElement('h3');
            header.style.cssText = 'color: var(--neon-gold); margin-bottom: 10px; display: flex; justify-content: space-between;';
            header.innerHTML = `<span>${pNameAr}</span> <span style="font-size:0.8em; color:#ccc;">${(prayerTimes && prayerTimes[pKey]) ? prayerTimes[pKey] : '--:--'}</span>`;
            prayerRow.appendChild(header);

            const grid = document.createElement('div');
            grid.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;';

            // Offset
            const offsetDiv = document.createElement('div');
            offsetDiv.innerHTML = `
                        <label style="display:block; font-size:0.8rem; margin-bottom:5px;">${I18N.ar.time_correction}</label>
                        <input type="number" id="offset-${pKey}" value="${CONFIG.prayerOffsets[pKey] || 0}" oninput="updateOffset('${pKey}', this.value)" style="width:100%; padding:8px; background:rgba(0,0,0,0.3); border:1px solid #444; color:white; border-radius:5px;">
                    `;
            grid.appendChild(offsetDiv);

            if (pKey !== 'Sunrise') {
                // Athan
                const athanDiv = document.createElement('div');
                const currentAthan = CONFIG.athanVideos[pKey];
                const athanStatus = (currentAthan && currentAthan.includes('')) ? `Par défaut (${currentAthan.split('/').pop()})` : (currentAthan ? 'Fichier Perso' : 'Par défaut (Générique)');

                athanDiv.innerHTML = `
                            <label style="display:block; font-size:0.8rem; margin-bottom:5px;">${I18N.ar.athan_config}</label>
                            <div style="display:flex; gap:5px;">
                                <div class="real-file-btn" style="flex:1; background:rgba(0,229,255,0.15); color:#00e5ff; border:1px solid #00e5ff; border-radius:5px; padding:8px; cursor:pointer; font-size:0.85rem; display:flex; align-items:center; justify-content:center; gap:5px; position:relative;">
                                    <span>📂 اختر ملف</span>
                                    <input type="file" accept="*/*" onchange="handleAthanFile('${pKey}', this.files[0])" style="position:absolute; top:0; left:0; width:100%; height:100%; opacity:0; z-index:10; cursor:pointer;">
                                </div>
                                <button onclick="testAthan('${pKey}')" style="background:var(--neon-gold); border:none; border-radius:3px; cursor:pointer; padding:8px;" title="Test">▶</button>
                            </div>
                            <div style="font-size:0.7rem; color:#aaa; margin-top:2px;">${athanStatus}</div>
                        `;
                grid.appendChild(athanDiv);

                // Cadre
                const cadreDiv = document.createElement('div');
                cadreDiv.style.cssText = 'grid-column: span 2; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1);';
                const currentCadre = CONFIG.cadres ? CONFIG.cadres[pKey] : null;
                const cadreStatus = (currentCadre && currentCadre.includes('')) ? `Par défaut (${currentCadre.split('/').pop()})` : (currentCadre ? 'Fichier Perso' : 'Par défaut (Générique)');

                cadreDiv.innerHTML = `
                            <label style="display:block; color:var(--neon-cyan); font-size:0.9rem; margin-bottom:5px;">فيديو الكادر (Post-Salat)</label>
                            <div style="display:flex; justify-content:space-between; align-items:center; gap:5px;">
                                 <div class="real-file-btn" style="flex:1; background:rgba(0,229,255,0.15); color:#00e5ff; border:1px solid #00e5ff; border-radius:5px; padding:8px; cursor:pointer; font-size:0.85rem; display:flex; align-items:center; justify-content:center; gap:5px; position:relative;">
                                     <span>📂 اختر ملف</span>
                                     <input type="file" accept="*/*" onchange="handleCadreFile('${pKey}', this.files[0])" style="position:absolute; top:0; left:0; width:100%; height:100%; opacity:0; z-index:10; cursor:pointer;">
                                 </div>
                                 <button onclick="testCadre('${pKey}')" style="background:var(--neon-cyan); color:black; border:none; border-radius:3px; cursor:pointer; padding: 8px;" title="Test">▶</button>
                            </div>
                            <div style="font-size:0.7rem; color:#aaa;">${cadreStatus}</div>
                        `;
                grid.appendChild(cadreDiv);

                // Iqama Duration Input
                const iqamaDiv = document.createElement('div');
                iqamaDiv.style.cssText = 'grid-column: span 2; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1);';
                const currentIqama = getIqamaWaitTime(pKey);

                iqamaDiv.innerHTML = `
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                                <div>
                                    <label style="display:block; color:var(--neon-gold); font-size:0.9rem; margin-bottom:5px;">وقت الإقامة (دقيقة)</label>
                                    <div style="display:flex; align-items:center; gap:10px;">
                                        <input type="number" min="0" max="60" value="${currentIqama}" 
                                            onchange="updateIqamaDuration('${pKey}', this.value)"
                                            style="width:70px; padding:5px; background:rgba(255,255,255,0.1); color:white; border:1px solid rgba(255,255,255,0.2); border-radius:5px; text-align:center;">
                                    </div>
                                </div>
                                <div>
                                    <label style="display:block; color:var(--neon-cyan); font-size:0.9rem; margin-bottom:5px;">${t('salat_duration_label')}</label>
                                    <div style="display:flex; align-items:center; gap:10px;">
                                        <input type="number" min="1" max="120" value="${(CONFIG.salatDurations && CONFIG.salatDurations[pKey]) || 2}" 
                                            onchange="updateSalatDuration('${pKey}', this.value)"
                                            style="width:70px; padding:5px; background:rgba(255,255,255,0.1); color:white; border:1px solid rgba(255,255,255,0.2); border-radius:5px; text-align:center;">
                                    </div>
                                </div>
                            </div>
                        `;
                grid.appendChild(iqamaDiv);
            } else {
                // Shuruq
                const shuruqDiv = document.createElement('div');
                shuruqDiv.innerHTML = `
                        <label style="display:block; font-size:0.8rem; margin-bottom:5px;">فيديو الضحى</label>
                        <div style="display:flex; gap:5px;">
                            <div class="real-file-btn" style="flex:1; background:rgba(0,229,255,0.15); color:#00e5ff; border:1px solid #00e5ff; border-radius:5px; padding:8px; cursor:pointer; font-size:0.85rem; display:flex; align-items:center; justify-content:center; gap:5px; position:relative;">
                                <span>📂 اختر ملف</span>
                                <input type="file" accept="*/*" onchange="handleShuruqFile(this.files[0])" style="position:absolute; top:0; left:0; width:100%; height:100%; opacity:0; z-index:10; cursor:pointer;">
                            </div>
                            <button onclick="testShuruq()" style="background:var(--neon-gold); border:none; border-radius:3px; cursor:pointer; padding:8px;" title="Test">▶</button>
                        </div>
                        <div style="font-size:0.7rem; color:#aaa; margin-top:2px;">${CONFIG.shuruqVideo ? CONFIG.shuruqVideo.split('/').pop() : 'Défaut'}</div>
                     `;
                grid.appendChild(shuruqDiv);
            }

            prayerRow.appendChild(grid);
            container.appendChild(prayerRow);
        });

    } catch (err) {
        console.error("loadSettingsValues error", err);
        showToast("Erreur Settings UI");
    }
}

// V12.0: Handler for Cadre Files
async function handleCadreFile(prayer, file) {
    if (!file) return;
    const key = `cadre_${prayer}`;
    await MediaStorage.save(key, file);

    const url = await writeBlobToLocalFile(file, `${key}.mp4`);
    if (!CONFIG.cadres) CONFIG.cadres = {};
    CONFIG.cadres[prayer] = url;

    showToast(`تم تحديث كادر ${(t("prayers") || {})[prayer] || prayer}`);
    saveSettings();
    loadSettingsValues();
}

// V13.0: Handler for Athan Files
async function handleAthanFile(prayer, file) {
    if (!file) return;
    const key = `athan_${prayer}`;
    await MediaStorage.save(key, file);

    const url = await writeBlobToLocalFile(file, `${key}.mp4`);
    CONFIG.athanVideos[prayer] = url;

    showToast(`تم تحديث أذان ${(t("prayers") || {})[prayer] || prayer}`);
    saveSettings();
    loadSettingsValues();
}

// V13.0: Handler for Shuruq File
async function handleShuruqFile(file) {
    if (!file) return;
    const key = `shuruq`;
    await MediaStorage.save(key, file);

    const url = await writeBlobToLocalFile(file, 'shuruq.mp4');
    CONFIG.shuruqVideo = url;

    showToast(`تم تحديث فيديو الشروق`);
    saveSettings();
    loadSettingsValues();
}

/**
 * Native Handlers for Masjid Mode backgrounds
 */
async function handleMasjidAthanBg(file) {
    if (!file) return;
    await MediaStorage.save('masjid_athan_bg', file);
    localStorage.setItem('masjid_athan_bg_name', file.name || 'custom');
    
    const ext = file.type.startsWith('video/') ? 'mp4' : 'jpg';
    const url = await writeBlobToLocalFile(file, `masjid_athan_bg.${ext}`);
    if (!CONFIG.imamBoard) CONFIG.imamBoard = {};
    CONFIG.imamBoard.athanBgUrl = url;

    const overlay = document.getElementById('masjid-athan-overlay');
    if (overlay) {
        if (file.type.startsWith('video/')) {
            // Video background: inject a video element
            overlay.style.backgroundImage = '';
            let bgVid = overlay.querySelector('.masjid-athan-bg-video');
            if (!bgVid) {
                bgVid = document.createElement('video');
                bgVid.className = 'masjid-athan-bg-video';
                Object.assign(bgVid.style, { position:'absolute', top:'0', left:'0', width:'100%', height:'100%', objectFit:'cover', zIndex:'0' });
                bgVid.autoplay = true;
                bgVid.loop = true;
                bgVid.muted = false;
                bgVid.playsInline = true;
                overlay.insertBefore(bgVid, overlay.firstChild);
            }
            bgVid.src = url;
            bgVid.play().catch(err => console.warn('Athan BG video play error:', err));
        } else {
            overlay.style.backgroundImage = `url('${url}')`;
            overlay.style.backgroundSize = 'cover';
            overlay.style.backgroundPosition = 'center';
        }
    }
    const nameEl = document.getElementById('masjid-athan-bg-name');
    if (nameEl) nameEl.textContent = file.name;
    
    showToast("تم تحديث خلفية الأذان");
    saveSettings();
}

async function handleImamPageBg(idx, file) {
    if (!file || !CONFIG.imamBoard?.pages?.[idx]) return;
    const idbKey = `imam_page_bg_${idx}`;
    await MediaStorage.save(idbKey, file);
    // Mark in localStorage so restoreConfigFromStorage can reload it after restart
    localStorage.setItem(idbKey + '_name', file.name || 'custom');
    
    const ext = file.type.startsWith('video/') ? 'mp4' : 'jpg';
    const url = await writeBlobToLocalFile(file, `${idbKey}.${ext}`);
    CONFIG.imamBoard.pages[idx].bgUrl = url;
    
    showToast(`تم تحديث خلفية الصفحة ${idx + 1}`);
    saveSettings();
    MasjidModeManager.renderSettingsUI();
}

window.handleMasjidAthanBg = handleMasjidAthanBg;
window.handleImamPageBg = handleImamPageBg;
// Helper to test Cadre
function testCadre(prayer) {
    const videoSrc = (CONFIG.cadres && CONFIG.cadres[prayer]) ? CONFIG.cadres[prayer] : CONFIG.athkarBgVideo;
    if (videoSrc) {
        window._isTestingMedia = true;
        const modal = document.getElementById('settings-modal');
        if (modal) modal.classList.add('hidden');

        showPostSalatAthkars(prayer);
        showToast(`Test Cadre: ${(t("prayers") || {})[prayer]}`);
    } else {
        showToast("Pas de cadre défini");
    }
}

// V14.0: Fixed ReferenceError: updateOffset is not defined
function updateOffset(prayer, value) {
    console.log(`Updating offset for ${prayer}: ${value}`);
    if(prayer.toLowerCase() === "dhuhr") CONFIG.prayerOffsets["Dhuhr"] = parseInt(value); CONFIG.prayerOffsets[prayer] = parseInt(value) || 0;
    saveSettings();
    fetchPrayerTimes(); // Refresh times immediately
    showToast(`تم تحديث توقيت ${(t("prayers") || {})[prayer] || prayer}`);
}

window.handleCadreFile = handleCadreFile;
window.handleAthanFile = handleAthanFile;
window.handleShuruqFile = handleShuruqFile;
window.updateOffset = updateOffset;
window.resetAthkarFile = resetAthkarFile;

// --- Init Settings Listeners (Complete) ---
function initSettingsListeners() {
    // 0. Language Select — CRITICAL FIX: was missing event listener
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        // Restore saved language on open
        langSelect.value = localStorage.getItem('athan_lang') || 'ar';
        langSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
            showToast(t("settings") || 'Langue changée');
        });
    }

    // 1. Font Select
    const fontSelect = document.getElementById('font-select');
    if (fontSelect) {
        fontSelect.addEventListener('change', (e) => {
            setFont(e.target.value);
            showToast("تم تغيير الخط");
        });
    }

    // V10.5.1: Background for Athkars Input (Now supports MP4)
    const athkarBgInput = document.getElementById('athkar-bg-input');
    if (athkarBgInput) {
        athkarBgInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                const isVideo = file.type.startsWith('video/');
                if (isVideo) {
                    await MediaStorage.save('athkar_bg', file);
                    const videoUrl = await writeBlobToLocalFile(file, 'athkar_bg.mp4');
                    localStorage.setItem('athan_athkar_bg_type', 'video');
                    window._currentAthkarVideoBlob = videoUrl;
                    CONFIG.athkarBgVideo = videoUrl;
                    showToast("تم حفظ فيديو الخلفية");
                } else {
                    const reader = new FileReader();
                    reader.onload = function (evt) {
                        localStorage.setItem('athan_custom_athkar_bg', evt.target.result);
                        localStorage.setItem('athan_athkar_bg_type', 'image');
                        showToast("تم حفظ خلفية الأذكار");
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
    }



    // V10.7.2: File choice listeners for Athkars & Athan
    // Athan Videos
    ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].forEach(p => {
        const athanInput = document.getElementById(`athan-${p}`);
        if (athanInput) {
            athanInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    await MediaStorage.save(`athan_${p}`, file);
                    CONFIG.athanVideos[p] = await writeBlobToLocalFile(file, `athan_${p}.mp4`);
                    showToast(`تم حفظ فيديو ${p}`);
                    saveSettings();
                }
            });
        }
    });

    // V11.1: Shuruq File Listener
    const shInput = document.getElementById('file-shuruq');
    if (shInput) {
        shInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                await MediaStorage.save('shuruq', file);
                CONFIG.shuruqVideo = await writeBlobToLocalFile(file, 'shuruq.mp4');
                showToast("تم حفظ فيديو الشروق");
                saveSettings();
            }
        });
    }

    // Athkars (V11.9: Now using IndexedDB for persistence to avoid crashes)
    ['morning', 'evening', 'sleep', 'wakeup', 'kahf'].forEach(key => {
        const audioInput = document.getElementById(`file-${key}`);
        if (audioInput) {
            audioInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    await MediaStorage.save(`audio_${key}`, file);
                    const url = await writeBlobToLocalFile(file, `audio_${key}.mp3`);
                    if (key === 'kahf') CONFIG.quran.kahf.url = url;
                    else if (CONFIG.athkars[key]) CONFIG.athkars[key].url = url;

                    showToast(`تم حفظ صوت ${key}`);
                    saveSettings();
                }
            });
        }
    });

    // 2. City Research
    const cityInput = document.getElementById('city-input');
    const saveCityBtn = document.getElementById('save-city-btn');
    if (cityInput && saveCityBtn) {
        const CITY_ARABIC_NAMES = {
            'setif': 'سطيف', 'sétif': 'سطيف',
            'algiers': 'الجزائر', 'alger': 'الجزائر',
            'oran': 'وهران', 'constantine': 'قسنطينة',
            'annaba': 'عنابة', 'blida': 'البليدة',
            'batna': 'باتنة', 'djelfa': 'الجلفة',
            'sidi bel abbès': 'سيدي بلعباس',
            'biskra': 'بسكرة', 'tebessa': 'تبسة',
            'el oued': 'الوادي', 'skikda': 'سكيكدة',
            'tiaret': 'تيارت', 'béjaïa': 'بجاية',
            'tlemcen': 'تلمسان', 'ouargla': 'ورقلة',
            'béchar': 'بشار', 'mostaganem': 'مستغانم',
            'tizi ouzou': 'تيزي وزو', 'bordj bou arreridj': 'برج بوعريريج',
            'chlef': 'الشلف', 'souk ahras': 'سوق أهراس',
            'médéa': 'المدية', 'jijel': 'جيجل',
            'msila': 'المسيلة', 'mascara': 'معسكر',
            'paris': 'باريس', 'lyon': 'ليون',
            'marseille': 'مرسيليا'
        };

        saveCityBtn.addEventListener('click', async () => {
            const query = cityInput.value.trim();
            const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${CONFIG.weatherApiKey}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data && data.length > 0) {
                    const { lat, lon, name, country } = data[0];
                    CONFIG.city = name;
                    CONFIG.country = country;
                    CONFIG.coordinates = { lat, long: lon };
                    localStorage.setItem('athan_city', name);
                    localStorage.setItem('athan_country', country);
                    localStorage.setItem('athan_coords', JSON.stringify({ lat, long: lon }));
                    if (typeof saveSettings === 'function') saveSettings();
                    if (document.querySelector('.city')) document.querySelector('.city').textContent = t('city');
                    if (typeof fetchWeather === 'function') fetchWeather();
                    if (typeof fetchPrayerTimes === 'function') fetchPrayerTimes(true);
                    showToast(`✅ ${name}, ${country} validé`);
                    setTimeout(() => location.reload(), 1500);
                } else {
                    showToast("❌ Ville non trouvée");
                }
            } catch (err) {
                console.error(err);
                showToast("⚠ Erreur de connexion API");
            }
        });
    }

    // --- Robust Settings Modal Close (Fix: ID Binding) ---
    const closeSettings = document.getElementById('close-settings');
    if (closeSettings) {
        closeSettings.onclick = () => {
            const modal = document.getElementById('settings-modal');
            if (modal) modal.classList.add('hidden');
            // Only restore Siyam widget if no media is playing
            const fastingWidget = document.getElementById('fasting-widget');
            const athanContainer = document.getElementById('athan-player-container');
            const iqamaOverlay = document.getElementById('iqama-overlay');
            const cadreContainer = document.getElementById('cadre-player-container');
            const mediaIsActive =
                (athanContainer && !athanContainer.classList.contains('hidden') && athanContainer.style.display !== 'none') ||
                (iqamaOverlay && iqamaOverlay.style.display !== 'none') ||
                (cadreContainer && !cadreContainer.classList.contains('hidden') && cadreContainer.style.display !== 'none');
            if (!mediaIsActive) {
                showSiyamWidget();
            }
        };
    }

    // Sync Settings-Modal visibility with Fasting Widget
    // V41.10: Correct ID to match index.html (open-settings)
    const settingsBtn = document.getElementById('open-settings');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            hideSiyamWidget();
            if (typeof loadSettingsValues === 'function') loadSettingsValues();
        });
    }

    // 3. Other Listeners
    const inputs = document.querySelectorAll('#settings-modal input, #settings-modal select');
    inputs.forEach(input => {
        if (input.type === 'file') return;
        input.addEventListener('change', () => {
            // Sync to CONFIG for specific inputs
            switch (input.id) {
                case 'time-wakeup': CONFIG.athkars.wakeup.time = input.value; break;
                case 'time-morning': CONFIG.athkars.morning.time = input.value; break;
                case 'time-evening': CONFIG.athkars.evening.time = input.value; break;
                case 'time-sleep': CONFIG.athkars.sleep.time = input.value; break;
                case 'time-kahf': CONFIG.quran.kahf.time = input.value; break;
                case 'hijri-offset': CONFIG.hijriOffset = parseInt(input.value) || 0; break;
            }
            saveSettings();
            if (input.id.startsWith('offset-')) fetchPrayerTimes();
            if (input.id === 'hijri-offset') updateClock();
        });
    });


    // True Night Mode (Brightness Reduction)
    const eyeSlider = document.getElementById('eye-protection-range');
    const eyeDisplay = document.getElementById('eye-value-display');
    const brightnessOverlay = document.getElementById('brightness-overlay');

    if (eyeSlider && brightnessOverlay) {
        const applyNightMode = (val) => {
            const opacity = val / 100;
            brightnessOverlay.style.opacity = opacity;
            if (eyeDisplay) eyeDisplay.textContent = `${val}%`;

            // Sync with standard brightness slider if it exists
            const mainSlider = document.getElementById('brightness-slider');
            if (mainSlider) mainSlider.value = opacity;
        };

        // Load initial
        if (CONFIG.eyeIntensity === undefined) CONFIG.eyeIntensity = 0;
        eyeSlider.value = CONFIG.eyeIntensity;
        applyNightMode(CONFIG.eyeIntensity);

        eyeSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            CONFIG.eyeIntensity = val;
            applyNightMode(val);
            saveSettings();
            localStorage.setItem('athan_brightness', val / 100);
        });
    }

    // Wake Lock Toggle (Deduplicated)
    const wakeBtn = document.getElementById('toggle-wake');
    if (wakeBtn) {
        wakeBtn.textContent = CONFIG.wakeLockEnabled ? 'Activé' : 'Désactivé';
        wakeBtn.classList.toggle('active', CONFIG.wakeLockEnabled);
        wakeBtn.addEventListener('click', () => {
            CONFIG.wakeLockEnabled = !CONFIG.wakeLockEnabled;
            saveSettings();
            wakeBtn.textContent = CONFIG.wakeLockEnabled ? 'Activé' : 'Désactivé';
            wakeBtn.classList.toggle('active', CONFIG.wakeLockEnabled);
            if (CONFIG.wakeLockEnabled) requestWakeLock();
        });
    }

    // Quran Player Open
    const openQuranBtn = document.getElementById('open-quran-player-btn');
    if (openQuranBtn) {
        openQuranBtn.addEventListener('click', () => {
            // Start fresh
            const settingsModal = document.getElementById('settings-modal');
            if (settingsModal) settingsModal.classList.add('hidden');

            document.getElementById('quran-player-modal').classList.remove('hidden');

            // Unlock Audio Context explicitly here too
            if (AudioVisualizer && AudioVisualizer.unlockAudio) {
                AudioVisualizer.unlockAudio();
            }
        });
    }

    // Lock Widgets Toggle (V41.1: Fixed ID and Listener)
    const lockToggle = document.getElementById('layout-locked-toggle');
    if (lockToggle) {
        lockToggle.checked = !!CONFIG.layoutLocked;
        lockToggle.addEventListener('change', (e) => {
            CONFIG.layoutLocked = e.target.checked;
            saveSettings();
            // Force refresh of draggable state
            if (typeof initDraggable === 'function') initDraggable();
            showToast(CONFIG.layoutLocked ? "🔒 Disposition verrouillée" : "🔓 Disposition libre");
        });
    }

    // V38.6: Masjid Mode Listeners
    if (typeof MasjidModeManager !== 'undefined') {
        MasjidModeManager.setupListeners();
    }


    // App Logo Input (V11.9.2: Now uses IndexedDB for GIFs/Large files)
    const appLogoInput = document.getElementById('app-logo-input');
    if (appLogoInput) {
        appLogoInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                await MediaStorage.save('app_logo', file);
                const url = await writeBlobToLocalFile(file, 'app_logo.png');
                const settingsBtn = document.getElementById('open-settings');

                settingsBtn.textContent = '';
                settingsBtn.classList.add('has-logo');
                settingsBtn.style.background = 'transparent';

                let img = settingsBtn.querySelector('img');
                if (!img) {
                    img = document.createElement('img');
                    settingsBtn.appendChild(img);
                }
                img.src = url;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '50%';

                window._currentLogoBlob = url;
                showToast("تم تحديث الشعار");
                updateFilenameDisplays();
            }
        });
    }

    // V14.0: Split input for facilite
    const bgInputFiles = document.getElementById('bg-input-files');
    const bgInputFolder = document.getElementById('bg-input-folder');
    const clearBgBtn = document.getElementById('clear-bg-btn');

    const handleBgChange = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        showToast(`⏳ جاري تحميل ${files.length} ملفات...`, 2000);

        // Auto-clear defaults if adding custom
        if (bgFiles.length > 0 && bgFiles[0].name.startsWith('hr')) {
            bgFiles = [];
            await MediaStorage.clear('backgrounds_'); // Clear all keys starting with 'backgrounds_'
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const type = file.type.startsWith('video/') ? 'video' : 'image';
            const key = `backgrounds_${Date.now()}_${i}`;
            const ext = type === 'video' ? 'mp4' : 'jpg';
            await MediaStorage.save(key, file);
            const src = await writeBlobToLocalFile(file, `${key}.${ext}`);
            bgFiles.push({ type, src, name: file.name, key: key });
        }


        updateBgCount();
        renderBackgroundGrid();
        if (bgFiles.length > 0 && !slideshowInterval) {
            startSlideshow();
        }
        showToast("✅ تم تحديث الخلفيات");
    };

    if (bgInputFiles) bgInputFiles.addEventListener('change', handleBgChange);
    if (bgInputFolder) bgInputFolder.addEventListener('change', handleBgChange);

    // V41.13: Manual USB Path Fallback
    const addManualBtn = document.getElementById('add-manual-path-btn');
    const manualInput = document.getElementById('bg-manual-path');
    if (addManualBtn && manualInput) {
        addManualBtn.addEventListener('click', () => {
            const path = manualInput.value.trim();
            if (!path) return;
            
            // On web, we can't 'browse' a path, but if they provide a full URL or local path
            // that the webview can access (like file:///), we can try to add it.
            const type = (path.endsWith('.mp4') || path.endsWith('.mkv')) ? 'video' : 'image';
            const key = `backgrounds_manual_${Date.now()}`;
            
            bgFiles.push({ 
                type, 
                src: path.startsWith('http') || path.startsWith('file') ? path : 'file://' + path, 
                name: path.split('/').pop(), 
                key 
            });
            
            updateBgCount();
            renderBackgroundGrid();
            showToast("✅ Chemin ajouté (Note: Le fichier doit être accessible)");
            manualInput.value = '';
            saveSettings();
        });
    }

    // V38.2: Custom Athkar Backgrounds (Morning/Evening)
    ['morning', 'evening'].forEach(cat => {
        const input = document.getElementById(`file-${cat}-bg`);
        if (input) {
            input.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    showToast("⏳ Uploading Background...");
                    await MediaStorage.save(`athkar_bg_${cat}`, file);
                    const ext = file.type.startsWith('video/') ? 'mp4' : 'jpg';
                    const url = await writeBlobToLocalFile(file, `athkar_bg_${cat}.${ext}`);
                    if (!CONFIG.athkarCustomBgs) CONFIG.athkarCustomBgs = { morning: null, evening: null };
                    CONFIG.athkarCustomBgs[cat] = url;
                    showToast("✅ Background Updated");
                    saveSettings();
                }
            });
        }
    });

    if (clearBgBtn) {
        clearBgBtn.addEventListener('click', async () => {
            if (confirm("هل تريد مسح جميع الخلفيات المخصصة؟")) {
                bgFiles = [];
                await MediaStorage.clear('backgrounds_'); // Clear all keys starting with 'backgrounds_'
                // Reload defaults if needed
                if (CONFIG.useDefaultSlideshow) {
                    checkSlideshowMode(true).then(() => {
                        renderBackgroundGrid();
                    });
                } else {
                    updateBgCount();
                    renderBackgroundGrid();
                    showBackground(0);
                }
                showToast("تم مسح الخلفيات");
            }
        });
    }

    // Slideshow Interval
    const intervalSelect = document.getElementById('slideshow-interval-select');
    if (intervalSelect) {
        intervalSelect.addEventListener('change', (e) => {
            CONFIG.slideshowIntervalSec = parseInt(e.target.value) || 15;
            saveSettings();
            startSlideshow();
        });
    }

    // Enable Mic
    const micBtn = document.getElementById('enable-mic');
    if (micBtn) {
        micBtn.addEventListener('click', () => AudioVisualizer.enableMicrophone());
    }

    // End of consolidated listeners

    // Sync Settings Icon on Load (Handled in restoreMediaFromStorage now)
    // Legacy cleanup if needed
    if (localStorage.getItem('athan_custom_logo')) {
        // We keep it for backward compat but init prefers IndexedDB
    }

    // Reset Athkar BG
    const resetAthkarBgBtn = document.getElementById('reset-athkar-bg');
    if (resetAthkarBgBtn) {
        resetAthkarBgBtn.addEventListener('click', resetAthkarBg);
    }

    // V11.5: Custom Reset Confirmation
    const factoryBtn = document.getElementById('factory-reset-btn');
    const confirmModal = document.getElementById('confirm-modal');
    const confirmYes = document.getElementById('confirm-yes');
    const confirmNo = document.getElementById('confirm-no');

    if (factoryBtn && confirmModal) {
        factoryBtn.addEventListener('click', () => {
            confirmModal.classList.remove('hidden');
        });
    }

    if (confirmNo) {
        confirmNo.addEventListener('click', () => {
            confirmModal.classList.add('hidden');
        });
    }

    if (confirmYes) {
        confirmYes.addEventListener('click', () => {
            localStorage.removeItem('athan_prefs');
            localStorage.removeItem('athan_city');
            localStorage.removeItem('athan_coords');
            localStorage.removeItem('athan_custom_logo');
            localStorage.removeItem('athan_settings_icon');
            localStorage.removeItem('athan_custom_athkar_bg');
            localStorage.removeItem('athan_athkar_bg_type');
            // Delete IndexedDB
            if (window.indexedDB) {
                indexedDB.deleteDatabase('AthanMediaDB');
            }
            location.reload();
        });
    }
}

// V11.8: Custom Reset Functions for each slot
async function resetLogo() {
    localStorage.removeItem('athan_custom_logo');
    localStorage.removeItem('athan_settings_icon');
    await MediaStorage.delete('app_logo'); // Clear from DB

    const settingsBtn = document.getElementById('open-settings');
    if (settingsBtn) {
        settingsBtn.classList.remove('has-logo');
        settingsBtn.style.background = ''; // Reset background
        settingsBtn.textContent = '⚙️';
        const img = settingsBtn.querySelector('img');
        if (img) img.remove();
    }
    window._currentLogoBlob = null;
    showToast("Réinitialisé");
    updateFilenameDisplays();
}

async function resetAthan(prayer) {
    CONFIG.athanVideos[prayer] = DEFAULT_ASSETS.athan[prayer] || 'athan.mp4';
    await MediaStorage.delete(`athan_${prayer}`);
    showToast(`Reset Athan ${prayer}`);
    saveSettings();
}

async function resetMasjidAthanBg() {
    if (!CONFIG.imamBoard) CONFIG.imamBoard = {};
    CONFIG.imamBoard.athanBgUrl = '';
    await MediaStorage.delete('masjid_athan_bg');
    localStorage.removeItem('masjid_athan_bg_name');
    const nameEl = document.getElementById('masjid-athan-bg-name');
    if (nameEl) nameEl.textContent = 'Aucune image';
    const overlay = document.getElementById('masjid-athan-overlay');
    if (overlay) { overlay.style.backgroundImage = 'none'; overlay.style.background = 'black'; }
    showToast('Fond Athan réinitialisé');
    saveSettings();
}

async function resetShuruq() {
    CONFIG.shuruqVideo = DEFAULT_ASSETS.shuruq;
    await MediaStorage.delete('shuruq');
    showToast("Reset Shuruq");
    saveSettings();
}

async function resetAthkarFile(key) {
    const defaults = {
        morning: 'assets/audio/sabah.mp3',
        evening: 'assets/audio/massa.mp3',
        sleep: 'assets/audio/nawm.mp3',
        wakeup: 'assets/audio/wakeup.mp3',
        kahf: 'assets/audio/vendredi.mp3'
    };

    if (key === 'kahf') CONFIG.quran.kahf.url = null;
    else if (CONFIG.athkars[key]) CONFIG.athkars[key].url = defaults[key] || null;

    await MediaStorage.delete(`audio_${key}`);
    const input = document.getElementById(`file-${key}`);
    if (input) input.value = '';

    // Clean UI name
    const label = document.getElementById(`name-file-${key}`);
    if (label) label.textContent = 'Default';

    showToast(`تمت إعادة الضبط (${key})`);
    saveSettings();
}

async function resetAthkarBg(category) {
    if (typeof category === 'string') {
        // V38.2: Categorical reset
        if (!CONFIG.athkarCustomBgs) CONFIG.athkarCustomBgs = { morning: null, evening: null };
        CONFIG.athkarCustomBgs[category] = null;
        await MediaStorage.delete(`athkar_bg_${category}`);
        const input = document.getElementById(`file-${category}-bg`);
        if (input) input.value = '';
        showToast("Photo Réinitialisée");
    } else {
        // Legacy global reset
        localStorage.removeItem('athan_custom_athkar_bg');
        localStorage.removeItem('athan_athkar_bg_type');
        await MediaStorage.delete('athkar_bg');
        CONFIG.athkarBgVideo = 'assets/videos/cadre1.mp4';
        window._currentAthkarVideoBlob = null;
        showToast("تم إعادة تعيين الخلفية");
    }
    updateFilenameDisplays();
    saveSettings();
}

// V11.5: Helper functions for testing media from settings
function testAthkar(key) {
    let url;
    if (key === 'kahf') url = CONFIG.quran.kahf.url;
    else if (key === 'mulk') url = CONFIG.quran.mulk.url;
    else if (key === 'full') url = CONFIG.quran.full.url;
    else url = CONFIG.athkars[key] ? CONFIG.athkars[key].url : null;

    if (url || (key === 'morning' || key === 'evening')) {
        window._isTestingMedia = true;

        // Auto-close settings to see the overlay
        document.getElementById('settings-modal').style.display = 'none';
        playAthkar(url, key);
        showToast(`جاري اختبار أذكار: ${key}`);
    } else {
        showToast("❌ لم يتم اختيار ملف");
    }
}
window.testAthkar = testAthkar;

function testAthan(prayer) {
    window._isTestingMedia = true;
    const modal = document.getElementById('settings-modal');
    if (modal) modal.classList.add('hidden');

    // Standardize playback call
    playAthan(prayer);
    showToast(`جاري اختبار أذان: ${prayer}`);
}

function testShuruq() {
    window._isTestingMedia = true;
    const modal = document.getElementById('settings-modal');
    if (modal) modal.classList.add('hidden');
    triggerShuruqSequence();
}


function testAthkarBg() {
    if (CONFIG.athkarBgVideo || window._currentAthkarVideoBlob) {
        window._isTestingMedia = true;
        const modal = document.getElementById('settings-modal');
        if (modal) modal.classList.add('hidden');
        showPostSalatAthkars('Fajr'); // Test with Fajr to show ALL content (3x Surahs + Dua)
        showToast("جاري اختبار خلفية الأذكار");
    } else {
        showToast("❌ لم يتم اختيار ملف");
    }
}


// --- Timezone-aware time helper ---
function getNowInConfigTZ() {
    const now = new Date();
    if (CONFIG.timezone) {
        try {
            const parts = now.toLocaleString("en-GB", {
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: false, timeZone: CONFIG.timezone
            }).split(':');
            const h = parseInt(parts[0], 10);
            const m = parseInt(parts[1], 10);
            const s = parseInt(parts[2], 10);
            // Return a pseudo Date whose getHours/getMinutes/getSeconds reflect the tz
            const d = new Date(now);
            d._tzH = h; d._tzM = m; d._tzS = s;
            d._tzTimeStr = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
            d._tzHHMM = d._tzTimeStr;
            return d;
        } catch(e) {}
    }
    return now;
}

// --- Check Prayer Time & Trigger Athan ---


function checkPrayerTime(now) {
    // V38.2: Use timezone-aware time for city comparison
    const tzNow = getNowInConfigTZ();
    const tzH = tzNow._tzH !== undefined ? tzNow._tzH : now.getHours();
    const tzM = tzNow._tzM !== undefined ? tzNow._tzM : now.getMinutes();
    const tzS = tzNow._tzS !== undefined ? tzNow._tzS : now.getSeconds();
    const currentTime = `${String(tzH).padStart(2, '0')}:${String(tzM).padStart(2, '0')}`;
    const seconds = tzS;
    const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    for (const prayer of prayers) {
        let prayerTime = prayerTimes[prayer];
        
        if (prayer === 'Dhuhr' && now.getDay() === 5 && typeof CONFIG !== 'undefined' && CONFIG.masjidMode) {
            prayerTime = CONFIG.jumuahTime || '13:30';
        }

        if (!prayerTime) continue;

        // V31.0: PRO WARM-UP TECHNIQUE (Within 2 minutes)
        if (lastAthanMinute !== prayerTime && !isAthanPlaying) {
            const [pH, pM] = prayerTime.split(':').map(Number);
            // V38.2: Build a "virtual now" shifted to TZ so diff is correct
            const tzOffset = (tzH * 60 + tzM) - (now.getHours() * 60 + now.getMinutes());
            const virtualNow = new Date(now.getTime() + tzOffset * 60000);
            const prayerDate = new Date(virtualNow);
            prayerDate.setHours(pH, pM, 0, 0);

            const secondsDiff = (prayerDate - virtualNow) / 1000;

            if (secondsDiff > 0 && secondsDiff <= 120) {
                if (preloadedPrayer !== prayer) {
                    console.log(`Deep Preloading ${prayer} (${Math.round(secondsDiff)}s remaining)...`);
                    preloadAthan(prayer);
                    preloadedPrayer = prayer;
                }
            }

            // V36.4: CATCH-UP LOGIC (Within 2 minutes AFTER prayer)
            const catchUpDiff = (virtualNow - prayerDate) / 1000;
            if (catchUpDiff >= 0 && catchUpDiff <= 120 && lastAthanMinute !== prayerTime) {
                console.log(`Catching up on ${prayer} (${Math.round(catchUpDiff)}s late)...`);
                lastAthanMinute = prayerTime;
                if (prayer === 'Sunrise') {
                    triggerShuruqSequence();
                } else if (!isAthanPlaying) {
                    playAthan(prayer);
                }
            }
        }

        // INSTANT REVEAL (Exactly at 00s)
        if (prayerTime === currentTime && lastAthanMinute !== currentTime) {
            lastAthanMinute = currentTime;
            preloadedPrayer = "";
            if (prayer === 'Sunrise') {
                triggerShuruqSequence();
            } else if (!isAthanPlaying) {
                playAthan(prayer);
            }
            break;
        }
    }

    // Highlight current/active prayer
    prayers.forEach(p => {
        const item = document.getElementById(`prayer-${p}`);
        if (item) item.classList.remove('active');
    });

    // Find the current or next prayer to highlight
    // V38.6: Handle midnight rollover correctly
    const tzNowMin = tzH * 60 + tzM;
    let currentPrayer = null;
    
    // First, check if we are before Fajr (then it's Isha from yesterday)
    const fajrTime = prayerTimes['Fajr'];
    if (fajrTime) {
        const [fH, fM] = fajrTime.split(':').map(Number);
        if (tzNowMin < (fH * 60 + fM)) {
            currentPrayer = 'Isha';
        }
    }

    if (!currentPrayer) {
        for (let i = prayers.length - 1; i >= 0; i--) {
            const pt = prayerTimes[prayers[i]];
            if (!pt) continue;
            const [h, m] = pt.split(':').map(Number);
            const pMin = h * 60 + m;
            if (tzNowMin >= pMin) {
                currentPrayer = prayers[i];
                break;
            }
        }
    }

    if (currentPrayer) {
        const activeItem = document.getElementById(`prayer-${currentPrayer}`);
        if (activeItem) activeItem.classList.add('active');
    }

    // V35.1: Scheduled Athkars were moved to updateClock for better precision with isNewSecond
    // but kept here for fallback or if moved back. Removing duplicate check here to avoid double play.
    /*
    if (CONFIG.athkarsEnabled !== false) {
        ['morning', 'evening', 'sleep', 'wakeup'].forEach(key => {
            const athkar = CONFIG.athkars[key];
            if (athkar && athkar.time === currentTime && athkar.url && now.getSeconds() === 0) {
                playAthkar(athkar.url);
            }
        });
    }
    */

    checkIqamaAndAthkar(now, currentPrayer);
}

// --- Iqama & Post-Prayer Logic ---
let iqamaState = {
    active: false,
    prayer: null,
    endTime: null
};
let postAthkarState = {
    active: false,
    endTime: null
};
let salatState = {
    active: false
};


function checkIqamaAndAthkar(now, currentPrayerName) {
    const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    // If we are already in an active managed state (Iqama/Salat/Athkars), 
    // or if the Athan is currently playing, or if we are in TEST MODE,
    // we do NOT want to re-trigger logic.
    if (iqamaState.active || postAthkarState.active || salatState.active || isAthanPlaying || window.IS_TEST_MODE) {
        return;
    }

    for (const p of prayers) {
        if (p === 'Sunrise') continue; // V38.6: No Iqama/Salat for Shuruq
        const pTime = prayerTimes[p];
        if (!pTime) continue;

        const [h, m] = pTime.split(':').map(Number);
        if (isNaN(h) || isNaN(m)) continue;

        const pDate = new Date(now);
        pDate.setHours(h, m, 0, 0);

        if (isNaN(pDate.getTime())) continue; // Critical safety

        let diffMs = now - pDate;

        // Check window: Trigger within ~50 mins of prayer
        // V10.8.2: If athanStartTime is 0 (fresh load), ONLY auto-trigger if we are 
        // within the first 2 minutes of the prayer time, otherwise wait for manual test.
        const isFreshLoad = (athanStartTime === 0);
        const recoveryWindow = isFreshLoad ? (2 * 60 * 1000) : (50 * 60 * 1000);

        if (diffMs >= 0 && diffMs < recoveryWindow) {

            // Logic:
            // 1. If < IqamaDuration -> Trigger Iqama (if not already done)
            // 2. If > Iqama and < Iqama+Salat -> Trigger Salat (if missed Iqama start)
            // 3. If > Iqama+Salat and < End -> Trigger Athkars (if missed all)

            let iqamaDurationMin = getIqamaWaitTime(p);
            const iqamaDurationMs = iqamaDurationMin * 60 * 1000;
            const salatDurationMs = 5 * 60 * 1000; // 5 mins
            const athkarDurationMs = 15 * 60 * 1000; // 15 mins

            if (diffMs < iqamaDurationMs) {
                // PHASE 1: IQAMA
                // Only start if not already active (handled by top check, but double safety)
                startIqamaSequence(p, iqamaDurationMs, diffMs); // New consolidated entry point
                return;
            } else if (diffMs < (iqamaDurationMs + salatDurationMs)) {
                // PHASE 2: SALAT 
                // If we missed Iqama, start Salat directly
                startSalatSequence(p, (iqamaDurationMs + salatDurationMs) - diffMs);
                return;
            } else if (diffMs < (iqamaDurationMs + salatDurationMs + athkarDurationMs)) {
                // PHASE 3: ATHKARS
                showPostSalatAthkars(p); // Pass prayerName
                return;
            }
        }
    }

    // If nothing active, ensure widgets hidden
    // hideOverlayWidgets(); // Careful, might hide manual opens
}

// REMOVED DUPLICATE FUNCTIONS (showIqama, showSalatPhase, showPostAthkar)
// Consolidated logic below in V10.2 block


// --- Bismillah Autoplay Handling ---
// Removed playBismillah function
// Hook into Init
// ... (Logic in init())

function getNextPrayerTime() {
    if (!prayerTimes) return null;
    const now = new Date();
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    for (const prayer of prayers) {
        const time = prayerTimes[prayer];
        if (!time) continue;
        const [h, m] = time.split(':').map(Number);
        const pDate = new Date(now);
        pDate.setHours(h, m, 0, 0);

        if (pDate > now) return pDate;
    }

    // If all passed, return tomorrow's Fajr
    const fTime = prayerTimes['Fajr'];
    if (!fTime) return null;
    const [h, m] = fTime.split(':').map(Number);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(h, m, 0, 0);
    return tomorrow;
}

function monitorAudioPriority() {
    const now = new Date();
    const nextPrayer = getNextPrayerTime();
    if (!nextPrayer) return;

    const diffMs = nextPrayer - now;
    const minutesUntil = Math.floor(diffMs / 60000);

    // AUDIO SILENCE CONDITIONS
    // V35.1 FIX: Only block if TRULY near prayer (5 min) or during ACTIVE phases (not completed ones)
    const isNearPrayer = (minutesUntil <= 5 && minutesUntil >= 0); // Reduced from 20 to 5 minutes
    const isPhaseActive = isAthanPlaying || iqamaState.active || salatState.active;

    // V11.2: If Quran was started manually, don't pause for preparation (only for real phases)
    if ((isNearPrayer && !QuranPlayer.manualOverride) || isPhaseActive) {
        QuranPlayer.pause();
        // If a phase is active, force override off so it pauses again next time
        if (isPhaseActive) QuranPlayer.manualOverride = false;
    }
}

const QuranPlayer = {
    surahs: Array.from({ length: 114 }, (_, i) => i + 1), // 1..114
    names: ["الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"],
    reciters: [],
    currentServer: "https://server8.mp3quran.net/s_gmd/", // Default: Saad Al-Ghamidi
    currentReciterName: "سعد الغامدي",
    manualOverride: false, // V11.2: Bypasses preparation pause

    init: function () {
        const list = document.getElementById('surah-list');
        const openBtn = document.getElementById('open-quran-player-btn');
        const closeBtn = document.getElementById('close-quran');
        const modal = document.getElementById('quran-player-modal');

        // V36.2: Quran continues playing in background (Equalizer support)
        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.classList.add('hidden');
                modal.style.display = 'none';
                // Keep audio playing for visualizer support
                showToast("ℹ️ Le Coran continue en arrière-plan");
            };
        }
        const reciterSelect = document.getElementById('reciter-select');

        if (openBtn) {
            openBtn.addEventListener('click', () => {
                modal.classList.remove('hidden');
                modal.style.display = 'flex';
                if (typeof this.fetchReciters === 'function') this.fetchReciters();
                if (typeof this.renderSurahList === 'function') this.renderSurahList();
            });
        }

        if (reciterSelect) {
            reciterSelect.addEventListener('change', (e) => {
                const selected = this.reciters.find(r => r.id == e.target.value);
                if (selected) {
                    this.currentServer = selected.moshaf[0].server;
                    this.currentReciterName = selected.name;
                    const title = document.getElementById('quran-player-title');
                    if (title) title.textContent = `القرآن الكريم (${this.currentReciterName})`;
                    showToast(`تم اختيار القارئ: ${this.currentReciterName}`);
                }
            });
        }

        // Initial list generation
        this.renderSurahList();
    },

    fetchReciters: async function () {
        const select = document.getElementById('reciter-select');
        try {
            // V40.0: Added controller with timeout to prevent "freeze" on bad networks
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const response = await fetch('https://mp3quran.net/api/v3/reciters?language=ar', { signal: controller.signal });
            clearTimeout(timeoutId);

            const data = await response.json();
            this.reciters = data.reciters;

            if (select) {
                select.innerHTML = '<option value="">-- اختر القارئ --</option>';
                this.reciters.forEach(r => {
                    const opt = document.createElement('option');
                    opt.value = r.id;
                    opt.textContent = r.name;
                    // Default to Saad Al-Ghamidi (ID 7)
                    if (r.id == 7) opt.selected = true;
                    select.appendChild(opt);
                });
            }
        } catch (e) {
            console.error("Failed to fetch reciters:", e);
            if (select) select.innerHTML = '<option value="">⚠️ خطأ في تحميل القراء</option>';
        }
    },

    renderSurahList: function () {
        const list = document.getElementById('surah-list');
        if (!list) return;
        list.innerHTML = '';
        this.surahs.forEach((num, index) => {
            const btn = document.createElement('button');
            const sName = this.names[index] || `Surah ${num}`;
            btn.className = 'lang-btn';
            btn.textContent = `${num}. ${sName}`;
            btn.style.textAlign = 'right';
            btn.style.pointerEvents = 'auto'; // V41.7: Ensure clickable
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Surah Clicked:", num);
                this.playSurah(num, sName);
            });
            list.appendChild(btn);
        });
    },

    playSurah: function (num, name) {
        const audioEl = document.getElementById('quran-audio-player');
        if (!audioEl) return;

        const paddedNum = String(num).padStart(3, '0');
        let server = this.currentServer;
        if (!server.endsWith('/')) server += '/';
        const url = `${server}${paddedNum}.mp3`;

        showToast(`⏳ جاري تحميل سورة ${name}...`, 3000);
        this.manualOverride = true; // Bypasses auto-pause for preparation

        try {
            audioEl.src = url;
            audioEl.load();

            // Connect to visualizer for equalizer effect
            if (typeof AudioVisualizer !== 'undefined') {
                AudioVisualizer.unlockAudio(); // Ensure context is unlocked
                AudioVisualizer.connectSource(audioEl);
            }

            audioEl.play()
                .then(() => {
                    showToast(`▶ تلاوة سورة ${name}`);
                    const nameEl = document.getElementById('quran-surah-name');
                    if (nameEl) nameEl.textContent = `السورة: ${name} (${this.currentReciterName})`;
                })
                .catch(err => {
                    console.error('Play Error:', err);
                    showToast(`❌ خطأ: ${err.message}`, 8000);
                });

            audioEl.onerror = (e) => {
                const error = audioEl.error;
                let msg = "خطأ في تشغيل الصوت";
                if (error) {
                    switch (error.code) {
                        case 1: msg = "تم إلغاء التحميل"; break;
                        case 2: msg = "خطأ في الشبكة"; break;
                        case 3: msg = "خطأ في فك تشفير الملف"; break;
                        case 4: msg = "المصدر غير مدعوم أو غير موجود"; break;
                    }
                }
                showToast(`❌ ${msg}`, 6000);
                console.error("Audio Error:", error);
            };

        } catch (e) {
            showToast(`❌ خطأ: ${e.message}`, 5000);
        }
    },

    pause: function () {
        const audioEl = document.getElementById('quran-audio-player');
        if (audioEl && !audioEl.paused) {
            audioEl.pause();
            showToast("⏸ Coran en pause (Priorité Prière)");
            const nameEl = document.getElementById('quran-surah-name');
            if (nameEl) nameEl.textContent = "المصحف (متوقف مؤقتاً)";
        }
    }
};


// --- Update Next Prayer Countdown ---
function updateNextPrayer(now) {
    if (typeof PrayerWidget !== 'undefined') {
        PrayerWidget.updateNext(now, prayerTimes, currentLang, I18N, els);
    }
}

let videoMonitorInterval = null;

function closeAthan() {
    console.log("Closing Athan Player...");
    els.athanVideo.pause();
    els.athanVideo.src = ""; // Clear source to free memory
    els.athanVideo.load();
    els.athanContainer.classList.add('hidden');
    els.athanContainer.style.display = 'none';
    isAthanPlaying = false;

    // V41.1: Show Siyam Widget again after Athan
    showSiyamWidget();

    if (videoMonitorInterval) {
        clearInterval(videoMonitorInterval);
        videoMonitorInterval = null;
    }
}

function executeFinalClosure() {
    const prayer = currentPrayerForAthan;
    // V40.0: Capture duration BEFORE closing to sync Iqama timer
    const videoDurationSec = (els.athanVideo && !isNaN(els.athanVideo.duration)) ? els.athanVideo.duration : 0;

    console.log("Executing final closure for prayer:", prayer, "Video duration:", videoDurationSec);
    closeAthan();

    if (prayer && prayer !== 'Sunrise') {
        const totalIqamaMin = getIqamaWaitTime(prayer);

        // V36.6: If testing, don't subtract video duration from total wait time (or use a sensible default)
        // This ensures we always get the full Iqama experience during test
        let remainingSec = (totalIqamaMin * 60);

        if (!window._isTestingMedia) {
            remainingSec -= videoDurationSec;
        } else {
            // Reset test flag
            window._isTestingMedia = false;
        }

        showIqama(prayer, Math.max(remainingSec, 15));
    } else {
        const modal = document.getElementById('settings-modal');
        if (modal) modal.classList.add('hidden');
    }
}

function startVideoMonitoring() {
    if (videoMonitorInterval) clearInterval(videoMonitorInterval);

    const v = els.athanVideo;
    const startTime = Date.now();
    const MAX_ATHAN_DURATION = 10 * 60 * 1000; // 10 minutes hard limit

    const handleEnded = () => {
        console.log("Video explicitly ended or triggered closure.");
        v.removeEventListener('ended', handleEnded);
        v.removeEventListener('timeupdate', checkEnd);
        v.removeEventListener('error', handleEnded); // Also catch errors
        if (videoMonitorInterval) clearInterval(videoMonitorInterval);
        videoMonitorInterval = null;
        executeFinalClosure();
    };

    const checkEnd = () => {
        if (!isAthanPlaying) {
            v.removeEventListener('ended', handleEnded);
            v.removeEventListener('timeupdate', checkEnd);
            v.removeEventListener('error', handleEnded);
            if (videoMonitorInterval) clearInterval(videoMonitorInterval);
            videoMonitorInterval = null;
            return;
        }

        // 1. Natural end (Native)
        if (v.ended) {
            console.log("Monitor detected natural end.");
            handleEnded();
            return;
        }

        // 2. Near-end logic (Fallback)
        if (v.duration > 0 && v.duration !== Infinity) {
            if (v.currentTime >= v.duration - 0.2) {
                console.log("Monitor detected near-end of video.");
                handleEnded();
                return;
            }
        }

        // 3. Hard Safety Limit (10 minutes)
        // This prevents issues with looping videos or unhandled stream ends.
        if (Date.now() - startTime > MAX_ATHAN_DURATION) {
            console.warn("Safety Limit Reached: Forcing Athan Closure (10 min)");
            handleEnded();
            return;
        }
    };

    v.addEventListener('ended', handleEnded);
    v.addEventListener('timeupdate', checkEnd);
    v.addEventListener('error', handleEnded); // Treat errors as end to avoid hanging

    videoMonitorInterval = setInterval(checkEnd, 500); // Check twice a second
}

function triggerShuruqSequence() {
    // V41.6: Always allow Shuruq if triggered (bypass CONFIG if it's broken)
    console.log("REVEALING Shuruq Sequence...");

    // Force reset state to allow transition
    isAthanPlaying = false;
    playAthan('Sunrise');

    showToast("الشروق - Chourouk");
}

// Audio function removed as per user request (Video Only)
const ATHAN_VIDEO_MAPPING = {
    "Fajr": "fajr.mp4",
    "Dhuhr": "dhuhr.mp4",
    "Asr": "asr.mp4",
    "Maghrib": "maghrib.mp4",
    "Isha": "isha.mp4",
    "Sunrise": "shuruq.mp4"
};

function preloadAthan(prayer) {
    // V41.17: Use CONFIG.athanVideos if available (respects user uploads), else fallback to default mapping
    let videoUrl = (CONFIG.athanVideos && CONFIG.athanVideos[prayer]) ? CONFIG.athanVideos[prayer] : null;
    
    // If no custom video, use default mapping
    if (!videoUrl || videoUrl.startsWith('athan.mp4')) {
        const defaultFile = ATHAN_VIDEO_MAPPING[prayer];
        if (defaultFile) {
            videoUrl = "assets/videos/" + defaultFile;
        }
    }

    if (!videoUrl) return;

    console.log(`🎬 [Preload] Waking up hardware buffer for ${prayer}...`);

    // Mode Silencieux
    els.athanVideo.muted = true;
    els.athanVideo.volume = 0;

    // Check if already correct source
    if (!els.athanVideo.src || !els.athanVideo.src.endsWith(videoUrl)) {
        els.athanVideo.src = videoUrl;
        els.athanVideo.load();
    }

    // NO background play here to save CPU
    // The play() call will be done in playAthan() for max performance
    console.log(`✅ [Preload] ${prayer} logic prepared.`);
}

function playAthan(prayer) {
    // Watchdog against black screens
    const watchdog = setTimeout(() => {
        if (els.athanVideo.paused || els.athanVideo.currentTime === 0) {
            console.error("🛑 [Watchdog] Video frozen, falling back to Audio!");
            showToast("⚠️ Basculement sur l'audio (Vidéo trop lente)");
            isAthanPlaying = false;
        }
    }, 5000);

    if (isAthanPlaying && prayer !== 'Sunrise') {
        console.warn("playAthan blocked: isAthanPlaying is true");
        clearTimeout(watchdog);
        return;
    }

    currentPrayerForAthan = prayer;
    athanStartTime = Date.now();

    // V41.17: Use CONFIG.athanVideos if available (respects user uploads), else fallback to default mapping
    let videoUrl = (CONFIG.athanVideos && CONFIG.athanVideos[prayer]) ? CONFIG.athanVideos[prayer] : null;
    
    // If no custom video, use default mapping
    if (!videoUrl || videoUrl.startsWith('athan.mp4')) {
        const defaultFile = ATHAN_VIDEO_MAPPING[prayer];
        if (defaultFile) {
            videoUrl = "assets/videos/" + defaultFile;
        }
    }

    if (!videoUrl) {
        clearTimeout(watchdog);
        showToast(`Athan ${prayer} - Pas de vidéo`);
        if (!window._isTestingMedia) setTimeout(() => showIqama(prayer), 3000);
        window._isTestingMedia = false;
        isAthanPlaying = false;
        return;
    }

    // V38.6: Masjid Mode Shortcut (Replacement instead of Video)
    if (CONFIG.masjidMode) {
        console.log(`🕌 [Masjid] Replacing Athan video for ${prayer} with sequence.`);
        isAthanPlaying = true;
        hideSiyamWidget();
        clearTimeout(watchdog);
        if (typeof MasjidModeManager !== 'undefined') {
            MasjidModeManager.triggerAthanReplacement(prayer);
        } else {
            // Safety fallback if manager is missing
            setTimeout(() => showIqama(prayer), 3000);
        }
        return;
    }

    console.log(`🚀 [Reveal] Unleashing ${prayer}...`);
    isAthanPlaying = true;
    hideSiyamWidget();

    if (els.athanVideo.src !== videoUrl) {
        els.athanVideo.src = videoUrl;
        els.athanVideo.load();
    }

    // V38.9.4: Pre-decode strategy for fluid playback
    if (typeof els.athanVideo.decode === 'function') {
        els.athanVideo.decode().then(() => startVideoPlay()).catch(() => startVideoPlay());
    } else {
        startVideoPlay();
    }

    function startVideoPlay() {
        els.athanVideo.muted = false; 
        els.athanVideo.volume = 1.0;

        els.athanVideo.play().then(() => {
            console.log(`▶️ Athan ${prayer} started successfully.`);
            isAthanPlaying = true;
            clearTimeout(watchdog);
            els.athanVideo.classList.remove('hidden');
            els.athanContainer.style.display = 'flex';
            els.athanContainer.style.opacity = '1';
            const prayerName = t("prayers")[prayer] || prayer;
            showToast(`${prayerName} - الله أكبر`, 3000);
            startVideoMonitoring();
            window._isTestingMedia = false;
        }).catch(err => {
            console.error("❌ [Video] play() failed:", err);
            isAthanPlaying = false;
            clearTimeout(watchdog);
            if (!window._isTestingMedia) showIqama(prayer);
        });
    }
}


// V10.0.0: Post-Salat Athkars Content Database
// V10.4.0: Dynamic Athkars Content (User Request)
// V10.4.0: Dynamic Athkars Content (User Request)
function getAthkarsForPrayer(prayerName) {
    // V11.9.2: Updated rule: 3 times for Fajr, Maghrib, AND Isha
    const isFajrMaghribIsha = (prayerName === 'Fajr' || prayerName === 'Maghrib' || prayerName === 'Isha');
    const isFajrMaghrib = (prayerName === 'Fajr' || prayerName === 'Maghrib'); // Keep specific logic if needed

    const baseAthkars = [
        // 1. Astaghfirullah
        { text: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ', count: '' },
        { text: 'اللَّهُمَّ أَنْتَ السَّلامُ وَمِنْكَ السَّلامُ تَبَارَكْتَ يَا ذَا الْجَلالِ وَالإِكْرَامِ', count: '' },

        // 3. Long version
        { text: 'لا إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، لا حَوْلَ وَلا قُوَّةَ إِلاَّ بِاللَّهِ، لا إِلَهَ إِلاَّ اللَّهُ، وَلا نَعْبُدُ إِلاَّ إِيَّاهُ، لَهُ النِّعْمَةُ وَلَهُ الْفَضْلُ وَلَهُ الثَّنَاءُ الْحَسَنُ', count: '' },

        // 4. Mukhlicina lahu din
        { text: 'لا إِلَهَ إِلاَّ اللَّهُ مُخْلِصِينَ لَهُ الدِّينَ وَلَوْ كَرِهَ الْكَافِرُونَ', count: '' },

        // 5. La mani'a lima a'tayt
        { text: 'اللَّهُمَّ لا مَانِعَ لِمَا أَعْطَيْتَ، وَلا مُعْطِيَ لِمَا مَنَعْتَ، وَلا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ', count: '' },

        // 6. Tasbih 33
        { text: 'سُبْحَانَ اللَّهِ (33) <br> الْحَمْدُ لِلَّهِ (33) <br> اللَّهُ أَكْبَرُ (33)', count: '' },

        // 7. Litamam al-miah
        { text: 'لا إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', count: 'لتمام المائة' }
    ];

    // 8. Fajr/Maghrib specific (10 times)
    if (isFajrMaghrib) {
        baseAthkars.push({
            text: 'لا إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
            count: '10 مرات بعد صلاة الفجر والمغرب'
        });
    }

    // 9. Ayat al-Kursi
    baseAthkars.push({ text: 'آيَةُ الْكُرْسِيِّ (اللَّهُ لا إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ...)', count: 'مرة واحدة' });

    // 10. Surahs (1x or 3x)
    const surahText = 'سُورَةُ الإِخْلاصِ (قُلْ هُوَ اللَّهُ أَحَدٌ...)<br>سُورَةُ الْفَلَقِ (قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ...)<br>سُورَةُ النَّاسِ (قُلْ أَعُوذُ بِرَبِّ النَّاسِ...)';
    baseAthkars.push({
        text: surahText,
        count: isFajrMaghribIsha ? 'قراءة المعوذات (3 مرات)' : 'قراءة المعوذات (مرة واحدة)'
    });

    // Final Dua
    baseAthkars.push({ text: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ، وَشُكْرِكَ، وَحُسْنِ عِبَادَتِكَ', count: '' });

    if (prayerName === 'Fajr') {
        baseAthkars.push({
            text: 'اللَّهُمَّ ارْزُقْنَا عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
            count: 'بعد صلاة الفجر'
        });
    }

    return baseAthkars;
}


// V10.0.0: Iqama and Athkars Control
// V10.1.3: Improved Iqama & Athan Sequence Logic
// V10.1.8: Sync Iqama Time with Athan Start (Video Duration Inclusive)
let athanStartTime = 0;
let iqamaFrameId = null;
let iqamaEndTime = 0;
let athkarsTimeout = null;
let currentPrayerForIqama = '';
let currentPrayerForAthan = '';

function getIqamaWaitTime(prayer) {
    try {
        let saved = JSON.parse(localStorage.getItem("athan_prefs_v36") || "{}");
        if (saved.iqamaDurations && saved.iqamaDurations[prayer] !== undefined) {
            return parseInt(saved.iqamaDurations[prayer]);
        }
    } catch(e) { console.warn("Read Iqama Error", e); }
    if (CONFIG.iqamaDurations && CONFIG.iqamaDurations[prayer] !== undefined) return parseInt(CONFIG.iqamaDurations[prayer]);
    return (prayer === "Maghrib") ? 5 : 10;
}

function updateIqamaDuration(prayer, value) {
    console.log(`Updating Iqama duration for ${prayer}: ${value}`);
    if (!CONFIG.iqamaDurations) CONFIG.iqamaDurations = {};
    CONFIG.iqamaDurations[prayer] = parseInt(value) || 0;
    saveSettings();
    showToast(`تم تحديث وقت إقامة ${(t("prayers") || {})[prayer] || prayer}`);
}
window.updateIqamaDuration = updateIqamaDuration;

function updateSalatDuration(prayer, val) {
    if (!CONFIG.salatDurations) CONFIG.salatDurations = {};
    CONFIG.salatDurations[prayer] = parseInt(val) || 2;
    if (typeof saveSettings === "function") saveSettings();
}
window.updateSalatDuration = updateSalatDuration;

function updatePrayerListOrientation(val) {
    CONFIG.prayerListOrientation = val;
    const list = document.getElementById('prayer-list');
    if (list) {
        const isRow = (val === 'row');
        list.style.flexDirection = val;
        list.style.flexWrap = isRow ? 'wrap' : 'nowrap';
        list.style.gap = isRow ? '15px' : '0';
        list.style.width = isRow ? 'max-content' : '';
        list.style.maxWidth = isRow ? 'none' : '';
        
        if (isRow) list.classList.add('is-row-layout');
        else list.classList.remove('is-row-layout');
        
        // V38.6: Apply to current items
        list.querySelectorAll('.prayer-item').forEach(item => {
            item.style.width = isRow ? 'auto' : '100%';
            if (isRow) {
                item.style.minWidth = '110px';
                item.style.flexDirection = 'column';
                item.style.padding = '8px 12px';
            } else {
                item.style.minWidth = '';
                item.style.flexDirection = '';
                item.style.padding = '';
            }
        });
    }
    saveSettings();
}
window.updatePrayerListOrientation = updatePrayerListOrientation;

// NEW: Consolidated Entry Point
function startIqamaSequence(prayerName, durationMs, elapsedMs) {
    console.log(`Starting Iqama Sequence for ${prayerName} | Dur: ${durationMs} | Elapsed: ${elapsedMs}`);

    // Safety: if inputs are NaN or invalid, skip
    if (isNaN(durationMs) || isNaN(elapsedMs)) {
        console.warn("Invalid inputs for Iqama Sequence, skipping.");
        return;
    }

    iqamaState.active = true;
    iqamaState.prayer = prayerName;

    // Calculate remaining
    let remainingOriginal = (durationMs - elapsedMs) / 1000;

    // V10.8.1: Test Mode Duration (5 mins override)
    if (window.IS_TEST_MODE) {
        remainingOriginal = 300;
        console.log("TEST MODE: Forcing 5 min Iqama");
    }

    const remainingSafe = Math.max(remainingOriginal, 15); // Min 15s

    showIqama(prayerName, remainingSafe);
}

// Renamed to match legacy call, but smarter
function showIqama(prayerName, durationSec) {
    // V10.8.2: Use default or test duration if missing
    let finalDurationSec = durationSec;
    isAthanPlaying = false; // CRITICAL: Reset state for next trigger

    if (finalDurationSec === undefined || isNaN(finalDurationSec)) {
        if (window.IS_TEST_MODE || window._isTestingMedia) {
            finalDurationSec = 60; // 1 min for test
        } else {
            finalDurationSec = getIqamaWaitTime(prayerName) * 60;
        }
    }

    console.log(`Starting Iqama Display: ${finalDurationSec}s for ${prayerName}`);
    iqamaState.active = true; // V36.6: MUST BE TRUE for the loop to run
    salatState.active = false;

    // Stop any existing
    if (iqamaFrameId) {
        cancelAnimationFrame(iqamaFrameId);
        iqamaFrameId = null;
    }

    // Safety check
    if (finalDurationSec <= 0) {
        console.warn("Invalid Iqama duration:", finalDurationSec);
        closeIqama();
        return;
    }

    // V31.1: Always use relative time to prevent duration jumps
    iqamaEndTime = Date.now() + (finalDurationSec * 1000);

    // V41.x: Use the habituel iqama-fullscreen
    const iqamaEl = document.getElementById('iqama-fullscreen');
    if (iqamaEl) {
        iqamaEl.classList.remove('hidden');
        iqamaEl.classList.add('show');
    }
    
    // Hide ANY Masjid-specific overlay if it was there
    const iqamaOverlay = document.getElementById('iqama-overlay');
    if (iqamaOverlay) iqamaOverlay.style.display = 'none';

    hideSiyamWidget();

    // Label
    const label = document.getElementById('iqama-label');
    const prayerTitle = (I18N[currentLang] && t("prayers")[prayerName]) ? t("prayers")[prayerName] : prayerName;
    if (label) label.textContent = `الإقامة لصلاة ${prayerTitle}`;


    function tick() {
        const now = Date.now();
        const remainingMs = iqamaEndTime - now;

        // V36.5: USE Math.floor for more natural feel, or ceil with offset
        // We'll use Math.floor(remainingMs / 1000) but add 999ms if we want ceil behavior
        // actually floor( (ms + 999) / 1000 ) is the same as ceil( ms / 1000 )
        const remainingSec = Math.floor((remainingMs + 999) / 1000);

        if (remainingMs <= 0) {
            if (iqamaFrameId) cancelAnimationFrame(iqamaFrameId);
            iqamaFrameId = null;
            console.log("✅ Iqama countdown reached zero, moving to Salat Phase.");
            closeIqama();
            // V41.18: Pass default salat duration if missing
            const salatDur = (CONFIG.salatDurations && CONFIG.salatDurations[prayerName]) ? CONFIG.salatDurations[prayerName] * 60 * 1000 : 5 * 60 * 1000;
            startSalatSequence(prayerName, salatDur);
            return;
        }

        const minutes = Math.floor(remainingSec / 60);
        const seconds = remainingSec % 60;
        const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        const el = document.getElementById('iqama-countdown-display');
        if (el && el.textContent !== display) {
            el.textContent = display;
        }

        // Smooth loop
        if (iqamaState.active) {
            iqamaFrameId = requestAnimationFrame(tick);
        }
    }

    // V36.5: Transitioned from setInterval to requestAnimationFrame for zero-stutter
    if (iqamaFrameId) cancelAnimationFrame(iqamaFrameId);
    iqamaFrameId = requestAnimationFrame(tick);
}

// SALAT PHASE LOGIC
let salatTimeout = null;
function preloadAthkarCadre(prayerName) {
    const bgVideo = document.getElementById('athkar-bg-video');
    let videoSrc = DEFAULT_ASSETS.cadres[prayerName] || CONFIG.athkarBgVideo;

    if (bgVideo && videoSrc) {
        console.log(`WARM-UP: Secretly starting Athkar Cadre for ${prayerName}...`);
        bgVideo.src = videoSrc;
        bgVideo.muted = true;
        bgVideo.volume = 0;
        bgVideo.style.display = 'block';
        bgVideo.style.opacity = '0';
        bgVideo.play().catch(e => console.warn("Cadre warm-up error", e));
    }
}

function startSalatSequence(prayerName, durationMs) {
    if (typeof durationMs === 'undefined') {
        const customMin = (CONFIG.salatDurations && CONFIG.salatDurations[prayerName]) ? CONFIG.salatDurations[prayerName] : 2;
        durationMs = customMin * 60000;
    } // Default 2 mins
    console.log(`🕌 === ENTERING startSalatSequence ===`);
    console.log(`   Prayer: ${prayerName}`);
    console.log(`   Duration: ${durationMs}ms (${durationMs / 1000}s)`);

    // Test Mode duration override
    const finalDurationMs = (window.IS_TEST_MODE || window._isTestingMedia) ? 30000 : durationMs;

    console.log(`   Final Duration: ${finalDurationMs}ms`);
    console.log(`   Starting Salat Phase for ${finalDurationMs}ms`);

    iqamaState.active = false; // Iqama done
    salatState.active = true;  // Salat started
    console.log(`   States updated - Iqama: false, Salat: true`);

    // V31.1: WARM-UP ATHKAR CADRE NOW (5 mins ahead)
    preloadAthkarCadre(prayerName);

    // Ensure Iqama is closed
    closeIqama();

    // V41.x: Use habituel salat-qaima-overlay
    const salatQaima = document.getElementById('salat-qaima-overlay');
    if (salatQaima) {
        salatQaima.style.display = 'flex';
        salatQaima.classList.add('active');
        
        const p1 = document.getElementById('sq-p1');
        const p2 = document.getElementById('sq-p2');
        const p3 = document.getElementById('sq-p3');
        if (p1) p1.textContent = t('salat_humility');
        if (p2) p2.textContent = t('salat_title');
        if (p3) p3.textContent = ""; 
    }
    
    // Ensure generic salat-overlay is hidden
    const overlay = document.getElementById('salat-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
        overlay.style.display = 'none';
    }

    if (salatTimeout) {
        console.log(`   Clearing previous salatTimeout`);
        clearTimeout(salatTimeout);
    }

    console.log(`   Setting timeout for ${finalDurationMs}ms`);
    salatTimeout = setTimeout(() => {
        console.log(`=== SALAT PHASE COMPLETE ===`);
        // End Salat -> Start Athkars
        salatState.active = false; // Salat done
        // Hide Overlays
        const salatQaima = document.getElementById('salat-qaima-overlay');
        if (salatQaima) {
            salatQaima.style.display = 'none';
            salatQaima.classList.remove('active');
        }
        const overlay = document.getElementById('salat-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            overlay.style.display = 'none';
        }

        // End Test Mode after cycle
        const wasTest = window.IS_TEST_MODE;
        window.IS_TEST_MODE = false;

        console.log(`📿 Launching Post-Salat Athkars for ${prayerName}`);
        showPostSalatAthkars(prayerName);
    }, finalDurationMs);

    console.log(`🕌 === EXIT startSalatSequence ===`);
}

// Removed updateIqamaDisplayFrame as it is now strictly inside showIqama

// Legacy function removed

function closeIqama() {
    const iqamaEl = document.getElementById('iqama-fullscreen');
    if (iqamaEl) {
        iqamaEl.classList.add('hidden');
        iqamaEl.classList.remove('show');
    }
    
    // V38.6: Hide Masjid Overlay
    const iqamaOverlay = document.getElementById('iqama-overlay');
    if (iqamaOverlay) {
        iqamaOverlay.style.display = 'none';
        iqamaOverlay.classList.remove('active');
    }

    // V41.4: Show Siyam Widget again after Iqama
    showSiyamWidget();
    if (iqamaFrameId) {
        cancelAnimationFrame(iqamaFrameId); // FIXED: Use cancelAnimationFrame to match showIqama
        iqamaFrameId = null;
    }
    iqamaState.active = false; // V36.6: Reset state
    // Reset start time for next cycle logic
    athanStartTime = 0;
}

function showPostSalatAthkars(prayerName) {
    try {
        console.log('Starting showPostSalatAthkars (Cadres V12) for:', prayerName);

        // Cleanup Previous States (call BEFORE widget hide so closeIqama doesn't re-show it)
        closeIqama();
        const salatOverlay = document.getElementById('salat-overlay');
        if (salatOverlay) {
            salatOverlay.classList.add('hidden');
            salatOverlay.style.display = 'none';
            salatOverlay.innerHTML = ''; // Force clear to remove any Gold text
        }
        salatState.active = false;

        // V41.3: Hide Siyam Widget during Athkar (AFTER closeIqama to override re-show)
        hideSiyamWidget();

        const overlay = document.getElementById('post-salat-athkars');
        if (!overlay) return;

        // 1. Set Background (Cadre)
        // Priority: User Custom (CONFIG.cadres) > Default (DEFAULT_ASSETS.cadres) > Global BG (CONFIG.athkarBgVideo)
        const bgVideo = document.getElementById('athkar-bg-video');
        let videoSrc = (CONFIG.cadres && CONFIG.cadres[prayerName]) ? CONFIG.cadres[prayerName] : null;
        if (!videoSrc) videoSrc = DEFAULT_ASSETS.cadres ? DEFAULT_ASSETS.cadres[prayerName] : null;
        if (!videoSrc) videoSrc = CONFIG.athkarBgVideo;

        if (bgVideo && videoSrc) {
            // Force reload if src changed (needed for custom cadres)
            if (bgVideo.src !== videoSrc) {
                bgVideo.src = videoSrc;
                bgVideo.load();
            }
            bgVideo.muted = false;
            bgVideo.volume = 1.0;
            bgVideo.style.opacity = '1';
            bgVideo.classList.remove('hidden'); // CRITICAL: Reveal video
            bgVideo.currentTime = 0;
            bgVideo.play().catch(e => {
                console.warn("Reveal failed, doing hard start:", e);
                bgVideo.src = videoSrc;
                bgVideo.load();
                bgVideo.play();
            });
            overlay.classList.remove('hidden'); // Reveal container
            overlay.style.display = 'block';
            overlay.style.background = 'black';

            // Test Mode Auto-Close
            if (window._isTestingMedia) {
                bgVideo.onended = () => {
                    closePostSalatAthkars();
                };
            } else {
                bgVideo.onended = null;
                bgVideo.loop = true; // Ensure loop for real usage
            }
        }

        // 2. Set Content (Title & Specific Text)
        const scroller = document.getElementById('athkars-scroller');
        if (scroller) {
            scroller.innerHTML = ''; // Clear previous content

            // Build original scrolling structure
            const scrollContainer = document.createElement('div');
            scrollContainer.className = 'scrolling-text-container';
            
            const scrollContent = document.createElement('div');
            scrollContent.className = 'scrolling-text-content';
            // Use original animation from style.css
            scrollContent.style.animation = 'masjidScrollUp 120s linear 1 forwards';

            // Phrases matching original 5-month logic
            const FULL_TEHLIL_1 = "لا إله إلا الله، وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير";
            const HELP_DUA = "اللهم أعني على ذكرك وشكرك وحسن عبادتك";
            const ATHKAR_LIST_COMMON = [
                "أستغفر الله، أستغفر الله، أستغفر الله",
                "اللهم أنت السلام، ومنك السلام، تباركت يا ذا الجلال والإكرام",
                FULL_TEHLIL_1,
                "لا حول ولا قوة إلا بالله، لا إله إلا الله، ولا نعبد إلا إياه، له النعمة، وله الفضل، وله الثناء الحسن",
                "لا إله إلا الله مخلصين له الدين ولو كره الكافرون",
                "اللهم لا مانع لما أعطيت، ولا معطي لما منعت، ولا ينفع ذا الجد منك الجد"
            ];
            const MUAWWIDHAT_3 = "قراءة المعوذات (الإخلاص، الفلق، الناس) - (3 مرات)";
            const MUAWWIDHAT_1 = "قراءة المعوذات (الإخلاص، الفلق، الناس) - (مرة واحدة)";
            const TEHLIL_10 = "لا إله إلا الله، وحده لا شريك له، له الملك وله الحمد، يحيي ويميت، وهو على كل شيء قدير (10 مرات)";

            let athkarLines = [...ATHKAR_LIST_COMMON];
            const pLower = prayerName.toLowerCase();
            athkarLines.push("سبحان الله (33 مرة)، والحمد لله (33 مرة)، والله أكبر (33 مرة)");
            athkarLines.push(FULL_TEHLIL_1);
            if (pLower === 'fajr' || pLower === 'maghrib') athkarLines.push(TEHLIL_10);
            athkarLines.push("آية الكرسي (الله لا إله إلا هو الحي القيوم...)");
            if (pLower === 'fajr' || pLower === 'maghrib') {
                athkarLines.push(MUAWWIDHAT_3);
                if (pLower === 'fajr') athkarLines.push("اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً");
            } else if (pLower !== 'sunrise') {
                athkarLines.push(MUAWWIDHAT_1);
            } else {
                // Sunrise fallback
                athkarLines = ["سبحان الله و بحمده (100 مرة)"];
            }
            if (['dhuhr', 'asr', 'maghrib', 'isha'].includes(pLower)) {
                athkarLines.push(HELP_DUA);
            }

            scrollContent.innerHTML = athkarLines.map(line => 
                `<div style="margin-bottom:40px; font-family:'Aref Ruqaa'; color:#FFD700; text-shadow:2px 2px 4px black; font-size: 3.5rem; text-align:center;">${line}</div>`
            ).join('');

            scrollContainer.appendChild(scrollContent);
            scroller.appendChild(scrollContainer);

            // Natural end
            if (athkarsTimeout) clearTimeout(athkarsTimeout);
            athkarsTimeout = setTimeout(closePostSalatAthkars, 125000); 
        }

        // Show Overlay
        overlay.classList.remove('hidden');
        overlay.style.display = 'block';
        postAthkarState.active = true;
    } catch (err) {
        console.error("Error in showPostSalatAthkars:", err);
        showToast("Erreur affichage Athkars");
    }
}

function closePostSalatAthkars() {
    console.log("📕 Closing Post-Salat Athkars");

    const overlay = document.getElementById('post-salat-athkars');
    if (overlay) {
        overlay.classList.remove('show');
        overlay.classList.add('hidden');
    }

    // V41.4: Show Siyam Widget again after Athkars
    showSiyamWidget();
    // Stop Video
    const bgVideo = document.getElementById('athkar-bg-video');
    if (bgVideo) {
        bgVideo.pause();
        bgVideo.currentTime = 0;
    }

    if (athkarsTimeout) {
        clearTimeout(athkarsTimeout);
        athkarsTimeout = null;
    }

    // V35.1 FIX: Reset state to allow Quran playback
    postAthkarState.active = false;
    console.log("✅ postAthkarState.active reset to false");

    // Restore Settings ONLY if explicitly requested, otherwise stay on Home (User Request)
    // if (window._isTestingMedia) { ... removed ... }
    window._isTestingMedia = false; // Reset flag
}

// Close button for Athkars
document.getElementById('close-athkars').addEventListener('click', closePostSalatAthkars);

// V11.0.1: Close Button Listener (CRITICAL FIX)
if (els.closeAthanBtn) {
    els.closeAthanBtn.addEventListener('click', (e) => {
        console.log("Manual close requested via button.");
        e.stopPropagation();
        executeFinalClosure();
    });
}

// --- Handle Background Files ---
async function handleBgFiles(files) {
    // Check if we are adding to defaults
    if (bgFiles.length > 0 && bgFiles[0].name && bgFiles[0].name.startsWith('hr')) {
        // First time adding custom: clear defaults
        bgFiles = [];
        // Also clear defaults from DB if any (unlikely but safe)
    }

    for (const file of files) {
        const type = file.type.startsWith('video') ? 'video' : 'image';
        const ext = type === 'video' ? 'mp4' : 'jpg';
        const uniqueKey = `bg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await MediaStorage.save(uniqueKey, file);
        const src = await writeBlobToLocalFile(file, `${uniqueKey}.${ext}`);

        // Add to runtime array
        bgFiles.push({ type, src, name: file.name });
    }

    updateBgCount();
    renderBackgroundGrid(); // Re-render to update selection
    showToast("تم إضافة الخلفيات وحفظها");

    // Start slideshow if we just added files to an empty list
    if (bgFiles.length > 0 && !slideshowInterval) {
        startSlideshow();
    }
}

function updateBgCount() {
    const countEl = document.getElementById('bg-count');
    if (countEl) countEl.textContent = `${bgFiles.length} ملفات sélectionnés`;
}


// === DYNAMIC SLIDESHOW VENDREDI & NORMAL ===
let currentSlideshowMode = null; // 'normal' or 'friday'
let isSlideshowFetching = false;

function isFridayModeActive(now) {
    const day = now.getDay(); // 0=Sun ... 4=Thu, 5=Fri

    // Fallback: if prayerTimes not loaded yet, use generous estimate 20:00
    let maghribHour = 20;
    let maghribMin = 0;
    if (prayerTimes && prayerTimes['Maghrib']) {
        try {
            [maghribHour, maghribMin] = prayerTimes['Maghrib'].split(':').map(Number);
        } catch(e) {}
    }

    const maghribToday = new Date(now);
    maghribToday.setHours(maghribHour, maghribMin, 0, 0);

    if (day === 4) { // Thursday after Maghrib
        return now >= maghribToday;
    } else if (day === 5) { // Friday before Maghrib
        return now < maghribToday;
    }
    return false;
}

async function fetchSlidesDirectory(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) return [];
        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a');
        const files = [];
        links.forEach(a => {
            const href = a.getAttribute('href');
            if (href && (href.toLowerCase().endsWith('.jpg') || href.toLowerCase().endsWith('.png') || href.toLowerCase().endsWith('.webp'))) {
                files.push(href);
            }
        });
        return files;
    } catch (e) {
        return [];
    }
}

async function checkSlideshowMode(force = false) {
    if (isSlideshowFetching && !force) return; // force=true bypasses guard

    const now = new Date();
    const isFriday = isFridayModeActive(now);
    const targetMode = isFriday ? 'friday' : 'normal';

    // Verrouillage Vendredi : Force le mode vendredi même si des images manuelles existent
    if (isFriday) {
        force = true;
    }

    // Ne pas écraser en mode normal si l'utilisateur a sélectionné des images manuellement
    if (!force && bgFiles.length > 0 && bgFiles.some(f => !f.isDefault)) return;

    if (force || currentSlideshowMode !== targetMode) {
        isSlideshowFetching = true;
        currentSlideshowMode = targetMode;
        console.log("🔄 Basculement du Slideshow vers le mode :", targetMode);

        const folder = targetMode === 'friday' ? 'assets/slides_jumuah/' : 'assets/slides/';
        let newSlides = [];

        // 1. Essai avec Cordova/Android Bridge
        if (window.flutterBridge && window.flutterBridge.listSlides) {
            try {
                const filesStr = window.flutterBridge.listSlides('www/' + folder);
                const files = JSON.parse(filesStr);
                if (files && files.length > 0) {
                    files.forEach(f => newSlides.push({ type: 'image', src: folder + f, name: f, isDefault: true }));
                }
            } catch (e) { console.warn("Erreur Bridge:", e); }
        }

        // 2. Essai avec HTTP Fetch (TV Bro via Serveur Local)
        if (newSlides.length === 0) {
            const files = await fetchSlidesDirectory(folder);
            if (files.length > 0) {
                files.forEach(f => newSlides.push({ type: 'image', src: folder + f, name: f, isDefault: true }));
            }
        }

        // 3. Fallback en cas d'échec total ou dossier vide
        if (newSlides.length === 0) {
            if (targetMode === "friday") {
                for (let i = 1; i <= 22; i++) {
                    newSlides.push({ type: "image", src: `assets/slides_jumuah/jumuah${i}.jpg`, name: `jumuah${i}.jpg`, isDefault: true });
                }
            } else {
                for (let i = 1; i <= 54; i++) {
                    newSlides.push({ type: "image", src: `assets/slides/hr${i}.jpg`, name: `hr${i}.jpg`, isDefault: true });
                }
            }
        }
        
        bgFiles = newSlides; // Assignation critique qui manquait !
        currentBgIndex = 0;
        if (typeof updateBgCount === 'function') updateBgCount();
        if (typeof startSlideshow === 'function') startSlideshow();
        
        isSlideshowFetching = false;
    }
}
// ==========================================



// V38.6: Friday logic cleanup (duplicates removed)

// ==========================================

function startSlideshow() {
    if (slideshowInterval) clearInterval(slideshowInterval);

    showBackground(0);

    if (bgFiles.length > 1) {
        const intervalMs = (CONFIG.slideshowIntervalSec || 15) * 1000;
        slideshowInterval = setInterval(() => {
            currentBgIndex = (currentBgIndex + 1) % bgFiles.length;
            showBackground(currentBgIndex);
        }, intervalMs);
    }
}

// --- Background Transitions (Cross-Fade) ---
let currentLayer = 1;

function showBackground(index) {
    const bg = bgFiles[index];
    if (!bg) return;

    const layer1 = document.getElementById('bg-layer-1');
    const layer2 = document.getElementById('bg-layer-2');
    const bgVideo = document.getElementById('bg-video');

    if (bg.type === 'video') {
        layer1.classList.remove('active');
        layer2.classList.remove('active');
        
        // V38.9.21: Robust Video Looping & Same-Source Prevention
        const targetSrc = bg.src.startsWith('blob:') ? bg.src : bg.src; // Handle both local and blob
        if (bgVideo.src !== targetSrc && !bgVideo.src.includes(bg.src)) {
            bgVideo.src = bg.src;
            bgVideo.load(); // Force load for new sources
        }
        
        bgVideo.loop = true; // Force loop attribute
        bgVideo.classList.remove('hidden');
        bgVideo.classList.add('active');
        
        // Ensure play is called and handled safely
        const playPromise = bgVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn("Autoplay prevented or video error:", error);
            });
        }
    } else {
        bgVideo.pause();
        bgVideo.classList.add('hidden');
        bgVideo.classList.remove('active');

        const nextLayer = (currentLayer === 1) ? layer2 : layer1;
        const prevLayer = (currentLayer === 1) ? layer1 : layer2;

        nextLayer.style.backgroundImage = `url('${bg.src}')`;

        // V39: Page Turn Effect
        prevLayer.classList.remove('active');
        prevLayer.classList.add('turn-out');
        
        nextLayer.classList.add('active');
        
        // Update currentLayer tracker
        currentLayer = (currentLayer === 1) ? 2 : 1;

        // Cleanup after animation (2s)
        setTimeout(() => {
            if (!prevLayer.classList.contains('active')) {
                prevLayer.classList.remove('turn-out');
                prevLayer.style.backgroundImage = 'none';
            }
        }, 2000);
    }
}

// Moved to utils.js

function stopSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
}

// --- Render Background Grid in Settings ---
function renderBackgroundGrid() {
    if (typeof BackgroundWidget !== 'undefined') {
        BackgroundWidget.renderGrid(bgFiles, currentBgIndex, {
            onDelete: async (index) => {
                const bgToDelete = bgFiles[index];
                if (bgToDelete.key) await MediaStorage.delete(bgToDelete.key);
                bgFiles.splice(index, 1);
                if (index === currentBgIndex) {
                    currentBgIndex = 0;
                    if (bgFiles.length > 0) showBackground(0);
                } else if (index < currentBgIndex) {
                    currentBgIndex--;
                }
                updateBgCount();
                renderBackgroundGrid();
                showToast("تم حذف الصورة ");
            },
            onSelect: (index) => {
                currentBgIndex = index;
                showBackground(index);
                renderBackgroundGrid();
            }
        });
    }
}

// =====================================================
// STORAGE V36.0 - Dual-layer: localStorage + IndexedDB
// Saves ALL user choices, never saves blob: URLs
// =====================================================
const PREFS_KEY = 'athan_prefs_v36';

function buildSettingsSnapshot() {
    // Sanitize paths: never save blob: URLs (they die on restart)
    function sanitizePath(p) {
        if (!p || p.startsWith('blob:')) return null;
        return p;
    }
    const athanVideos = {};
    Object.keys(CONFIG.athanVideos || {}).forEach(k => {
        athanVideos[k] = sanitizePath(CONFIG.athanVideos[k]) || DEFAULT_ASSETS.athan[k];
    });
    const cadres = {};
    Object.keys(CONFIG.cadres || {}).forEach(k => {
        cadres[k] = sanitizePath(CONFIG.cadres[k]) || DEFAULT_ASSETS.cadres[k];
    });
    const athkars = {};
    Object.keys(CONFIG.athkars || {}).forEach(k => {
        const a = CONFIG.athkars[k];
        athkars[k] = { time: a.time, url: sanitizePath(a.url) };
    });
    return {
        city: localStorage.getItem("athan_city") || "",
        coords: localStorage.getItem('athan_coords') || '',
        // PRAYER OFFSETS (critical - never touch)
        prayerOffsets: { ...CONFIG.prayerOffsets },
        // HIJRI
        hijriOffset: CONFIG.hijriOffset || 0,
        isRowLayout: document.querySelector(".prayer-times-list.is-row-layout") !== null,
        iqamaDurations: { ...CONFIG.iqamaDurations },
        salatDurations: { ...CONFIG.salatDurations },
        salatDurations: { ...CONFIG.salatDurations },
        // ATHKAR TIMES & AUDIO
        athkars: athkars,
        // ATHAN VIDEO/AUDIO CHOICES
        athanVideos: athanVideos,
        athanAudios: { ...CONFIG.athanAudios },
        athanMode: CONFIG.athanMode,
        // CADRES PATHS
        cadres: cadres,
        // BACKGROUND VIDEO
        shuruqVideo: sanitizePath(CONFIG.shuruqVideo) || DEFAULT_ASSETS.shuruq,
        athkarBgVideo: sanitizePath(CONFIG.athkarBgVideo) || DEFAULT_ASSETS.cadres.Fajr,
        // QURAN
        quran: CONFIG.quran,
        // UI SETTINGS
        wakeLockEnabled: CONFIG.wakeLockEnabled,
        layoutLocked: CONFIG.layoutLocked,
        slideshowIntervalSec: CONFIG.slideshowIntervalSec,
        // MASJID MODE & IMAM BOARD (V39)
        masjidMode: CONFIG.masjidMode || false,
        permanentWidgets: CONFIG.permanentWidgets || false,
        discreteClock: CONFIG.discreteClock || false,
        masjidAthanBg: CONFIG.masjidAthanBg || '',
        imamBoard: { ...CONFIG.imamBoard },
        // FONT & LANG
        font: localStorage.getItem('athan_font') || 'aref',
        lang: document.getElementById('lang-select')?.value || 'ar',
        iqamaDurations: { ...CONFIG.iqamaDurations },
        salatDurations: { ...CONFIG.salatDurations },
        salatDurations: { ...CONFIG.salatDurations },
        settingsIcon: localStorage.getItem('athan_settings_icon') || 'assets/images/settings_btn.gif',
        prayerListOrientation: CONFIG.prayerListOrientation || 'column',
        jumuahTime: CONFIG.jumuahTime || '13:30',
        savedAt: Date.now()
    };
}

function saveSettings() {
    // Save prayer offsets from inputs first
    ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].forEach(prayer => {
        const input = document.getElementById(`offset-${prayer}`);
        if (input) CONFIG.prayerOffsets[prayer] = parseInt(input.value) || 0;
    });
    // Save Athkar times from inputs
    ['morning', 'evening', 'sleep', 'wakeup', 'kahf', 'mulk'].forEach(key => {
        const input = document.getElementById(`time-${key}`);
        if (input) {
            if (key === 'kahf' || key === 'mulk') {
                if (CONFIG.quran[key]) CONFIG.quran[key].time = input.value;
            } else if (CONFIG.athkars[key]) {
                CONFIG.athkars[key].time = input.value;
            }
        }
    });

    const jTime = document.getElementById('jumuah-time-input');
    if (jTime) CONFIG.jumuahTime = jTime.value;

    const snapshot = buildSettingsSnapshot();
    const json = JSON.stringify(snapshot);

    // Layer 1: localStorage (fast, synchronous)
    try {
        localStorage.setItem(PREFS_KEY, json);
        // Also keep legacy key for compatibility
        localStorage.setItem('athan_prefs', json);
    } catch (e) {
        console.warn('localStorage save failed, trying IndexedDB only', e);
    }

    // Layer 2: IndexedDB backup (survives cache clears on some Android builds)
    try {
        if (typeof MediaStorage !== 'undefined') {
            const blob = new Blob([json], { type: 'application/json' });
            MediaStorage.save('__athan_settings__', blob).catch(e => console.warn('IDB settings backup failed', e));
        }
    } catch (e) { /* no MediaStorage, ignore */ }

    updateFilenameDisplays();
    showToast('✅ تم حفظ الإعدادات', 2000);
}

// V11.4: Sync filename displays in UI
function updateFilenameDisplays() {
    if (typeof CONFIG === 'undefined') return;
    try {
        // Athan Videos
        ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].forEach(p => {
            const el = document.getElementById(`name-athan-${p}`);
            if (el) {
                const path = CONFIG.athanVideos[p];
                el.textContent = path ? (path.startsWith('data:') ? 'Lien Personnalisé' : (path.startsWith('blob:') ? 'Fichier USB' : 'Fichier sélectionné')) : 'Default';
            }
        });
        // Shuruq
        const shuruqEl = document.getElementById('name-file-shuruq');
        if (shuruqEl) {
            const path = CONFIG.shuruqVideo;
            shuruqEl.textContent = path ? (path.startsWith('data:') ? 'Lien Personnalisé' : (path.startsWith('blob:') ? 'Fichier USB' : 'Fichier sélectionné')) : 'Default';
        }
        // Athkars
        ['morning', 'evening', 'sleep', 'wakeup', 'kahf', 'mulk'].forEach(k => {
            const el = document.getElementById(`name-file-${k}`);
            if (el) {
                let path = '';
                if (k === 'kahf' || k === 'mulk') path = CONFIG.quran[k] ? CONFIG.quran[k].url : '';
                else path = CONFIG.athkars[k] ? CONFIG.athkars[k].url : '';

                el.textContent = path ? (path.startsWith('data:') ? 'Lien Personnalisé' : (path.startsWith('blob:') ? 'Fichier USB' : 'Default')) : 'Default';
            }
        });
        // Athkar BG
        const bgEl = document.getElementById('athkar-bg-name');
        if (bgEl) {
            const path = localStorage.getItem('athan_custom_athkar_bg') || CONFIG.athkarBgVideo;
            bgEl.textContent = path ? 'Fichier sélectionné' : 'Default';
        }
        // Logo
        const logoEl = document.getElementById('app-logo-name');
        if (logoEl) {
            // Check logic: Blob (USB) > LocalStorage (Legacy) > Default
            const hasBlob = !!window._currentLogoBlob;
            const hasLegacy = !!localStorage.getItem('athan_custom_logo');
            logoEl.textContent = (hasBlob || hasLegacy) ? 'Image personnalisée' : 'Default';
        }
    } catch (e) { console.warn("updateFilenameDisplays failed", e); }
}

// --- Load Settings (Robust V36.0) ---
async function restoreConfigFromStorage() {
    let saved = null;

    // Layer 1: Try localStorage first
    try {
        const raw = localStorage.getItem(PREFS_KEY) || localStorage.getItem('athan_prefs');
        if (raw) saved = JSON.parse(raw);
    } catch (e) { console.warn('localStorage read failed', e); }

    // Layer 2: IndexedDB fallback
    if (!saved || Object.keys(saved).length === 0) {
        try {
            if (typeof MediaStorage !== 'undefined') {
                const blob = await MediaStorage.get('__athan_settings__');
                if (blob) {
                    const text = await blob.text();
                    saved = JSON.parse(text);
                    console.log('✅ Settings restored from IndexedDB backup');
                    // Restore also to localStorage
                    localStorage.setItem(PREFS_KEY, text);
                }
            }
        } catch (e) { console.warn('IDB settings restore failed', e); }
    }

    if (!saved) { console.warn('No saved settings found - using defaults'); return; }

    if (saved.salatDurations && typeof saved.salatDurations === "object") {
        CONFIG.salatDurations = { ...CONFIG.salatDurations, ...saved.salatDurations };
    }
    // ---- RESTORE PRAYER OFFSETS (most critical - preserve exactly) ----
    if (saved.isRowLayout) {
        const list = document.getElementById("prayer-list");
        if (list) list.classList.add("is-row-layout");
    }
    if (saved.prayerOffsets && typeof saved.prayerOffsets === 'object') {
        Object.keys(saved.prayerOffsets).forEach(k => {
            if (CONFIG.prayerOffsets.hasOwnProperty(k)) {
                        if (k.toLowerCase() === "dhuhr") CONFIG.prayerOffsets["Dhuhr"] = parseInt(saved.prayerOffsets[k]);
                CONFIG.prayerOffsets[k] = parseInt(saved.prayerOffsets[k]) || 0;
            }
        });
    }

    // ---- RESTORE HIJRI OFFSET ----
    if (saved.hijriOffset !== undefined) CONFIG.hijriOffset = saved.hijriOffset;
    if (saved.iqamaDurations) CONFIG.iqamaDurations = { ...saved.iqamaDurations };

    // ---- RESTORE SETTINGS ICON (GIF) ----
    if (saved.settingsIcon) {
        console.log("Restoring Settings Icon:", saved.settingsIcon);
        localStorage.setItem('athan_settings_icon', saved.settingsIcon);
        const btnImg = document.getElementById('settings-btn-img');
        if (btnImg) btnImg.src = saved.settingsIcon;
    }

    // ---- RESTORE CITY & COORDS ----
    if (saved.city) {
        localStorage.setItem('athan_city', saved.city);
        CONFIG.city = saved.city.split(',')[0].trim();
        const cityLabel = document.querySelector('.city');
        if (cityLabel) cityLabel.textContent = t('city');
    }
    if (saved.coords) {
        localStorage.setItem('athan_coords', saved.coords);
        try { CONFIG.coordinates = JSON.parse(saved.coords); } catch (e) { }
    }

    // ---- RESTORE ATHAN MODE ----
    if (saved.athanMode) CONFIG.athanMode = saved.athanMode;

    // ---- RESTORE ATHAN VIDEOS (skip blobs, use defaults for missing) ----
    if (saved.athanVideos && typeof saved.athanVideos === 'object') {
        Object.keys(saved.athanVideos).forEach(k => {
            const path = saved.athanVideos[k];
            if (path && !path.startsWith('blob:') && !path.startsWith('data:')) {
                // Migrate old paths
                let finalPath = path.includes('videos/') && !path.includes('assets/') ?
                    path.replace('videos/', 'assets/videos/') : path;
                CONFIG.athanVideos[k] = finalPath;
            }
        });
    }

    // ---- RESTORE CADRES ----
    if (saved.cadres && typeof saved.cadres === 'object') {
        if (!CONFIG.cadres) CONFIG.cadres = {};
        Object.keys(saved.cadres).forEach(k => {
            const path = saved.cadres[k];
            if (path && !path.startsWith('blob:')) {
                let finalPath = path.includes('videos/') && !path.includes('assets/') ?
                    path.replace('videos/', 'assets/videos/') : path;
                CONFIG.cadres[k] = finalPath;
            }
        });
    }

    // ---- RESTORE ATHKARS (times + audio urls) ----
    if (saved.athkars && typeof saved.athkars === 'object') {
        const oldDefaults = ['morning.mp3', 'evening.mp3', 'wakeup_abdulbaset.mp3', 'mulk_saad_ghamidi.mp3'];
        Object.keys(saved.athkars).forEach(k => {
            const a = saved.athkars[k];
            if (!a) return;
            if (!CONFIG.athkars[k]) CONFIG.athkars[k] = { time: '00:00', url: '', enabled: true };
            
            // Only update if value exists in saved data
            if (a.time) CONFIG.athkars[k].time = a.time;
            if (a.enabled !== undefined) CONFIG.athkars[k].enabled = !!a.enabled;
            
            if (a.url && !a.url.startsWith('blob:') && !oldDefaults.includes(a.url)) {
                let restoredUrl = a.url;
                if (restoredUrl.includes('AthanTV_Resources') || restoredUrl.includes('resources/')) {
                    if (k === 'morning') restoredUrl = 'assets/audio/sabah.mp3';
                    if (k === 'evening') restoredUrl = 'assets/audio/massa.mp3';
                    if (k === 'sleep') restoredUrl = 'assets/audio/nawm.mp3';
                    if (k === 'wakeup') restoredUrl = 'assets/audio/wakeup.mp3';
                }
                CONFIG.athkars[k].url = restoredUrl;
            }
        });
    }

    // ---- RESTORE BACKGROUND VIDEOS ----
    if (saved.shuruqVideo && !saved.shuruqVideo.startsWith('blob:')) {
        let p = saved.shuruqVideo;
        if (p.includes('videos/') && !p.includes('assets/')) p = p.replace('videos/', 'assets/videos/');
        CONFIG.shuruqVideo = p;
    }
    if (saved.athkarBgVideo && !saved.athkarBgVideo.startsWith('blob:')) {
        let p = saved.athkarBgVideo;
        if (p.includes('videos/') && !p.includes('assets/')) p = p.replace('videos/', 'assets/videos/');
        CONFIG.athkarBgVideo = p;
    }

    // ---- RESTORE QURAN ----
    if (saved.quran) {
        if (!CONFIG.quran) CONFIG.quran = {};
        if (saved.quran.kahf) {
            if (!CONFIG.quran.kahf) CONFIG.quran.kahf = { time: '10:00', url: 'assets/audio/vendredi.mp3', enabled: true };
            if (saved.quran.kahf.time) CONFIG.quran.kahf.time = saved.quran.kahf.time;
            if (saved.quran.kahf.enabled !== undefined) CONFIG.quran.kahf.enabled = !!saved.quran.kahf.enabled;
            if (saved.quran.kahf.url && (saved.quran.kahf.url.includes('AthanTV_Resources') || saved.quran.kahf.url.includes('resources/'))) {
                CONFIG.quran.kahf.url = 'assets/audio/vendredi.mp3';
            } else if (saved.quran.kahf.url && !saved.quran.kahf.url.startsWith('blob:')) {
                CONFIG.quran.kahf.url = saved.quran.kahf.url;
            }
        }
        if (saved.quran.mulk) {
             if (!CONFIG.quran.mulk) CONFIG.quran.mulk = { time: '22:05', url: 'assets/audio/sleep.mp3', enabled: true };
             Object.assign(CONFIG.quran.mulk, saved.quran.mulk);
        }
    }

    // ---- RESTORE WAKELOCK & UI SETTINGS ----
    if (saved.wakeLockEnabled !== undefined) CONFIG.wakeLockEnabled = saved.wakeLockEnabled;
    if (saved.layoutLocked !== undefined) CONFIG.layoutLocked = saved.layoutLocked;
    if (saved.slideshowIntervalSec !== undefined) CONFIG.slideshowIntervalSec = saved.slideshowIntervalSec;
    
    // ---- RESTORE MASJID MODE (V38.6) ----
    if (saved.masjidMode !== undefined) CONFIG.masjidMode = saved.masjidMode;
    if (saved.masjidAthanBg !== undefined) CONFIG.masjidAthanBg = saved.masjidAthanBg;
    if (saved.permanentWidgets !== undefined) CONFIG.permanentWidgets = saved.permanentWidgets;
    if (saved.discreteClock !== undefined) CONFIG.discreteClock = saved.discreteClock;
    if (saved.jumuahTime !== undefined) CONFIG.jumuahTime = saved.jumuahTime;
    if (saved.imamBoard) {
        if (!CONFIG.imamBoard) CONFIG.imamBoard = {};
        Object.assign(CONFIG.imamBoard, saved.imamBoard);
        // Migration: Clear old French placeholders
        if (CONFIG.imamBoard.pages) {
            CONFIG.imamBoard.pages.forEach(p => {
                if (p.text && p.text.includes("Programmez votre texte ici")) {
                    p.text = "";
                }
            });
        }
    }

    // ---- RESTORE FONT ----
    const font = saved.font || localStorage.getItem('athan_font');
    if (font) { localStorage.setItem('athan_font', font); setFont(font); }

    // ---- RESTORE ATHAN AUDIOS ----
    if (saved.athanAudios) CONFIG.athanAudios = { ...CONFIG.athanAudios, ...saved.athanAudios };

    // ---- RESTORE CUSTOM CADRES FROM INDEXEDDB ----
    ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].forEach(async p => {
        const marker = localStorage.getItem(`custom_cadre_${p}`);
        if (marker) {
            try {
                const blob = await MediaStorage.get(marker);
                if (blob) CONFIG.cadres[p] = URL.createObjectURL(blob);
            } catch (e) { console.warn('Failed to restore cadre', p); }
        }
    });

    // ---- RESTORE TASBIH ----
    const savedTasbihs = localStorage.getItem('athan_tasbih_custom_list');
    if (savedTasbihs) {
        try {
            const parsed = JSON.parse(savedTasbihs);
            if (Array.isArray(parsed) && parsed.length > 0) {
                athkarsList = parsed.map(t => t.includes(' / ') ? t.split(' / ')[1] : t);
                renderTasbihList();
            }
        } catch (e) { }
    }

    updateFilenameDisplays();
    console.log('✅ Settings fully restored from storage');
}


// --- Close Settings Button Listener ---
if (els.closeSettingsBtn) {
    els.closeSettingsBtn.addEventListener('click', () => {
        if (els.settingsModal) els.settingsModal.classList.add('hidden');
    });
}

async function init() {
    // FORCE UNLOCK ON EVERY LOAD FOR TESTING
    localStorage.setItem('athan_layout_locked', 'false');
    CONFIG.layoutLocked = false;

    initDraggable();
    try {
        await restoreConfigFromStorage();

        // V41.23: Restore binary media from IndexedDB using native file:// URLs
        if (typeof restoreMediaFromStorage === 'function') {
            await restoreMediaFromStorage();
        }
        
        // V41.22: Non-blocking location detection
        if (!localStorage.getItem('athan_city')) {
            LocationService.detectLocation().then(geo => {
                if (geo && geo.city) {
                    CONFIG.city = geo.city;
                    CONFIG.country = geo.country || "";
                    localStorage.setItem('athan_city', geo.city);
                    localStorage.setItem('athan_country', geo.country || "");
                    fetchPrayerTimes(true);
                }
            }).catch(e => console.warn("📍 Background location detect failed:", e));
        }

        // Restore Imam page BG images from IndexedDB
        if (CONFIG.imamBoard && CONFIG.imamBoard.pages) {
            for (let i = 0; i < CONFIG.imamBoard.pages.length; i++) {
                const key = `imam_page_bg_${i}`;
                if (localStorage.getItem(key + '_name')) {
                    try {
                        const blob = await MediaStorage.get(key);
                        if (blob) CONFIG.imamBoard.pages[i].bgUrl = URL.createObjectURL(blob);
                    } catch(e) { console.warn('Imam page BG restore failed', i); }
                }
            }
        }

        // Restore Masjid Athan BG from IndexedDB
        if (localStorage.getItem('masjid_athan_bg_name')) {
            try {
                const blob = await MediaStorage.get('masjid_athan_bg');
                if (blob) {
                    if (!CONFIG.imamBoard) CONFIG.imamBoard = {};
                    const blobUrl = URL.createObjectURL(blob);
                    CONFIG.imamBoard.athanBgUrl = blobUrl;
                    const overlay = document.getElementById('masjid-athan-overlay');
                    if (overlay) {
                        overlay.style.backgroundImage = `url('${blobUrl}')`;
                        overlay.style.backgroundSize = 'cover';
                        overlay.style.backgroundPosition = 'center';
                    }
                }
            } catch(e) { console.warn('Masjid Athan BG restore failed'); }
        }

        // V40.1: Native Back Button with Safety and Double-Tap
        const exitHandler = function(e) {
            try {
                const sm = document.getElementById('settings-modal');
                const weatherModal = document.getElementById('weather-forecast-modal');
                const athkarOverlay = document.getElementById('hybrid-athkar-overlay');
                const athanContainer = document.getElementById('athan-player-container');
                const quranModal = document.getElementById('quran-player-modal');
                
                const isSettingsOpen = sm && !sm.classList.contains('hidden') && sm.style.display !== 'none';
                const isWeatherOpen = weatherModal && (weatherModal.classList.contains('show') || weatherModal.style.display === 'flex');
                const isAthkarOpen = athkarOverlay && (athkarOverlay.style.display === 'flex');
                const isImamOpen = typeof MasjidModeManager !== 'undefined' && MasjidModeManager.isBoardActive;

                if (isSettingsOpen) {
                    if (typeof closeSettingsFunc === 'function') closeSettingsFunc();
                    else if (document.getElementById('close-settings')) document.getElementById('close-settings').click();
                    if (e) e.preventDefault();
                } else if (isImamOpen) {
                    MasjidModeManager.toggleImamBoard(false);
                    if (e) e.preventDefault();
                } else if (athanContainer && !athanContainer.classList.contains('hidden') && athanContainer.style.display !== 'none') {
                    if (document.getElementById('close-athan')) document.getElementById('close-athan').click();
                    if (e) e.preventDefault();
                } else if (isWeatherOpen) {
                    if (document.getElementById('close-weather-forecast')) document.getElementById('close-weather-forecast').click();
                    if (e) e.preventDefault();
                } else if (quranModal && !quranModal.classList.contains('hidden')) {
                    if (document.getElementById('close-quran')) document.getElementById('close-quran').click();
                    if (e) e.preventDefault();
                } else if (isAthkarOpen) {
                    if (typeof closeHybridAthkar === 'function') closeHybridAthkar();
                    if (e) e.preventDefault();
                } else {
                    // Exit app with double-tap safety
                    const now = Date.now();
                    if (window._lastBackPress && (now - window._lastBackPress < 2000)) {
                        if (navigator.app && navigator.app.exitApp) {
                            navigator.app.exitApp();
                        } else {
                            window.close();
                        }
                    } else {
                        window._lastBackPress = now;
                        if (typeof showToast === 'function') showToast("Appuyez encore pour quitter");
                        if (e) e.preventDefault();
                    }
                }
            } catch (err) {
                console.error("exitHandler error safely caught:", err);
                if (e) e.preventDefault();
            }
        };

        document.addEventListener('backbutton', exitHandler, false);

        MasjidModeManager.init();
        initSettingsListeners();
        QuranPlayer.init();
        fetchWeather(); // Re-enabled
        fetchPrayerTimes();
        AudioVisualizer.init();

        // Force layout unlock again after restoration
        CONFIG.layoutLocked = false;
        initDraggable();
        startWakeLockMonitoring(); // V41.16: Correct place for single call
        
        // V41.21: Periodic Connection Monitoring (Fixes gray Wi-Fi button)
        setInterval(() => {
            const status = navigator.onLine ? 'online' : 'offline';
            if (typeof updateConnectionStatus === 'function') {
                updateConnectionStatus(status);
            }
        }, 5000); // Check every 5 seconds

        // V11.9.1: Global Unlock for Audio Visualizer (Fixes Equalizer)
        const unlockHandler = () => {
            AudioVisualizer.unlockAudio();
            document.removeEventListener('click', unlockHandler);
            document.removeEventListener('keydown', unlockHandler);
        };
        document.addEventListener('click', unlockHandler);
        document.addEventListener('keydown', unlockHandler);

           // --- TV Remote Navigation Logic (Refactored V41.15) ---
        let currentFocus = null;

        function getFocusableElements() {
            // Find active modal
            const sm = document.getElementById('settings-modal');
            const wm = document.getElementById('weather-forecast-modal');
            const at = document.getElementById('hybrid-athkar-overlay');
            const qm = document.getElementById('quran-player-modal');

            let activeContainer = document; // Default to whole page

            const isSettOpen = sm && !sm.classList.contains('hidden') && sm.style.display !== 'none';
            const isWxOpen = wm && (wm.classList.contains('show') || wm.style.display === 'flex');
            const isAtheOpen = at && at.style.display === 'flex';
            const isQuranOpen = qm && qm.style.display === 'flex';

            if (isSettOpen) activeContainer = sm;
            else if (isWxOpen) activeContainer = wm;
            else if (isAtheOpen) activeContainer = at;
            else if (isQuranOpen) activeContainer = qm;

            const selector = '.focusable, button, input, .bg-item, select, .weather-hour-item, .weather-day-item';
            const allFocusables = Array.from(activeContainer.querySelectorAll(selector));
            
            return allFocusables.filter(el => {
                // If we are inside a modal, offsetParent might be tricky if parent is fixed.
                // But the element itself should have visibility.
                const style = window.getComputedStyle(el);
                return style.display !== 'none' && style.visibility !== 'hidden' && !el.disabled && el.tabIndex !== -1;
            });
        }

        function initFocus() {
            const focusables = getFocusableElements();
            if (focusables.length > 0) {
                const settingsBtn = document.getElementById('open-settings');
                if (settingsBtn && settingsBtn.offsetParent !== null && !settingsBtn.classList.contains('hidden')) {
                    currentFocus = settingsBtn;
                } else {
                    currentFocus = focusables[0];
                }
                if (currentFocus) currentFocus.focus();
            }
        }

        function handleNavigation(direction) {
            const focusables = getFocusableElements();
            if (focusables.length === 0) return;

            if (!currentFocus || currentFocus.offsetParent === null) {
                initFocus();
                return;
            }

            const currentRect = currentFocus.getBoundingClientRect();
            const currentCenter = { x: currentRect.left + currentRect.width / 2, y: currentRect.top + currentRect.height / 2 };

            let bestCandidate = null;
            let minDistance = Infinity;

            focusables.forEach(el => {
                if (el === currentFocus) return;
                const rect = el.getBoundingClientRect();
                const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
                const dx = center.x - currentCenter.x;
                const dy = center.y - currentCenter.y;

                let isDirectionCorrect = false;
                if (direction === 'UP') isDirectionCorrect = dy < -5;
                else if (direction === 'DOWN') isDirectionCorrect = dy > 5;
                else if (direction === 'LEFT') isDirectionCorrect = dx < -5;
                else if (direction === 'RIGHT') isDirectionCorrect = dx > 5;

                if (isDirectionCorrect) {
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    let alignmentPenalty = (direction === 'UP' || direction === 'DOWN') ? Math.abs(dx) * 2 : Math.abs(dy) * 2;
                    const score = distance + alignmentPenalty;
                    if (score < minDistance) {
                        minDistance = score;
                        bestCandidate = el;
                    }
                }
            });

            if (bestCandidate) {
                currentFocus = bestCandidate;
                currentFocus.focus();
                
                // V38.9.1: Optimized Scroll Detection
                // 1. Browser Native
                bestCandidate.scrollIntoView({ block: 'nearest' });

                // 2. Explicit Modal Parent Scroll (Backup for TV Bro)
                const sm = document.getElementById('settings-modal');
                const wm = document.getElementById('weather-forecast-modal');
                const at = document.getElementById('hybrid-athkar-overlay');

                const parentModal = bestCandidate.closest('#settings-modal, #weather-forecast-modal, #hybrid-athkar-overlay');
                if (parentModal) {
                    const scrollCont = parentModal.querySelector('.settings-content, .forecast-container, #hybrid-scroll-track') || parentModal;
                    const rect = bestCandidate.getBoundingClientRect();
                    const contRect = scrollCont.getBoundingClientRect();
                    
                    if (rect.bottom > contRect.bottom - 50) {
                        scrollCont.scrollBy({ top: 200 });
                    } else if (rect.top < contRect.top + 50) {
                        scrollCont.scrollBy({ top: -200 });
                    }
                }
            }
        }

        // V38.9: REMOVED AGGRESSIVE CAPTURE-PHASE LISTENER TO ALLOW NATIVE/UNIFIED NAVIGATION

        // Single Global Keydown Listener
        window.addEventListener('keydown', function(e) {
            const settingsModal = document.getElementById('settings-modal');
            const weatherModal = document.getElementById('weather-forecast-modal');
            const athkarOverlay = document.getElementById('hybrid-athkar-overlay');
            const athanContainer = document.getElementById('athan-player-container');
            const quranModal = document.getElementById('quran-player-modal');

            const isUpKey = (e.keyCode === 38 || e.key === 'ArrowUp' || e.keyCode === 19);
            const isDownKey = (e.keyCode === 40 || e.key === 'ArrowDown' || e.keyCode === 20);
            const isLeftKey = (e.keyCode === 37 || e.key === 'ArrowLeft' || e.keyCode === 21);
            const isRightKey = (e.keyCode === 39 || e.key === 'ArrowRight' || e.keyCode === 22);

            if (isUpKey || isDownKey) {
                // Let arrow keys pass through if we are in a text input so user can navigate/scroll
                // Only return if it's a native select or if they specifically need up/down for input (like type="number")
                if (document.activeElement && document.activeElement.tagName === 'SELECT') return;
                // V38.9.1: Ensure handleNavigation works even if focus is lost
                if (!currentFocus || !currentFocus.isConnected || window.getComputedStyle(currentFocus).display === 'none') {
                    initFocus();
                }
                
                if (isUpKey) handleNavigation('UP');
                else handleNavigation('DOWN');
                e.preventDefault();
            }

            if (isLeftKey || isRightKey) {
                if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
                if (isLeftKey) handleNavigation('LEFT');
                else handleNavigation('RIGHT');
                e.preventDefault();
            }

            switch (e.keyCode) {
                case 13: // Enter
                case 32: // Space
                    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
                        return;
                    }
                    if (e.keyCode === 13 && currentFocus) currentFocus.click();
                    break;
                case 8: // Back
                case 27: // Esc
                case 461: case 10009: 
                    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
                        if (e.keyCode === 8) return; 
                    }
                    exitHandler(e);
                    break;
                case 88: // X Key
                case 46: // Delete
                    if (document.activeElement && document.activeElement.tagName === 'INPUT') {
                        document.activeElement.value = '';
                        document.activeElement.dispatchEvent(new Event('input', { bubbles: true }));
                        e.preventDefault();
                    }
                    break;
            }
        });

        // Pointer support to update focus
        document.body.addEventListener('mouseover', e => {
            if (e.target.classList.contains('focusable') || ['BUTTON','INPUT','SELECT'].includes(e.target.tagName)) {
                currentFocus = e.target;
            }
        });

        // Default slides dynamically loaded based on mode (Normal / Friday)
        // Always call with force=true so Friday mode is applied even with existing slides
        checkSlideshowMode(true);


        showToast("Application démarrée");
        console.log("Init sequence complete.");

    } catch (err) {
        console.error("CRITICAL INIT FAILURE:", err);
        showToast("❌ Erreur au démarrage de l'application", 5000);
    }
}


// Tasbih Input Logic - Simplified UI (Text + Cross)
function renderTasbihList() {
    if (!els.tasbihListEdit) return;
    els.tasbihListEdit.innerHTML = '';
    athkarsList.forEach((text, index) => {
        const item = document.createElement('div');
        item.className = 'tasbih-edit-item';
        item.innerHTML = `
                <span class="tasbih-text">${text}</span>
                <button class="tasbih-delete-btn" onclick="deleteTasbih(${index})">×</button>
            `;
        els.tasbihListEdit.appendChild(item);
    });
}

function deleteTasbih(index) {
    athkarsList.splice(index, 1);
    localStorage.setItem('athan_tasbih_custom_list', JSON.stringify(athkarsList));
    renderTasbihList();
    showToast("تم حذف التسبيح");
}

const addTasbihBtn = document.getElementById('add-tasbih-btn');
const tasbihInput = document.getElementById('tasbih-input');

if (addTasbihBtn && tasbihInput) {
    addTasbihBtn.addEventListener('click', () => {
        const text = tasbihInput.value.trim();
        if (text) {
            athkarsList.push(text);
            tasbihInput.value = '';
            localStorage.setItem('athan_tasbih_custom_list', JSON.stringify(athkarsList));
            renderTasbihList();
            showToast("تم إضافة التسبيح !");
        }
    });
}

// --- Weather Forecast Listeners ---
if (els.weatherWidget) {
    els.weatherWidget.addEventListener('click', () => {
        showWeatherForecast();
    });
    els.weatherWidget.style.cursor = 'pointer';
}
if (els.closeWeatherForecast) {
    els.closeWeatherForecast.addEventListener('click', () => {
        els.weatherForecastModal.classList.remove('show');
    });
}

// --- V35.1: IMMEDIATE INIT (Instant Language) ---
try {
    console.log("Forcing Immediate Language Init...");
    if (typeof restoreConfigFromStorage === 'function') restoreConfigFromStorage();
    if (typeof setLanguage === 'function') setLanguage(localStorage.getItem('athan_lang') || 'ar');

    _lastDateUpdate = null;
    _lastDateMinute = -1;
    window._forceDateUpdate = true;

    updateClock();
    setInterval(updateClock, 250);
    showToast("Gemini Athan TV Ready");
} catch (e) {
    console.error("Immediate Init Failed", e);
}

// BIND INIT
if (document.readyState === 'complete') init();
else window.addEventListener('load', init);





// === Brightness Control (Synced from APK) ===
(function () {
    const slider = document.getElementById('brightness-slider');
    const overlay = document.getElementById('brightness-overlay');

    if (slider && overlay) {
        const saved = localStorage.getItem('athan_brightness') || '0';
        slider.value = saved;
        overlay.style.opacity = saved;

        slider.addEventListener('input', function (e) {
            const val = e.target.value;
            overlay.style.opacity = val;
            localStorage.setItem('athan_brightness', val);
        });
    }
})();

// === UNIVERSAL FULLSCREEN & ORIENTATION HANDLER (V38.9.3) ===
function initUniversalLayout() {
    console.log("Initializing Universal Layout Support...");
    const triggerCapacitorNative = () => {
        try {
            if (window.Capacitor && window.Capacitor.Plugins) {
                const { StatusBar, NavigationBar } = window.Capacitor.Plugins;
                if (StatusBar) {
                    StatusBar.hide().catch(e => {});
                    StatusBar.setOverlaysWebView({ overlay: true }).catch(e => {});
                }
                if (NavigationBar && NavigationBar.hide) {
                    NavigationBar.hide().catch(e => {});
                }
            }
        } catch (e) {}
    };
    const requestFs = () => {
        triggerCapacitorNative();
        try {
            const doc = document.documentElement;
            if (document.fullscreenElement) return;
            const options = { navigationUI: 'hide' };
            if (doc.requestFullscreen) {
                doc.requestFullscreen(options).then(lockOrientation).catch(e => {});
            } else if (doc.webkitRequestFullscreen) {
                doc.webkitRequestFullscreen(options);
                lockOrientation();
            }
        } catch (e) {}
    };
    const lockOrientation = () => {
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(err => {});
        }
    };
    window.addEventListener('load', triggerCapacitorNative);
    const events = ['mousedown', 'touchstart', 'keydown'];
    events.forEach(evtName => {
        document.addEventListener(evtName, requestFs, { passive: true });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof initUniversalLayout === 'function') initUniversalLayout();
});

const MasjidModeManager = {
    isBoardActive: false,
    currentActivePageId: null,
    _scrollRAF: null,
    athanSequenceTimeout: null,

    init() {
        this.setupListeners();
        setInterval(() => {
            this.updateMiniClock();
            this.checkScheduledBoard();
            this.updateClockVisibility();
        }, 1000);
        this.updateMiniClock();
        this.updateClockVisibility();
    },

    checkScheduledBoard() {
        if (!CONFIG.masjidMode || !CONFIG.imamBoard || !CONFIG.imamBoard.pages) return;
        
        // Block if Athan/Iqama/Salat is active
        const isAthkarActive = document.getElementById('hybrid-athkar-overlay')?.classList.contains('active');
        const isPrayerSequenceActive = isAthanPlaying || (typeof iqamaState !== 'undefined' && iqamaState.active) || (typeof salatState !== 'undefined' && salatState.active) || isAthkarActive;
        
        if (isPrayerSequenceActive) {
            if (this.isBoardActive) this.toggleImamBoard(false);
            return;
        }

        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const activePage = CONFIG.imamBoard.pages.find(p => p.enabled && timeStr >= p.start && timeStr < p.end);
        if (activePage) {
            if (!this.isBoardActive || this.currentActivePageId !== activePage.id) {
                window._isManualBoard = false;
                this.currentActivePageId = activePage.id;
                this.toggleImamBoard(true, {
                    content: activePage.text,
                    scrolling: activePage.mode === 'scrolling',
                    pageBgUrl: activePage.bgUrl,
                    duration: 0
                });
            }
        } else if (this.isBoardActive && !window._isManualBoard) {
            this.toggleImamBoard(false);
        }
    },

    setupListeners() {
        const masjidToggle = document.getElementById('masjid-mode-toggle');
        if (masjidToggle) {
            masjidToggle.checked = !!CONFIG.masjidMode;
            masjidToggle.onchange = (e) => {
                CONFIG.masjidMode = e.target.checked;
                this.updateClockVisibility();
                saveSettings();
            };
        }
        const discreteToggle = document.getElementById('discrete-clock-toggle');
        if (discreteToggle) {
            discreteToggle.checked = !!CONFIG.discreteClock;
            discreteToggle.onchange = (e) => {
                CONFIG.discreteClock = e.target.checked;
                this.updateClockVisibility();
                saveSettings();
            };
        }
        const permanentToggle = document.getElementById('permanent-widgets-toggle');
        if (permanentToggle) {
            permanentToggle.checked = !!CONFIG.permanentWidgets;
            permanentToggle.onchange = (e) => {
                CONFIG.permanentWidgets = e.target.checked;
                this.updateClockVisibility();
                saveSettings();
            };
        }
        
        // Delegate for settings UI buttons
        const container = document.getElementById('imam-pages-container');
        if (container) {
            container.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;
                const idx = parseInt(btn.dataset.idx);
                if (isNaN(idx)) return;

                if (btn.classList.contains('test-page-btn')) {
                    const page = CONFIG.imamBoard.pages[idx];
                    window._isManualBoard = true;
                    this.toggleImamBoard(true, {
                        content: page.text,
                        scrolling: page.mode === 'scrolling',
                        pageBgUrl: page.bgUrl
                    });
                    document.getElementById('settings-modal')?.classList.add('hidden');
                }
                
                if (btn.classList.contains('page-bg-reset')) {
                    CONFIG.imamBoard.pages[idx].bgUrl = '';
                    this.renderSettingsUI();
                    saveSettings();
                }
            });
        }

        const testBtn = document.getElementById('test-athan-btn');
        if (testBtn) {
            testBtn.onclick = () => {
                window._isTestingMedia = true;
                if (typeof playAthan === 'function') playAthan('Fajr');
            };
        }

        const closeBtn = document.getElementById('close-board-btn');
        if (closeBtn) closeBtn.onclick = () => this.toggleImamBoard(false);

        const imamBtn = document.getElementById('imam-mode-btn');
        if (imamBtn) {
            imamBtn.onclick = () => {
                if (this.isBoardActive) this.toggleImamBoard(false);
                else {
                    const p = (CONFIG.imamBoard?.pages || [])[0] || { text: "Bienvenue" };
                    window._isManualBoard = true;
                    this.toggleImamBoard(true, { content: p.text, scrolling: p.mode === 'scrolling', pageBgUrl: p.bgUrl });
                }
            };
        }

        this.renderSettingsUI();
    },

    updateClockVisibility() {
        const bigClock = document.getElementById('unified-clock-widget');
        const bigNextPrayer = document.getElementById('next-prayer-container'); 
        const miniWidgets = document.getElementById('masjid-persistent-widgets');
        
        const isMasjid = !!CONFIG.masjidMode;
        const isDiscrete = !!CONFIG.discreteClock;
        const isOverlay = this.isBoardActive || (typeof isAthanPlaying !== 'undefined' && isAthanPlaying);

        // ALWAYS HIDE BIG WIDGETS IF DISCRETE OR OVERLAY
        const shouldHideBig = (isMasjid && isDiscrete) || isOverlay;

        if (shouldHideBig) {
            if (bigClock) bigClock.style.setProperty('display', 'none', 'important');
            if (bigNextPrayer) bigNextPrayer.style.setProperty('display', 'none', 'important');
            if (miniWidgets) {
                miniWidgets.style.setProperty('display', 'flex', 'important');
                miniWidgets.classList.add('active');
                miniWidgets.classList.remove('hidden');
            }
        } else {
            // Standard state: Show big, Hide mini
            if (bigClock) bigClock.style.removeProperty('display');
            if (bigNextPrayer) bigNextPrayer.style.removeProperty('display');
            
            if (miniWidgets) {
                miniWidgets.style.setProperty('display', 'none', 'important');
                miniWidgets.classList.remove('active');
                miniWidgets.classList.add('hidden');
            }
        }
    },

    updateMiniClock() {
        try {
            const now = new Date();
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            const miniClock = document.getElementById('mini-clock-time');
            if (miniClock) miniClock.textContent = timeStr;
            
            const miniPrayer = document.getElementById('mini-next-prayer');
            if (miniPrayer && typeof getNextPrayerTime === 'function') {
                const nextDate = getNextPrayerTime();
                if (nextDate instanceof Date) {
                    const diffMs = nextDate - now;
                    const totalSec = Math.floor(diffMs / 1000);
                    const h = Math.floor(totalSec / 3600);
                    const m = Math.floor((totalSec % 3600) / 60);
                    const s = totalSec % 60;
                    
                    // V41.25: Real Countdown in Mini Widget
                    const countdown = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
                    
                    let pName = "";
                    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
                    const hh = String(nextDate.getHours()).padStart(2, '0');
                    const mm = String(nextDate.getMinutes()).padStart(2, '0');
                    for (const p of prayers) {
                        if (prayerTimes[p] === `${hh}:${mm}`) {
                            pName = (typeof I18N !== 'undefined' && I18N[currentLang]) ? I18N[currentLang].prayers[p] : p;
                            break;
                        }
                    }
                    miniPrayer.textContent = `${pName} ${countdown}`;
                }
            }
        } catch (e) {}
    },

    triggerAthanReplacement(prayer) {
        console.log("🕌 [Masjid] Triggering Educational Sequence for " + prayer);
        
        // V41.x: Hide Settings Modal immediately if open (prevents overlap)
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal) {
            settingsModal.classList.add('hidden');
            settingsModal.style.display = 'none';
        }

        const overlay = document.getElementById('masjid-athan-overlay');
        const duaaSection = document.getElementById('masjid-athan-duaa');
        const callInfo = document.getElementById('masjid-athan-call-info');
        
        if (!overlay) {
            if (prayer !== 'Sunrise') {
                setTimeout(() => { if (typeof showIqama === 'function') showIqama(prayer); }, 3000);
            }
            return;
        }

        // 1. Reset UI
        if (duaaSection) duaaSection.style.display = 'none';
        if (callInfo) callInfo.style.display = 'block';
        
        const statusEl = document.getElementById('masjid-athan-status');
        if (statusEl) {
            if (prayer === 'Sunrise') {
                statusEl.textContent = (typeof I18N !== 'undefined' && I18N.ar) ? I18N.ar.prayers.Sunrise || "وقت الشروق" : "وقت الشروق";
            } else {
                statusEl.textContent = (typeof I18N !== 'undefined' && I18N.ar) ? I18N.ar.masjid_athan_call : "وقت الأذان";
            }
        }
        
        const nameEl = document.getElementById('masjid-athan-prayer-name');
        if (nameEl) {
            const nameAr = (typeof I18N !== 'undefined' && I18N.ar) ? I18N.ar.prayers[prayer] : prayer;
            nameEl.textContent = prayer === 'Sunrise' ? '' : (nameAr || prayer); // Hide name if Sunrise since we put it in status
        }
        
        const progressBar = document.getElementById('masjid-progress-bar');
        if (progressBar) {
            progressBar.style.width = '0%';
            let progress = 0;
            const duration = 120; // Total 2 minutes
            if (this._athanProgressInterval) clearInterval(this._athanProgressInterval);
            this._athanProgressInterval = setInterval(() => {
                progress += (1 / duration) * 100;
                progressBar.style.width = Math.min(progress, 100) + '%';
                
                // Switch to DUAA at 50% (1 minute) if NOT Sunrise
                if (prayer !== 'Sunrise' && progress >= 50 && duaaSection && duaaSection.style.display === 'none') {
                    duaaSection.style.display = 'block';
                    if (callInfo) callInfo.style.display = 'none';
                }
                
                if (progress >= 100) clearInterval(this._athanProgressInterval);
            }, 1000);
        }

        // Add visualizer support if requested, but logic says no extra UI overhead.
        overlay.classList.add('active');
        overlay.style.display = 'flex';
        
        if (this.athanSequenceTimeout) clearTimeout(this.athanSequenceTimeout);
        this.athanSequenceTimeout = setTimeout(() => {
            if (this._athanProgressInterval) clearInterval(this._athanProgressInterval);
            overlay.classList.remove('active');
            overlay.style.display = 'none';
            if (typeof isAthanPlaying !== 'undefined') isAthanPlaying = false; // reset globally
            
            if (prayer !== 'Sunrise') {
                if (typeof showIqama === 'function') showIqama(prayer);
            } else {
                // Return to normal immediately
                if (typeof showSiyamWidget === 'function') showSiyamWidget();
            }
        }, 120000); // exactly 2 minutes
    },

    renderSettingsUI() {
        const container = document.getElementById('imam-pages-container');
        if (!container || !CONFIG.imamBoard?.pages) return;
        
        container.innerHTML = CONFIG.imamBoard.pages.map((page, idx) => `
            <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding: 15px 0; margin-bottom: 15px;">
                <div class="flex-between">
                    <span style="color: var(--accent-color); font-weight: bold;">📄 Page ${idx + 1}</span>
                    <input type="checkbox" class="page-enabled" data-idx="${idx}" ${page.enabled ? 'checked' : ''} style="width:25px; height:25px;">
                </div>
                <textarea class="page-text" data-idx="${idx}" style="width:100%; height:100px; background:#222; color:white; border:1px solid #444; border-radius:8px; margin:10px 0; padding:10px; direction:rtl; font-family:'Aref Ruqaa', serif;">${page.text}</textarea>
                <div class="flex-row" style="gap:10px; margin-bottom:10px;">
                    <div style="flex:1;">
                        <label style="font-size:0.8rem; color:#aaa;">Début</label>
                        <input type="time" class="page-start" data-idx="${idx}" value="${page.start}" style="width:100%; background:#333; color:white; border:1px solid #555; padding:5px;">
                    </div>
                    <div style="flex:1;">
                        <label style="font-size:0.8rem; color:#aaa;">Fin</label>
                        <input type="time" class="page-end" data-idx="${idx}" value="${page.end}" style="width:100%; background:#333; color:white; border:1px solid #555; padding:5px;">
                    </div>
                    <div style="flex:1;">
                        <label style="font-size:0.8rem; color:#aaa;">Mode</label>
                        <select class="page-mode" data-idx="${idx}" style="width:100%; background:#333; color:white; border:1px solid #555; padding:5px;">
                            <option value="fixed" ${page.mode === 'fixed' ? 'selected' : ''}>Fixe</option>
                            <option value="scrolling" ${page.mode === 'scrolling' ? 'selected' : ''}>Défilant</option>
                        </select>
                    </div>
                </div>
                <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; border:1px dashed #ffd700;">
                    <label style="font-size:0.85rem; color:#ffd700; display:block; margin-bottom:5px;">🖼️ Image de fond</label>
                    <div style="display:flex; gap:8px; align-items:center;">
                        <div class="real-file-btn" style="flex:1; background:rgba(255,215,0,0.15); color:#ffd700; border:1px solid #ffd700; border-radius:5px; padding:8px; cursor:pointer; font-size:0.85rem; display:flex; align-items:center; justify-content:center; gap:5px; position:relative;">
                            <span>📂 اختر صورة</span>
                            <input type="file" accept="*/*" onchange="handleImamPageBg(${idx}, this.files[0])" style="position:absolute; top:0; left:0; width:100%; height:100%; opacity:0; z-index:10; cursor:pointer;">
                        </div>
                        <button class="page-bg-reset small-btn" data-idx="${idx}" style="background:rgba(255,0,0,0.2); color:#ff6b6b; border:1px solid #ff6b6b; border-radius:5px; padding:8px; cursor:pointer;">❌</button>
                    </div>
                    <div style="font-size:0.7rem; color:#aaa; margin-top:4px;">${page.bgUrl ? page.bgUrl.split('/').pop() : 'Aucune image'}</div>
                </div>
                <button class="test-page-btn" onclick="MasjidModeManager.testPage(${idx})" style="width:100%; margin-top:10px; background:rgba(0,229,255,0.2); color:#00e5ff; border:1px solid #00e5ff; padding:8px; border-radius:5px;">👁️ Tester cette page</button>
            </div>
        `).join('');
        
        container.querySelectorAll('input, textarea, select').forEach(el => {
            el.onchange = (e) => {
                const idx = parseInt(e.target.dataset.idx);
                const page = CONFIG.imamBoard.pages[idx];
                if (e.target.classList.contains('page-enabled')) page.enabled = e.target.checked;
                if (e.target.classList.contains('page-text')) page.text = e.target.value;
                if (e.target.classList.contains('page-start')) page.start = e.target.value;
                if (e.target.classList.contains('page-end')) page.end = e.target.value;
                if (e.target.classList.contains('page-bg-path')) page.bgUrl = e.target.value;
                if (e.target.classList.contains('page-mode')) page.mode = e.target.value;
                saveSettings();
            };
        });
    },

    testPage(idx) {
        console.log("Testing page index:", idx);
        const page = CONFIG.imamBoard.pages[idx];
        if (!page) return;
        window._isManualBoard = true;
        this.toggleImamBoard(true, {
            content: page.text,
            scrolling: page.mode === 'scrolling',
            pageBgUrl: page.bgUrl
        });
        document.getElementById('settings-modal')?.classList.add('hidden');
    },

    toggleImamBoard(show, options = {}) {
        const root = document.getElementById('masjid-root');
        const board = document.getElementById('imam-board'); 
        const closeBtn = document.getElementById('close-board-btn');
        if (!root || !board) return;
        
        if (show) {
            this.isBoardActive = true;
            root.classList.add('active');
            root.classList.remove('hidden');
            root.style.display = 'block';
            board.innerHTML = '';
            const content = options.content || '';
            
            if (options.scrolling) {
                const el = document.createElement('div');
                el.className = 'imam-text-scroll';
                el.textContent = content;
                board.appendChild(el);
                requestAnimationFrame(() => {
                    const pixelsPerSec = 15;
                    const screenH = window.innerHeight;
                    const textH = el.offsetHeight;
                    const endY = -textH;
                    let currentY = screenH;
                    let lastTime = performance.now();
                    const animate = (timestamp) => {
                        if (!this.isBoardActive) return;
                        const delta = (timestamp - lastTime) / 1000;
                        lastTime = timestamp;
                        currentY -= pixelsPerSec * delta;
                        if (currentY <= endY) currentY = screenH;
                        el.style.transform = `translateY(${currentY}px)`;
                        this._scrollRAF = requestAnimationFrame(animate);
                    };
                    this._scrollRAF = requestAnimationFrame(animate);
                });
            } else {
                const el = document.createElement('div');
                el.className = 'imam-text-fixed';
                el.textContent = content;
                board.appendChild(el);
            }
            
            if (options.pageBgUrl) {
                root.style.backgroundImage = `url('${options.pageBgUrl}')`;
                root.style.backgroundSize = 'cover';
                root.style.backgroundPosition = 'center';
            } else {
                root.style.backgroundImage = 'none';
            }
            if (closeBtn) {
                closeBtn.style.display = 'block';
                closeBtn.classList.remove('hidden');
            }
        } else {
            this.isBoardActive = false;
            if (this._scrollRAF) cancelAnimationFrame(this._scrollRAF);
            root.classList.remove('active');
            root.classList.add('hidden');
            root.style.display = 'none';
            root.style.backgroundImage = 'none';
            if (closeBtn) {
                closeBtn.style.display = 'none';
                closeBtn.classList.add('hidden');
            }
        }
        this.updateClockVisibility();
    }
};

window.MasjidModeManager = MasjidModeManager;
if (typeof MasjidModeManager !== 'undefined') MasjidModeManager.init();
