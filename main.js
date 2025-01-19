import { GUI } from "dat.gui";
import * as THREE from "three";
import { MapControls } from "three/addons/controls/MapControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DEG2RAD, lerp } from "three/src/math/MathUtils";

class Section {
    constructor(container, title, desc, onBack, onNext, onClose, top, left) {
        this.onBack = onBack;
        this.onNext = onNext;
        this.container = container;
        this.sectionContainer = document.createElement('div');
        this.sectionContainer.classList.add('intro-element');
        this.sectionContainer.style.display = 'none';
        this.sectionContainer.innerHTML = `
        <div style="width: 100vw; height: 100vh; position: relative;" class="section-container">
        <div style="position: absolute; top: ${top}; left: ${left}" >
            <div class="section-header" >
            <button class="section-close-button" id="intro-close"><img src="icons/close.png" style="object-fit: cover; width: 2rem; height: 2rem;" ></img></button>
                <h2 class="section-title"><b>${title}</b></h2>
                <h3 class="section-desc">${desc}</h3>
            </div>
                <div style="display: flex; width: 100%; align-items: center; justify-content: center; gap: 3rem;" class="section-button-container">
                    <button id="intro-one-back" style="padding: 1rem 2rem;" >
                        <h4>geri</h4>
                    </button>
                    <button id="intro-two" style="padding: 1rem 2rem;" >
                        <h4>ileri</h4>
                    </button>
                </div>
            </div>
        </div>
`
        this.backButton = this.sectionContainer.querySelector('#intro-one-back');
        this.nextButton = this.sectionContainer.querySelector('#intro-two');
        this.closeButton = this.sectionContainer.querySelector('#intro-close');
        this.closeButton.addEventListener('click', () => onClose());
        this.backButton.addEventListener('click', this.onBack);
        this.nextButton.addEventListener('click', this.onNext);
        this.container.appendChild(this.sectionContainer);
    }
    hide() {
        this.sectionContainer.style.display = 'none';
        this.sectionContainer.style.userSelect = 'none';
        this.backButton.removeEventListener('click', this.onBack);
        this.nextButton.removeEventListener('click', this.onNext);
    }
    show() {
        this.sectionContainer.style.display = 'block';
        this.sectionContainer.style.userSelect = 'auto';
        this.backButton.addEventListener('click', this.onBack);
        this.nextButton.addEventListener('click', this.onNext);
    }
}

class Intro {
    constructor(goto, setFlashingLabel) {
        this.setFlashingLabel = setFlashingLabel;

        this.goto = goto;
        if (this.mobileCheck()) {
            this.sectionsData = [
                { title: "Genel Müdürlük", top: "70%", left: "5%", desc: "Firmamız hakkında genel bilgilere buradan ulaşabilirsiniz." },
                { title: "Ana Servis", top: "40%", left: "40%", desc: "Anlaşmalı servis listemize buradan ulaşabilirsiniz." },
                { title: "Ana Acentem", top: "40%", left: "40%", desc: "Size en yakın acentemize buradan ulaşabilirsiniz." },
                { title: "Ana Sağlık", top: "25%", left: "40%", desc: "Anlaşmalı Sağlık Kurumlarımıza buradan ulaşabilirsiniz." },
                { title: "İletişim", top: "70%", left: "15%", desc: "Her türlü öneri ve şikayetleriniz için buradan ulaşabilirsiniz." }
            ]
        } else {
            this.sectionsData = [
                { title: "Genel Müdürlük", top: "70%", left: "5%", desc: "Firmamız hakkında genel bilgilere buradan ulaşabilirsiniz." },
                { title: "Ana Servis", top: "40%", left: "80%", desc: "Anlaşmalı servis listemize buradan ulaşabilirsiniz." },
                { title: "Ana Acentem", top: "40%", left: "50%", desc: "Size en yakın acentemize buradan ulaşabilirsiniz." },
                { title: "Ana Sağlık", top: "25%", left: "60%", desc: "Anlaşmalı Sağlık Kurumlarımıza buradan ulaşabilirsiniz." },
                { title: "İletişim", top: "70%", left: "15%", desc: "Her türlü öneri ve şikayetleriniz için buradan ulaşabilirsiniz." }
            ];
        }


        this.container = document.getElementById('intro-container');
        this.welcomeScreen = document.getElementById('intro-welcome');
        this.tourTwo = document.getElementById('tour-two');
        this.sectionOne = document.getElementById('tour-one');

        this.startButton = document.getElementById('intro-welcome-start');
        this.startButton.onclick = () => this.stepOne();

        this.nextButton = document.getElementById('intro-two')
        this.nextButton.onclick = () => this.stepTwo();
        this.backButton = document.getElementById('intro-one-back')
        this.backButton.onclick = () => this.stepOneBack();

        this.endButton = document.getElementById('intro-end')
        this.endButton.onclick = () => this.end();
        this.tourTwoBack = document.getElementById('intro-two-back')
        this.tourTwoBack.onclick = () => this.stepTwoBack();

        this.closeButton = document.getElementById('intro-close');
        this.closeButton.onclick = () => { this.container.style.display = 'none'; this.setFlashingLabel(null) };

        this.index = 0;
        this.sections = this.sectionsData.map(section => new Section(this.container, section.title, section.desc, () => this.back(), () => this.next(), () => { this.container.style.display = "none"; this.setFlashingLabel(null) }, section.top, section.left));

    }
    mobileCheck() {
        let check = false;
        ((a) => { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }

    back() {
        if (this.index > 0) {
            this.sections[this.index].hide();
            this.index -= 1;
            this.setFlashingLabel(this.sectionsData[this.index].title);
            this.sections[this.index].show();
        } else {
            this.sections[this.index].hide();
            this.welcomeScreen.style.opacity = 1;
            this.welcomeScreen.style.display = 'block';
        }
    }

    next() {
        if (this.index >= this.sectionsData.length - 1) {
            this.setFlashingLabel(null);
            this.container.style.display = 'none';
        } else {
            this.sections[this.index].hide();
            this.index += 1;
            this.setFlashingLabel(this.sectionsData[this.index].title);
            this.sections[this.index].show();
        }
    }

    end() {
        this.tourTwo.style.display = 'none';
        this.sections[this.index].show();
        this.setFlashingLabel(this.sectionsData[this.index].title);
        this.goto(this.sectionsData[this.index].title);
    }

    stepOneBack() {
        // show the welcome screen
        this.welcomeScreen.style.display = 'block';
        this.welcomeScreen.style.opacity = 1;

        // hide the first section
        this.sectionOne.style.display = 'none';
        this.sectionOne.opacity = 0;
    }

    stepTwoBack() {
        // hide the second section
        this.tourTwo.style.display = 'none';
        this.tourTwo.style.opacity = 0;

        // show the first section
        this.sectionOne.style.display = 'block';
        this.sectionOne.style.opacity = 1;
    }

    stepTwo() {
        // hide the first section
        this.sectionOne.style.display = 'none';
        this.sectionOne.style.opacity = 0;

        // show the second section
        this.tourTwo.style.display = 'block';
        this.tourTwo.style.opacity = 1;
    }

    stepOne() {
        // hide the welcome screen
        this.setFlashingLabel("start");
        this.welcomeScreen.style.opacity = 0
        this.welcomeScreen.style.display = 'none'

        // show the first section
        this.sectionOne.style.display = 'block';
        this.sectionOne.style.opacity = 1;
    }
}

class Game {
    constructor() {
        this.camera = null;
        this.scene = null;
        this.model = null;
        this.renderer = null;
        this.isMoving = false;
        this.cameraTarget = new THREE.Vector3();
        this.controlsTarget = new THREE.Vector3();
        this.activeLabel = 0;
        this.cameraInitial = 20;
        this.initialDistance = null;
        this.controls = null;
        this.fogColor = 0xcccccc;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.labelDom = document.getElementById("label");

        this.loader = new GLTFLoader();
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
        this.loader.setDRACOLoader(this.dracoLoader);

        this.slow = 0.01;
        this.medium = 0.02;
        this.fast = 0.04;
        this.BRAKING_DISTANCE = 1.7;
        this.directionMappings = {
            south: { axis: "z", moveAmount: 1, rotation: Math.PI / 2 },
            north: { axis: "z", moveAmount: -1, rotation: -Math.PI / 2 },
            west: { axis: "x", moveAmount: 1, rotation: Math.PI },
            east: { axis: "x", moveAmount: -1, rotation: 0 },
        };
        this.intersections = {
            north: [-5.6, 4.5, 1, -1.4],
            south: [6, 2.5, -2.9, -0.8],
        };
        this.carsData = [
            { file_path: "cars/ambulance", x: 0, z: 3.55, dir: "west", speed: this.medium, name: "1" },
            { file_path: "cars/tow_1", x: 3, z: 3.55, dir: "west", speed: this.medium, name: "2" },
            { file_path: "cars/tow_2", x: -4, z: 3.55, dir: "west", speed: this.medium, name: "3" },
            { file_path: "cars/ambulance", x: 5, z: 3.15, dir: "east", speed: this.fast, name: "4" },
            { file_path: "cars/car_1", x: 2, z: 3.15, dir: "east", speed: this.fast, name: "5" },
            { file_path: "cars/suv_1", x: -4, z: 3.15, dir: "east", speed: this.fast, name: "6" },
            { file_path: "cars/suv_2", x: -4, z: 3.9, dir: "west", speed: this.fast, name: "7" },
            { file_path: "cars/suv_3", x: 4, z: 3.9, dir: "west", speed: this.fast, name: "8" },
            { file_path: "cars/car_4", x: 2, z: 3.9, dir: "west", speed: this.fast, name: "9" },
            { file_path: "cars/car_2", x: -2, z: 3.9, dir: "west", speed: this.fast, name: "10" },
            { file_path: "cars/pickup_1", x: 0, z: 0.2, dir: "west", speed: this.fast, name: "11" },
            { file_path: "cars/container_3", x: 3, z: 0.2, dir: "west", speed: this.fast, name: "12" },
            { file_path: "cars/container_2", x: 3, z: -0.2, dir: "east", speed: this.slow, name: "13" },
            { file_path: "cars/truck_2", x: -3, z: -0.2, dir: "east", speed: this.slow, name: "14" },
            { file_path: "cars/container_1", x: 0, z: -2.36, dir: "east", speed: this.fast, name: "25" },
            { file_path: "cars/bus_3", x: 3, z: -2.36, dir: "east", speed: this.fast, name: "26" },
            { file_path: "cars/suv_2", x: -3, z: -2.36, dir: "east", speed: this.fast, name: "27" },
            { file_path: "cars/suv_2", x: -2, z: -2.0, dir: "west", speed: this.fast, name: "28" },
            { file_path: "cars/pickup_2", x: 1, z: -2.0, dir: "west", speed: this.fast, name: "29" },
            { file_path: "cars/car_4", x: 4, z: -2.0, dir: "west", speed: this.fast, name: "30" },
            { file_path: "cars/car_4", x: 4, z: 6.8, dir: "east", speed: this.fast, name: "31" },
            { file_path: "cars/truck_2", x: 0, z: 6.8, dir: "east", speed: this.fast, name: "32" },
            { file_path: "cars/bus_3", x: 4, z: 7.2, dir: "west", speed: this.medium, name: "33" },
            { file_path: "cars/bus_2", x: -4.0, z: 7.2, dir: "west", speed: this.medium, name: "34" },
            { file_path: "cars/car_2", x: -0.2, z: this.intersections.south[2], dir: "south", speed: this.fast, name: "35" },
            { file_path: "cars/suv_1", x: 0.2, z: this.intersections.north[2], dir: "north", speed: this.fast + 0.01, name: "36" },
            { file_path: "cars/bus_2", x: -6.3, z: this.intersections.north[0], dir: "north", speed: this.fast, name: "37" },
            // { file_path: "cars/pickup_1", x: -6.7, z: this.intersections.south[3], dir: "south", speed: this.fast, name: "38" },
        ];
        this.labelData = [
            { pathIcon: "genelmudurluk.svg", pathText: "genelmudurluk_text.svg", position: new THREE.Vector3(-4.9, 2.7, 1.9), name: "Genel Müdürlük", link: "https://www.anasigorta.com.tr/site/" },
            { pathIcon: "AnaAcentem.svg", pathText: "AnaAcentem_text.svg", position: new THREE.Vector3(-1.5, 1.9, 2.25), name: "Ana Acentem", link: "https://www.anasigorta.com.tr/site/acente-bul" },
            { pathIcon: "AnaSaglik.svg", pathText: "AnaSaglik_text.svg", position: new THREE.Vector3(1, 1.6, 2.3), name: "Ana Sağlık", link: "https://www.anasigorta.com.tr/site/saglik-kurumu-bul" },
            { pathIcon: "AnaServis.svg", pathText: "AnaServis_text.svg", position: new THREE.Vector3(1.8, 1.3, 5), name: "Ana Servis", link: "https://www.anasigorta.com.tr/site/servis-bul" },
            { pathIcon: "iletisim.svg", pathText: "iletisim_text.svg", position: new THREE.Vector3(-3.8, 0.55, 2.5), name: "İletişim", link: "https://www.anasigorta.com.tr/site/iletisim" },
            { position: new THREE.Vector3(0.7, 1.2, 0.6), name: "Muhtarlık", link: "http://212.68.50.184:3000/" },
            { name: "Anasayfa" },
        ];
        this.carsGroup = [];
        this.planeGroup = new THREE.Group();
        this.size = new THREE.Vector3();
        this.num_z_planes = 2;
        this.num_x_planes = 2;
        this.zoom = 1;
        this.zooming = true;
        this.zoomInFactor = 1.5;
        this.zoomOutFactor = 1;
        this.textureLoader = new THREE.TextureLoader();
        this.flashingLabel = null;
        this.intro = new Intro(t => console.log("goto", t), (label) => this.setFlashingLabel(label));
        this.init();
        this.loadBeeModel();
        if (this.mobileCheck()) {
            this.targetPosition = new THREE.Vector3(1.56, 1, 0.7);
        } else {
            this.targetPosition = new THREE.Vector3(0.81, 2.5, 4.5);
        }

        this.positionFactor = new THREE.Vector3();
        //============= debug UI
        this.gui = new GUI();
        const targetFolder = this.gui.addFolder("Position");
        targetFolder.add(this.targetPosition, 'x', -10, 10).name("X position");
        targetFolder.add(this.targetPosition, 'y', -10, 10).name("Y position");
        targetFolder.add(this.targetPosition, 'z', -10, 10).name("Z position");
        targetFolder.open();
        //============= debug UI

        this.currentPosition = new THREE.Vector3(7, 0, 8);

        this.labelCameraTargets = [
            {
                label: "Kahve Molası",
                camera: { x: 7.69, y: 7, z: 5.78 },
                target: { x: 0.7, y: 0, z: -1.22 },
            },
            {
                label: "İletişim",
                camera: { x: 8.05, y: 7, z: 10.41 },
                target: { x: 1.05, y: 0, z: 3.41 },
            },
            {
                label: "Ana Acentem",
                camera: { x: 7.46, y: 7, z: 7.87 },
                target: { x: 0.63, y: 0, z: 1.04 },
            },
            {
                label: "Ana Sağlık",
                camera: { x: 7.69, y: 7, z: 5.78 },
                target: { x: 0.7, y: 0, z: -1.22 },
            },
            {
                label: "Ana Servis",
                camera: { x: 2.88, y: 0.5, z: -1.7 },
                target: { x: 3.52, y: 0.00, z: -2.17 },
                deltaTarget: { x: 2.88, y: 0.5, z: -1.7 },
            },
            {
                label: "Genel Müdürlük",
                camera: { x: 2.0, y: 3.5, z: 4.9 },
                target: { x: -0.44, y: 0, z: 4.74 },
                deltaTarget: { x: 2.0, y: 3.5, z: 4.9 },
            },
            {
                label: "Muhtarlık",
                camera: { x: 9.18, y: 7.01, z: 6.49 },
                target: { x: 2.95, y: 0.00, z: 0.26 },
            },
            {
                label: "Anasayfa",
                camera: { x: 4.21, y: 7.0, z: 8.20 },
                target: { x: -2.73, y: 0, z: 1.23 },
            },
        ];

    };

    loadBeeModel = () => {
        this.mixers = this.mixers || [];
        this.bee = new THREE.Group();
        this.beeSpeakAction = null;
        this.beeHeadMixer = new THREE.AnimationMixer(this.bee);
        this.loader.load("/gltf/beeedark.glb", (glb) => {
            this.bee.add(glb.scene);
            this.bee.scale.set(0.2, 0.2, 0.2);
            this.bee.rotation.x = -15 * DEG2RAD;
            // this.bee.rotation.z = -15 * DEG2RAD;
            this.bee.rotation.y = 45 * DEG2RAD;
            this.scene.add(this.bee);
            const mixer = new THREE.AnimationMixer(this.bee);
            glb.animations.forEach((clip) => {
                if (clip.name == "ArmatureAction") {
                    this.beeSpeakAction = this.beeHeadMixer.clipAction(clip);
                    this.beeSpeakAction.setLoop(THREE.LoopRepeat);
                    this.beeSpeakAction.timeScale = 1.4;
                    this.beeSpeakAction.play();
                }
                else if (clip.name == "Blink") {
                    const action = mixer.clipAction(clip);
                    action.setLoop(THREE.LoopRepeat);
                    action.timeScale = 1.0;
                    action.play();
                } else {
                    const action = mixer.clipAction(clip);
                    action.setLoop(THREE.LoopRepeat);
                    action.timeScale = 4.5;
                    action.play();
                }
            });

            this.mixers.push(mixer);
        });
    };

    mobileCheck() {
        let check = false;
        ((a) => { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };

    setFlashingLabel(label) {
        if (this.audio && !this.audio.paused) {
            this.audio.pause();
        }
        if (label == "start") {
            this.audio = new Audio("/audio/kesfet_main.MP3");
            this.audio.play();
            this.beeIsTalking = true;
            setTimeout(() => {
                this.beeIsTalking = false;
            }, 6000);
            return;
        }

        let timeout = 4000;
        this.flashingLabel = label;

        if (this.mobileCheck()) {
            const targetLabel = this.labelCameraTargets.filter((labelPositions) => labelPositions.label === label);
            if (targetLabel[0]) {
                this.cameraTarget.copy(targetLabel[0].camera);
                this.controlsTarget.copy(targetLabel[0].target);
                this.isMoving = true;
            }
        }

        if (this.flashingLabel == null) {
            this.model.traverse((child) => {
                if (child.type == "Mesh") {
                    child.material.color.set("white");
                }
            });
            return;
        }
        let temp = this.labelCameraTargets.filter(target => target.label === this.flashingLabel)[0].camera;
        let isSeprate = this.labelCameraTargets.filter(target => target.label === this.flashingLabel)[0].deltaTarget;

        if (label === "Genel Müdürlük") {
            this.audio = new Audio("/audio/Genelmudurluk.mp3");
            this.audio.play();
            timeout = 8000;
        }
        if (label == "Ana Sağlık") {
            this.audio = new Audio("/audio/AnaSaglik.mp3");
            this.audio.play();
            timeout = 6000;
        }

        if (label === "Ana Acentem") {
            this.audio = new Audio("/audio/AnaAcentem.mp3");
            this.audio.play();
            timeout = 11000;
        }

        if (label === "Ana Servis") {
            timeout = 11000;
            this.audio = new Audio("/audio/AnaSevis.mp3");
            this.audio.play();
        }

        if (label === "İletişim") {
            this.audio = new Audio("/audio/iletisim.mp3");
            this.audio.play();
            timeout = 8000;
        }

        if (this.mobileCheck()) {
            if (label === "Ana Servis") {
                this.targetPosition = new THREE.Vector3(temp.x, 1.5, temp.z).sub({ x: 5.0, y: 0, z: 4.0 });
            } else {
                this.targetPosition = new THREE.Vector3(temp.x, 1.5, temp.z).sub({ x: 5.5, y: 0, z: 4.5 });
            }
        } else {
            if (label == "İletişim") {
                this.targetPosition.copy(new THREE.Vector3(temp.x, 1, temp.z).sub({ x: 7.0, y: 0, z: 7.0 }));
            } else {
                if (isSeprate || label == "Ana Servis") {
                    console.log("seprate found")
                    this.targetPosition.copy(temp);
                } else {
                    this.targetPosition.copy(new THREE.Vector3(temp.x, 1, temp.z).sub({ x: 7.0, y: 0, z: 6.0 }));
                }
            }
        }

        this.bee.lookAt(this.targetPosition);
        this.beeIsTalking = true;
        setTimeout(() => {
            this.beeIsTalking = false;
        }, timeout);
    }
    showLoadingScreen() {
        document.getElementById("loading-screen").style.display = "flex";
    }
    hideLoadingScreen() {
        document.getElementById("loading-screen").style.display = "none";
    }
    loadCars() {
        this.carsData.forEach((car) => {
            this.loader.load(car.file_path + ".glb", (gltf) => {
                gltf.scene.name = car.name;
                gltf.scene.position.set(car.x, 0, car.z);
                gltf.scene.rotation.y = this.directionMappings[car.dir].rotation;
                gltf.scene.scale.set(0.09, 0.09, 0.09);
                this.carsGroup.push({ object: gltf.scene, ...car });
            });
        });
    }
    updateCars() {
        for (const car of this.carsGroup) {
            const temp = this.scene.getObjectsByProperty("name", car.name);
            const directionParams = this.directionMappings[car.dir];
            temp.forEach((tempcar) => {
                if (car.dir === "north" || car.dir === "east") {
                    if (Math.abs(tempcar.position[directionParams.axis]) > this.size[directionParams.axis === "x" ? "z" : "x"] / 2) {
                        tempcar.position[directionParams.axis] = this.size[directionParams.axis === "x" ? "z" : "x"] / 2;
                    }
                }
                if (car.dir === "south" || car.dir === "west") {
                    if (tempcar.position[directionParams.axis] > this.size[directionParams.axis === "x" ? "z" : "x"] / 2) {
                        tempcar.position[directionParams.axis] = -this.size[directionParams.axis === "x" ? "z" : "x"] / 2;
                    }
                }

                if (car.dir === "north" || car.dir === "south") {
                    let shouldStop = false;
                    this.intersections[car.dir].forEach((pos) => {
                        if (Math.abs(tempcar.position.z - pos) < 0.1) {
                            for (const othercar of this.carsGroup) {
                                if (othercar.dir === "west" || othercar.dir === "east") {
                                    const otherCar = this.scene.getObjectByProperty("name", othercar.name);
                                    if (otherCar !== undefined) {
                                        if (Math.abs(this.distanceToSquared(otherCar.position, tempcar.position)) < 3.0) {
                                            shouldStop = true;
                                        }
                                    } else {
                                        shouldStop = true;
                                    }
                                }
                            }
                        }
                    });
                    !shouldStop && (tempcar.position[directionParams.axis] += directionParams.moveAmount * car.speed);
                } else {
                    tempcar.position[directionParams.axis] += directionParams.moveAmount * car.speed;
                }
            });
        }
    }
    createVideoMesh = (position) => {
        const video = document.getElementById("arrow-down");
        video.play();
        const videoTexture = new THREE.VideoTexture(video);
        const videoMaterial = new THREE.SpriteMaterial({ map: videoTexture });
        const mesh = new THREE.Sprite(videoMaterial);
        const xOffset = 0.195;
        const zOffset = 0.21;
        const scale = 0.12;
        mesh.position.set(position.x + xOffset, position.y + 0.012, position.z + zOffset);
        mesh.scale.set(scale, scale, scale);
        this.model.add(mesh);
    };

    createSprite = () => {
        this.labelObjects = [];
        this.labelData.forEach((label) => {
            if (label.pathIcon) {
                const icon = this.textureLoader.load(`/icons/buttonsvg/${label.pathIcon}`);
                icon.colorSpace = THREE.SRGBColorSpace;
                // icon.center.set(0, 1);

                const hitbox = new THREE.Sprite(new THREE.SpriteMaterial({ map: icon, opacity: 0 }));

                const spriteIcon = new THREE.Sprite(new THREE.SpriteMaterial({ map: icon }));
                spriteIcon.name = `${label.name}_icon`;
                spriteIcon.scale.set(0.5, 0.5, 0.5);

                const text = this.textureLoader.load(`/icons/buttonsvg/${label.pathText}`);
                text.colorSpace = THREE.SRGBColorSpace;
                const spriteText = new THREE.Sprite(new THREE.SpriteMaterial({ map: text }));
                spriteText.position.setY(-0.4);
                spriteText.name = `${label.name}_text`;
                spriteText.scale.set(1.3, 0.4, 1);


                const spriteGroup = new THREE.Group();
                spriteGroup.add(spriteIcon, spriteText, hitbox);
                spriteGroup.position.copy(label.position);

                spriteGroup.name = label.name;
                this.model.add(spriteGroup);
                this.labelObjects.push(spriteGroup);
            }
        });
    };




    distanceToSquared(a, b) {
        return (b.x - a.x) ** 2 + (b.z - a.z) ** 2;
    }

    setupLights() {
        this.light = new THREE.DirectionalLight(0xffffff, 5);
        this.light.castShadow = true;
        this.light.position.set(50, -10, 100);
        this.light.rotation.set(0.3, -0.6, -0.4);
        this.light.shadow.mapSize.width = 1024;
        this.light.shadow.mapSize.height = 1024;
        this.light.shadow.bias = -0.001;

        this.scene.add(this.light.target);
        this.scene.add(this.light);

        this.scene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 1));
    }
    updateLights() {
        this.light.position.copy(this.camera.position).add({ x: 0, y: -2, z: -9 });
        this.light.target.position.copy(this.controls.target);
    }
    loadVideoTexture() {
        // const video = document.getElementById("billBoardVideo");
        const tex = this.textureLoader.load('/img/billBoard.jpeg');
        const material2 = new THREE.MeshBasicMaterial({ map: tex })
        const vplane = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.7), material2);
        this.onClick(vplane, () => {
            window.open("https://www.anasigorta.com.tr/site/", "_blank");
        });

        const redBoard = this.model.getObjectByName("RedBoard")
        this.onClick(redBoard, () => {
            window.open("https://www.anasigorta.com.tr/site/", "_blank");
        })
        vplane.position.z = -0.95;
        vplane.position.y = 0.7;
        vplane.position.x = -3.48;
        vplane.name = "billBoardVideo";
        this.model.add(vplane);
    }
    loadCity() {
        this.loadCars();
        this.loader.load(
            "/gltf/city.glb",
            (gltf) => {
                this.model = gltf.scene;
                this.model.rotation.y = Math.PI / 2;
                this.model.position.set(-1, 0, -0);

                this.carsGroup.forEach((car) => {
                    this.model.add(car.object.clone());
                });
                this.loadVideoTexture();
                this.model.traverse((child) => {
                    if (child.isMesh) {
                        child.receiveShadow = true;
                        child.castShadow = true;
                    }
                });

                const box = new THREE.Box3().setFromObject(this.model);
                box.getSize(this.size);
                this.createSprite();

                for (let row = 0; row < this.num_x_planes; row++) {
                    for (let col = 0; col < this.num_z_planes; col++) {
                        const temp = this.model.clone();
                        temp.position.set(
                            this.model.position.x + row * this.size.x,
                            0,
                            this.model.position.z + col * (this.size.z - 0.07)
                        );
                        this.planeGroup.add(temp);
                    }
                }
                this.scene.add(this.planeGroup);
                this.hideLoadingScreen();
                this.addSpritesOnClick();
                this.addSpritesOnHover();
                this.cameraInitial = 11;
                this.childMaterialColors = {};
                this.model.traverse((child) => {
                    if (child.type == "Mesh") {
                        this.childMaterialColors[child.name] = child.material.color;
                        child.material.color.set("gray");
                    }
                });
            },
            (xhr) => {
                const loader = document.getElementById("loader");
                if (!loader) {
                    console.error("no element with id loader found");
                    return;
                }
                loader.style.width = `${(xhr.loaded / xhr.total) * window.innerWidth}px`;
            },
        );
    }
    updatePlanes() {
        this.planeGroup.children.forEach((plane) => {
            if (this.camera.position.z < plane.position.z - (this.size.z / 3)) {
                plane.position.setZ(plane.position.z - (this.size.z * this.num_z_planes));
            }
            if (this.camera.position.z > plane.position.z + (this.size.z * this.num_z_planes) - this.size.z / 3) {
                plane.position.setZ(plane.position.z + (this.size.z * this.num_z_planes));
            }

            if (this.camera.position.x < plane.position.x - (this.size.x / 3)) {
                plane.position.setX(plane.position.x - this.size.x * this.num_x_planes);
            }
            if (this.camera.position.x > plane.position.x + (this.size.x * this.num_x_planes) - this.size.x / 3) {
                plane.position.setX(plane.position.x + (this.size.x * this.num_x_planes));
            }
        });
    }
    zoomHandler(event) {
        const delta = event.deltaY;
        if (delta > 0) {
            this.zoom = this.zoomOutFactor;
            this.hideLabelDom();
        } else {
            this.zoom = this.zoomInFactor;
        }
    }

    onWindowResize() {
        this.targetPosition = new THREE.Vector3((window.innerWidth / 1000) * -0.6, 0.5, (window.innerWidth / 1000) * 2.3);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onClick(object, callback) {
        window.addEventListener("click", (event) => {
            // event.preventDefault();
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObject(object);
            if (intersects.length > 0) {
                callback(intersects[0]);
            }
        });

        window.addEventListener("touchstart", (event) => {
            event.preventDefault();
            let clientX = event.touches[0].clientX;
            let clientY = event.touches[0].clientY;
            this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObject(object);
            if (intersects.length > 0) {
                callback(intersects[0]);
            }
        });
    }

    onHover(label, object, inCallback, outCallback) {
        const update = () => {
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObject(object);

            if (intersects.length > 0) {
                inCallback(object, label);
            } else {
                outCallback(object, label);
            }
            requestAnimationFrame(update);
        };
        update();

        window.addEventListener("mousemove", (event) => {
            event.preventDefault();
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
    }

    flashAnimation = (object, label, time) => {
        const icon = object.children[0];
        icon.position.y = Math.sin(time) * 0.2;
    };

    addSpritesOnHover() {
        const lerpFactor = 0.3;

        const labelInAnimation = (object, label) => {
            const icon = object.children[0];
            const text = object.children[1];
            text.material.opacity = lerp(text.material.opacity, 10, lerpFactor);
            icon.position.x = lerp(icon.position.x, -this.mouse.x * 0.15, lerpFactor);
            // icon.position.y = lerp(icon.position.y, 0.1, lerpFactor);
            icon.scale.set(
                lerp(icon.scale.x, 0.3, lerpFactor),
                lerp(icon.scale.y, 0.3, lerpFactor),
                lerp(icon.scale.z, 1, lerpFactor)
            );
        };


        const labelOutAnimation = (object, label) => {
            const icon = object.children[0];
            const text = object.children[1];
            text.material.opacity = lerp(text.material.opacity, 0, lerpFactor);
            icon.scale.set(
                lerp(icon.scale.x, 0.5, lerpFactor),
                lerp(icon.scale.y, 0.5, lerpFactor),
                lerp(icon.scale.z, 1, lerpFactor)
            );
        };

        this.labelData.forEach((label) => {
            const labelObjects = this.scene.getObjectsByProperty("name", label.name);
            labelObjects.forEach((labelclone) => {
                this.onHover(
                    label,
                    labelclone,
                    labelInAnimation,
                    labelOutAnimation,
                )
            });
        });
    }

    addSpritesOnClick() {
        this.labelData.forEach((label) => {
            const labelObjects = this.scene.getObjectsByProperty("name", label.name);
            labelObjects.forEach((labelclone) => {
                this.onClick(labelclone, () => {
                    this.moveToNextLabel(label.name);
                    setTimeout(() => window.open(label.link, "_blank"), 1000);
                });
            });
        });
    }

    setupRenderer() {
        const rendererCanvas = document.getElementById("game");
        if (rendererCanvas === null) {
            console.error("no canvas found with id game");
            return;
        }
        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: rendererCanvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(this.fogColor);
    }
    setupControls() {
        this.controls = new MapControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.enableRotate = false;
        this.controls.dampingFactor = 0.1;
        this.controls.enableZoom = false;
    }
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(22, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(7, 100, 7);
    }
    animateCamera() {
        if (Math.abs(this.camera.zoom - this.zoom) > 0.001) {
            this.camera.zoom = lerp(this.camera.zoom, this.zoom, 0.1);
            this.camera.updateProjectionMatrix();
        }
        this.camera.position.y = lerp(this.camera.position.y, this.zoom === 1 ? this.cameraInitial : 7, 0.1);
    }
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(this.fogColor, 6, 100);
    }

    handlePinchStart(event) {
        if (event.touches.length === 2) {
            const distance = this.getDistance(event.touches[0], event.touches[1]);
            this.initialDistance = distance;
        }
    }
    handlePinchChange(event) {
        if (event.touches.length === 2 && this.initialDistance !== null) {
            const distance = this.getDistance(event.touches[0], event.touches[1]);
            if (distance > this.initialDistance) {
                this.zoom = this.zoomInFactor;
            } else if (distance < this.initialDistance) {
                this.zoom = this.zoomOutFactor;
            }
        }
    }
    handlePinchEnd(event) {
        if (event.touches.length < 2) {
            this.initialDistance = null;
        }
    }
    getDistance(touch1, touch2) {
        const dx = touch1.pageX - touch2.pageX;
        const dy = touch1.pageY - touch2.pageY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    showLabelDom(label) {
        document.getElementById("label-container").style.opacity = 1;
        this.labelDom.innerText = label;
    }
    hideLabelDom() {
        document.getElementById("label-container").style.opacity = 0;
    }

    moveToNextLabel(labelName) {
        this.zoom = this.zoomInFactor;
        this.showLabelDom(labelName);
        const targetLabel = this.labelCameraTargets.filter((labelPositions) => labelPositions.label === labelName);
        if (targetLabel[0]) {
            this.cameraTarget.copy(targetLabel[0].camera);
            this.controlsTarget.copy(targetLabel[0].target);
            this.isMoving = true;
        }
    }
    init() {
        // window.addEventListener('click', () => {
        //     console.log(this.camera.position.x.toFixed(2), this.camera.position.y.toFixed(2), this.camera.position.z.toFixed(2),);
        //     console.log(this.controls.target.x.toFixed(2), this.controls.target.y.toFixed(2), this.controls.target.z.toFixed(2),);
        // })
        this.setupRenderer();
        this.setupCamera();
        this.setupControls();
        this.controls.target.set(1, 0, 1);
        this.setupScene();
        this.setupLights();
        // this.setupStats();
        this.loadCity();

        document.getElementById("btn-next").onclick = () => {
            this.activeLabel = (this.activeLabel + 1) % this.labelData.length;
            this.moveToNextLabel(this.labelData[this.activeLabel % this.labelData.length].name);
        };
        document.getElementById("btn-prev").onclick = () => {
            this.activeLabel = (this.activeLabel - 1 + this.labelData.length) % this.labelData.length;
            this.moveToNextLabel(this.labelData[this.activeLabel].name);
        };
        window.addEventListener("resize", this.onWindowResize.bind(this));
        window.addEventListener("wheel", this.zoomHandler.bind(this));
        document.addEventListener("touchstart", this.handlePinchStart.bind(this), { passive: false });
        document.addEventListener("touchmove", this.handlePinchChange.bind(this), { passive: false });
        document.addEventListener("touchend", this.handlePinchEnd.bind(this), { passive: false });

        this.animate();
    }

    animate(time) {
        requestAnimationFrame((time) => this.animate(time));
        this.updateCars();
        this.animateCamera();
        this.updatePlanes();
        this.controls.update();
        this.updateLights();
        // this.stats.update();
        this.renderer.render(this.scene, this.camera);
        if (this.isMoving) {
            if (this.camera.position.distanceToSquared(this.cameraTarget) < 0.2) {
                this.isMoving = false;
            }
            this.camera.position.lerp(this.cameraTarget, 0.1);
            this.controls.target.lerp(this.controlsTarget, 0.1);
        }


        this.labelData.forEach((label) => {
            // console.log(this.flashingLabel, label.name);
            if (this.flashingLabel === label.name) {
                const labelObjects = this.scene.getObjectsByProperty("name", label.name);
                labelObjects.forEach((labelclone) => {
                    this.flashAnimation(labelclone, label, time * 0.008);
                })
            }
        })

        const delta = 0.04;
        if (this.mixers) {

            this.mixers.forEach((mixer) => { mixer.update(delta) });
        }

        if (this.beeHeadMixer && this.beeIsTalking) {
            this.beeHeadMixer.update(delta);
        }
        if (this.bee && this.targetPosition) {
            this.currentPosition.lerp(this.targetPosition, 0.1);
            this.bee.position.copy(this.currentPosition);

            if (this.bee.position.distanceTo(this.targetPosition) < 0.5) {
                this.bee.lookAt(this.targetPosition.clone().lerp(this.camera.position.clone().sub({ x: 1.5, y: 2, z: -1.5 }), 0.1));
            }
        }
    }
}

new Game();
