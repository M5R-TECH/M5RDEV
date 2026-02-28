// Social Media Links Data
const socialMediaLinks = [
    { platform: 'youtube', icon: 'fab fa-youtube', url: 'https://youtube.com/@M5RDEV', label: 'قناة اليوتيوب' },
    { platform: 'tiktok', icon: 'fab fa-tiktok', url: 'https://www.tiktok.com/@m5rdev', label: 'تيك توك' },
    { platform: 'discord', icon: 'fab fa-discord', url: 'https://discord.gg/AnBNEdPK', label: 'ديسكورد' },
    { platform: 'facebook', icon: 'fab fa-facebook', url: 'https://www.facebook.com/M5RDEV.Facebook', label: 'فيسبوك' },
    { platform: 'instagram', icon: 'fab fa-instagram', url: 'https://instagram.com/M5RDEV', label: 'إنستجرام' },
    { platform: 'twitter', icon: 'fab fa-twitter', url: 'https://twitter.com/M5RDEV', label: 'تويتر' },
    { platform: 'whatsapp', icon: 'fab fa-whatsapp', url: 'https://whatsapp.com/channel/0029Vb6KQUGGJP8EJv0tpG2v', label: 'واتساب' },
    { platform: 'telegram', icon: 'fab fa-telegram-plane', url: 'https://t.me/m5rdevchannel', label: 'تيليجرام' },
    { platform: 'linkedin', icon: 'fab fa-linkedin-in', url: 'https://linkedin.com/in/M5RDEV', label: 'لينكد إن' },
    { platform: 'github', icon: 'fab fa-github', url: 'https://github.com/M5RDEV', label: 'جيت هاب' },
    { platform: 'itch.io', icon: 'fab fa-itch-io', url: 'https://m5rdev.itch.io/', label: 'إيتش آيو' }
];

// ===== Settings Management =====
const appSettings = {
    enableAnimations: localStorage.getItem('enableAnimations') !== 'false',
    multipleExplorerWindows: localStorage.getItem('multipleExplorerWindows') === 'true',
    openLinksExternally: localStorage.getItem('openLinksExternally') === 'true',
    brightness: parseFloat(localStorage.getItem('brightness') || '1'),
    windowTransparency: localStorage.getItem('windowTransparency') === 'true',
    transparencyLevel: parseFloat(localStorage.getItem('transparencyLevel') || '0.7') // opacity value between 0.15 and 1
};

function saveSettings() {
    localStorage.setItem('enableAnimations', appSettings.enableAnimations);
    localStorage.setItem('multipleExplorerWindows', appSettings.multipleExplorerWindows);
    localStorage.setItem('openLinksExternally', appSettings.openLinksExternally);
    localStorage.setItem('brightness', appSettings.brightness);
    localStorage.setItem('windowTransparency', appSettings.windowTransparency);
    localStorage.setItem('transparencyLevel', appSettings.transparencyLevel);
}

// global helper for window/menu opacity based on settings
function applyWindowTransparency(){
    const opacity = appSettings.windowTransparency ? appSettings.transparencyLevel : 1;
    const final = appSettings.windowTransparency ? Math.max(opacity, 0.15) : 1;
    document.documentElement.style.setProperty('--window-opacity', final);
    document.querySelectorAll('.window, .start-menu, .settings-menu').forEach(el=>{
        if(appSettings.windowTransparency) {
            el.classList.add('transparent');
        } else {
            el.classList.remove('transparent');
            // remove any inline opacity that might have been set earlier
            el.style.opacity = '';
        }
    });
}

// Browser Management System
const browserTabs = new Map(); // Store tabs for browser windows
const folderTabs = new Map(); // Store tabs for file explorer windows

function createNewBrowserTab(windowId, url = '') {
    const tabId = `tab-${Date.now()}-${Math.random()}`;
    if(!browserTabs.has(windowId)) {
        browserTabs.set(windowId, []);
    }
    const tab = { 
        id: tabId, 
        url: url || 'about:blank', 
        title: url ? new URL(url).hostname : 'New Tab',
        isActive: true 
    };
    const tabs = browserTabs.get(windowId);
    tabs.forEach(t => t.isActive = false);
    tabs.push(tab);
    return tab;
}

function switchBrowserTab(windowId, tabId) {
    const tabs = browserTabs.get(windowId);
    if(!tabs) return;
    tabs.forEach(t => {
        t.isActive = (t.id === tabId);
        const tabEl = document.querySelector(`[data-tab-id="${t.id}"]`);
        const contentEl = document.querySelector(`[data-content-id="${t.id}"]`);
        if(tabEl) tabEl.classList.toggle('active', t.isActive);
        if(contentEl) contentEl.classList.toggle('hidden', !t.isActive);
    });
}

function closeBrowserTab(windowId, tabId) {
    const tabs = browserTabs.get(windowId);
    if(!tabs || tabs.length <= 1) return;
    const idx = tabs.findIndex(t => t.id === tabId);
    if(idx === -1) return;
    tabs.splice(idx, 1);
    if(tabs[idx]) tabs[idx].isActive = true;
    else if(tabs.length > 0) tabs[tabs.length - 1].isActive = true;
    const tabEl = document.querySelector(`[data-tab-id="${tabId}"]`);
    const contentEl = document.querySelector(`[data-content-id="${tabId}"]`);
    if(tabEl) tabEl.remove();
    if(contentEl) contentEl.remove();
    switchBrowserTab(windowId, tabs[0]?.id);
}

// File Explorer Tab Management
function createNewFolderTab(windowId, category, categoryTitle) {
    const tabId = `folder-${category}`;
    if(!folderTabs.has(windowId)) {
        folderTabs.set(windowId, []);
    }
    
    // Check if tab already exists
    const existingTab = folderTabs.get(windowId).find(t => t.id === tabId);
    if(existingTab) {
        switchFolderTab(windowId, tabId);
        return existingTab;
    }
    
    const tab = { 
        id: tabId, 
        category: category,
        title: categoryTitle,
        isActive: true 
    };
    const tabs = folderTabs.get(windowId);
    tabs.forEach(t => t.isActive = false);
    tabs.push(tab);
    return tab;
}

function switchFolderTab(windowId, tabId) {
    const tabs = folderTabs.get(windowId);
    if(!tabs) return;
    tabs.forEach(t => {
        t.isActive = (t.id === tabId);
        const tabEl = document.querySelector(`[data-folder-tab-id="${t.id}"]`);
        const contentEl = document.querySelector(`[data-folder-content-id="${t.id}"]`);
        if(tabEl) tabEl.classList.toggle('active', t.isActive);
        if(contentEl) contentEl.classList.toggle('hidden', !t.isActive);
    });
}

function closeFolderTab(windowId, tabId) {
    const tabs = folderTabs.get(windowId);
    if(!tabs || tabs.length <= 1) return;
    const idx = tabs.findIndex(t => t.id === tabId);
    if(idx === -1) return;
    tabs.splice(idx, 1);
    if(tabs[idx]) tabs[idx].isActive = true;
    else if(tabs.length > 0) tabs[tabs.length - 1].isActive = true;
    const tabEl = document.querySelector(`[data-folder-tab-id="${tabId}"]`);
    const contentEl = document.querySelector(`[data-folder-content-id="${tabId}"]`);
    if(tabEl) tabEl.remove();
    if(contentEl) contentEl.remove();
    switchFolderTab(windowId, tabs[0]?.id);
}

// تأثير الكتابة التلقائية
function typeWriter() {
    const texts = [
        "I'm an Electronic Engineer",
        "I'm a Programmer & Developer",
        "I'm a Video Editor",
        "I'm a Creative Designer"
    ];

    const typingText = document.getElementById('typing-text');
    const cursor = document.querySelector('.typing-cursor');

    // إعداد القيم الأولية
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    // ضبط السرعات
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseBetweenTexts = 2000;
    const pauseBeforeStart = 1000;

    function type() {
        // إذا كان المؤشر مخفيًا (أثناء الإنتظار بين النصوص)
        if (isPaused) {
            cursor.style.visibility = 'hidden';
            return;
        }

        cursor.style.visibility = 'visible';
        const currentText = texts[textIndex];

        if (isDeleting) {
            // حالة المسح (نقص من النهاية حتى البداية)
            typingText.textContent = currentText.substring(currentText.length - (charIndex - 1));
            charIndex--;
        } else {
            // حالة الكتابة (ابدأ من نهاية النص بحيث يظهر من اليمين إلى اليسار)
            typingText.textContent = currentText.substring(currentText.length - (charIndex + 1));
            charIndex++;
        }

        if (!isDeleting && charIndex === currentText.length) {
            // نهاية الكتابة، انتظر ثم ابدأ المسح
            isDeleting = true;
            isPaused = true;
            setTimeout(() => {
                isPaused = false;
                type();
            }, pauseBetweenTexts);
        } else if (isDeleting && charIndex === 0) {
            // نهاية المسح، انتقل للنص التالي
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            isPaused = true;
            setTimeout(() => {
                isPaused = false;
                type();
            }, 500);
        } else {
            // استمر في الكتابة أو المسح
            const speed = isDeleting ? deletingSpeed : typingSpeed;
            setTimeout(type, speed);
        }
    }

    // بدء التأثير بعد تأخير قصير
    setTimeout(type, pauseBeforeStart);
}
// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    createBubbles();
    typeWriter(); // أضف هذا السطر
});

// بيانات المشاريع
const projectsData = {
    programs: [
        {
            title: "موسوعة المسلم",
            description: "تطبيق إسلامي يعمل على نظام التشغيل ويندوز سهل الإستخدام و جامع للكثير من الميزات",
            image: "img/my-programs/muslim.png",
            url: "https://m5rdev.github.io/MuslimEncyclopedia/",
            keywords: "برنامج إسلامي موسوعة المسلم ويندوز قرآن أذكار",
        },
        {
            title: "أداة تحميل القراء",
            description: "أداة لتحميل مجموعة من القراء أداة مدمجة مع تطبيق موسوعة المسلم و يمكن تحميلها بمفردها",
            image: "img/my-programs/Radio.png",
            url: "https://www.mediafire.com/file/z89vdti050tu1tm/تحميل+قراء.rar/file",
            keywords: "أداة تحميل قراء قرآن إسلامي"
        },
        {
            title: "مسبحة الكترونية 📿",
            description: "تطبيق للأندرويد لمساعدتك في عدد رقم الأذكار والتسابيح",
            image: "img/my-programs/Sib7a.png",
            url: "https://www.mediafire.com/file/jp8zvk8xpkd8rxc/%25D9%2585%25D8%25B3%25D8%25A8%25D8%25AD%25D8%25A9_%25D8%25A7%25D9%2584%25D9%2583%25D8%25AA%25D8%25B1%25D9%2588%25D9%2586%25D9%258A%25D8%25A9.apk/file",
            keywords: "مسبحة أذكار تسبيح أندرويد"
        },
        {
            title: "حاسبة مواقيت النوم",
            description: "تطبيق للكمبيوتر لمساعدتك في تحديد مواعيد الاستيقاظ بناء علي دورات النوم",
            image: "img/my-programs/sleepcalc.png",
            url: "https://www.mediafire.com/file/k8qruo8k8zdp8p9/Sleep_Calculator.exe/file",
            keywords: "حاسبة النوم دورات نوم"
        },
        {
            title: "مترجم نصوص",
            description: "تطبيق للكمبيوتر ترجمة لغات متعدد خفيف و يتعرف علي اللغات تلقائي اذا لم تحدد لغة",
            image: "img/my-programs/TranslateText.png",
            url: "https://www.mediafire.com/file/fq6hpdnrf9scnlb/TranslateText.exe/file",
            keywords: "مترجم نصوص لغات ترجمة",
        },
        {
            title: "آلة حاسبة للاندرويد",
            description: "تطبيق آلة حاسبة بسيطة للأندرويد بلغة فلتر",
            image: "img/source-code/calculator.png",
            url: "https://www.mediafire.com/file/f7tk2t1muxltdws/%255BFlutter%255DCalcutator.apk/file",
            keywords: "آلة حاسبة اندرويد فلاتر",
        },
        {
            title: "تقيم الصور [ترتيب الصور]",
            description: "تقيم او ترتيب الصور بالافضل rate pic",
            image: "img/my-programs/pic-rate.png",
            url: "https://www.mediafire.com/file/c361bn2kd0nooyf/Pic_Rate.rar/file",
            keywords: "تقيم الصور و ترتيب الصور",
        },
        {
            title: "Speech text [ناطق النصوص]",
            description: "تطبيق يقوم بنطق النصوص و التحكم في سرعة القراءة بلغة C#",
            image: "img/my-programs/Speech.png",
            url: "https://www.mediafire.com/file/4w0ob9f70wag8qn/Speech_text.rar/file",
            keywords: "ناطق النصوص سرعة القراءة C#",
        },
        {
            title: "Color Converter",
            description: "أداة لتبديل بين أكواد الألوان Name, RGB, RGBA, HEX, HSL, CIELAB, XYZ",
            image: "img/my-websites/ColorMate-code.png",
            url: "https://www.mediafire.com/file/shpllevctggq0dg/ColorConverter.exe/file",
            keywords: "Color Converter أداة تحويل الألوان أكواد الألوان Name RGB RGBA HEX HSL CIELAB XYZ",
        }
    ],
    games: [
        {
            title: "Flipy Robot",
            description: "أول لعبة ليا من محرك جودوت",
            image: "img/my-games/Flipy Robot.png",
            url: "https://m5rdev.itch.io/flipy-robot",
            keywords: "روبوت فليبي لعبة جودوت",
        },
        {
            title: "ورقة حجر مقص",
            description: "لعبة تجريبة بدون محاكي [ويندوز فورم بلغة سي شارب]",
            image: "img/my-games/rock paper scissors .png",
            url: "https://m5rdev.itch.io/rock-paper-scissors",
            keywords: "لعبة حجر ورقة مقص",
        },
        {
            title: "luminaze-demo",
            description: "لعبة تحاول فيها الا تقع في اي فخ حتى تصل الى نقطة النهاية (لعبة صعبه)",
            image: "img/my-games/luminaze-demo.png",
            url: "https://m5rdev.itch.io/luminaze-demo",
            keywords: "لعبة luminaze فخاخ"
        }
    ],  
    websites: [
        {
            title: "MuslimEncyclopedia-online",
            description: "موقع موسوعة المسلم الإلكترونية - نسخة الويب",
            image: "img/my-programs/muslim.png",
            url: "https://m5rdev.github.io/MuslimEncyclopedia-online/",
            keywords: "موقع إسلامي موسوعة المسلم ويب قرآن أذكار",
        },
        {
            title: "ColorMate",
            description: "أداة لاختيار وتنسيق الألوان للمصممين والمطورين",
            image: "img/my-websites/ColorMate-code.png",
            url: "https://m5rdev.github.io/ColorMate/",
            keywords: "ألوان تنسيق مصمم مطور ويب"
        },
        {
            title: "VoiceToText-TextToVoice",
            description: "أداة تحويل الصوت إلى نص والنص إلى صوت مباشرة في المتصفح بدون الحاجة لتحميل برامج خارجية",
            image: "img/my-websites/text-to-voice-code.png",
            url: "https://m5rdev.github.io/VoiceToText-TextToVoice/",
            keywords: "صوت نص تحويل ويب"
        },
        {
            title: "Html-Code-viewer",
            description: "محرر أكواد أونلاين لمعاينة أكواد HTML, CSS, JavaScript",
            image: "img/my-websites/programming_icon.png",
            url: "https://m5rdev.github.io/Html-Code-viewer/",
            keywords: "محرر أكواد ويب html css javascript",
        },
        {
            title: "مسبحة اونلاين 📿",
            description: "مسبحة الكترونية أونلاين HTML, CSS, JavaScript",
            image: "img/my-programs/Sib7a.png",
            url: "https://m5rdev.github.io/ECounter/",
            keywords: "محرر أكواد ويب html css javascript",
        },
        {
            title: "المرشد السياحي العربي",
            description: "منصة عربية شاملة تحتوي على كل المعلومات السياحية عن الدول العربية و بعض المعلومات",
            image: "img/my-websites/tour guide.png",
            url: "https://m5rdev.github.io/ar-tour-guide/",
            keywords: "المرشد السياحي العربي : منصة عربية شاملة تحتوي على كل المعلومات السياحية عن الدول العربية و تحديث أسعار العملات مباشرة من مصادر موثوقة",
        }
    ],
    sourceCode: [
        {
            title: "سورس Crazylogin",
            description: "سورس كود برنامج login و register بسيطة ومسلية بلغة سي شارب بلغة سي شارب C#",
            image: "img/my-programs/crazylogin-code.png",
            url: "https://drive.google.com/file/d/1pHAvSQ1Hqbw158_JBrGpMgGoRPH9B0Wl/view?usp=sharing",
            keywords: "سورس كود CrazyLogin"
        },
        {
            title: "سورس Flipy Robot",
            description: "سورس كود لعبة Flipy Robot بلغة GDScript",
            image: "img/my-games/Flipy Robot.png",
            url: "https://github.com/m5rdev/Flipy-Robot",
            keywords: "سورس كود لعبة جودوت"
        },
        {
            title: "سورس آلة حاسبة",
            description: "سورس كود لآلة حاسبة بسيطة بلغة السي شارب C#",
            image: "img/source-code/calculator.png",
            url: "https://www.mediafire.com/file/od2fldnwsxmlsn8/Calculator.rar/file",
            keywords: "سورس كود آلة حاسبة"
        },
        {
            title: "سورس مترجم نصوص",
            description: "سورس كود لتطبيق ترجمة لغات متعدد للكمبيوتر بلغة C# سي شارب دوت نت ويندوز فورم",
            image: "img/my-programs/TranslateText.png",
            url: "https://www.mediafire.com/file/7klavtsdx52yagt/TranslateText.rar/file",
            keywords: "سورس كود مترجم نصوص"
        },
        {
            title: "سورس آلة حاسبة للاندرويد",
            description: "سورس كود تطبيق آلة حاسبة بسيطة للأندرويد بلغة فلتر Flutter",
            image: "img/source-code/calculator.png",
            url: "https://www.mediafire.com/file/dca0vobk6lqgyra/Flutter+calculator.rar/file",
            keywords: "سورس كود آلة حاسبة اندرويد"
        },
        {
            title: "محرر أكواد أونلاين",
            description: "سورس كود موقع محرر أكواد أونلاين لمعاينة أكواد html,css,js",
            image: "img/my-websites/programming_icon.png",
            url: "https://www.mediafire.com/file/gpnv19ebkzurr0z/Html-Code-viewer.zip/file",
            keywords: "سورس كود محرر أكواد"
        },
        {
            title: "سورس المسبحة الاونلاين 📿",
            description: "سورس كود موقع المسبحة الكترونية أونلاين HTML, CSS, JavaScript",
            image: "img/my-programs/Sib7a.png",
            url: "https://www.mediafire.com/file/5lme3bqw4y130n4/%25D9%2585%25D8%25B3%25D8%25A8%25D8%25AD%25D8%25A9_%25D8%25A5%25D9%2584%25D9%2583%25D8%25AA%25D8%25B1%25D9%2588%25D9%2586%25D9%258A%25D8%25A9_%25D8%25A3%25D9%2588%25D9%2586%25D9%2584%25D8%25A7%25D9%258A%25D9%2586.zip/file",
            keywords: "محرر أكواد ويب html css javascript",
        },
        {
            title: "سورس المسبحة لاندرويد 📿",
            description: "سورس كود المسبحة الكترونية لاندرويد بلغة فلتر Flutter",
            image: "img/my-programs/Sib7a.png",
            url: "https://drive.google.com/file/d/1ZCEH5PHUFox8IsZ-3VpXav0imMs7Rdo9/view?usp=drive_link",
            keywords: "محرر أكواد ويب html css javascript",
        },
        {
            title: "سورس تقيم الصور",
            description: "سورس كود تقيم او ترتيب الصور بالافضل لغة C# rate pic",
            image: "img/my-programs/pic-rate.png",
            url: "https://www.mediafire.com/file/y765zxugz1uhd9q/RatePic+Source+code.rar/file",
            keywords: "تقيم الصور و ترتيب الصور",
        },
        {
            title: "Speech text سورس",
            description: "سورس تطبيق Speech text ناطق النصوص بلغة C#",
            image: "img/my-programs/Speech.png",
            url: "https://www.mediafire.com/file/iin41ow8i3fysm5/Speech+Text.rar/file",
            keywords: "ناطق النصوص سرعة القراءة C#",
        },
        {
            title: "سورس المرشد السياحي",
            description: "منصة عربية شاملة تحتوي على كل المعلومات السياحية عن الدول العربية و بعض المعلومات",
            image: "img/my-websites/tour guide.png",
            url: "https://www.mediafire.com/file/w0nk1euh8kgkymj/index.html/file",
            keywords: "المرشد السياحي العربي : منصة عربية شاملة تحتوي على كل المعلومات السياحية عن الدول العربية و تحديث أسعار العملات مباشرة من مصادر موثوقة",
        },
        {
            title: "سورس الموقع الحالي M5RDEV",
            description: "موقعي الخاص Portfolio MRDEV معلومات عني و اخر مشاريعي البرمجية",
            image: "img/avatar.png",
            url: "https://www.mediafire.com/file/l73g7upf4q37b2g/M5RDEV.rar/file",
            keywords: "موقعي الخاص Portfolio MRDEV معلومات عني و اخر مشاريعي البرمجية",
        },
        {
            title: "سورس موقع موسوعة المسلم",
            description: "تطبيق إسلامي يعمل على نظام التشغيل ويندوز سهل الإستخدام و جامع للكثير من الميزات",
            image: "img/my-programs/muslim.png",
            url: "https://www.mediafire.com/file/qzucwc0mh91lu0i/MuslimEncyclopedia-main.zip/file",
            keywords: "برنامج إسلامي موسوعة المسلم ويندوز قرآن أذكار",
        }
    ],
};

// عرض المشاريع باستخدام loops
function renderProjects() {
    // عرض البرامج — تأكد من وجود القوائم قبل الكتابة
    const programsList = document.getElementById('programs-list');
    if (programsList && projectsData.programs) {
        projectsData.programs.forEach(project => {
            programsList.innerHTML += `
                <li class="project-card animate_animated animate_fadeIn"
                    data-keywords="${project.keywords}"
                    onclick="openProjectModal(this)">
                    <img src="${project.image}" alt="${project.title}" class="project-image">
                    <h4 class="project-title">${project.title}</h4>
                    <h6 class="project-description">${project.description}</h6>
                    <div class="project-link" onclick="openProjectModal(this.parentElement, event)"
                        data-url="${project.url}" aria-label="تحميل ${project.title}">
                        <i class="fa-solid fa-circle-down"></i>
                    </div>
                </li>
            `;
        });
    }

    // الألعاب
    const gamesList = document.getElementById('games-list');
    if (gamesList && projectsData.games) {
        projectsData.games.forEach(project => {
            gamesList.innerHTML += `
                <li class="project-card animate_animated animate_fadeIn"
                    data-keywords="${project.keywords}"
                    onclick="openProjectModal(this)">
                    <img src="${project.image}" alt="${project.title}" class="project-image">
                    <h4 class="project-title">${project.title}</h4>
                    <h6 class="project-description">${project.description}</h6>
                    <div class="project-link" onclick="openProjectModal(this.parentElement, event)"
                        data-url="${project.url}" aria-label="تحميل ${project.title}">
                        <i class="fa-solid fa-circle-down"></i>
                    </div>
                </li>
            `;
        });
    }

    // المواقع
    const websitesList = document.getElementById('websites-list');
    if (websitesList && projectsData.websites) {
        projectsData.websites.forEach(project => {
            websitesList.innerHTML += `
                <li class="project-card animate_animated animate_fadeIn"
                    data-keywords="${project.keywords}"
                    onclick="openProjectModal(this)">
                    <img src="${project.image}" alt="${project.title}" class="project-image">
                    <h4 class="project-title">${project.title}</h4>
                    <h6 class="project-description">${project.description}</h6>
                    <div class="project-link" onclick="openProjectModal(this.parentElement, event)"
                        data-url="${project.url}" aria-label="زيارة ${project.title}">
                        <i class="fa-brands fa-chrome"></i>
                    </div>
                </li>
            `;
        });
    }

    // سورس كود
    const sourceCodeList = document.getElementById('source-code-list');
    if (sourceCodeList && projectsData.sourceCode) {
        projectsData.sourceCode.forEach(project => {
            sourceCodeList.innerHTML += `
                <li class="project-card animate_animated animate_fadeIn"
                    data-keywords="${project.keywords}"
                    onclick="openProjectModal(this)">
                    <img src="${project.image}" alt="${project.title}" class="project-image">
                    <h4 class="project-title">${project.title}</h4>
                    <h6 class="project-description">${project.description}</h6>
                    <div class="project-link" onclick="openProjectModal(this.parentElement, event)"
                        data-url="${project.url}" aria-label="تحميل ${project.title}">
                        <i class="fa-solid fa-circle-down"></i>
                    </div>
                </li>
            `;
        });
    }
}

// Project Modal - النسخة المعدلة
function openProjectModal(element, event = null) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    // حفظ موقع التمرير الحالي
    const scrollY = window.scrollY || window.pageYOffset;
    document.body.style.top = `-${scrollY}px`;
    document.body.classList.add('modal-open');

    const modal = document.getElementById('projectModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalDownloadLink = document.getElementById('modalDownloadLink');

    modalImage.src = element.querySelector('img').src;
    modalTitle.textContent = element.querySelector('h4').textContent;
    modalDescription.textContent = element.querySelector('h6').textContent;
    modalDownloadLink.href = element.querySelector('[data-url]').getAttribute('data-url');

    // تحديد نص الزر بناءً على نوع المشروع
    const parentListId = element.closest('ul').id;
    if (parentListId === 'websites-list') {
        modalDownloadLink.textContent = 'تحميل الموقع';
    } else {
        modalDownloadLink.textContent = 'تحميل';
    }

    modal.style.display = 'block';
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.style.display = 'none';
}

// Loading Screen Animation
function updateProgress() {
    const loadingScreen = document.getElementById('loadingScreen');
    const percentageText = document.getElementById('percentage');
    const statusText = document.getElementById('status-text');
    let count = 0;
    const statusMessages = ["مطور العاب", "مبرمج مواقع", "مبرمج تطبيقات", ""];

    // Ensure spinner keeps animating while loading screen exists
    const winSpinner = document.getElementById('winSpinner');
    if (winSpinner) winSpinner.classList.add('spinning');

    const interval = setInterval(() => {
        count++;
        percentageText.textContent = count + '%';

        if (count === 30) statusText.textContent = statusMessages[0];
        if (count === 50) statusText.textContent = statusMessages[1];
        if (count === 70) statusText.textContent = statusMessages[2];

        if (count === 100) {
            statusText.textContent = statusMessages[3];
            clearInterval(interval);

            // Add fade out animation
            loadingScreen.style.opacity = '0';

            setTimeout(() => {
                // إخفاء شاشة التحميل وإظهار "سطح المكتب" الوهمي
                loadingScreen.classList.add('hidden');
                const desktop = document.getElementById('desktop');
                if (desktop) desktop.classList.remove('hidden');
                renderProjects(); // عرض المشاريع بعد انتهاء التحميل
                // تحديث الوقت في علبة النظام
                updateTrayTime();
                // stop spinner once loading screen is hidden
                if (winSpinner) winSpinner.classList.remove('spinning');
            }, 600);
        }
    }, 20);
}

// Mobile Menu Toggle (guarded - header may be removed in desktop mode)
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
        });
    });
}

// Dark Mode Toggle (guarded)
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
if (themeToggle && themeIcon) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');

        if (document.body.classList.contains('light-mode')) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// Back to Top Button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Popup Message
function showPopup() {
    const popup = document.getElementById('popupMessage');
    popup.style.display = 'block';
    setTimeout(() => {
        popup.style.display = 'none';
    }, 5000);
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('projectModal');
    if (event.target === modal) {
        closeProjectModal();
    }
});

// Search Functionality (guarded - project lists may be removed in desktop mode)
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    const projectItems = document.querySelectorAll('.project-card');
    const projectCategories = document.querySelectorAll('.projects-grid');

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let hasResults = false;

        projectCategories.forEach(category => {
            let categoryHasResults = false;

            category.querySelectorAll('.project-card').forEach(item => {
                const keywords = item.getAttribute('data-keywords').toLowerCase();
                const title = item.querySelector('h4').textContent.toLowerCase();
                const description = item.querySelector('h6').textContent.toLowerCase();

                if (keywords.includes(searchTerm) || title.includes(searchTerm) || description.includes(searchTerm)) {
                    item.style.display = 'block';
                    categoryHasResults = true;
                } else {
                    item.style.display = 'none';
                }
            });

            // Show/hide "No results" message
            const noResults = category.querySelector('.no-results') || document.createElement('div');
            if (!categoryHasResults && searchTerm !== '') {
                if (!category.querySelector('.no-results')) {
                    noResults.className = 'no-results';
                    noResults.textContent = 'لا توجد نتائج مطابقة للبحث';
                    category.appendChild(noResults);
                }
            } else {
                if (category.querySelector('.no-results')) {
                    category.removeChild(category.querySelector('.no-results'));
                }
            }

            if (categoryHasResults) hasResults = true;
        });

        // Scroll to first result if there are matches
        if (hasResults && searchTerm !== '') {
            const firstVisibleItem = document.querySelector('.project-card[style="display: block;"]');
            if (firstVisibleItem) {
                firstVisibleItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

// Bubbles Background Animation
function createBubbles() {
    const bubblesContainer = document.getElementById('bubbles');
    const bubbleCount = 20;

    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');

        const size = Math.random() * 60 + 20;
        const posX = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 10;

        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${posX}%`;
        bubble.style.setProperty('--duration', `${duration}s`);
        bubble.style.animationDelay = `${delay}s`;

        bubblesContainer.appendChild(bubble);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
    createBubbles();

});

// تحديث الوقت في علبة النظام
function updateTrayTime(){
    const tray = document.getElementById('tray-time');
    if(!tray) return;
    const now = new Date();
    const hours = now.getHours().toString().padStart(2,'0');
    const mins = now.getMinutes().toString().padStart(2,'0');
    tray.textContent = `${hours}:${mins}`;
}

// تحديث كل دقيقة
setInterval(updateTrayTime, 60000);

// --- Windows-like desktop interactions ---
document.addEventListener('click', (e) => {
    // Start button toggle
    if (e.target.closest('.start-btn')) {
        toggleStartMenu();
        return;
    }

    // Click outside Start menu closes it with animation
    if (!e.target.closest('#startMenu') && !e.target.closest('.start-btn')) {
        const sm = document.getElementById('startMenu');
        if(sm && !sm.classList.contains('hidden')){
            toggleStartMenu();
        }
    }
});

// Settings Menu Toggle with animation
function toggleSettingsMenu() {
    const sm = document.getElementById('settingsMenu');
    if(!sm) return;
    if(!appSettings.enableAnimations){
        // instant toggle
        sm.classList.toggle('hidden');
        return;
    }
    if(sm.classList.contains('hidden')){
        sm.classList.remove('hidden','closing');
        sm.classList.add('opening');
        sm.addEventListener('animationend', ()=> sm.classList.remove('opening'), {once:true});
    } else {
        sm.classList.add('closing');
        sm.addEventListener('animationend', ()=>{
            sm.classList.add('hidden');
            sm.classList.remove('closing');
        }, {once:true});
    }
}

// Start Menu Toggle with animation
function toggleStartMenu(){
    const sm = document.getElementById('startMenu');
    if(!sm) return;
    if(!appSettings.enableAnimations){
        sm.classList.toggle('hidden');
        const input = document.getElementById('startSearch');
        if(!sm.classList.contains('hidden') && input) input.focus();
        return;
    }
    if(sm.classList.contains('hidden')){
        // show
        sm.classList.remove('hidden','closing');
        sm.classList.add('opening');
        sm.addEventListener('animationend', ()=> sm.classList.remove('opening'), {once:true});
        const input = document.getElementById('startSearch');
        if(input) input.focus();
    } else {
        // hide with exit animation
        sm.classList.add('closing');
        sm.addEventListener('animationend', ()=>{
            sm.classList.add('hidden');
            sm.classList.remove('closing');
        }, {once:true});
    }
}

// Close settings menu when clicking outside
document.addEventListener('click', (e) => {
    const sm = document.getElementById('settingsMenu');
    const settingsBtn = document.getElementById('traySettingsBtn');
    if (sm && !e.target.closest('#settingsMenu') && !e.target.closest('#traySettingsBtn')) {
        sm.classList.add('hidden');
    }
});

// Settings Menu wiring
document.addEventListener('DOMContentLoaded', ()=>{
    // Dark mode toggle (inverted state: checked == dark enabled)
    const darkModeToggle = document.getElementById('settingsDarkMode');
    if(darkModeToggle) {
        darkModeToggle.addEventListener('change', (e) => {
            if(e.target.checked){
                document.body.classList.remove('light-mode');
                localStorage.setItem('theme','dark');
            } else {
                document.body.classList.add('light-mode');
                localStorage.setItem('theme','light');
            }
        });
    }

    // Animations toggle
    const animationsToggle = document.getElementById('settingsAnimations');
    if(animationsToggle) {
        animationsToggle.addEventListener('change', (e) => {
            appSettings.enableAnimations = e.target.checked;
            // update existing windows
            document.querySelectorAll('.window').forEach(w=>{
                if(appSettings.enableAnimations) w.classList.remove('no-animation');
                else w.classList.add('no-animation');
            });
            // update menus as well
            const sm = document.getElementById('startMenu');
            const sett = document.getElementById('settingsMenu');
            if(sm) {
                if(appSettings.enableAnimations) sm.classList.remove('no-animation');
                else sm.classList.add('no-animation');
            }
            if(sett) {
                if(appSettings.enableAnimations) sett.classList.remove('no-animation');
                else sett.classList.add('no-animation');
            }
            saveSettings();
        });
    }

    // External links toggle
    const externalLinksToggle = document.getElementById('settingsExternalLinks');
    if(externalLinksToggle){
        externalLinksToggle.addEventListener('change',(e)=>{
            appSettings.openLinksExternally = e.target.checked;
            saveSettings();
        });
    }

    // Multiple windows toggle
    const multipleWindowsToggle = document.getElementById('settingsMultipleWindows');
    if(multipleWindowsToggle) {
        multipleWindowsToggle.addEventListener('change', (e) => {
            appSettings.multipleExplorerWindows = e.target.checked;
            saveSettings();
        });
    }

    // Window transparency toggle
    const transparencyToggle = document.getElementById('settingsTransparency');
    const transparencySlider = document.getElementById('settingsTransparencyLevel');
    const transparencyContainer = document.getElementById('settingsTransparencyLevelContainer');

    if(transparencyToggle){
        transparencyToggle.addEventListener('change',(e)=>{
            appSettings.windowTransparency = e.target.checked;
            if(transparencyContainer) transparencyContainer.style.display = appSettings.windowTransparency ? 'flex' : 'none';
            applyWindowTransparency();
            saveSettings();
        });
    }
    if(transparencySlider){
        transparencySlider.min = 0.15;
        transparencySlider.max = 1;
        transparencySlider.step = 0.01;
        transparencySlider.value = appSettings.transparencyLevel;
        transparencySlider.addEventListener('input',(e)=>{
            const val = parseFloat(e.target.value);
            appSettings.transparencyLevel = val;
            applyWindowTransparency();
            saveSettings();
        });
    }

    // brightness slider handling
    const brightnessSlider = document.getElementById('settingsBrightness');
    if(brightnessSlider){
        brightnessSlider.value = appSettings.brightness;
        brightnessSlider.addEventListener('input',(e)=>{
            const val = parseFloat(e.target.value);
            appSettings.brightness = val;
            document.documentElement.style.setProperty('--brightness', val);
            saveSettings();
        });
        // apply initial
        document.documentElement.style.setProperty('--brightness', appSettings.brightness);
    }

    // initialize transparency slider visibility
    if(transparencyContainer) transparencyContainer.style.display = appSettings.windowTransparency ? 'flex' : 'none';
    applyWindowTransparency();

    // Set initial toggle states
    // toggle checked true when dark mode active
    darkModeToggle.checked = !document.body.classList.contains('light-mode');
    animationsToggle.checked = appSettings.enableAnimations;
    if(externalLinksToggle) externalLinksToggle.checked = appSettings.openLinksExternally;
    multipleWindowsToggle.checked = appSettings.multipleExplorerWindows;
    if(transparencyToggle) transparencyToggle.checked = appSettings.windowTransparency;
    // initial state
    if(localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');
    // update toggle after stored theme
    darkModeToggle.checked = !document.body.classList.contains('light-mode');

    // ensure windows/menus obey current transparency value
    applyWindowTransparency();
});

// Global link click handler for external/open behaviour
function handleGlobalLinkClick(e){
    if(!appSettings.openLinksExternally) return;
    let el = e.target;
    while(el && el.tagName !== 'A') el = el.parentElement;
    if(el && el.href){
        // allow normal if already set
        if(!el.target || el.target === '_self'){
            e.preventDefault();
            window.open(el.href,'_blank','noopener');
        }
    }
}
document.addEventListener('click', handleGlobalLinkClick, true);

// Open windows when desktop icon or start item clicked
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('dblclick', () => {
            if(icon.dataset.window) openDesktopWindow(icon.dataset.window);
        });
        icon.addEventListener('click', () => {
            if(icon.dataset.window) openDesktopWindow(icon.dataset.window);
        });
    });

    document.querySelectorAll('.start-item').forEach(btn => {
        btn.addEventListener('click', () => openDesktopWindow(btn.dataset.window));
    });
    // Start menu search wiring
    const startSearch = document.getElementById('startSearch');
    const startList = document.getElementById('startSearchResultsList');
    if(startSearch && startList){
        startSearch.addEventListener('input', ()=>{
            const q = startSearch.value.toLowerCase().trim();
            startList.innerHTML = '';
            if(q === '') return;
            const matches = [];
            const collect = (items, category)=>{
                if(!items) return;
                items.forEach(it=>{
                    if((it.title && it.title.toLowerCase().includes(q)) || (it.keywords && it.keywords.toLowerCase().includes(q))){
                        matches.push({item:it, category});
                    }
                });
            };
            collect(projectsData.programs, 'programs');
            collect(projectsData.games, 'games');
            collect(projectsData.websites, 'websites');
            collect(projectsData.sourceCode, 'sourceCode');

            if(matches.length === 0){
                startList.innerHTML = '<div class="no-results">لا توجد نتائج</div>';
                return;
            }

            matches.forEach(m => {
                const row = document.createElement('div');
                row.className = 'start-search-item';
                const img = document.createElement('img');
                img.src = m.item.image || 'img/avatar.png';
                const info = document.createElement('div');
                const categoryMap = {'programs': 'برامج', 'games': 'ألعاب', 'websites': 'مواقع', 'sourceCode': 'سورس كود'};
                const categoryDisplay = categoryMap[m.category] || m.category;
                info.innerHTML = `<div class="s-title">${m.item.title}</div><div class="s-meta">${categoryDisplay}</div>`;
                const action = document.createElement('div');
                action.innerHTML = `<a class="btn" href="${m.item.url}" target="_blank" rel="noopener">تحميل</a>`;
                row.appendChild(img);
                row.appendChild(info);
                row.appendChild(action);
                row.addEventListener('click', ()=>{
                    // open the relevant window category and highlight
                    const map = {programs:'win-projects', games:'win-games', websites:'win-websites', sourceCode:'win-source'};
                    const winId = map[m.category];
                    if(winId) openDesktopWindow(winId);
                });
                startList.appendChild(row);
            });
        });
    }
});

function setupWebsiteButtonHandlers(winEl) {
    winEl.querySelectorAll('.open-in-browser-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const listItem = btn.closest('.win-list-item');
            if(!listItem) return;
            
            const url = listItem.dataset.url;
            const title = listItem.dataset.title;
            
            // Open or focus the browser window
            let browserWindow = document.getElementById('win-browser');
            if(!browserWindow) {
                openDesktopWindow('win-browser');
                browserWindow = document.getElementById('win-browser');
            } else {
                bringToFront(browserWindow);
                browserWindow.classList.remove('minimized');
            }
            
            // Add new tab with the website
            const newTab = createNewBrowserTab('win-browser', url);
            newTab.title = title;
            
            // Render tabs and update display
            setTimeout(() => {
                const tabsBar = browserWindow.querySelector('.browser-tabs-bar');
                const addressBar = browserWindow.querySelector('.browser-address-bar');
                if(tabsBar && addressBar) {
                    renderBrowserTabs(browserWindow, 'win-browser');
                    updateBrowserDisplayForWindow(browserWindow, 'win-browser');
                }
            }, 50);
        });
    });
}


function openDesktopWindow(id){
    // For folder windows, check multipleExplorerWindows setting
    if(['win-projects', 'win-games', 'win-websites', 'win-source'].includes(id)) {
        const categoryMap = {
            'win-projects': { key: 'programs', title: 'البرامج' },
            'win-games': { key: 'games', title: 'الألعاب' },
            'win-websites': { key: 'websites', title: 'المواقع' },
            'win-source': { key: 'sourceCode', title: 'السورس' }
        };
        const info = categoryMap[id];

        // If multipleExplorerWindows is enabled, open new window for each folder
        if(appSettings.multipleExplorerWindows) {
            // Create unique window ID for this folder
            const uniqueId = `${id}-${Date.now()}`;
            const win = document.createElement('div');
            win.className = 'window';
            win.id = uniqueId;
            win.style.left = (100 + Math.random() * 50) + 'px';
            win.style.top = (80 + Math.random() * 50) + 'px';
            win.style.width = '900px';
            win.style.height = '550px';
            
            win.innerHTML = `
                <div class="win-header">
                    <div class="win-title">File Explorer</div>
                    <div class="win-controls">
                        <button class="win-btn win-minimize" title="تصغير">─</button>
                        <button class="win-btn win-maximize" title="تكبير">▢</button>
                        <button class="win-btn win-close" title="إغلاق">✕</button>
                    </div>
                </div>
                <div class="win-body">
                    <div class="folder-tabs-container">
                        <div class="folder-tabs-bar"></div>
                    </div>
                    <div class="folder-content"></div>
                </div>
            `;

            document.getElementById('windows').appendChild(win);
            makeDraggable(win);
            bringToFront(win);

            // apply transparency if setting enabled
            if(appSettings.windowTransparency) win.classList.add('transparent');

            // Apply no-animation class if animations are disabled
            if(!appSettings.enableAnimations) {
                win.classList.add('no-animation');
            }

            // ensure opacity variable set correctly too
            if(typeof applyWindowTransparency === 'function') applyWindowTransparency();

            // Controls
            win.querySelector('.win-close').addEventListener('click', () => { 
                if(appSettings.enableAnimations) {
                    win.classList.add('animate-exit');
                    setTimeout(() => {
                        folderTabs.delete(uniqueId);
                        win.remove(); 
                        removeTaskbarEntry(uniqueId);
                    }, 300);
                } else {
                    folderTabs.delete(uniqueId);
                    win.remove(); 
                    removeTaskbarEntry(uniqueId);
                }
            });
            win.querySelector('.win-minimize').addEventListener('click', () => { minimizeWindow(win); });
            win.querySelector('.win-maximize').addEventListener('click', (e) => { toggleMaximize(win); });

            initializeExplorer(win, uniqueId, info.key, info.title);
            createTaskbarEntry(uniqueId, 'File Explorer');
            return;
        }

        // Otherwise use tabbed mode (original behavior)
        const explorerWindow = document.getElementById('win-explorer');
        if(explorerWindow) {
            bringToFront(explorerWindow);
            explorerWindow.classList.remove('minimized');
            createNewFolderTab('win-explorer', info.key, info.title);
            renderFolderTabs(explorerWindow, 'win-explorer');
            updateFolderDisplay(explorerWindow, 'win-explorer');
            return;
        } else {
            openExplorer(info.key, info.title);
            return;
        }
    }

    // If window exists, bring to front
    const existing = document.getElementById(id);
    if(existing){
        bringToFront(existing);
        existing.classList.remove('minimized');
        return;
    }

    const win = document.createElement('div');
    win.className = 'window';
    if(appSettings.windowTransparency) win.classList.add('transparent');
    win.id = id;
    win.style.left = '100px';
    win.style.top = '80px';
    
    // Set larger default size for browser window
    if(id === 'win-browser') {
        win.style.width = '1000px';
        win.style.height = '600px';
    }
    win.innerHTML = `
        <div class="win-header">
            <div class="win-title">${titleFromId(id)}</div>
            <div class="win-controls">
                <button class="win-btn win-minimize" title="تصغير">─</button>
                <button class="win-btn win-maximize" title="تكبير">▢</button>
                <button class="win-btn win-close" title="إغلاق">✕</button>
            </div>
        </div>
        <div class="win-body">
            ${contentFromId(id)}
        </div>
    `;

    document.getElementById('windows').appendChild(win);
    makeDraggable(win);
    bringToFront(win);

    // Apply no-animation class if animations are disabled
    if(!appSettings.enableAnimations) {
        win.classList.add('no-animation');
    }

    // Controls
    win.querySelector('.win-close').addEventListener('click', () => { 
        if(appSettings.enableAnimations) {
            win.classList.add('animate-exit');
            setTimeout(() => {
                if(id === 'win-browser') browserTabs.delete(id);
                if(id === 'win-explorer') folderTabs.delete(id);
                win.remove(); 
                removeTaskbarEntry(id);
            }, 300);
        } else {
            if(id === 'win-browser') browserTabs.delete(id);
            if(id === 'win-explorer') folderTabs.delete(id);
            win.remove(); 
            removeTaskbarEntry(id);
        }
    });
    win.querySelector('.win-minimize').addEventListener('click', () => { minimizeWindow(win); });
    win.querySelector('.win-maximize').addEventListener('click', (e) => { toggleMaximize(win); });

    // Browser-specific initialization
    if(id === 'win-browser') {
        initializeBrowser(win, id);
    }

    // Explorer-specific initialization
    if(id === 'win-explorer') {
        initializeExplorer(win, id);
    }

    // Settings-specific initialization
    if(id === 'win-settings') {
        setupSettingsWindow(win);
    }

    // create or update taskbar entry with icon
    createTaskbarEntry(id, titleFromId(id));
}

function openExplorer(defaultCategory = 'programs', defaultTitle = 'البرامج') {
    const id = 'win-explorer';
    const existing = document.getElementById(id);
    if(existing){
        bringToFront(existing);
        existing.classList.remove('minimized');
        return;
    }

    const win = document.createElement('div');
    win.className = 'window';
    win.id = id;
    win.style.left = '100px';
    win.style.top = '80px';
    win.style.width = '900px';
    win.style.height = '550px';
    
    win.innerHTML = `
        <div class="win-header">
            <div class="win-title">File Explorer</div>
            <div class="win-controls">
                <button class="win-btn win-minimize" title="تصغير">─</button>
                <button class="win-btn win-maximize" title="تكبير">▢</button>
                <button class="win-btn win-close" title="إغلاق">✕</button>
            </div>
        </div>
        <div class="win-body">
            <div class="folder-tabs-container">
                <div class="folder-tabs-bar"></div>
            </div>
            <div class="folder-content"></div>
        </div>
    `;

    document.getElementById('windows').appendChild(win);
    makeDraggable(win);
    bringToFront(win);

    // Apply no-animation class if animations are disabled
    if(!appSettings.enableAnimations) {
        win.classList.add('no-animation');
    }

    // Controls
    win.querySelector('.win-close').addEventListener('click', () => { 
        if(appSettings.enableAnimations) {
            win.classList.add('animate-exit');
            setTimeout(() => {
                folderTabs.delete(id);
                win.remove(); 
                removeTaskbarEntry(id);
            }, 300);
        } else {
            folderTabs.delete(id);
            win.remove(); 
            removeTaskbarEntry(id);
        }
    });
    win.querySelector('.win-minimize').addEventListener('click', () => { minimizeWindow(win); });
    win.querySelector('.win-maximize').addEventListener('click', (e) => { toggleMaximize(win); });

    initializeExplorer(win, id, defaultCategory, defaultTitle);
    createTaskbarEntry(id, 'File Explorer');
}

function setupSettingsWindow(winEl) {
    // Setup animations toggle
    const animationsToggle = winEl.querySelector('#animationsToggle');
    if(animationsToggle) {
        animationsToggle.addEventListener('change', (e) => {
            appSettings.enableAnimations = e.target.checked;
            saveSettings();
        });
    }

    // Setup multiple windows toggle
    const multipleWindowsToggle = winEl.querySelector('#multipleWindowsToggle');
    if(multipleWindowsToggle) {
        multipleWindowsToggle.addEventListener('change', (e) => {
            appSettings.multipleExplorerWindows = e.target.checked;
            saveSettings();
        });
    }
}

function titleFromId(id){
    switch(id){
        case 'win-explorer': return 'File Explorer';
        case 'win-settings': return 'الإعدادات';
        case 'win-browser': return 'Web Browser';
        default: return 'نافذة';
    }
}

function contentFromId(id){
    // Generate HTML lists from projectsData
    function makeList(items, isWebsites = false){
        if(!items || !items.length) return '<p>لا توجد عناصر.</p>';
        let html = '<ul class="win-list">';
        items.forEach(it => {
            const img = it.image ? it.image : 'img/avatar.png';
            if(isWebsites) {
                html += `
                    <li class="win-list-item" data-url="${it.url}" data-title="${it.title}">
                        <img src="${img}" alt="${it.title}" class="win-item-icon">
                        <div class="win-item-meta">
                            <div class="win-item-title">${it.title}</div>
                            <div class="win-item-desc">${it.description}</div>
                        </div>
                        <div class="win-item-actions">
                            <button class="btn open-in-browser-btn">تصفح</button>
                        </div>
                    </li>
                `;
            } else {
                html += `
                    <li class="win-list-item">
                        <img src="${img}" alt="${it.title}" class="win-item-icon">
                        <div class="win-item-meta">
                            <div class="win-item-title">${it.title}</div>
                            <div class="win-item-desc">${it.description}</div>
                        </div>
                        <div class="win-item-actions">
                            <a href="${it.url}" target="_blank" rel="noopener" class="btn">تحميل</a>
                        </div>
                    </li>
                `;
            }
        });
        html += '</ul>';
        return html;
    }

    switch(id){
        case 'win-explorer': return `
            <div class="folder-tabs-container">
                <div class="folder-tabs-bar"></div>
            </div>
            <div class="folder-content"></div>
        `;
        case 'win-settings': return `
            <div style="padding: 20px; display: flex; flex-direction: column; gap: 20px;">
                <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 15px;">
                    <h3 style="margin-bottom: 15px; color: var(--text-color);">الإعدادات</h3>
                    
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; padding: 10px; border-radius: 8px; background: var(--card-bg);">
                        <label style="cursor: pointer; color: var(--text-color); display: flex; align-items: center; gap: 10px;">
                            <i class="fa-solid fa-film" style="color: var(--primary);"></i>
                            <span>تفعيل تأثيرات الحركة</span>
                        </label>
                        <input type="checkbox" id="animationsToggle" style="cursor: pointer; width: 20px; height: 20px;" ${appSettings.enableAnimations ? 'checked' : ''}>
                    </div>
                    
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; padding: 10px; border-radius: 8px; background: var(--card-bg);">
                        <label style="cursor: pointer; color: var(--text-color); display: flex; align-items: center; gap: 10px;">
                            <i class="fa-solid fa-window-maximize" style="color: var(--secondary);"></i>
                            <span>نوافذ متعددة للمجلد</span>
                        </label>
                        <input type="checkbox" id="multipleWindowsToggle" style="cursor: pointer; width: 20px; height: 20px;" ${appSettings.multipleExplorerWindows ? 'checked' : ''}>
                    </div>
                </div>
                
                <div style="padding: 10px; border-radius: 8px; background: rgba(8, 174, 234, 0.1); border-left: 3px solid var(--primary);">
                    <p style="font-size: 12px; color: var(--text-secondary);">
                        <strong>ملاحظة:</strong><br>
                        • تأثيرات الحركة: تفعيل/تعطيل أنيمشنز فتح وإغلاق النوافذ<br>
                        • فتح الروابط خارجياً: يزيد عالمية الروابط بـ‌<code>_blank</code><br>
                        • شفافية النوافذ: يجعل الخلفية شبه شفافة إذا كان مفعلًا<br>
                        • النوافذ المتعددة: فتح مجلد/متصفح جديد بدلاً من التبويبات
                        <br>• شريط السطوع يتحكم بسطوع الموقع
                    </p>
                </div>
            </div>
        `;
        case 'win-browser': return `
            <div class="browser-toolbar">
                <div class="browser-nav-buttons">
                    <button class="browser-nav-btn browser-back-btn" title="Back"><i class="fa-solid fa-chevron-left"></i></button>
                    <button class="browser-nav-btn browser-forward-btn" title="Forward"><i class="fa-solid fa-chevron-right"></i></button>
                    <button class="browser-nav-btn browser-refresh-btn" title="Refresh"><i class="fa-solid fa-rotate-right"></i></button>
                </div>
                <div class="browser-address-container">
                    <input type="text" class="browser-address-bar" placeholder="Enter URL or search..." value="about:blank">
                    <button class="browser-btn browser-go-btn" title="Go"><i class="fa-solid fa-arrow-right"></i></button>
                </div>
                <button class="browser-nav-btn browser-menu-btn" title="Menu"><i class="fa-solid fa-ellipsis"></i></button>
            </div>
            <div class="browser-tabs-container">
                <div class="browser-tabs-bar"></div>
                <button class="browser-new-tab-btn" title="New Tab"><i class="fa-solid fa-plus"></i></button>
                <button class="browser-websites-btn" title="Open Websites"><i class="fa-brands fa-chrome"></i></button>
            </div>
            <div class="browser-content"></div>
        `;
        default: return '<p>محتوى افتراضي.</p>';
    }
}

function initializeExplorer(winEl, windowId, defaultCategory = 'programs', defaultTitle = 'البرامج') {
    // always create initial folder content; tabs bar can be hidden when multiple windows enabled
    createNewFolderTab(windowId, defaultCategory, defaultTitle);
    renderFolderTabs(winEl, windowId);
    updateFolderDisplay(winEl, windowId);
    if(appSettings.multipleExplorerWindows){
        winEl.classList.add('no-tabs'); // hides the tabs container via CSS
    }
}

function renderFolderTabs(winEl, windowId) {
    const tabsBar = winEl.querySelector('.folder-tabs-bar');
    if(!tabsBar) return;
    tabsBar.innerHTML = '';
    const tabs = folderTabs.get(windowId) || [];
    tabs.forEach(tab => {
        const tabEl = document.createElement('div');
        tabEl.className = `folder-tab ${tab.isActive ? 'active' : ''}`;
        tabEl.dataset.folderTabId = tab.id;
        tabEl.innerHTML = `
            <span class="folder-tab-title">${tab.title}</span>
            <button class="folder-tab-close" data-tab-id="${tab.id}">✕</button>
        `;
        
        tabEl.querySelector('.folder-tab-title').addEventListener('click', () => {
            switchFolderTab(windowId, tab.id);
            renderFolderTabs(winEl, windowId);
            updateFolderDisplay(winEl, windowId);
        });
        
        tabEl.querySelector('.folder-tab-close').addEventListener('click', (e) => {
            e.stopPropagation();
            closeFolderTab(windowId, tab.id);
            renderFolderTabs(winEl, windowId);
            updateFolderDisplay(winEl, windowId);
        });
        
        tabsBar.appendChild(tabEl);
    });
}

function updateFolderDisplay(winEl, windowId) {
    const activeTab = (folderTabs.get(windowId) || []).find(t => t.isActive);
    if(!activeTab) return;
    
    const folderContent = winEl.querySelector('.folder-content');
    const category = activeTab.category;
    
    let items = [];
    let isWebsites = false;
    
    switch(category) {
        case 'programs':
            items = projectsData.programs;
            break;
        case 'games':
            items = projectsData.games;
            break;
        case 'websites':
            items = projectsData.websites;
            isWebsites = true;
            break;
        case 'sourceCode':
            items = projectsData.sourceCode;
            break;
    }
    
    folderContent.innerHTML = '';
    
    if(!items || items.length === 0) {
        folderContent.innerHTML = '<p>لا توجد عناصر.</p>';
        return;
    }
    
    let html = '<ul class="win-list">';
    items.forEach(it => {
        const img = it.image ? it.image : 'img/avatar.png';
        if(isWebsites) {
            html += `
                <li class="win-list-item" data-url="${it.url}" data-title="${it.title}">
                    <img src="${img}" alt="${it.title}" class="win-item-icon">
                    <div class="win-item-meta">
                        <div class="win-item-title">${it.title}</div>
                        <div class="win-item-desc">${it.description}</div>
                    </div>
                    <div class="win-item-actions">
                        <button class="btn open-in-browser-btn">تصفح</button>
                    </div>
                </li>
            `;
        } else {
            html += `
                <li class="win-list-item">
                    <img src="${img}" alt="${it.title}" class="win-item-icon">
                    <div class="win-item-meta">
                        <div class="win-item-title">${it.title}</div>
                        <div class="win-item-desc">${it.description}</div>
                    </div>
                    <div class="win-item-actions">
                        <a href="${it.url}" target="_blank" rel="noopener" class="btn">تحميل</a>
                    </div>
                </li>
            `;
        }
    });
    html += '</ul>';
    folderContent.innerHTML = html;
    
    // Setup browser button handlers for websites
    if(isWebsites) {
        folderContent.querySelectorAll('.open-in-browser-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const listItem = btn.closest('.win-list-item');
                if(!listItem) return;
                
                const url = listItem.dataset.url;
                const title = listItem.dataset.title;
                
                // Open or focus the browser window
                let browserWindow = document.getElementById('win-browser');
                if(!browserWindow) {
                    openDesktopWindow('win-browser');
                    browserWindow = document.getElementById('win-browser');
                } else {
                    bringToFront(browserWindow);
                    browserWindow.classList.remove('minimized');
                }
                
                // Add new tab with the website
                const newTab = createNewBrowserTab('win-browser', url);
                newTab.title = title;
                
                // Render tabs and update display
                setTimeout(() => {
                    const tabsBar = browserWindow.querySelector('.browser-tabs-bar');
                    const addressBar = browserWindow.querySelector('.browser-address-bar');
                    if(tabsBar && addressBar) {
                        renderBrowserTabs(browserWindow, 'win-browser');
                        updateBrowserDisplayForWindow(browserWindow, 'win-browser');
                    }
                }, 50);
            });
        });
    }
}

function initializeBrowser(winEl, windowId) {
    // always create fresh tab; hide bar if multiple windows flagged
    const firstTab = createNewBrowserTab(windowId, 'about:blank');
    if(appSettings.multipleExplorerWindows){
        winEl.classList.add('no-tabs');
    }
    
    const addressBar = winEl.querySelector('.browser-address-bar');
    const goBtn = winEl.querySelector('.browser-go-btn');
    const newTabBtn = winEl.querySelector('.browser-new-tab-btn');
    const websitesBtn = winEl.querySelector('.browser-websites-btn');
    const backBtn = winEl.querySelector('.browser-back-btn');
    const forwardBtn = winEl.querySelector('.browser-forward-btn');
    const refreshBtn = winEl.querySelector('.browser-refresh-btn');
    
    // Navigate to URL or search
    function navigateToUrl(input) {
        if(!input.trim()) return;
        
        let url = input.trim();
        
        // Check if it's a URL or search query
        const isUrl = /^(https?:\/\/|www\.|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/.test(url) || url.includes('.');
        
        if(!isUrl) {
            // It's a search query - search in Google
            url = `https://www.google.com/search?q=${encodeURIComponent(input)}`;
        } else {
            // Add protocol if missing
            if(!url.startsWith('http://') && !url.startsWith('https://')) {
                if(url.startsWith('www.')) {
                    url = 'https://' + url;
                } else {
                    url = 'https://' + url;
                }
            }
        }
        
        const activeTab = (browserTabs.get(windowId) || []).find(t => t.isActive);
        if(activeTab) {
            activeTab.url = url;
            try {
                activeTab.title = new URL(url).hostname;
            } catch(e) {
                activeTab.title = 'New Tab';
            }
        }
        
        renderBrowserTabs(winEl, windowId);
        updateBrowserDisplayForWindow(winEl, windowId);
    }
    
    // Event listeners
    goBtn.addEventListener('click', () => {
        navigateToUrl(addressBar.value);
    });
    
    addressBar.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') {
            navigateToUrl(addressBar.value);
            addressBar.blur();
        }
    });
    
    addressBar.addEventListener('focus', () => {
        addressBar.select();
    });
    
    newTabBtn.addEventListener('click', () => {
        const newTab = createNewBrowserTab(windowId, 'about:blank');
        renderBrowserTabs(winEl, windowId);
        updateBrowserDisplayForWindow(winEl, windowId);
    });
    
    // Navigation buttons
    if(refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            const iframe = winEl.querySelector('.browser-iframe');
            if(iframe) {
                iframe.src = iframe.src;
            }
        });
    }
    
    if(backBtn) {
        backBtn.addEventListener('click', () => {
            const iframe = winEl.querySelector('.browser-iframe');
            if(iframe) {
                // Simple history simulation
                const activeTab = (browserTabs.get(windowId) || []).find(t => t.isActive);
                if(activeTab && activeTab.url !== 'about:blank') {
                    activeTab.url = 'about:blank';
                    updateBrowserDisplayForWindow(winEl, windowId);
                }
            }
        });
    }
    
    if(forwardBtn) {
        forwardBtn.addEventListener('click', () => {
            // Forward button - typically disabled without history
        });
    }
    
    // Add websites button handler
    if(websitesBtn) {
        websitesBtn.addEventListener('click', () => {
            showWebsitesMenu(winEl, windowId);
        });
    }
    
    // Initial render
    renderBrowserTabs(winEl, windowId);
    updateBrowserDisplayForWindow(winEl, windowId);
}

// Placeholder for browser state (no longer saving to localStorage)
function saveBrowserState(windowId) {
    // Browser state is not persisted anymore
}

function showWebsitesMenu(winEl, windowId) {
    if(!projectsData.websites || projectsData.websites.length === 0) return;
    
    let menu = document.getElementById('websites-menu-' + windowId);
    if(menu) {
        menu.remove();
        return;
    }
    
    menu = document.createElement('div');
    menu.id = 'websites-menu-' + windowId;
    menu.className = 'websites-popup-menu';
    menu.innerHTML = `
        <ul class="websites-list">
            ${projectsData.websites.map(site => `
                <li class="websites-menu-item" data-url="${site.url}" data-title="${site.title}">
                    <div class="websites-menu-title">${site.title}</div>
                    <div class="websites-menu-desc">${site.description}</div>
                </li>
            `).join('')}
        </ul>
    `;
    
    winEl.querySelector('.win-body').appendChild(menu);
    
    menu.querySelectorAll('.websites-menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const url = item.dataset.url;
            const title = item.dataset.title;
            const newTab = createNewBrowserTab(windowId, url);
            newTab.title = title;
            
            const browserContent = winEl.querySelector('.browser-content');
            const tabsBar = winEl.querySelector('.browser-tabs-bar');
            const addressBar = winEl.querySelector('.browser-address-bar');
            
            // Render tabs and update display
            renderBrowserTabs(winEl, windowId);
            updateBrowserDisplayForWindow(winEl, windowId);
            menu.remove();
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function closeMenu(e) {
        if(menu && !menu.contains(e.target) && e.target.className !== 'browser-websites-btn') {
            if(menu.parentElement) menu.remove();
            document.removeEventListener('click', closeMenu);
        }
    });
}

function renderBrowserTabs(winEl, windowId) {
    const tabsBar = winEl.querySelector('.browser-tabs-bar');
    tabsBar.innerHTML = '';
    const tabs = browserTabs.get(windowId) || [];
    tabs.forEach(tab => {
        const tabEl = document.createElement('div');
        tabEl.className = `browser-tab ${tab.isActive ? 'active' : ''}`;
        tabEl.dataset.tabId = tab.id;
        tabEl.innerHTML = `
            <span class="browser-tab-title">${tab.title}</span>
            <button class="browser-tab-close" data-tab-id="${tab.id}">✕</button>
        `;
        
        tabEl.querySelector('.browser-tab-title').addEventListener('click', () => {
            switchBrowserTab(windowId, tab.id);
            renderBrowserTabs(winEl, windowId);
            updateBrowserDisplayForWindow(winEl, windowId);
        });
        
        tabEl.querySelector('.browser-tab-close').addEventListener('click', (e) => {
            e.stopPropagation();
            closeBrowserTab(windowId, tab.id);
            renderBrowserTabs(winEl, windowId);
            updateBrowserDisplayForWindow(winEl, windowId);
        });
        
        tabsBar.appendChild(tabEl);
    });
}

function updateBrowserDisplayForWindow(winEl, windowId) {
    const activeTab = (browserTabs.get(windowId) || []).find(t => t.isActive);
    if(!activeTab) return;
    
    const addressBar = winEl.querySelector('.browser-address-bar');
    const browserContent = winEl.querySelector('.browser-content');
    
    addressBar.value = activeTab.url;
    browserContent.innerHTML = '';
    
    if(activeTab.url === 'about:blank') {
        browserContent.innerHTML = `
            <div class="browser-blank-page">
                <div class="browser-home-container">
                    <div class="browser-logo-large">
                        <i class="fa-brands fa-chrome"></i>
                    </div>
                    <h1>Welcome to Browser</h1>
                    <p class="browser-subtitle">Enter a URL or search for something</p>
                    <div class="browser-quick-links">
                        <a href="#" class="quick-link" data-url="https://www.google.com">Google</a>
                        <a href="#" class="quick-link" data-url="https://www.youtube.com">YouTube</a>
                        <a href="#" class="quick-link" data-url="https://www.github.com">GitHub</a>
                        <a href="#" class="quick-link" data-url="https://www.stackoverflow.com">Stack Overflow</a>
                    </div>
                </div>
            </div>
        `;
        
        // Add quick links listeners
        browserContent.querySelectorAll('.quick-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const url = link.dataset.url;
                if(url) {
                    const addressBar = winEl.querySelector('.browser-address-bar');
                    const goBtn = winEl.querySelector('.browser-go-btn');
                    addressBar.value = url;
                    goBtn.click();
                }
            });
        });
    } else {
        browserContent.innerHTML = `
            <div class="browser-loading" style="display:none;">
                <div class="browser-spinner"></div>
                <p>Loading...</p>
            </div>
            <iframe src="${activeTab.url}" class="browser-iframe" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation" style="width:100%;height:100%;border:none;"></iframe>
        `;
    }
}

function bringToFront(el){
    // increase z-index to bring to front
    const max = [...document.querySelectorAll('.window')].reduce((m, w) => Math.max(m, Number(w.style.zIndex||0)), 0);
    el.style.zIndex = (max + 1) || 11;
}

function minimizeWindow(win){
    // If window is maximized, restore to previous size/position before minimizing
    if(win.classList.contains('maximized')){
        toggleMaximize(win); // will restore from maximized
    }

    // animate exit then hide
    if(appSettings.enableAnimations) {
        win.classList.add('animate-exit');
        win.addEventListener('animationend', function cb(){
            win.classList.remove('animate-exit');
            win.classList.add('minimized');
            win.removeEventListener('animationend', cb);
        });
    } else {
        win.classList.add('minimized');
    }

    createTaskbarEntry(win.id, win.querySelector('.win-title').textContent);
}

function createTaskbarEntry(id, title){
    // Avoid duplicates
    if(document.getElementById('tb-'+id)) return;
    const btn = document.createElement('button');
    btn.className = 'task-icon';
    btn.id = 'tb-'+id;
    // determine base id for icon mapping (e.g. win-projects-123 -> win-projects)
    const match = id.match(/^(win-[^\-]+)/);
    const base = match ? match[1] : id;
    // Use icon for the entry
    btn.innerHTML = iconForId(base);
    btn.addEventListener('click', ()=>{
        const w = document.getElementById(id);
        if(!w) return;
        if(w.classList.contains('minimized')){
            w.classList.remove('minimized');
            if(appSettings.enableAnimations) {
                w.classList.add('animate-enter');
                w.addEventListener('animationend', function cb(){
                    w.classList.remove('animate-enter');
                    w.removeEventListener('animationend', cb);
                });
            }
            bringToFront(w);
        } else {
            // minimize if already open
            minimizeWindow(w);
        }
    });
    // add into center area (as icon strip)
    const center = document.querySelector('.taskbar-center');
    if(center) center.appendChild(btn);
}

function iconForId(id){
    switch(id){
        case 'win-explorer': return '<i class="fa-solid fa-folder-open"></i>';
        case 'win-settings': return '<i class="fa-solid fa-gear"></i>';
        case 'win-browser': return '<i class="fa-brands fa-chrome"></i>';
        default: return '<i class="fa-solid fa-square-info"></i>';
    }
}

function toggleMaximize(win){
    if(win.classList.contains('maximized')){
        // restore to previous size
        win.classList.remove('maximized');
        win.style.left = win.dataset.prevLeft;
        win.style.top = win.dataset.prevTop;
        win.style.width = win.dataset.prevWidth;
        win.style.height = win.dataset.prevHeight;
    } else {
        // save current position and size
        win.dataset.prevLeft = win.style.left || '100px';
        win.dataset.prevTop = win.style.top || '80px';
        win.dataset.prevWidth = win.style.width || '640px';
        win.dataset.prevHeight = win.style.height || '420px';
        win.classList.add('maximized');
        win.style.left = '12px';
        win.style.top = '12px';
        win.style.width = 'calc(100% - 24px)';
        win.style.height = 'calc(100% - 120px)';
    }
}

function removeTaskbarEntry(id){
    const tb = document.getElementById('tb-'+id);
    if(tb) tb.remove();
}

function makeDraggable(win){
    const header = win.querySelector('.win-header');
    let isDown = false; let offsetX=0; let offsetY=0;
    header.addEventListener('mousedown', (e)=>{
        isDown = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
        header.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e)=>{
        if(!isDown) return;
        
        let newLeft = e.clientX - offsetX;
        let newTop = e.clientY - offsetY;
        
        // منع الخروج عن حدود الشاشة
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const winWidth = win.offsetWidth;
        const winHeight = win.offsetHeight;
        const taskbarHeight = 80; // ارتفاع شريط المهام
        const minPadding = 10; // حد أدنى من الحافة
        
        // الحد الأقصى للعلى - السماح ببعض الهامش من الأعلى
        if(newTop < minPadding) newTop = minPadding;
        
        // الحد الأقصى لليسار
        if(newLeft < minPadding) newLeft = minPadding;
        
        // الحد الأقصى لليمين (مع ترك مساحة لشريط المهام)
        if(newLeft + winWidth > screenWidth - minPadding) {
            newLeft = screenWidth - winWidth - minPadding;
        }
        
        // الحد الأقصى للأسفل (مع ترك مساحة لشريط المهام)
        if(newTop + winHeight > screenHeight - taskbarHeight - minPadding) {
            newTop = screenHeight - winHeight - taskbarHeight - minPadding;
        }
        
        win.style.left = `${newLeft}px`;
        win.style.top = `${newTop}px`;
    });
    document.addEventListener('mouseup', ()=>{ isDown=false; header.style.cursor='grab'; });
}

// Taskbar Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    const taskbarSearch = document.getElementById('taskbarSearch');
    const startSearch = document.getElementById('startSearch');
    const startMenu = document.getElementById('startMenu');
    const startList = document.getElementById('startSearchResultsList');
    
    if(taskbarSearch && startSearch && startList) {
        taskbarSearch.addEventListener('focus', function() {
            // Open start menu when search box is focused
            if(startMenu.classList.contains('hidden')) {
                startMenu.classList.remove('hidden');
            }
        });
        
        taskbarSearch.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase().trim();
            
            // Open start menu if not open
            if(startMenu.classList.contains('hidden')) {
                startMenu.classList.remove('hidden');
            }
            
            // Update the startSearch input to match taskbar search
            startSearch.value = query;
            
            // Clear results list
            startList.innerHTML = '';
            
            if(!query) {
                // Show default grid if search is empty
                const startGrid = document.querySelector('.start-grid');
                if(startGrid) startGrid.style.display = 'grid';
                return;
            }
            
            // Hide default grid when searching
            const startGrid = document.querySelector('.start-grid');
            if(startGrid) startGrid.style.display = 'none';
            
            // Perform search
            const matches = [];
            const collect = (items, category) => {
                if(!items) return;
                items.forEach(it => {
                    if((it.title && it.title.toLowerCase().includes(query)) || 
                       (it.keywords && it.keywords.toLowerCase().includes(query)) ||
                       (it.description && it.description.toLowerCase().includes(query))) {
                        matches.push({item: it, category});
                    }
                });
            };
            
            collect(projectsData.programs, 'programs');
            collect(projectsData.games, 'games');
            collect(projectsData.websites, 'websites');
            collect(projectsData.sourceCode, 'sourceCode');

            if(matches.length === 0) {
                startList.innerHTML = '<div class="no-results" style="padding: 20px; text-align: center; color: var(--text-secondary);">لم يتم العثور على نتائج</div>';
                return;
            }

            matches.forEach(m => {
                const row = document.createElement('div');
                row.className = 'start-search-item';
                const img = document.createElement('img');
                img.src = m.item.image || 'img/avatar.png';
                const info = document.createElement('div');
                const categoryMap = {'programs': 'برامج', 'games': 'ألعاب', 'websites': 'مواقع', 'sourceCode': 'سورس كود'};
                const categoryDisplay = categoryMap[m.category] || m.category;
                info.innerHTML = `<div class="s-title">${m.item.title}</div><div class="s-meta">${categoryDisplay}</div>`;
                const action = document.createElement('div');
                action.innerHTML = `<a class="btn" href="${m.item.url}" target="_blank" rel="noopener">تحميل</a>`;
                row.appendChild(img);
                row.appendChild(info);
                row.appendChild(action);
                row.addEventListener('click', () => {
                    // open the relevant window category
                    const map = {programs:'win-projects', games:'win-games', websites:'win-websites', sourceCode:'win-source'};
                    const winId = map[m.category];
                    if(winId) openDesktopWindow(winId);
                });
                startList.appendChild(row);
            });
        });
        
        // Close start menu and clear search when pressing Escape
        taskbarSearch.addEventListener('keydown', function(e) {
            if(e.key === 'Escape') {
                taskbarSearch.value = '';
                startSearch.value = '';
                if(!startMenu.classList.contains('hidden')) toggleStartMenu();
                startList.innerHTML = '';
                const startGrid = document.querySelector('.start-grid');
                if(startGrid) startGrid.style.display = 'grid';
                taskbarSearch.blur();
            }
        });
        
        // Sync startSearch input with taskbarSearch
        startSearch.addEventListener('input', function(e) {
            taskbarSearch.value = this.value;
            taskbarSearch.dispatchEvent(new Event('input'));
        });
    }
});

// Show Social Media Modal
function showSocialMediaModal() {
    // Remove existing modal if any
    const existingModal = document.getElementById('socialMediaModal');
    if(existingModal) existingModal.remove();
    
    // Check if dark mode is enabled
    const isDarkMode = !document.body.classList.contains('light-mode');
    
    const modal = document.createElement('div');
    modal.id = 'socialMediaModal';
    modal.className = 'social-media-modal';
    
    // Colors based on theme
    const bgColor = isDarkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(249, 250, 251, 0.95)';
    const borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const textColor = isDarkMode ? '#fff' : '#1f2937';
    const secondaryText = isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(31, 41, 55, 0.7)';
    const hoverBg = isDarkMode ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.1)';
    const hoverBgHover = isDarkMode ? 'rgba(102, 126, 234, 0.5)' : 'rgba(102, 126, 234, 0.2)';
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;
    
    const container = document.createElement('div');
    container.style.cssText = `
        background: linear-gradient(135deg, ${bgColor} 0%, ${isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(243, 244, 246, 0.95)'} 100%);
        border: 1px solid ${borderColor};
        border-radius: 20px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
    `;
    
    // Header
    const header = document.createElement('div');
    header.style.cssText = `
        text-align: center;
        margin-bottom: 30px;
        border-bottom: 2px solid ${borderColor};
        padding-bottom: 20px;
    `;
    
    const title = document.createElement('h2');
    title.textContent = 'تواصل معي';
    title.style.cssText = `
        color: ${textColor};
        margin: 0;
        font-size: 28px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: bold;
    `;
    header.appendChild(title);
    
    // Social Links Grid
    const linksGrid = document.createElement('div');
    linksGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
    `;
    
    socialMediaLinks.forEach(link => {
        const linkBtn = document.createElement('a');
        linkBtn.href = link.url;
        linkBtn.target = '_blank';
        linkBtn.rel = 'noopener noreferrer';
        linkBtn.title = link.label;
        
        const initialStyle = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 15px;
            background: ${hoverBg};
            border: 1px solid rgba(102, 126, 234, 0.3);
            border-radius: 12px;
            color: ${textColor};
            text-decoration: none;
            transition: all 0.3s ease;
            font-size: 12px;
            text-align: center;
        `;
        
        linkBtn.style.cssText = initialStyle;
        
        linkBtn.addEventListener('mouseenter', () => {
            linkBtn.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 15px;
                background: ${hoverBgHover};
                border: 1px solid rgba(102, 126, 234, 0.6);
                border-radius: 12px;
                color: ${textColor};
                text-decoration: none;
                transition: all 0.3s ease;
                font-size: 12px;
                text-align: center;
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
            `;
        });
        
        linkBtn.addEventListener('mouseleave', () => {
            linkBtn.style.cssText = initialStyle;
        });
        
        const icon = document.createElement('i');
        icon.className = link.icon;
        icon.style.fontSize = '24px';
        
        const label = document.createElement('span');
        label.textContent = link.label;
        label.style.cssText = 'font-size: 11px; font-weight: 500;';
        
        linkBtn.appendChild(icon);
        linkBtn.appendChild(label);
        linksGrid.appendChild(linkBtn);
    });
    
    // Close Button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'إغلاق';
    
    const closeBtnInitialStyle = `
        width: 100%;
        padding: 12px;
        margin-top: 20px;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
        border: 1px solid rgba(102, 126, 234, 0.5);
        border-radius: 10px;
        color: ${textColor};
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: bold;
    `;
    
    closeBtn.style.cssText = closeBtnInitialStyle;
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.5) 0%, rgba(118, 75, 162, 0.5) 100%)';
        closeBtn.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.3)';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)';
        closeBtn.style.boxShadow = 'none';
    });
    
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    container.appendChild(header);
    container.appendChild(linksGrid);
    container.appendChild(closeBtn);
    modal.appendChild(container);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if(e.target === modal) {
            modal.remove();
        }
    });
    
    document.body.appendChild(modal);
    
    // Add animation
    container.style.animation = 'slideUp 0.4s ease-out';
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}
