/**
 * services.js - Gemini Athan TV Services
 * Contains Media Storage, Weather, and Prayer API logic.
 */

// --- 0. Location Service (Auto-detection) ---
const LocationService = {
    detectLocation: function() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                return reject("Geolocation not supported");
            }
            console.log("📍 Detecting location via Network/Wi-Fi...");
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log(`📍 Location detected: ${latitude}, ${longitude}`);
                    resolve({ lat: latitude, lon: longitude });
                },
                async (error) => {
                    console.warn("📍 Geolocation failed, trying IP-based location...", error.message);
                    try {
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout
                        const response = await fetch('https://ipapi.co/json/', { signal: controller.signal });
                        clearTimeout(timeoutId);
                        const data = await response.json();
                        if (data.latitude && data.longitude) {
                            console.log(`📍 IP-based Location detected: ${data.city}, ${data.country_name}`);
                            resolve({ lat: data.latitude, lon: data.longitude, city: data.city, country: data.country_name });
                        } else {
                            reject("IP Location failed");
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
            );
        });
    },
    
    getCityFromCoords: async function(lat, lon) {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
            const response = await fetch(url, { headers: { 'User-Agent': 'AthanTV/1.0' } });
            const data = await response.json();
            if (data && data.address) {
                const city = data.address.city || data.address.town || data.address.village || data.address.state || "Unknown";
                const country = data.address.country || "Unknown";
                return { city, country };
            }
        } catch (e) {
            console.error("📍 Geocoding failed:", e);
        }
        return null;
    }
};

// --- 1. Media Storage Service (IndexedDB) ---
const MediaStorage = {
    dbName: 'AthanMediaDB',
    storeName: 'media',
    db: null,
    init: function () {
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) { console.error("IndexedDB not supported"); return resolve(); }
            const request = indexedDB.open(this.dbName, 2); // Version 2
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
            request.onsuccess = (e) => { this.db = e.target.result; resolve(); };
            request.onerror = (e) => { console.error("DB Error", e); resolve(); }; // Continue anyway
        });
    },
    save: function (key, blob) {
        if (!this.db) return Promise.resolve();
        return new Promise((resolve) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(blob, key);
            request.onsuccess = () => resolve();
            request.onerror = () => resolve();
        });
    },
    get: function (key) {
        if (!this.db) return Promise.resolve(null);
        return new Promise((resolve) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);
            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = () => resolve(null);
        });
    },
    delete: function (key) {
        if (!this.db) return Promise.resolve();
        return new Promise((resolve) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(key);
            request.onsuccess = () => resolve();
            request.onerror = () => resolve();
        });
    },
    getAllKeys: function () {
        if (!this.db) return Promise.resolve([]);
        return new Promise((resolve) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAllKeys();
            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = () => resolve([]);
        });
    },
    clear: function (prefix) {
        if (!this.db) return Promise.resolve();
        return new Promise(async (resolve) => {
            const allKeys = await this.getAllKeys();
            const keysToDelete = allKeys.filter(key => key.startsWith(prefix));
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            keysToDelete.forEach(key => store.delete(key));
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => resolve();
        });
    }
};

function writeBlobToLocalFile(blob, fileName) {
    return new Promise((resolve) => {
        if (!blob) {
            resolve(null);
            return;
        }
        if (typeof cordova === 'undefined' || !cordova.file) {
            console.log("Cordova not available, falling back to Object URL for:", fileName);
            resolve(URL.createObjectURL(blob));
            return;
        }
        const targetDir = cordova.file.dataDirectory;
        window.resolveLocalFileSystemURL(targetDir, function (dirEntry) {
            dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                    fileWriter.onwriteend = function () {
                        const localUrl = fileEntry.toURL();
                        console.log("File written successfully to native URL:", localUrl);
                        resolve(localUrl);
                    };
                    fileWriter.onerror = function (e) {
                        console.error("FileWriter error on:", fileName, e);
                        resolve(URL.createObjectURL(blob));
                    };
                    fileWriter.write(blob);
                }, function (e) {
                    console.error("createWriter error on:", fileName, e);
                    resolve(URL.createObjectURL(blob));
                });
            }, function (e) {
                console.error("getFile error on:", fileName, e);
                resolve(URL.createObjectURL(blob));
            });
        }, function (e) {
            console.error("resolveLocalFileSystemURL error on:", fileName, e);
            resolve(URL.createObjectURL(blob));
        });
    });
}
window.writeBlobToLocalFile = writeBlobToLocalFile;

async function restoreMediaFromStorage() {
    try {
        await MediaStorage.init();
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        
        // 1. Athan Videos
        for (const p of prayers) {
            const blob = await MediaStorage.get(`athan_${p}`);
            if (blob) CONFIG.athanVideos[p] = await writeBlobToLocalFile(blob, `athan_${p}.mp4`);
        }
        
        // 2. Shuruq Video
        const shuruqBlob = await MediaStorage.get('shuruq');
        if (shuruqBlob) CONFIG.shuruqVideo = await writeBlobToLocalFile(shuruqBlob, 'shuruq.mp4');

        // 3. Athkar Bg Video
        const athkarBgBlob = await MediaStorage.get('athkar_bg');
        if (athkarBgBlob) {
            const url = await writeBlobToLocalFile(athkarBgBlob, 'athkar_bg.mp4');
            CONFIG.athkarBgVideo = url;
            window._currentAthkarVideoBlob = url;
        }

        // 4. Athkar Audios
        const audioKeys = ['morning', 'evening', 'sleep', 'wakeup', 'kahf'];
        for (const k of audioKeys) {
            const blob = await MediaStorage.get(`audio_${k}`);
            if (blob) {
                const url = await writeBlobToLocalFile(blob, `audio_${k}.mp3`);
                if (k === 'kahf') CONFIG.quran.kahf.url = url;
                else if (CONFIG.athkars[k]) CONFIG.athkars[k].url = url;
            }
        }

        // 5. Cadre Videos
        for (const p of prayers) {
            const blob = await MediaStorage.get(`cadre_${p}`);
            if (blob) {
                if (!CONFIG.cadres) CONFIG.cadres = {};
                CONFIG.cadres[p] = await writeBlobToLocalFile(blob, `cadre_${p}.mp4`);
            }
        }

        // 6. Custom Athkar Backgrounds (Morning/Evening)
        if (!CONFIG.athkarCustomBgs) CONFIG.athkarCustomBgs = { morning: null, evening: null };
        
        const morningBgBlob = await MediaStorage.get('athkar_bg_morning');
        if (morningBgBlob) CONFIG.athkarCustomBgs.morning = await writeBlobToLocalFile(morningBgBlob, 'athkar_bg_morning.jpg');
        
        const eveningBgBlob = await MediaStorage.get('athkar_bg_evening');
        if (eveningBgBlob) CONFIG.athkarCustomBgs.evening = await writeBlobToLocalFile(eveningBgBlob, 'athkar_bg_evening.jpg');

        // 7. Logo
        const logoBlob = await MediaStorage.get('app_logo');
        if (logoBlob) {
            const url = await writeBlobToLocalFile(logoBlob, 'app_logo.png');
            const iconBtn = document.getElementById('open-settings');
            if (iconBtn) {
                iconBtn.textContent = ''; 
                iconBtn.classList.add('has-logo');
                let img = iconBtn.querySelector('img');
                if (!img) {
                    img = document.createElement('img');
                    iconBtn.appendChild(img);
                }
                img.src = url;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '50%';
            }
            window._currentLogoBlob = url;
        }

        // 8. Slideshow Backgrounds
        const allKeys = await MediaStorage.getAllKeys();
        const bgKeys = allKeys.filter(k => k.startsWith('backgrounds_'));
        if (bgKeys.length > 0) {
            if (typeof bgFiles !== 'undefined' && bgFiles.length > 0 && bgFiles[0].name.startsWith('hr')) {
                bgFiles = [];
            }
            for (const k of bgKeys) {
                const blob = await MediaStorage.get(k);
                if (blob) {
                    const ext = blob.type.startsWith('video') ? 'mp4' : 'jpg';
                    const url = await writeBlobToLocalFile(blob, `${k}.${ext}`);
                    const type = blob.type.startsWith('video') ? 'video' : 'image';
                    if (typeof bgFiles !== 'undefined') {
                        bgFiles.push({ type, src: url, name: 'Média mémorisé', key: k });
                    }
                }
            }
            if (typeof updateBgCount === 'function') updateBgCount();
            if (typeof renderBackgroundGrid === 'function') renderBackgroundGrid();
            if (typeof startSlideshow === 'function') startSlideshow();
        }
        if (typeof updateFilenameDisplays === 'function') updateFilenameDisplays();
    } catch (e) { 
        console.warn("Restore failed", e); 
    }
}

// --- 2. Weather Service ---
const WeatherService = {
    fetchWeather: async function(currentLang) {
        if (!CONFIG.weatherApiKey) return;
        const city = (CONFIG.city || 'Setif').trim();
        const country = (CONFIG.country || 'Algeria').trim();
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)},${encodeURIComponent(country)}&units=metric&appid=${CONFIG.weatherApiKey}&lang=${currentLang === 'zh' ? 'zh_cn' : currentLang}`;
        console.log("🌦️ Fetching Weather:", url);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                window.weatherData = data; 
                localStorage.setItem('athan_weather_cache', JSON.stringify(data)); // V38.9.4: Save to cache
                console.log("🌦️ Weather data received and cached:", data);

                if (typeof WeatherWidget !== 'undefined') {
                    WeatherWidget.update(data);
                }
                // V36.2: If modal is open but empty, refresh it
                const modal = document.getElementById('weather-forecast-modal');
                if (modal && modal.classList.contains('show')) {
                   // We need currentLang and els, but they are in logic.js scope. 
                   // Let's use window globals or just wait for next click.
                   // Better: trigger a custom event or just let showWeatherForecast handle it.
                }
            }
        } catch (error) {
            console.error("❌ Weather fetch primary failed, trying fallback:", error);
            
            // V38.9.4: Offline Persistence - Try to use cache
            const cache = localStorage.getItem('athan_weather_cache');
            if (cache) {
                try {
                    const cachedData = JSON.parse(cache);
                    window.weatherData = cachedData;
                    if (typeof WeatherWidget !== 'undefined') WeatherWidget.update(cachedData);
                    console.log("🌦️ [Offline] Using cached weather data");
                    return; // Successfully using cache
                } catch (e) { console.warn("Weather cache parse failed", e); }
            }

            // Fallback: try only city without country
        }
    },

    showWeatherForecast: function(currentLang, els) {
        if (!els.weatherForecastModal) return;
        
        // Always show the modal first
        if (els.weatherForecastModal) {
            els.weatherForecastModal.style.zIndex = "300000"; // TRIPLE BOOST
            els.weatherForecastModal.classList.add('show');
        }

        if (!window.weatherData) {
            console.warn("No weather data for modal, attempting fetch...");
            this.fetchWeather(currentLang);
            if (els.hourlyForecast) els.hourlyForecast.innerHTML = '<div style="padding:20px; text-align:center; width:100%;">Chargement...</div>';
            return;
        }

        const data = window.weatherData;
        const forecastList = data.list || []; 
        if (forecastList.length === 0) {
            if (els.hourlyForecast) els.hourlyForecast.innerHTML = '<div style="padding:20px; text-align:center; width:100%;">Données indisponibles</div>';
            return;
        }

        if (els.hourlyForecast) {
            els.hourlyForecast.innerHTML = '';
            const hourlyLimit = Math.min(forecastList.length, 24);
            for (let i = 0; i < hourlyLimit; i++) {
                const item = forecastList[i];
                if (!item || !item.main || !item.weather) continue;
                const date = new Date(item.dt * 1000);
                const h = date.getHours();
                const timeStr = `${h}:00`;
                const temp = Math.round(item.main.temp);
                const id = item.weather[0].id;

                const card = document.createElement('div');
                card.className = 'forecast-card weather-hour-item focusable';
                card.tabIndex = 0;
                card.innerHTML = `
                    <span class="f-hour" style="color:#ffffff !important; font-size: 0.85rem; font-weight:800; display:block !important; opacity:1 !important;">${timeStr}</span>
                    <span class="icon" style="font-size: 1.3rem;">${typeof WeatherWidget !== 'undefined' ? WeatherWidget.getIcon(id) : ''}</span>
                    <span class="temp" style="font-size: 0.8rem; color: #ffffff;">${temp}°</span>
                `;
                els.hourlyForecast.appendChild(card);
            }
        }

        if (els.dailyForecast) {
            els.dailyForecast.innerHTML = '';
            const localeMap = { 'ar': 'ar-SA', 'fr': 'fr-FR', 'en': 'en-US' };
            const activeLocale = localeMap[currentLang] || 'en-US';
            const dayFormatter = new Intl.DateTimeFormat(activeLocale, { weekday: 'long' });

            const dailyItems = [];
            forecastList.forEach(item => {
                if (!item) return;
                const date = new Date(item.dt * 1000);
                const dayString = date.toDateString();
                if (!dailyItems.find(d => new Date(d.dt * 1000).toDateString() === dayString)) {
                    dailyItems.push(item);
                }
            });

            for (let i = 1; i < Math.min(dailyItems.length, 6); i++) {
                const item = dailyItems[i];
                if (!item || !item.main || !item.weather) continue;
                const date = new Date(item.dt * 1000);
                const rawDay = dayFormatter.format(date);
                const dayName = (currentLang === 'ar') ? rawDay : rawDay.charAt(0).toUpperCase() + rawDay.slice(1);
                const temp = Math.round(item.main.temp);
                const id = item.weather[0].id;

                const row = document.createElement('div');
                row.className = 'daily-row weather-day-item focusable';
                row.tabIndex = 0;
                row.innerHTML = `
                    <span class="day-name">${dayName}</span>
                    <span class="day-icon" style="flex: 1; text-align: center; font-size: 1rem;">${typeof WeatherWidget !== 'undefined' ? WeatherWidget.getIcon(id) : ''}</span>
                    <span class="daily-temp">${temp}° <span style="font-size:0.8em; opacity:0.7">${temp - 2}°</span></span>
                `;
                els.dailyForecast.appendChild(row);
            }
        }
    }
};

// --- 3. Prayer Service ---
const PrayerService = {
    fetchPrayerTimes: async function(currentLang, forceNetwork = false) {
        const date = new Date();
        const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        const cityKey = (typeof CONFIG !== 'undefined' && CONFIG.city) ? CONFIG.city.replace(/\s+/g, '_') : 'default';
        const cacheKey = `prayer_times_${dateStr}_${cityKey}`;

        if (!forceNetwork) {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const parsed = JSON.parse(cached);
                // V37.4 MIGRATION: Old cache doesn't have |MONTH_NUM in hijri string
                // Force network refresh to get new format
                if (!parsed.hijri || !parsed.hijri.includes('|')) {
                    console.log("CACHE MIGRATION: Old hijri format detected, forcing network refresh.");
                    localStorage.removeItem(cacheKey); // Clear old cache
                    // Fall through to network fetch below
                } else {
                    const { times: rawTimes, hijri, timezone } = parsed;
                    if (timezone) CONFIG.timezone = timezone;
                    const applyOffset = (timeStr, key) => {
                        const offset = parseInt(CONFIG.prayerOffsets[key]) || 0;
                        if (offset === 0) return timeStr;
                        const [h, m] = timeStr.split(':').map(Number);
                        if (isNaN(h) || isNaN(m)) return timeStr;
                        const d = new Date();
                        d.setHours(h, m + offset);
                        return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
                    };
                    const updatedTimes = {
                        Fajr: applyOffset(rawTimes.Fajr, 'Fajr'), Sunrise: applyOffset(rawTimes.Sunrise, 'Sunrise'),
                        Dhuhr: applyOffset(rawTimes.Dhuhr, 'Dhuhr'), Asr: applyOffset(rawTimes.Asr, 'Asr'),
                        Maghrib: applyOffset(rawTimes.Maghrib, 'Maghrib'), Isha: applyOffset(rawTimes.Isha, 'Isha')
                    };
                    return { times: updatedTimes, hijri, status: 'cached' };
                }
            } else {
                return null; // Will trigger offline calculation
            }
        }

        try {
            let url;
            if (CONFIG.coordinates && CONFIG.coordinates.lat && CONFIG.coordinates.long) {
                console.log(`🌍 Fetching Prayer Times by Coordinates: ${CONFIG.coordinates.lat}, ${CONFIG.coordinates.long}`);
                url = `https://api.aladhan.com/v1/timings/${Math.floor(Date.now() / 1000)}?latitude=${CONFIG.coordinates.lat}&longitude=${CONFIG.coordinates.long}&method=${CONFIG.calcMethod || 8}`;
            } else {
                console.log(`🌍 Fetching Prayer Times by City: ${CONFIG.city}`);
                url = `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=${encodeURIComponent(CONFIG.city)}&country=${encodeURIComponent(CONFIG.country)}&method=${CONFIG.calcMethod || 8}`;
            }
            
            if (CONFIG.hijriOffset !== 0) url += `&adjustment=${CONFIG.hijriOffset}`;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error("API Network Error");
            const data = await response.json();

            if (data.code === 200) {
                const times = data.data.timings;
                
                const applyOffset = (timeStr, key) => {
                    if (!CONFIG.prayerOffsets[key]) return timeStr;
                    const [h, m] = timeStr.split(':').map(Number);
                    const offset = parseInt(CONFIG.prayerOffsets[key]) || 0;
                    const d = new Date();
                    d.setHours(h, m + offset);
                    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
                };

                const newPrayerTimes = {
                    Fajr: applyOffset(times.Fajr, 'Fajr'),
                    Sunrise: applyOffset(times.Sunrise, 'Sunrise'),
                    Dhuhr: applyOffset(times.Dhuhr, 'Dhuhr'),
                    Asr: applyOffset(times.Asr, 'Asr'),
                    Maghrib: applyOffset(times.Maghrib, 'Maghrib'),
                    Isha: applyOffset(times.Isha, 'Isha')
                };

                const hijri = data.data.date.hijri;
                const hDay = parseInt(hijri.day);
                const hMonthNumber = parseInt(hijri.month.number);
                const hYear = hijri.year;

                // Always store month NUMBER for reliable Siyam logic (avoids accent/diacritic bugs)
                const hijriMonthsAr = ["محرم", "صفر", "ربيع الأول", "ربيع الثاني", "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"];
                const hijriMonthsEn = ["Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", "Jumada al-Ula", "Jumada al-Thani", "Rajab", "Shaban", "Ramadan", "Shawwal", "Dhul Qadah", "Dhul Hijjah"];
                
                // Display name: Arabic if lang=ar, else normalized English
                const hMonthDisplay = (currentLang === 'ar') 
                    ? hijriMonthsAr[hMonthNumber - 1] 
                    : hijriMonthsEn[hMonthNumber - 1];

                // Extract timezone for Clock synchronization
                if (data.data.meta && data.data.meta.timezone) {
                    CONFIG.timezone = data.data.meta.timezone;
                    localStorage.setItem('last_known_timezone', CONFIG.timezone);
                    console.log(`🌍 Timezone Updated & Persisted: ${CONFIG.timezone}`);
                }

                // Store as "DAY MONTH_NAME YEAR|MONTH_NUM" so Siyam can use the number directly
                const hijriStr = `${hDay} ${hMonthDisplay} ${hYear}|${hMonthNumber}`;
                localStorage.setItem(cacheKey, JSON.stringify({ 
                    times: newPrayerTimes, 
                    hijri: hijriStr,
                    timezone: CONFIG.timezone 
                }));

                return { times: newPrayerTimes, hijri: hijriStr, status: 'online' };
            }
        } catch (error) {
            console.warn('Prayer API failed, attempting cache:', error);
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const { times: rawTimes, hijri, timezone } = JSON.parse(cached);
                if (timezone) CONFIG.timezone = timezone;
                
                // Re-apply current offsets to cached raw times
                const applyOffset = (timeStr, key) => {
                    const offset = parseInt(CONFIG.prayerOffsets[key]) || 0;
                    if (offset === 0) return timeStr;
                    const [h, m] = timeStr.split(':').map(Number);
                    if (isNaN(h) || isNaN(m)) return timeStr;
                    const d = new Date();
                    d.setHours(h, m + offset);
                    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
                };

                const updatedTimes = {
                    Fajr: applyOffset(rawTimes.Fajr, 'Fajr'),
                    Sunrise: applyOffset(rawTimes.Sunrise, 'Sunrise'),
                    Dhuhr: applyOffset(rawTimes.Dhuhr, 'Dhuhr'),
                    Asr: applyOffset(rawTimes.Asr, 'Asr'),
                    Maghrib: applyOffset(rawTimes.Maghrib, 'Maghrib'),
                    Isha: applyOffset(rawTimes.Isha, 'Isha')
                };

                return { times: updatedTimes, hijri, status: 'cached' };
            }
        }
        return null;
    }
};

// --- 4. Wake Lock Service ---
const WakeLockService = {
    wakeLock: null,
    request: async function() {
        try {
            if ('wakeLock' in navigator) {
                this.wakeLock = await navigator.wakeLock.request('screen');
                console.log('🔓 Wake Lock active');
            }
        } catch (err) {
            console.error('Wake Lock error:', err);
        }
    },
    release: async function() {
        if (this.wakeLock) {
            try {
                await this.wakeLock.release();
                this.wakeLock = null;
                console.log('🔒 Wake Lock released');
            } catch (err) {
                console.error('Wake Lock release error:', err);
            }
        }
    }
};

// --- 5. Native Alarm Service ---
const NativeAlarmService = {
    scheduleAlarms: function(prayerTimes) {
        if (!prayerTimes) return;
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        const today = new Date();

        prayers.forEach(p => {
            const timeStr = prayerTimes[p];
            if (!timeStr) return;

            const [h, m] = timeStr.split(':').map(Number);
            const pDate = new Date(today);
            pDate.setHours(h, m, 0, 0);

            if (pDate < today) {
                pDate.setDate(pDate.getDate() + 1);
            }

            const mediaPath = (typeof CONFIG !== 'undefined' && CONFIG.athanVideos && CONFIG.athanVideos[p]) ? CONFIG.athanVideos[p] : "";

            if (window.cordova && cordova.exec) {
                console.log(`🛡️ Scheduling Cordova Native Alarm for ${p} at ${pDate}`);
                cordova.exec(
                    () => console.log("Native Alarm set for", p),
                    (err) => console.error("Native Alarm error for", p, err),
                    "NativeAthan",
                    "schedule",
                    [{
                        prayer: p,
                        timeMillis: pDate.getTime(),
                        mediaPath: mediaPath
                    }]
                );
            } else if (window.flutterBridge && window.flutterBridge.scheduleNotification) {
                const minutesAt = pDate.getHours() * 60 + pDate.getMinutes();
                console.log(`🛡️ Scheduling Pro Alarm for ${p} at ${pDate}`);
                window.flutterBridge.scheduleNotification(
                    prayers.indexOf(p) + 100, 
                    p,
                    `L'Athan ${p} commence maintenant.`,
                    minutesAt
                );
            }
        });
        console.log("✅ Native Alarms synchronized.");
    }
};
