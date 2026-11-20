// ================= ATHAN TV CONSTANTS (V36.2 - Masjid) =================

// V12.0: Autonomous Mode - Default Resources
const DEFAULT_ASSETS = {
    athan: {
        Fajr: 'assets/videos/fajr.mp4',
        Sunrise: 'assets/videos/shuruq.mp4',
        Dhuhr: 'assets/videos/dhuhr.mp4',
        Asr: 'assets/videos/asr.mp4',
        Maghrib: 'assets/videos/maghrib.mp4',
        Isha: 'assets/videos/isha.mp4'
    },
    athkar: {
        morning: '', // Désactivé par défaut (Mode texte hybride prioritaire)
        evening: '', // Désactivé par défaut (Mode texte hybride prioritaire)
        sleep: 'assets/audio/nawm.mp3', // V41.8: Corrected filename
        wakeup: 'assets/audio/wakeup.mp3'
    },
    kahf: 'assets/audio/vendredi.mp3',
    cadres: {
        Fajr: 'assets/videos/cadre1.mp4',
        Dhuhr: 'assets/videos/cadre2.mp4',
        Asr: 'assets/videos/cadre3.mp4',
        Maghrib: 'assets/videos/cadre4.mp4',
        Isha: 'assets/videos/cadre5.mp4'
    }
};

const HYBRID_ATHKAR_CONFIG = {
    morning: {
        image: 'assets/images/sabah.jpg',
        text: `<b>أذكار الصباح</b><br><br>
قراءة: سورة الإخلاص، سورة الفلق، سورة الناس (3 مرات)<br><br>
أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. <br><br>
رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ، وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ. <br><br>
اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ. <br><br>
اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ. (من قالها موقناً بها حين يصبح فمات من يومه دخل الجنة) <br><br>
اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ. (4 مرات) <br><br>
اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ. (من قالها حين يصبح فقد أدى شكر يومه) <br><br>
حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ. (7 مرات) <br><br>
رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا. (3 مرات) <br><br>
يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ. <br><br>
أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ وَكَلِمَةِ الْإِخْلَاصِ، وَدِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَمِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ. <br><br>
سُبْحَانَ اللَّهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ. (3 مرات) <br><br>
اللَّهُمَّ عافِني في بَدَني، اللَّهُمَّ عافِني في سَمْعي، اللَّهُمَّ عافِني في بَصَري، لا إلهَ إلاَّ أنْتَ. (3 مرات) <br><br>
اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ، وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ. (3 مرات) <br><br>
اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي. <br><br>
لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. (10 مرات) <br><br>
سُبْحَانَ اللَّهِ وَبِحَمْدِهِ. (100 مرة) <br><br>
أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ. (100 مرة) <br><br>
اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ. (10 مرات)`
    },
    evening: {
        image: 'assets/images/massa.jpg',
        text: `<b>أذكار المساء</b><br><br>
قراءة: سورة الإخلاص، سورة الفلق، سورة الناس (3 مرات)<br><br>
أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. <br><br>
رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ، وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ. <br><br>
اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ. <br><br>
اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ. (من قالها موقناً بها حين يمسي فمات من ليلته دخل الجنة) <br><br>
اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ. (4 مرات) <br><br>
اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ. (من قالها حين يمسي فقد أدى شكر ليلته) <br><br>
حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ. (7 مرات) <br><br>
رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا. (3 مرات) <br><br>
يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ. <br><br>
أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ وَكَلِمَةِ الْإِخْلَاصِ، وَدِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَمِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ. <br><br>
سُبْحَانَ اللَّهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضا نَفْسِهِ، وَزِنةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ. (3 مرات) <br><br>
اللَّهُمَّ عافِني في بَدَني، اللَّهُمَّ عافِني في سَمْعي، اللَّهُمَّ عافِني في بَصَري، لا إلهَ إلاَّ أنْتَ. (3 مرات) <br><br>
اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ، وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ. (3 مرات) <br><br>
اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي. <br><br>
لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. (10 مرات) <br><br>
أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ. (3 مرات) <br><br>
سُبْحَانَ اللَّهِ وَبِحَمْدِهِ. (100 مرة) <br><br>
أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ. (100 مرة) <br><br>
اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ. (10 مرات)`
    }
};


        // Configuration
const CONFIG = {
    city: localStorage.getItem('athan_city') || 'Setif',
    country: localStorage.getItem('athan_country') || 'Algeria',
    timezone: localStorage.getItem('last_known_timezone') || 'Africa/Algiers',
    coordinates: JSON.parse(localStorage.getItem('athan_coords') || '{"lat": 36.19, "long": 5.41}'),
    weatherApiKey: '73a157e24cf5e9a3b85131e6c9b4f7ed',

    // Correction Horaires (Minutes) - A MODIFIER VIA L'INTERFACE TV
    prayerOffsets: {
        Fajr: 0,
        Sunrise: 0,
        Dhuhr: 0,
        Asr: 0,
        Maghrib: 0,
        Isha: 0
    },
    hijriOffset: 0,

    // Files (Videos/Audio)
    athanVideos: { ...DEFAULT_ASSETS.athan },
    shuruqVideo: DEFAULT_ASSETS.shuruq,
    athkarBgVideo: 'assets/videos/cadre1.mp4', // Default generic fallback

    // Athan Mode (video | audio)
    athanMode: 'video',
    athanAudios: {
        Fajr: 'athan_fajr_dosari.mp3',
        Normal: 'athan.mp4'
    },

    // Athkars (Audio)
    athkars: {
        morning: { time: '07:00', url: DEFAULT_ASSETS.athkar.morning, enabled: true },
        evening: { time: '17:30', url: DEFAULT_ASSETS.athkar.evening, enabled: true },
        sleep: { time: '22:00', url: 'assets/audio/nawm.mp3', enabled: true },
        wakeup: { time: '03:00', url: DEFAULT_ASSETS.athkar.wakeup, enabled: true }
    },

    // Fonds d'écran (Images & Vidéos)
    backgrounds: {
        images: [
            'Masjid-Baiturrahman.jpg',
            'image_2022-11-23_080438351.png'
        ],
        videos: [
            'lv_7505455938351025461_20251106035226.mp4'
        ]
    },

    defaultBgVideo: null,

    // Coran (Kahf & Mulk)
    quran: {
        kahf: { time: '10:00', url: DEFAULT_ASSETS.kahf, enabled: true },
        mulk: { time: '22:05', url: 'assets/audio/sleep.mp3', enabled: true },
        full: { url: 'http://localhost/SILENCED/server8.mp3quran.net/s_gmd/001.mp3', currentSurah: 1 }
    },
    slideshowIntervalSec: 15,
    defaultSlidesCount: 54,
    useDefaultSlideshow: true,
    wakeLockMinutes: 20,
    bismillahFile: 'bismillah_abdulbaset.mp3',
    wakeLockEnabled: true,
    layoutLocked: false, // UNLOCKED by default
    publicApkUrl: 'https://drive.google.com/uc?export=download&id=1SmjPPnjLW8k5zeGSkphjsMnHJvJy1lwC',
    cadresEnabled: true,
    iqamaDurations: {
        Fajr: 10,
        Dhuhr: 10,
        Asr: 10,
        Maghrib: 5,
        Isha: 10
    },
    salatDurations: {
        Fajr: 2,
        Dhuhr: 2,
        Asr: 2,
        Maghrib: 2,
        Isha: 2
    },
    prayerListOrientation: 'column',
    athkarCustomBgs: {
        morning: null,
        evening: null
    },
    // MASJID MODE SETTINGS (V39.0)
    masjidMode: false,           
    permanentWidgets: true,      
    imamBoard: {
        pages: [
            { id: 1, text: "لا تنسوا ذكر الله\nصلاة الجماعة تفضل صلاة الفذ بسبع وعشرين درجة", mode: "fixed", start: "05:00", end: "06:00", enabled: true },
            { id: 2, text: "", mode: "fixed", start: "12:00", end: "13:00", enabled: false },
            { id: 3, text: "", mode: "fixed", start: "16:00", end: "17:00", enabled: false },
            { id: 4, text: "", mode: "fixed", start: "19:00", end: "20:00", enabled: false },
            { id: 5, text: "", mode: "fixed", start: "21:00", end: "22:00", enabled: false }
        ],
        safetyMargin: 3,         // minutes before Athan
        duration: 15             // fallback duration if not scheduled
    }
};

// Translations
// Translations
const I18N = {
    ar: {
        city: "سطيف",
        next_prayer: "الصلاة القادمة",
        close: "إغلاق",
        settings: "الإعدادات",
        backgrounds: "خلفيات",
        language: "اللغة",
        time_correction: "تصحبح الأوقات (دقائق)",
        athan_config: "إعدادات الأذان (فيديو محلي)",
        athkars_config: "الأذكار (صوت)",
        enabled: "مفعل",
        disabled: "معطل",
        morning_athkar: "الصباح",
        evening_athkar: "المساء",
        sleep_athkar: "النوم (الملك)",
        wakeup_athkar: "الاستيقاظ",
        select_files: "اختر ملفات",
        prayer_list: "صلاة",
        prayers: { Fajr: "الفجر", Sunrise: "الشروق", Dhuhr: "الظهر", Asr: "العصر", Maghrib: "المغرب", Isha: "العشاء" },
        weather: { 0: "سماء صافية", 1: "غائم جزئيا", 2: "غائم جزئيا", 3: "غائم", 45: "ضباب", 51: "رذاذ", 61: "مطر", 71: "ثلج", 95: "عاصفة" },
        date_locale: 'ar-DZ',
        athkar_after_salat: "الأذكار بعد الصلاة",
        app_logo: "شعار التطبيق (صورة/GIF)",
        fasting: { suhoor: "سحور", iftar: "إفطار", ramadan: "صيام رمضان", sunnah_mon: "صيام الإثنين", sunnah_thu: "صيام الخميس", ayam_bidh: "صيام الأيام البيض", arafat: "صيام يوم عرفة", achoura: "صيام عاشوراء", chawal6: "صيام الست من شوال", aid_fitr: "عيد فطر مبارك", aid_adha: "عيد أضحى مبارك", tadkhir_mon: "تذكير: صيام السنة غداً (الإثنين)", tadkhir_thu: "تذكير: صيام السنة غداً (الخميس)" }, friday_blessing: "اللهم صل على نبينا محمد ﷺ", iqama_silence: "حافظ على أجر صلاتك وإخوانك بوضع هاتفك على الوضع الصامت", iqama_dua: "الدعاء بين الأذان والإقامة لا يرد", iqama_dua_2: "اللَّهُمَّ إِنَّا نَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ", iqama_after: "الإقامة بعد", salat_title: "الصلاة قائمة", salat_humility: "صلّ بخشوع", salat_subtitle: "الصلاة في وقتها", salat_duration_label: "مدة الصلاة", masjid_athan_call: "وقت الأذان", masjid_duaa_title: "دعاء بعد الأذان", mas_board_title: "إعدادات لوحة الإمام (5 صفحات)", mas_page: "صفحة", mas_start: "بداية", mas_end: "نهاية", mas_mode: "نوع العرض", mas_fixed: "ثابت", mas_scroll: "دوار", mas_safety: "مساحة الأمان (دقائق)", masjid_duaa_text: "اللهم رب هذه الدعوة التامة، والصلاة القائمة، آت محمداً الوسيلة والفضيلة، وابعثه مقاماً محموداً الذي وعدته"
    },
    fr: {
        city: "Sétif", next_prayer: "Prochaine Prière", close: "Fermer", settings: "Paramètres", backgrounds: "Arrière-plans", language: "Langue", time_correction: "Correction (min)", athan_config: "Config Athan (Vidéo)", athkars_config: "Athkars (Audio)", enabled: "Activé", disabled: "Désactivé", morning_athkar: "Matin", evening_athkar: "Soir", sleep_athkar: "Nuit (Mulk)", wakeup_athkar: "Réveil", select_files: "Choisir fichiers", prayer_list: "Prière",
        prayers: { Fajr: "Fajr", Sunrise: "Chourouk", Dhuhr: "Dhuhr", Asr: "Asr", Maghrib: "Maghrib", Isha: "Isha" },
        weather: { 0: "Ciel dégagé", 1: "Partiellement nuageux", 2: "Partiellement nuageux", 3: "Nuageux", 45: "Brouillard", 51: "Bruine", 61: "Pluie", 71: "Neige", 95: "Orage" },
        date_locale: 'fr-FR', athkar_after_salat: "Invocations post-salat", app_logo: "Logo (Image/GIF)",
        fasting: { suhoor: "Suhoor", iftar: "Iftar", ramadan: "Jeûne du Ramadan", sunnah_mon: "Sunnah du Lundi", sunnah_thu: "Sunnah du Jeudi", ayam_bidh: "Ayam Al-Bidh", arafat: "Jeûne d'Arafat", achoura: "Jeûne d'Achoura", chawal6: "Les 6 jours de Shawwal", aid_fitr: "Aïd el-Fitr Moubarak", aid_adha: "Aïd el-Adha Moubarak", tadkhir_mon: "Rappel : Jeûne demain (Lundi)", tadkhir_thu: "Rappel : Jeûne demain (Jeudi)" }, friday_blessing: "Ô Allah, prie sur notre Prophète Muhammad ﷺ", iqama_silence: "Préservez votre prière et celle de vos frères en mettant votre téléphone sur silencieux", iqama_dua: "L'invocation entre l'Adhan et l'Iqama n'est pas rejetée", iqama_dua_2: "Ô Allah, nous te demandons le pardon et le bien-être dans ce monde et dans l'au-delà", iqama_after: "Iqama dans", salat_title: "La prière est en cours", salat_humility: "Priez avec humilité", salat_subtitle: "Prière à l'heure", salat_duration_label: "Durée de la prière", masjid_athan_call: "Heure de l'Athan", masjid_duaa_title: "Douaa après l'Athan", mas_board_title: "Planches Imam (5 Pages)", mas_page: "Page", mas_start: "Début", mas_end: "Fin", mas_mode: "Affichage", mas_fixed: "Fixe", mas_scroll: "Défilant", mas_safety: "Marge de sécurité (min)", masjid_duaa_text: "Ô Allah, Seigneur de cet appel parfait et de la prière qui va être accomplie, accorde à Muhammad la place éminente et la supériorité, et ressuscite-le au rang louable que Tu lui as promis."
    },
    en: {
        city: "Setif", next_prayer: "Next Prayer", close: "Close", settings: "Settings", backgrounds: "Backgrounds", language: "Language", time_correction: "Correction (min)", athan_config: "Athan Config (Video)", athkars_config: "Athkars (Audio)", enabled: "Enabled", disabled: "Disabled", morning_athkar: "Morning", evening_athkar: "Evening", sleep_athkar: "Sleep (Mulk)", wakeup_athkar: "Wakeup", select_files: "Choose files", prayer_list: "Prayer",
        prayers: { Fajr: "Fajr", Sunrise: "Sunrise", Dhuhr: "Dhuhr", Asr: "Asr", Maghrib: "Maghrib", Isha: "Isha" },
        weather: { 0: "Clear sky", 1: "Partly cloudy", 2: "Partly cloudy", 3: "Cloudy", 45: "Fog", 51: "Drizzle", 61: "Rain", 71: "Snow", 95: "Storm" },
        date_locale: 'en-US', athkar_after_salat: "Post-prayer invocations", app_logo: "Logo (Image/GIF)",
        fasting: { suhoor: "Suhoor", iftar: "Iftar", ramadan: "Ramadan Fasting", sunnah_mon: "Monday Sunnah", sunnah_thu: "Thursday Sunnah", ayam_bidh: "White Days", arafat: "Arafat Fasting", achoura: "Ashura Fasting", chawal6: "6 Days of Shawwal", aid_fitr: "Eid Fitr Mubarak", aid_adha: "Eid Adha Mubarak", tadkhir_mon: "Reminder: Fasting Tomorrow (Mon)", tadkhir_thu: "Reminder: Fasting Tomorrow (Thu)" }, friday_blessing: "O Allah, send blessings upon our Prophet Muhammad ﷺ", iqama_silence: "Preserve the reward of your prayer by silencing your phone", iqama_dua: "Supplication made between the Adhan and Iqama is not rejected", iqama_dua_2: "O Allah, we ask You for forgiveness and well-being in this world and the Hereafter", iqama_after: "Iqama in", salat_title: "Prayer in progress", salat_humility: "Pray with humility", salat_subtitle: "Prayer on time", salat_duration_label: "Prayer duration", mas_board_title: "Imam Board Settings (5 Pages)", mas_page: "Page", mas_start: "Start", mas_end: "End", mas_mode: "Display Mode", mas_fixed: "Fixed", mas_scroll: "Scrolling", mas_safety: "Safety Margin (min)",         masjid_athan_call: "Athan Time",
        masjid_duaa_title: "Duaa after Athan",
        masjid_duaa_text: "O Allah, Lord of this perfect call and the prayer to be offered, grant Muhammad the privilege and the excellence, and raise him to the praised position which You have promised him."
    },
    tr: {
        city: "Setif", next_prayer: "Sonraki Namaz", close: "Kapat", settings: "Ayarlar", backgrounds: "Arka Planlar", language: "Dil", time_correction: "Düzeltme (dk)", athan_config: "Ezan Ayarı (Video)", athkars_config: "Zikirler (Ses)", enabled: "Etkin", disabled: "Devre Dışı", morning_athkar: "Sabah", evening_athkar: "Akşam", sleep_athkar: "Uyku (Mülk)", wakeup_athkar: "Uyanış", select_files: "Dosya Seç", prayer_list: "Namaz",
        prayers: { Fajr: "Sabah", Sunrise: "Güneş Doğuşu", Dhuhr: "Öğle", Asr: "İkindi", Maghrib: "Akşam", Isha: "Yatsı" },
        weather: { 0: "Açık", 1: "Parçalı bulutlu", 2: "Parçalı bulutlu", 3: "Bulutlu", 45: "Sisli", 51: "Çiseleme", 61: "Yağmur", 71: "Kar", 95: "Fırtına" },
        date_locale: 'tr-TR', athkar_after_salat: "Namaz Sonrası Dualar", app_logo: "Logo (Resim/GIF)",
        fasting: { suhoor: "Sahur", iftar: "İftar", ramadan: "Ramazan Orucu", sunnah_mon: "Pazartesi Sünneti", sunnah_thu: "Perşembe Sünneti", ayam_bidh: "Beyaz Günler", arafat: "Arafat Orucu", achoura: "Aşure Orucu", chawal6: "Şevval Ayı 6 Gün Orucu", aid_fitr: "Ramazan Bayramı Mübarek", aid_adha: "Kurban Bayramı Mübarek", tadkhir_mon: "Hatırlatma: Yarın Oruç (Pazartesi)", tadkhir_thu: "Hatırlatma: Yarın Oruç (Perşembe)" }, friday_blessing: "Ey Allah'ım, Peygamberimiz Muhammed ﷺ'e salat eyle", iqama_silence: "Telefonunuzu sessize alarak cemaatin huzurunu koruyun", iqama_dua: "Ezan ile Kamet arasındaki dua reddedilmez", iqama_dua_2: "Ey Allah'ım, Senden dünya ve ahirette af ve afiyet dileriz", iqama_after: "Kamet'e kalan süre", salat_title: "Namaz Kılınıyor", salat_humility: "Huşu ile namaz kılın", salat_subtitle: "Allah namazınızı kabul etsin", mas_board_title: "İmam Panosu Ayarları (5 Sayfa)",
        masjid_athan_call: "Ezan Vakti",
        masjid_duaa_title: "Ezandan Sonra Dua",
        masjid_duaa_text: "Allahumme Rabbe hazihi'd-da'veti't-tamme. Vesselatil kâime. Âti Muhammedenil vesilete vel fazilete. Vebashu makamen mahmudenillezi veadteh."
    },
    id: {
        city: "Setif", next_prayer: "Shalat Berikutnya", close: "Tutup", settings: "Pengaturan", backgrounds: "Latar Belakang", language: "Bahasa", time_correction: "Koreksi (mnt)", athan_config: "Adzan (Video)", athkars_config: "Zikir (Audio)", enabled: "Aktif", disabled: "Nonaktif", morning_athkar: "Pagi", evening_athkar: "Sore", sleep_athkar: "Tidur (Al-Mulk)", wakeup_athkar: "Bangun", select_files: "Pilih File", prayer_list: "Shalat",
        prayers: { Fajr: "Subuh", Sunrise: "Syuruq", Dhuhr: "Dzuhur", Asr: "Ashar", Maghrib: "Maghrib", Isha: "Isya" },
        weather: { 0: "Langit cerah", 1: "Sebagian berawan", 2: "Sebawan berawan", 3: "Mendung", 45: "Kabut", 51: "Gerimis", 61: "Hujan", 71: "Salju", 95: "Badai" },
        date_locale: 'id-ID', athkar_after_salat: "Dzikir Setelah Shalat", app_logo: "Logo (Gambar/GIF)",
        fasting: { suhoor: "Sahur", iftar: "Buka Puasa", ramadan: "Puasa Ramadan", sunnah_mon: "Sunnah Senin", sunnah_thu: "Sunnah Kamis", ayam_bidh: "Hari Putih", arafat: "Puasa Arafah", achoura: "Puasa Asyura", chawal6: "Puasa 6 Hari Syawal", aid_fitr: "Idul Fitri Mubarak", aid_adha: "Idul Adha Mubarak", tadkhir_mon: "Pengingat: Besok Sunnah (Senin)", tadkhir_thu: "Pengingat: Besok Sunnah (Kamis)" }, friday_blessing: "Ya Allah, limpahkanlah rahmat kepada Nabi kami Muhammad ﷺ", iqama_silence: "Jaga ketenangan salat dengan membisukan telepon Anda", iqama_dua: "Doa antara Adzan dan Iqamah tidak ditolak", iqama_dua_2: "Ya Allah, kami memohon keselamatan di dunia dan akhirat", iqama_after: "Iqamah dalam", salat_title: "Salat sedang berlangsung", salat_humility: "Shalatlah dengan khusyuk", salat_subtitle: "Semoga Allah menerima salat Anda",         mas_board_title: "Pengaturan Papan Imam (5 Halaman)",
        masjid_athan_call: "Waktu Adzan",
        masjid_duaa_title: "Doa Setelah Adzan",
        masjid_duaa_text: "Allahumma rabba hadzihid-da'watit-tammah, wash-shalatil-qa'imah, ati muhammadanil-washilata wal-fadhilah, wab'atshu maqamam mahmuda-nil-ladzi wa'adtah."
    },
    ur: {
        city: "سیٹف", next_prayer: "اگلی نماز", close: "بند کریں", settings: "ترتیبات", backgrounds: "پس منظر", language: "زبان", time_correction: "اصلاح (منٹ)", athan_config: "اذان ترتیب (ویڈیو)", athkars_config: "اذکار (آواز)", enabled: "فعال", disabled: "غیر فعال", morning_athkar: "صبح", evening_athkar: "شام", sleep_athkar: "سونا (الملک)", wakeup_athkar: "جاگنا", select_files: "فائل منتخب کریں", prayer_list: "نماز",
        prayers: { Fajr: "فجر", Sunrise: "اشراق", Dhuhr: "ظہر", Asr: "عصر", Maghrib: "مغرب", Isha: "عشاء" },
        weather: { 0: "صاف آسمان", 1: "جزوی ابر آلود", 2: "جزوی ابر آلود", 3: "ابر آلود", 45: "دھند", 51: "بوندا باندی", 61: "بارش", 71: "برف", 95: "طوفان" },
        date_locale: 'ur-PK', athkar_after_salat: "نماز کے بعد اذکار", app_logo: "لوگو (تصویر/GIF)",
        fasting: { suhoor: "سحری", iftar: "افطار", ramadan: "رمضان کا روزہ", sunnah_mon: "پیر کا سنت", sunnah_thu: "جمعرات کا سنت", ayam_bidh: "ایام بیض", arafat: "عرفات کا روزہ", achoura: "عاشورہ کا روزہ", chawal6: "شوال کے 6 روزے", aid_fitr: "عید الفطر مبارک", aid_adha: "عید الاضحی مبارک", tadkhir_mon: "یاددہانی: کل کا روزہ (پیر)", tadkhir_thu: "یاددہانی: کل کا روزہ (جمعرات)" }, friday_blessing: "اے اللہ ہمارے نبی محمد ﷺ پر درود نازل فرما", iqama_silence: "اپنا فون خاموش رکھ کر اپنی نماز کا ثواب محفوظ رکھیں", iqama_dua: "اذان اور اقامت کے درمیان کی دعا رد نہیں ہوتی", iqama_dua_2: "اے اللہ ہم تجھ سے دنیا اور آخرت میں عافیت مانگتے ہیں", iqama_after: "اقامت میں ہے", salat_title: "نماز قائم ہے", salat_humility: "خشوع کے ساتھ نماز پڑھیں", salat_subtitle: "اللہ آپ کی نماز قبول فرمائے",         mas_board_title: "امام بورڈ ترتیبات (5 صفحات)",
        masjid_athan_call: "اذان کا وقت",
        masjid_duaa_title: "اذان کے بعد کی دعا",
        masjid_duaa_text: "اے اللہ، اس کامل پکار اور قائم ہونے والی نماز کے رب، محمد ﷺ کو وسیلہ اور فضیلت عطا فرما، اور انہیں اس مقام محمود پر فائز فرما جس کا تو نے ان سے وعدہ کیا ہے۔"
    },
    es: {
        city: "Setif", next_prayer: "Próxima oración", close: "Cerrar", settings: "Ajustes", backgrounds: "Fondos", language: "Idioma", time_correction: "Corrección (min)", athan_config: "Config Athan (Video)", athkars_config: "Athkars (Audio)", enabled: "Activado", disabled: "Desactivado", morning_athkar: "Mañana", evening_athkar: "Noche", sleep_athkar: "Dormir (Mulk)", wakeup_athkar: "Despertar", select_files: "Elegir archivos", prayer_list: "Oración",
        prayers: { Fajr: "Fajr", Sunrise: "Amanecer", Dhuhr: "Dhuhr", Asr: "Asr", Maghrib: "Maghrib", Isha: "Isha" },
        weather: { 0: "Cielo despejado", 1: "Parcialmente nublado", 2: "Parcialmente nublado", 3: "Nublado", 45: "Niebla", 51: "Llovizna", 61: "Lluvia", 71: "Nieve", 95: "Tormenta" },
        date_locale: 'es-ES', athkar_after_salat: "Invocaciones pos-salat", app_logo: "Logo (Imagen/GIF)",
        fasting: { suhoor: "Suhoor", iftar: "Iftar", ramadan: "Ayuno de Ramadán", sunnah_mon: "Sunnah del Lunes", sunnah_thu: "Sunnah del Jueves", ayam_bidh: "Días Blancos", arafat: "Ayuno de Arafat", achoura: "Ayuno de Achoura", chawal6: "6 días de Shawwal", aid_fitr: "Eid Fitr Mubarak", aid_adha: "Eid Adha Mubarak", tadkhir_mon: "Recordatorio: Ayuno mañana (Lunes)", tadkhir_thu: "Recordatorio: Ayuno mañana (Jueves)" }, friday_blessing: "Oh Allah, bendice a nuestro Profeta Muhammad ﷺ", iqama_silence: "Mantenga su teléfono en silencio para mantener la tranquilidad", iqama_dua: "La súplica entre el Adhan y el Iqama no es rechazada", iqama_dua_2: "Oh Allah, te pedimos perdón y bienestar en este mundo y en el más allá", iqama_after: "Iqama en", salat_title: "Oración en curso", salat_humility: "Reza con humildad", salat_subtitle: "Que Allah acepte su oración",         mas_board_title: "Ajustes de Tablero del Imam (5 Páginas)",
        masjid_athan_call: "Hora del Adhan",
        masjid_duaa_title: "Dua después del Adhan",
        masjid_duaa_text: "Oh Allah, Señor de este llamado perfecto y de la oración que va a realizarse, concede a Muhammad la mediación y la excelencia, y resucítalo en el rango loable que le has prometido."
    },
    zh: {
        city: "Setif", next_prayer: "下次祈祷", close: "关闭", settings: "设置", backgrounds: "背景", language: "语言", time_correction: "校正 (分钟)", athan_config: "宣礼设置 (视频)", athkars_config: "祈祷词 (音频)", enabled: "启用", disabled: "停用", morning_athkar: "早晨", evening_athkar: "晚上", sleep_athkar: "睡眠 (Mulk)", wakeup_athkar: "唤醒", select_files: "选择文件", prayer_list: "祈祷",
        prayers: { Fajr: "晨礼", Sunrise: "日出", Dhuhr: "晌礼", Asr: "晡礼", Maghrib: "昏礼", Isha: "宵礼" },
        weather: { 0: "晴朗", 1: "少云", 2: "多云", 3: "阴天", 45: "雾", 51: "毛毛雨", 61: "雨", 71: "雪", 95: "风暴" },
        date_locale: 'zh-CN', athkar_after_salat: "礼拜后祈祷", app_logo: "徽标 (图片/GIF)",
        fasting: { suhoor: "封斋前饭", iftar: "开斋", ramadan: "斋月禁食", sunnah_mon: "周一圣行", sunnah_thu: "周四圣行", ayam_bidh: "白日", arafat: "阿拉法特日禁食", achoura: "阿舒拉节禁食", chawal6: "闪瓦鲁月6天禁食", aid_fitr: "开斋节吉庆", aid_adha: "古尔邦节吉庆", tadkhir_mon: "提醒: 明天禁食 (周一)", tadkhir_thu: "提醒: 明天禁食 (周四)" }, friday_blessing: "主啊，请赐福我们的先知穆罕默德 ﷺ", iqama_silence: "请将手机静音以保持礼拜的宁静", iqama_dua: "宣礼与成礼之间的祈祷不会被拒绝", iqama_dua_2: "主啊，我们祈求您赐予今世和后世的安康", iqama_after: "成礼倒计时", salat_title: "礼拜进行中", salat_humility: "谦恭地礼拜", salat_subtitle: "愿真主接受您的礼拜",         mas_board_title: "伊玛目板设置 (5页)",
        masjid_athan_call: "宣礼时间",
        masjid_duaa_title: "宣礼后的祈祷",
        masjid_duaa_text: "真主啊！这完美的召唤及即将开始的礼拜的主啊！求您赐予穆罕默德 ﷺ 崇高的地位和优越，求您提升他至您所许约的受赞美的位置。"
    }
};
// ================= ATHAN TV STATE (V36.2 - Masjid) =================
// State
let currentLang = 'ar';

// APK Sharing Logic moved to index.html for maximum compatibility
window.t = function(key) {
    if (!key) return "";
    var lang = (currentLang || "ar").toLowerCase();
    
    // V38.9.19: Ultra-Robust City Localization
    if (key === 'city' && typeof CONFIG !== 'undefined' && CONFIG.city) {
        var rawCity = CONFIG.city.toString();
        var cityLower = rawCity.toLowerCase().trim();
        
        if (lang === 'ar') {
            // Multi-variant matching (Setif, Sétif, Stif)
            if (/setif|sétif|stif/i.test(cityLower)) return "سطيف";
            if (/alger|algiers/i.test(cityLower)) return "الجزائر";
            if (/oran/i.test(cityLower)) return "وهران";
            if (/constan/i.test(cityLower)) return "قسنطينة";
        }
        return rawCity.toUpperCase();
    }
    return I18N[lang]?.[key] || I18N["ar"]?.[key] || key;
};

let prayerTimes = {
    Fajr: "05:15", Sunrise: "06:40", Dhuhr: "12:45",
    Asr: "16:15", Maghrib: "18:50", Isha: "20:15"
};
let isAthanPlaying = false;
let lastAthanMinute = "";
let preloadedPrayer = "";

// V28.0: Performance metrics
let _lastDateUpdate = null;
let _lastDateMinute = "";
let bgMode = 'image';
let bgFiles = [];
let currentBgIndex = 0;
let slideshowInterval = null;
let globalHijriDateString = "2 Shawwal 1447"; // Safety Fallback (Eid)
let TEST_FASTING_STATE = 0; // 0:Off (Auto), 1:Ramadan, 2:Sunnah, 3:AyamBid
const SLIDESHOW_DELAY = 10000;
