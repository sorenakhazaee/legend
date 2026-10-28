// ============================================================
// زادروز — افسانه‌ی لیان
// مرحله: ساخت محیط کوهستانی
//
// وضعیت فعلی:
// ☀️ نسخه‌ی روز روشن برای بررسی شکل واقعی محیط
//
// اصلاحات این مرحله:
// 1. هر کوه یک گروه مستقل است.
// 2. هر کوه می‌تواند حول محور عمودی خودش بچرخد.
// 3. مختصات هندسی کوه محلی شده تا چرخش صحیح باشد.
// 4. محدوده دید دوربین افزایش یافته است.
// 5. مه صحنه ضعیف شده تا کوه‌ها در فاصله زیاد ناپدید نشوند.
// 6. صفحه زمین کنترل شده تا ظاهر «سطح آبی» ایجاد نکند.
// ============================================================

import * as THREE from 'three';

import { GLTFLoader } from
    'three/addons/loaders/GLTFLoader.js';

import { MeshoptDecoder } from
    'three/addons/libs/meshopt_decoder.module.js';

// ============================================================
// 1) اتصال به صفحه
// ============================================================

const app =
    document.getElementById('app');


// ============================================================
// صفحهٔ آغاز افسانهٔ لیان
// ============================================================

const introOverlay = document.createElement('div');

introOverlay.id = 'lian-intro-overlay';

Object.assign(introOverlay.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '10000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    background: '#080b12',
    color: '#fff',
    fontFamily: 'Tahoma, sans-serif',
    textAlign: 'center'
});

// تصویر اصلی صفحهٔ آغاز
const introImage = document.createElement('img');

introImage.src = encodeURI(
    './Photo/Legend of Lian_ Mountain Dawn.png'
);

introImage.alt = 'طلوع خورشید در کوهستان افسانهٔ لیان';

Object.assign(introImage.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    background: '#080b12'
});

introOverlay.appendChild(introImage);

// لایهٔ تیره برای خوانایی نوشته‌ها
const introShade = document.createElement('div');

Object.assign(introShade.style, {
    position: 'absolute',
    inset: '0',
    background:
        'linear-gradient(to bottom, rgba(0,0,0,.12), rgba(0,0,0,.72))'
});

introOverlay.appendChild(introShade);

// محتوای صفحه
const introContent = document.createElement('div');

Object.assign(introContent.style, {
    position: 'relative',
    zIndex: '1',
    width: 'min(90%, 720px)',
    padding: '32px 20px'
});

const introTitle = document.createElement('h1');

introTitle.textContent = 'زادروز — افسانهٔ لیان';

Object.assign(introTitle.style, {
    fontSize: 'clamp(28px, 5vw, 48px)',
    lineHeight: '1.7',
    marginBottom: '12px',
    textShadow: '0 3px 18px #000'
});

const introMessage = document.createElement('p');

introMessage.textContent =
    'دو راوی از دل افسانه‌ها، داستانی را برای تو آورده‌اند.';

Object.assign(introMessage.style, {
    fontSize: 'clamp(15px, 2.5vw, 21px)',
    lineHeight: '2',
    marginBottom: '28px',
    textShadow: '0 2px 10px #000'
});

const introButton = document.createElement('button');

introButton.type = 'button';
introButton.textContent = 'شنیدن معرفی گردآفرید و هیربد';

Object.assign(introButton.style, {
    border: '1px solid rgba(255,230,180,.8)',
    borderRadius: '12px',
    padding: '14px 24px',
    background: 'rgba(30, 27, 24, .82)',
    color: '#ffe6b4',
    fontSize: '16px',
    fontFamily: 'inherit',
    cursor: 'pointer'
});

const introStatus = document.createElement('p');

Object.assign(introStatus.style, {
    minHeight: '32px',
    marginTop: '20px',
    fontSize: '15px',
    lineHeight: '2',
    color: '#fff0d0'
});

introContent.append(
    introTitle,
    introMessage,
    introButton,
    introStatus
);

introOverlay.appendChild(introContent);
app.appendChild(introOverlay);

// ============================================================
// پخش ترتیبی فایل‌های صوتی معرفی
// ============================================================

const introAudioFiles = [
    '001_scene_intro_gordafarid.mp3',
    '002_scene_intro_hirbod.mp3',
    '003_scene_intro_gordafarid.mp3',
    '004_scene_intro_hirbod.mp3',
    '005_scene_intro_gordafarid.mp3',
    '006_scene_intro_gordafarid.mp3'
];

let introAudioIndex = 0;
let introAudio = null;

function playNextIntroAudio() {
    if (introAudioIndex >= introAudioFiles.length) {
        introCompleted = true;

        introStatus.textContent =
            'معرفی تمام شد. برای آغاز افسانه، کلید Enter را بزن.';

        introButton.textContent = 'آماده‌ام؛ شروع افسانه';
        introButton.disabled = false;

        return;
    }

    const fileName = introAudioFiles[introAudioIndex];

    introStatus.textContent =
        `در حال پخش معرفی ${introAudioIndex + 1} از ${introAudioFiles.length}`;

    introButton.disabled = true;

    introAudio = new Audio(
        encodeURI(`./narration/voices/آغاز/${fileName}`)
    );

    introAudio.addEventListener('ended', () => {
        introAudioIndex++;
        playNextIntroAudio();
    }, { once: true });

    introAudio.addEventListener('error', () => {
        console.error(
            'خطا در بارگذاری فایل معرفی:',
            fileName
        );

        introStatus.textContent =
            `فایل صوتی بارگذاری نشد: ${fileName}`;

        introButton.textContent = 'تلاش دوباره برای پخش';
        introButton.disabled = false;
    }, { once: true });

    introAudio.play().catch((error) => {
        console.error('پخش صوت شروع نشد:', error);

        introStatus.textContent =
            'پخش صوت انجام نشد. دوباره دکمه را بزن.';

        introButton.textContent = 'تلاش دوباره برای پخش';
        introButton.disabled = false;
    });
}

introButton.addEventListener('click', () => {
    // اگر معرفی تمام شده، دکمه شروع فیلم را آماده می‌کند؛
    // شروع واقعی داستان با Enter انجام می‌شود.
    if (introCompleted) {
        introStatus.textContent =
            'برای آغاز افسانه، کلید Enter را بزن.';
        return;
    }

    if (introStarted && introAudio && !introAudio.paused) {
        return;
    }

    introStarted = true;
    playNextIntroAudio();
});



let storyAudioIndex = 0;
let storyAudio = null;
let storyAudioStarted = false;

function playNextStoryAudio() {
    if (storyAudioIndex >= storyAudioFiles.length) {
        console.info('تمام صداهای داستان پخش شدند.');
        storyAudio = null;
        return;
    }

    const item = storyAudioFiles[storyAudioIndex];

    storyAudio = new Audio(
        encodeURI(`./narration/voices/${item.folder}/${item.file}`)
    );

    storyAudio.addEventListener('ended', () => {
        storyAudioIndex++;
        playNextStoryAudio();
    }, { once: true });

    storyAudio.addEventListener('error', () => {
        console.error('خطا در بارگذاری فایل صوتی:', item.file);
    }, { once: true });

    storyAudio.play().catch((error) => {
        console.error('پخش صدای داستان شروع نشد:', error);
    });
}

function startStoryAudio() {
    if (storyAudioStarted) return;

    storyAudioStarted = true;
    storyAudioIndex = 0;
    playNextStoryAudio();
}


function startActOneAudio() {
    if (actOneAudioStarted) return;

    actOneAudioStarted = true;
    storyAudioIndex = 0;
    playNextActOneAudio();
}


// ============================================================
// شروع رسمی داستان با Enter
// ============================================================

window.addEventListener('keydown', (event) => {
    if (
        event.key !== 'Enter' ||
        !introCompleted ||
        storyStarted
    ) {
        return;
    }

    event.preventDefault();

    storyStarted = true;
    startBackgroundMusic();
    resetFilmVoicePlayback();
    storyStartTimestamp = performance.now();
    storyElapsedTime = 0;

    if (introAudio) {
        introAudio.pause();
        introAudio = null;
    }

    introOverlay.remove();

    startStoryAudio();

    console.info('افسانهٔ لیان از زمان صفر آغاز شد.');
});

// ============================================================
// 2) رنگ آسمان
// ============================================================

const SKY_COLOR =
    0x87CEEB;


// ============================================================
// 3) ساخت صحنه
// ============================================================

const scene =
    new THREE.Scene();

// رنگ آسمان در آغاز افسانه و هنگام طلوع
const SKY_COLOR_DARK = 0x050914;

const skyColorDark = new THREE.Color(SKY_COLOR_DARK);
const skyColorDay = new THREE.Color(SKY_COLOR);

scene.background = skyColorDark.clone();
scene.fog = new THREE.FogExp2(SKY_COLOR_DARK, 0.000015);

// ============================================================
// کنترل مرکزی رنگ طبیعت در داستان
// ============================================================

const natureColorTargets = [];

// دسترسی مشترک به شخصیت‌های بارگذاری‌شده برای کارگردان داستان
const loadedCharacters = new Map();

function registerNatureColorTarget(mesh, type) {
    if (!mesh) return;

    natureColorTargets.push({
        mesh,
        type
    });
}

// ============================================================
// 4) مه
//
// مه را خیلی ضعیف کرده‌ایم.
// در فاصله‌های زیاد، مه قبلی باعث می‌شد
// کوه‌ها تقریباً در آسمان محو شوند.
// ============================================================

scene.fog =
    new THREE.FogExp2(
        SKY_COLOR,
        0.000015
    );


// ============================================================
// 5) دوربین
//
// far قبلاً 10000 بود.
// وقتی از کوه‌ها خیلی دور می‌شدیم، بخش‌هایی
// از جهان از محدوده دید دوربین خارج می‌شدند.
//
// اکنون محدوده دید بسیار بزرگ‌تر است.
// ============================================================

const camera =
    new THREE.PerspectiveCamera(
        25,
        window.innerWidth /
        window.innerHeight,
        0.1,
        100000
    );



/**
 * چرخاندن دوربین حول محور Y
 * زاویه بر حسب درجه است.
 */
function rotateCameraY(degrees) {
    camera.rotation.y += THREE.MathUtils.degToRad(degrees);
}



// ============================================================
// 6) موقعیت اولیه دوربین
// ============================================================

camera.position.set(
    0,
    1500,
    2000
);

camera.rotation.set(
    -0.10,
    THREE.MathUtils.degToRad(70),
    0
);

// ============================================================
// 7) Renderer
// ============================================================

const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: 'default'
});

// کاهش وضوح رندر برای کنترل مصرف حافظهٔ گرافیکی
renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 1.25)
);

renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

renderer.shadowMap.enabled =
    true;

app.appendChild(
    renderer.domElement
);


/**
 * بارگذاری مدل سه‌بعدی GLB
 * اندازه و جایگاه شخصیت پس از بارگذاری تنظیم می‌شود.
 */
function loadCharacterGLB({
    path,
    x = -680,
    y = 12,
    z = 6656,
    targetHeight = 160,

    // زاویه چرخش مدل بر حسب درجه
    rotationX = 0,
    rotationY = 0,
    rotationZ = 0
}) {
    const loader = new GLTFLoader();


    loader.setMeshoptDecoder(MeshoptDecoder);

    loader.load(
        path,

        (gltf) => {
            const character = gltf.scene;

            // تبدیل زاویه‌های درجه به رادیان و تنظیم چرخش مدل
            character.rotation.set(
                THREE.MathUtils.degToRad(rotationX),
                THREE.MathUtils.degToRad(rotationY),
                THREE.MathUtils.degToRad(rotationZ)
            );
            // نگه‌داری مدل بر اساس نام فایل برای دسترسی در مراحل بعد
            const characterName = path.split('/').pop().replace('.glb', '');

            // اندازه‌گیری اولیه مدل
            const bounds = new THREE.Box3()
                .setFromObject(character);

            const size = bounds.getSize(
                new THREE.Vector3()
            );

            if (size.y <= 0) {
                console.error(
                    'ارتفاع مدل معتبر نیست:',
                    path
                );
                return;
            }

            // تنظیم ارتفاع مدل با حفظ تناسبات
            character.scale.multiplyScalar(
                targetHeight / size.y
            );

            // محاسبه مجدد محدوده مدل
            bounds.setFromObject(character);

            // قرار دادن کف مدل روی سطح محلی زمین
            character.position.y -= bounds.min.y;

            // تعیین موقعیت در جهان
            character.position.x += x;
            character.position.y += y;
            character.position.z += z;

            // فعال‌کردن سایه‌ها
            character.traverse((object) => {
                if (object.isMesh) {
                    object.castShadow = true;
                    object.receiveShadow = true;
                }
            });

            // افزودن مدل به صحنه
            scene.add(character);

            loadedCharacters.set(characterName, character);

            console.log(
                'شخصیت با موفقیت بارگذاری شد:',
                path
            );

            console.log(
                'اندازه مدل:',
                new THREE.Box3()
                    .setFromObject(character)
                    .getSize(new THREE.Vector3())
            );
        },

        undefined,

        (error) => {
            console.error(
                'خطا در بارگذاری شخصیت:',
                path,
                error
            );
        }
    );
}


/**
 * بارگذاری مدل سه‌بعدی وسایل خانه
 * اندازه و جایگاه هر وسیله به‌صورت مستقل تنظیم می‌شود.
 */
function loadHouseGLB({
    path,
    x = 0,
    y = 0,
    z = 0,
    targetHeight = 100,
    rotationY = 0
}) {
    const loader = new GLTFLoader();

    loader.setMeshoptDecoder(MeshoptDecoder);

    loader.load(
        path,

        (gltf) => {
            const model = gltf.scene;

            // اندازه‌گیری اولیه مدل
            const bounds = new THREE.Box3()
                .setFromObject(model);

            const size = bounds.getSize(
                new THREE.Vector3()
            );

            if (size.y <= 0) {
                console.error(
                    'ارتفاع مدل وسیله معتبر نیست:',
                    path
                );
                return;
            }

            // تنظیم ارتفاع با حفظ تناسبات
            model.scale.multiplyScalar(
                targetHeight / size.y
            );

            // محاسبه مجدد محدوده مدل
            bounds.setFromObject(model);

            // قرار دادن کف مدل روی سطح کف چوبی
            model.position.y -= bounds.min.y;

            // تنظیم ارتفاع نهایی وسیله
            model.position.y += houseBaseY + 8 + y;

            // تعیین موقعیت افقی
            model.position.x += x;
            model.position.z += z;

            // تنظیم جهت وسیله
            model.rotation.y = rotationY;

            // فعال‌کردن سایه‌ها
            model.traverse((object) => {
                if (object.isMesh) {
                    object.castShadow = true;
                    object.receiveShadow = true;
                }
            });

            // افزودن وسیله به صحنه
            houseGroup.add(model);

            console.log(
                'وسیله با موفقیت بارگذاری شد:',
                path
            );

            console.log(
                'ابعاد وسیله:',
                new THREE.Box3()
                    .setFromObject(model)
                    .getSize(new THREE.Vector3())
            );
        },

        undefined,

        (error) => {
            console.error(
                'خطا در بارگذاری وسیله:',
                path,
                error
            );
        }
    );
}


/**
 * چیدمان اولیه وسایل طبقه پایین
 * مختصات محلی خانه هستند و بعداً قابل تنظیم‌اند.
 */

// فرش؛ مرکز اتاق
loadHouseGLB({
    path: './models/rug.glb',
    x: 0,
    z: 1,
    targetHeight: 1
});

// شومینه؛ نزدیک دیوار پشتی
loadHouseGLB({
    path: './models/fireplace.glb',
    x: 115,
    z: -115,
    targetHeight: 90
});

// مبل گوشه‌ای؛ سمت چپ اتاق
loadHouseGLB({
    path: './models/corner-sofa.glb',
    x: -45,
    z: -50,
    targetHeight: 45,
    rotationY: Math.PI / 1.9
});

// قفسه کتاب؛ نزدیک دیوار چپ
loadHouseGLB({
    path: './models/binder-shelf.glb',
    x: -145,
    z: -65,
    targetHeight: 95,
    rotationY: Math.PI / 2
});

// چراغ ایستاده؛ کنار مبل
loadHouseGLB({
    path: './models/floor-lamp.glb',
    x: -115,
    z: -110,
    targetHeight: 65
});

// ساعت
loadHouseGLB({
    path: './models/wall-clock.glb',
    x: -100,
    y:  120,
    z: -125,
    targetHeight: 35
});

// گهواره؛ سمت راست اتاق
loadHouseGLB({
    path: './models/gahvarh.glb',
    x: 130,
    z: -30,
    targetHeight: 35,
    rotationY: Math.PI / 2
});

// نور گرم و آرام لحظه تولد نورسا
const norsaBirthLight = new THREE.PointLight(
    0xffbd78,
    -3000,
    3000,
    1100
);

norsaBirthLight.position.set(100, 1800, 2700);
scene.add(norsaBirthLight);

// افزایش تدریجی نور در صحنه تولد
function updateNorsaBirthLight(progress) {
    const t = THREE.MathUtils.clamp(
        (progress - 0.35) / 0.35,
        0,
        1
    );

    const smooth = t * t * (3 - 2 * t);

    norsaBirthLight.intensity = smooth * 2.2;
}

// چراغ سقفی
loadHouseGLB({
    path: './models/ceiling-lamp.glb',
    x: 0,
    z: -40,
    y:  130,
    targetHeight: 45,

});

// بارگذاری مادر نورسا
loadCharacterGLB({
    path: './models/Mother_Pregnant.glb',
    x: 130,
    y: 1715,
    z: 2430,
    targetHeight: 100
});


 // بارگذاری پدر نورسا
loadCharacterGLB({
    path: './models/Father.glb',
    x: 90,
    y: 1715,
    z: 2450,
    targetHeight: 100
});

 // بارگذاری آنیل
loadCharacterGLB({
    path: './models/anil.glb',
    x: -50000,
    y: 10,
    z: 50000,
    targetHeight: 100
});

 // بارگذاری چمروش
loadCharacterGLB({
    path: './models/chamrosh.glb',
    x: -50000,
    y: 10,
    z: 50000,
    targetHeight: 350
});

loadCharacterGLB({
    path: './models/chamrosh.glb',
    x: -50000,
    y: 10,
    z: 50000,
    targetHeight: 350,

    // نمونه: چرخش ۹۰ درجه حول محور عمودی
    rotationY: 90
});

 // بارگذاری نورسا
loadCharacterGLB({
    path: './models/norsa.glb',
    x: -50000,
    y: 10,
    z: 50000,
    targetHeight: 15,
    rotationX: -90
});

// بارگذاری سورنا
loadCharacterGLB({
    path: './models/sorena.glb',
    x: -450,
    y: 10,
    z: 6600,
    targetHeight: 50
});


// بارگذاری مادر سورنا
loadCharacterGLB({
    path: './models/mother-sorena.glb',
    x: -400,
    y: 10,
    z: 6600,
    targetHeight: 100
});

// بارگذاری پیرمرد
loadCharacterGLB({
    path: './models/old-man.glb',
    x: -450,
    y: 10,
    z: 6400,
    targetHeight: 100
});


// بارگذاری مرد
loadCharacterGLB({
    path: './models/man.glb',
    x: -400,
    y: 10,
    z: 6400,
    targetHeight: 110
});

// ============================================================
// بارگذاری ۲۶ شخصیت مردم در میدان
// ============================================================

const peopleCount = 19;

// فاصلهٔ بین شخصیت‌ها
const peopleSpacing = 180;

// نقطهٔ شروع میدان
const peopleStartX = -1000;
const peopleStartZ = 6000;

// تعداد ستون‌های میدان
const peopleColumns = 7;

for (let i = 1; i <= peopleCount; i++) {
    const index = i - 1;

    // چیدمان ردیفی در میدان
    const column = index % peopleColumns;
    const row = Math.floor(index / peopleColumns);

    const x = peopleStartX + column * peopleSpacing;
    const z = peopleStartZ + row * peopleSpacing;

    loadCharacterGLB({
        path: `./models/${i}.glb`,
        x: x,
        y: 10,
        z: z,
        targetHeight: 100
    });
}

// ============================================================
// 8) نور محیط
// ============================================================

const AMBIENT_LIGHT_FINAL = 2.2;
const SUN_LIGHT_FINAL = 3.0;

const AMBIENT_LIGHT_DRY = 0.08;
const SUN_LIGHT_DRY = 0.25;

// شروع بازگشت نور پس از تولد نورسا
const LIGHT_RETURN_START_SECONDS = 145;

// مدت روشن‌شدن تدریجی جهان
const LIGHT_RETURN_DURATION_SECONDS = 50;

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        AMBIENT_LIGHT_DRY
    );

scene.add(ambientLight);

// ============================================================
// 9) نور خورشید
// ============================================================

const sunLight =
    new THREE.DirectionalLight(
        0xffffff,
        1.2
    );

sunLight.position.set(
    -800,
    1200,
    500
);

sunLight.castShadow =
    true;

scene.add(
    sunLight
);


// ============================================================
// 10) دو صفحه‌ی اصلی محیط
//
// در این مرحله زمین پیچیده نداریم.
// دو صفحه‌ی ساده فقط برای ساخت بستر محیط استفاده می‌شوند.
//
// صفحه اول:
// بخش اصلی محیط و محل قرارگیری روستاها
//
// صفحه دوم:
// بخش دورتر محیط و فضای طبیعی
// ============================================================


// ============================================================
// صفحه اول — محیط اصلی
// ============================================================

const mainGroundGeometry =
    new THREE.PlaneGeometry(
        20000,
        9500,
        1000,
        100
    );


// ============================================================
// پستی و بلندی منطقه جلوی کوه
//
// این ناهمواری فقط روی mainGround ایجاد می‌شود.
// بخش‌های دیگر زمین فعلاً صاف باقی می‌مانند.
// ============================================================

const mainGroundPositions =
    mainGroundGeometry.attributes.position;


for (
    let i = 0;
    i < mainGroundPositions.count;
    i++
) {

    const x =
        mainGroundPositions.getX(i);

    const z =
        -mainGroundPositions.getY(i);


    // --------------------------------------------------------
    // منطقه ناهموار
    //
    // این منطقه در بخش بالایی mainGround قرار دارد؛
    // یعنی نزدیک‌تر به کوه اصلی.
    // --------------------------------------------------------

    const mountainZone =
        z > 1800;


    if (
        mountainZone
    ) {

        // موج بزرگ و نرم
        const largeWave =
            Math.sin(
                x * 0.004
            ) *
            Math.cos(
                z * 0.005
            ) *
            120;


        // موج دوم برای طبیعی‌تر شدن سطح
        const mediumWave =
            Math.sin(
                x * 0.011 +
                z * 0.008
            ) *
            45;


        // موج کوچک
        const smallWave =
            Math.sin(
                x * 0.025 +
                z * 0.018
            ) *
            12;


        const height =
            largeWave +
            mediumWave +
            smallWave;


        mainGroundPositions.setZ(
            i,
            height
        );
    }
}

// ============================================================
// محاسبه Normalها بعد از ایجاد پستی و بلندی
// ============================================================

mainGroundGeometry.computeVertexNormals();

// ============================================================
// ساخت صفحه اصلی محیط
// ============================================================

const mainGroundMaterial =
    new THREE.MeshStandardMaterial({

        color: 0xA5ADA0,

        roughness: 1,

        metalness: 0,

        side:
            THREE.DoubleSide
    });


const mainGround =
    new THREE.Mesh(
        mainGroundGeometry,
        mainGroundMaterial
    );


// تبدیل صفحه به سطح XZ
mainGround.rotation.x =
    -Math.PI / 2;


// دریافت سایه کوه‌ها و سایر اجسام
mainGround.receiveShadow =
    true;


// اضافه کردن صفحه اصلی به صحنه
scene.add(
    mainGround
);

// ثبت زمین اصلی برای سبز شدن تدریجی
mainGround.userData.dryColor =
    mainGroundMaterial.color.clone();

mainGround.userData.greenColor =
    new THREE.Color('#789B62');

registerNatureColorTarget(
    mainGround,
    'ground'
);

// ============================================================
// صفحه دوم — محیط نزدیک
// ============================================================

const frontGroundGeometry =
    new THREE.PlaneGeometry(
        22000,
        10500
    );


const frontGroundMaterial =
    new THREE.MeshStandardMaterial({

        color: 0xA5ADA0,

        roughness: 1,

        metalness: 0,

        side:
            THREE.DoubleSide
    });


const frontGround =
    new THREE.Mesh(
        frontGroundGeometry,
        frontGroundMaterial
    );

// قرارگیری دقیق زمین در راستای افقی
frontGround.rotation.x = -Math.PI / 2;

// زمین اصلی محیط در ارتفاع پایین‌تر از مسیرها قرار می‌گیرد
frontGround.position.set(
    0,
    -5,
    10000
);


frontGround.receiveShadow =
    true;


scene.add(
    frontGround
);

// ثبت زمین نزدیک برای سبز شدن تدریجی
frontGround.userData.dryColor =
    frontGroundMaterial.color.clone();

frontGround.userData.greenColor =
    new THREE.Color('#789B62');

registerNatureColorTarget(
    frontGround,
    'ground'
);

 // ============================================================
 // زمین‌های مستقل سه محله و میدان مرکزی
 // فعلاً همه‌ی سطوح صاف هستند؛ ناهمواری مستقل را بعداً می‌سازیم.
 // ============================================================

// تابع ساخت یک سطح مستقل روی زمین
function createVillageGround({
    x,
    z,
    width,
    depth,
    color
}) {
    const geometry =
        new THREE.PlaneGeometry(
            width,
            depth
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: color,
            roughness: 1,
            metalness: 0,
            side: THREE.DoubleSide
        });

    const ground =
        new THREE.Mesh(
            geometry,
            material
        );

    // تبدیل صفحه به سطح افقی
    ground.rotation.x =
        -Math.PI / 2;

    // قرارگیری سطح در مختصات انتخاب‌شده
    ground.position.set(
        x,
        2,
        z
    );

    ground.receiveShadow =
        true;

    scene.add(ground);

    return ground;
}



// ------------------------------------------------------------
// میدان مرکزی: فضای خالی میان محله‌ها
// ------------------------------------------------------------

const centralSquareGround =
    createVillageGround({
        x: -500,
        z: 6550,
        width: 2900,
        depth: 1000,
        color: 0xB8AD9B
    });

    // سنگ‌فرش میدان مرکزی روستا
const centralSquarePaving = createStonePaving({
    x: -500,
    z: 6600,
    width: 2900,
    depth: 1000,
    count: 12000,
    stoneSize: 48,
    colors: [
        0xB8AD9B,
        0xC9BEAB,
        0xA69C8D,
        0xD4C9B5
    ],
    excludeRoads: true
});


/**
 * ساخت مسیر منحنی رودخانه در کنار روستا
 * مختصات مسیر بر اساس محورهای X و Z صحنه است.
 */

// نقاط کنترل مسیر رودخانه؛ از جلوی خیابان تا جنگل
const riverPoints = [

    // شروع رودخانه در عمق جنگل
    new THREE.Vector3(-11000, 0, 7800),
    new THREE.Vector3(-6500, 0, 7900),
    new THREE.Vector3(-3900, 0, 7600),
    new THREE.Vector3(-3000, 0, 7700),
    new THREE.Vector3(-2100, 0, 7600),

    // پیچ رودخانه به سمت جادهٔ اصلی
    new THREE.Vector3(-1200, 0, 8000),
    new THREE.Vector3(-300, 0, 8200),
    new THREE.Vector3(700, 0, 8100),

    // حرکت تقریباً افقی و موازی با جاده
    new THREE.Vector3(1700, 0, 8000),
    new THREE.Vector3(2700, 0, 8150),
    new THREE.Vector3(3700, 0, 7900),
    new THREE.Vector3(4700, 0, 7900),
    new THREE.Vector3(11000, 0, 7800)
];


// منحنی نرم از میان نقاط کنترل
const riverCurve = new THREE.CatmullRomCurve3(
    riverPoints,
    false,
    "centripetal"
);

// شکل دوبعدی بستر رودخانه
const riverShape = new THREE.Shape();

riverShape.moveTo(-110, 0);
riverShape.lineTo(110, 0);

// تبدیل منحنی به یک نوار با عرض مشخص
const riverSegments = 180;
const riverWidth = 220;
const riverVertices = [];
const riverIndices = [];
// مختصات بافت برای نمایش حرکت آب در امتداد رودخانه
const riverUvs = [];

for (let i = 0; i <= riverSegments; i++) {
    const t = i / riverSegments;
    const point = riverCurve.getPoint(t);
    const tangent = riverCurve.getTangent(t);

    // بردار عمود بر جهت حرکت رودخانه
    const normalX = -tangent.z;
    const normalZ = tangent.x;

    riverVertices.push(
        point.x + normalX * riverWidth / 2,
        3,
        point.z + normalZ * riverWidth / 2
    );

    riverVertices.push(
        point.x - normalX * riverWidth / 2,
        3,
        point.z - normalZ * riverWidth / 2
    );

    if (i < riverSegments) {
        const a = i * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;

        riverIndices.push(a, b, c);
        riverIndices.push(b, d, c);
        // تعیین مختصات بافت برای دو لبهٔ رودخانه
        riverUvs.push(t, 0);
        riverUvs.push(t, 1);
    }
}

const riverGeometry = new THREE.BufferGeometry();

riverGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(riverVertices, 3)
);

riverGeometry.setIndex(riverIndices);
riverGeometry.computeVertexNormals();

// اتصال مختصات بافت به هندسهٔ رودخانه
riverGeometry.setAttribute(
    "uv",
    new THREE.Float32BufferAttribute(riverUvs, 2)
);

/**
 * ساخت بافت آب رودخانه با خطوط موج‌دار
 * حرکت بافت در تابع animate انجام می‌شود.
 */
const riverCanvas = document.createElement("canvas");
riverCanvas.width = 1024;
riverCanvas.height = 128;

const riverContext = riverCanvas.getContext("2d");

// رنگ پایهٔ آب
riverContext.fillStyle = "#829BA5";
riverContext.fillRect(0, 0, 1024, 128);

// رسم رگه‌های روشن برای نمایش جریان آب
for (let i = 0; i < 55; i++) {
    const startX = Math.random() * 1024;
    const amplitude = 2 + Math.random() * 5;
    const frequency = 0.025 + Math.random() * 0.035;

    riverContext.beginPath();

    for (let y = 0; y <= 128; y += 4) {
        const x =
            startX +
            Math.sin(y * frequency) * amplitude;

        if (y === 0) {
            riverContext.moveTo(x, y);
        } else {
            riverContext.lineTo(x, y);
        }
    }

    riverContext.strokeStyle =
        "rgba(220, 248, 255, " +
        (0.15 + Math.random() * 0.3) +
        ")";

    riverContext.lineWidth = 1 + Math.random() * 2;
    riverContext.stroke();
}

// تبدیل تصویر ساخته‌شده به بافت سه‌بعدی
const riverTexture = new THREE.CanvasTexture(riverCanvas);

// تکرار بافت در امتداد طول رودخانه
riverTexture.wrapS = THREE.RepeatWrapping;
riverTexture.wrapT = THREE.RepeatWrapping;
riverTexture.repeat.set(8, 1);

// متریال آب
const riverMaterial = new THREE.MeshStandardMaterial({
    map: riverTexture,
    color: 0xffffff,
    roughness: 0.24,
    metalness: 0.12,
    side: THREE.DoubleSide
});

// ساخت سطح رودخانه و افزودن آن به صحنه
const riverBed = new THREE.Mesh(
    riverGeometry,
    riverMaterial
);

riverBed.receiveShadow = true;
scene.add(riverBed);

// ذخیره رنگ‌های اولیه و مقصد رودخانه برای سبز شدن تدریجی
riverBed.userData.dryColor = riverMaterial.color.clone();
riverBed.userData.greenColor = new THREE.Color('#4A9B91');

registerNatureColorTarget(riverBed, 'river');

/**
 * ساخت ساحل خاکی در دو طرف رودخانه
 * ساحل مسیر منحنی رودخانه را از جنگل تا انتها دنبال می‌کند.
 */
const riverBankGroup = new THREE.Group();


const riverBankMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 1,
    metalness: 0,
    side: THREE.DoubleSide,
    vertexColors: true
});

// عرض ساحل در هر طرف رودخانه
const riverBankWidth = 300;

// تعداد بخش‌های ساحل برای دنبال کردن پیچ‌وخم رودخانه
const bankSegments = 180;

// ساخت ساحل جداگانه در دو طرف آب
for (const side of [-1, 1]) {
    const bankVertices = [];
    const bankIndices = [];
    const bankColors = [];

    const bankDryColors = [];
    const bankGreenColors = [];

    for (let i = 0; i <= bankSegments; i++) {
        const t = i / bankSegments;
        const point = riverCurve.getPoint(t);
        const tangent = riverCurve.getTangent(t);

        // بردار عمود بر مسیر رودخانه
        const normalX = -tangent.z;
        const normalZ = tangent.x;

        // لبه داخلی ساحل، نزدیک آب
        const innerX =
            point.x + normalX * side * (riverWidth / 2 - 5);
        const innerZ =
            point.z + normalZ * side * (riverWidth / 2 - 5);

        // لبه بیرونی ساحل
        const outerX =
            point.x + normalX * side *
            (riverWidth / 2 + riverBankWidth);
        const outerZ =
            point.z + normalZ * side *
            (riverWidth / 2 + riverBankWidth);

        // رأس‌های نوار ساحلی
        bankVertices.push(innerX, 1.5, innerZ);
        bankVertices.push(outerX, 1.5, outerZ);


        // رنگ خاک در کنار آب
        const innerColor = new THREE.Color(0x9B805B);

        // رنگ هماهنگ با زمین سبز اطراف
        const outerColor = new THREE.Color(0xA5A397);

        // ذخیره رنگ اولیه و رنگ سبز مقصد برای ساحل
        const innerGreenColor = new THREE.Color('#789B62');
        const outerGreenColor = new THREE.Color('#789B62');

        bankDryColors.push(
            innerColor.clone(),
            outerColor.clone()
        );

        bankGreenColors.push(
            innerGreenColor,
            outerGreenColor
        );

        // رنگ نزدیک آب
        bankColors.push(
            innerColor.r,
            innerColor.g,
            innerColor.b
        );

        // رنگ لبه بیرونی ساحل
        bankColors.push(
            outerColor.r,
            outerColor.g,
            outerColor.b
        );


        if (i < bankSegments) {
            const a = i * 2;
            const b = a + 1;
            const c = a + 2;
            const d = a + 3;

            bankIndices.push(a, b, c);
            bankIndices.push(b, d, c);
        }
    }

    const bankGeometry = new THREE.BufferGeometry();

    bankGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(bankVertices, 3)
    );

    bankGeometry.setIndex(bankIndices);
    bankGeometry.computeVertexNormals();

    const bank = new THREE.Mesh(
        bankGeometry,
        riverBankMaterial
    );

    bank.receiveShadow = true;
    riverBankGroup.add(bank);

    bankGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(bankColors, 3)
);
// ذخیره رنگ‌های ساحل برای تغییر تدریجی
bank.userData.dryVertexColors = bankDryColors;
bank.userData.greenVertexColors = bankGreenColors;

// ثبت هر سمت ساحل در سیستم تغییر رنگ طبیعت
registerNatureColorTarget(bank, 'riverBank');
}

scene.add(riverBankGroup);


/**
 * ساخت سنگ‌فرش طبیعی در دو طرف ساحل رودخانه
 * هندسه و متریال سنگ‌ها بین نمونه‌ها مشترک است.
 */
const riverShoreStones = new THREE.Group();

// رنگ‌های طبیعی سنگ‌های ساحلی
const shoreStoneMaterials = [
    new THREE.MeshStandardMaterial({
        color: 0x817D73,
        roughness: 0.96,
        flatShading: true
    }),
    new THREE.MeshStandardMaterial({
        color: 0xA39A87,
        roughness: 1,
        flatShading: true
    }),
    new THREE.MeshStandardMaterial({
        color: 0x6F7069,
        roughness: 0.98,
        flatShading: true
    }),
    new THREE.MeshStandardMaterial({
        color: 0xB0A18A,
        roughness: 1,
        flatShading: true
    })
];


 // ساخت جنگل مستقل در دو طرف رودخانه
const riverEdgeForest = createRiverEdgeForest({
    riverCurve: riverCurve,
    leftBankDistance: 510,
    rightBankDistance: 510,
    bankSpread: 350,
    leftCount: 500,
    rightCount: 2000
});

// ثبت تاج‌های درختان کنار رودخانه برای سبز شدن تدریجی
if (riverEdgeForest) {
    registerNatureColorTarget(
        riverEdgeForest.roundCrowns,
        'tree'
    );

    registerNatureColorTarget(
        riverEdgeForest.naturalCrowns,
        'tree'
    );

    registerNatureColorTarget(
        riverEdgeForest.coniferCrowns,
        'tree'
    );
}

// هندسه مشترک سنگ‌های ساحلی
const shoreStoneGeometry = new THREE.IcosahedronGeometry(1, 1);

// تعداد بخش‌های مسیر برای توزیع سنگ‌ها
const shoreStoneCount = 2000;

for (let i = 0; i < shoreStoneCount; i++) {
    // توزیع سنگ‌ها در طول رودخانه
    const t = (i + Math.random() * 0.7) / shoreStoneCount;

    const point = riverCurve.getPoint(t);
    const tangent = riverCurve.getTangent(t);

    // بردار عمود بر مسیر رودخانه
    const normalX = -tangent.z;
    const normalZ = tangent.x;

    // تعیین طرف رودخانه
    const side = Math.random() < 0.5 ? -1 : 1;

    // فاصله از لبه آب؛ سنگ‌ها روی ساحل قرار می‌گیرند
    const distanceFromWater = 12 + Math.random() * riverBankWidth;

    const shoreOffset = riverWidth / 2 + distanceFromWater;

    // کمی جابه‌جایی تصادفی در امتداد مسیر
    const alongPath = (Math.random() - 0.5) * 35;

    const stone = new THREE.Mesh(
        shoreStoneGeometry,
        shoreStoneMaterials[
            Math.floor(Math.random() * shoreStoneMaterials.length)
        ]
    );

    // اندازه نامنظم سنگ‌ها
    const size = 8 + Math.random() * 19;

    stone.scale.set(
        size * (0.9 + Math.random() * 0.7),
        size * (0.25 + Math.random() * 0.2),
        size * (0.7 + Math.random() * 0.6)
    );

    // جای‌گذاری سنگ در کنار ساحل
    stone.position.set(
        point.x + normalX * side * shoreOffset
            + tangent.x * alongPath,
        2,
        point.z + normalZ * side * shoreOffset
            + tangent.z * alongPath
    );

    stone.rotation.set(
        Math.random() * 0.15,
        Math.random() * Math.PI,
        Math.random() * 0.15
    );

    stone.castShadow = true;
    stone.receiveShadow = true;

    riverShoreStones.add(stone);
}

scene.add(riverShoreStones);


/**
 * سنگ‌های پراکنده در مسیر رودخانه
 * سنگ‌ها کمی در بستر فرو می‌روند تا طبیعی‌تر دیده شوند.
 */
const riverStones = new THREE.Group();

const stoneMaterial = new THREE.MeshStandardMaterial({
    color: 0x777873,
    roughness: 0.94,
    metalness: 0.02,
    flatShading: true
});

// محل قرارگیری سنگ‌ها در امتداد منحنی رودخانه
const stonePositions = [
    { t: 0.10, offset: -35, size: 24 },
    { t: 0.18, offset:  38, size: 31 },
    { t: 0.27, offset: -42, size: 49 },
    { t: 0.36, offset:  30, size: 35 },
    { t: 0.45, offset: -28, size: 42 },
    { t: 0.54, offset:  42, size: 28 },
    { t: 0.68, offset:  32, size: 28 },
    { t: 0.63, offset: -38, size: 33 },
    { t: 0.72, offset:  25, size: 40 },
    { t: 0.81, offset: -40, size: 30 },
    { t: 0.90, offset:  32, size: 43 },
    { t: 0.05, offset:  42, size: 50 },
    { t: 0.13, offset:  65, size: 32 },
    { t: 0.11, offset: -65, size: 36 },
];

for (const item of stonePositions) {
    const point = riverCurve.getPoint(item.t);
    const tangent = riverCurve.getTangent(item.t);

    // بردار عمود بر مسیر رودخانه
    const normalX = -tangent.z;
    const normalZ = tangent.x;

    const stoneGeometry = new THREE.IcosahedronGeometry(
        item.size,
        1
    );

    const stone = new THREE.Mesh(
        stoneGeometry,
        stoneMaterial
    );

    stone.position.set(
        point.x + normalX * item.offset,
        0,
        point.z + normalZ * item.offset
    );

    // سنگ‌ها نامنظم و کمی تخت باشند
    stone.scale.set(
        1,
        0.55 + Math.random() * 0.2,
        0.75 + Math.random() * 0.35
    );

    stone.rotation.set(
        Math.random() * 0.25,
        Math.random() * Math.PI,
        Math.random() * 0.2
    );

    stone.castShadow = true;
    stone.receiveShadow = true;

    riverStones.add(stone);
}

scene.add(riverStones);


/**
 * ساخت تیغه‌های چمن با رنگ اولیه خشک و رنگ مقصد سبز.
 * چمن‌ها در محدوده خانه‌ها و جاده‌ها قرار نمی‌گیرند.
 */
function createGrassBlades({
    x,
    z,
    width,
    depth,
    houses = [],
    count = 600
}) {
    const bladeGeometry = new THREE.PlaneGeometry(4, 14);

    const bladeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
    });

    const grass = new THREE.InstancedMesh(
        bladeGeometry,
        bladeMaterial,
        count
    );

    const dummy = new THREE.Object3D();
    const bladeColor = new THREE.Color();

    // رنگ اولیه و رنگ مقصد هر تیغه
    const dryInstanceColors = [];
    const greenInstanceColors = [];

    let placed = 0;
    let attempts = 0;
    const maxAttempts = count * 8;

    while (placed < count && attempts < maxAttempts) {
        attempts++;

        const px = x + (Math.random() - 0.5) * width;
        const pz = z + (Math.random() - 0.5) * depth;

        // خالی نگه داشتن اطراف خانه‌ها
        const nearHouse = houses.some(house =>
            Math.abs(px - house.position.x) < 155 &&
            Math.abs(pz - house.position.z) < 155
        );

        if (nearHouse) continue;

        // فاصله از جاده‌های عمودی
        const nearVerticalRoad =
            (Math.abs(px + 2000) < 95 ||
             Math.abs(px - 1000) < 95) &&
            pz > 4900 &&
            pz < 7250;

        // فاصله از جاده اصلی افقی
        const nearMainRoad = Math.abs(pz - 7100) < 110;

        if (nearVerticalRoad || nearMainRoad) continue;

        const height = 0.65 + Math.random() * 0.7;

        dummy.position.set(
            px,
            2.4 + 7 * height,
            pz
        );

        dummy.rotation.set(
            0,
            Math.random() * Math.PI,
            0
        );

        dummy.scale.set(1, height, 1);
        dummy.updateMatrix();

        grass.setMatrixAt(placed, dummy.matrix);

        // رنگ اولیه: خاکی و کم‌اشباع
        bladeColor.setHSL(
            0.075 + Math.random() * 0.045,
            0.20 + Math.random() * 0.15,
            0.25 + Math.random() * 0.12
        );

        dryInstanceColors[placed] = bladeColor.clone();

        // رنگ مقصد: سبز طبیعی
        const greenColor = new THREE.Color().setHSL(
            0.25 + Math.random() * 0.045,
            0.50 + Math.random() * 0.20,
            0.32 + Math.random() * 0.16
        );

        greenInstanceColors[placed] = greenColor;

        // نمایش رنگ اولیه در شروع صحنه
        grass.setColorAt(placed, bladeColor);


        // فقط پس از ساخت کامل این تیغه، شمارنده افزایش می‌یابد
        placed++;
    }

    // تنظیم تعداد واقعی تیغه‌های ساخته‌شده
    grass.count = placed;
    grass.instanceMatrix.needsUpdate = true;

    // ذخیره رنگ‌ها برای انیمیشن سبز شدن
    grass.userData.dryInstanceColors = dryInstanceColors;
    grass.userData.greenInstanceColors = greenInstanceColors;

    if (grass.instanceColor) {
        grass.instanceColor.needsUpdate = true;
    }

    scene.add(grass);

    return grass;
}




/**
 * ساخت سنگ‌فرش فشرده و طبیعی با ردیف‌های منظم
 * کف سنگ‌ها دقیقاً با بستر سنگ‌فرش تماس دارد.
 */
function createStonePaving({
    x,
    z,
    width,
    depth,
    count = 6200,
    stoneSize = 38,
    colors = [0xB8AD9B, 0xC9BEAB, 0xA69C8D, 0xD4C9B5],
    excludeRoads = true
} = {}) {
    if (width <= 0 || depth <= 0 || count <= 0) {
        return null;
    }

    const stoneGeometry = new THREE.BoxGeometry(1, 1, 1);

    const stoneMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        roughness: 1,
        metalness: 0
    });

    const stones = new THREE.InstancedMesh(
        stoneGeometry,
        stoneMaterial,
        count
    );

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    // فاصله‌ها طوری انتخاب شده‌اند که سنگ‌ها روی هم نیفتند.
    const stepX = stoneSize + -2;
    const stepZ = stoneSize * 0.56;

    const columns = Math.ceil(width / stepX) + 2;
    const rows = Math.ceil(depth / stepZ) + 2;

    let placed = 0;

    for (let row = 0; row < rows && placed < count; row++) {
        for (let column = 0; column < columns && placed < count; column++) {

            // جابه‌جایی یک‌درمیان ردیف‌ها برای ظاهر طبیعی
            const stagger = row % 2 === 0 ? 0 : stepX * 0.8;

            const px =
                x - width / 2 + stepX / 2 +
                column * stepX + stagger;

            const pz =
                z - depth / 2 + stepZ / 2 +
                row * stepZ;

            // نگه‌داشتن تمام سنگ‌ها داخل محدودهٔ میدان
            if (
                px < x - width / 2 + stoneSize * 0.95 ||
                px > x + width / 2 - stoneSize * 0.95 ||
                pz < z - depth / 2 + stoneSize * 0.95 ||
                pz > z + depth / 2 - stoneSize * 0.95
            ) {
                continue;
            }

            // حفظ محدودهٔ جاده‌های موجود
            if (excludeRoads) {
                const onMainRoad =
                    Math.abs(pz - 7100) < 115 &&
                    px > -5200 && px < 4100;

                const onLeftRoad =
                    Math.abs(px + 2000) < 100 &&
                    pz > 4900 && pz < 7250;

                const onRightRoad =
                    Math.abs(px - 1000) < 100 &&
                    pz > 4900 && pz < 7250;

                if (onMainRoad || onLeftRoad || onRightRoad) {
                    continue;
                }
            }

            // اندازه‌های کنترل‌شده برای جلوگیری از هم‌پوشانی
            const stoneWidth =
                stoneSize * (0.50 + Math.random() * 0.6);

            const stoneDepth =
                stoneSize * (0.26 + Math.random() * 0.8);

            const stoneHeight =
                1.5 + Math.random() * 0.8;

            // کف سنگ روی بستر میدان، در ارتفاع y = 2 قرار می‌گیرد
            dummy.position.set(
                px,
                2 + stoneHeight / 2,
                pz
            );

            // زاویهٔ کم برای حفظ نظم ردیف‌ها
            dummy.rotation.set(
                0,
                (Math.random() - 0.5) * 0.06,
                0
            );

            dummy.scale.set(
                stoneWidth,
                stoneHeight,
                stoneDepth
            );

            dummy.updateMatrix();

            stones.setMatrixAt(placed, dummy.matrix);

            const stoneColor =
                colors[Math.floor(Math.random() * colors.length)];

            color.setHex(stoneColor);
            stones.setColorAt(placed, color);

            placed++;
        }
    }

    stones.count = placed;
    stones.instanceMatrix.needsUpdate = true;

    if (stones.instanceColor) {
        stones.instanceColor.needsUpdate = true;
    }

    stones.receiveShadow = true;
    stones.castShadow = false;

    scene.add(stones);

    return stones;
}


/**
 * ساخت یک خانه روستایی سه‌بعدی
 * تمام مختصات نسبت به مرکز خانه هستند.
 */


function createHouse({
    x = 0,
    z = 0,
    width = 100,
    height = 90,
    depth = 90,
    wallColor = 0xD8C09A,
    roofColor = 0x78452D,
    rotation = 0,
    hasPorch = false,
    floors = 1
} = {}) {
    const house = new THREE.Group();

    // ارتفاع هر طبقه بر اساس تعداد طبقات خانه
    const floorHeight = height / floors;

    // بدنه خانه

    // بدنه کاه‌گلی خانه با تغییرات طبیعی و ملایم رنگ
    const wallGeometry = new THREE.BoxGeometry(width, height, depth);

    // متریال دیوار خانه روستایی
    const houseWallMaterial = new THREE.MeshStandardMaterial({
        color: wallColor,
        roughness: 1,
        metalness: 0
    });

    // تغییر بسیار ملایم رنگ برای جلوگیری از یکدست شدن روستا
    houseWallMaterial.color.offsetHSL(
        0,
        (Math.random() - 0.5) * 0.035,
        (Math.random() - 0.5) * 0.06
    );

    // ساخت دیوارهای خانه
    const walls = new THREE.Mesh(
        wallGeometry,
        houseWallMaterial
    );
    walls.position.y = height / 2;
    walls.castShadow = true;
    walls.receiveShadow = true;
    house.add(walls);


    // بافت برجسته و واضح روی نمای جلویی خانه کاه‌گلی
    const plasterMaterial = new THREE.MeshStandardMaterial({
        color: 0xBDA27C,
        roughness: 1,
        metalness: 0
    });

    const plasterRows = 9;
    const plasterColumns = 12;
    const patchDepth = 2;

    for (let row = 0; row < plasterRows; row++) {
        for (let col = 0; col < plasterColumns; col++) {
            // فاصله‌های نامنظم برای شبیه شدن به سطح کاه‌گل
            const patchWidth = width / plasterColumns * 0.72;
            const patchHeight = height / plasterRows * 0.42;

            const patch = new THREE.Mesh(
                new THREE.BoxGeometry(
                    patchWidth,
                    patchHeight,
                    patchDepth
                ),
                plasterMaterial
            );

            patch.position.set(
                -width / 2 +
                    (col + 0.5) * (width / plasterColumns),
                (row + 0.5) * (height / plasterRows),
                depth / 2 + patchDepth / 2 + 0.2
            );

            house.add(patch);
        }
    }

    // پایه سنگی زیر دیوارهای خانه
    const foundationGeometry = new THREE.BoxGeometry(
        width + 8,
        height * 0.12,
        depth + 8
    );

    // سنگ‌های پایه خانه با رنگ خاکستری گرم
    const foundationMaterial = new THREE.MeshStandardMaterial({
        color: 0x918779,
        roughness: 1,
        metalness: 0
    });

    const foundation = new THREE.Mesh(
        foundationGeometry,
        foundationMaterial
    );

    foundation.position.y = height * 0.06;
    foundation.castShadow = true;
    foundation.receiveShadow = true;

    house.add(foundation);


    // سقف سفالی شیب‌دار با کاشی‌های برجسته
    const roofHeight = floorHeight * 0.48;
    const roofOverhang = width * 0.12;
    const roofHalfWidth = width / 2 + roofOverhang;
    const roofHalfDepth = depth / 2 + roofOverhang;
    const ridgeY = height + roofHeight;

    // متریال پایه سقف
    const norsaHouseRoofMaterial = new THREE.MeshStandardMaterial({
        color: 0x174B59,
        roughness: 0.95,
        metalness: 0,
        side: THREE.DoubleSide
    });

    // ساخت دو سطح اصلی سقف
    function createRoofSide(vertices) {
        const geometry = new THREE.BufferGeometry();

        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(vertices, 3)
        );

        geometry.setIndex([0, 1, 2, 0, 2, 3]);
        geometry.computeVertexNormals();

        const mesh = new THREE.Mesh(geometry, norsaHouseRoofMaterial);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
    }

    const leftRoof = createRoofSide([
        -roofHalfWidth, height, -roofHalfDepth,
         0, ridgeY, -roofHalfDepth,
         0, ridgeY,  roofHalfDepth,
        -roofHalfWidth, height, roofHalfDepth
    ]);

    const rightRoof = createRoofSide([
         0, ridgeY, -roofHalfDepth,
         roofHalfWidth, height, -roofHalfDepth,
         roofHalfWidth, height, roofHalfDepth,
         0, ridgeY, roofHalfDepth
    ]);

    house.add(leftRoof);
    house.add(rightRoof);

    // متریال کاشی‌های سفالی
    const tileColors = [
        0xA94F32,
        0xBD6541,
        0x99442F,
        0xC0784B,
        0xAE5939
    ];

    const tileMaterials = tileColors.map(color =>
        new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.92,
            metalness: 0
        })
    );

    // محاسبه ارتفاع سطح شیب‌دار در هر نقطه از عرض سقف
    function getRoofY(x) {
        const slope = Math.abs(x) / roofHalfWidth;
        return ridgeY - slope * roofHeight;
    }

    // کاشی‌های برجسته روی هر دو سطح سقف
    const tileWidth = Math.max(12, width * 0.105);
    const tileLength = Math.max(18, depth * 0.15);
    const tileThickness = Math.max(2.5, width * 0.014);
    const tileRows = Math.max(
        4,
        Math.ceil((roofHalfDepth * 2) / tileLength)
    );
    const tileColumns = Math.max(
        5,
        Math.ceil(roofHalfWidth / tileWidth)
    );

    for (const side of [-1, 1]) {
        for (let col = 0; col < tileColumns; col++) {
            const distanceX =
                (col + 0.5) * (roofHalfWidth / tileColumns);

            const x = side * distanceX;
            const surfaceY = getRoofY(x);

            for (let row = 0; row < tileRows; row++) {
                const z =
                    -roofHalfDepth +
                    (row + 0.5) * (roofHalfDepth * 2 / tileRows);

                const tile = new THREE.Mesh(
                    new THREE.BoxGeometry(
                        tileWidth * 0.94,
                        tileThickness,
                        tileLength * 0.92
                    ),
                    tileMaterials[
                        Math.floor(Math.random() * tileMaterials.length)
                    ]
                );

                // چرخش کاشی برای قرار گرفتن روی شیب سقف
                const slopeAngle = Math.atan(
                    roofHeight / roofHalfWidth
                );

                tile.rotation.z = side === -1
                    ? slopeAngle
                    : -slopeAngle;

                tile.position.set(
                    x,
                    surfaceY + tileThickness * 0.55,
                    z
                );

                tile.castShadow = true;
                tile.receiveShadow = true;
                house.add(tile);
            }
        }
    }

    // لبه‌های برجسته سقف در دو طرف شیروانی
    const edgeMaterial = new THREE.MeshStandardMaterial({
        color: 0x78402D,
        roughness: 1
    });

    for (const side of [-1, 1]) {
        const edge = new THREE.Mesh(
            new THREE.BoxGeometry(
                Math.max(5, width * 0.035),
                Math.max(5, width * 0.035),
                roofHalfDepth * 2 + 12
            ),
            edgeMaterial
        );

        edge.position.set(
            side * (roofHalfWidth + 2),
            height + 2,
            0
        );

        edge.castShadow = true;
        house.add(edge);
    }

    // کاشی‌های گرد روی خط رأس سقف
    const ridgeTileMaterial = new THREE.MeshStandardMaterial({
        color: 0x8E3F2B,
        roughness: 0.9
    });

    const ridgeTileLength = Math.max(18, depth * 0.18);
    const ridgeCount = Math.ceil(
        (roofHalfDepth * 2) / ridgeTileLength
    );

    for (let i = 0; i < ridgeCount; i++) {
        const ridgeTile = new THREE.Mesh(
            new THREE.CylinderGeometry(
                Math.max(5, width * 0.035),
                Math.max(5, width * 0.035),
                ridgeTileLength * 0.95,
                8
            ),
            ridgeTileMaterial
        );

        ridgeTile.rotation.x = Math.PI / 2;

        ridgeTile.position.set(
            0,
            ridgeY + 2,
            -roofHalfDepth +
                (i + 0.5) * (roofHalfDepth * 2 / ridgeCount)
        );

        ridgeTile.castShadow = true;
        ridgeTile.receiveShadow = true;
        house.add(ridgeTile);
    }

    // ساخت ایوان چوبی در صورت فعال بودن گزینه
    if (hasPorch) {
        const porchWidth = width * 0.95;
        const porchDepth = depth * 0.38;
        const porchHeight = height * 0.38;
        const porchZ = depth / 2 + porchDepth / 2;

        const norsaHouseWoodMaterial = new THREE.MeshStandardMaterial({
            color: 0x795033,
            roughness: 1
        });

        // کف ایوان
        const porchFloor = new THREE.Mesh(
            new THREE.BoxGeometry(porchWidth, 8, porchDepth),
            norsaHouseWoodMaterial
        );
        porchFloor.position.set(0, porchHeight, porchZ);
        porchFloor.castShadow = true;
        porchFloor.receiveShadow = true;
        house.add(porchFloor);

        // ستون‌های جلویی ایوان
        const postWidth = Math.max(5, width * 0.035);
        const postHeight = porchHeight + 5;

        for (const side of [-1, 1]) {
            const post = new THREE.Mesh(
                new THREE.BoxGeometry(postWidth, postHeight, postWidth),
                norsaHouseWoodMaterial
            );

            post.position.set(
                side * porchWidth * 0.43,
                postHeight / 2,
                depth / 2 + porchDepth
            );

            post.castShadow = true;
            post.receiveShadow = true;
            house.add(post);
        }

        // تیر افقی بالای ستون‌ها
        const porchBeam = new THREE.Mesh(
            new THREE.BoxGeometry(porchWidth, postWidth, postWidth),
            norsaHouseWoodMaterial
        );

        porchBeam.position.set(
            0,
            postHeight,
            depth / 2 + porchDepth
        );

        porchBeam.castShadow = true;
        house.add(porchBeam);

        // سقف ایوان
        const porchRoof = new THREE.Mesh(
            new THREE.BoxGeometry(
                porchWidth + 12,
                7,
                porchDepth + 12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x68412F,
                roughness: 1
            })
        );

        porchRoof.position.set(
            0,
            postHeight + 4,
            porchZ
        );

        porchRoof.castShadow = true;
        porchRoof.receiveShadow = true;
        house.add(porchRoof);
    }

    // دودکش آجری روی یکی از شیب‌های سقف
    const chimneyWidth = width * 0.14;
    const chimneyHeight = height * 0.42;

    const chimneyGeometry = new THREE.BoxGeometry(
        chimneyWidth,
        chimneyHeight,
        chimneyWidth
    );

    const chimneyMaterial = new THREE.MeshStandardMaterial({
        color: 0xA6533B,
        roughness: 1
    });

    const chimney = new THREE.Mesh(
        chimneyGeometry,
        chimneyMaterial
    );

    chimney.position.set(
        width * 0.25,
        height + roofHeight * 0.35,
        -depth * 0.12
    );

    chimney.rotation.z = -0.35;
    chimney.castShadow = true;
    chimney.receiveShadow = true;

    house.add(chimney);

    // کلاهک بالای دودکش
    const chimneyCap = new THREE.Mesh(
        new THREE.BoxGeometry(
            chimneyWidth * 1.3,
            4,
            chimneyWidth * 1.3
        ),
        chimneyMaterial
    );

    chimneyCap.position.set(
        chimney.position.x,
        chimney.position.y + chimneyHeight / 2,
        chimney.position.z
    );

    house.add(chimneyCap);



    // قاب چوبی سنتی دور در ورودی
    const doorFrameMaterial = new THREE.MeshStandardMaterial({
        color: 0x70472D,
        roughness: 1
    });

    const doorFrameWidth = Math.max(5, width * 0.035);
    const doorWidth = width * 0.22;
    const doorHeight = floorHeight * 0.48;
    const doorZ = depth / 2 + 3.5;

    // دو تیر عمودی قاب در
    for (const side of [-1, 1]) {
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(
                doorFrameWidth,
                doorHeight + doorFrameWidth,
                doorFrameWidth
            ),
            doorFrameMaterial
        );

        frame.position.set(
            side * (doorWidth / 2 + doorFrameWidth / 2),
            doorHeight / 2,
            doorZ
        );

        frame.castShadow = true;
        house.add(frame);
    }

    // تیر افقی بالای در
    const doorHeader = new THREE.Mesh(
        new THREE.BoxGeometry(
            doorWidth + doorFrameWidth * 2,
            doorFrameWidth,
            doorFrameWidth
        ),
        doorFrameMaterial
    );

    doorHeader.position.set(
        0,
        doorHeight + doorFrameWidth / 2,
        doorZ
    );

    doorHeader.castShadow = true;
    house.add(doorHeader);

    // دستگیره فلزی در ورودی
    const handleGeometry = new THREE.SphereGeometry(2.5, 8, 8);

    const handleMaterial = new THREE.MeshStandardMaterial({
        color: 0xD6B46A,
        metalness: 0.75,
        roughness: 0.3
    });

    const doorHandle = new THREE.Mesh(
        handleGeometry,
        handleMaterial
    );

    doorHandle.position.set(
        width * 0.055,
        height * 0.25,
        depth / 2 + 4
    );

    house.add(doorHandle);

    // قاب چوبی و شیشه‌های دو پنجره جلوی خانه
    // اندازه پنجره متناسب با عرض و ارتفاع هر طبقه
    const windowWidth = width * 0.19;
    const windowHeight = floorHeight * 0.38;
    const frameThickness = Math.max(3, width * 0.025);
    const windowZ = depth / 2 + 2;

    const windowMaterial = new THREE.MeshStandardMaterial({
        color: 0x91B9C5,
        roughness: 0.4,
        metalness: 0.05
    });

    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x59351F,
        roughness: 1
    });


for (let floor = 0; floor < floors; floor++) {
    // ارتفاع مرکز پنجره در هر طبقه
    const windowY = floor * floorHeight + floorHeight * 0.50;

    // دو پنجره در نمای جلویی خانه
    for (const side of [-1, 1]) {
        const windowGroup = new THREE.Group();

        // شیشه پنجره
        const glass = new THREE.Mesh(
            new THREE.BoxGeometry(
                windowWidth,
                windowHeight,
                2
            ),
            windowMaterial
        );

        windowGroup.add(glass);

        // قاب عمودی چپ و راست
        for (const frameSide of [-1, 1]) {
            const verticalFrame = new THREE.Mesh(
                new THREE.BoxGeometry(
                    frameThickness,
                    windowHeight + frameThickness,
                    4
                ),
                frameMaterial
            );

            verticalFrame.position.x =
                frameSide * (windowWidth / 2);

            windowGroup.add(verticalFrame);
        }

        // قاب افقی بالا و پایین
        for (const frameSide of [-1, 1]) {
            const horizontalFrame = new THREE.Mesh(
                new THREE.BoxGeometry(
                    windowWidth + frameThickness,
                    frameThickness,
                    4
                ),
                frameMaterial
            );

            horizontalFrame.position.y =
                frameSide * (windowHeight / 2);

            windowGroup.add(horizontalFrame);
        }

        // قرارگیری پنجره در طبقه و سمت مربوطه
        windowGroup.position.set(
            side * width * 0.32,
            windowY,
            windowZ
        );

        house.add(windowGroup);
    }
}



    // متریال تیرهای چوبی با رنگ طبیعی چوب قدیمی
    const beamMaterial = new THREE.MeshStandardMaterial({
        color: 0x68452D,
        roughness: 0.95,
        metalness: 0
    });

    const beamThickness = Math.max(4, width * 0.035);

    // تیر افقی بالای در و پنجره‌ها
    const upperBeam = new THREE.Mesh(
        new THREE.BoxGeometry(
            width * 0.88,
            beamThickness,
            beamThickness
        ),
        beamMaterial
    );

    upperBeam.position.set(
        0,
        height * 0.88,
        depth / 2 + beamThickness / 2
    );

    house.add(upperBeam);

    // تیرهای عمودی کناره‌های نمای خانه
    for (const side of [-1, 1]) {
        const beam = new THREE.Mesh(
            new THREE.BoxGeometry(
                beamThickness,
                height * 0.85,
                beamThickness
            ),
            beamMaterial
        );

        beam.position.set(
            side * width * 0.43,
            height * 0.43,
            depth / 2 + beamThickness / 2
        );

        house.add(beam);
    }

    // گلدان‌های کوچک کنار ورودی
    const potMaterial = new THREE.MeshStandardMaterial({
        color: 0xA6533B,
        roughness: 1
    });

    const flowerMaterial = new THREE.MeshStandardMaterial({
        color: 0xE8B8C8,
        roughness: 0.8
    });

    for (const side of [-1, 1]) {
        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(5, 3.5, 10, 8),
            potMaterial
        );

        pot.position.set(
            side * width * 0.19,
            5,
            depth / 2 + 12
        );

        house.add(pot);

        const flower = new THREE.Mesh(
            new THREE.SphereGeometry(5, 8, 6),
            flowerMaterial
        );

        flower.position.set(
            pot.position.x,
            13,
            pot.position.z
        );

        house.add(flower);
    }

    // سنگ‌فرش کوتاه جلوی در
    const pathMaterial = new THREE.MeshStandardMaterial({
        color: 0xA9A092,
        roughness: 1
    });

    for (let i = 0; i < 4; i++) {
        const stone = new THREE.Mesh(
            new THREE.BoxGeometry(
                width * 0.18,
                3,
                15
            ),
            pathMaterial
        );

        stone.position.set(
            0,
            1.5,
            depth / 2 + 25 + i * 18
        );

        house.add(stone);
    }

    // تنظیم موقعیت و چرخش خانه
    house.position.set(x, 0, z);
    house.rotation.y = rotation;

    scene.add(house);
    return house;
}



/**
 * ساخت جاده صاف روی زمین
 * عرض و طول جاده بر اساس مختصات افقی X و Z هستند.
 */
function createRoad({
    x,
    z,
    width,
    length,
    color = 0xB9A487,
    rotation = 0
}) {
    const geometry = new THREE.PlaneGeometry(
        width,
        length
    );


    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 1,
        metalness: 0
    });

    const road = new THREE.Mesh(
        geometry,
        material
    );

    // قرار دادن جاده روی سطح افقی
    road.rotation.x = -Math.PI / 2;
    road.rotation.z = rotation;

    // ارتفاع کم برای جلوگیری از هم‌پوشانی با زمین
    road.position.set(x, 8, z);

    road.receiveShadow = true;

    scene.add(road);

    return road;
}

// ساخت خودکار خانه‌های یک محله
function createVillageHouseGrid({
    centerX,
    startZ,
    columns,
    rows,
    spacingX = 350,
    spacingZ = 300,
    wallColor = 0xD8C09A,
    roofColor = 0x78452D,
    rotation = 0,
    hasPorch = false,
}) {
    const houses = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            // جابه‌جایی ردیف‌ها برای طبیعی‌تر شدن چیدمان
            const offsetX = row % 2 === 0 ? 0 : spacingX / 2;

            // انتخاب تصادفی رنگ بدنه خانه
            const wallColors = [
                0xE0CCAC, // کرم روشن
                0xD9B66F, // زرد گرم
                0xBDB5A4, // خاکستری سنگی
                0xCDB697, // بژ
                0xD8B4A0, // صورتی خاکی
                0xB7C9A8  // سبز ملایم
            ];

            // انتخاب تصادفی رنگ سقف
            const roofColors = [
                0x9B4934, // سفالی
                0x68412F, // قهوه‌ای
                0x78372C, // قرمز تیره
                0x805038, // قهوه‌ای گرم
                0x59634A  // سبز زیتونی
            ];

            const randomWallColor =
                wallColors[Math.floor(Math.random() * wallColors.length)];

            const randomRoofColor =
                roofColors[Math.floor(Math.random() * roofColors.length)];


            // انتخاب تصادفی تعداد طبقات خانه
            const floorRoll = Math.random();

            const floors = floorRoll < 0.45
                ? 1
                : floorRoll < 0.80
                    ? 2
                    : 3;

            // اندازه کلی خانه
            const houseScale = 0.85 + Math.random() * 0.35;

            const houseWidth = 220 * houseScale;
            const houseHeight = 150 * houseScale * floors;
            const houseDepth = 120 * houseScale;

            houses.push(
                createHouse({
                    x: centerX +
                        (col - (columns - 1) / 2) * spacingX +
                        offsetX,
                    z: startZ + row * spacingZ,
                    width: houseWidth,
                    height: houseHeight,
                    floors: floors,
                    depth: houseDepth,
                    wallColor: randomWallColor,
                    roofColor: randomRoofColor,
                    hasPorch: hasPorch,
                    rotation: rotation + (Math.random() - 0.5) * 0.1
                })
            );
        }
    }

    return houses;
}


/**
 * شبکه اولیه جاده‌های روستا
 */

// جاده اصلی شرقی ـ غربی، پایین محله‌ها
createRoad({
    x: -2000,
    z: 7100,
    width: 26000,
    length: 190,
    color: 0x1E1E1E
});

// مسیر اتصال سمت چپ به جاده اصلی
createRoad({
    x: -2000,
    z: 6100,
    width: 140,
    length: 2200,
    color: 0x1E1E1E
});

// مسیر اتصال سمت راست به جاده اصلی
createRoad({
    x: 1000,
    z: 6100,
    width: 140,
    length: 2200,
    color: 0x1E1E1E
});


/**
 * ساخت خط‌چین سفید وسط جاده
 * جهت خط می‌تواند افقی یا عمودی باشد.
 */
function createRoadLine({ x, z, length, direction = "horizontal" }) {
    const lineMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        roughness: 1,
        metalness: 0
    });

    const dashLength = 90;
    const gapLength = 90;

    for (let offset = -length / 2 + dashLength / 2;
         offset < length / 2;
         offset += dashLength + gapLength) {

        const dashWidth = Math.min(
            dashLength,
            length / 2 - offset + dashLength / 2
        );

        if (dashWidth <= 0) continue;

        const geometry = direction === "horizontal"
            ? new THREE.PlaneGeometry(dashWidth, 12)
            : new THREE.PlaneGeometry(12, dashWidth);

        const dash = new THREE.Mesh(geometry, lineMaterial);

        dash.rotation.x = -Math.PI / 2;
        dash.position.set(
            direction === "horizontal" ? x + offset : x,
            8.5,
            direction === "horizontal" ? z : z + offset
        );

        scene.add(dash);
    }
}


/* خط‌چین وسط جاده اصلی */
createRoadLine({
    x: -1000,
    z: 7090,
    length: 18000,
    direction: "horizontal"
});

/* خط‌چین مسیر سمت چپ */
createRoadLine({
    x: -2000,
    z: 6100,
    length: 2000,
    direction: "vertical"
});

/* خط‌چین مسیر سمت راست */
createRoadLine({
    x: 1000,
    z: 6100,
    length: 2000,
    direction: "vertical"
});


// محله روبه‌روی کوه: ۲۰ خانه
const mountainVillageHouses = createVillageHouseGrid({
    centerX: -600,
    startZ: 4900,
    columns: 5,
    rows: 3,
    spacingX: 550,
    spacingZ: 500
});

// محله سمت چپ: ۳۰ خانه
const leftVillageHouses = createVillageHouseGrid({
    centerX: -3600,
    startZ: 5100,
    columns: 6,
    rows: 5,
    spacingX: 450,
    spacingZ: 400,
    wallColor: 0xCDB697,
    roofColor: 0x70442D,
    rotation: Math.PI / 2
});

// محله سمت راست: ۳۰ خانه
const rightVillageHouses = createVillageHouseGrid({
    centerX: 2400,
    startZ: 5100,
    columns: 6,
    rows: 5,
    spacingX: 450,
    spacingZ: 400,
    wallColor: 0xD5BE9A,
    roofColor: 0x69412B,
    rotation: Math.PI / -2
});



/**
 * چمن‌کاری سه محله روستا
 * در این مرحله خانه‌ها را مستقیماً از آرایه‌های محله می‌گیریم.
 */

// محله کوهستانی
const mountainGrass = createGrassBlades({
    x: -540,
    z: 5300,
    width: 3000,
    depth: 1500,
    houses: mountainVillageHouses,
    count: 600
});

// محله سمت چپ
const leftVillageGrass = createGrassBlades({
    x: -3700,
    z: 5800,
    width: 3300,
    depth: 2400,
    houses: leftVillageHouses,
    count: 600
});

// محله سمت راست
const rightVillageGrass = createGrassBlades({
    x: 2650,
    z: 5800,
    width: 3200,
    depth: 2450,
    houses: rightVillageHouses,
    count: 600
});

// ثبت نواحی چمن برای تغییر رنگ تدریجی
registerNatureColorTarget(mountainGrass, 'grass');
registerNatureColorTarget(leftVillageGrass, 'grass');
registerNatureColorTarget(rightVillageGrass, 'grass');

console.table(natureColorTargets.map((target, index) => {
    const mesh = target.mesh;
    const dry = mesh?.userData?.dryInstanceColors;
    const green = mesh?.userData?.greenInstanceColors;

    return {
        index,
        isInstancedMesh: Boolean(mesh?.isInstancedMesh),
        count: mesh?.count ?? 0,
        dryColors: dry?.length ?? 0,
        greenColors: green?.length ?? 0,
        hasInstanceColor: Boolean(mesh?.instanceColor)
    };
}));

/**
 * ساخت مستقل درخت‌های پشت محله‌های لیان
 * این تابع مخزن تنه و تاج مخصوص خودش را دارد.
 */
function createBackgroundVillageTrees({
    houses = [],
    leftCount = 700,
    rightCount = 800
} = {}) {
    // جلوگیری از ساخت مخزن با ظرفیت نامعتبر
    leftCount = Math.max(0, Math.floor(leftCount));
    rightCount = Math.max(0, Math.floor(rightCount));

    const totalCount = leftCount + rightCount;

    if (totalCount === 0) return null;

    // هندسه‌ی تنه و سه گونه‌ی تاج
    const trunkGeometry = new THREE.CylinderGeometry(5, 8, 65, 7);
    const roundGeometry = new THREE.SphereGeometry(27, 10, 8);
    const naturalGeometry = new THREE.IcosahedronGeometry(30, 1);
    const coniferGeometry = new THREE.ConeGeometry(25, 55, 8);

    const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 1
    });

    const crownMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 1,
        flatShading: true
    });

    // مخزن‌های مستقل؛ هیچ‌کدام با درخت‌های داخل محله مشترک نیستند
    const trunks = new THREE.InstancedMesh(
        trunkGeometry, trunkMaterial, totalCount
    );

    const roundCrowns = new THREE.InstancedMesh(
        roundGeometry, crownMaterial, totalCount * 3
    );

    const naturalCrowns = new THREE.InstancedMesh(
        naturalGeometry, crownMaterial, totalCount * 3
    );

    const coniferCrowns = new THREE.InstancedMesh(
        coniferGeometry, crownMaterial, totalCount * 3
    );

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    let trunkIndex = 0;
    let roundIndex = 0;
    let naturalIndex = 0;
    let coniferIndex = 0;

    // ذخیره رنگ اولیه و رنگ‌های مقصد برای هر نمونه از تاج درخت
    const crownColorTargets = [
        {
            mesh: roundCrowns,
            dryInstanceColors: [],
            greenInstanceColors: []
        },
        {
            mesh: naturalCrowns,
            dryInstanceColors: [],
            greenInstanceColors: []
        },
        {
            mesh: coniferCrowns,
            dryInstanceColors: [],
            greenInstanceColors: []
        }
    ];

    // نواحی مستقل پشت دو محله
    // فرض این است که پشت محله‌ها در جهت کاهش z قرار دارد.
    const areas = [
        {
            name: "چپ",
            x: -8000,
            z: 6100,
            width: 5000,
            depth: 2100,
            count: leftCount
        },
        {
            name: "راست",
            x: 7200,
            z: 6200,
            width: 5000,
            depth: 2100,
            count: rightCount
        }
    ];

    // جلوگیری از کاشت روی خانه‌ها، جاده‌ها و میدان
    function isBlocked(x, z) {
        const nearHouse = houses.some((house) => {
            if (!house || !house.position) return false;

            return (
                Math.abs(x - house.position.x) < 200 &&
                Math.abs(z - house.position.z) < 200
            );
        });

        if (nearHouse) return true;

        if (Math.abs(z - 7100) < 150) return true;

        const nearLeftRoad =
            Math.abs(x + 2000) < 105 &&
            z > 4900 && z < 7250;

        const nearRightRoad =
            Math.abs(x - 1000) < 105 &&
            z > 4900 && z < 7250;

        if (nearLeftRoad || nearRightRoad) return true;

        const nearSquare =
            Math.abs(x + 600) < 1400 &&
            Math.abs(z - 6500) < 550;

        return nearSquare;
    }

    // ساخت یک درخت کامل با تنه و سه بخش تاج
    function addTree(x, z) {
        const scale = 0.95 + Math.random() * 0.95;

        // تنه از سطح زمین شروع می‌شود
        dummy.position.set(x, 32.5 * scale, z);
        dummy.rotation.set(0, Math.random() * Math.PI, 0);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();

        trunks.setMatrixAt(trunkIndex, dummy.matrix);

        color.setHSL(
            0.055 + Math.random() * 0.025,
            0.35 + Math.random() * 0.15,
            0.22 + Math.random() * 0.12
        );

        trunks.setColorAt(trunkIndex, color);
        trunkIndex++;

        // انتخاب گونه‌ی درخت
        const species = Math.floor(Math.random() * 3);

        let crownMesh;
        let parts;

        if (species === 0) {
            crownMesh = roundCrowns;
            parts = [
                [0, 82, 0, 1],
                [-10, 91, 2, 0.78],
                [9, 90, -3, 0.82]
            ];
        } else if (species === 1) {
            crownMesh = naturalCrowns;
            parts = [
                [0, 82, 0, 1],
                [-10, 91, 2, 0.78],
                [9, 90, -3, 0.82]
            ];
        } else {
            crownMesh = coniferCrowns;
            parts = [
                [0, 78, 0, 1],
                [0, 91, 0, 0.72],
                [0, 101, 0, 0.48]
            ];
        }

        for (const part of parts) {
            dummy.position.set(
                x + part[0] * scale,
                part[1] * scale,
                z + part[2] * scale
            );

            dummy.rotation.set(0, Math.random() * Math.PI, 0);
            dummy.scale.setScalar(scale * part[3]);
            dummy.updateMatrix();

            let index;

            if (species === 0) {
                index = roundIndex++;
            } else if (species === 1) {
                index = naturalIndex++;
            } else {
                index = coniferIndex++;
            }

            crownMesh.setMatrixAt(index, dummy.matrix);

            color.setHSL(
                0.09 + Math.random() * 0.025,
                0.12 + Math.random() * 0.10,
                0.22 + Math.random() * 0.10
            );


            crownMesh.setColorAt(index, color);

            // ثبت رنگ خشک واقعی و رنگ سبز مقصد همین نمونه
            const target = crownColorTargets.find(
                (item) => item.mesh === crownMesh
            );

            if (target) {
                target.dryInstanceColors[index] = color.clone();

                const lightGreen = new THREE.Color('#A8D18D');
                const darkGreen = new THREE.Color('#388E3C');

                target.greenInstanceColors[index] = lightGreen.clone()
                    .lerp(darkGreen, 0.5);
            }


        }
    }

    // هر منطقه فقط تعداد تعیین‌شده‌ی خودش را دریافت می‌کند
    for (const area of areas) {
        let placed = 0;
        let attempts = 0;
        const maxAttempts = area.count * 30;

        while (placed < area.count && attempts < maxAttempts) {
            attempts++;

            const x = area.x +
                (Math.random() - 0.5) * area.width;

            const z = area.z +
                (Math.random() - 0.5) * area.depth;

            if (isBlocked(x, z)) continue;

            addTree(x, z);
            placed++;
        }

        console.log(
            `درخت‌های پشت محله ${area.name}: ${placed} از ${area.count}`
        );
    }

    // ثبت تعداد واقعی نمونه‌ها
    trunks.count = trunkIndex;
    roundCrowns.count = roundIndex;
    naturalCrowns.count = naturalIndex;
    coniferCrowns.count = coniferIndex;

    // اتصال رنگ‌های ذخیره‌شده به اطلاعات هر مش
    for (const target of crownColorTargets) {
        target.mesh.userData.dryInstanceColors =
            target.dryInstanceColors;

        target.mesh.userData.greenInstanceColors =
            target.greenInstanceColors;
    }

    // به‌روزرسانی ماتریس‌ها و رنگ‌ها
    for (const mesh of [
        trunks,
        roundCrowns,
        naturalCrowns,
        coniferCrowns
    ]) {
        mesh.instanceMatrix.needsUpdate = true;

        if (mesh.instanceColor) {
            mesh.instanceColor.needsUpdate = true;
        }

        mesh.castShadow = mesh === trunks;
        mesh.receiveShadow = false;

        scene.add(mesh);
    }

    return {
        trunks,
        roundCrowns,
        naturalCrowns,
        coniferCrowns,
        treeCount: trunkIndex
    };
}

/**
 * ساخت مدل درخت سه‌بعدی سبک برای روستای لیان
 * تنه و تاج درخت‌ها از هندسه‌های مشترک استفاده می‌کنند.
 */
function createTreeModel({
    x = 0,
    z = 0,
    scale = 1,
    color = 0x43883B
} = {}) {
    const tree = new THREE.Group();

    // تنه قهوه‌ای درخت
    const trunkGeometry = new THREE.CylinderGeometry(
        3 * scale,
        5 * scale,
        36 * scale,
        6
    );

    const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0x79502D,
        roughness: 1
    });

    const trunk = new THREE.Mesh(
        trunkGeometry,
        trunkMaterial
    );

    trunk.position.y = 18 * scale;
    tree.add(trunk);

    // سه لایه تاج برای ایجاد ظاهر طبیعی‌تر
    const crownGeometry = new THREE.IcosahedronGeometry(
        19 * scale,
        1
    );

    const crownMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 1,
        flatShading: true
    });

    const crownPositions = [
        { x: 0, y: 43, z: 0, size: 1.00 },
        { x: -10, y: 53, z: 2, size: 0.78 },
        { x: 9, y: 52, z: -3, size: 0.82 }
    ];

    for (const part of crownPositions) {
        const crown = new THREE.Mesh(
            crownGeometry,
            crownMaterial
        );

        crown.position.set(
            part.x * scale,
            part.y * scale,
            part.z * scale
        );

        crown.scale.setScalar(part.size);
        tree.add(crown);
    }

    // قرار دادن درخت در مختصات موردنظر
    tree.position.set(x, 0, z);

    // سایه‌گذاری فقط برای تنه؛ تاج‌ها سبک می‌مانند.
    trunk.castShadow = true;
    trunk.receiveShadow = false;

    tree.traverse((object) => {
        if (object.isMesh && object !== trunk) {
            object.castShadow = false;
            object.receiveShadow = false;
        }
    });

    scene.add(tree);

    return tree;
}



/**
 * درخت‌کاری گروهی محله‌های روستای لیان
 * استفاده از InstancedMesh برای کاهش هزینه ترسیم درخت‌ها
 */
function createVillageTrees({
    houses = [],
    areas = []
} = {}) {
    // تعداد درخت‌ها از روی تنظیم هر محله تعیین می‌شود.
    const totalCount = areas.reduce(
        (sum, area) => sum + area.count,
        0
    );

    if (totalCount === 0) return;

    // تنه‌های بلندتر و ضخیم‌تر
    const trunkGeometry = new THREE.CylinderGeometry(5, 8, 65, 7);

    // هندسهٔ سه گونهٔ درختی
    const roundCrownGeometry = new THREE.SphereGeometry(27, 10, 8);
    const naturalCrownGeometry = new THREE.IcosahedronGeometry(30, 1);

    // هندسهٔ تاج درخت مخروطی، مانند سرو و کاج
    const coniferCrownGeometry = new THREE.ConeGeometry(25, 55, 8);

    // متریال‌ها برای استفاده مشترک
    const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 1
    });

    const crownMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 1,
        flatShading: true
    });

    // مخزن تنه‌های درخت‌ها
    const trunks = new THREE.InstancedMesh(
        trunkGeometry,
        trunkMaterial,
        totalCount
    );

    // مخزن تاج درخت‌های گرد
    const roundCrowns = new THREE.InstancedMesh(
        roundCrownGeometry,
        crownMaterial,
        totalCount * 3
    );


    // مخزن تاج درخت‌های طبیعی و نامنظم
    const naturalCrowns = new THREE.InstancedMesh(
        naturalCrownGeometry,
        crownMaterial,
        totalCount * 3
    );

    // مخزن تاج درخت‌های مخروطی
    const coniferCrowns = new THREE.InstancedMesh(
        coniferCrownGeometry,
        crownMaterial,
        totalCount * 3
    );

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    let treeIndex = 0;
    let roundIndex = 0;
    let naturalIndex = 0;
    let coniferIndex = 0;

    const crownColorTargets = [
        {
            mesh: roundCrowns,
            dryInstanceColors: [],
            greenInstanceColors: []
        },
        {
            mesh: naturalCrowns,
            dryInstanceColors: [],
            greenInstanceColors: []
        },
        {
            mesh: coniferCrowns,
            dryInstanceColors: [],
            greenInstanceColors: []
        }
    ];

    // جلوگیری از کاشت درخت روی خانه‌ها و مسیرها
    function isBlocked(x, z) {
        const nearHouse = houses.some((house) =>
            Math.abs(x - house.position.x) < 165 &&
            Math.abs(z - house.position.z) < 165
        );

        if (nearHouse) return true;

        // جاده‌ی اصلی در سراسر محدوده‌ی زمین
        if (Math.abs(z - 7100) < 150) {
            return true;
        }

        // جاده‌های اتصال محله‌ها
        const nearLeftRoad =
            Math.abs(x + 2000) < 105 &&
            z > 4900 && z < 7250;

        const nearRightRoad =
            Math.abs(x - 1000) < 105 &&
            z > 4900 && z < 7250;

        if (nearLeftRoad || nearRightRoad) return true;

        // فضای میدان مرکزی
        const nearSquare =
            Math.abs(x + 600) < 1400 &&
            Math.abs(z - 6500) < 550;

        return nearSquare;
    }

    for (const area of areas) {
        let placed = 0;
        let attempts = 0;
        const maxAttempts = area.count * 15;

        while (
            placed < area.count &&
            attempts < maxAttempts
        ) {
            attempts++;

            const x = area.x +
                (Math.random() - 0.5) * area.width;

            const z = area.z +
                (Math.random() - 0.5) * area.depth;

            if (isBlocked(x, z)) continue;

            // تفاوت طبیعی اندازه درخت‌ها
            const scale = 0.95 + Math.random() * 0.95;

            // تنه
            dummy.position.set(x, 32.5 * scale, z);
            dummy.rotation.set(0, Math.random() * 0.4, 0);
            dummy.scale.setScalar(scale);
            dummy.updateMatrix();

            trunks.setMatrixAt(treeIndex, dummy.matrix);

            color.setHSL(
                0.075 + Math.random() * 0.025,
                0.35 + Math.random() * 0.15,
                0.28 + Math.random() * 0.12
            );

            trunks.setColorAt(treeIndex, color);
            treeIndex++;
            // انتخاب تصادفی یکی از سه گونهٔ درختی
            const species = Math.floor(Math.random() * 3);

            let crownMesh;
            let crownIndex;

            if (species === 0) {
                crownMesh = roundCrowns;
                crownIndex = roundIndex;
            } else if (species === 1) {
                crownMesh = naturalCrowns;
                crownIndex = naturalIndex;
            } else {
                crownMesh = coniferCrowns;
                crownIndex = coniferIndex;
            }

            // ساخت تاج متناسب با گونهٔ انتخاب‌شده
            const layerCount = 3;

            for (let layer = 0; layer < layerCount; layer++) {
                const offsetX = layer === 0 ? 0 : (Math.random() - 0.5) * 15;
                const offsetZ = layer === 0 ? 0 : (Math.random() - 0.5) * 15;

                let layerScale;

                if (species === 2) {
                    // لایه‌های مخروطی برای ایجاد فرم سرو یا کاج
                    layerScale = [1, 0.72, 0.48][layer];
                    dummy.position.set(
                        x + offsetX * scale,
                        (60 + layer * 19) * scale,
                        z + offsetZ * scale
                    );
                } else {
                    // تاج چندبخشی برای درخت گرد و درخت طبیعی
                    layerScale = layer === 0 ? 1 : 0.65 + Math.random() * 0.2;

                    dummy.position.set(
                        x + offsetX * scale,
                        (82 + layer * 8) * scale,
                        z + offsetZ * scale
                    );
                }

                dummy.rotation.set(
                    0,
                    Math.random() * Math.PI,
                    0
                );

                dummy.scale.set(
                    scale * layerScale,
                    scale * layerScale,
                    scale * layerScale
                );

                dummy.updateMatrix();

                crownMesh.setMatrixAt(crownIndex, dummy.matrix);

                // تنوع طبیعی رنگ تاج‌ها
                color.setHSL(
                    0.09 + Math.random() * 0.025,
                    0.12 + Math.random() * 0.10,
                    0.22 + Math.random() * 0.10
                );

                crownMesh.setColorAt(crownIndex, color);

                crownIndex++;

                crownMesh.setColorAt(crownIndex, color);

                // ذخیره رنگ اولیه و رنگ سبز مقصد
                const target = crownColorTargets.find(
                    (item) => item.mesh === crownMesh
                );

                if (target) {
                    target.dryInstanceColors[crownIndex] = color.clone();

                    target.greenInstanceColors[crownIndex] =
                        new THREE.Color('#A8D18D').lerp(
                            new THREE.Color('#388E3C'),
                            0.5
                        );
                }

                crownIndex++;

                // به‌روزرسانی شمارندهٔ گونهٔ انتخاب‌شده
                if (species === 0) {
                    roundIndex++;
                } else if (species === 1) {
                    naturalIndex++;
                } else {
                    coniferIndex++;
                }
            }
        }
    }

    // فقط نمونه‌هایی که واقعاً ساخته شده‌اند رندر شوند.
    trunks.count = treeIndex;
    roundCrowns.count = roundIndex;
    naturalCrowns.count = naturalIndex;
    coniferCrowns.count = coniferIndex;

    // اتصال رنگ‌های ذخیره‌شده به مش‌های تاج درخت‌ها
    for (const target of crownColorTargets) {
        target.mesh.userData.dryInstanceColors =
            target.dryInstanceColors;

        target.mesh.userData.greenInstanceColors =
            target.greenInstanceColors;
    }

    trunks.instanceMatrix.needsUpdate = true;
    roundCrowns.instanceMatrix.needsUpdate = true;
    naturalCrowns.instanceMatrix.needsUpdate = true;
    coniferCrowns.instanceMatrix.needsUpdate = true;

    if (trunks.instanceColor) {
        trunks.instanceColor.needsUpdate = true;
    }

    if (roundCrowns.instanceColor) {
        roundCrowns.instanceColor.needsUpdate = true;
    }

    coniferCrowns.castShadow = false;
    coniferCrowns.receiveShadow = false;

    if (naturalCrowns.instanceColor) {
        naturalCrowns.instanceColor.needsUpdate = true;
    }

    // به‌روزرسانی رنگ تاج درخت‌های مخروطی
    if (coniferCrowns.instanceColor) {
        coniferCrowns.instanceColor.needsUpdate = true;
    }

    trunks.castShadow = true;
    trunks.receiveShadow = false;

    // سایه تاج‌ها غیرفعال است تا هزینه رندر کمتر شود.
    roundCrowns.castShadow = false;
    roundCrowns.receiveShadow = false;
    naturalCrowns.castShadow = false;
    naturalCrowns.receiveShadow = false;

    scene.add(trunks);
    scene.add(roundCrowns);
    scene.add(naturalCrowns);
    scene.add(coniferCrowns);

    return {
    trunks,
    roundCrowns,
    naturalCrowns,
    coniferCrowns,
    treeCount: treeIndex
};
}


/**
 * درخت‌کاری با تراکم متوسط در سه محله
 */

// ترکیب خانه‌های سه محله برای جلوگیری از کاشت درخت
// در محدوده خانه‌ها
const allVillageHouses = [
    ...mountainVillageHouses,
    ...leftVillageHouses,
    ...rightVillageHouses
];

const villageTrees = createVillageTrees({
    houses: allVillageHouses,

    areas: [
        {
            // محله کوهستانی
            x: -740,
            z: 5300,
            width: 3000,
            depth: 1500,
            count: 10
        },
        {
            // محله سمت چپ
            x: -3700,
            z: 5800,
            width: 3300,
            depth: 2400,
            count: 15
        },
        {
            // محله سمت راست
            x: 2650,
            z: 5800,
            width: 3200,
            depth: 2450,
            count: 15
        },

        {
            // جنگل پشت رودخانه؛ مقادیر اولیه برای آزمایش
            x: -1000,
            z: 12700,
            width: 19000,
            depth: 7000,
            count: 5000
        }

    ]
});

const backgroundVillageTrees = createBackgroundVillageTrees({
    houses: allVillageHouses,
    leftCount: 700,
    rightCount: 800
});

// ثبت تاج‌های درخت‌های داخل محله‌ها برای سبز شدن تدریجی
if (villageTrees) {
    registerNatureColorTarget(villageTrees.roundCrowns, 'tree');
    registerNatureColorTarget(villageTrees.naturalCrowns, 'tree');
    registerNatureColorTarget(villageTrees.coniferCrowns, 'tree');
}

// ثبت تاج‌های درختان پس‌زمینه برای سبز شدن تدریجی
if (backgroundVillageTrees) {
    registerNatureColorTarget(
        backgroundVillageTrees.roundCrowns,
        'tree'
    );

    registerNatureColorTarget(
        backgroundVillageTrees.naturalCrowns,
        'tree'
    );

    registerNatureColorTarget(
        backgroundVillageTrees.coniferCrowns,
        'tree'
    );
}

/**
 * ساخت جنگل دو طرف رودخانه‌ی لیان
 * این تابع مستقل از درخت‌های روستا و پشت خانه‌هاست.
 */
function createRiverEdgeForest({
    riverCurve,
    leftBankDistance = 450,
    rightBankDistance = 450,
    bankSpread = 350,
    leftCount = 250,
    rightCount = 250
} = {}) {
    if (!riverCurve) {
        console.warn("مسیر رودخانه برای جنگل مشخص نشده است.");
        return null;
    }

    const totalCount = leftCount + rightCount;

    if (totalCount <= 0) return null;

    const trunkGeometry =
        new THREE.CylinderGeometry(3, 5, 36, 6);

    const roundGeometry =
        new THREE.SphereGeometry(19, 10, 8);

    const naturalGeometry =
        new THREE.IcosahedronGeometry(19, 1);

    const coniferGeometry =
        new THREE.ConeGeometry(19, 38, 8);

    const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        roughness: 1
    });

    const crownMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        roughness: 1,
        flatShading: true
    });

    const trunks = new THREE.InstancedMesh(
        trunkGeometry, trunkMaterial, totalCount
    );

    const roundCrowns = new THREE.InstancedMesh(
        roundGeometry, crownMaterial, totalCount * 3
    );

    const naturalCrowns = new THREE.InstancedMesh(
        naturalGeometry, crownMaterial, totalCount * 3
    );

    const coniferCrowns = new THREE.InstancedMesh(
        coniferGeometry, crownMaterial, totalCount * 3
    );


    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    const crownColorTargets = [
        {
            mesh: roundCrowns,
            dryInstanceColors: [],
            greenInstanceColors: []
        },
        {
            mesh: naturalCrowns,
            dryInstanceColors: [],
            greenInstanceColors: []
        },
        {
            mesh: coniferCrowns,
            dryInstanceColors: [],
            greenInstanceColors: []
        }
    ];

    let trunkIndex = 0;
    let roundIndex = 0;
    let naturalIndex = 0;
    let coniferIndex = 0;


    // ساخت یک درخت با تنه و سه بخش تاج
    function addTree(x, z) {
        const scale = 1.4 + Math.random() * 0.6;

        dummy.position.set(x, 18 * scale, z);
        dummy.rotation.set(0, Math.random() * Math.PI, 0);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();

        trunks.setMatrixAt(trunkIndex, dummy.matrix);

        color.setHSL(
            0.055 + Math.random() * 0.025,
            0.35 + Math.random() * 0.15,
            0.22 + Math.random() * 0.12
        );

        trunks.setColorAt(trunkIndex++, color);

        const species = Math.floor(Math.random() * 3);

        let crownMesh;
        let parts;

        if (species === 0) {
            crownMesh = roundCrowns;
            parts = [
                [0, 43, 0, 1],
                [-8, 51, 2, 0.75],
                [8, 51, -2, 0.8]
            ];
        } else if (species === 1) {
            crownMesh = naturalCrowns;
            parts = [
                [0, 43, 0, 1],
                [-8, 51, 2, 0.75],
                [8, 50, -2, 0.8]
            ];
        } else {
            crownMesh = coniferCrowns;
            parts = [
                [0, 43, 0, 1],
                [0, 56, 0, 0.72],
                [0, 66, 0, 0.48]
            ];
        }

        for (const part of parts) {
            dummy.position.set(
                x + part[0] * scale,
                part[1] * scale,
                z + part[2] * scale
            );

            dummy.rotation.set(0, Math.random() * Math.PI, 0);
            dummy.scale.setScalar(scale * part[3]);
            dummy.updateMatrix();

            let index;

            if (species === 0) {
                index = roundIndex++;
            } else if (species === 1) {
                index = naturalIndex++;
            } else {
                index = coniferIndex++;
            }

            crownMesh.setMatrixAt(index, dummy.matrix);

            color.setHSL(
                 0.09 + Math.random() * 0.025,
                0.12 + Math.random() * 0.10,
                0.22 + Math.random() * 0.10
            );


            crownMesh.setColorAt(index, color);

            // ذخیرهٔ رنگ اولیه و رنگ مقصد سبز برای هر تاج
            const target = crownColorTargets.find(
                (item) => item.mesh === crownMesh
            );

            if (target) {
                target.dryInstanceColors[index] = color.clone();

                target.greenInstanceColors[index] =
                    color.clone().lerp(
                        new THREE.Color('#388E3C'),
                        0.78
                    );
            }

        }
    }


    // کاشت درخت در دو طرف رودخانه، با رعایت محدودهٔ جاده‌ها
    function plantSide(count, side, distance) {
        let placed = 0;
        let attempts = 0;
        const maxAttempts = count * 30;

        // لبهٔ پشتی جنگل سمت دور از جاده، یک خط صاف است.
        const backForestZ = 9200;

        while (placed < count && attempts < maxAttempts) {
            attempts++;

            const progress = Math.random() * 0.999;
            const point = riverCurve.getPoint(progress);
            const tangent = riverCurve.getTangent(progress);

            const normalX = -tangent.z;
            const normalZ = tangent.x;

            let x;
            let z;

            if (side === 1) {
                // لبهٔ جلویی جنگل از مسیر رودخانه پیروی می‌کند.
                const frontX = point.x + normalX * distance;
                const frontZ = point.z + normalZ * distance;

                // درخت‌ها بین لبهٔ منحنی و لبهٔ پشتی صاف قرار می‌گیرند.
                if (frontZ >= backForestZ - 40) continue;

                x = frontX + (Math.random() - 0.5) * bankSpread * 0.35;
                z = frontZ + Math.random() * (backForestZ - frontZ);
            } else {
                // سمت جاده: فاصله از رودخانه حفظ می‌شود.
                const offset = distance + Math.random() * bankSpread;

                x = point.x + normalX * side * offset;
                z = point.z + normalZ * side * offset;
            }

            // محدودهٔ مجاز صحنه
            if (x < -12000 || x > 12000) continue;
            if (z < 6800 || z > 11000) continue;

            // جادهٔ اصلی در امتداد محور X
            if (Math.abs(z - 7100) < 160) continue;

            // دو جادهٔ اتصال به جادهٔ اصلی
            const nearConnectorRoad =
                (Math.abs(x - (-2000)) < 100 ||
                 Math.abs(x - 1000) < 100) &&
                z >= 4900 && z <= 7260;

            if (nearConnectorRoad) continue;

            addTree(x, z);
            placed++;
        }

        return placed;
    }


    const leftPlaced =
        plantSide(leftCount, -1, leftBankDistance);

    const rightPlaced =
        plantSide(rightCount, 1, rightBankDistance);

    trunks.count = trunkIndex;
    roundCrowns.count = roundIndex;
    naturalCrowns.count = naturalIndex;
    coniferCrowns.count = coniferIndex;

    // اتصال رنگ‌های اولیه و مقصد سبز به تاج‌های کنار رودخانه
    for (const target of crownColorTargets) {
        target.mesh.userData.dryInstanceColors =
            target.dryInstanceColors;

        target.mesh.userData.greenInstanceColors =
            target.greenInstanceColors;
    }

    for (const mesh of [
        trunks,
        roundCrowns,
        naturalCrowns,
        coniferCrowns
    ]) {
        mesh.instanceMatrix.needsUpdate = true;

        if (mesh.instanceColor) {
            mesh.instanceColor.needsUpdate = true;
        }

        mesh.castShadow = mesh === trunks;
        mesh.receiveShadow = false;
        scene.add(mesh);
    }

    console.log(
        `درخت‌های کنار رودخانه: سمت اول ${leftPlaced}، سمت دوم ${rightPlaced}`
    );

    return {
        trunks,
        roundCrowns,
        naturalCrowns,
        coniferCrowns,
        leftPlaced,
        rightPlaced
    };
}

/**
 * ساخت جنگل در امتداد رودخانه‌ی لیان
 * درخت‌ها با نمونه‌سازی گروهی ساخته می‌شوند تا هزینه‌ی رندر کاهش یابد.
 */
function createRiverForest({
    riverCurve,
    roadZ = 7100,
    roadsideCount = 100,
    forestCount = 300,
    bankWidth = 220,
    roadsideDistance = 260,
    forestDistance = 520,
    forestDepth = 1800
} = {}) {
    if (!riverCurve) {
        console.warn("مسیر رودخانه برای ساخت جنگل مشخص نشده است.");
        return null;
    }

    // هندسه‌ی تنه و سه گونه‌ی تاج درخت
    const trunkGeometry = new THREE.CylinderGeometry(3, 5, 36, 6);
    const roundCrownGeometry = new THREE.SphereGeometry(19, 10, 8);
    const naturalCrownGeometry = new THREE.IcosahedronGeometry(19, 1);
    const coniferCrownGeometry = new THREE.ConeGeometry(19, 38, 8);

    const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0x79502D,
        roughness: 1
    });

    const crownMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        roughness: 1,
        flatShading: true
    });

    const totalTrees = roadsideCount + forestCount;

    // مخزن تنه‌ها
    const trunks = new THREE.InstancedMesh(
        trunkGeometry,
        trunkMaterial,
        totalTrees
    );

    // مخزن تاج هر گونه؛ هر درخت حداکثر سه بخش تاج دارد
    const roundCrowns = new THREE.InstancedMesh(
        roundCrownGeometry,
        crownMaterial,
        totalTrees * 3
    );

    const naturalCrowns = new THREE.InstancedMesh(
        naturalCrownGeometry,
        crownMaterial,
        totalTrees * 3
    );

    const coniferCrowns = new THREE.InstancedMesh(
        coniferCrownGeometry,
        crownMaterial,
        totalTrees * 3
    );

    const dummy = new THREE.Object3D();
    const instanceColor = new THREE.Color();

    let trunkIndex = 0;
    let roundIndex = 0;
    let naturalIndex = 0;
    let coniferIndex = 0;

    /**
     * یک درخت تصادفی از سه گونه را به مخزن‌های مشترک اضافه می‌کند.
     */
    function addTree(x, z, scale) {
        const greenHue = 0.27 + Math.random() * 0.07;

        // ساخت تنه
        dummy.position.set(x, 18 * scale, z);
        dummy.rotation.set(0, Math.random() * Math.PI, 0);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();

        trunks.setMatrixAt(trunkIndex, dummy.matrix);

        instanceColor.setHSL(
            0.055 + Math.random() * 0.025,
            0.35 + Math.random() * 0.15,
            0.22 + Math.random() * 0.12
        );

        trunks.setColorAt(trunkIndex, instanceColor);
        trunkIndex++;

        // انتخاب تصادفی گونه‌ی درخت
        const species = Math.floor(Math.random() * 3);

        let crownMesh;
        let crownParts;

        if (species === 0) {
            // درخت با تاج گرد
            crownMesh = roundCrowns;

            crownParts = [
                { x: 0, y: 43, z: 0, size: 1 },
                { x: -10, y: 53, z: 2, size: 0.78 },
                { x: 9, y: 52, z: -3, size: 0.82 }
            ];
        } else if (species === 1) {
            // درخت با تاج طبیعی و نامنظم
            crownMesh = naturalCrowns;

            crownParts = [
                { x: 0, y: 43, z: 0, size: 1 },
                { x: -10, y: 51, z: 2, size: 0.78 },
                { x: 9, y: 50, z: -3, size: 0.82 }
            ];
        } else {
            // درخت مخروطی با سه لایه‌ی روی‌هم
            crownMesh = coniferCrowns;

            crownParts = [
                { x: 0, y: 43, z: 0, size: 1 },
                { x: 0, y: 56, z: 0, size: 0.72 },
                { x: 0, y: 66, z: 0, size: 0.48 }
            ];
        }

        // ثبت بخش‌های تاج در مخزن گونه‌ی انتخاب‌شده
        for (const part of crownParts) {
            dummy.position.set(
                x + part.x * scale,
                part.y * scale,
                z + part.z * scale
            );

            dummy.rotation.set(
                0,
                Math.random() * Math.PI,
                0
            );

            dummy.scale.setScalar(scale * part.size);
            dummy.updateMatrix();

            let crownIndex;

            if (species === 0) {
                crownIndex = roundIndex++;
            } else if (species === 1) {
                crownIndex = naturalIndex++;
            } else {
                crownIndex = coniferIndex++;
            }

            crownMesh.setMatrixAt(crownIndex, dummy.matrix);

            instanceColor.setHSL(
                greenHue,
                0.40 + Math.random() * 0.18,
                0.25 + Math.random() * 0.16
            );

            crownMesh.setColorAt(crownIndex, instanceColor);
        }
    }

    /**
     * درخت‌ها را در امتداد رودخانه قرار می‌دهد.
     * جهت عمود بر مسیر برای تعیین سمت رودخانه استفاده می‌شود.
     */
    function plantAlongRiver(count, distance, spread, startT, endT, side) {
        let placed = 0;
        let attempts = 0;
        const maxAttempts = count * 20;

        while (placed < count && attempts < maxAttempts) {
            attempts++;

            const t = startT + Math.random() * (endT - startT);
            const point = riverCurve.getPoint(t);
            const tangent = riverCurve.getTangent(t);

            // بردار عمود بر جهت حرکت رودخانه
            const normalX = -tangent.z;
            const normalZ = tangent.x;

            const offset = distance + Math.random() * spread;

            let x = point.x + normalX * side * offset;
            let z = point.z + normalZ * side * offset;

            // تعیین سمت هدف بر اساس موقعیت رودخانه
            if (side === 1 && z < point.z) {
                x = point.x - normalX * offset;
                z = point.z - normalZ * offset;
            }

            // جلوگیری از کاشت در محدوده‌ی جاده
            if (Math.abs(z - roadZ) < 150) continue;

            // محدودکردن کاشت به محدوده‌ی زمین موجود
            if (x < -12000 || x > 4900) continue;
            if (z < 6900 || z > 10400) continue;

            const scale = 0.85 + Math.random() * 0.85;

            addTree(x, z, scale);
            placed++;
        }

        return placed;
    }

    // سمت جاده: درخت‌کاری پراکنده
    const roadsidePlaced = plantAlongRiver(
        roadsideCount,
        bankWidth / 2 + roadsideDistance,
        280,
        0.12,
        0.98,
        -1
    );

    // سمت دور از جاده: جنگل متراکم
    const forestPlaced = plantAlongRiver(
        forestCount,
        bankWidth / 2 + forestDistance,
        forestDepth,
        0.02,
        1,
        1
    );

    // تعداد نمونه‌های ثبت‌شده در هر مخزن
    trunks.count = trunkIndex;
    roundCrowns.count = roundIndex;
    naturalCrowns.count = naturalIndex;
    coniferCrowns.count = coniferIndex;


    // به‌روزرسانی ماتریس‌ها
    trunks.instanceMatrix.needsUpdate = true;
    roundCrowns.instanceMatrix.needsUpdate = true;
    naturalCrowns.instanceMatrix.needsUpdate = true;
    coniferCrowns.instanceMatrix.needsUpdate = true;

    // به‌روزرسانی رنگ نمونه‌ها
    for (const mesh of [
        trunks,
        roundCrowns,
        naturalCrowns,
        coniferCrowns
    ]) {
        if (mesh.instanceColor) {
            mesh.instanceColor.needsUpdate = true;
        }
    }

    // تنظیم سایه‌ها
    trunks.castShadow = true;
    trunks.receiveShadow = false;

    roundCrowns.castShadow = false;
    naturalCrowns.castShadow = false;
    coniferCrowns.castShadow = false;

    roundCrowns.receiveShadow = false;
    naturalCrowns.receiveShadow = false;
    coniferCrowns.receiveShadow = false;

    // افزودن تمام گونه‌ها به صحنه
    scene.add(
        trunks,
        roundCrowns,
        naturalCrowns,
        coniferCrowns
    );

    console.log(
        `درخت‌های حاشیه رودخانه: ${roadsidePlaced}، ` +
        `درخت‌های جنگل: ${forestPlaced}`
    );


    return {
        trunks,
        roundCrowns,
        naturalCrowns,
        coniferCrowns,
        roadsidePlaced,
        forestPlaced
    };
}

// نگهداری کوه‌ها برای کاشت سنگ، بوته و درخت
const mountainRanges = [];

// ============================================================
// 11) تابع ساخت یک رشته‌کوه سه‌بعدی
// ============================================================
//
// نکته بسیار مهم:
//
// مختصات کوه دیگر x و z جهانی نیستند.
//
// هندسه داخل مختصات محلی خودش ساخته می‌شود:
//
//       مرکز کوه
//          ↓
//      ┌─────────┐
//      │   کوه   │
//      └─────────┘
//
// سپس خود Group در موقعیت موردنظر جهان قرار می‌گیرد.
//
// نتیجه:
// هر کوه می‌تواند حول محور Y خودش بچرخد.
// ============================================================

function createMountainRange({

    x = 0,

    z = -1000,

    width = 3000,

    height = 700,

    depth = 900,

    color = 0x888888,

    arcDepth = 0,

    rotationY = 0,

    // صاف‌کردن قله فقط برای کوه انتخاب‌شده
    flattenTop = false,
    plateauY = 1660

}) {

    // --------------------------------------------------------
    // گروه مستقل این کوه
    // --------------------------------------------------------

    const group =
        new THREE.Group();


    // --------------------------------------------------------
    // تعداد قطعات افقی
    // --------------------------------------------------------

    const segments =
        60;


    // --------------------------------------------------------
    // تعداد قطعات عمقی
    // --------------------------------------------------------

    const depthSegments =
        24;


    // --------------------------------------------------------
    // نقاط اصلی خط کوه
    // --------------------------------------------------------

    const points = [];


    for (
        let i = 0;
        i <= segments;
        i++
    ) {

        const t =
            i / segments;


        const px =
            (t - 0.5) *
            width;


        const normalized =
            Math.abs(
                t - 0.5
            ) * 2;


        // ----------------------------------------------------
        // فرم اصلی کوه
        // ----------------------------------------------------

        const baseArc =
            Math.pow(
                Math.max(
                    0,
                    1 -
                    normalized *
                    normalized
                ),
                0.75
            );


        // ----------------------------------------------------
        // موج‌های طبیعی سطح کوه
        // ----------------------------------------------------

        const wave1 =
            Math.sin(
                t *
                Math.PI *
                1
            ) * 0.15;


        const wave2 =
            Math.sin(
                t *
                Math.PI *
                7
            ) * 0.08;


        const wave3 =
            Math.sin(
                t *
                Math.PI *
                20
            ) * 0.04;


        const mountainShape =
            Math.max(
                0.15,
                baseArc +
                wave1 +
                wave2 +
                wave3
            );


        const py =
            100 +
            mountainShape *
            height;


        points.push({
            x: px,
            y: py
        });
    }


    // ========================================================
    // ساخت Vertexها
    // ========================================================

    const vertices = [];


    const indices = [];


    for (
        let depthIndex = 0;
        depthIndex <= depthSegments;
        depthIndex++
    ) {

        const depthT =
            depthIndex /
            depthSegments;


        const depthNormalized =
            (depthT - 0.5) *
            2;


        // ----------------------------------------------------
        // فرم حجم کوه در عمق
        // ----------------------------------------------------

        const depthProfile =
            Math.pow(
                Math.max(
                    0,
                    1 -
                    depthNormalized *
                    depthNormalized
                ),
                0.65
            );


        const depthOffset =
            depthNormalized *
            depth;


        for (
            let i = 0;
            i <= segments;
            i++
        ) {

            const p =
                points[i];



            const py =
                60 +
                (p.y - 10) *
                depthProfile;

            // موج‌های طبیعی سطح کوه
            const terrainWave =
                Math.sin(
                    i * 10 +
                    depthIndex * 1.8
                ) *
                5 *
                depthProfile;

            // ارتفاع طبیعی کوه پیش از صاف‌کردن قله
            const naturalY = Math.max(
                2,
                py + terrainWave
            );

            // مختصات محلی در عرض و عمق کوه
            const normalizedX =
                i / segments - 0.5;

            // فاصلهٔ نسبی از مرکز محوطه
            const plateauDistance = Math.sqrt(
                Math.pow(normalizedX / 0.16, 2) +
                Math.pow(depthNormalized / 0.28, 2)
            );

            const plateauBlend = flattenTop
                ? 1 - THREE.MathUtils.smoothstep(
                    plateauDistance,
                    0.85,
                    1.15
                )
                : 0;

            // ترکیب سطح طبیعی کوه با سطح صاف قله
            const finalY = THREE.MathUtils.lerp(
                naturalY,
                plateauY,
                plateauBlend
            );



            // ------------------------------------------------
            // خم طبیعی خود کوه
            //
            // این مقدار فقط شکل خود کوه را خم می‌کند.
            // چرخش کلی کوه در rotationY انجام می‌شود.
            // ------------------------------------------------

            const arcAmount =
                normalizedX *
                normalizedX;


            const curvedZ =
                arcAmount *
                arcDepth;


            // ------------------------------------------------
            // نکته مهم:
            //
            // x و z دیگر مختصات جهانی نیستند.
            //
            // این مختصات محلی خود کوه هستند.
            // ------------------------------------------------

            vertices.push(
                p.x,
                finalY,
                curvedZ +
                depthOffset
            );
        }
    }


    // ========================================================
    // ساخت مثلث‌های سطح
    // ========================================================

    for (
        let depthIndex = 0;
        depthIndex < depthSegments;
        depthIndex++
    ) {

        for (
            let i = 0;
            i < segments;
            i++
        ) {

            const rowA =
                depthIndex *
                (segments + 1);


            const rowB =
                (depthIndex + 1) *
                (segments + 1);


            const a =
                rowA + i;


            const b =
                rowA + i + 1;


            const c =
                rowB + i;


            const d =
                rowB + i + 1;


            indices.push(
                a,
                c,
                b
            );


            indices.push(
                b,
                c,
                d
            );
        }
    }


    // ========================================================
    // ساخت Geometry
    // ========================================================

    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(
            vertices,
            3
        )
    );


    geometry.setIndex(
        indices
    );


    geometry.computeVertexNormals();



    // ============================================================
    // متریال کوه؛ آماده برای تغییر از خشکی به سرسبزی
    // ============================================================

    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 1,
        metalness: 0,
        side: THREE.DoubleSide
    });

    const mountain = new THREE.Mesh(geometry, material);

    // رنگ آغاز داستان: سنگی و خشک
    mountain.userData.dryColor = new THREE.Color(color);

    // رنگ کوه پس از تولد نورسا: سنگ طبیعی با پوشش سبز
    mountain.userData.greenColor = new THREE.Color(color)
        .lerp(new THREE.Color(0x286B2B), 0.78);

    mountain.castShadow = false;
    mountain.receiveShadow = false;

    group.add(mountain);



    // ========================================================
    // قرار دادن گروه در جهان
    //
    // حالا x و z موقعیت خود کوه هستند.
    // ========================================================

    group.position.set(
        x,
        0,
        z
    );


    // ========================================================
    // چرخش مستقل کوه حول محور عمودی خودش
    //
    // محور Y = محور عمودی
    // ========================================================

    group.rotation.y =
        rotationY;


    // ========================================================
    // اضافه کردن کوه به صحنه
    // ========================================================

    // اضافه کردن کوه به صحنه
    scene.add(group);

    // ثبت کوه برای استفاده در سیستم پوشش کوهستان
    mountainRanges.push(group);

    // ثبت سطح کوه برای تغییر تدریجی رنگ
    registerNatureColorTarget(mountain, 'mountain');

    return group;
}


/**
 * تغییر تدریجی رنگ کوه‌ها از خشکی به سرسبزی
 *
 * progress = 0  یعنی جهان خشک است
 * progress = 1  یعنی کوه‌ها به رنگ سبز رسیده‌اند
 * مقادیر بین این دو، تغییر تدریجی ایجاد می‌کنند.
 */


function setWorldGreening(progress) {
    const amount = THREE.MathUtils.clamp(progress, 0, 1);

    for (const target of natureColorTargets) {
        const mesh = target?.mesh;

        if (!mesh) continue;

        // رودخانه: تغییر تدریجی رنگ آب از رنگ اولیه به سبز
        if (
            target.type === 'river' &&
            mesh.isMesh &&
            mesh.userData?.dryColor &&
            mesh.userData?.greenColor
        ) {
            mesh.material.color.copy(
                mesh.userData.dryColor
            ).lerp(
                mesh.userData.greenColor,
                amount
            );

            continue;
        }

        // کوه‌ها: تغییر رنگ متریال از خشک به سبز
        if (
            target.type === 'mountain' &&
            mesh.isMesh &&
            mesh.userData?.dryColor &&
            mesh.userData?.greenColor
        ) {
            mesh.material.color.copy(
                mesh.userData.dryColor
            ).lerp(
                mesh.userData.greenColor,
                amount
            );

            continue;
        }

        // زمین‌ها: تغییر تدریجی رنگ از حالت خشک به سبز
        if (
            target.type === 'ground' &&
            mesh.isMesh &&
            mesh.userData?.dryColor &&
            mesh.userData?.greenColor
        ) {
            mesh.material.color.copy(
                mesh.userData.dryColor
            ).lerp(
                mesh.userData.greenColor,
                amount
            );

            continue;
        }

        // ساحل رودخانه: تغییر تدریجی رنگ رأس‌ها از خاکی به سبز
        if (
            target.type === 'riverBank' &&
            mesh.isMesh &&
            mesh.userData?.dryVertexColors &&
            mesh.userData?.greenVertexColors
        ) {
            const colorAttribute =
                mesh.geometry.getAttribute('color');

            const dryColors =
                mesh.userData.dryVertexColors;

            const greenColors =
                mesh.userData.greenVertexColors;

            if (colorAttribute) {
                for (let i = 0; i < colorAttribute.count; i++) {
                    const dryColor = dryColors[i];
                    const greenColor = greenColors[i];

                    if (!dryColor || !greenColor) continue;

                    const color = new THREE.Color().lerpColors(
                        dryColor,
                        greenColor,
                        amount
                    );

                    colorAttribute.setXYZ(
                        i,
                        color.r,
                        color.g,
                        color.b
                    );
                }

                colorAttribute.needsUpdate = true;
            }

            continue;
        }

        // چمن‌ها و تاج درختان: حفظ رفتار قبلی
        if (!mesh.isInstancedMesh) continue;
        if (mesh.userData?.dryInstanceColors == null) continue;
        if (mesh.userData?.greenInstanceColors == null) continue;

        const dryColors = mesh.userData.dryInstanceColors;
        const greenColors = mesh.userData.greenInstanceColors;

        for (let i = 0; i < mesh.count; i++) {
            const dryColor = dryColors[i];
            const greenColor = greenColors[i];

            if (!dryColor || !greenColor) continue;

            mesh.setColorAt(
                i,
                new THREE.Color().lerpColors(
                    dryColor,
                    greenColor,
                    amount
                )
            );
        }

        if (mesh.instanceColor) {
            mesh.instanceColor.needsUpdate = true;
        }
    }
}



// ============================================================
// 12) لایه اول — خیلی دور
// ============================================================

createMountainRange({
    x: -1400,
    z: -2400,
    width: 3900,
    height: 900,
    depth: 1000,
    arcDepth: 350,
    rotationY: -0.15,
    color: 0x788578
});

createMountainRange({
    x: -5000,
    z: -2400,
    width: 3600,
    height: 900,
    depth: 1000,
    arcDepth: 300,
    rotationY: 0.15,
    color: 0x6E7770
});

createMountainRange({
    x: 2200,
    z: -2300,
    width: 4000,
    height: 900,
    depth: 1000,
    arcDepth: 250,
    rotationY: -0.1,
    color: 0x85877B
});

createMountainRange({
    x: 6500,
    z: -1500,
    width: 5000,
    height: 900,
    depth: 1000,
    arcDepth: 400,
    rotationY: -0.4,
    color: 0x7A8074
});


// ============================================================
// 13) لایه دوم — دور
// ============================================================

createMountainRange({
    x: -1200,
    z: -700,
    width: 4000,
    height: 800,
    depth: 1000,
    arcDepth: 350,
    rotationY: -0.1,
    color: 0x777A70
});

createMountainRange({
    x: -5400,
    z: -300,
    width: 4000,
    height: 800,
    depth: 1000,
    arcDepth: 500,
    rotationY: 0.2,
    color: 0x6C7169
});

createMountainRange({
    x: 3200,
    z: -700,
    width: 4000,
    height: 850,
    depth: 800,
    arcDepth: 350,
    rotationY: -0.25,
    color: 0x929489
});

createMountainRange({
    x: 6500,
    z: 400,
    width: 3400,
    height: 800,
    depth: 1000,
    arcDepth: 400,
    rotationY: -0.40,
    color: 0x858474
});


// ============================================================
// 14) لایه سوم — میانی
// ============================================================

createMountainRange({
    x: -1500,
    z: 1000,
    width: 4000,
    height: 950,
    depth: 900,
    arcDepth: 500,
    rotationY: 0.10,
    color: 0x827B6C
});

createMountainRange({
    x: 1300,
    z: 1000,
    width: 2000,
    height: 1000,
    depth: 900,
    arcDepth: 500,
    rotationY: 0.10,
    color: 0x8A8171
});

createMountainRange({
    x: -5000,
    z: 1500,
    width: 3500,
    height: 950,
    depth: 1000,
    arcDepth: 850,
    rotationY: 0.25,
    color: 0x756D61
});

createMountainRange({
    x: 2900,
    z: 1000,
    width: 3000,
    height: 1000,
    depth: 1000,
    arcDepth: 500,
    rotationY: -0.15,
    color: 0x928575
});

createMountainRange({
    x: 6000,
    z: 2000,
    width: 3800,
    height: 950,
    depth: 1000,
    arcDepth: 550,
    rotationY: -0.35,
    color: 0x82796A
});


// ============================================================
// 15) لایه چهارم — نزدیک‌تر
// ============================================================

createMountainRange({
    x: -3000,
    z: 3000,
    width: 2600,
    height: 1000,
    depth: 1000,
    arcDepth: 500,
    rotationY: 0.15,
    color: 0x887B68
});

createMountainRange({
    x: -5000,
    z: 3500,
    width: 2600,
    height: 1000,
    depth: 1000,
    arcDepth: 750,
    rotationY: 0.35,
    color: 0x777369
});

createMountainRange({
    x: 3000,
    z: 2900,
    width: 3000,
    height: 1000,
    depth: 1000,
    arcDepth: 700,
    rotationY: -0.15,
    color: 0x9A8A73
});

createMountainRange({
    x: 5900,
    z: 3400,
    width: 3100,
    height: 1000,
    depth: 1200,
    arcDepth: 500,
    rotationY: -0.35,
    color: 0x666B51
});


// ============================================================
// 16) کوه اصلی
// ============================================================

const mainMountain = createMountainRange({
    x: 0,
    z: 2500,
    width: 4500,
    height: 1500,
    depth: 1200,
    color: 0x82796B,
    arcDepth: 500,
    rotationY: 0,
    flattenTop: true,
    plateauY: 1660
});


// ============================================================
// 17) کوه‌های نزدیک سمت چپ
// ============================================================
//
// اینجا چرخش بیشتر است تا بعداً بتوانیم
// فرم نیم‌دایره را واضح‌تر بسازیم.
// ============================================================

createMountainRange({
    x: -1400,
    z: -650,
    width: 1800,
    height: 800,
    depth: 900,
    arcDepth: 850,
    rotationY: -0.45,
    color: 0x777C73
});

createMountainRange({
    x: -3000,
    z: -650,
    width: 1800,
    height: 800,
    depth: 900,
    arcDepth: 1000,
    rotationY: -0.65,
    color: 0x706B5C
});


// ============================================================
// 18) کوه‌های نزدیک سمت راست
// ============================================================

createMountainRange({
    x: 1100,
    z: -650,
    width: 1800,
    height: 800,
    depth: 900,
    arcDepth: 850,
    rotationY: 0.45,
    color: 0x85877A
});

createMountainRange({
    x: 2100,
    z: -650,
    width: 1800,
    height: 800,
    depth: 900,
    arcDepth: 1000,
    rotationY: 0.65,
    color: 0x686F55
});


/* ============================================================
   خانه نورسا روی قله کوه اصلی
   مختصات خانه با قله کوه اصلی هماهنگ شده است.
   ============================================================ */

const houseGroup = new THREE.Group();

// مختصات قله
const houseX = 0;
const houseY = 1600;
const houseZ = 2500;

// متریال‌های خانه

const norsaHouseStoneMaterial = new THREE.MeshStandardMaterial({
    color: 0x817766,
    roughness: 1
});

const norsaHouseWallMaterial = new THREE.MeshStandardMaterial({
    color: 0xC2B69B,
    roughness: 0.95
});

const norsaHouseWoodMaterial = new THREE.MeshStandardMaterial({
    color: 0x60432E,
    roughness: 0.9
});

const norsaHouseRoofMaterial = new THREE.MeshStandardMaterial({
    color: 0x174B59,
    roughness: 1
});

const norsaHouseFloorMaterial = new THREE.MeshStandardMaterial({
    color: 0x174B59,
    roughness: 1
});

function addHouseBox(
    width, height, depth,
    x, y, z,
    material,
    castShadow = true
) {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        material
    );

    mesh.position.set(x, y, z);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;

    houseGroup.add(mesh);
    return mesh;
}

// ------------------------------------------------------------
// پایهٔ یکپارچهٔ سنگی با شیارهای معماری تخت جمشید
// ------------------------------------------------------------

// رنگ و جنس سنگ پایه
const foundationMaterial = norsaHouseStoneMaterial.clone();
foundationMaterial.color.set(0xA69A83);
foundationMaterial.roughness = 0.96;

// بدنهٔ یکپارچهٔ پایه
const foundation = new THREE.Mesh(
    new THREE.CylinderGeometry(
        360, 410, 55, 12, 1
    ),
    foundationMaterial
);

foundation.position.set(0, 75, 0);
foundation.castShadow = true;
foundation.receiveShadow = true;
houseGroup.add(foundation);



/**
 * خانهٔ افسانه‌ای دوبلکس
 * نیم‌طبقهٔ باز، راه‌پلهٔ منحنی و سقف بلند
 */

// ------------------------------------------------------------
// تنظیمات اصلی خانه
// ------------------------------------------------------------

const houseBaseY = 105;
const houseWidth = 340;
const houseDepth = 280;
const wallHeight = 190;

const frontZ = houseDepth / 2;
const backZ = -houseDepth / 2;

// مصالح خانه
const duplexStoneMaterial = new THREE.MeshStandardMaterial({
    color: 0xA69A83,
    roughness: 0.95
});

// متریال اصلی دیوارهای خانه
const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xD8C6A5,
    roughness: 0.88,
    metalness: 0.0
});

const woodMaterial = new THREE.MeshStandardMaterial({
    color: 0x60432E,
    roughness: 0.9
});

const roofMaterial = new THREE.MeshStandardMaterial({
    color: 0x174B59,
    roughness: 0.95
});


// شیشهٔ طلایی و کهربایی پنجره‌های خانهٔ نورسا
const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xE9AD52,
    roughness: 0.26,
    metalness: 0.05,
    transparent: true,
    opacity: 0.82,
    clearcoat: 0.65,
    clearcoatRoughness: 0.2,

    // درخشش ملایم کهربایی
    emissive: 0x8C4B12,
    emissiveIntensity: 0.22,

    side: THREE.DoubleSide
});

// متریال اختصاصی شیشهٔ پنجرهٔ پشتی
const rearGlassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xFFF1D6,
    roughness: 0.08,
    metalness: 0.0,
    transparent: true,
    opacity: 0.35,
    clearcoat: 0.8,
    clearcoatRoughness: 0.08,
    side: THREE.DoubleSide,
    depthWrite: false
});

// ============================================================
// قاب سلطنتی پنجرهٔ طبقهٔ بالا
// قاب سنگی روشن با تزئینات طلایی
// ============================================================

// مصالح تزئینی قاب
const royalWindowStoneMaterial = new THREE.MeshStandardMaterial({
    color: 0xE0CCAA,
    roughness: 0.82
});

const royalWindowGoldMaterial = new THREE.MeshStandardMaterial({
    color: 0xD6A64F,
    metalness: 0.62,
    roughness: 0.3
});


// ============================================================
// ساخت قاب سلطنتی برای پنجره‌های خانه
// ============================================================

function addRoyalWindowFrame({
    x,
    y,
    z,
    width,
    height,
    frameDepth = 7,
    frameWidth = 9,
    centerBar = true,
    side = "front",
}) {

    // تعیین جهت بیرونی قاب
    const direction = side === "back" ? -1 : 1;
    const goldZ = z + direction * (frameDepth / 2 + 1);

    // قاب‌های عمودی سنگی
    for (const frameX of [
        x - width / 2 - 2,
        x + width / 2 + 2
    ]) {
        addHouseBox(
            frameWidth,
            height + 12,
            frameDepth,
            frameX,
            y,
            z,
            royalWindowStoneMaterial
        );
    }

    // قاب‌های افقی سنگی
    for (const frameY of [
        y - height / 2 - 2,
        y + height / 2 + 2
    ]) {
        addHouseBox(
            width + 18,
            frameWidth,
            frameDepth,
            x,
            frameY,
            z,
            royalWindowStoneMaterial
        );
    }

    // نوارهای طلایی عمودی
    for (const frameX of [
        x - width / 2 - 2,
        x + width / 2 + 2
    ]) {
        addHouseBox(
            2,
            height + 8,
            2,
            frameX,
            y,
            goldZ,
            royalWindowGoldMaterial
        );
    }

    // نوارهای طلایی افقی
    for (const frameY of [
        y - height / 2 - 2,
        y + height / 2 + 2
    ]) {
        addHouseBox(
            width + 14,
            2,
            2,
            x,
            frameY,
            z + frameDepth / 2 + 1,
            royalWindowGoldMaterial
        );
    }

    // تقسیم میانی طلایی
    if (centerBar) {
        addHouseBox(
            3,
            height - 12,
            3,
            x,
            y,
            z + direction * (frameDepth / 2 + 2),
            royalWindowGoldMaterial
        );
    }

    // چهار تزئین طلایی گوشه‌ها
    for (const ornamentX of [
        x - width / 2 - 2,
        x + width / 2 + 2
    ]) {
        for (const ornamentY of [
            y - height / 2 - 2,
            y + height / 2 + 2
        ]) {
            const ornament = new THREE.Mesh(
                new THREE.SphereGeometry(3, 10, 8),
                royalWindowGoldMaterial
            );

            ornament.position.set(
                ornamentX,
                ornamentY,
                z + direction * (frameDepth / 2 + 2)
            );

            ornament.castShadow = true;
            houseGroup.add(ornament);
        }
    }
}

// ------------------------------------------------------------
// کف اصلی خانه
// ------------------------------------------------------------

addHouseBox(
    houseWidth,
    12,
    houseDepth,
    0,
    houseBaseY,
    0,
    duplexStoneMaterial
);

// سطح کف داخلی
addHouseBox(
    houseWidth - 18,
    2,
    houseDepth - 18,
    0,
    houseBaseY + 7,
    0,
    woodMaterial,
    false
);

// ------------------------------------------------------------
// دیوارهای طبقهٔ پایین
// ------------------------------------------------------------

const wallCenterY = houseBaseY + 12 + wallHeight / 2;


// دیوار پشتی با بازشوی پنجرهٔ بلند
const rearWindowWidth = 140;
const rearWindowHeight = 165;
const rearWindowY = wallCenterY + -10;

// بخش‌های کناری دیوار
addHouseBox(
    (houseWidth - rearWindowWidth) / 2,
    wallHeight, 14,
    -(houseWidth + rearWindowWidth) / 4,
    wallCenterY,
    backZ,
    wallMaterial
);

// شیشهٔ بلند در بازشوی پشتی
addHouseBox(
    rearWindowWidth - 8,
    rearWindowHeight - 8,
    3,
    0,
    rearWindowY,
    backZ + 7,
    rearGlassMaterial,
    false
);


// ============================================================
// قاب سلطنتی پنجرهٔ پشتی طبقهٔ پایین
// ============================================================

addRoyalWindowFrame({
    x: 0,
    y: rearWindowY,
    z: backZ + -5,
    width: rearWindowWidth - 8,
    height: rearWindowHeight - 8,
    frameDepth: 7,
    frameWidth: 9,
    centerBar: true
});

// دیوارهای کناری
addHouseBox(
    14, wallHeight, houseDepth,
    -houseWidth / 2 + 7, wallCenterY, 0,
    wallMaterial
);


addHouseBox(
    14, wallHeight, houseDepth,
    houseWidth / 2 - 2, wallCenterY, 0,
    wallMaterial
);

// ------------------------------------------------------------
// نوارهای تزئینی ساده برای دیوارهای چپ و راست
// ------------------------------------------------------------

const sideWallTrimMaterial = new THREE.MeshStandardMaterial({
    color: 0xB49A73,
    roughness: 0.82,
    metalness: 0.0
});

// ارتفاع نوارها نسبت به مرکز دیوار
const sideWallTrimHeights = [
    wallCenterY - wallHeight / 2 + 12,
    wallCenterY - wallHeight / 2 + 22,
    wallCenterY + wallHeight / 2 - 12
];

// مختصات سطح بیرونی واقعی هر دیوار
const sideWallOuterSurfaces = [
    -houseWidth / 2,
    houseWidth / 2 + 5
];

// نوارهای افقی در امتداد طول دیوارها
for (const sideX of sideWallOuterSurfaces) {
    for (const trimY of sideWallTrimHeights) {
        const trim = new THREE.Mesh(
            new THREE.BoxGeometry(
                2,
                2,
                houseDepth - 12
            ),
            sideWallTrimMaterial
        );

        trim.position.set(
            sideX,
            trimY,
            0
        );

        trim.castShadow = true;
        trim.receiveShadow = true;

        houseGroup.add(trim);
    }
}

// دیوار جلویی در دو طرف ورودی
addHouseBox(
    135, wallHeight, 14,
    -100, wallCenterY, frontZ,
    wallMaterial
);

addHouseBox(
    135, wallHeight, 14,
    100, wallCenterY, frontZ,
    wallMaterial
);

// بخش بالای در
addHouseBox(
    130, 70, 14,
    0, houseBaseY + 12 + wallHeight - 35, frontZ,
    wallMaterial
);

// ------------------------------------------------------------
// ستون‌های سنگی باشکوه
// ------------------------------------------------------------

for (const x of [-153, 153]) {
    const column = new THREE.Mesh(
        new THREE.CylinderGeometry(11, 15, 478, 10),
        duplexStoneMaterial
    );

    column.position.set(
        x,
        houseBaseY + 22 + 89,
        frontZ + 0
    );

    column.castShadow = true;
    column.receiveShadow = true;
    houseGroup.add(column);

    // سرستون
    addHouseBox(
        32, 15, 30,
        x, houseBaseY + 12 + 340 + 5, frontZ + 0,
        duplexStoneMaterial
    );

    // نقش نیلوفر روی سرستون بالایی
    addNorsaLotusRelief(
        houseGroup,
        x,
        houseBaseY + 12 + 340 + 5,
        frontZ + 16,
        0.85
    );
    // سرستون
    addHouseBox(
        32, 15, 30,
        x, houseBaseY + 12 + 178+ 5, frontZ + 0,
        duplexStoneMaterial
    );

    addNorsaLotusRelief(
        houseGroup,
        x,
        houseBaseY + 12 + 178 + 5,
        frontZ + 16,
        0.85
    );

    // پایهٔ ستون
    addHouseBox(
        30, 15, 28,
        x, houseBaseY + 3, frontZ + 0,
        duplexStoneMaterial
    );

    // نقش نیلوفر روی پایه ستون
    addNorsaLotusRelief(
        houseGroup,
        x,
        houseBaseY,
        frontZ + 15,
        0.65
    );
}



/* =========================================================
   نقش نیلوفر گرد و متقارن، با گلبرگ‌های سه‌بعدی
   ========================================================= */

function addNorsaLotusRelief(
    parent,
    centerX,
    centerY,
    centerZ,
    scale = 1
) {
    const lotusGroup = new THREE.Group();

    lotusGroup.position.set(centerX, centerY, centerZ);

    // متریال طلایی براق برای نقش نیلوفر
    const lotusMaterial = new THREE.MeshStandardMaterial({
        color: 0xE6B653,
        metalness: 0.72,
        roughness: 0.28
    });

    // مرکز برجسته گل
    const flowerCenter = new THREE.Mesh(
        new THREE.SphereGeometry(3.2 * scale, 20, 10),
        lotusMaterial
    );

    flowerCenter.position.z = 1.2 * scale;
    flowerCenter.scale.z = 0.35;

    flowerCenter.castShadow = true;
    lotusGroup.add(flowerCenter);

    // گلبرگ‌های گرد در دو ردیف هم‌مرکز
    const petalRows = [
        {
            count: 8,
            radius: 4.0,
            width: 3.6,
            height: 5.0,
            depth: 1.8,
            offset: 0
        },
        {
            count: 8,
            radius: 4.2,
            width: 2.8,
            height: 4.0,
            depth: 1.6,
            offset: Math.PI / 8
        }
    ];

    for (const row of petalRows) {
        for (let i = 0; i < row.count; i++) {
            const angle =
                (i / row.count) * Math.PI * 2 + row.offset;

            const petal = new THREE.Mesh(
                new THREE.SphereGeometry(1, 16, 12),
                lotusMaterial
            );

            petal.position.set(
                Math.cos(angle) * row.radius * scale,
                Math.sin(angle) * row.radius * scale,
                0.3 * scale
            );

            petal.scale.set(
                row.width * scale,
                row.height * scale,
                row.depth * scale
            );

            // هر گلبرگ در جهت شعاعی قرار می‌گیرد
            petal.rotation.z = angle - Math.PI / 2;

            petal.castShadow = true;
            petal.receiveShadow = true;

            lotusGroup.add(petal);
        }
    }

    parent.add(lotusGroup);

    return lotusGroup;
}


/* =========================================================
   تزئینات طلایی ستون‌های ورودی خانه نورسا
   ========================================================= */

// ماده طلایی مخصوص تزئینات ستون‌ها
const norsaColumnGoldMaterial = new THREE.MeshStandardMaterial({
    color: 0xE6B653,
    metalness: 0.68,
    roughness: 0.3
});

// ماده عاجی برای سرستون‌ها
const norsaColumnIvoryMaterial = new THREE.MeshStandardMaterial({
    color: 0xE8DDC5,
    roughness: 0.72
});

// ارتفاع مرکز ستون‌ها، مطابق ساختار فعلی خانه
const norsaColumnCenterY = houseBaseY + 22 + 89;

// دو ستون موجود در دو طرف ورودی
for (const x of [-153, 153]) {

    // حلقه‌های طلایی باریک دور ستون
    for (const yOffset of [-95, 65]) {

        const goldRing = new THREE.Mesh(
            new THREE.CylinderGeometry(14.5, 14.5, 5, 24),
            norsaColumnGoldMaterial
        );

        goldRing.position.set(
            x,
            norsaColumnCenterY + yOffset,
            frontZ
        );

        goldRing.castShadow = true;
        goldRing.receiveShadow = true;

        houseGroup.add(goldRing);
    }

        for (const yOffset of [102, 220]) {

        const goldRing = new THREE.Mesh(
            new THREE.CylinderGeometry(14.5, 14.5, 5, 24),
            norsaColumnGoldMaterial
        );

        goldRing.position.set(
            x,
            norsaColumnCenterY + yOffset,
            frontZ
        );

        goldRing.castShadow = true;
        goldRing.receiveShadow = true;

        houseGroup.add(goldRing);
    }

    // سرستون عاجی با فرم لایه‌ای
    const capital = new THREE.Mesh(
        new THREE.CylinderGeometry(20, 15, 10, 10),
        norsaColumnIvoryMaterial
    );

    capital.position.set(
        x,
        norsaColumnCenterY + 89 + 5,
        frontZ
    );

    capital.castShadow = true;
    capital.receiveShadow = true;

    houseGroup.add(capital);

    // پایه تزئینی عاجی
    const columnBaseAccent = new THREE.Mesh(
        new THREE.CylinderGeometry(20, 20, 5, 8),
        norsaColumnIvoryMaterial
    );

    columnBaseAccent.position.set(
        x,
        norsaColumnCenterY - 89 - 10,
        frontZ
    );

    columnBaseAccent.castShadow = true;
    houseGroup.add(columnBaseAccent);

}


/* =========================================================
   شیارهای عمودی الهام‌گرفته از ستون‌های تخت جمشید
   این قطعات روی ستون‌های فعلی قرار می‌گیرند.
   ========================================================= */

// ماده سنگی کمی روشن‌تر برای نمایش شیارها
const persepolisFluteMaterial = new THREE.MeshStandardMaterial({
    color: 0x817766,
    roughness: 0.88,
    metalness: 0.02
});

// ابعاد بر اساس ستون‌های فعلی خانه نورسا
const persepolisColumnRadius = 13;
const persepolisColumnHeight = 500;
const persepolisFluteCount = 20;

// شیارها روی هر دو ستون ورودی ساخته می‌شوند
for (const columnX of [-153, 153]) {

    for (let i = 0; i < persepolisFluteCount; i++) {

        // زاویه هر شیار در پیرامون ستون
        const angle =
            (i / persepolisFluteCount) * Math.PI * 2;

        // شیار باریک و بلند با هندسه واقعی
        const flute = new THREE.Mesh(
            new THREE.CylinderGeometry(
                1.5,
                1.5,
                persepolisColumnHeight - 12,
                6
            ),
            persepolisFluteMaterial
        );

        // قرار دادن شیار در پیرامون سطح ستون
        const fluteRadius = persepolisColumnRadius - 0.15;

        flute.position.set(
            columnX + Math.cos(angle) * fluteRadius,
            norsaColumnCenterY,
            frontZ + Math.sin(angle) * fluteRadius
        );

        // چرخش هر شیار حول محور عمودی ستون
        flute.rotation.y = -angle;

        flute.castShadow = true;
        flute.receiveShadow = true;

        houseGroup.add(flute);
    }
}


// ============================================================
// مصالح معماری سنگی سلطنتی خانهٔ نورسا
// ============================================================

// رنگ اصلی سنگ‌های روشن
const duplStoneMaterial = new THREE.MeshStandardMaterial({
    color: 0xB7A184,
    roughness: 0.92,
    metalness: 0.02
});

// رنگ سنگ‌های مکمل برای تنوع طبیعی دیوار
const royalStoneLightMaterial = new THREE.MeshStandardMaterial({
    color: 0xD5C2A3,
    roughness: 0.94
});

const royalStoneDarkMaterial = new THREE.MeshStandardMaterial({
    color: 0x8D765C,
    roughness: 0.96
});

// رنگ ملات بین سنگ‌ها
const royalStoneMortarMaterial = new THREE.MeshStandardMaterial({
    color: 0x594B3D,
    roughness: 1
});

// مصالح دیوار فعلی
const wallsMaterial = new THREE.MeshStandardMaterial({
    color: 0xC9B99A,
    roughness: 0.95
});


// ---------------------------------------------------------
// چارچوب سلطنتی دور درِ ورودی پایین
// ---------------------------------------------------------

const lowerDoorFrameWidth = 78;
const lowerDoorFrameHeight = 133;
const lowerDoorFrameDepth = 10;
const lowerDoorFrameSideWidth = 6;

// مختصات چارچوب
const lowerDoorFrameX = 0;
const lowerDoorFrameY = houseBaseY + 12;
const lowerDoorFrameZ = frontZ + 9;

// دو ستون سنگی طرفین در
for (const side of [-1, 1]) {
    addHouseBox(
        lowerDoorFrameSideWidth,
        lowerDoorFrameHeight,
        lowerDoorFrameDepth,
        lowerDoorFrameX +
            side * (lowerDoorFrameWidth / 2 - lowerDoorFrameSideWidth / 2),
        lowerDoorFrameY + lowerDoorFrameHeight / 2,
        lowerDoorFrameZ,
        royalWindowStoneMaterial
    );
}

// سنگ بالای چارچوب
addHouseBox(
    lowerDoorFrameWidth,
    lowerDoorFrameSideWidth,
    lowerDoorFrameDepth,
    lowerDoorFrameX,
    lowerDoorFrameY + lowerDoorFrameHeight -
        lowerDoorFrameSideWidth / 2,
    lowerDoorFrameZ,
    royalWindowStoneMaterial
);

// سنگ زیر چارچوب
addHouseBox(
    lowerDoorFrameWidth,
    lowerDoorFrameSideWidth,
    lowerDoorFrameDepth,
    lowerDoorFrameX,
    lowerDoorFrameY + lowerDoorFrameSideWidth / 2,
    lowerDoorFrameZ,
    royalWindowStoneMaterial
);

// ---------------------------------------------------------
// نوارهای طلایی تزئینی روی چارچوب
// ---------------------------------------------------------

const lowerDoorGoldZ = lowerDoorFrameZ + lowerDoorFrameDepth / 2 + 0.8;

// نوارهای طلایی عمودی
for (const side of [-1, 1]) {
    addHouseBox(
        1.8,
        lowerDoorFrameHeight - 14,
        1.5,
        lowerDoorFrameX +
            side * (lowerDoorFrameWidth / 2 - lowerDoorFrameSideWidth / 2),
        lowerDoorFrameY + lowerDoorFrameHeight / 2,
        lowerDoorGoldZ,
        royalWindowGoldMaterial,
        false
    );
}

// نوار طلایی بالای در
addHouseBox(
    lowerDoorFrameWidth - 12,
    1.8,
    1.5,
    lowerDoorFrameX,
    lowerDoorFrameY + lowerDoorFrameHeight -
        lowerDoorFrameSideWidth / 2,
    lowerDoorGoldZ,
    royalWindowGoldMaterial,
    false
);

// ------------------------------------------------------------
// در ورودی
// ------------------------------------------------------------

// ------------------------------------------------------------
// درِ ورودی پایین با لولای چرخان
// ------------------------------------------------------------

const lowerDoorGroup = new THREE.Group();

const lowerDoorWidth = 64;
const lowerDoorHeight = 125;

// محور چرخش روی لبهٔ چپ در
lowerDoorGroup.position.set(
    -lowerDoorWidth / 2,
    houseBaseY + 12,
    frontZ + 9
);

// لنگهٔ در
const lowerDoorLeaf = new THREE.Mesh(
    new THREE.BoxGeometry(
        lowerDoorWidth,
        lowerDoorHeight,
        5
    ),
    woodMaterial
);

lowerDoorLeaf.position.set(
    lowerDoorWidth / 2,
    lowerDoorHeight / 2,
    0
);

lowerDoorLeaf.castShadow = true;
lowerDoorLeaf.receiveShadow = true;
lowerDoorGroup.add(lowerDoorLeaf);

// دستگیره؛ همراه در می‌چرخد
const lowerDoorHandle = new THREE.Mesh(
    new THREE.SphereGeometry(3, 12, 12),
    new THREE.MeshStandardMaterial({
        color: 0xD6A64F,
        metalness: 0.65,
        roughness: 0.3
    })
);

lowerDoorHandle.position.set(
    lowerDoorWidth - 12,
    lowerDoorHeight / 2,
    4
);

lowerDoorGroup.add(lowerDoorHandle);
houseGroup.add(lowerDoorGroup);


/* =========================================================
   نشان خورشید طلایی روی در ورودی خانه نورسا
   تمام اجزا به در متصل هستند و همراه آن حرکت می‌کنند.
   ========================================================= */

// ---------------------------------------------------------
// ۱. تعریف مواد طلایی با دو میزان درخشندگی
// ---------------------------------------------------------

const norsaSunGoldMaterial = new THREE.MeshStandardMaterial({
    color: 0xE6B653,
    metalness: 0.72,
    roughness: 0.28
});

const norsaSunDarkGoldMaterial = new THREE.MeshStandardMaterial({
    color: 0xA87524,
    metalness: 0.65,
    roughness: 0.38
});


 // ---------------------------------------------------------
 // قاب طلایی ظریف پیرامون درِ ورودی نورسا
 // تمام قطعات به لنگهٔ در متصل هستند.
 // ---------------------------------------------------------

 const lowerDoorTrimMaterial = norsaSunGoldMaterial;

 // دو نوار عمودی در طرفین در
 for (const trimX of [4, lowerDoorWidth - 4]) {
     const trim = new THREE.Mesh(
         new THREE.BoxGeometry(1.6, 112, 1.6),
         lowerDoorTrimMaterial
     );

     trim.position.set(trimX, lowerDoorHeight / 2, 3.3);
     trim.castShadow = true;
     lowerDoorGroup.add(trim);
 }

 // نوار طلایی پایین در
 const lowerDoorBottomTrim = new THREE.Mesh(
     new THREE.BoxGeometry(lowerDoorWidth - 12, 1.6, 1.6),
     lowerDoorTrimMaterial
 );

 lowerDoorBottomTrim.position.set(
     lowerDoorWidth / 2,
     3.5,
     3.3
 );

 lowerDoorGroup.add(lowerDoorBottomTrim);

 // نوار طلایی بالای در
 const lowerDoorTopTrim = new THREE.Mesh(
     new THREE.BoxGeometry(lowerDoorWidth - 12, 1.6, 1.6),
     lowerDoorTrimMaterial
 );

 lowerDoorTopTrim.position.set(
     lowerDoorWidth / 2,
     lowerDoorHeight - 3,
     3.3
 );

 lowerDoorGroup.add(lowerDoorTopTrim);

// ---------------------------------------------------------
// ۲. گروه مستقل نشان خورشید
// محل گروه نسبت به سطح خود در تعریف می‌شود.
// ---------------------------------------------------------

const norsaSunEmblem = new THREE.Group();

// عرض در ۶۴ واحد است؛ نشان کمی بالاتر از مرکز قرار می‌گیرد.
norsaSunEmblem.position.set(
    30,
    lowerDoorHeight * 0.76,
    3.2
);

// ---------------------------------------------------------
// ۳. حلقه طلایی پیرامون خورشید
// ---------------------------------------------------------

const norsaSunRing = new THREE.Mesh(
    new THREE.TorusGeometry(12, 1.8, 12, 48),
    norsaSunGoldMaterial
);

norsaSunRing.position.z = 0.8;
norsaSunRing.castShadow = true;
norsaSunEmblem.add(norsaSunRing);

// ---------------------------------------------------------
// ۴. صفحه مرکزی خورشید؛ کمی برجسته از سطح در
// ---------------------------------------------------------

const norsaSunCenter = new THREE.Mesh(
    new THREE.CylinderGeometry(9.5, 10.5, 2.4, 32),
    norsaSunDarkGoldMaterial
);

// محور استوانه به‌طور پیش‌فرض روی Y است.
// با چرخش ۹۰ درجه، سطح دایره رو به بیرون در قرار می‌گیرد.
norsaSunCenter.rotation.x = Math.PI / 2;
norsaSunCenter.position.z = 1.2;
norsaSunCenter.castShadow = true;
norsaSunEmblem.add(norsaSunCenter);

// لایه روشن روی مرکز خورشید
const norsaSunFace = new THREE.Mesh(
    new THREE.CircleGeometry(8.2, 32),
    norsaSunGoldMaterial
);

norsaSunFace.position.z = 2.65;
norsaSunEmblem.add(norsaSunFace);

// ---------------------------------------------------------
// ۵. دوازده پرتو سه‌بعدی پیرامون حلقه
// ---------------------------------------------------------

const norsaSunRayCount = 12;

for (let i = 0; i < norsaSunRayCount; i++) {

    // زاویه هر پرتو در اطراف مرکز خورشید
    const angle = (i / norsaSunRayCount) * Math.PI * 2;

    // پرتو کشیده با نوک مخروطی
    const rayLength = 7;
    const rayRadius = 2.0;

    const rayGeometry = new THREE.ConeGeometry(
        rayRadius,
        rayLength,
        4
    );

    const ray = new THREE.Mesh(
        rayGeometry,
        norsaSunGoldMaterial
    );

    // مخروط به‌صورت شعاعی بیرون حلقه قرار می‌گیرد.
    const rayDistance = 17.5;

    ray.position.set(
        Math.cos(angle) * rayDistance,
        Math.sin(angle) * rayDistance,
        0.4
    );

    // محور طولی مخروط از Y به جهت شعاعی چرخانده می‌شود.
    ray.rotation.z = angle - Math.PI / 2;

    ray.castShadow = true;
    ray.receiveShadow = true;

    norsaSunEmblem.add(ray);
}

// ---------------------------------------------------------
// ۶. چهار تزئین کوچک برای کامل کردن قاب خورشید
// ---------------------------------------------------------

const norsaSunStudGeometry = new THREE.SphereGeometry(
    1.5,
    12,
    10
);

for (let i = 0; i < 4; i++) {

    const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;

    const stud = new THREE.Mesh(
        norsaSunStudGeometry,
        norsaSunDarkGoldMaterial
    );

    stud.position.set(
        Math.cos(angle) * 12,
        Math.sin(angle) * 12,
        2.0
    );

    stud.castShadow = true;
    norsaSunEmblem.add(stud);
}

// ---------------------------------------------------------
// ۷. اتصال نشان به گروه در
// ---------------------------------------------------------

lowerDoorGroup.add(norsaSunEmblem);

// باز و بسته کردن در
function toggleLowerDoor(open) {
    lowerDoorGroup.rotation.y =
        open ? Math.PI / 2 : 0;
}

// ------------------------------------------------------------
// پنجره‌های بلند
// ------------------------------------------------------------

function addTallWindow(x, y, z, width, height) {
    // شیشه
    addHouseBox(
        width, height, 3,
        x, y, z,
        glassMaterial,
        false
    );

    // تقسیم میانی
    addHouseBox(
        1.5, height, 5,
        x, y, z + 3,
        woodMaterial
    );

    // قاب سلطنتی پنجرهٔ جلویی
    addRoyalWindowFrame({
        x: x,
        y: y,
        z: z + 0,
        width: width,
        height: height,
        frameDepth: 7,
        frameWidth: 7,
        centerBar: false
    });
}

// پنجره‌های جلویی در دو طرف ورودی
addTallWindow(
    -112, houseBaseY + 12 + 120, frontZ + 9,
    42, 65
);

addTallWindow(
    112, houseBaseY + 12 + 120, frontZ + 9,
    42, 65
);


// ------------------------------------------------------------
// نیم‌طبقهٔ باز
// ------------------------------------------------------------

const mezzanineY = houseBaseY + 193;

// نیم‌طبقه فقط در بخش پشتی خانه ساخته می‌شود.
// مرکز خانه باز می‌ماند تا ارتفاع نشیمن دیده شود.
addHouseBox(
    310, 20, 225,
    0, mezzanineY, -35,
    woodMaterial
);

// تیرهای نگهدارندهٔ نیم‌طبقه
for (const x of [-150, 150]) {
    addHouseBox(
        12, 25, 200,
        x, mezzanineY - 10, -50,
        woodMaterial
    );
}


// ------------------------------------------------------------
// طبقهٔ بالایی خانه
// ------------------------------------------------------------

// کف طبقهٔ بالا روی نیم‌طبقه
const upperFloorY = mezzanineY + 5;
const upperFloorWidth = 320;
const upperFloorDepth = 200;
const upperFloorZ = -35;

addHouseBox(
    upperFloorWidth, 10, upperFloorDepth,
    0, upperFloorY, upperFloorZ,
    woodMaterial
);

// مشخصات دیوارهای طبقهٔ بالا
const upperWallHeight = 160;
const upperWallThickness = 12;

const upperWallCenterY =
    upperFloorY + 5 + upperWallHeight / 2;

const upperFrontZ =
    upperFloorZ + upperFloorDepth / 2;

const upperBackZ =
    upperFloorZ - upperFloorDepth / 2;

// ------------------------------------------------------------
// تنظیمات عمق قاب سلطنتی پنجرهٔ طبقهٔ بالا
// ------------------------------------------------------------

const royalWindowFrameZ = upperFrontZ + 6;
const royalWindowFrameThickness = 7;

// دیوار پشتی
addHouseBox(
    upperFloorWidth,
    upperWallHeight,
    upperWallThickness,
    0,
    upperWallCenterY,
    upperBackZ,
    wallMaterial
);

// دیوارهای کناری
for (const upperSideX of [-163, 165]) {
    addHouseBox(
        upperWallThickness,
        upperWallHeight,
        upperFloorDepth,
        upperSideX,
        upperWallCenterY,
        upperFloorZ,
        wallMaterial
    );
}

// ------------------------------------------------------------
// ورودی طبقهٔ بالا
// ------------------------------------------------------------

const upperDoorWidth = 70;
const upperDoorHeight = 115;
const upperDoorX = -65;

const upperDoorCenterY =
    upperFloorY + 5 + upperDoorHeight / 2;

const upperDoorLeftWidth =
    upperDoorX + 170 - upperDoorWidth / 2;

const upperDoorRightWidth =
    167 - upperDoorX - upperDoorWidth / 2;

// بخش چپ دیوار
addHouseBox(
    upperDoorLeftWidth,
    upperWallHeight,
    upperWallThickness,
    -170 + upperDoorLeftWidth / 2,
    upperWallCenterY,
    upperFrontZ,
    wallMaterial
);

// ------------------------------------------------------------
// دیوار جلویی طبقهٔ بالا با بازشوی پنجره
// ------------------------------------------------------------

const upperWindowX = 75;
const upperWindowWidth = 70;
const upperWindowHeight = 90;
const upperWindowY = upperFloorY + 95;

const upperRightWallStart =
    upperDoorX + upperDoorWidth / 2;

const upperRightWallEnd = 167;

const upperWindowLeft =
    upperWindowX - upperWindowWidth / 2;

const upperWindowRight =
    upperWindowX + upperWindowWidth / 2;

// دیوار بین در و پنجره
addHouseBox(
    upperWindowLeft - upperRightWallStart,
    upperWallHeight,
    upperWallThickness,
    (upperRightWallStart + upperWindowLeft) / 2,
    upperWallCenterY,
    upperFrontZ,
    wallMaterial
);

// دیوار سمت راست پنجره
addHouseBox(
    upperRightWallEnd - upperWindowRight,
    upperWallHeight,
    upperWallThickness,
    (upperWindowRight + upperRightWallEnd) / 2,
    upperWallCenterY,
    upperFrontZ,
    wallMaterial
);

// دیوار زیر پنجره
addHouseBox(
    upperWindowWidth,
    upperWindowY - upperWindowHeight / 2
        - (upperFloorY + 5),
    upperWallThickness,
    upperWindowX,
    (upperWindowY - upperWindowHeight / 2
        + upperFloorY + 5) / 2,
    upperFrontZ,
    wallMaterial
);

// دیوار بالای پنجره
addHouseBox(
    upperWindowWidth,
    upperFloorY + 5 + upperWallHeight
        - (upperWindowY + upperWindowHeight / 2),
    upperWallThickness,
    upperWindowX,
    (upperWindowY + upperWindowHeight / 2
        + upperFloorY + 5 + upperWallHeight) / 2,
    upperFrontZ,
    wallMaterial
);

// شیشه
addHouseBox(
    upperWindowWidth - 10,
    upperWindowHeight - 10,
    3,
    upperWindowX,
    upperWindowY,
    upperFrontZ + 2,
    glassMaterial,
    false
);

// ------------------------------------------------------------
// چارچوب سنگی سلطنتی درِ طبقهٔ بالا
// ------------------------------------------------------------

const upperDoorFrameWidth = upperDoorWidth + 14;
const upperDoorFrameHeight = upperDoorHeight + 14;
const upperDoorFrameSideWidth = 6;
const upperDoorFrameDepth = 9;

// چارچوب باید با مرکز در هم‌راستا باشد.
const upperDoorFrameCenterX = upperDoorX;
const upperDoorFrameCenterY = upperDoorCenterY;
const upperDoorFrameZ = upperFrontZ + upperWallThickness / 2 + 1;

// ستون سنگی سمت چپ و راست
for (const side of [-1, 1]) {
    addHouseBox(
        upperDoorFrameSideWidth,
        upperDoorFrameHeight,
        upperDoorFrameDepth,
        upperDoorFrameCenterX +
            side * (upperDoorFrameWidth / 2 - upperDoorFrameSideWidth / 2),
        upperDoorFrameCenterY,
        upperDoorFrameZ,
        royalWindowStoneMaterial
    );
}

// سنگ بالای چارچوب
addHouseBox(
    upperDoorFrameWidth,
    upperDoorFrameSideWidth,
    upperDoorFrameDepth,
    upperDoorFrameCenterX,
    upperDoorFrameCenterY + upperDoorFrameHeight / 2 -
        upperDoorFrameSideWidth / 2,
    upperDoorFrameZ,
    royalWindowStoneMaterial
);

// ------------------------------------------------------------
// قاب طلایی تزئینی دور چارچوب درِ طبقهٔ بالا
// ------------------------------------------------------------

const upperDoorGoldZ =
    upperDoorFrameZ + upperDoorFrameDepth / 2 + 1;

// نوارهای طلایی عمودی در دو طرف چارچوب
for (const side of [-1, 1]) {
    addHouseBox(
        1.8,
        upperDoorFrameHeight - 10,
        1.5,
        upperDoorFrameCenterX +
            side * (upperDoorFrameWidth / 2 - upperDoorFrameSideWidth / 2),
        upperDoorFrameCenterY,
        upperDoorGoldZ,
        royalWindowGoldMaterial,
        false
    );
}

// نوار طلایی بالای چارچوب
addHouseBox(
    upperDoorFrameWidth - 10,
    1.8,
    1.5,
    upperDoorFrameCenterX,
    upperDoorFrameCenterY + upperDoorFrameHeight / 2 -
        upperDoorFrameSideWidth / 2,
    upperDoorGoldZ,
    royalWindowGoldMaterial,
    false
);


// ------------------------------------------------------------
// قاب‌های عمودی سنگی
// ------------------------------------------------------------

for (const x of [
    upperWindowX - upperWindowWidth / 2 - 2,
    upperWindowX + upperWindowWidth / 2 + 2
]) {
    addHouseBox(
        9,
        upperWindowHeight + 12,
        royalWindowFrameThickness,
        x,
        upperWindowY,
        royalWindowFrameZ,
        royalWindowStoneMaterial
    );
}

// ------------------------------------------------------------
// قاب‌های افقی سنگی
// ------------------------------------------------------------

for (const y of [
    upperWindowY - upperWindowHeight / 2 - 2,
    upperWindowY + upperWindowHeight / 2 + 2
]) {
    addHouseBox(
        upperWindowWidth + 18,
        9,
        royalWindowFrameThickness,
        upperWindowX,
        y,
        royalWindowFrameZ,
        royalWindowStoneMaterial
    );
}

// ------------------------------------------------------------
// نوارهای طلایی باریک روی قاب
// ------------------------------------------------------------

// نوارهای عمودی
for (const x of [
    upperWindowX - upperWindowWidth / 2 - 2,
    upperWindowX + upperWindowWidth / 2 + 2
]) {
    addHouseBox(
        2,
        upperWindowHeight + 8,
        2,
        x,
        upperWindowY,
        royalWindowFrameZ + 4.5,
        royalWindowGoldMaterial
    );
}

// نوارهای افقی
for (const y of [
    upperWindowY - upperWindowHeight / 2 - 2,
    upperWindowY + upperWindowHeight / 2 + 2
]) {
    addHouseBox(
        upperWindowWidth + 14,
        2,
        2,
        upperWindowX,
        y,
        royalWindowFrameZ + 4.5,
        royalWindowGoldMaterial
    );
}

// ------------------------------------------------------------
// تقسیم میانی طلایی شیشه
// ------------------------------------------------------------

addHouseBox(
    3,
    upperWindowHeight - 12,
    3,
    upperWindowX,
    upperWindowY,
    upperFrontZ + 7,
    royalWindowGoldMaterial
);

// ------------------------------------------------------------
// تزئینات کوچک طلایی در چهار گوشه
// ------------------------------------------------------------

for (const x of [
    upperWindowX - upperWindowWidth / 2 - 2,
    upperWindowX + upperWindowWidth / 2 + 2
]) {
    for (const y of [
        upperWindowY - upperWindowHeight / 2 - 2,
        upperWindowY + upperWindowHeight / 2 + 2
    ]) {
        const ornament = new THREE.Mesh(
            new THREE.SphereGeometry(3, 10, 8),
            royalWindowGoldMaterial
        );

        ornament.position.set(
            x,
            y,
            royalWindowFrameZ + 5
        );

        ornament.castShadow = true;
        houseGroup.add(ornament);
    }
}

// تقسیم میانی شیشه
addHouseBox(
    4,
    upperWindowHeight - 8,
    7,
    upperWindowX,
    upperWindowY,
    upperFrontZ + 6,
    woodMaterial
);

// بخش بالای در
addHouseBox(
    upperDoorWidth,
    upperWallHeight - upperDoorHeight,
    upperWallThickness,
    upperDoorX,
    upperFloorY + 5 + upperDoorHeight
        + (upperWallHeight - upperDoorHeight) / 2,
    upperFrontZ,
    wallMaterial
);

// چهارچوب چوبی در
addHouseBox(
    5, upperDoorHeight, 5,
    upperDoorX - upperDoorWidth / 2,
    upperDoorCenterY,
    upperFrontZ + 7,
    woodMaterial
);

addHouseBox(
    5, upperDoorHeight, 5,
    upperDoorX + upperDoorWidth / 2,
    upperDoorCenterY,
    upperFrontZ + 7,
    woodMaterial
);

addHouseBox(
    upperDoorWidth + 5, 5, 5,
    upperDoorX,
    upperFloorY + 5 + upperDoorHeight,
    upperFrontZ + 7,
    woodMaterial
);

// ------------------------------------------------------------
// لنگهٔ درِ طبقهٔ بالا
// ------------------------------------------------------------

const upperDoorGroup = new THREE.Group();

upperDoorGroup.position.set(
    upperDoorX - upperDoorWidth / 2,
    upperFloorY + 5,
    upperFrontZ + 8
);

const upperDoorLeaf = new THREE.Mesh(
    new THREE.BoxGeometry(
        upperDoorWidth,
        upperDoorHeight,
        4
    ),
    woodMaterial
);

upperDoorLeaf.position.set(
    upperDoorWidth / 2,
    upperDoorHeight / 2,
    0
);

upperDoorLeaf.castShadow = true;
upperDoorLeaf.receiveShadow = true;
upperDoorGroup.add(upperDoorLeaf);

// دستگیرهٔ طلایی
const upperDoorHandle = new THREE.Mesh(
    new THREE.SphereGeometry(3, 12, 12),
    new THREE.MeshStandardMaterial({
        color: 0xD6A64F,
        metalness: 0.65,
        roughness: 0.3
    })
);

upperDoorHandle.position.set(
    upperDoorWidth - 12,
    upperDoorHeight / 2,
    4
);

upperDoorGroup.add(upperDoorHandle);
houseGroup.add(upperDoorGroup);

function toggleUpperDoor(open) {
    upperDoorGroup.rotation.y =
        open ? -Math.PI / 2 : 0;
}

// ------------------------------------------------------------
// نقش هندسی طلایی روی چوب درِ طبقهٔ بالا
// ------------------------------------------------------------

// دو خط عمودی تزئینی روی سطح در
for (const x of [6, 66]) {
    const line = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 100, 1),
        royalWindowGoldMaterial
    );

    line.position.set(x, 60, 3.2);
    upperDoorGroup.add(line);
}

// خط افقی بالای نقش
const upperDoorTopLine = new THREE.Mesh(
    new THREE.BoxGeometry(60, 2.2, 1),
    royalWindowGoldMaterial
);

upperDoorTopLine.position.set(36, 110, 3.2);
upperDoorGroup.add(upperDoorTopLine);

// خط افقی پایین نقش
const upperDoorBottomLine = new THREE.Mesh(
    new THREE.BoxGeometry(60, 2.2, 1),
    royalWindowGoldMaterial
);

upperDoorBottomLine.position.set(36, 10, 3.2);
upperDoorGroup.add(upperDoorBottomLine);

// ------------------------------------------------------------
// هلال ماه طلایی روی درِ طبقهٔ بالا
// ------------------------------------------------------------

// متریال طلایی درخشان هلال ماه
const upperDoorMoonMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFD978,
    metalness: 0.1,
    roughness: 0.9,
    emissive: 0xD99520,
    emissiveIntensity: 0.35,
    side: THREE.DoubleSide
});

// گروه هلال ماه
const upperDoorCrescentGroup = new THREE.Group();

// ------------------------------------------------------------
// زمینهٔ نقره‌ای هلال ماه
// ------------------------------------------------------------

const upperDoorMoonSilverMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xC9D5E2,
        metalness: 0.3,
        roughness: 0.4,
        emissive: 0x26384A,
        emissiveIntensity: 0.12,
        side: THREE.DoubleSide
    });

// دایرهٔ نقره‌ای پشت هلال
const upperDoorMoonSilverBackground = new THREE.Mesh(
    new THREE.CircleGeometry(13, 48),
    upperDoorMoonSilverMaterial
);

upperDoorMoonSilverBackground.position.set(35, 80, 3.5);
upperDoorCrescentGroup.add(upperDoorMoonSilverBackground);

// دایرهٔ اصلی ماه
const upperDoorMoon = new THREE.Mesh(
    new THREE.CircleGeometry(11, 48),
    upperDoorMoonMaterial
);

upperDoorMoon.position.set(35, 80, 3.5);
upperDoorCrescentGroup.add(upperDoorMoon);

// ------------------------------------------------------------
// پوشش داخلی هلال با رنگ واقعی چوب در
// ------------------------------------------------------------

const upperDoorMoonCutout = new THREE.Mesh(
    new THREE.CircleGeometry(10, 48),
    woodMaterial
);

// کمی جابه‌جایی برای ایجاد هلال
upperDoorMoonCutout.position.set(4.5, 3, 4.5);

upperDoorCrescentGroup.add(upperDoorMoonCutout);

// جابه‌جایی اندک برای ایجاد شکل هلال
upperDoorMoonCutout.position.set(35, 80, 3.5);
upperDoorCrescentGroup.add(upperDoorMoonCutout);

// افزودن هلال به لنگهٔ در
upperDoorGroup.add(upperDoorCrescentGroup);

/* ============================================================
   نردهٔ تزئینی بالکن طبقهٔ بالا
   پایه‌های سنگی، میله‌های طلایی و دستگیرهٔ چوبی
   ============================================================ */

// رنگ طلایی هماهنگ با نقش نیلوفر
const balconyGoldMaterial = new THREE.MeshStandardMaterial({
    color: 0xD6A64F,
    metalness: 0.68,
    roughness: 0.3
});

// ارتفاع نرده از کف بالکن
const balconyRailHeight = 37;

// محل نرده در جلوی طبقهٔ بالا
const balconyRailZ = upperFrontZ + 80;

// محدودهٔ نرده؛ وسط آن برای در ورودی باز می‌ماند
const balconyRailSegments = [

    { start: -130, end: 130 }
];

// ارتفاع مرکز نرده
const balconyRailY =
    upperFloorY + 10 + balconyRailHeight / 2;

// دستگیرهٔ چوبی بالای نرده
const balconyWoodMaterial = woodMaterial;

for (const segment of balconyRailSegments) {
    const segmentWidth = segment.end - segment.start;
    const segmentCenterX = (segment.start + segment.end) / 2;

    // دستگیرهٔ افقی بالایی
    addHouseBox(
        segmentWidth,
        6,
        7,
        segmentCenterX,
        upperFloorY + 10 + balconyRailHeight,
        balconyRailZ,
        balconyWoodMaterial
    );

    // تیر افقی پایینی
    addHouseBox(
        segmentWidth,
        4,
        5,
        segmentCenterX,
        upperFloorY + 10,
        balconyRailZ,
        balconyGoldMaterial
    );

    // میله‌های عمودی طلایی
    const balusterCount = Math.floor(segmentWidth / 14);

    for (let i = 0; i <= balusterCount; i++) {
        const x =
            segment.start + (segmentWidth / balusterCount) * i;

        const baluster = new THREE.Mesh(
            new THREE.CylinderGeometry(1.8, 1.8, 40, 8),
            balconyGoldMaterial
        );

        baluster.position.set(
            x,
            upperFloorY + 6 + 24,
            balconyRailZ
        );

        baluster.castShadow = true;
        baluster.receiveShadow = true;
        houseGroup.add(baluster);
    }

    // پایه‌های سنگی در دو انتهای هر بخش
    for (const x of [segment.start, segment.end]) {
        addHouseBox(
            9,
            48,
            9,
            x,
            balconyRailY,
            balconyRailZ,
            duplexStoneMaterial
        );

        // کلاهک طلایی کوچک روی پایه
        addHouseBox(
            12,
            3,
            12,
            x,
            upperFloorY + 10 + balconyRailHeight,
            balconyRailZ,
            balconyGoldMaterial
        );
    }
}



/* ============================================================
   نرده‌های یکپارچهٔ کناری بالکن طبقهٔ بالا
   دستگیرهٔ چوبی، میله‌های طلایی و پایه‌های سنگی
   ============================================================ */

// گروه یکپارچهٔ نرده‌های کناری
const sideBalconyRailingGroup = new THREE.Group();

// مواد نرده
const sideRailWoodMaterial = balconyWoodMaterial;
const sideRailGoldMaterial = balconyGoldMaterial;
const sideRailStoneMaterial = duplexStoneMaterial;

// ابعاد نرده
const sideRailLength = 45;
const sideRailThickness = 5;
const sideRailHeight = balconyRailHeight;

// محل قرارگیری نرده‌ها در دو طرف بالکن
const sideRailXPositions = [
    -upperFloorWidth / 2 + 8,
     upperFloorWidth / 1.79 - 20
];

// جابه‌جایی نرده‌ها در راستای Z
// عدد مثبت: حرکت به سمت Z مثبت
// عدد منفی: حرکت به سمت Z منفی
const sideRailOffsetZ = 55;

const sideRailFrontZ = upperFrontZ + sideRailOffsetZ;
const sideRailBackZ = sideRailFrontZ - sideRailLength;

// ارتفاع‌ها
const sideRailBottomY = upperFloorY + 4;
const sideRailTopY = sideRailBottomY + sideRailHeight;

// تنظیمات میله‌های عمودی
const sideRailBalusterCount = 7;
const sideRailBalusterHeight = 38;

// ساخت نرده برای هر طرف بالکن
for (const x of sideRailXPositions) {

    // --------------------------------------------------------
    // دستگیرهٔ چوبی بالایی
    // --------------------------------------------------------
    const topRail = new THREE.Mesh(
        new THREE.BoxGeometry(
            sideRailThickness + 2,
            6,
            sideRailLength + 9
        ),
        sideRailWoodMaterial
    );

    topRail.position.set(
        x,
        sideRailTopY,
        (sideRailFrontZ + sideRailBackZ) / 2
    );

    topRail.castShadow = true;
    topRail.receiveShadow = true;
    sideBalconyRailingGroup.add(topRail);

    // --------------------------------------------------------
    // تیر افقی پایینی
    // --------------------------------------------------------
    const bottomRail = new THREE.Mesh(
        new THREE.BoxGeometry(
            sideRailThickness,
            4,
            sideRailLength
        ),
        sideRailGoldMaterial
    );

    bottomRail.position.set(
        x,
        sideRailBottomY + 3,
        (sideRailFrontZ + sideRailBackZ) / 2
    );

    sideBalconyRailingGroup.add(bottomRail);

    // --------------------------------------------------------
    // میله‌های عمودی طلایی
    // --------------------------------------------------------
    for (let i = 0; i <= sideRailBalusterCount; i++) {

        const t = i / sideRailBalusterCount;

        const z =
            sideRailFrontZ -
            sideRailLength * t;

        const baluster = new THREE.Mesh(
            new THREE.CylinderGeometry(1.8, 1.8, sideRailBalusterHeight, 8),
            sideRailGoldMaterial
        );

        baluster.position.set(
            x,
            sideRailBottomY + 1 + sideRailBalusterHeight / 2,
            z
        );

        baluster.castShadow = true;
        baluster.receiveShadow = true;

        sideBalconyRailingGroup.add(baluster);
    }

    // --------------------------------------------------------
    // پایه‌های سنگی ابتدا و انتهای نرده
    // --------------------------------------------------------
    for (const z of [sideRailFrontZ, sideRailBackZ]) {

        const stonePost = new THREE.Mesh(
            new THREE.BoxGeometry(9, sideRailHeight, 9),
            sideRailStoneMaterial
        );

        stonePost.position.set(
            x,
            sideRailBottomY + sideRailHeight / 2,
            z
        );

        stonePost.castShadow = true;
        stonePost.receiveShadow = true;

        sideBalconyRailingGroup.add(stonePost);

        // کلاهک طلایی پایه
        const goldCap = new THREE.Mesh(
            new THREE.BoxGeometry(12, 3, 12),
            sideRailGoldMaterial
        );

        goldCap.position.set(
            x,
            sideRailTopY,
            z
        );

        sideBalconyRailingGroup.add(goldCap);
    }
}

// افزودن مجموعهٔ نرده‌ها به خانه
houseGroup.add(sideBalconyRailingGroup);


// ============================================================
// گلدان‌های سنگی تزئینی بالکن خانهٔ نورسا
// ============================================================

// گروه مستقل گلدان‌ها
const balconyPlantersGroup = new THREE.Group();

// مصالح گلدان
const planterStoneMaterial = new THREE.MeshStandardMaterial({
    color: 0xB7A78B,
    roughness: 0.92
});

// رنگ برگ‌ها
const planterLeafMaterial = new THREE.MeshStandardMaterial({
    color: 0x39734A,
    roughness: 0.85
});

const planterLightLeafMaterial = new THREE.MeshStandardMaterial({
    color: 0x679653,
    roughness: 0.85
});

// ------------------------------------------------------------
// تنظیمات قابل تغییر
// ------------------------------------------------------------

const planterPositionsX = [-115, 115];

// برای جابه‌جایی گلدان‌ها در راستای Z
const planterOffsetZ = 160;

// ارتفاع کف بالکن
const planterBaseY = upperFloorY + -200;

// ابعاد گلدان
const planterWidth = 34;
const planterHeight = 30;
const planterDepth = 34;

// ------------------------------------------------------------
// ساخت گلدان در هر موقعیت
// ------------------------------------------------------------

for (const x of planterPositionsX) {

    const z = upperFrontZ - 65 + planterOffsetZ;

    // پایهٔ گلدان
    const planterBase = new THREE.Mesh(
        new THREE.BoxGeometry(38, 5, 38),
        planterStoneMaterial
    );

    planterBase.position.set(
        x,
        planterBaseY + 2.5,
        z
    );

    balconyPlantersGroup.add(planterBase);

    // بدنهٔ گلدان
    const planterBody = new THREE.Mesh(
        new THREE.BoxGeometry(
            planterWidth,
            planterHeight,
            planterDepth
        ),
        planterStoneMaterial
    );

    planterBody.position.set(
        x,
        planterBaseY + 5 + planterHeight / 2,
        z
    );

    planterBody.castShadow = true;
    planterBody.receiveShadow = true;

    balconyPlantersGroup.add(planterBody);

    // لبهٔ بالایی گلدان
    const planterRim = new THREE.Mesh(
        new THREE.BoxGeometry(40, 4, 40),
        planterStoneMaterial
    );

    planterRim.position.set(
        x,
        planterBaseY + 5 + planterHeight + 2,
        z
    );

    balconyPlantersGroup.add(planterRim);

    // خاک داخل گلدان
    const soilMaterial = new THREE.MeshStandardMaterial({
        color: 0x49382A,
        roughness: 1
    });

    const soil = new THREE.Mesh(
        new THREE.BoxGeometry(29, 2, 29),
        soilMaterial
    );

    soil.position.set(
        x,
        planterBaseY + 5 + planterHeight - 1,
        z
    );

    balconyPlantersGroup.add(soil);

    // --------------------------------------------------------
    // برگ‌های اصلی گیاه
    // --------------------------------------------------------

    for (let i = 0; i < 9; i++) {

        const angle = i * Math.PI * 2 / 9;

        const leaf = new THREE.Mesh(
            new THREE.SphereGeometry(7, 8, 6),
            i % 2 === 0
                ? planterLeafMaterial
                : planterLightLeafMaterial
        );

        leaf.scale.set(0.65, 1.15, 0.8);

        leaf.position.set(
            x + Math.cos(angle) * 9,
            planterBaseY + 5 + planterHeight + 10
                + (i % 3) * 3,
            z + Math.sin(angle) * 9
        );

        leaf.rotation.z = Math.cos(angle) * 0.35;
        leaf.rotation.x = Math.sin(angle) * 0.3;

        balconyPlantersGroup.add(leaf);
    }

    // برگ‌های مرکزی و بلندتر
    for (let i = 0; i < 4; i++) {

        const leaf = new THREE.Mesh(
            new THREE.SphereGeometry(6, 8, 6),
            planterLeafMaterial
        );

        leaf.scale.set(0.65, 1.5, 0.65);

        leaf.position.set(
            x + Math.cos(i * 1.7) * 4,
            planterBaseY + 5 + planterHeight + 14,
            z + Math.sin(i * 1.7) * 4
        );

        balconyPlantersGroup.add(leaf);
    }
}

// افزودن گلدان‌ها به خانه
houseGroup.add(balconyPlantersGroup);


// ============================================================
// گل‌های رنگی تزئینی روی نرده‌های بالکن
// ============================================================

// رنگ گل‌ها
const balconyFlowerMaterials = [
    new THREE.MeshStandardMaterial({
        color: 0xF06F9B,
        roughness: 0.65
    }),
    new THREE.MeshStandardMaterial({
        color: 0xA878E8,
        roughness: 0.65
    }),
    new THREE.MeshStandardMaterial({
        color: 0xE84D54,
        roughness: 0.65
    }),
    new THREE.MeshStandardMaterial({
        color: 0xF5C84C,
        roughness: 0.65
    }),
    new THREE.MeshStandardMaterial({
        color: 0xFF91C8,
        roughness: 0.65
    })
];

// مرکز طلایی گل‌ها
const balconyFlowerCenterMaterial = new THREE.MeshStandardMaterial({
    color: 0xE6B653,
    metalness: 0.65,
    roughness: 0.3
});

// برگ‌های سبز
const balconyFlowerLeafMaterial = new THREE.MeshStandardMaterial({
    color: 0x39734A,
    roughness: 0.8
});

// گروه گل‌ها
const balconyFlowersGroup = new THREE.Group();

// ------------------------------------------------------------
// تنظیمات قابل تغییر
// ------------------------------------------------------------

// فاصلهٔ گل‌ها در امتداد نرده
const balconyFlowerSpacing = 2;

// فاصله از لبهٔ جلویی نرده در راستای Z
const balconyFlowerOffsetZ = 45;

// اندازهٔ گل‌ها
const balconyFlowerScale = 1.0;

// ارتفاع گل‌ها نسبت به دستگیره
const balconyFlowerHeightOffset = 7;

// ------------------------------------------------------------
// ساخت یک گل با پنج گلبرگ
// ------------------------------------------------------------

function addBalconyFlower(x, y, z, colorIndex, scale = 1) {

    const flowerGroup = new THREE.Group();

    // پنج گلبرگ پیرامون مرکز
    for (let i = 0; i < 5; i++) {

        const angle = i * Math.PI * 2 / 5;

        const petal = new THREE.Mesh(
            new THREE.SphereGeometry(4.5 * scale, 10, 8),
            balconyFlowerMaterials[colorIndex]
        );

        petal.scale.set(1, 0.72, 1.35);

        petal.position.set(
            Math.cos(angle) * 4.2 * scale,
            Math.sin(angle) * 4.2 * scale,
            0
        );

        petal.rotation.z = angle;

        flowerGroup.add(petal);
    }

    // مرکز طلایی گل
    const center = new THREE.Mesh(
        new THREE.SphereGeometry(3 * scale, 12, 10),
        balconyFlowerCenterMaterial
    );

    center.position.z = 1.5 * scale;
    flowerGroup.add(center);

    // دو برگ سبز کوچک زیر گل
    for (const side of [-1, 1]) {

        const leaf = new THREE.Mesh(
            new THREE.SphereGeometry(3.5 * scale, 8, 6),
            balconyFlowerLeafMaterial
        );

        leaf.scale.set(1.4, 0.55, 0.7);

        leaf.position.set(
            side * 4 * scale,
            -5 * scale,
            -1 * scale
        );

        leaf.rotation.z = side * 0.4;

        flowerGroup.add(leaf);
    }

    flowerGroup.position.set(x, y, z);

    balconyFlowersGroup.add(flowerGroup);
}

// ------------------------------------------------------------
// گل‌گذاری روی دو نردهٔ کناری
// ------------------------------------------------------------

for (const x of sideRailXPositions) {

    for (let i = 0; i < 6; i++) {

        const z =
            sideRailFrontZ -
            balconyFlowerOffsetZ -
            i * balconyFlowerSpacing;

        const y =
            sideRailTopY +
            6 +
            balconyFlowerHeightOffset;

        const colorIndex = i % balconyFlowerMaterials.length;

        addBalconyFlower(
            x,
            y,
            z,
            colorIndex,
            balconyFlowerScale
        );
    }
}

// ------------------------------------------------------------
// گل‌گذاری روی نردهٔ جلویی
// ------------------------------------------------------------

// اگر نردهٔ جلویی داری، این بخش گل‌ها را در امتداد آن می‌چیند.
const frontFlowerCount = 9;
const frontFlowerLeftX = -upperFloorWidth / 2 + 25;
const frontFlowerRightX = upperFloorWidth / 2 - 25;

for (let i = 0; i < frontFlowerCount; i++) {

    const t = i / (frontFlowerCount - 1);

    const x =
        frontFlowerLeftX +
        (frontFlowerRightX - frontFlowerLeftX) * t;

    const y =
        sideRailTopY +
        6 +
        balconyFlowerHeightOffset;

    const z = upperFrontZ + 35 + balconyFlowerOffsetZ;

    addBalconyFlower(
        x,
        y,
        z,
        (i + 2) % balconyFlowerMaterials.length,
        balconyFlowerScale
    );
}


// افزودن گل‌ها به خانه
houseGroup.add(balconyFlowersGroup);

// ------------------------------------------------------------
// سقف شیروانی طبقهٔ بالا
// ------------------------------------------------------------

const upperRoofY =
    upperFloorY + 5 + upperWallHeight + 45;

const upperRoofMaterial = roofMaterial;

// دو سطح شیب‌دار سقف
const upperRoofLeft = new THREE.Mesh(
    new THREE.BoxGeometry(250, 12, 410),
    upperRoofMaterial
);

upperRoofLeft.position.set(
    -75, upperRoofY, upperFloorZ
);

upperRoofLeft.rotation.z = 0.48;
upperRoofLeft.castShadow = true;
upperRoofLeft.receiveShadow = true;
houseGroup.add(upperRoofLeft);

const upperRoofRight = new THREE.Mesh(
    new THREE.BoxGeometry(250, 12, 410),
    upperRoofMaterial
);

upperRoofRight.position.set(
    75, upperRoofY, upperFloorZ
);

upperRoofRight.rotation.z = -0.48;
upperRoofRight.castShadow = true;
upperRoofRight.receiveShadow = true;
houseGroup.add(upperRoofRight);

// تیر چوبی زیر خط‌الرأس سقف
addHouseBox(
    10, 10, 410,
    0, upperRoofY + 50, upperFloorZ,
    woodMaterial
);

addHouseBox(10, 10, 370, 0, upperRoofY + 50, upperFloorZ, woodMaterial);


/* =========================================================
   تزئینات سلطنتی سقف خانه نورسا
   رنگ‌ها: سبزآبی، طلایی و عاجی
   ========================================================= */

// ---------------------------------------------------------
// ۱. مواد اختصاصی تزئینات سقف
// از نام‌های جدید استفاده می‌کنیم تا با متغیرهای موجود
// خانه تداخلی ایجاد نشود.
// ---------------------------------------------------------

const norsaRoofGold = new THREE.MeshStandardMaterial({
    color: 0xE6B653,
    metalness: 0.68,
    roughness: 0.3
});

const norsaRoofIvory = new THREE.MeshStandardMaterial({
    color: 0xE8DDC5,
    metalness: 0.08,
    roughness: 0.72
});

// ---------------------------------------------------------
// ۲. دو نوار طلایی در امتداد لبه‌های شیب‌دار سقف
// نوارها روی سطح بیرونی سقف قرار می‌گیرند.
// ---------------------------------------------------------

const norsaRoofTrimLength = 410;
const norsaRoofTrimWidth = 3;
const norsaRoofTrimHeight = 2;

const norsaRoofTrimLeft = new THREE.Mesh(
    new THREE.BoxGeometry(
        norsaRoofTrimWidth,
        norsaRoofTrimHeight,
        norsaRoofTrimLength
    ),
    norsaRoofGold
);

norsaRoofTrimLeft.position.set(
    -75,
    upperRoofY + 10,
    upperFloorZ
);

norsaRoofTrimLeft.rotation.z = 0.48;
norsaRoofTrimLeft.castShadow = true;
houseGroup.add(norsaRoofTrimLeft);

const norsaRoofTrimRight = new THREE.Mesh(
    new THREE.BoxGeometry(
        norsaRoofTrimWidth,
        norsaRoofTrimHeight,
        norsaRoofTrimLength
    ),
    norsaRoofGold
);

norsaRoofTrimRight.position.set(
    75,
    upperRoofY + 10,
    upperFloorZ
);

norsaRoofTrimRight.rotation.z = -0.48;
norsaRoofTrimRight.castShadow = true;
houseGroup.add(norsaRoofTrimRight);

// ---------------------------------------------------------
// ۳. نشان خورشیدی سه‌بعدی در خط‌الرأس سقف
// این نشان مستقل از خورشید روی در است.
// ---------------------------------------------------------

const norsaRoofSun = new THREE.Group();

// خط‌الرأس در بالاترین نقطه سقف قرار دارد.
// نشان را کمی بالاتر از تیر فعلی قرار می‌دهیم.
norsaRoofSun.position.set(
    0,
    upperRoofY + 75,
    upperFloorZ
);

const norsaRoofSunRing = new THREE.Mesh(
    new THREE.TorusGeometry(12, 2, 12, 40),
    norsaRoofGold
);

norsaRoofSunRing.castShadow = true;
norsaRoofSun.add(norsaRoofSunRing);

const norsaRoofSunCenter = new THREE.Mesh(
    new THREE.SphereGeometry(7.5, 20, 16),
    norsaRoofGold
);

norsaRoofSunCenter.position.z = 0.5;
norsaRoofSunCenter.castShadow = true;
norsaRoofSun.add(norsaRoofSunCenter);

// دوازده پرتو کوتاه پیرامون نشان
for (let i = 0; i < 12; i++) {

    const angle = (i / 12) * Math.PI * 2;

    const ray = new THREE.Mesh(
        new THREE.ConeGeometry(2.2, 7, 4),
        norsaRoofGold
    );

    const radius = 18;

    ray.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
    );

    ray.rotation.z = angle - Math.PI / 2;
    ray.castShadow = true;

    norsaRoofSun.add(ray);
}

houseGroup.add(norsaRoofSun);

// ---------------------------------------------------------
// ۴. جزئیات عاجی روی تیر خط‌الرأس
// قطعات کوچک و متقارن در دو سوی نشان خورشید
// ---------------------------------------------------------

for (const side of [-1, 1]) {

    const ivoryAccent = new THREE.Mesh(
        new THREE.BoxGeometry(5, 5, 28),
        norsaRoofIvory
    );

    ivoryAccent.position.set(
        side * 25,
        upperRoofY + 54,
        upperFloorZ
    );

    ivoryAccent.castShadow = true;
    houseGroup.add(ivoryAccent);
}


/* ============================================================
   پوشش میانی بخش جلویی خانه
   فضای راه‌پله و نیم‌طبقهٔ پشتی باز می‌مانند
   ============================================================ */

// متریال هماهنگ با کف چوبی خانه
const frontCeilingMaterial = woodMaterial;

// پوشش جلویی؛ از نیم‌طبقهٔ پشتی فاصله دارد
addHouseBox(
    199,                 // عرض پوشش
    20,                   // ضخامت
    65,                  // عمق پوشش
    70,                   // مرکز افقی
    mezzanineY - 0,       // ارتفاع
    101,                // مرکز بخش جلویی
    frontCeilingMaterial
);


// ------------------------------------------------------------
// راه‌پلهٔ مارپیچی داخل خانه
// ------------------------------------------------------------

// مرکز گردش پله
const spiralCenterX = -88;
const spiralCenterZ = 90;

// شعاع گردش پله
const spiralRadius = 26;

// تعداد پله‌ها
const stairCount = 28;

// ارتفاع ابتدا و انتهای پله
const stairStartY = mezzanineY + 15;
const stairEndY = houseBaseY + 9;

// زاویهٔ گردش؛ یک دور کامل
const spiralTurns = 1;

// مسیر مارپیچی پله
const stairCurve = new THREE.CurvePath();

// نقاط مسیر از بالا به پایین
const spiralPoints = [];

for (let i = 0; i <= stairCount; i++) {
    const t = i / stairCount;

    // گردش از یک دور کامل به سمت نقطهٔ خروج
    const angle = Math.PI * 2 * spiralTurns * t;

    const x =
        spiralCenterX + Math.cos(angle) * spiralRadius;

    const z =
        spiralCenterZ + Math.sin(angle) * spiralRadius;

    const y =
        stairStartY + (stairEndY - stairStartY) * t;

    spiralPoints.push(
        new THREE.Vector3(x, y, z)
    );
}

const spiralPath = new THREE.CatmullRomCurve3(
    spiralPoints,
    false,
    "centripetal"
);

// ------------------------------------------------------------
// ساخت پله‌های مارپیچی
// ------------------------------------------------------------

for (let i = 0; i < stairCount; i++) {
    const t = i / (stairCount - 1);
    const point = spiralPath.getPoint(t);

    const stair = new THREE.Mesh(
        new THREE.BoxGeometry(68, 5, 18),
        duplexStoneMaterial
    );

    stair.position.copy(point);

    // هر پله متناسب با زاویهٔ گردش می‌چرخد
    stair.rotation.y =
        -Math.PI * 2 * spiralTurns * t;

    stair.castShadow = true;
    stair.receiveShadow = true;

    houseGroup.add(stair);
}
// ------------------------------------------------------------
// خانه همیشه با سقف و دیوارهایش نمایش داده شود
// ------------------------------------------------------------

function updateHouseInteriorView() {
    // در این نسخه، اجزای خانه با نزدیک‌شدن مخفی نمی‌شوند.
}


houseGroup.position.set(houseX, houseY, houseZ);
scene.add(houseGroup);


// ============================================================
// 19) زمان‌بندی صحنه‌ها و کنترل دوربین
// ============================================================

// مدت هدف فیلم؛ برحسب ثانیه
const FILM_TIMELINE_CONFIG = {
    targetDuration: 471,
    tolerance: 0.01
};

// زمان‌بندی مشترک صحنه ورود چمروش و آنیل
const FLASHBACK_TIMING = {
    cameraSkyTurn: 0.15,
    cameraApproach: 0.40,
    cameraLanding: 0.65,
    cameraDoor: 0.82,

    chamroshApproachStart: 0.08,
    chamroshApproachEnd: 0.28,
    chamroshLandingEnd: 0.48,

    anilWalkStart: 0.62,
    anilArrive: 0.88,

    doorOpen: 0.76,
    doorClose: 0.98
};

// مدت هر صحنه، مکث و انتقال مستقل تنظیم می‌شود.
// مختصات دوربین فعلاً از مسیر قبلی حفظ شده‌اند.
const FILM_SCENES = [
    {
        id: "village_intro",
        name: "نمای صحنه یکم، جهانی بدون طلوع",
        duration: 60,
        hold: 5,
        transition: 30,
        cameraPath: [
            {
                at: 0,
                x: 12000, y: 2300, z: -4000,
                //افقی
                yaw: 120,
                //عمودی
                pitch: -20,
                //زاویه دید
                fov: 25
            },
            {
                at: 0.35,
                x: 6500, y: 2300, z: -1500,
                yaw: 120,
                pitch: -20,
                fov: 25
            },
            {
                at: 0.60,
                x: -5000, y: 2300, z: 1500,
                yaw: 160,
                pitch: -30,
                fov: 25
            },
            {
                at: 0.82,
                x: -5010, y: 2300, z: 1700,
                yaw: 160,
                pitch: -33,
                fov: 25
            },
            {
                at: 1,
                x: -3000, y: 2200, z: 4500,
                yaw: 190,
                pitch: -35,
                fov: 30
            }
        ]
    },
        {
            id: "house_view",
            name: "آتش‌های کوچک",
            duration: 50,
            hold: 10,
            transition: 40,
            cameraPath: [
                {
                    at: 0,
                    x: -3000, y: 2200, z: 4500,
                    yaw: 190, pitch: -35, fov: 30
                },
                {
                    at: 0.35,
                    x: -2500, y: 1500, z: 5000,
                    yaw: 250, pitch: -40, fov: 32
                },
                {
                    at: 0.50,
                    x: -2000, y: 900, z: 6100,
                    yaw: 250, pitch: -40, fov: 35
                },
                {
                    at: 0.75,
                    x: -1500, y: 800, z: 6200,
                    yaw: 250, pitch: -55, fov: 38
                },
                {
                    at: 1,
                    x: -1100, y: 900, z: 6200,
                    yaw: 250, pitch: -55, fov: 35
                }
            ]
        },

        {
            id: "village_dialogue",
            name: "گفت‌وگوی مردم کنار آتش",
            duration: 6,
            hold: 60,
            transition: 0,
            camera: {
                x: -1100,
                y: 900,
                z: 6200,
                yaw: 250,
                pitch: -55,
                fov: 35
            }
        },
    {
            id: "approach_house",
            name: "نزدیک‌شدن به خانه",
            duration: 50,
            hold: 10,
            transition: 30,
            cameraPath: [
                {
                    at: 0,
                    x: -1100, y: 900, z: 6200,
                    yaw: 0, pitch: -10, fov: 35
                },
                {
                    at: 0.1,
                    x: -900, y: 950, z: 6200,
                    yaw: 0, pitch: -10, fov: 35
                },
                {
                    at: 0.2,
                    x: -700, y: 1100, z: 6200,
                    yaw: 0, pitch: -10, fov: 35
                },
                {
                    at: 0.3,
                    x: -100, y: 1200, z: 6200,
                    yaw: 0, pitch: -10, fov: 35
                },
                {
                    at: 0.4,
                    x: 100, y: 1300, z: 6200,
                    yaw: 0, pitch: -10, fov: 35
                },
                {
                    at: 0.5,
                    x: 100, y: 1400, z: 6000,
                    yaw: 0, pitch: -5, fov: 32
                },
                {
                    at: 0.7,
                    x: 40, y: 1700, z: 5900,
                    yaw: 0, pitch: 5, fov: 30
                },
                {
                    at: 1,
                    x: 10, y: 1800, z: 2550,
                    yaw: 0, pitch: -10, fov: 30
                }
            ]
        },
        {
            id: "cradle_revelation",
            name: "راز گهواره",
            duration: 40,
            hold: 30,
            transition: 5,
            cameraPath: [
                {
                    at: 0,
                    x: 10,
                    y: 1800,
                    z: 2550,
                    yaw: -0,
                    pitch: -10,
                    fov: 30
                },
                {
                    at: 0.2,
                    x: 10,
                    y: 1810,
                    z: 2550,
                    yaw: -50,
                    pitch: -32,
                    fov: 28
                },
                {
                    at: 1,
                    x: 10,
                    y: 1810,
                    z: 2550,
                    yaw: -50,
                    pitch: -27,
                    fov: 28
                }
            ]
        },

        {
            id: "chamrosh_flashback",
            name: "ورود چمروش و آنیل",
            duration: 35,
            hold: 10,
            transition: 5,
            cameraPath: [
                // شروع از همان نمای پایانی گهواره؛ بدون پرش دوربین
                {
                    at: 0,
                    x: 10, y: 1800, z: 2550,
                    yaw: -70, pitch: -10, fov: 28
                },
                // نگاه دوربین به سمت راست و بالای آسمان
                {
                    at: FLASHBACK_TIMING.cameraSkyTurn,
                    x: 10, y: 1810, z: 2550,
                    yaw: 20, pitch: 15, fov: 30
                },
                // حرکت آرام دوربین در جهت Z مثبت
                {
                    at: FLASHBACK_TIMING.cameraApproach,
                    x: 10, y: 1950, z: 3200,
                    yaw: 15, pitch: 10, fov: 32
                },
                // دنبال‌کردن ورود و فرود چمروش
                {
                    at: FLASHBACK_TIMING.cameraLanding,
                    x: -150, y: 1850, z: 3900,
                    yaw: 0, pitch: -5, fov: 32
                },
                // حرکت به سمت خانه برای دنبال‌کردن آنیل
                {
                    at: FLASHBACK_TIMING.cameraDoor,
                    x: -100, y: 1750, z: 4000,
                    yaw: 0, pitch: -5, fov: 30
                },
                // نمای پایانی؛ بعداً با نمای دقیق داخل خانه تنظیم می‌کنیم
                {
                    at: 0.5,
                    x: 10, y: 1800, z: 2550,
                    yaw: -0, pitch: -10, fov: 30
                },
                {
                    at: 1,
                    x: 10, y: 1810, z: 2550,
                    yaw: -60, pitch: -30, fov: 28
                }
            ]
        },

        {

        id: "birth",
        name: "لحظه تولد",
        duration: 30,
        hold: 20,
        transition: 30,
        cameraPath: [
            // نمای آغازین؛ سکوت پیش از تولد
            {
                at: 0,
                x: 10, y: 1810, z: 2550,
                yaw: -60, pitch: -30, fov: 28
            },
            // حرکت آرام به سوی گهواره
            {
                at: 0.25,
                x: 10, y: 1805, z: 2540,
                yaw: -55, pitch: -28, fov: 20
            },
            // نزدیک‌شدن دوربین به گهواره
            {
                at: 0.3,
                x: 10, y: 1800, z: 2545,
                yaw: -50, pitch: -25, fov: 10
            },
            {
                at: 1,
                x: 10, y: 1800, z: 2550,
                yaw: -55, pitch: -25, fov: 10
            },
        ],
    },
    {
        id: "first_lian",
        name: "نخستین لیان",
        duration: 40,
        hold: 15,
        transition: 10,
        cameraPath: [
            // آغاز: دوربین هنوز نزدیک خانه است
            {
                at: 0,
                x: 10,
                y: 1800,
                z: 2550,
                yaw: -50,
                pitch: -25,
                fov: 10
            },
            // دورشدن از خانه و چرخش به سوی کوه
            {
                at: 0.25,
                x: -10,
                y: 1800,
                z: 2200,
                yaw: -25,
                pitch: -5,
                fov: 15
            },
            // نمای قله در تاریکی
            {
                at: 0.35,
                x: -10,
                y: 1800,
                z: 2100,
                yaw: -25,
                pitch: -5,
                fov: 15
            },
            // مکث روی قله؛ محل ظهور خط طلایی
            {
                at: 1,
                x: -10,
                y: 1700,
                z: 2000,
                yaw: -30,
                pitch: -15,
                fov: 15
            }
        ]
    },
    {
        id: "sunrise",
        name: "بازگشت خورشید",
        duration: 40,
        hold: 15,
        transition: 10,
        cameraPath: [
            // آغاز: نمای قله پس از ظهور نخستین لیان
            {
                at: 0,
                x: -10,
                y: 1700,
                z: 2000,
                yaw: -30,
                pitch: -15,
                fov: 15
            },

            // حرکت از بالای کوه به سمت آبادی
            {
                at: 0.2,
                x: -550,
                y: 3000,
                z: 3000,
                yaw: 180,
                pitch: -35,
                fov: 15
            },
            {
                at: 0.2,
                x: -550,
                y: 2500,
                z: 4000,
                yaw: 180,
                pitch: -50,
                fov: 15
            },

            // نزدیک‌شدن به میدان از بالا
            {
                at: 0.4,
                x: -500,
                y: 2000,
                z: 8400,
                yaw: 0,
                pitch: -40,
                fov: 35
            },

            // پایان: ایستادن روبه‌روی مردم میدان
            {
                at: 0.5,
                x: -500,
                y: 2000,
                z: 9400,
                yaw: -360,
                pitch: -35,
                fov: 30
            },
            {
                at: 1,
                x: -500,
                y: 1800,
                z: 9000,
                yaw: -360,
                pitch: -35,
                fov: 10
            }
        ]
    },
    {
        id: "return",
        name: "بازگشت آنیل",
        duration: 60,
        hold: 15,
        transition: 10,
        cameraPath: [
            // شروع از موقعیت فعلی دوربین
            {
                at: 0,
                x: -500,
                y: 1800,
                z: 9000,
                yaw: -360,
                pitch: -35,
                fov: 10
            },

            // حرکت دوربین به سمت خانهٔ نورسا
            {
                at: 0.2,
                x: 0,
                y: 2000,
                z: 7000,
                yaw: -360,
                pitch: -20,
                fov: 28
            },

            // رسیدن به نزدیکی خانه و چمروش
            {
                at: 0.3,
                x: 0,
                y: 1900,
                z: 3200,
                yaw: -360,
                pitch: -10,
                fov: 80
            },
            {
                at: 0.5,
                x: 0,
                y: 1900,
                z: 3200,
                yaw: -360,
                pitch: -10,
                fov: 80
            },
            {
                at: 0.5,
                x: 0,
                y: 1900,
                z: 3203,
                yaw: -360,
                pitch: -10,
                fov: 10
            },

            // حرکت دوربین به‌عنوان نمای پرواز
            {
                at: 0.6,
                x: -250,
                y: 4100,
                z: 3250,
                yaw: 180,
                pitch: 90,
                fov: 10
            },
            {
                at: 0.6,
                x: -250,
                y: 4100,
                z: 4800,
                yaw: 180,
                pitch: 65,
                fov: 10
            },

            // رسیدن به میدان سنگی
            {
                at: 0.7,
                x: -1100,
                y: 1000,
                z: 6200,
                yaw: 240,
                pitch: -45,
                fov: 35
            },
            {
                at: 0.7,
                x: -1100,
                y: 1000,
                z: 6200,
                yaw: 240,
                pitch: -45,
                fov: 35
            },
            {
                at: 1,
                x: -700,
                y: 900,
                z: 6100,
                yaw: 240,
                pitch: -45,
                fov: 20
            }
        ]
    },
    {
        id: "ending_return_reveal",
        name: "پایان داستان",
        duration: 60,
        hold: 15,
        transition: 10,
        cameraPath: [
            // شروع از موقعیت فعلی دوربین
            {
                at: 0,
                x: -700,
                y: 900,
                z: 6100,
                yaw: 240,
                pitch: -45,
                fov: 20
            },
            // پرده دهم — آغاز نمای گسترده از طبیعت
            {
                at: 0.1,
                x: -1100,
                y: 900,
                z: 6600,
                yaw: 180,
                pitch: -25,
                fov: 20
            },
            {
                at: 0.2,
                x: -2500,
                y: 900,
                z: 6600,
                yaw: 180,
                pitch: -25,
                fov: 20
            },
            {
                at: 0.4,
                x: -2600,
                y: 4200,
                z: 9500,
                yaw: 180,
                pitch: -55,
                fov: 20
            },
            // نمای نهایی — رودخانه، جنگل و کوهستان از دور
            {
                at: 0.6,
                x: -1400,
                y: 3300,
                z: 8500,
                yaw: 180,
                pitch: -55,
                fov: 20
            },
            {
                at: 0.8,
                x: -1200,
                y: 4300,
                z: 8500,
                yaw: -60,
                pitch: -50,
                fov: 20
            },
            {
                at: 1,
                x: -1200,
                y: 4300,
                z: 8500,
                yaw: -60,
                pitch: -30,
                fov: 20
            }
        ]
    }
]

// زمان‌بندی خودکار دیالوگ‌های افسانهٔ لیان
// at یعنی چند ثانیه بعد از شروع پرده، وویس آغاز شود.

const FILM_VOICE_SCHEDULE = [
    {
        sceneId: 'village_intro',
        folder: 'پرده یکم',
        cues: [
            { file: '001_scene_01_gordafarid.mp3', at: 0 },
            { file: '002_scene_01_hirbod.mp3', at: 6 },
            { file: '003_scene_01_gordafarid.mp3', at: 15 },
            { file: '004_scene_01_hirbod.mp3', at: 23 },
            { file: '005_scene_01_hirbod.mp3', at: 28 },
            { file: '006_scene_01_gordafarid.mp3', at: 34 },
            { file: '007_scene_01_gordafarid.mp3', at: 40 },
            { file: '008_scene_01_hirbod.mp3', at: 44 },
            { file: '009_scene_01_gordafarid.mp3', at: 52 },
        ],
    },
    {
        sceneId: 'house_view',
        folder: 'پرده دوم',
        cues: [
            { file: '010_scene_02_hirbod.mp3', at: 0 },
            { file: '011_scene_02_gordafarid.mp3', at: 15 },
            { file: '012_scene_02_hirbod.mp3', at: 23 },
            { file: '013_scene_02_gordafarid.mp3', at: 33 },
            { file: '014_scene_02_hirbod.mp3', at: 40 },
            { file: '015_scene_02_hirbod.mp3', at: 45 },
            { file: '016_scene_02_gordafarid.mp3', at: 50 },
        ],
    },
    {
        sceneId: 'village_dialogue',
        folder: 'پرده سوم',
        cues: [
            { file: '017_scene_03_gordafarid.mp3', at: 0 },
            { file: '018_scene_03_hirbod.mp3', at: 4 },
            { file: '019_scene_03_gordafarid.mp3', at: 8 },
            { file: '020_scene_03_hirbod.mp3', at: 12 },
            { file: '021_scene_03_gordafarid.mp3', at: 16 },
        ],
    },
    {
        sceneId: 'approach_house',
        folder: 'پرده چهارم',
        cues: [
            { file: '022_scene_04_gordafarid.mp3', at: 0 },
            { file: '023_scene_04_hirbod.mp3', at: 7 },
            { file: '024_scene_04_gordafarid.mp3', at: 14 },
            { file: '025_scene_04_hirbod.mp3', at: 21 },
            { file: '026_scene_04_gordafarid.mp3', at: 28 },
            { file: '027_scene_04_hirbod.mp3', at: 35 },
            { file: '028_scene_04_gordafarid.mp3', at: 42 },
            { file: '029_scene_04_hirbod.mp3', at: 49 },
        ],
    },
    {
        sceneId: 'cradle_revelation',
        folder: 'پرده پنجم',
        cues: [
            { file: '030_scene_05_gordafarid.mp3', at: 0 },
        ],
    },
    {
        sceneId: 'chamrosh_flashback',
        // فایل‌های صحنهٔ ششم فعلاً در پوشهٔ «پرده پنجم» هستند.
        folder: 'پرده پنجم',
        cues: [
            { file: '031_scene_06_gordafarid.mp3', at: 0 },
            { file: '032_scene_06_hirbod.mp3', at: 8 },
            { file: '033_scene_06_gordafarid.mp3', at: 16 },
            { file: '034_scene_06_hirbod.mp3', at: 24 },
            { file: '035_scene_06_gordafarid.mp3', at: 32 },
            { file: '036_scene_06_hirbod.mp3', at: 40 },
            { file: '037_scene_06_gordafarid.mp3', at: 48 },
        ],
    },
    {
        sceneId: 'birth',
        folder: 'پرده هفتم',
        cues: [
            { file: '038_scene_07_gordafarid.mp3', at: 0 },
            { file: '039_scene_07_hirbod.mp3', at: 6 },
            { file: '040_scene_07_gordafarid.mp3', at: 12 },
            { file: '041_scene_07_hirbod.mp3', at: 18 },
            { file: '042_scene_07_gordafarid.mp3', at: 24 },
            { file: '043_scene_07_hirbod.mp3', at: 30 },
            { file: '044_scene_07_gordafarid.mp3', at: 36 },
            { file: '045_scene_07_hirbod.mp3', at: 42 },
            { file: '046_scene_07_gordafarid.mp3', at: 48 },
        ],
    },
    {
        sceneId: 'first_lian',
        folder: 'پرده هشتم',
        cues: [
            { file: '047_scene_08_hirbod.mp3', at: 0 },
            { file: '048_scene_08_gordafarid.mp3', at: 12 },
            { file: '049_scene_08_hirbod.mp3', at: 24 },
            { file: '050_scene_08_gordafarid.mp3', at: 36 },
        ],
    },
    {
        sceneId: 'sunrise',
        folder: 'پرده نهم',
        cues: [
            { file: '051_scene_09_hirbod.mp3', at: 0 },
            { file: '052_scene_09_gordafarid.mp3', at: 8 },
            { file: '053_scene_09_hirbod.mp3', at: 14 },
            { file: '054_scene_09_gordafarid.mp3', at: 16 },
            { file: '055_scene_09_hirbod.mp3', at: 26 },
            { file: '056_scene_09_gordafarid.mp3', at: 32 },
            { file: '057_scene_09_hirbod.mp3', at: 36 },
            { file: '058_scene_09_gordafarid.mp3', at: 42 },
            { file: '059_scene_09_hirbod.mp3', at: 48 },
        ],
    },
    {
        sceneId: 'ending_return_reveal',
        folder: 'پرده دهم',
        cues: [
            { file: '060_scene_10_ending.mp3', at: 0 },
        ],
    },
];

// ============================================================
// پخش سراسری وویس‌ها در سراسر فیلم
// ============================================================

let filmVoiceTracks = [];
let activeFilmVoiceTrack = null;
let nextFilmVoiceIndex = 0;

let filmVoiceScheduleReady = false;
let filmVoicePreparationPromise = null;

// توقف فقط صدای در حال پخش؛ زمان‌بندی سراسری را حذف نمی‌کنیم.
function stopFilmVoiceAudio() {
    if (activeFilmVoiceTrack?.audio) {
        activeFilmVoiceTrack.audio.pause();
        activeFilmVoiceTrack.audio.currentTime = 0;
    }

    activeFilmVoiceTrack = null;
}

// آماده‌سازی صداها و خواندن مدت واقعی هر فایل
async function prepareFilmVoiceSchedule() {
    if (filmVoiceScheduleReady) return;

    if (filmVoicePreparationPromise) {
        return filmVoicePreparationPromise;
    }

    filmVoicePreparationPromise = (async () => {
        // همهٔ وویس‌ها را به ترتیب پرده‌ها در یک فهرست قرار می‌دهیم.
        const cues = FILM_VOICE_SCHEDULE.flatMap((schedule) =>
            schedule.cues.map((cue) => ({
                ...cue,
                folder: schedule.folder,
                sceneId: schedule.sceneId
            }))
        );

        // مدت هر فایل از اطلاعات واقعی خود فایل خوانده می‌شود.
        const tracks = await Promise.all(
            cues.map((cue) => new Promise((resolve, reject) => {
                const audio = new Audio();

                audio.preload = 'metadata';

                const audioPath =
                    `./narration/voices/${cue.folder}/${cue.file}`;

                const cleanup = () => {
                    audio.removeEventListener(
                        'loadedmetadata',
                        handleLoaded
                    );

                    audio.removeEventListener(
                        'error',
                        handleError
                    );
                };

                const handleLoaded = () => {
                    cleanup();

                    if (
                        !Number.isFinite(audio.duration) ||
                        audio.duration <= 0
                    ) {
                        reject(
                            new Error(
                                `مدت فایل معتبر نیست: ${cue.file}`
                            )
                        );
                        return;
                    }

                    resolve({
                        ...cue,
                        audio,
                        duration: audio.duration,
                        startAt: 0
                    });
                };

                const handleError = () => {
                    cleanup();

                    reject(
                        new Error(
                            `فایل صوتی بارگذاری نشد: ${audioPath}`
                        )
                    );
                };

                audio.addEventListener(
                    'loadedmetadata',
                    handleLoaded
                );

                audio.addEventListener(
                    'error',
                    handleError
                );

                audio.src = encodeURI(audioPath);
                audio.load();
            }))
        );

        if (tracks.length === 0) {
            throw new Error('هیچ فایل وویسی برای پخش پیدا نشد.');
        }

        const totalVoiceDuration = tracks.reduce(
            (total, track) => total + track.duration,
            0
        );

        const finalTrack = tracks[tracks.length - 1];

        // صدای پایانی باید دقیقاً در انتهای فیلم تمام شود.
        const availableBeforeFinal =
            FILM_TIMELINE_DURATION - finalTrack.duration;

        const earlierVoiceDuration =
            totalVoiceDuration - finalTrack.duration;

        if (
            availableBeforeFinal < 0 ||
            earlierVoiceDuration <= 0
        ) {
            throw new Error(
                'مدت وویس‌ها با مدت فیلم سازگار نیست.'
            );
        }

        // فاصله‌های خالی به‌صورت متناسب میان وویس‌های قبلی توزیع می‌شوند.
        const spacingScale =
            availableBeforeFinal / earlierVoiceDuration;

        let cumulativeDuration = 0;

        tracks.forEach((track, index) => {
            if (index === tracks.length - 1) {
                track.startAt =
                    FILM_TIMELINE_DURATION - track.duration;
            } else {
                track.startAt =
                    cumulativeDuration * spacingScale;
            }

            cumulativeDuration += track.duration;
        });

        filmVoiceTracks = tracks;
        filmVoiceScheduleReady = true;

        console.info('زمان‌بندی سراسری وویس‌ها آماده شد.', {
            voiceCount: tracks.length,
            totalVoiceDuration: totalVoiceDuration.toFixed(2),
            filmDuration: FILM_TIMELINE_DURATION.toFixed(2),
            finalVoiceStart: finalTrack.startAt.toFixed(2),
            finalVoiceEnd: (
                finalTrack.startAt + finalTrack.duration
            ).toFixed(2)
        });
    })();

    try {
        await filmVoicePreparationPromise;
    } catch (error) {
        filmVoicePreparationPromise = null;
        throw error;
    }
}


/* ============================================================
   موسیقی پس‌زمینهٔ افسانهٔ لیان
   ============================================================ */

const backgroundMusic = new Audio(
    "./music/KarenHomayoonFar-ShabeVaghee-low.mp3"
);

backgroundMusic.loop = true;
backgroundMusic.volume = 0;
backgroundMusic.preload = "auto";

function startBackgroundMusic() {
    if (!backgroundMusic.paused) return;

    backgroundMusic.currentTime = 0;

    backgroundMusic.play().catch((error) => {
        console.error("پخش موسیقی پس‌زمینه شروع نشد:", error);
    });
}


// بازنشانی برای شروع دوبارهٔ فیلم
function resetFilmVoicePlayback() {
    stopFilmVoiceAudio();
    nextFilmVoiceIndex = 0;
}

// اجرای زمان‌بندی بدون وابستگی به تغییر صحنه
function updateFilmVoicePlayback(elapsedSeconds) {
    if (
        !storyStarted ||
        !filmVoiceScheduleReady ||
        !Number.isFinite(elapsedSeconds)
    ) {
        return;
    }

    // هرگز صدای در حال پخش را با صدای بعدی قطع نمی‌کنیم.
    if (
        activeFilmVoiceTrack &&
        !activeFilmVoiceTrack.audio.ended &&
        !activeFilmVoiceTrack.audio.paused
    ) {
        return;
    }

    // اگر صدای قبلی تمام شده باشد، اجازهٔ پخش بعدی را می‌دهیم.
    if (activeFilmVoiceTrack?.audio.ended) {
        activeFilmVoiceTrack = null;
    }

    const nextTrack = filmVoiceTracks[nextFilmVoiceIndex];

    if (!nextTrack) return;

    // تا رسیدن زمان تعیین‌شدهٔ فایل بعدی صبر می‌کنیم.
    if (elapsedSeconds < nextTrack.startAt) return;

    activeFilmVoiceTrack = nextTrack;
    nextFilmVoiceIndex++;

    nextTrack.audio.currentTime = 0;

    nextTrack.audio.play().catch((error) => {
        console.error(
            `پخش وویس ناموفق بود: ${nextTrack.file}`,
            error
        );

        if (activeFilmVoiceTrack === nextTrack) {
            activeFilmVoiceTrack = null;
        }
    });
}

// محاسبهٔ زمان شروع و پایان صحنه‌ها
function buildFilmTimeline(scenes) {
    let cursor = 0;

    return scenes.map((scene) => {
        const start = cursor;
        const end = start + scene.duration;

        cursor = end;

        return {
            ...scene,
            start,
            end
        };
    });
}

const FILM_TIMELINE = buildFilmTimeline(FILM_SCENES);


/* ============================================================
   نور افسانه‌ای لیان — حرکت از خانه به قلهٔ کوه
   ============================================================ */

// پیدا کردن کوه مقصد
const lianTargetMountain = mountainRanges.find(
    (mountain) =>
        Math.abs(mountain.position.x - 1300) < 1 &&
        Math.abs(mountain.position.z - 1000) < 1
);

// مبدأ نور: بالای خانه
const lianLightStart = new THREE.Vector3(
    houseX,
    houseY + 100,
    houseZ
);

// مقصد نور: بالاترین نقطهٔ کوه انتخاب‌شده
let lianLightTarget = new THREE.Vector3(
    1300,
    1000,
    1000
);

if (lianTargetMountain) {
    const mountainBounds = new THREE.Box3()
        .setFromObject(lianTargetMountain);

    lianLightTarget.set(
        (mountainBounds.min.x + mountainBounds.max.x) / 2,
        mountainBounds.max.y + 25,
        (mountainBounds.min.z + mountainBounds.max.z) / 2
    );
}

// گوی درخشان
const lianGoldenOrb = new THREE.Mesh(
    new THREE.SphereGeometry(24, 16, 16),
    new THREE.MeshBasicMaterial({
        color: 0xffd45c
    })
);

lianGoldenOrb.visible = false;
scene.add(lianGoldenOrb);

// هالهٔ نور
const lianGoldenGlow = new THREE.Mesh(
    new THREE.SphereGeometry(55, 16, 16),
    new THREE.MeshBasicMaterial({
        color: 0xffbd45,
        transparent: true,
        opacity: 0.28,
        depthWrite: false
    })
);

lianGoldenGlow.visible = false;
scene.add(lianGoldenGlow);

// نور واقعی طلایی
const lianGoldenPointLight = new THREE.PointLight(
    0xffc247,
    0,
    900,
    2
);

scene.add(lianGoldenPointLight);

// پرتو متحرک از خانه به کوه
const lianGoldenBeam = new THREE.Mesh(
    new THREE.CylinderGeometry(5, 12, 1, 10),
    new THREE.MeshBasicMaterial({
        color: 0xffd45c,
        transparent: true,
        opacity: 0.8,
        depthWrite: false
    })
);

lianGoldenBeam.visible = false;
scene.add(lianGoldenBeam);


const FILM_TIMELINE_DURATION = FILM_TIMELINE.reduce(
    (total, scene) => total + scene.duration,
    0
);

// آماده‌سازی زمان‌بندی وویس‌ها پیش از شروع فیلم
prepareFilmVoiceSchedule().catch((error) => {
    console.error(
        'آماده‌سازی زمان‌بندی وویس‌های فیلم ناموفق بود:',
        error
    );
});

// بررسی مجموع مدت صحنه‌ها؛ بدون تغییر خودکار زمان‌ها
if (
    Math.abs(
        FILM_TIMELINE_DURATION -
        FILM_TIMELINE_CONFIG.targetDuration
    ) > FILM_TIMELINE_CONFIG.tolerance
) {
    console.warn(
        `مدت صحنه‌ها ${FILM_TIMELINE_DURATION} ثانیه است؛ ` +
        `مدت هدف فیلم ${FILM_TIMELINE_CONFIG.targetDuration} ثانیه است.`
    );
} else {
    console.info(
        `زمان‌بندی فیلم تأیید شد: ${FILM_TIMELINE_DURATION} ثانیه`
    );
}



/* ============================================================
   آتش‌بازی پایان افسانهٔ لیان
   ============================================================ */

const endingFireworks = [];
const endingFireworkCount = 3;
const endingParticlesPerBurst = 100;

for (let burstIndex = 0; burstIndex < endingFireworkCount; burstIndex++) {
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(
        endingParticlesPerBurst * 3
    );

    const colors = new Float32Array(
        endingParticlesPerBurst * 3
    );

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3)
    );

    const material = new THREE.PointsMaterial({
        size: 22,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    particles.visible = false;
    scene.add(particles);

    endingFireworks.push({
        particles,
        positions,
        velocities: [],
        age: 0,
        active: false,
        triggered: false
    });
}

// ایجاد یک انفجار در موقعیت مشخص
function launchEndingFirework(index, origin) {
    const burst = endingFireworks[index];

    if (!burst) return;

    burst.age = 0;
    burst.active = true;
    burst.triggered = true;
    burst.particles.visible = true;

    burst.velocities = [];

    const color = new THREE.Color();

    for (let i = 0; i < endingParticlesPerBurst; i++) {
        const direction = new THREE.Vector3(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
        ).normalize();

        const speed = 180 + Math.random() * 300;

        burst.positions[i * 3] = origin.x;
        burst.positions[i * 3 + 1] = origin.y;
        burst.positions[i * 3 + 2] = origin.z;

        burst.velocities.push(
            direction.multiplyScalar(speed)
        );

        color.setHSL(
            (index / endingFireworkCount + Math.random() * 0.15) % 1,
            1,
            0.6
        );

        burst.particles.geometry.attributes.color.setXYZ(
            i,
            color.r,
            color.g,
            color.b
        );
    }

    burst.particles.geometry.attributes.position.needsUpdate = true;
    burst.particles.geometry.attributes.color.needsUpdate = true;
}

// به‌روزرسانی حرکت ذرات
function updateEndingFireworkParticles(deltaTime) {
    for (const burst of endingFireworks) {
        if (!burst.active) continue;

        burst.age += deltaTime;

        if (burst.age >= 3) {
            burst.active = false;
            burst.particles.visible = false;
            continue;
        }

        for (let i = 0; i < endingParticlesPerBurst; i++) {
            const p = i * 3;
            const velocity = burst.velocities[i];

            velocity.y -= 180 * deltaTime;

            burst.positions[p] += velocity.x * deltaTime;
            burst.positions[p + 1] += velocity.y * deltaTime;
            burst.positions[p + 2] += velocity.z * deltaTime;
        }

        burst.particles.geometry.attributes.position.needsUpdate = true;
        burst.particles.material.opacity = Math.max(
            0,
            1 - burst.age / 3
        );
    }
}

// ایجاد محل انفجار در میدان دید دوربین
function getEndingFireworkOrigin(
    horizontalOffset,
    verticalOffset,
    depthOffset = 1400
) {
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);

    const right = new THREE.Vector3(1, 0, 0)
        .applyQuaternion(camera.quaternion);

    const up = new THREE.Vector3(0, 1, 0)
        .applyQuaternion(camera.quaternion);

    return camera.position.clone()
        .add(forward.multiplyScalar(depthOffset))
        .add(right.multiplyScalar(horizontalOffset))
        .add(up.multiplyScalar(verticalOffset));
}


// کنترل حرکت چمروش و آنیل در فلش‌بک
function updateCinematicCharacters(time) {
    const flashbackScene = FILM_TIMELINE.find(
        (scene) => scene.id === "chamrosh_flashback"
    );

    const chamrosh = loadedCharacters.get("chamrosh");
    const anil = loadedCharacters.get("anil");

    if (!flashbackScene || !chamrosh || !anil) return;

    const birthScene = FILM_TIMELINE.find(
        (scene) => scene.id === "birth"
    );

    const norsa = loadedCharacters.get("norsa");

    if (birthScene && norsa) {
        const progress = THREE.MathUtils.clamp(
        (time - birthScene.start) / birthScene.duration,
        0,
        1
    );

        // نورسا هم‌زمان با رسیدن دوربین به نمای نزدیک ظاهر می‌شود.
        if (progress >= 0.3) {
            norsa.position.set(130, 1730, 2472);
        } else {
            norsa.position.set(-50000, 10, 50000);
        }
    }

    // در صحنهٔ بازگشت، کنترل شخصیت‌ها به تابع مستقل سپرده می‌شود.
    const returnScene = FILM_TIMELINE.find(
        (scene) => scene.id === "return"
    );

    if (returnScene && time >= returnScene.start) {
        return;
    }

    const hiddenPosition = new THREE.Vector3(-50000, 10, 50000);

    if (time < flashbackScene.start) {
        chamrosh.position.copy(hiddenPosition);
        anil.position.copy(hiddenPosition);
        return;
    }

    const t = THREE.MathUtils.clamp(
        (time - flashbackScene.start) / flashbackScene.duration,
        0,
        1
    );

    const smooth = (value) => {
        value = THREE.MathUtils.clamp(value, 0, 1);
        return value * value * (3 - 2 * value);
    };

    const segment = (value, start, end) =>
        smooth((value - start) / (end - start));

    const timing = FLASHBACK_TIMING;

    // مسیر مورب چمروش از فاصله دور به محل فرود
    const chamroshSky = new THREE.Vector3(-4800, 3400, 500);
    const chamroshApproach = new THREE.Vector3(-2100, 2700, 1300);
    const chamroshLanding = new THREE.Vector3(-500, 1700, 2500);

    if (t < timing.chamroshApproachEnd) {
        const p = segment(
            t,
            timing.chamroshApproachStart,
            timing.chamroshApproachEnd
        );

        chamrosh.position.copy(
            chamroshSky.clone().lerp(chamroshApproach, p)
        );
    } else if (t < timing.chamroshLandingEnd) {
        const p = segment(
            t,
            timing.chamroshApproachEnd,
            timing.chamroshLandingEnd
        );

        chamrosh.position.copy(
            chamroshApproach.clone().lerp(chamroshLanding, p)
        );
    } else {
        chamrosh.position.copy(chamroshLanding);
    }

    // آنیل در طول پرواز پشت چمروش قرار می‌گیرد.
    const ridingOffset = new THREE.Vector3(0, 80, -50);

    const landingAnil = chamroshLanding.clone().add(ridingOffset);

    // مسیر حرکت آنیل از بیرون در به داخل خانه
    const doorOutside = new THREE.Vector3(0, 1700, 2540);
    const doorInside = new THREE.Vector3(0, 1700, 2460);
    const anilDestination = new THREE.Vector3(130, 1715, 2530);

    const walkProgress = segment(
        t,
        timing.anilWalkStart,
        timing.anilArrive
    );

    const doorEntryTime = 0.78;

    if (t < timing.anilWalkStart) {
        // هنگام پرواز، آنیل همراه چمروش حرکت می‌کند.
        anil.position.copy(chamrosh.position).add(ridingOffset);
    } else if (t < doorEntryTime) {
        // حرکت از محل فرود به بیرون در
        const p = segment(
            t,
            timing.anilWalkStart,
            doorEntryTime
        );

        anil.position.copy(
            landingAnil.clone().lerp(doorOutside, p)
        );
    } else {
        // عبور از آستانه و حرکت به نقطه نهایی داخل خانه
        const p = segment(
            t,
            doorEntryTime,
            timing.anilArrive
        );

        anil.position.copy(
            doorInside.clone().lerp(anilDestination, p)
        );
    }

    // جهت آنیل هنگام پرواز
    const flightDirection = new THREE.Vector3(
        chamroshApproach.x - chamroshSky.x,
        0,
        chamroshApproach.z - chamroshSky.z
    ).normalize();

    const flightRotation = Math.atan2(
        flightDirection.x,
        flightDirection.z
    );

    if (t < timing.anilWalkStart) {
        anil.rotation.y = flightRotation;
    }


        // چرخش ثابت آنیل حول محور عمودی
        const ANIL_FINAL_ROTATION = Math.PI / 1;

        if (t >= timing.anilArrive) {
            anil.rotation.y = ANIL_FINAL_ROTATION;
        }
    }


/**
 * کنترل شخصیت‌ها در صحنهٔ بازگشت آنیل
 * مستقل از منطق فلش‌بک
 */
function updateReturnSceneCharacters(time) {
    const returnScene = FILM_TIMELINE.find(
        (scene) => scene.id === "return"
    );

    if (!returnScene) return;

    const chamrosh = loadedCharacters.get("chamrosh");
    const anil = loadedCharacters.get("anil");
    const norsa = loadedCharacters.get("norsa");

    if (!chamrosh || !anil || !norsa) return;

    const hiddenPosition = new THREE.Vector3(
        -50000, 10, 50000
    );

    const elapsed = time - returnScene.start;

    // پیش از شروع صحنه، شخصیت‌ها را تغییر نده.
    if (elapsed < 0) return;

    // مختصات فعلی شخصیت‌ها در بالای کوه
    const mountainPosition = new THREE.Vector3(
        130, 1715, 2530
    );

    const norsaPosition = new THREE.Vector3(
        130, 1730, 2472
    );

    // مقصد موقت چمروش در محل سوارشدن
    const chamroshPosition = new THREE.Vector3(
        -500, 1700, 2500
    );


    // چمروش در محل سوارشدن منتظر می‌ماند.
    chamrosh.position.copy(chamroshPosition);

    // تا پیش از باز شدن در، شخصیت‌ها در موقعیت اولیه می‌مانند.
    if (elapsed < 8) {
        anil.position.copy(mountainPosition);
        norsa.position.copy(norsaPosition);
        return;
    }

    // آنیل نورسا را در آغوش دارد و از در خارج می‌شود.
    if (elapsed < 15) {
        const progress = THREE.MathUtils.clamp(
            (elapsed - 8) / 7,
            0,
            1
        );

        const smooth = progress * progress * (3 - 2 * progress);

        const anilStart = new THREE.Vector3(130, 1715, 2530);
        const anilOutside = new THREE.Vector3(-500, 1700, 2500);

        const norsaStart = new THREE.Vector3(130, 1730, 2472);
        const norsaOutside = new THREE.Vector3(-500, 1700, 2442);

        anil.position.copy(
            anilStart.clone().lerp(anilOutside, smooth)
        );

        norsa.position.copy(
            norsaStart.clone().lerp(norsaOutside, smooth)
        );

        return;
    }

    // مرحلهٔ دوم: سوار شدن آنیل و نورسا روی چمروش
    if (elapsed < 30) {
        chamrosh.position.copy(chamroshPosition);

        const progress = THREE.MathUtils.clamp(
            (elapsed - 20) / 10,
            0,
            1
        );

        const smooth = progress * progress * (3 - 2 * progress);

        const anilStart = new THREE.Vector3(0, 1700, 2540);
        const norsaStart = new THREE.Vector3(0, 1715, 2482);

        const anilRiding = new THREE.Vector3(
            chamrosh.position.x,
            chamrosh.position.y + 80,
            chamrosh.position.z - 50
        );

        const norsaRiding = new THREE.Vector3(
            chamrosh.position.x,
            chamrosh.position.y + 115,
            chamrosh.position.z - 45
        );

        anil.position.copy(anilStart.clone().lerp(anilRiding, smooth));
        norsa.position.copy(norsaStart.clone().lerp(norsaRiding, smooth));

        return;
    }

    // مرحلهٔ سوم: پرواز و فرود چمروش
    const flightStart = new THREE.Vector3(-500, 1700, 2500);
    const flightApex = new THREE.Vector3(-200, 2300, 4500);
    const flightEnd = new THREE.Vector3(100, 10, 6800);

    const passengersLanding = new THREE.Vector3(40, 10, 6500);

    // پرواز از ثانیهٔ 30 تا 65
    const flightProgress = THREE.MathUtils.clamp(
        (elapsed - 30) / 33,
        0,
        1
    );

    const flightSmooth =
        flightProgress * flightProgress * (3 - 2 * flightProgress);

    // حرکت در دو بخش: اوج گرفتن و سپس فرود آمدن
    if (flightSmooth < 0.5) {
        const p = flightSmooth * 2;

        chamrosh.position.copy(
            flightStart.clone().lerp(flightApex, p)
        );
    } else {
        const p = (flightSmooth - 0.5) * 2;

        chamrosh.position.copy(
            flightApex.clone().lerp(flightEnd, p)
        );
    }

    // آنیل و نورسا در طول پرواز همراه چمروش هستند
    anil.position.set(
        chamrosh.position.x,
        chamrosh.position.y + 80,
        chamrosh.position.z - 50
    );

    norsa.position.set(
        chamrosh.position.x,
        chamrosh.position.y + 115,
        chamrosh.position.z - 45
    );

    // پس از پایان پرواز، موقعیت نهایی ثابت می‌شود
    if (flightProgress >= 1) {
        chamrosh.position.copy(flightEnd);

        anil.position.copy(passengersLanding);

        norsa.position.set(
            passengersLanding.x + 25,
            passengersLanding.y + 20,
            passengersLanding.z + 15
        );
    }

    // زمان‌بندی سکانس پس از فرود
    const landingTime = 54;
    const separationStart = 80;
    const separationEnd = 90;

    const anilLanding = new THREE.Vector3(60, 10, 6500);
    const norsaLanding = new THREE.Vector3(60, 60, 6495);

    // پس از فرود چمروش
    if (elapsed >= landingTime) {
        chamrosh.position.copy(flightEnd);
        anil.position.copy(anilLanding);

        // نورسا تا شروع جدایی در موقعیت جداگانه قرار می‌گیرد
        norsa.position.copy(norsaLanding);
    }

    // ========================================================
    // دیدار سورنا با آنیل و نورسا
    // ========================================================

    const sorena = loadedCharacters.get("sorena");

    if (sorena) {
        // موقعیت نهایی آنیل
        const anilPosition = new THREE.Vector3(
            40, 10, 6500
        );

        // موقعیت سورنا مقابل آنیل
        const sorenaStart = sorena.position.clone();
        const sorenaTarget = new THREE.Vector3(
            50, 10, 6450
        );

        // زمان‌بندی حرکت
        const sorenaMoveStart = 54;
        const sorenaMoveEnd = 56;
        const hugStart = 57;
        const hugEnd = 58;

        const smoothProgress = (value) => {
            const p = THREE.MathUtils.clamp(value, 0, 1);
            return p * p * (3 - 2 * p);
        };

        // حرکت سورنا به مقابل آنیل
        if (elapsed >= sorenaMoveStart) {
            const progress = smoothProgress(
                (elapsed - sorenaMoveStart) /
                (sorenaMoveEnd - sorenaMoveStart)
            );

            sorena.position.copy(
                sorenaStart.clone().lerp(sorenaTarget, progress)
            );
        }

        // تثبیت جایگاه آنیل
        if (elapsed >= sorenaMoveEnd) {
            anil.position.copy(anilPosition);
        }

        // حرکت نورسا به کنار سورنا و چرخش روی محور X
        if (elapsed >= hugStart) {
            const norsa = loadedCharacters.get("norsa");

            if (norsa && sorena) {
                // ذخیره موقعیت و چرخش اولیه فقط یک بار
                if (norsa.userData.hugStartPosition === undefined) {
                    norsa.userData.hugStartPosition =
                        norsa.position.clone();

                    norsa.userData.hugStartRotationX =
                        norsa.rotation.x;
                }

                const hugProgress = smoothProgress(
                    (elapsed - hugStart) / (hugEnd - hugStart)
                );

                // مقصد: کنار سورنا، با فاصله کم روی محور X
                const hugTarget = sorena.position.clone().add(
                    new THREE.Vector3(0, 20, 5)
                );

                // حرکت نرم نورسا به کنار سورنا
                norsa.position.copy(
                    norsa.userData.hugStartPosition.clone().lerp(
                        hugTarget,
                        hugProgress
                    )
                );

                // چرخش ۹۰ درجه روی محور X
                norsa.rotation.x = THREE.MathUtils.lerp(
                    norsa.userData.hugStartRotationX,
                    norsa.userData.hugStartRotationX + Math.PI / 2,
                    hugProgress
                );
            }
        }
    }
}


// کنترل دوربین با زمان شروع و پایان محاسبه‌شدهٔ هر صحنه
function updateCinematicCamera(time) {
    if (!FILM_TIMELINE.length) {
        return;
    }

    const firstScene = FILM_TIMELINE[0];
    const lastScene = FILM_TIMELINE[FILM_TIMELINE.length - 1];

    const currentTime = THREE.MathUtils.clamp(
        time,
        0,
        FILM_TIMELINE_DURATION
    );

    // پیدا کردن صحنهٔ فعال
    const sceneIndex = FILM_TIMELINE.findIndex(
        (scene) =>
            currentTime >= scene.start &&
            currentTime < scene.end
    );

    const activeIndex = currentTime >= lastScene.end
        ? FILM_TIMELINE.length - 1
        : Math.max(0, sceneIndex);

    const activeScene = FILM_TIMELINE[activeIndex];
    // باز شدن در هنگام نزدیک شدن دوربین به خانه

    // کنترل در در فلش‌بک و صحنهٔ بازگشت آنیل
    const flashbackScene = FILM_TIMELINE.find(
        (scene) => scene.id === "chamrosh_flashback"
    );

    const returnScene = FILM_TIMELINE.find(
        (scene) => scene.id === "return"
    );

    let shouldOpenDoor = false;

    // زمان‌بندی قبلی فلش‌بک بدون تغییر
    if (flashbackScene) {
        const doorOpenTime =
            flashbackScene.start +
            flashbackScene.duration * FLASHBACK_TIMING.doorOpen;

        const doorCloseTime =
            flashbackScene.start +
            flashbackScene.duration * FLASHBACK_TIMING.doorClose;

        if (
            currentTime >= doorOpenTime &&
            currentTime < doorCloseTime
        ) {
            shouldOpenDoor = true;
        }
    }

    // باز شدن در در صحنهٔ return
    if (returnScene) {
        const elapsed = currentTime - returnScene.start;

        // در ثانیهٔ ۸ باز می‌شود و تا ثانیهٔ ۲۲ باز می‌ماند.
        if (elapsed >= 15 && elapsed < 32) {
            shouldOpenDoor = true;
        }
    }

    toggleLowerDoor(shouldOpenDoor);

    // اجرای مسیر چندنقطه‌ای دوربین در صحنهٔ اول
    if (activeScene.cameraPath) {
        const elapsed = currentTime - activeScene.start;
        const progress = THREE.MathUtils.clamp(
            elapsed / activeScene.duration, 0, 1
        );

        const path = activeScene.cameraPath;

        // پیدا کردن قطعهٔ فعلی مسیر
        let index = path.findIndex(point => point.at >= progress);

        if (index < 0) index = path.length - 1;

        const segmentIndex = Math.max(0, index - 1);
        const from = path[segmentIndex];
        const to = path[index];

        const segment = to.at - from.at;
        const t = segment > 0
            ? THREE.MathUtils.clamp(
                (progress - from.at) / segment,
                0,
                1
            )
            : 1;

        // نقاط مجاور برای ساخت منحنی پیوسته
        const p0 = path[Math.max(0, segmentIndex - 1)];
        const p1 = from;
        const p2 = to;
        const p3 = path[Math.min(path.length - 1, index + 1)];

        const catmullRom = (a, b, c, d, u) =>
            0.5 * (
                2 * b +
                (-a + c) * u +
                (2 * a - 5 * b + 4 * c - d) * u * u +
                (-a + 3 * b - 3 * c + d) * u * u * u
            );

        // حرکت پیوسته در مختصات دوربین
        camera.position.set(
            catmullRom(p0.x, p1.x, p2.x, p3.x, t),
            catmullRom(p0.y, p1.y, p2.y, p3.y, t),
            catmullRom(p0.z, p1.z, p2.z, p3.z, t)
        );

        // زاویه‌ها و میدان دید فعلاً خطی باقی می‌مانند
        const yaw = THREE.MathUtils.lerp(from.yaw, to.yaw, t);
        const pitch = THREE.MathUtils.lerp(from.pitch, to.pitch, t);
        const fov = THREE.MathUtils.lerp(from.fov, to.fov, t);

        camera.rotation.order = 'YXZ';
        camera.rotation.set(
            THREE.MathUtils.degToRad(pitch),
            THREE.MathUtils.degToRad(yaw),
            0,
            'YXZ'
        );

        if (Math.abs(camera.fov - fov) > 0.001) {
            camera.fov = fov;
            camera.updateProjectionMatrix();
        }

        return;
    }

    // در انتهای فیلم یا وقتی صحنهٔ بعدی وجود ندارد،
    // دوربین روی قاب آخر ثابت می‌ماند.
    if (!nextScene || currentTime >= activeScene.end) {
        applyCameraPose(activeCamera);

        return;
    }

    const elapsedInScene = currentTime - activeScene.start;
    const transitionDuration = Math.max(
        0,
        activeScene.transition
    );

    // اگر هنوز در بازهٔ مکث هستیم، قاب فعلی ثابت می‌ماند.
    const holdDuration = Math.max(
        0,
        activeScene.duration - transitionDuration
    );

    if (elapsedInScene < holdDuration || transitionDuration === 0) {
        applyCameraPose(activeCamera);

        return;
    }

    // حرکت نرم به سمت قاب صحنهٔ بعدی
    const rawProgress = THREE.MathUtils.clamp(
        (elapsedInScene - holdDuration) / transitionDuration,
        0,
        1
    );

    const progress =
        rawProgress * rawProgress * (3 - 2 * rawProgress);

    const nextCamera = nextScene.camera;

    camera.position.set(
        THREE.MathUtils.lerp(
            activeCamera.x,
            nextCamera.x,
            progress
        ),
        THREE.MathUtils.lerp(
            activeCamera.y,
            nextCamera.y,
            progress
        ),
        THREE.MathUtils.lerp(
            activeCamera.z,
            nextCamera.z,
            progress
        )
    );

    camera.lookAt(
        THREE.MathUtils.lerp(
            activeCamera.targetX,
            nextCamera.targetX,
            progress
        ),
        THREE.MathUtils.lerp(
            activeCamera.targetY,
            nextCamera.targetY,
            progress
        ),
        THREE.MathUtils.lerp(
            activeCamera.targetZ,
            nextCamera.targetZ,
            progress
        )
    );
}

// ============================================================
// 20) انیمیشن
// ============================================================


/**
 * حلقه اصلی انیمیشن صحنه
 */

const clock = new THREE.Clock();

// ========================================================
// کنترل شروع داستان «افسانهٔ لیان»
// ========================================================

// تا پیش از پایان معرفی و فشردن Enter، فیلم شروع نمی‌شود.
let storyStarted = false;

// زمان شروع واقعی فیلم؛ مستقل از ساعت عمومی رندر.
let storyStartTimestamp = null;

// زمان سپری‌شده از شروع فیلم.
let storyElapsedTime = 0;

// کنترل پخش معرفی را در مرحلهٔ بعد به این وضعیت متصل می‌کنیم.
let introStarted = false;
let introCompleted = false;

// ========================================================
// بارگذاری ماهی و دلفین
// ========================================================

const aquaticLoader = new GLTFLoader();
aquaticLoader.setMeshoptDecoder(MeshoptDecoder);


const aquaticCreatures = {
    fish: [],
    dolphin: []
};

function loadAquaticCreature({
    path,
    targetLength,
    type,
    index
}) {
    aquaticLoader.load(
        path,
        (gltf) => {
            const creature = gltf.scene;

            const bounds = new THREE.Box3()
                .setFromObject(creature);

            const size = bounds.getSize(
                new THREE.Vector3()
            );

            const longestDimension = Math.max(
                size.x,
                size.y,
                size.z
            );

            if (longestDimension > 0) {
                creature.scale.multiplyScalar(
                    targetLength / longestDimension
                );
            }

            creature.traverse((object) => {
                if (object.isMesh) {
                    object.castShadow = true;
                    object.receiveShadow = true;
                }
            });

            creature.visible = false;
            scene.add(creature);

            aquaticCreatures[type][index] = creature;

            console.info(`مدل آبزی بارگذاری شد: ${path}`);
        },
        undefined,
        (error) => {
            console.error(
                `خطا در بارگذاری مدل آبزی: ${path}`,
                error
            );
        }
    );
}

[
    { path: './models/Fish1.glb', targetLength: 65 },
    { path: './models/Fish2.glb', targetLength: 65 },
    { path: './models/Fish3.glb', targetLength: 65 },
    { path: './models/Fish4.glb', targetLength: 65 }
].forEach((model, index) => {
    loadAquaticCreature({
        ...model,
        type: 'fish',
        index
    });
});

[
    { path: './models/dolphin1.glb', targetLength: 100 },
    { path: './models/dolphin2.glb', targetLength: 100 }
].forEach((model, index) => {
    loadAquaticCreature({
        ...model,
        type: 'dolphin',
        index
    });
});


// ========================================================
// زمان‌بندی مستقل نمایش ماهی و دلفین
// ========================================================


let aquaticTimelineElapsedSeconds = 0;
let aquaticTimelineRunning = true;
let aquaticTimelineCompleted = false;

// ========================================================
// کنترل دستی زمان سبز شدن طبیعت
// ========================================================

// مدت سبز شدن: 120 ثانیه (2 دقیقه)
let GREENING_DURATION_SECONDS = 55;

// زمان سپری‌شده از لحظهٔ شروع سبز شدن
let greeningElapsedSeconds = 0;

// وضعیت کنترل
let greeningRunning = false;
let greeningProgress = 0;

// فاصلهٔ تغییر مدت زمان با کلیدهای + و -
const GREENING_DURATION_STEP = 15;
const GREENING_DURATION_MIN = 15;
const GREENING_DURATION_MAX = 600;

setWorldGreening(0);

let renderMeasureFrames = 0;
let renderMeasureStart = performance.now();
function animate() {
    const frameStart = performance.now();

    requestAnimationFrame(animate);

    // ساعت عمومی برای رندر و محاسبهٔ فاصلهٔ فریم‌ها
    const deltaTime = clock.getDelta();

    // زمان داستان فقط پس از شروع رسمی فیلم جلو می‌رود.
    if (storyStarted && storyStartTimestamp !== null) {
        storyElapsedTime =
            (performance.now() - storyStartTimestamp) / 1000;
    } else {
        storyElapsedTime = 0;
    }

    const elapsedTime = storyElapsedTime;

    // شروع تغییر طبیعت پس از پایان صحنهٔ نخستین لیان
    const firstLianTimelineScene = FILM_TIMELINE.find(
        (scene) => scene.id === 'first_lian'
    );

    const endingTimelineScene = FILM_TIMELINE.find(
        (scene) => scene.id === 'ending_return_reveal'
    );

    const natureChangeStartSeconds = firstLianTimelineScene?.end;
    const natureChangeEndSeconds = endingTimelineScene?.end;

    const natureChangeStarted =
        Number.isFinite(natureChangeStartSeconds) &&
        Number.isFinite(natureChangeEndSeconds) &&
        natureChangeEndSeconds > natureChangeStartSeconds &&
        elapsedTime >= natureChangeStartSeconds;

    const natureChangeProgress = natureChangeStarted
        ? THREE.MathUtils.clamp(
            (elapsedTime - natureChangeStartSeconds) /
                (natureChangeEndSeconds - natureChangeStartSeconds),
            0,
            1
        )
        : 0;

    // اعمال تغییر رنگ طبیعت در هر فریم
    setWorldGreening(natureChangeProgress);

    // اجرای خودکار وویس متناسب با زمان پرده
    updateFilmVoicePlayback(storyElapsedTime);


    // تنظیم تدریجی بلندی موسیقی برای واضح ماندن صدای راوی
    const narratorIsSpeaking =
    (
        typeof filmVoiceAudio !== "undefined" &&
        filmVoiceAudio !== null &&
        !filmVoiceAudio.paused &&
        !filmVoiceAudio.ended
    ) ||
    (
        typeof storyAudio !== "undefined" &&
        storyAudio !== null &&
        !storyAudio.paused &&
        !storyAudio.ended
    );


    // آماده بودن آبزیان برای نمایش و حرکت
const allAquaticCreatures = [
    ...aquaticCreatures.fish,
    ...aquaticCreatures.dolphin
];

const aquaticReady =
    aquaticCreatures.fish.length === 4 &&
    aquaticCreatures.dolphin.length === 2 &&
    allAquaticCreatures.every(
        (creature) => creature != null
    );

// آبزیان از پایان صحنهٔ نخستین لیان فعال می‌شوند.
const aquaticStartTime = natureChangeStartSeconds;

const shouldShowAquatic =
    storyStarted &&
    aquaticReady &&
    Number.isFinite(aquaticStartTime) &&
    elapsedTime >= aquaticStartTime;

const aquaticElapsedTime = shouldShowAquatic
    ? elapsedTime - aquaticStartTime
    : 0;

for (const creature of allAquaticCreatures) {
    if (creature) {
        creature.visible = shouldShowAquatic;
    }
}

if (shouldShowAquatic) {
    const waterLevel = 3;

    // حرکت چهار ماهی در مسیر رودخانه
    aquaticCreatures.fish.forEach((fish, index) => {
        const offset = index / 4;
        const t = (
            aquaticElapsedTime * 0.012 + offset
        ) % 1;

        const point = riverCurve.getPointAt(t);
        const tangent = riverCurve.getTangentAt(t);

        fish.position.x = point.x;
        fish.position.z = point.z;

        const jumpCycle = (
            aquaticElapsedTime / 3.2 + index * 0.25
        ) % 1;

        const jumpProgress = Math.sin(
            jumpCycle * Math.PI * 2
        );

        fish.position.y =
            waterLevel + 95 * jumpProgress;

        fish.rotation.y = Math.atan2(
            tangent.x,
            tangent.z
        );

        fish.rotation.x = jumpProgress > 0
            ? -0.35 * Math.cos(
                jumpCycle * Math.PI * 2
            )
            : 0;
    });

    // حرکت دو دلفین در مسیر رودخانه
    aquaticCreatures.dolphin.forEach(
        (dolphin, index) => {
            const offset = 0.12 + index * 0.5;
            const t = (
                aquaticElapsedTime * 0.009 + offset
            ) % 1;

            const point = riverCurve.getPointAt(t);
            const tangent = riverCurve.getTangentAt(t);

            const diveCycle = (
                aquaticElapsedTime / 4 + index * 0.5
            ) % 1;

            const diveProgress = Math.sin(
                diveCycle * Math.PI * 2
            );

            dolphin.position.set(
                point.x,
                waterLevel + 10 + 55 * diveProgress,
                point.z
            );

            dolphin.rotation.y = Math.atan2(
                tangent.x,
                tangent.z
            );

            dolphin.rotation.x = diveProgress > 0
                ? -0.2 * Math.cos(
                    diveCycle * Math.PI * 2
                )
                : 0;
        }
    );
}
    // موقعیت فعلی دوربین
    updateCinematicCamera(elapsedTime);


    // حرکت نور طلایی افسانهٔ لیان
    const firstLianScene = FILM_TIMELINE.find(
        (scene) => scene.id === "first_lian"
    );

    if (firstLianScene) {
        const localTime = elapsedTime - firstLianScene.start;

        // نور از ثانیهٔ ۵ حرکت می‌کند و در ثانیهٔ ۲۵ به قله می‌رسد.
        const progress = THREE.MathUtils.clamp(
            (localTime - 5) / 20,
            0,
            1
        );

        const smooth = progress * progress * (3 - 2 * progress);

        const currentPosition = lianLightStart.clone().lerp(
            lianLightTarget,
            smooth
        );

        const isActive =
            localTime >= 5 &&
            localTime <= 32;

        lianGoldenOrb.visible = isActive;
        lianGoldenGlow.visible = isActive;
        lianGoldenBeam.visible = isActive;

        if (isActive) {
            lianGoldenOrb.position.copy(currentPosition);
            lianGoldenGlow.position.copy(currentPosition);
            lianGoldenPointLight.position.copy(currentPosition);

            // درخشش بیشتر هنگام رسیدن به قله
            const arrivalGlow = THREE.MathUtils.clamp(
                (progress - 0.8) / 0.2,
                0,
                1
            );

            lianGoldenPointLight.intensity =
                2 + arrivalGlow * 5;

            lianGoldenGlow.scale.setScalar(
                1 + arrivalGlow * 0.8
            );

            // تنظیم طول و جهت پرتو بین خانه و نور
            const direction = currentPosition.clone().sub(
                lianLightStart
            );

            const distance = direction.length();

            lianGoldenBeam.position.copy(
                lianLightStart.clone().add(
                    currentPosition
                ).multiplyScalar(0.5)
            );

            lianGoldenBeam.scale.set(
                1,
                distance,
                1
            );

            lianGoldenBeam.quaternion.setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                direction.normalize()
            );
        } else {
            lianGoldenPointLight.intensity = 0;
        }
    }


    // آتش‌بازی در نمای پایانی افسانهٔ لیان
    const endingFireworkScene = FILM_TIMELINE.find(
        (scene) => scene.id === "ending_return_reveal"
    );

    updateEndingFireworkParticles(deltaTime);

    if (endingFireworkScene) {
        const endingLocalTime =
            elapsedTime - endingFireworkScene.start;

        const fireworkTimes = [
            endingFireworkScene.duration * 0.65,
            endingFireworkScene.duration * 0.78,
            endingFireworkScene.duration * 0.90
        ];

        const positions = [
            [2000, 500, 1400],
            [1900, 550, 1600],
            [1800, 600, 1200]
];

        for (let i = 0; i < endingFireworkCount; i++) {
            if (endingLocalTime < 0) {
                endingFireworks[i].triggered = false;
            }

            if (
                endingLocalTime >= fireworkTimes[i] &&
                !endingFireworks[i].triggered
            ) {
                const origin = getEndingFireworkOrigin(
                    positions[i][0],
                    positions[i][1],
                    positions[i][2]
                );

                launchEndingFirework(i, origin);
            }
        }
    }

    // شدت نور متناسب با پیشرفت صحنه تولد
    const birthScene = FILM_TIMELINE.find(
        (scene) => scene.id === "birth"
    );

    if (birthScene) {
        const progress = THREE.MathUtils.clamp(
            (elapsedTime - birthScene.start) / birthScene.duration,
            0,
            1
        );

        const lightProgress = THREE.MathUtils.clamp(
            (progress - 0.35) / 0.35,
            0,
            1
        );

        const smooth = lightProgress * lightProgress *
            (3 - 2 * lightProgress);

        norsaBirthLight.intensity = smooth * 2.2;
    } else {
        norsaBirthLight.intensity = 0;
    }

    // حرکت شخصیت‌های پردهٔ چهارم
    updateCinematicCharacters(elapsedTime);

    // حرکت شخصیت‌های صحنهٔ بازگشت
    updateReturnSceneCharacters(elapsedTime);

    // بررسی اینکه داخل خانه باید دیده شود یا نه
    updateHouseInteriorView();

    // حرکت آرام بافت آب از آغاز سبزشدن طبیعت
    if (storyStarted && natureChangeStarted) {
        riverTexture.offset.x -= 0.0025 * deltaTime * 60;
    }

    // به‌روزرسانی حرکت مردم روستا، در صورت وجود سیستم آن‌ها
    if (
        typeof villagePeople !== 'undefined' &&
        typeof villagePeople.updateVillagers === 'function'
    ) {
        villagePeople.updateVillagers(elapsedTime);
    }


    const LIGHT_RETURN_DURATION_SECONDS = 50;

    const lightReturnStart = firstLianScene
        ? firstLianScene.end
        : LIGHT_RETURN_START_SECONDS;

    const lightReturnProgress = THREE.MathUtils.clamp(
        (elapsedTime - lightReturnStart) /
            LIGHT_RETURN_DURATION_SECONDS,
        0,
        1
    );

    ambientLight.intensity = THREE.MathUtils.lerp(
        AMBIENT_LIGHT_DRY,
        AMBIENT_LIGHT_FINAL,
        lightReturnProgress
    );

    sunLight.intensity = THREE.MathUtils.lerp(
        SUN_LIGHT_DRY,
        SUN_LIGHT_FINAL,
        lightReturnProgress
    );

    // بازگشت تدریجی رنگ آسمان و مه از تاریکی به روشنایی
    const skyProgress = lightReturnProgress *
        lightReturnProgress *
        (3 - 2 * lightReturnProgress);

    scene.background.copy(skyColorDark).lerp(
        skyColorDay,
        skyProgress
    );

    if (scene.fog) {
        scene.fog.color.copy(scene.background);
    }

// نمایش صحنه و اندازه‌گیری موقت عملکرد
const renderStart = performance.now();

renderer.render(scene, camera);
if (!window.__mountainStatsLogged) {
    window.__mountainStatsLogged = true;

    let meshCount = 0;
    let vertexCount = 0;

    scene.traverse((object) => {
        if (object.isMesh) {
            meshCount++;
            if (object.geometry?.attributes?.position) {
                vertexCount += object.geometry.attributes.position.count;
            }
        }
    });

    console.log('[Scene Stats]', {
        meshes: meshCount,
        vertices: vertexCount,
        drawCalls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        geometries: renderer.info.memory.geometries,
        textures: renderer.info.memory.textures
    });
}

const renderEnd = performance.now();
const frameEnd = performance.now();

const renderMs = renderEnd - renderStart;
const frameMs = frameEnd - frameStart;

renderMeasureFrames++;

if (renderEnd - renderMeasureStart >= 2000) {
    console.log(
        `[Performance] FPS: ${(
            renderMeasureFrames * 1000 /
            (renderEnd - renderMeasureStart)
        ).toFixed(1)} | Render: ${(
            renderMs
        ).toFixed(2)} ms`
    );

    renderMeasureFrames = 0;
    renderMeasureStart = renderEnd;
}

if (frameMs > 50) {
    console.warn(
        `[Slow Frame] ${frameMs.toFixed(1)} ms | ` +
        `Render: ${renderMs.toFixed(1)} ms`
    );
}
// پایان تابع animate()
}

// ============================================================
// 21) واکنش به تغییر اندازه صفحه
// ============================================================

window.addEventListener(
    'resize',
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );
    }
);


// ============================================================
// 22) شروع صحنه
// ============================================================

animate();