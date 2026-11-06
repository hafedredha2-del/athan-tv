# 🌙 Gemini TV Athan — Application Open Source pour Android TV, Mosquées & Foyers

> *"Et fais le bien... afin que vous réussissiez." (Coran, 22:77)*

---

### 🤲 Un projet né du cœur, offert à la communauté (*Fi Sabili Allah*)

Cette application n'est pas une simple application utilitaire d'affichage des heures de prière. Elle est l'aboutissement de **10 mois de travail passionné**, développé pas à pas par un amateur avec l'aide d'une intelligence artificielle. 

Elle a été conçue avec une vision claire : **remplir le rôle d'un enseignant spirituel au foyer comme à la mosquée**, en transformant l'écran de télévision en une source constante d'apprentissage et d'éveil religieux, palliant avec humilité l'absence d'un guide ou d'un Imam à la maison.

**Le projet est offert 100% gratuitement, sans publicité et en open source total pour l'intérêt de la Oumma.**

---

### 📖 Ce que contient déjà l'application (v1.1.0)

* **🕌 Gestion avancée des 6 prières quotidiennes :** Déclenchement automatique d'Athan avec support vidéo dédié pour chaque prière (y compris le Shuruq/Lever du soleil) et personnalisation des décalages (offsets).
* **📖 Modes d'affichage hybrides (Coran & Rappels) :** Lecture et affichage avec diaporamas spécifiques pour le vendredi (**Jumuah**) et pour le reste de la semaine.
* **🤲 Invocations & Athkars animés :** Athkars du matin, du soir, du réveil et du sommeil avec support audio, synchronisation et texte défilant.
* **🌙 Module Siyam (Jeûne) intelligent :** 
  * Synchronisé sur le calendrier Hijri et démarrant rigoureusement au **Maghrib** (et non à minuit/24h).
  * Suivi des jours de jeûne recommandés (Lundi, Jeudi, Ayam Bith, Achoura, Arafat, 6 jours de Shawwal).
  * Affichage des fêtes religieuses avec intégration des règles de bienséance (ex: sans Mawlid Nabawi).
* **🏛️ Mode Masjid (Mosquée) & Mode Maison (Foyer) distincts :** 
  * **Mode Masjid :** Strictement axé sur la bienséance de la mosquée (**Adab el-Masjid**). Il intègre les **Pages Imam** personnalisables où l'Imam peut rédiger ses messages, annonces ou cours au moment voulu pour enrichir le rôle éducatif de la mosquée.
  * **Mode Maison :** Un cadre ouvert et adaptable aux besoins spirituels et éducatifs de la famille, agissant comme un surveillant bienveillant.
* **🌍 Outils & Interface :** Géolocalisation simplifiée pour la ville, météo en direct, widgets déplaçables et support multilingue.

---

### 🛠️ Ce que les développeurs doivent corriger / améliorer (Issues prioritaires)

Bien que l'application soit fonctionnelle, il reste des ajustements techniques et esthétiques sur lesquels la communauté des développeurs est chaleureusement invitée à contribuer :

1. **🐛 Problème du sélecteur d'arrière-plan (Pages Imam & Médias) :**
   * *Problème actuel :* Sur Android TV / WebView, la sélection d'une image locale via le sélecteur natif renvoie des URI `content://` ou des objets Blob qui ne s'affichent pas en CSS (`backgroundImage`).
   * *Piste de correction :* Convertir l'image directement en chaîne Base64 via `FileReader.readAsDataURL` pour l'injecter directement dans le style CSS et la sauvegarder de manière persistante.
2. **🔵 Restauration du Cercle Bleu Animé & Égaliseur :**
   * *Problème actuel :* Le cercle bleu animé qui entourait l'horloge et marquait le décompte des secondes, ainsi que l'égaliseur audio réactif lors de la lecture des sons/Athkars, ont été temporairement perdus lors des refontes de code.
   * *Piste de correction :* Réintégrer proprement la logique du Canvas / CSS et de l'Equalizer audio dans `visualizer.js` / `logic_v2.js`.
3. **💾 Persistance complète du choix des vidéos / MP3 :**
   * S'assurer que le changement manuel des fichiers audio/vidéo par l'utilisateur (via clé USB ou stockage interne) reste 100% sauvegardé après redémarrage de la box TV.
4. **📦 Optimisation & Allègement de l'APK (Sans perte de fonctionnalités) :**
   * Réduire la taille globale du fichier `.apk` tout en garantissant qu'aucune option ni ressource ne soit supprimée.
5. **🔒 Protection des règles du Mode Masjid :**
   * S'assurer que les contributions futures ne dénaturent pas la sobriété du Mode Masjid et respectent les conditions fixées pour les mosquées.

---

🌟 **Gemini TV Athan — أكثر من تطبيق لمواقيت الصلاة**  
*رفيق رقمي يرافق المسلم في حياته اليومية — Sadaqah Jariyah*

**Athan TV** ليس لمجرد عرض مواقيت الصلاة أو الأذان، بل هو بيئة رقمية تفاعلية تجمع بين التذكير والتعليم والتنظيم والتخصيص.

بداية هذا المشروع كانت بفكرة بسيطة من **شخص مبتدئ في عالم البرمجة**، تطورت تدريجياً عبر **10 أشهر من العمل المستمر والشغف** بمساعدة أدوات الذكاء الاصطناعي وبالتعلم والتجربة. وبما أنني لم أستطع إكمال هذا المشروع بمفردي بالكامل، فإنني أضعه اليوم بين أيديكم آملاً أن تنضموا إلي لإتمامه وتطويره.

---

### 🏛️ فلسفة التطبيق: وضعان لكل مقام مقال
* **وضع المسجد (Masjid Mode) — التزام ووقار:** إطار دقيق ومضبوط يركز على آداب المسجد (**Adab el-Masjid**). تتيح *"صفحات الإمام"* للأئمة مساحة حرة لكتابة التوجيهات والدروس ونشر العلم، مع الالتزام التام بضوابط المسجد دون تجاوز.
* **وضع البيت (Home Mode) — تربية وإشراف هادف:** في البيت، يتحول التطبيق إلى ما يشبه **"المُرشد أو المراقِب الرحيم"** على الأسرة؛ ليس بالإزعاج أو كثرة الإشعارات، بل بحضور هادئ ومستمر يوجه نحو التربية، والذكر، والتعلم الديني الصحيح، مع الانفتاح التام على اقتراحاتكم لتطويره.

---

### 🧩 نظام Widgets تفاعلي وقابل للتخصيص
من أبرز مميزات التطبيق وجود نظام Widgets مرن يسمح بـ:
- تحريك العناصر وتغيير أماكنها بحرية وقفلها بعد ترتيبها لتجنب الخطأ.
- تخصيص واجهة الاستخدام حسب رغبة المستخدم مع ثبات الإعدادات بعد إعادة التشغيل.

* **🌦️ Widget الطقس:** تحديثات فورية، توقعات 24 ساعة و5 أيام، مع إمكانية عرض التفاصيل بالضغط.
* **ﷺ Widget الصلاة على النبي ﷺ:** يظهر ابتداءً من مغرب يوم الخميس ويختفي عند دخول مغرب يوم الجمعة.
* **🌙 Widget الصيام والتقويم الإسلامي:** 
  - متوافق مع التقويم الهجري ويبدأ وقته بدخول **المغرب** (وليس بنظام 24 ساعة).
  - متابعة الأيام المستحبة (الاثنين، الخميس، الأيام البيض، عاشوراء، عرفة، ست من شوال).
  - مراعاة المناسبات والأعياد الإسلامية (مع تخصيص استبعاد المولد النبوي).
* **🕌 مواقيت الصلاة والساعة:** عرض عمودي أو أفقي، متابعة الصلاة القادمة، ساعة دائرية متحركة مع مؤشر ثوانٍ وأداة تحليل الصوت (Equalizer).
* **📶 Widget الاتصال بالإنترنت:** عرض حالة شبكة Wi-Fi ومتابعة الاتصال.

---

### ❤️ رؤيتنا: تحويل الشاشة إلى وسيلة نفع وفائدة
نطمح إلى أن يساعد Athan TV على تذكير المسلم بما ينبغي فعله في وقته المناسب، مع تطور واعٍ بالسياق:
- **في البيت:** التذكير، التربية، والتعلم للأطفال والأسرة وكأن هناك عيناً حارسة وموجهة للخير.
- **يوم الجمعة:** إبراز آداب الجمعة والسنن المرتبطة بها عبر diaporamas مخصصة.
- **في المسجد:** المحافظة على السكينة والوقار.

🎓 **الهدف التربوي:** نريد أن يصبح التطبيق وسيلة تساعد الأسرة على التعلم، وتشجع على الذكر، وتتيح للأئمة وأهل الاختصاص توظيف التكنولوجيا في نشر العلم النافع في غياب الإمام بالبيت.

---

### 🛠️ الوضع الحالي وقائمة المهام للمطورين (*دعوة للمساهمة Fi Sabili Allah*)
بما أنني كمبتدئ لم أتمكن من إنهاء كل تفاصيل المشروع وحدي، فإن **المجال مفتوح لكل المطورين والمختصين** للمساهمة وإتمام هذا العمل عبر النقاط التالية:

1. **إصلاح حفظ واسترجاع الوسائط (Media & Backgrounds):** ضمان استقرار خلفيات صفحات الإمام والملفات عبر تحويلها إلى Base64 وتجاوز قيود `content://` في بعض إصدارات Android.
2. **تحسين العناصر البصرية:** ضبط حركة الثواني في الدائرة الزرقاء ومحلل الصوت (Equalizer).
3. **ضمان ثبات الـ Widgets:** الحفاظ على الترتيب والمواقع بعد إعادة تشغيل الجهاز.
4. **📦 ضغط وتخفيف حجم ملف التثبيت (.apk):** تقليص حجم التطبيق لتوفير المساحة على شاشات التلفزيون، مع **الحفاظ التام على جميع الميزات والوسائط والخصائص** دون حذف أي جزء منها.
5. **توسيع التوافق:** دعم أوسع لأنظمة Android، iOS، الويب، والحواسيب.

---

🤲 **Athan TV — تكنولوجيا ذكية، تربية هادفة، وذكر مستمر.**  
*هذا العمل مُهدى لوجه الله تعالى كصدقة جارية. دعوة لكل مطور، مربي، وكل محب للخير للمساهمة معي في إتمامه وتطويره لوجه الله.*
