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
رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَسْأَلُكَ مِنَ الْكَسَلِ، وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ. <br><br>
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
            city: 'Setif',
            country: 'Algeria',
            coordinates: { lat: 36.19, long: 5.41 },
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
                evening: { time: '17:30', url: DEFAULT_ASSETS.athkar.evening, enabled: false },
                sleep: { time: '22:00', url: DEFAULT_ASSETS.athkar.sleep, enabled: false },
                wakeup: { time: '05:00', url: DEFAULT_ASSETS.athkar.wakeup, enabled: true }
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
                mulk: { time: '22:00', url: 'mulk_saad_ghamidi.mp3', enabled: true },
                full: { url: 'http://localhost/SILENCED/server8.mp3quran.net/s_gmd/001.mp3', currentSurah: 1 }
            },
            slideshowIntervalSec: 15,
            defaultSlidesCount: 39,
            useDefaultSlideshow: true,
            wakeLockMinutes: 20,
            bismillahFile: 'bismillah_abdulbaset.mp3',
            wakeLockEnabled: true,
            layoutLocked: false, // UNLOCKED by default
            publicApkUrl: 'https://github.com/redha16/Athan-TV-Pro/releases/download/v36.2/app-debug.apk',
            cadresEnabled: true,
            iqamaDurations: {
                Fajr: 10,
                Dhuhr: 10,
                Asr: 10,
                Maghrib: 5,
                Isha: 10
            }
        };
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
                prayers: {
                    Fajr: "الفجر",
                    Sunrise: "الشروق",
                    Dhuhr: "الظهر",
                    Asr: "العصر",
                    Maghrib: "المغرب",
                    Isha: "العشاء"
                },
                weather: {
                    0: "سماء صافية",
                    1: "غائم جزئيا",
                    2: "غائم جزئيا",
                    3: "غائم",
                    45: "ضباب",
                    51: "رذاذ",
                    61: "مطر",
                    71: "ثلج",
                    95: "عاصفة"
                },
                date_locale: 'ar-DZ',
                athkar_after_salat: "الأذكار بعد الصلاة",
                app_logo: "شعار التطبيق (صورة/GIF)",
                fasting: {
                    suhoor: "سحور",
                    iftar: "إفطار",
                    ramadan: "صيام رمضان",
                    sunnah_mon: "صيام الإثنين",
                    sunnah_thu: "صيام الخميس",
                    ayam_bidh: "صيام الأيام البيض"
                }
            },
            fr: {
                city: "Sétif",
                next_prayer: "Prochaine Prière",
                close: "Fermer",
                settings: "Paramètres",
                backgrounds: "Arrière-plans",
                language: "Langue",
                time_correction: "Correction (min)",
                athan_config: "Config Athan (Vidéo)",
                athkars_config: "Athkars (Audio)",
                enabled: "Activé",
                disabled: "Désactivé",
                morning_athkar: "Matin",
                evening_athkar: "Soir",
                sleep_athkar: "Nuit (Mulk)",
                wakeup_athkar: "Réveil",
                select_files: "Choisir fichiers",
                prayer_list: "Prière",
                prayers: {
                    Fajr: "Fajr",
                    Sunrise: "Chourouk",
                    Dhuhr: "Dhuhr",
                    Asr: "Asr",
                    Maghrib: "Maghrib",
                    Isha: "Isha"
                },
                weather: {
                    0: "Ciel dégagé",
                    1: "Partiellement nuageux",
                    2: "Partiellement nuageux",
                    3: "Nuageux",
                    45: "Brouillard",
                    51: "Bruine",
                    61: "Pluie",
                    71: "Neige",
                    95: "Orage"
                },
                date_locale: 'fr-FR',
                athkar_after_salat: "Invocations post-salat",
                app_logo: "Logo (Image/GIF)",
                fasting: {
                    suhoor: "Suhoor",
                    iftar: "Iftar",
                    ramadan: "Jeûne du Ramadan",
                    sunnah_mon: "Sunnah du Lundi",
                    sunnah_thu: "Sunnah du Jeudi",
                    ayam_bidh: "Ayam Al-Bidh"
                }
            },
            en: {
                city: "Setif",
                next_prayer: "Next Prayer",
                close: "Close",
                settings: "Settings",
                backgrounds: "Backgrounds",
                language: "Language",
                time_correction: "Correction (min)",
                athan_config: "Athan Config (Video)",
                athkars_config: "Athkars (Audio)",
                enabled: "Enabled",
                disabled: "Disabled",
                morning_athkar: "Morning",
                evening_athkar: "Evening",
                sleep_athkar: "Sleep (Mulk)",
                wakeup_athkar: "Wakeup",
                select_files: "Choose files",
                prayer_list: "Prayer",
                prayers: {
                    Fajr: "Fajr",
                    Sunrise: "Sunrise",
                    Dhuhr: "Dhuhr",
                    Asr: "Asr",
                    Maghrib: "Maghrib",
                    Isha: "Isha"
                },
                weather: {
                    0: "Clear sky",
                    1: "Partly cloudy",
                    2: "Partly cloudy",
                    3: "Cloudy",
                    45: "Fog",
                    51: "Drizzle",
                    61: "Rain",
                    71: "Snow",
                    95: "Storm"
                },
                date_locale: 'en-US',
                athkar_after_salat: "Post-prayer invocations",
                app_logo: "Logo (Image/GIF)",
                fasting: {
                    suhoor: "Suhoor",
                    iftar: "Iftar",
                    ramadan: "Ramadan Fasting",
                    sunnah_mon: "Monday Sunnah",
                    sunnah_thu: "Thursday Sunnah",
                    ayam_bidh: "White Days"
                }
            },
            tr: {
                city: "Setif",
                next_prayer: "Sonraki Namaz",
                close: "Kapat",
                settings: "Ayarlar",
                backgrounds: "Arka Planlar",
                language: "Dil",
                time_correction: "Düzeltme (dk)",
                athan_config: "Ezan Ayarı (Video)",
                athkars_config: "Zikirler (Ses)",
                enabled: "Etkin",
                disabled: "Devre Dışı",
                morning_athkar: "Sabah",
                evening_athkar: "Akşam",
                sleep_athkar: "Uyku (Mülk)",
                wakeup_athkar: "Uyanış",
                select_files: "Dosya Seç",
                prayer_list: "Namaz",
                prayers: { Fajr: "Sabah", Sunrise: "Güneş Doğuşu", Dhuhr: "Öğle", Asr: "İkindi", Maghrib: "Akşam", Isha: "Yatsı" },
                weather: { 0: "Açık", 1: "Parçalı bulutlu", 2: "Parçalı bulutlu", 3: "Bulutlu", 45: "Sisli", 51: "Çiseleme", 61: "Yağmur", 71: "Kar", 95: "Fırtına" },
                date_locale: 'tr-TR',
                athkar_after_salat: "Namaz Sonrası Dualar",
                app_logo: "Logo (Resim/GIF)",
                fasting: { suhoor: "Sahur", iftar: "İftar", ramadan: "Ramazan Orucu", sunnah_mon: "Pazartesi Sünneti", sunnah_thu: "Perşembe Sünneti", ayam_bidh: "Beyaz Günler" }
            },
            id: {
                city: "Setif",
                next_prayer: "Shalat Berikutnya",
                close: "Tutup",
                settings: "Pengaturan",
                backgrounds: "Latar Belakang",
                language: "Bahasa",
                time_correction: "Koreksi (mnt)",
                athan_config: "Adzan (Video)",
                athkars_config: "Zikir (Audio)",
                enabled: "Aktif",
                disabled: "Nonaktif",
                morning_athkar: "Pagi",
                evening_athkar: "Sore",
                sleep_athkar: "Tidur (Al-Mulk)",
                wakeup_athkar: "Bangun",
                select_files: "Pilih File",
                prayer_list: "Shalat",
                prayers: { Fajr: "Subuh", Sunrise: "Syuruq", Dhuhr: "Dzuhur", Asr: "Ashar", Maghrib: "Maghrib", Isha: "Isya" },
                weather: { 0: "Langit cerah", 1: "Sebagian berawan", 2: "Sebagian berawan", 3: "Mendung", 45: "Kabut", 51: "Gerimis", 61: "Hujan", 71: "Salju", 95: "Badai" },
                date_locale: 'id-ID',
                athkar_after_salat: "Dzikir Setelah Shalat",
                app_logo: "Logo (Gambar/GIF)",
                fasting: { suhoor: "Sahur", iftar: "Buka Puasa", ramadan: "Puasa Ramadan", sunnah_mon: "Sunnah Senin", sunnah_thu: "Sunnah Kamis", ayam_bidh: "Hari Putih" }
            },
            ur: {
                city: "سیٹف",
                next_prayer: "اگلی نماز",
                close: "بند کریں",
                settings: "ترتیبات",
                backgrounds: "پس منظر",
                language: "زبان",
                time_correction: "اصلاح (منٹ)",
                athan_config: "اذان ترتیب (ویڈیو)",
                athkars_config: "اذکار (آواز)",
                enabled: "فعال",
                disabled: "غیر فعال",
                morning_athkar: "صبح",
                evening_athkar: "شام",
                sleep_athkar: "سونا (الملک)",
                wakeup_athkar: "جاگنا",
                select_files: "فائل منتخب کریں",
                prayer_list: "نماز",
                prayers: { Fajr: "فجر", Sunrise: "اشراق", Dhuhr: "ظہر", Asr: "عصر", Maghrib: "مغرب", Isha: "عشاء" },
                weather: { 0: "صاف آسمان", 1: "جزوی ابر آلود", 2: "جزوی ابر آلود", 3: "ابر آلود", 45: "دھند", 51: "بوندا باندی", 61: "بارش", 71: "برف", 95: "طوفان" },
                date_locale: 'ur-PK',
                athkar_after_salat: "نماز کے بعد اذکار",
                app_logo: "لوگو (تصویر/GIF)",
                fasting: { suhoor: "سحری", iftar: "افطار", ramadan: "رمضان کا روزہ", sunnah_mon: "پیر کا سنت", sunnah_thu: "جمعرات کا سنت", ayam_bidh: "ایام بیض" }
            }
        };



// ================= ATHAN TV STATE (V36.2 - Masjid) =================
// State
let currentLang = 'ar';
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


