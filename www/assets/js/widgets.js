/**
 * widgets.js - Gemini Athan TV UI Components
 * Handles draggable widgets, fasting widget, and clock UI.
 */

// --- 1. Draggable Manager ---
const DraggableManager = {
    isDragging: false,
    dragItem: null,
    dragOffsetX: 0,
    dragOffsetY: 0,

    init: function() {
        if (typeof CONFIG.layoutLocked === 'undefined') CONFIG.layoutLocked = false;
        
        const draggables = document.querySelectorAll('.draggable, .draggable-item, .next-prayer-container, .prayer-times-list, #athkar-ticker, #fasting-widget, #unified-clock-widget, #next-prayer-container, #prayer-list');

        draggables.forEach(el => {
            el.style.position = 'fixed';
            el.style.pointerEvents = 'auto';
            el.style.cursor = CONFIG.layoutLocked ? 'default' : 'pointer';

            const key = el.id ? `pos_${el.id}` : `pos_${el.className.split(' ')[0].replace('.', '')}`;
            const savedPos = JSON.parse(localStorage.getItem(key) || 'null');

            if (el.id !== 'athkar-ticker') {
                el.style.width = 'fit-content';
                el.style.whiteSpace = 'nowrap';
                el.style.minWidth = '30px'; 
            } else {
                el.style.width = '100%'; 
                el.style.textAlign = 'center';
            }

            if (savedPos && savedPos.left && savedPos.top) {
                el.style.setProperty('left', savedPos.left, 'important');
                el.style.setProperty('top', savedPos.top, 'important');
                el.style.setProperty('right', 'auto', 'important');
                el.style.setProperty('bottom', 'auto', 'important');
                
                // Safety for Fasting Widget
                if (el.id === 'fasting-widget') {
                    const l = parseInt(savedPos.left);
                    const t = parseInt(savedPos.top);
                    if (isNaN(l) || isNaN(t) || l < 0 || t < 0 || l > window.innerWidth || t > window.innerHeight) {
                        this.resetPosition(el, 'fasting-widget');
                    }
                }
            } else {
                this.resetPosition(el, el.id);
            }
            
            if (!el._hasDragInit) {
                el.onmousedown = (e) => this.startDrag(e);
                el.ontouchstart = (e) => this.startDrag(e);
                el._hasDragInit = true;
            }
        });

        // Global Listeners
        window.onmousemove = (e) => this.drag(e);
        window.onmouseup = () => this.stopDrag();
        window.ontouchend = () => this.stopDrag();
        window.addEventListener('touchmove', (e) => this.drag(e), { passive: false });
    },

    resetPosition: function(el, id) {
        if (id === 'fasting-widget') { 
            el.style.setProperty('top', '20px', 'important'); 
            el.style.setProperty('right', '20px', 'important'); 
            el.style.setProperty('left', 'auto', 'important'); 
        } else if (id === 'next-prayer-container') { 
            el.style.setProperty('top', '120px', 'important'); 
            el.style.setProperty('right', '5%', 'important'); 
            el.style.setProperty('left', 'auto', 'important'); 
        } else if (id === 'prayer-list') { 
            el.style.setProperty('top', '15px', 'important'); 
            el.style.setProperty('right', '35%', 'important'); 
            el.style.setProperty('left', 'auto', 'important'); 
        }
    },

    startDrag: function(e) {
        if (CONFIG.layoutLocked) return;
        if (e.target.tagName === 'BUTTON' || e.target.closest('.no-drag')) return;

        this.isDragging = true;
        this.dragItem = e.currentTarget;

        const clientX = (e.type === 'touchstart' && e.touches && e.touches[0]) ? e.touches[0].clientX : (e.clientX || 0);
        const clientY = (e.type === 'touchstart' && e.touches && e.touches[0]) ? e.touches[0].clientY : (e.clientY || 0);

        const rect = this.dragItem.getBoundingClientRect();
        this.dragOffsetX = clientX - rect.left;
        this.dragOffsetY = clientY - rect.top;

        this.dragItem.style.transition = 'none';
        this.dragItem.classList.add('dragging');
        document.body.style.cursor = 'move';
        
        if (e.type === 'touchstart') e.preventDefault();
    },

    drag: function(e) {
        if (!this.isDragging || !this.dragItem) return;
        
        const clientX = (e.type === 'touchmove' && e.touches && e.touches[0]) ? e.touches[0].clientX : (e.clientX || 0);
        const clientY = (e.type === 'touchmove' && e.touches && e.touches[0]) ? e.touches[0].clientY : (e.clientY || 0);

        let x = clientX - this.dragOffsetX;
        let y = clientY - this.dragOffsetY;

        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        x = Math.max(-100, Math.min(x, screenW - 20));
        y = Math.max(-100, Math.min(y, screenH - 20));

        if (!isNaN(x) && !isNaN(y)) {
            this.dragItem.style.setProperty('left', x + 'px', 'important');
            this.dragItem.style.setProperty('top', y + 'px', 'important');
            this.dragItem.style.setProperty('right', 'auto', 'important');
            this.dragItem.style.setProperty('bottom', 'auto', 'important');
        }
        
        if (e.cancelable) e.preventDefault();
    },

    stopDrag: function() {
        if (this.isDragging && this.dragItem) {
            const key = this.dragItem.id ? `pos_${this.dragItem.id}` : `pos_${this.dragItem.className.split(' ')[0].replace('.', '')}`;
            localStorage.setItem(key, JSON.stringify({
                left: this.dragItem.style.left,
                top: this.dragItem.style.top
            }));

            this.dragItem.style.transition = '';
            this.dragItem.classList.remove('dragging');
        }
        
        this.isDragging = false;
        this.dragItem = null;
        document.body.style.cursor = 'default';
    }
};

// --- 2. Fasting (Siyam) Widget ---
const FastingWidget = {
    update: function(now, hijriDateString, currentLang, prayerTimes) {
        const widget = document.getElementById('fasting-widget');
        if (!widget || !hijriDateString) return;

        const toMin = (t) => { if (!t) return 0; const [h, m] = t.split(':').map(Number); return h * 60 + m; };
        const nowMin = now.getHours() * 60 + now.getMinutes();
        const fajrMin = prayerTimes ? toMin(prayerTimes.Fajr) : 300;
        const maghribMin = prayerTimes ? toMin(prayerTimes.Maghrib) : 1140;

        const hParts = hijriDateString.split('|');
        const mainPart = hParts[0].trim().split(' ');
        const hDay = parseInt(mainPart[0]);
        const hMonthNumber = hParts[1] ? parseInt(hParts[1]) : 0; // Numeric month from "DAY NAME YEAR|NUM"
        const hMonthName = mainPart.slice(1, -1).join(' '); // For display only
        const dayOfWeek = now.getDay(); 

        let fastingType = "";

        // --- 1. PRIORITY: MAJOR EVENTS — Uses month NUMBER for 100% reliable detection ---
        const getMajor = (d, monthNum) => {
            if (monthNum === 9)  return "ramadan";          // Ramadan
            if (monthNum === 10 && d >= 3 && d <= 20) return "chawal6"; // 6 jours Shawwal (3 to 20) - USER REQUEST: Prioritized
            if (monthNum === 12 && d === 9)  return "arafat";  // Arafat
            if (monthNum === 1  && (d === 9 || d === 10)) return "achoura"; // Achoura
            if (monthNum === 10 && d <= 2)   return "aid_fitr";  // Eid al-Fitr (1-2 Shawwal)
            if (monthNum === 12 && d >= 10 && d <= 12) return "aid_adha"; // Eid al-Adha
            if ([13, 14, 15].includes(d)) return "ayam_bidh"; // Jours blancs (tout mois)
            return "";
        };

        const labelKey = hMonthNumber > 0 ? getMajor(hDay, hMonthNumber) : "";
        if (labelKey) {
            fastingType = (t("fasting") || {})[labelKey] || labelKey;
        }

        // --- 2. WEEKLY SUNNAH (Lundi / Jeudi) with Tadkhir ---
        if (!fastingType) {
            if (dayOfWeek === 0 && nowMin >= fajrMin) {
                const tk = (nowMin < maghribMin) ? "tadkhir_mon" : "sunnah_mon";
                fastingType = (t("fasting") || {})[tk] || tk;
            } else if (dayOfWeek === 1 && nowMin < fajrMin) {
                fastingType = (t("fasting") || {})["sunnah_mon"] || "sunnah_mon";
            }
            else if (dayOfWeek === 3 && nowMin >= fajrMin) {
                const tk = (nowMin < maghribMin) ? "tadkhir_thu" : "sunnah_thu";
                fastingType = (t("fasting") || {})[tk] || tk;
            } else if (dayOfWeek === 4 && nowMin < fajrMin) {
                fastingType = (t("fasting") || {})["sunnah_thu"] || "sunnah_thu";
            }
        }

        // --- 3. DISPLAY ---
        if (fastingType) {
            // FIX CRITIQUE: Ne réafficher le widget QUE s'il n'est pas
            // intentionnellement masqué par une autre logique (athan, iqama, settings, cadre)
            // On vérifie la présence d'un attribut data-force-hidden posé par la logique principale
            if (widget.dataset.forceHidden === 'true') return;
            widget.classList.remove('hidden');
            widget.style.display = 'flex';
            const dayEl = widget.querySelector('.fasting-day');
            const typeEl = widget.querySelector('.fasting-type');

            if (dayEl) dayEl.textContent = fastingType; 
            if (typeEl) typeEl.textContent = fastingType;
        } else {
            widget.classList.add('hidden');
            widget.style.display = 'none';
        }
    },

    setSouhourBackground: function(active) {
        const overlay = document.getElementById('souhour-overlay');
        const widget = document.getElementById('fasting-widget');
        if (!overlay) return;
        if (active) {
            overlay.style.display = 'flex';
            overlay.style.zIndex = '900';
            const img = document.getElementById('souhour-img');
            if (img && (!img.src || img.src.endsWith('souhour_alert.jpg') || img.naturalWidth === 0)) {
                img.src = 'assets/images/sabah.jpg';
            }
            if (widget) widget.style.zIndex = '999999';
        } else {
            overlay.style.display = 'none';
        }
    }
};

// --- 3. Clock Widget ---
const ClockWidget = {
    update: function(now, currentLang, I18N, hijriOffset) {
        // V37.9: More robust timezone conversion for Android TV
        let hours, minutes;
        
        if (typeof CONFIG !== 'undefined' && CONFIG.timezone) {
            try {
                // V41.12: Robust Padding (Fixes "9" instead of "09")
                const timeStr = now.toLocaleString("en-GB", { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    hour12: false, 
                    timeZone: CONFIG.timezone 
                });
                const parts = timeStr.split(':');
                hours = parts[0].replace(/\D/g, '').padStart(2, '0');
                minutes = parts[1].replace(/\D/g, '').padStart(2, '0');
            } catch (e) {
                console.warn("Timezone conversion failed, using system time", e);
                hours = String(now.getHours()).padStart(2, '0');
                minutes = String(now.getMinutes()).padStart(2, '0');
            }
        } else {
            hours = String(now.getHours()).padStart(2, '0');
            minutes = String(now.getMinutes()).padStart(2, '0');
        }

        const currentTime = `${hours}:${minutes}`;
        const timeEl = document.getElementById('clock-time');
        if (timeEl) timeEl.textContent = currentTime;

        // V36.2: OPTIMIZATION - Only recalculate dates if needed
        const dateKey = `${now.toDateString()}_${hours}_${minutes}_${currentLang}_${hijriOffset}`;
        if (this._lastDateKey !== dateKey) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            this._cachedGregorian = now.toLocaleDateString(t("date_locale"), options);
            this._cachedHijri = typeof getHijriDate === 'function' ? getHijriDate(hijriOffset, typeof prayerTimes !== 'undefined' ? prayerTimes : null) : "";
            
            if (typeof forceLatin === 'function') {
                this._cachedGregorian = forceLatin(this._cachedGregorian);
                this._cachedHijri = forceLatin(this._cachedHijri);
            }
            this._lastDateKey = dateKey;
        }

        const currentDay = now.getDay(); 
        const gregWidget = document.getElementById('date-gregorian');

        if (currentDay === 5) {
            if (gregWidget) gregWidget.classList.add('friday-highlight');
        } else {
            if (gregWidget) gregWidget.classList.remove('friday-highlight');
        }

        const hijriEl = document.getElementById('hijri-text');
        const gregText = document.getElementById('gregorian-text');

        if (gregText) gregText.textContent = this._cachedGregorian;
        // Strip pipe separator before display — pipe is internal metadata for FastingWidget
        if (hijriEl) hijriEl.textContent = this._cachedHijri.split('|')[0].trim();

        return { currentTime, hjDate: this._cachedHijri }; // full string with |MONTH_NUM for FastingWidget
    },

    updateFridayOverlay: function(now, prayerTimes) {
        const day = now.getDay(); 
        const maghrib = prayerTimes ? prayerTimes['Maghrib'] : null;
        if (!maghrib) return;

        const [h, m] = maghrib.split(':').map(Number);
        const maghribTime = h * 60 + m;
        const currentTime = now.getHours() * 60 + now.getMinutes();

        let isFridayPeriod = false;
        if (day === 4 && currentTime >= maghribTime) isFridayPeriod = true;
        if (day === 5 && currentTime < maghribTime) isFridayPeriod = true;

        const el = document.getElementById('friday-blessing');
        if (el) {
            if (isFridayPeriod) el.classList.remove('hidden');
            else el.classList.add('hidden');
        }
    }
};

// --- 4. Prayer Widget ---
const PrayerWidget = {
    renderList: function(prayerTimes, currentLang, I18N, els) {
        if (!els.prayerList || !prayerTimes) return;
        els.prayerList.innerHTML = '';
        const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

        const isRow = (typeof CONFIG !== 'undefined' && CONFIG.prayerListOrientation === 'row');
        const isFriday = new Date().getDay() === 5;
        const isMasjidMode = typeof CONFIG !== 'undefined' && CONFIG.masjidMode;

        prayers.forEach(pKey => {
            let time = prayerTimes[pKey] || '--:--';
            let name = t("prayers")[pKey];

            if (pKey === 'Dhuhr' && isFriday && isMasjidMode) {
                name = currentLang === 'ar' ? 'الجمعة' : "Jumu'ah";
                time = CONFIG.jumuahTime || '13:30';
            }

            const div = document.createElement('div');
            div.className = 'prayer-item';
            div.id = `prayer-${pKey}`;

            // V38.6: Responsive width for horizontal mode
            if (isRow) {
                div.style.width = 'auto';
                div.style.minWidth = '110px';
                div.style.flexDirection = 'column';
                div.style.padding = '8px 12px';
                div.style.textAlign = 'center';
                div.style.justifyContent = 'center';
                div.style.gap = '5px';
            }

            div.innerHTML = `
                <span class="p-name">${name}</span>
                <span class="p-time">${time}</span>
            `;
            els.prayerList.appendChild(div);
        });
    },

    updateNext: function(now, prayerTimes, currentLang, I18N, els) {
        if (!prayerTimes || !els.nextPrayerName || !els.nextPrayerCountdown) return;
        const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        let nextPrayer = null;
        let minDiff = Infinity;

        // V38.4: Pure string-minute comparison — timezone agnostic & always correct
        // Get current HH:MM:SS in CONFIG.timezone
        let tzH = now.getHours(), tzM = now.getMinutes(), tzS = now.getSeconds();
        if (typeof CONFIG !== 'undefined' && CONFIG.timezone) {
            try {
                const tzStr = now.toLocaleString("en-GB", {
                    hour: '2-digit', minute: '2-digit', second: '2-digit',
                    hour12: false, timeZone: CONFIG.timezone
                });
                const parts = tzStr.split(':').map(s => parseInt(s.replace(/\D/g,''), 10));
                tzH = parts[0]; tzM = parts[1]; tzS = parts[2] || 0;
            } catch(e) {}
        }
        const nowTotalMin = tzH * 60 + tzM;
        
        const isFriday = now.getDay() === 5;
        const isMasjidMode = typeof CONFIG !== 'undefined' && CONFIG.masjidMode;

        for (const prayer of prayers) {
            if (!prayerTimes[prayer]) continue;
            let ph, pm;
            
            if (prayer === 'Dhuhr' && isFriday && isMasjidMode) {
                const jTime = CONFIG.jumuahTime || '13:30';
                [ph, pm] = jTime.split(':').map(Number);
            } else {
                [ph, pm] = prayerTimes[prayer].split(':').map(Number);
            }
            
            const prayerMin = ph * 60 + pm;

            // Minutes until this prayer in TZ-local time
            let diffMin = prayerMin - nowTotalMin;
            if (diffMin < 0) diffMin += 24 * 60; // wraps to next day
            const diffMs = diffMin * 60000 - tzS * 1000;

            if (diffMs < minDiff) {
                minDiff = diffMs;
                nextPrayer = prayer;
            }
        }

        if (nextPrayer) {
            if (nextPrayer === 'Dhuhr' && isFriday && isMasjidMode) {
                els.nextPrayerName.textContent = currentLang === 'ar' ? 'الجمعة' : "Jumu'ah";
            } else {
                els.nextPrayerName.textContent = t("prayers")[nextPrayer];
            }
            const totalSeconds = Math.floor(minDiff / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            if (!isNaN(hours)) {
                els.nextPrayerCountdown.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }
        }
    }
};

// --- 5. Visual Effects ---
const VisualEffects = {
    checkNeonFlash: function(now) {
        if (now.getMinutes() === 0 && now.getSeconds() === 0) {
            document.body.classList.add('neon-flash-active');
            setTimeout(() => {
                document.body.classList.remove('neon-flash-active');
            }, 2000);
        }
    }
};

// --- 6. Ticker Widget ---
const TickerWidget = {
    index: 0,
    update: function(athkarsList) {
        const tickerText = document.getElementById('ticker-text');
        if (!tickerText || !athkarsList || athkarsList.length === 0) return;

        tickerText.style.opacity = 0;
        tickerText.style.transform = "translateY(10px)";

        setTimeout(() => {
            this.index = (this.index + 1) % athkarsList.length;
            tickerText.textContent = athkarsList[this.index];
            tickerText.style.opacity = 1;
            tickerText.style.transform = "translateY(0)";
        }, 1000);
    }
};

// --- 7. Background Widget ---
const BackgroundWidget = {
    renderGrid: function(bgFiles, currentBgIndex, handlers) {
        const bgGrid = document.getElementById('bg-grid');
        if (!bgGrid) return;
        bgGrid.innerHTML = '';

        if (bgFiles.length === 0 || (bgFiles.length > 0 && bgFiles[0].isDefault)) {
            bgGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 20px; opacity: 0.5;">لا توجد صور مخصصة حالياً</div>';
            return;
        }

        bgFiles.forEach((bg, index) => {
            const item = document.createElement('div');
            item.className = 'bg-item';
            if (index === currentBgIndex) item.classList.add('selected');

            if (bg.type === 'video') {
                const video = document.createElement('video');
                video.src = bg.src;
                video.muted = true;
                item.appendChild(video);
                const badge = document.createElement('span');
                badge.className = 'bg-type-badge';
                badge.textContent = '📹';
                item.appendChild(badge);
            } else {
                const img = document.createElement('img');
                img.src = bg.src;
                item.appendChild(img);
            }

            const delBtn = document.createElement('button');
            delBtn.className = 'delete-btn';
            delBtn.innerHTML = '×';
            delBtn.title = "Supprimer";
            delBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (handlers.onDelete) await handlers.onDelete(index);
            });
            item.appendChild(delBtn);

            item.addEventListener('click', () => {
                if (handlers.onSelect) handlers.onSelect(index);
            });

            bgGrid.appendChild(item);
        });
    }
};

// --- 8. Weather Widget ---
const WeatherWidget = {
    update: function(data) {
        if (!data) return;
        
        // OpenWeatherMap forecast data structure usually has list[0]
        const current = (data.list && data.list[0]) ? data.list[0] : (data.main ? data : null);
        if (!current) return;

        const temp = current.main && typeof current.main.temp !== 'undefined' ? Math.round(current.main.temp) : null;
        const weatherObj = (current.weather && current.weather[0]) ? current.weather[0] : null;
        const desc = weatherObj ? weatherObj.description : "--";
        const code = weatherObj ? weatherObj.id : 800;

        const weatherEl = document.getElementById('weather-text');
        const tempEl = document.getElementById('temp-text');
        const iconEl = document.getElementById('weather-icon');

        if (weatherEl) weatherEl.textContent = desc;
        if (tempEl) {
            tempEl.textContent = (temp !== null) ? `${temp}°` : "--°";
            // The user said "doesn't show the degree", maybe they want simplified ° without C or just the number.
            // I'll keep just ° which is cleaner.
        }
        if (iconEl) iconEl.textContent = this.getIcon(code);
    },

    getIcon: function(id) {
        if (id >= 200 && id < 300) return "⛈️";
        if (id >= 300 && id < 400) return "🌧️";
        if (id >= 500 && id < 600) return "🌦️";
        if (id >= 600 && id < 700) return "❄️";
        if (id >= 700 && id < 800) return "🌫️";
        if (id === 800) return "☀️";
        if (id > 800) return "☁️";
        return "❓";
    }
};
