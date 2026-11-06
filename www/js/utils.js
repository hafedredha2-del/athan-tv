// ================= ATHAN TV UTILITIES (V36.2 - Masjid) =================

function showToast(message, duration = 3000) {
    let toast = document.getElementById('toast-message');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-message';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = 'show';
    setTimeout(() => { toast.className = toast.className.replace('show', ''); }, duration);
}
window.showToast = showToast;

// --- HEVC Codec Detection ---


// --- HEVC Codec Detection ---
let SUPPORTS_HEVC = false;


// --- HEVC Codec Detection ---

function detectHEVCSupport() {
    const video = document.createElement('video');
    // Check for HEVC/H.265 support
    const canPlayHEVC = video.canPlayType('video/mp4; codecs="hev1.1.6.L93.B0"') !== '';
    const canPlayH265 = video.canPlayType('video/mp4; codecs="hvc1.1.6.L93.B0"') !== '';
    SUPPORTS_HEVC = canPlayHEVC || canPlayH265;
    console.log(`🎥 HEVC Support: ${SUPPORTS_HEVC ? 'YES' : 'NO - Using H.264 fallback'}`);
    return SUPPORTS_HEVC;
}

detectHEVCSupport();

function getVideoPath(hevcPath) {
    if (SUPPORTS_HEVC) {
        return hevcPath;
    }
    // Fallback to H.264: replace .mp4 with _h264.mp4 or use default
    if (hevcPath.includes('/videos/')) {
        // For Athan videos: assets/videos/Fajr.mp4 -> assets/videos/Fajr_h264.mp4
        return hevcPath.replace('.mp4', '_h264.mp4');
    }
    return hevcPath; // Keep as is if not a video path
}


// --- Date & Prayer Calculations ---
function getHijriDate(offset, prayerTimes) {
    try {
        const date = new Date();
        let totalOffset = parseInt(offset) || 0;

        // V36.5: Islamic Day starts at Maghrib
        if (prayerTimes && prayerTimes.Maghrib) {
            const [mH, mM] = prayerTimes.Maghrib.split(':').map(Number);
            const nowMin = date.getHours() * 60 + date.getMinutes();
            const maghribMin = mH * 60 + mM;
            if (nowMin >= maghribMin) {
                totalOffset += 1; // Shift to next Hijri day
            }
        }

        date.setDate(date.getDate() + totalOffset);

        const hijriMonthsAr = [
            "محرم", "صفر", "ربيع الأول", "ربيع الثاني", "جمادى الأولى", "جمادى الآخرة",
            "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
        ];
        const hijriMonthsEn = [
            "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", "Jumada al-Ula", "Jumada al-Thani",
            "Rajab", "Shaban", "Ramadan", "Shawwal", "Dhul Qadah", "Dhul Hijjah"
        ];

        // Use a stable formatter in English to get raw numbers (fastest)
        const hFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
            day: 'numeric', month: 'numeric', year: 'numeric'
        });
        const parts = hFormatter.formatToParts(date);
        const day = parts.find(p => p.type === 'day').value;
        const monthNum = parseInt(parts.find(p => p.type === 'month').value); // 1-12
        const year = parts.find(p => p.type === 'year').value;

        // Display name: always use normalized names (never Intl long format)
        const displayMonth = (currentLang === 'ar') ? hijriMonthsAr[monthNum - 1] : hijriMonthsEn[monthNum - 1];
        // Format: "DAY NAME YEAR|MONTH_NUM" — pipe is used by FastingWidget for reliable detection
        return `${day} ${displayMonth} ${year}|${monthNum}`;
    } catch (e) {
        console.warn("getHijriDate failed, using offline fallback", e);
        return getOfflineHijriDate(new Date());
    }
}

function getCalcMethodParams(methodId) {
    const m = parseInt(methodId) || 8;
    switch (m) {
        case 3: return adhan.CalculationMethod.MuslimWorldLeague();
        case 2: return adhan.CalculationMethod.NorthAmerica();
        case 4: return adhan.CalculationMethod.UmmAlQura();
        case 5: return adhan.CalculationMethod.Egyptian();
        case 12: return adhan.CalculationMethod.MoonsightingCommittee();
        case 8: // Algeria
        default:
            const params = adhan.CalculationMethod.MuslimWorldLeague();
            params.fajrAngle = 18;
            params.ishaAngle = 17;
            return params;
    }
}

function calculatePrayerTimesOffline(date = new Date()) {
    // V39.2: Fallback to Sétif if no coordinates
    const lat = CONFIG.coordinates?.lat || 36.1911;
    const lng = CONFIG.coordinates?.long || 5.4093;

    const coordinates = new adhan.Coordinates(lat, lng);
    const params = getCalcMethodParams(CONFIG.calcMethod);
    params.madhab = adhan.Madhab.Shafi;

    const prayerTimesObj = new adhan.PrayerTimes(coordinates, date, params);

    function format(d) {
        return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    function applyOffset(timeStr, key) {
        if (!CONFIG.prayerOffsets[key]) return timeStr;
        const [h, m] = timeStr.split(':').map(Number);
        const offset = parseInt(CONFIG.prayerOffsets[key]) || 0;
        const d = new Date();
        d.setHours(h, m + offset);
        return format(d);
    }

    return {
        Fajr: applyOffset(format(prayerTimesObj.fajr), 'Fajr'),
        Sunrise: applyOffset(format(prayerTimesObj.sunrise), 'Sunrise'),
        Dhuhr: applyOffset(format(prayerTimesObj.dhuhr), 'Dhuhr'),
        Asr: applyOffset(format(prayerTimesObj.asr), 'Asr'),
        Maghrib: applyOffset(format(prayerTimesObj.maghrib), 'Maghrib'),
        Isha: applyOffset(format(prayerTimesObj.isha), 'Isha')
    };
}

function getOfflineHijriDate(date) {
    const dayOffset = parseInt(localStorage.getItem('hijri_offset')) || 0;
    const offsetDate = new Date(date);
    offsetDate.setDate(offsetDate.getDate() + dayOffset);
    try {
        const hijriMonthsAr = ["محرم", "صفر", "ربيع الأول", "ربيع الثاني", "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"];
        const hijriMonthsEn = ["Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", "Jumada al-Ula", "Jumada al-Thani", "Rajab", "Shaban", "Ramadan", "Shawwal", "Dhul Qadah", "Dhul Hijjah"];
        const enFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'numeric', year: 'numeric' });
        const parts = enFormatter.formatToParts(offsetDate);
        const day = parts.find(p => p.type === 'day').value;
        const monthNum = parseInt(parts.find(p => p.type === 'month').value); // 1-12
        const year = parts.find(p => p.type === 'year').value;

        const displayMonth = (currentLang === 'ar') ? hijriMonthsAr[monthNum - 1] : hijriMonthsEn[monthNum - 1];
        // Format: "DAY NAME YEAR|MONTH_NUM" — pipe is used by FastingWidget for reliable detection
        const hijriStr = `${day} ${displayMonth} ${year}|${monthNum}`;
        globalHijriDateString = hijriStr; // Keep global in sync
        return hijriStr;
    } catch (e) {
        return offsetDate.getDate() + "/" + (offsetDate.getMonth() + 1) + "/1447";
    }
}


// --- UI & Lifecycle Utilities ---
function copyToWebClipboard(url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            showToast("Lien copié / تم نسخ الرابط");
        }).catch(e => {
            console.warn("Clipboard failed, using fallback", e);
            copyFallback(url);
        });
    } else {
        copyFallback(url);
    }
}

function copyFallback(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast("Lien copié / تم نسخ الرابط");
        } else {
            window.prompt("Copiez ce lien / انسخ هذا الرابط:", text);
        }
    } catch (err) {
        window.prompt("Copiez ce lien / انسخ هذا الرابط:", text);
    }
    document.body.removeChild(textArea);
}

function updateConnectionStatus(status) {
    const indicator = document.getElementById('connection-status');
    if (!indicator) return;

    // Reset : On nettoie les anciennes classes pour éviter les conflits
    indicator.classList.remove('online', 'offline', 'cached');

    // Action : On applique la classe précise envoyée par le système
    if (status === 'online') {
        indicator.classList.add('online');
    } else if (status === 'offline') {
        indicator.classList.add('offline');
    } else {
        indicator.classList.add('cached');
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


// --- Formatting & Next Prayer Helpers ---
const arToLatinMap = { "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9" };
const forceLatin = (str) => str.replace(/[٠-٩]/g, d => arToLatinMap[d]);

function getNextPrayerTimeObj() {
    const now = new Date();
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    for (const p of prayers) {
        if (!prayerTimes[p]) continue;
        const [h, m] = prayerTimes[p].split(':').map(Number);
        const d = new Date(now);
        d.setHours(h, m, 0, 0);
        if (d > now) return d;
    }
    // Fajr tomorrow
    if (prayerTimes.Fajr) {
        const [h, m] = prayerTimes.Fajr.split(':').map(Number);
        const d = new Date(now);
        d.setDate(d.getDate() + 1);
        d.setHours(h, m, 0, 0);
        return d;
    }
    return null;
}

