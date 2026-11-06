
        // V11.2: Session Tracking
        window._isCurrentSession = true;
        window._isTestingMedia = false; // V11.6: Flag to bypass Iqama on test failures

        window.shareApp = function () {
            // Priority 0: Native APK Bridge (Flutter/Android)
            const bridge = window.FlutterChannel || window.flutter_sharing || (window.Toaster ? { postMessage: (m) => window.Toaster.postMessage(m) } : null);
            if (bridge && typeof bridge.postMessage === 'function') {
                showToast("📤 Preparing Direct APK Sharing...");
                bridge.postMessage(JSON.stringify({ action: 'share_apk' }));
                return;
            }

            // Universal Logic: Determine the best URL
            const localUrl = window.location.href;
            const publicUrl = CONFIG.publicApkUrl || "";
            const finalUrl = publicUrl || localUrl;

            // Priority 1: Web Share API (For Mobile Browsers)
            if (navigator.share) {
                navigator.share({
                    title: 'ATHAN TV APK',
                    text: 'Téléchargez l\'application ATHAN TV pour votre écran Android TV.',
                    url: finalUrl
                }).then(() => console.log('Shared successfully'))
                  .catch((err) => console.log('Share error:', err));
                return;
            }

            // Priority 2: QR Code Modal (For TV Mode)
            const modal = document.getElementById('share-modal');
            const qrImg = document.getElementById('share-qr-img');
            const urlText = document.getElementById('share-url-text');
            const warning = document.getElementById('share-warning-text');

            if (modal && qrImg && urlText) {
                // Generate QR using public URL or fallback
                qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(finalUrl)}`;
                urlText.textContent = finalUrl;
                
                // Show warning only if using local IP
                if (warning) warning.style.display = publicUrl ? "none" : "block";
                
                modal.style.display = 'flex';
                modal.classList.remove('hidden');
            }
        };

        // Close Share Modal
        document.getElementById('close-share')?.addEventListener('click', () => {
            const modal = document.getElementById('share-modal');
            if (modal) {
                modal.style.display = 'none';
                modal.classList.add('hidden');
            }
        });

        // Copy Share Link
        document.getElementById('copy-share-url')?.addEventListener('click', () => {
            const url = CONFIG.publicApkUrl;
            if (url) {
                navigator.clipboard.writeText(url).then(() => {
                    showToast("✅ Lien copié (Lien APK copié)");
                }).catch(err => {
                    // Fallback
                    const el = document.createElement('textarea');
                    el.value = url;
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand('copy');
                    document.body.removeChild(el);
                    showToast("✅ Lien copié");
                });
            }
        });
        // Close Share Modal on background click
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('share-modal');
            if (e.target === modal) {
                modal.style.display = 'none';
                modal.classList.add('hidden');
            }
        });

        // Moved to utils.js

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


        // V35.1: Critical Error Tracker for TV Debugging
        // V35.1: Pro Error Tracker (Console only, no intrusive banners)
        window.onerror = function (msg, url, lineNo, columnNo, error) {
            console.error(`PRO JS ERROR: ${msg} [${url}:${lineNo}]`);
            // Banner removed as requested for professional look. Use console/monitoring for debugging.
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
                if (I18N[currentLang] && I18N[currentLang][key]) {
                    el.textContent = I18N[currentLang][key];
                }
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
                        try { checkPrayerTime(now); } catch (e) {}
                        try { updateNextPrayer(now); } catch (e) {}
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

            async function requestWakeLock() { if (typeof WakeLockService !== 'undefined') await WakeLockService.request(); }
            async function releaseWakeLock() { if (typeof WakeLockService !== 'undefined') await WakeLockService.release(); }

            function startWakeLockMonitoring() {
                setInterval(() => {
                    if (!prayerTimes) return;

                    const now = new Date();
                    const nextPrayer = getNextPrayerTimeObj();
                    if (!nextPrayer) return;

                    const mUntil = Math.floor((nextPrayer - now) / 60000);

                    // Wake screen 20 mins before and keep during prayer
                    if (mUntil <= (CONFIG.wakeLockMinutes || 20) && mUntil > -10) {
                        if (!wakeLock) requestWakeLock();
                    } else {
                        if (wakeLock) releaseWakeLock();
                    }
                }, 60000);
            }

            // getNextPrayerTimeObj moved to utils.js

            // Start monitoring immediately
            startWakeLockMonitoring();
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
                showToast(I18N[currentLang].weather_refreshing || "Actualisation météo...");
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

        async function fetchPrayerTimes() {
            if (typeof PrayerService !== 'undefined') {
                const result = await PrayerService.fetchPrayerTimes(currentLang);
                if (result) {
                    prayerTimes = result.times;
                    globalHijriDateString = result.hijri;
                    updateDates(new Date(), globalHijriDateString);
                    renderPrayerList();
                    updateFastingWidget(new Date(), globalHijriDateString);
                    updateConnectionStatus(result.status);
                    scheduleNativeAlarms();
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
                gregEl.textContent = gregorianDate.toLocaleDateString(I18N[currentLang].date_locale, options);
            }

            if (hijriEl) {
                hijriEl.textContent = hijriString;
            }
        }

        function renderPrayerList() {
            if (typeof PrayerWidget !== 'undefined') {
                PrayerWidget.renderList(prayerTimes, currentLang, I18N, els);
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

            // HYBRID LOGIC FOR morning/evening
            if ((category === 'morning' || category === 'evening')) {
                // Hybrid mode triggers ONLY if we are using the default internal assets (not blobs).
                const isBlob = url && (url.startsWith('blob:') || url.startsWith('data:'));
                const isInternal = !url || url === 'Default' || url.startsWith('audio/') || url.startsWith('assets/audio/');

                if (isInternal && !isBlob) {
                    showToast(`Mode Hybride (Texte) pour ${category}`, 2000);
                    showHybridAthkar(category, false);
                    return;
                } else {
                    showToast(`Mode Audio (Custom) pour ${category}`, 2000);
                    const stopBtn = document.getElementById('stop-athkar');
                    if (stopBtn) stopBtn.classList.remove('hidden');
                    showHybridAthkar(category, true);
                }
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
                // Connect to visualizer for equalizer effect (V36.2 - Masjid)
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
            overlay.style.display = "flex";
            overlay.style.opacity = "1";
            overlay.style.zIndex = "500000";

            bgImg.src = config.image;
            track.innerHTML = '';
            if (hybridScrollInterval) clearInterval(hybridScrollInterval);

            if (!audioOnly) {
                // Populate Text
                const textDiv = document.createElement('div');
                textDiv.className = 'hybrid-text';
                // Ensure text starts from a known state (hidden/down)
                textDiv.style.transform = 'translateY(110vh)'; 
                
                // Clean up newlines for better layout
                const cleanedText = config.text
                    .replace(/\r\n/g, '\n')
                    .replace(/\n\n+/g, '<br><br>') 
                    .replace(/\n/g, '<br>');      
                textDiv.innerHTML = cleanedText;
                track.appendChild(textDiv);

                // Auto-Scroll Logic (CSS Animation for fluid movement)
                // Use requestAnimationFrame for smoother start on TV
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        const contentHeight = textDiv.scrollHeight || textDiv.offsetHeight || 4000;
                        
                        // Security check: if height is 0, the text is invisible
                        if (contentHeight < 50) {
                            console.warn("⚠️ Hybrid Text Height is too small:", contentHeight);
                            textDiv.style.minHeight = "2000px"; // Force a minimum height for scrolling if measurement fails
                        }

                        // Duration: approx 10s per 500px of text
                        const duration = Math.max(65, (contentHeight / 100) * 12.0);

                        console.log(`🎬 [Hybrid] Category: ${category}, Content Height: ${contentHeight}px, Duration: ${duration}s`);

                        // Force animation start
                        textDiv.style.animationDuration = `${duration}s`;
                        textDiv.style.webkitAnimationDuration = `${duration}s`;
                        textDiv.style.transform = ''; // Clear initial transform
                        textDiv.classList.add('scrolling-active');

                        // Cleanup when animation ends
                        const onEnd = () => {
                            console.log("🎬 [Hybrid] Animation Finished");
                            closeHybridAthkar();
                        };
                        textDiv.addEventListener('animationend', onEnd, { once: true });
                        textDiv.addEventListener('webkitAnimationEnd', onEnd, { once: true });
                    }, 800); // Increased delay for layout stabilization on TV
                });
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
                    'city-input': CONFIG.city,
                    'country-input': CONFIG.country,
                    'weather-key-input': CONFIG.weatherApiKey,
                    'hijri-offset': CONFIG.hijriOffset,
                    'slideshow-interval-select': CONFIG.slideshowIntervalSec, // Changed ID
                    'wakelock-input': CONFIG.wakeLockMinutes,
                    'font-select': localStorage.getItem('athan_font') || 'aref',
                    // V13.0: Populate Time Inputs
                    'time-wakeup': CONFIG.athkars.wakeup.time,
                    'time-morning': CONFIG.athkars.morning.time,
                    'time-evening': CONFIG.athkars.evening.time,
                    'time-sleep': CONFIG.athkars.sleep.time,
                    'time-kahf': CONFIG.quran.kahf.time
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

                    const pNameAr = (I18N.ar.prayers && I18N.ar.prayers[pKey]) ? I18N.ar.prayers[pKey] : pKey;

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
                                <input type="file" accept="video/*" onchange="handleAthanFile('${pKey}', this.files[0])" style="width:100%; font-size:0.8rem;">
                                <button onclick="testAthan('${pKey}')" style="background:var(--neon-gold); border:none; border-radius:3px; cursor:pointer;" title="Test">▶</button>
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
                                 <input type="file" accept="video/*" onchange="handleCadreFile('${pKey}', this.files[0])" style="flex-grow:1; font-size:0.8rem;">
                                 <button onclick="testCadre('${pKey}')" style="background:var(--neon-cyan); color:black; border:none; border-radius:3px; cursor:pointer; padding: 2px 8px;" title="Test">▶</button>
                            </div>
                            <div style="font-size:0.7rem; color:#aaa;">${cadreStatus}</div>
                        `;
                        grid.appendChild(cadreDiv);

                        // Iqama Duration Input
                        const iqamaDiv = document.createElement('div');
                        iqamaDiv.style.cssText = 'grid-column: span 2; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1);';
                        const currentIqama = CONFIG.iqamaDurations ? CONFIG.iqamaDurations[pKey] : (pKey === 'Maghrib' ? 5 : 10);
                        
                        iqamaDiv.innerHTML = `
                            <label style="display:block; color:var(--neon-gold); font-size:0.9rem; margin-bottom:5px;">وقت الإقامة (دقيقة: 0-25)</label>
                            <div style="display:flex; align-items:center; gap:10px;">
                                <input type="number" min="0" max="25" value="${currentIqama}" 
                                    onchange="updateIqamaDuration('${pKey}', this.value)"
                                    style="width:70px; padding:5px; background:rgba(255,255,255,0.1); color:white; border:1px solid rgba(255,255,255,0.2); border-radius:5px; text-align:center;">
                                <span style="font-size:0.8rem; color:#ccc;">دقيقة</span>
                            </div>
                        `;
                        grid.appendChild(iqamaDiv);
                    } else {
                        // Shuruq
                        const shuruqDiv = document.createElement('div');
                        shuruqDiv.innerHTML = `
                        <label style="display:block; font-size:0.8rem; margin-bottom:5px;">فيديو الضحى</label>
                        <div style="display:flex; gap:5px;">
                            <input type="file" id="file-shuruq" accept="video/*" onchange="handleShuruqFile(this.files[0])" style="width:100%; font-size:0.8rem;">
                            <button onclick="testShuruq()" style="background:var(--neon-gold); border:none; border-radius:3px; cursor:pointer;" title="Test">▶</button>
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
            // Always use a fixed key per prayer for cadres to avoid cluttering DB
            const key = `cadre_${prayer}`;
            await MediaStorage.save(key, file);

            const url = URL.createObjectURL(file);
            if (!CONFIG.cadres) CONFIG.cadres = {};
            CONFIG.cadres[prayer] = url;

            showToast(`تم تحديث كادر ${I18N.ar.prayers[prayer] || prayer}`);
            saveSettings();
            loadSettingsValues();
        }

        // V13.0: Handler for Athan Files
        async function handleAthanFile(prayer, file) {
            if (!file) return;
            const key = `athan_${prayer}`;
            await MediaStorage.save(key, file);

            const url = URL.createObjectURL(file);
            CONFIG.athanVideos[prayer] = url;

            showToast(`تم تحديث أذان ${I18N.ar.prayers[prayer] || prayer}`);
            saveSettings();
            loadSettingsValues();
        }

        // V13.0: Handler for Shuruq File
        async function handleShuruqFile(file) {
            if (!file) return;
            const key = `shuruq`;
            await MediaStorage.save(key, file);

            const url = URL.createObjectURL(file);
            CONFIG.shuruqVideo = url;

            showToast(`تم تحديث فيديو الشروق`);
            saveSettings();
            loadSettingsValues();
        }
        // Helper to test Cadre
        function testCadre(prayer) {
            const videoSrc = (CONFIG.cadres && CONFIG.cadres[prayer]) ? CONFIG.cadres[prayer] : CONFIG.athkarBgVideo;
            if (videoSrc) {
                window._isTestingMedia = true;
                const modal = document.getElementById('settings-modal');
                if (modal) modal.classList.add('hidden');

                showPostSalatAthkars(prayer);
                showToast(`Test Cadre: ${I18N.ar.prayers[prayer]}`);
            } else {
                showToast("Pas de cadre défini");
            }
        }

        // V14.0: Fixed ReferenceError: updateOffset is not defined
        function updateOffset(prayer, value) {
            console.log(`Updating offset for ${prayer}: ${value}`);
            CONFIG.prayerOffsets[prayer] = parseInt(value) || 0;
            saveSettings();
            fetchPrayerTimes(); // Refresh times immediately
            showToast(`تم تحديث توقيت ${I18N.ar.prayers[prayer] || prayer}`);
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
                    showToast(I18N[e.target.value]?.settings || 'Langue changée');
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
                            const videoUrl = URL.createObjectURL(file);
                            localStorage.setItem('athan_athkar_bg_type', 'video');
                            window._currentAthkarVideoBlob = videoUrl;
                            await MediaStorage.save('athkar_bg', file);
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
                            CONFIG.athanVideos[p] = URL.createObjectURL(file);
                            await MediaStorage.save(`athan_${p}`, file);
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
                        CONFIG.shuruqVideo = URL.createObjectURL(file);
                        await MediaStorage.save('shuruq', file);
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
                            const url = URL.createObjectURL(file);
                            if (key === 'kahf') CONFIG.quran.kahf.url = url;
                            else if (CONFIG.athkars[key]) CONFIG.athkars[key].url = url;

                            await MediaStorage.save(`audio_${key}`, file);
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

                saveCityBtn.addEventListener("click", async () => {
                    const query = cityInput.value.trim();
                    if (!query) return;
                    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${CONFIG.weatherApiKey}`;
                    try {
                        const response = await fetch(url);
                        const data = await response.json();
                        if (data && data.length > 0) {
                            const { lat, lon, name, country } = data[0];
                            CONFIG.city = name;
                            CONFIG.country = country;
                            CONFIG.coordinates = { lat, long: lon };
                            localStorage.setItem("athan_city", name);
                            localStorage.setItem("athan_country", country);
                            localStorage.setItem("athan_coords", JSON.stringify({ lat, long: lon }));
                            saveSettings();
                            if (document.querySelector(".city")) document.querySelector(".city").textContent = name;
                            if (typeof fetchWeather === "function") fetchWeather();
                            if (typeof fetchPrayerTimes === "function") fetchPrayerTimes();
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

            // App Logo Input (V11.9.2: Now uses IndexedDB for GIFs/Large files)
            const appLogoInput = document.getElementById('app-logo-input');
            if (appLogoInput) {
                appLogoInput.addEventListener('change', async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const url = URL.createObjectURL(file);
                        const settingsBtn = document.getElementById('open-settings');

                        // Update UI immediately (Safe Mode with IMG)
                        settingsBtn.textContent = ''; // Clear emoji
                        settingsBtn.classList.add('has-logo');
                        settingsBtn.style.background = 'transparent'; // Ensure transparent background

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

                        // Save to IndexedDB
                        await MediaStorage.save('app_logo', file);
                        window._currentLogoBlob = url;
                        showToast("تم تحديث الشعار");
                        updateFilenameDisplays(); // Refresh label
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
                    const src = URL.createObjectURL(file);
                    const key = `backgrounds_${Date.now()}_${i}`;
                    bgFiles.push({ type, src, name: file.name, key: key });
                    await MediaStorage.save(key, file); // Unique key for each background
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

            if (clearBgBtn) {
                clearBgBtn.addEventListener('click', async () => {
                    if (confirm("هل تريد مسح جميع الخلفيات المخصصة؟")) {
                        bgFiles = [];
                        await MediaStorage.clear('backgrounds_'); // Clear all keys starting with 'backgrounds_'
                        // Reload defaults if needed
                        if (CONFIG.useDefaultSlideshow) {
                            const defaultSlides = ['hr1.jpg', 'hr2.jpg', 'hr3.jpg', 'hr4.jpg', 'hr5.jpg', 'hr6.jpg', 'hr7.jpg', 'hr8.jpg', 'hr9.jpg', 'hr10.jpg', 'hr11.jpg', 'hr12.jpg', 'hr13.jpg', 'hr14.jpg', 'hr15.jpg', 'hr16.jpg', 'hr17.jpg', 'hr18.jpg', 'hr19.jpg', 'hr20.jpg', 'hr21.jpg', 'hr22.jpg', 'hr23.jpg', 'hr24.jpg', 'hr25.jpg', 'hr26.jpg', 'hr27.jpg', 'hr28.jpg', 'hr29.jpg', 'hr30.jpg', 'hr31.jpg', 'hr32.jpg', 'hr33.jpg', 'hr34.jpg', 'hr35.jpg', 'hr36.jpg', 'hr37.jpg', 'hr38.jpg', 'hr39.jpg'];
                            defaultSlides.forEach(f => bgFiles.push({ type: 'image', src: `assets/slides/${f}`, name: f, isDefault: true }));
                        }
                        updateBgCount();
                        renderBackgroundGrid();
                        showBackground(0);
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

        async function resetAthkarBg() {
            localStorage.removeItem('athan_custom_athkar_bg');
            localStorage.removeItem('athan_athkar_bg_type');
            await MediaStorage.delete('athkar_bg');
            CONFIG.athkarBgVideo = 'cadre.mp4';
            window._currentAthkarVideoBlob = null;
            showToast("تم إعادة تعيين الخلفية");
            updateFilenameDisplays();
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

        // --- Check Prayer Time & Trigger Athan ---


        function checkPrayerTime(now) {
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            const seconds = now.getSeconds();
            const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

            for (const prayer of prayers) {
                const prayerTime = prayerTimes[prayer];
                if (!prayerTime) continue;

                // V31.0: PRO WARM-UP TECHNIQUE (Within 2 minutes)
                if (lastAthanMinute !== prayerTime && !isAthanPlaying) {
                    const [pH, pM] = prayerTime.split(':').map(Number);
                    const prayerDate = new Date(now);
                    prayerDate.setHours(pH, pM, 0, 0);

                    const secondsDiff = (prayerDate - now) / 1000;

                    if (secondsDiff > 0 && secondsDiff <= 120) {
                        if (preloadedPrayer !== prayer) {
                            console.log(`Deep Preloading ${prayer} (${Math.round(secondsDiff)}s remaining)...`);
                            preloadAthan(prayer);
                            preloadedPrayer = prayer;
                        }
                    }

                    // V36.4: CATCH-UP LOGIC (Within 2 minutes AFTER prayer)
                    const catchUpDiff = (now - prayerDate) / 1000;
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
            let currentPrayer = null;
            for (let i = prayers.length - 1; i >= 0; i--) {
                const [h, m] = prayerTimes[prayers[i]].split(':').map(Number);
                const prayerDate = new Date(now);
                prayerDate.setHours(h, m, 0, 0);
                if (now >= prayerDate) {
                    currentPrayer = prayers[i];
                    break;
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
            const videoFile = ATHAN_VIDEO_MAPPING[prayer];
            if (!videoFile) return;
            const videoUrl = "assets/videos/" + videoFile;

            console.log(`🎬 [Preload] Waking up hardware buffer for ${prayer}...`);

            // Mode Silencieux
            els.athanVideo.muted = true;
            els.athanVideo.volume = 0;
            
            // Check if already correct source
            if (!els.athanVideo.src || !els.athanVideo.src.endsWith(videoUrl)) {
                els.athanVideo.src = videoUrl;
                els.athanVideo.load();
            }

            // Start playing in background buffer (hidden)
            els.athanVideo.play().then(() => {
                console.log(`✅ [Preload] ${prayer} is ready in buffer.`);
            }).catch(err => {
                console.warn("⚠️ [Preload] Warm-up play blocked:", err);
            });
        }

        function playAthan(prayer) {
            // Watchdog against black screens
            const watchdog = setTimeout(() => {
                if (els.athanVideo.paused || els.athanVideo.currentTime === 0) {
                    console.error("🛑 [Watchdog] Video frozen, falling back to Audio!");
                    showToast("⚠️ Basculement sur l'audio (Vidéo trop lente)");
                    isAthanPlaying = false;
                    // Note: Here you'd call an audio-only fallback if desired, 
                    // or just let it continue to Iqama later.
                }
            }, 5000);

            if (isAthanPlaying && prayer !== 'Sunrise') {
                console.warn("playAthan blocked: isAthanPlaying is true");
                clearTimeout(watchdog);
                return;
            }

            currentPrayerForAthan = prayer;
            athanStartTime = Date.now();

            const videoFile = ATHAN_VIDEO_MAPPING[prayer];
            const videoUrl = "assets/videos/" + videoFile;

            if (!videoFile) {
                clearTimeout(watchdog);
                showToast(`Athan ${prayer} - Pas de vidéo`);
                if (!window._isTestingMedia) setTimeout(() => showIqama(prayer), 3000);
                window._isTestingMedia = false;
                isAthanPlaying = false;
                return;
            }

            console.log(`🚀 [Reveal] Unleashing ${prayer}...`);
            isAthanPlaying = true;
            clearTimeout(watchdog);

            // Hide Siyam/Athkar stuff
            hideSiyamWidget();

            // 1. RE-SYNC SOURCE if changed (or not yet set)
            if (!els.athanVideo.src || !els.athanVideo.src.endsWith(videoUrl)) {
                console.log("⚠️ [Reveal] Buffer mismatch, hard reloading...");
                els.athanVideo.src = videoUrl;
                els.athanVideo.load();
            }

            // 2. UNMUTE & RESTART
            els.athanVideo.pause(); // Ensure we restart frame 0
            els.athanVideo.currentTime = 0;
            els.athanVideo.muted = false;
            els.athanVideo.volume = 1.0;

            // 3. SHOW CONTAINER
            els.athanContainer.style.opacity = "1";
            els.athanContainer.classList.remove('hidden');
            els.athanContainer.style.display = 'flex';

            // 4. PLAY (INSTANT REVEAL)
            els.athanVideo.play().then(() => {
                const prayerName = I18N[currentLang].prayers[prayer] || prayer;
                showToast(`${prayerName} - الله أكبر`, 3000);
                startVideoMonitoring();
                window._isTestingMedia = false;
            }).catch(err => {
                console.error("❌ [Reveal] Instant Start Failed, retrying...", err);
                els.athanVideo.play().then(() => startVideoMonitoring())
                    .catch(e => {
                        console.error("🛑 [Reveal] Persistent failure", e);
                        isAthanPlaying = false;
                        if (!window._isTestingMedia) showIqama(prayer);
                    });
            });
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
            if (CONFIG.iqamaDurations && CONFIG.iqamaDurations[prayer] !== undefined) {
                return parseInt(CONFIG.iqamaDurations[prayer]) || 0;
            }
            // Fallback for safety
            if (prayer === 'Maghrib') return 5;
            return 10;
        }

        function updateIqamaDuration(prayer, value) {
            console.log(`Updating Iqama duration for ${prayer}: ${value}`);
            if (!CONFIG.iqamaDurations) CONFIG.iqamaDurations = {};
            CONFIG.iqamaDurations[prayer] = parseInt(value) || 0;
            saveSettings();
            showToast(`تم تحديث وقت إقامة ${I18N.ar.prayers[prayer] || prayer}`);
        }
        window.updateIqamaDuration = updateIqamaDuration;

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

            if (finalDurationSec === undefined || isNaN(finalDurationSec)) {
                if (window.IS_TEST_MODE) {
                    finalDurationSec = 120; // 2 mins for test
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

            // Show Overlay
            const iqamaEl = document.getElementById('iqama-fullscreen');
            if (iqamaEl) {
                iqamaEl.classList.remove('hidden');
                iqamaEl.classList.add('show');
            }

            // V41.3: Hide Siyam Widget during Iqama
            hideSiyamWidget();

            // Label
            const label = document.getElementById('iqama-label');
            const prayerTitle = (I18N[currentLang] && I18N[currentLang].prayers[prayerName]) ? I18N[currentLang].prayers[prayerName] : prayerName;
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
                    startSalatSequence(prayerName);
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

        function startSalatSequence(prayerName, durationMs = 120000) { // Default 2 mins
            console.log(`🕌 === ENTERING startSalatSequence ===`);
            console.log(`   Prayer: ${prayerName}`);
            console.log(`   Duration: ${durationMs}ms (${durationMs / 1000}s)`);

            // V10.8.1: Test Mode duration (1 min override)
            const finalDurationMs = window.IS_TEST_MODE ? 60000 : durationMs;

            console.log(`   Final Duration: ${finalDurationMs}ms`);
            console.log(`   Starting Salat Phase for ${finalDurationMs}ms`);

            iqamaState.active = false; // Iqama done
            salatState.active = true;  // Salat started
            console.log(`   States updated - Iqama: false, Salat: true`);

            // V31.1: WARM-UP ATHKAR CADRE NOW (5 mins ahead)
            preloadAthkarCadre(prayerName);

            // Ensure Iqama is closed
            closeIqama();

            // Create/Show Salat Overlay
            let overlay = document.getElementById('salat-overlay');
            if (!overlay) {
                console.log(`   Creating new salat-overlay element`);
                overlay = document.createElement('div');
                overlay.id = 'salat-overlay';
                overlay.className = 'hidden';
                document.body.appendChild(overlay);
            }

            // V36.6: PRO SALAT OVERLAY - Fullscreen & Blinking reminder
            overlay.innerHTML = `
                <div class="salat-content">
                    <p class="hadith-arabic hadith-medium blink-soft">صلّ بخشوع</p>
                    <h1 class="salat-title">الصلاة قائمة</h1>
                </div>
            `;

            console.log(`   Showing salat-overlay`);
            overlay.classList.remove('hidden');
            overlay.style.display = 'flex'; // Ensure flex is always set
            overlay.style.opacity = '1';

            if (salatTimeout) {
                console.log(`   Clearing previous salatTimeout`);
                clearTimeout(salatTimeout);
            }

            console.log(`   Setting timeout for ${finalDurationMs}ms`);
            salatTimeout = setTimeout(() => {
                console.log(`=== SALAT PHASE COMPLETE ===`);
                // End Salat -> Start Athkars
                salatState.active = false; // Salat done
                console.log(`   Hiding salat-overlay`);
                overlay.classList.add('hidden');
                overlay.style.display = 'none';

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
            document.getElementById('iqama-fullscreen').classList.remove('show');
            document.getElementById('iqama-fullscreen').classList.add('hidden');

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
                // Priority: Specific Cadre > Configured Video > Default
                const bgVideo = document.getElementById('athkar-bg-video');
                let videoSrc = DEFAULT_ASSETS.cadres[prayerName];

                // Fallback to configured global text background if no specific cadre found (or if user wants global override? 
                // User said "structure des cases cadres ... avec son texte spécifique". 
                // I will prioritize the per-prayer cadre.)
                if (!videoSrc) videoSrc = CONFIG.athkarBgVideo;

                if (bgVideo && videoSrc) {
                    // V31.1: REVEAL WARMED CADRE
                    bgVideo.muted = false;
                    bgVideo.volume = 1.0;
                    bgVideo.style.opacity = '1';
                    bgVideo.currentTime = 0; // RESTART AT BEGINNING
                    bgVideo.play().catch(e => {
                        console.warn("Reveal failed, doing hard start:", e);
                        bgVideo.src = videoSrc;
                        bgVideo.play();
                    });
                    overlay.style.background = 'black';

                    // Test Mode Auto-Close
                    if (window._isTestingMedia) {
                        bgVideo.onended = () => {
                            closePostSalatAthkars();
                        };
                    } else {
                        bgVideo.onended = null; // Loop or stay? Usually loop for athkars?
                        bgVideo.loop = true; // Ensure loop for real usage
                    }
                }

                // 2. Set Content (Title & Specific Text)
                const scroller = document.getElementById('athkars-scroller');
                if (scroller) {
                    scroller.innerHTML = ''; // Clear previous scroller/content

                    // Container
                    const container = document.createElement('div');
                    container.className = 'cadre-content-container';
                    container.style.cssText = 'position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); text-align:center; width:80%; z-index:100; display:flex; flex-direction:column; align-items:center; gap:30px;';

                    // Title
                    // Title Removed as requested ("garder que le texte brut")
                    // const pNameAr = ... (removed)
                    // const title = ... (removed)

                    // Specific Text
                    // Specific Text (Expanded to matches User Image)


                    // Specific Text (Strictly matching User Image Structure & User request)
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

                    // Assemble based on prayer
                    let athkarLines = [...ATHKAR_LIST_COMMON];
                    const pLower = prayerName.toLowerCase();

                    // Common following (Repetitions)
                    athkarLines.push("سبحان الله (33 مرة)، والحمد لله (33 مرة)، والله أكبر (33 مرة)");
                    athkarLines.push(FULL_TEHLIL_1);

                    // Special 10x Tehlil
                    if (pLower === 'fajr' || pLower === 'maghrib') {
                        athkarLines.push(TEHLIL_10);
                    }

                    // Quranic items
                    athkarLines.push("آية الكرسي (الله لا إله إلا هو الحي القيوم...)");

                    if (pLower === 'fajr' || pLower === 'maghrib') {
                        athkarLines.push(MUAWWIDHAT_3);
                        if (pLower === 'fajr') {
                            athkarLines.push("اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً");
                        }
                    } else if (pLower !== 'sunrise') {
                        athkarLines.push(MUAWWIDHAT_1);
                    } else {
                        // Sunrise fallback
                        athkarLines = ["سبحان الله و بحمده (100 مرة)"];
                    }

                    // V35.1: Add Help Dua at the end of the scroll cycle
                    if (['dhuhr', 'asr', 'maghrib', 'isha'].includes(pLower)) {
                        athkarLines.push(HELP_DUA);
                    }

                    const textDiv = document.createElement('div');
                    // Create formatted list (No Background)
                    const listHtml = athkarLines.map(line =>
                        `<div style="margin-bottom:20px; padding:10px; border-radius:10px; width:90%; margin-left:auto; margin-right:auto;">${line}</div>`
                    ).join('');

                    // Single scroll for 2-minute cadence
                    const spacer = '<div style="height: 100px;"></div>';
                    const finalListHtml = listHtml + spacer;

                    textDiv.innerHTML = finalListHtml;
                    // Color: Gold (#FFD700), Font Size aligned
                    textDiv.style.cssText = "font-family:'Aref Ruqaa'; font-size:2.8rem; color:#FFD700; width:100%; text-align:center; text-shadow:2px 2px 4px black;";

                    // Simple Vertical Scroll Wrapper
                    const scrollWrapper = document.createElement('div');
                    scrollWrapper.style.cssText = "width:100%; height: 80vh; overflow:hidden; mask-image: linear-gradient(to bottom, transparent, black 5%, black 95%, transparent); display:flex; justify-content:center; align-items:flex-start; padding-top:20px;";

                    if (!document.getElementById('v-scroll-style')) {
                        const style = document.createElement('style');
                        style.id = 'v-scroll-style';
                        style.textContent = `
                            @keyframes vertical-scroll {
                                0% { transform: translateY(80vh); } 
                                100% { transform: translateY(-100%); } 
                            }
                        `;
                        document.head.appendChild(style);
                    }

                    // V35.1: Dynamic Synchronization Logic
                    const startAnimation = (duration) => {
                        console.log(`🎬 Synchronizing Athkars: Duration = ${duration}s`);
                        textDiv.style.display = 'block';
                        textDiv.style.animation = `vertical-scroll ${duration}s linear 1 forwards`;

                        if (athkarsTimeout) clearTimeout(athkarsTimeout);
                        athkarsTimeout = setTimeout(closePostSalatAthkars, (duration + 1) * 1000); // +1s safety
                    };

                    const v = document.getElementById('athkar-bg-video');
                    if (v) {
                        v.loop = false; // V35.1: Close when video ends
                        if (v.readyState >= 1) { // Metadata already loaded
                            startAnimation(v.duration || 120);
                        } else {
                            v.onloadedmetadata = () => startAnimation(v.duration || 120);
                            // Fallback after 3s if metadata fails
                            setTimeout(() => {
                                if (textDiv.style.animation === '') startAnimation(120);
                            }, 3000);
                        }

                        v.onended = closePostSalatAthkars; // Natural end
                    } else {
                        startAnimation(120); // Fallback without video
                    }

                    scrollWrapper.appendChild(textDiv);
                    container.appendChild(scrollWrapper);
                    scroller.appendChild(container);

                    // Show Overlay
                    overlay.classList.remove('hidden');
                    overlay.classList.add('show');
                    overlay.style.display = 'flex';

                    postAthkarState.active = true;
                }
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
                const src = URL.createObjectURL(file);

                // Add to runtime array
                bgFiles.push({ type, src, name: file.name });

                // Save to IndexedDB with unique key
                const uniqueKey = `bg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                await MediaStorage.save(uniqueKey, file);
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
                bgVideo.src = bg.src;
                bgVideo.classList.remove('hidden');
                bgVideo.classList.add('active');
                bgVideo.play();
            } else {
                bgVideo.pause();
                bgVideo.classList.add('hidden');
                bgVideo.classList.remove('active');

                const nextLayer = (currentLayer === 1) ? layer2 : layer1;
                const prevLayer = (currentLayer === 1) ? layer1 : layer2;

                nextLayer.style.backgroundImage = `url('${bg.src}')`;

                nextLayer.classList.add('active');
                prevLayer.classList.remove('active');
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
        // STORAGE V36.2 - Masjid - Dual-layer: localStorage + IndexedDB
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
                // CITY & LOCATION
                city: localStorage.getItem('athan_city') || '',
                coords: localStorage.getItem('athan_coords') || '',
                // PRAYER OFFSETS (critical - never touch)
                prayerOffsets: { ...CONFIG.prayerOffsets },
                // HIJRI
                hijriOffset: CONFIG.hijriOffset || 0,
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
                // FONT & LANG
                font: localStorage.getItem('athan_font') || 'aref',
                lang: document.body.classList.contains('lang-fr') ? 'fr' : 'ar',
                iqamaDurations: { ...CONFIG.iqamaDurations },
                settingsIcon: localStorage.getItem('athan_settings_icon') || 'assets/images/settings_btn.gif',
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
            ['morning', 'evening', 'sleep', 'wakeup'].forEach(key => {
                const input = document.getElementById(`time-${key}`);
                if (input && CONFIG.athkars[key]) CONFIG.athkars[key].time = input.value;
            });

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
                ['morning', 'evening', 'sleep', 'wakeup', 'kahf'].forEach(k => {
                    const el = document.getElementById(`name-file-${k}`);
                    if (el) {
                        let path = '';
                        if (k === 'kahf') path = CONFIG.quran.kahf ? CONFIG.quran.kahf.url : '';
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

        // --- Load Settings (Robust V36.2 - Masjid) ---
        async function restoreConfigFromStorage() {
            let saved = null;

            // Layer 1: Try localStorage first
            try {
                const raw = localStorage.getItem(PREFS_KEY) || localStorage.getItem('athan_prefs');
                if (raw) saved = JSON.parse(raw);
            } catch(e) { console.warn('localStorage read failed', e); }

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
                } catch(e) { console.warn('IDB settings restore failed', e); }
            }

            if (!saved) { console.warn('No saved settings found - using defaults'); return; }

            // ---- RESTORE PRAYER OFFSETS (most critical - preserve exactly) ----
            if (saved.prayerOffsets && typeof saved.prayerOffsets === 'object') {
                Object.keys(saved.prayerOffsets).forEach(k => {
                    if (CONFIG.prayerOffsets.hasOwnProperty(k)) {
                        CONFIG.prayerOffsets[k] = parseInt(saved.prayerOffsets[k]) || 0;
                    }
                });
            }

            // ---- RESTORE HIJRI OFFSET ----
            if (saved.hijriOffset !== undefined) CONFIG.hijriOffset = saved.hijriOffset;

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
                if (cityLabel) cityLabel.textContent = CONFIG.city;
            }
            if (saved.coords) {
                localStorage.setItem('athan_coords', saved.coords);
                try { CONFIG.coordinates = JSON.parse(saved.coords); } catch(e) {}
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
                    if (!CONFIG.athkars[k]) CONFIG.athkars[k] = {};
                    if (a.time) CONFIG.athkars[k].time = a.time;
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
                if (saved.quran.kahf) {
                    if (saved.quran.kahf.url && (saved.quran.kahf.url.includes('AthanTV_Resources') || saved.quran.kahf.url.includes('resources/'))) {
                        saved.quran.kahf.url = 'assets/audio/vendredi.mp3';
                    }
                    CONFIG.quran.kahf = saved.quran.kahf;
                }
                if (saved.quran.mulk) CONFIG.quran.mulk = saved.quran.mulk;
            }

            // ---- RESTORE WAKELOCK & UI SETTINGS ----
            if (saved.wakeLockEnabled !== undefined) CONFIG.wakeLockEnabled = saved.wakeLockEnabled;
            if (saved.layoutLocked !== undefined) CONFIG.layoutLocked = saved.layoutLocked;
            if (saved.slideshowIntervalSec !== undefined) CONFIG.slideshowIntervalSec = saved.slideshowIntervalSec;

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
                } catch(e) {}
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
                console.log("GEMINI ATHAN TV V36.2 - Masjid - SILENT START");
                await restoreConfigFromStorage();
                initSettingsListeners();
                QuranPlayer.init();
                fetchWeather(); // Re-enabled
                fetchPrayerTimes();
                AudioVisualizer.init();

                // Force layout unlock again after restoration
                CONFIG.layoutLocked = false;
                initDraggable(); 

                // V11.9.1: Global Unlock for Audio Visualizer (Fixes Equalizer)
                const unlockHandler = () => {
                    AudioVisualizer.unlockAudio();
                    document.removeEventListener('click', unlockHandler);
                    document.removeEventListener('keydown', unlockHandler);
                };
                document.addEventListener('click', unlockHandler);
                document.addEventListener('keydown', unlockHandler);

                // TV REMOTE SCROLL FIX
                document.addEventListener('keydown', (e) => {
                    const modal = document.getElementById('settings-modal');
                    if (modal && !modal.classList.contains('hidden')) {
                        const content = modal.querySelector('.settings-content');
                        if (content) {
                            if (e.key === 'ArrowDown') { content.scrollBy({ top: 50, behavior: 'smooth' }); e.preventDefault(); }
                            else if (e.key === 'ArrowUp') { content.scrollBy({ top: -50, behavior: 'smooth' }); e.preventDefault(); }
                        }
                    }
                    // Weather forecast modal scroll
                    const weatherModal = document.getElementById('weather-forecast-modal');
                    if (weatherModal && weatherModal.classList.contains('show')) {
                        const container = weatherModal.querySelector('.forecast-container');
                        if (container) {
                            if (e.key === 'ArrowDown') { container.scrollBy({ top: 80, behavior: 'smooth' }); e.preventDefault(); }
                            else if (e.key === 'ArrowUp') { container.scrollBy({ top: -80, behavior: 'smooth' }); e.preventDefault(); }
                        }
                    }
                });

                // Default slides
                if (bgFiles.length === 0 && CONFIG.useDefaultSlideshow) {
                    const defaultSlides = []; // List previously hardcoded, now dynamically loaded or handled via relative 'assets/slides/'
                    for (let i = 1; i <= 39; i++) defaultSlides.push(`hr${i}.jpg`);
                    defaultSlides.forEach(f => bgFiles.push({ type: 'image', src: `assets/slides/${f}`, name: f, isDefault: true }));
                    shuffleArray(bgFiles);
                }

                if (bgFiles.length > 0) {
                    updateBgCount();
                    startSlideshow();
                }

                showToast("Application démarrée");
                console.log("Init sequence complete.");
                                document.addEventListener('keydown', function(e) {
                    if (e.key === 'x' || e.key === 'X' || e.keyCode === 88) {
                        const active = document.activeElement;
                        if (active && active.tagName === 'INPUT') {
                            active.value = '';
                            const event = new Event('input', { bubbles: true });
                            active.dispatchEvent(event);
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }
                });
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
    


        document.addEventListener('DOMContentLoaded', function () {
            // --- TV Remote Navigation Logic ---

            let currentFocus = null;

            // Helper to find all focusable elements
            function getFocusableElements() {
                // Select all elements with class 'focusable' that are visible
                const allFocusables = Array.from(document.querySelectorAll('.focusable, button, input, .bg-item'));
                return allFocusables.filter(el => {
                    // Check if element is visible
                    return el.offsetParent !== null && !el.disabled && el.style.display !== 'none' && el.tabIndex !== -1;
                });
            }

            // Initial Focus
            function initFocus() {
                const focusables = getFocusableElements();
                if (focusables.length > 0) {
                    // Prefer settings button or first element
                    const settingsBtn = document.getElementById('open-settings');
                    if (settingsBtn && settingsBtn.offsetParent !== null && !settingsBtn.classList.contains('hidden')) {
                        currentFocus = settingsBtn;
                    } else {
                        currentFocus = focusables[0];
                    }
                    if (currentFocus) currentFocus.focus();
                }
            }

            // Focus Navigation Handler
            function handleNavigation(direction) {
                const focusables = getFocusableElements();
                if (focusables.length === 0) return;

                if (!currentFocus || currentFocus.offsetParent === null || currentFocus.classList.contains('hidden')) {
                    initFocus();
                    return;
                }

                const currentRect = currentFocus.getBoundingClientRect();
                const currentCenter = {
                    x: currentRect.left + currentRect.width / 2,
                    y: currentRect.top + currentRect.height / 2
                };

                let bestCandidate = null;
                let minDistance = Infinity;

                focusables.forEach(el => {
                    if (el === currentFocus) return;

                    const rect = el.getBoundingClientRect();
                    const center = {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2
                    };

                    // Vector from current to candidate
                    const dx = center.x - currentCenter.x;
                    const dy = center.y - currentCenter.y;

                    // Direction Check
                    let isDirectionCorrect = false;
                    if (direction === 'UP') isDirectionCorrect = dy < -5; // Tolerance
                    else if (direction === 'DOWN') isDirectionCorrect = dy > 5;
                    else if (direction === 'LEFT') isDirectionCorrect = dx < -5;
                    else if (direction === 'RIGHT') isDirectionCorrect = dx > 5;

                    if (isDirectionCorrect) {
                        // Euclidean distance preferred for visual navigation
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        // Optimization: Prefer closer orthogonal alignment
                        // e.g. if moving UP, prefer items with similar X
                        let alignmentPenalty = 0;
                        if (direction === 'UP' || direction === 'DOWN') {
                            alignmentPenalty = Math.abs(dx) * 2;
                        } else {
                            alignmentPenalty = Math.abs(dy) * 2;
                        }

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

                    // Ensure scrolled into view if inside a scrollable container (like settings)
                    bestCandidate.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }

            // Keydown Listener
            window.addEventListener('keydown', function (e) {
                // Map standard remote keys
                // 37: Left, 38: Up, 39: Right, 40: Down
                // 13: Enter
                // 27: Esc/Back
                // 10009: Tizen Back
                // 461: WebOS Back
                // 8: Backspace/Back

                console.log('Key pressed:', e.keyCode);

 switch (e.keyCode) {
    case 37: // Left
        handleNavigation('LEFT');
        break;
    case 38: // Up
        handleNavigation('UP');
        break;
    case 39: // Right
        handleNavigation('RIGHT');
        break;
    case 40: // Down
        handleNavigation('DOWN');
        break;
    case 13: // Enter
        if (currentFocus) currentFocus.click();
        break;
    case 8: // Backspace
        // Autoriser Backspace dans les champs de saisie
        if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
            break; // Laisse l'effacement normal se faire
        }
        // Sinon, on laisse tomber vers la fermeture des modales (pas de break)
    case 88: // Touche X (effacement)
        if (document.activeElement && document.activeElement.tagName === 'INPUT') {
            document.activeElement.value = '';
            // Déclencher l'événement input pour mettre à jour la valeur
            const event = new Event('input', { bubbles: true });
            document.activeElement.dispatchEvent(event);
            break;
        }
        // Si pas dans un champ, on traite comme une touche de fermeture (on laisse tomber)
    case 27: // Esc
    case 461: // WebOS Back
    case 10009: // Tizen Back
        // Fermeture des modales
        const settingsModal = document.getElementById('settings-modal');
        const athanContainer = document.getElementById('athan-player-container');
        const confirmModal = document.getElementById('confirm-modal');
        const weatherForecastModal = document.getElementById('weather-forecast-modal');
        const quranPlayerModal = document.getElementById('quran-player-modal');
        const fastingWidget = document.getElementById('fasting-widget');

        if (settingsModal && !settingsModal.classList.contains('hidden')) {
            const closeBtn = document.getElementById('close-settings');
            if (closeBtn) closeBtn.click();
        } else if (athanContainer && !athanContainer.classList.contains('hidden')) {
            document.getElementById('close-athan').click();
        } else if (weatherForecastModal && weatherForecastModal.classList.contains('show')) {
            weatherForecastModal.classList.remove('show');
        } else if (quranPlayerModal && !quranPlayerModal.classList.contains('hidden')) {
            document.getElementById('close-quran').click();
        } else if (fastingWidget && fastingWidget.classList.contains('show')) {
            fastingWidget.classList.remove('show');
        }
        break;
}
            });

            // Mouse/Pointer hover should update current focus to avoid conflict
            document.body.addEventListener('mouseover', function (e) {
                if (e.target.classList.contains('focusable') || e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.classList.contains('bg-item')) {
                    currentFocus = e.target;
                }
            });

            // Initial call
        });
    


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
    


function saveV3Settings() {
    try {
        const configToSave = {
            prayerOffsets: typeof CONFIG !== 'undefined' ? CONFIG.prayerOffsets : {},
            iqamaDurations: typeof CONFIG !== 'undefined' ? CONFIG.iqamaDurations : {},
            athanVideos: typeof CONFIG !== 'undefined' ? CONFIG.athanVideos : {},
            athkarAudio: typeof CONFIG !== 'undefined' ? CONFIG.athkarAudio : {},
            testMode: typeof IS_TEST_MODE !== 'undefined' ? IS_TEST_MODE : false
        };
        document.querySelectorAll('input[type="number"], select').forEach(el => {
            if (el.id) configToSave[el.id] = el.value;
        });
        localStorage.setItem('AthanTV_Config_V3_Work', JSON.stringify(configToSave));
    } catch(e) {}
}

function loadV3Settings() {
    try {
        const saved = localStorage.getItem('AthanTV_Config_V3_Work');
        if (saved && typeof CONFIG !== 'undefined') {
            const parsed = JSON.parse(saved);
            if (parsed.prayerOffsets) Object.assign(CONFIG.prayerOffsets, parsed.prayerOffsets);
            if (parsed.iqamaDurations) {
                if (!CONFIG.iqamaDurations) CONFIG.iqamaDurations = {};
                Object.assign(CONFIG.iqamaDurations, parsed.iqamaDurations);
            }
            if (parsed.athanVideos) Object.assign(CONFIG.athanVideos, parsed.athanVideos);
            if (parsed.athkarAudio) Object.assign(CONFIG.athkarAudio, parsed.athkarAudio);
            if (parsed.testMode !== undefined) window.IS_TEST_MODE = parsed.testMode;
            
            document.querySelectorAll('input[type="number"], select').forEach(el => {
                if (el.id && parsed[el.id] !== undefined) el.value = parsed[el.id];
            });

            // V41.9: Restore language on startup
            const savedLang = localStorage.getItem('athan_lang') || 'ar';
            setLanguage(savedLang);
        } else {
            // Default language if no settings exist
            const defaultLang = localStorage.getItem('athan_lang') || 'ar';
            setLanguage(defaultLang);
        }
    } catch(e) {
        console.error("loadV3Settings error:", e);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadV3Settings, 500);
    document.body.addEventListener('change', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') saveV3Settings();
    });
});
