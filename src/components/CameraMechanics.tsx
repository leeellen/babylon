import { FreeCamera, Vector3, Scene, SceneLoader, CubeTexture, Engine, ArcRotateCamera, Camera } from '@babylonjs/core';
import '@babylonjs/loaders';
import SceneComponent from './SceneComponent';
import '../styles/cameraMechanics.css';

let currentCanvas: HTMLCanvasElement | undefined;
let currentScene: Scene;
let currentEngine: Engine;
let currentCamera: ArcRotateCamera;
let watch;

const onSceneReady = (scene: Scene, engine: Engine, canvas?: HTMLCanvasElement) => {
    currentCanvas = canvas;
    currentScene = scene;
    currentEngine = engine;

    createCamera();
    createSkyBox();
    createWatch();
};

const createCamera = () => {
    // 오브젝트 중심으로 카메라 이동
    currentCamera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2, 40, Vector3.Zero(), currentScene);

    currentCamera.attachControl(currentCanvas, true);
    currentCamera.wheelPrecision = 100; // 휠을 이용한 줌 속도

    currentCamera.minZ = 0.3;

    currentCamera.lowerRadiusLimit = 1;
    currentCamera.upperRadiusLimit = 5;
    currentCamera.panningSensibility = 0;
    // currentCamera.useBouncingBehavior = true;
    currentCamera.useAutoRotationBehavior = true; // 상호작용이 없는 경우 자동 카메라 회전
    currentCamera.autoRotationBehavior!.idleRotationSpeed = 0.3; // 회전 속도
    currentCamera.autoRotationBehavior!.idleRotationSpinupTime = 1000; // 상호작용 후 다시 회전하기까지 대기시간
    currentCamera.autoRotationBehavior!.idleRotationWaitTime = 2000; // 최대 공회전 속도까지 회전하는 데 걸리는 시간(밀리초)
    currentCamera.autoRotationBehavior!.zoomStopsAnimation = true; // 줌하면 회전 정지 여부

    currentCamera.useFramingBehavior = true; // 카메라 자동 배치 => 자연스러운 배치
    currentCamera.framingBehavior!.radiusScale = 2; // 반지름
    // currentCamera.framingBehavior!.framingTime = 4000; // 전환시간
};

const createSkyBox = () => {
    const envTex = CubeTexture.CreateFromPrefilteredData('environment/christmas.env', currentScene);
    envTex.gammaSpace = false;

    envTex.rotationY = Math.PI;

    currentScene.environmentTexture = envTex;

    currentScene.createDefaultSkybox(envTex, true, 1000, 0.25);
};

const createWatch = async () => {
    const { meshes } = await SceneLoader.ImportMeshAsync('', './models/', 'vintage.glb', currentScene);

    console.log('meshes', meshes);

    watch = meshes[0];
    currentCamera.setTarget(meshes[2]);
    currentEngine.loadingScreen.hideLoadingUI();
};

const onRender = () => {
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
};

export default function CameraMechanics() {
    return (
        <main>
            <header>
                <h1>TIMELESS</h1>
            </header>

            <section>
                <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} />
                <div id="productDetails">
                    <h3>Avventura Vintage Gold Pocket Watch</h3>
                    <p id="price">$1,195</p>

                    <div id="description">
                        <h4>Description</h4>

                        <p>
                            Beautiful 9 Karat Gold pocket watch suitable for any occasion. This vintage piece was made
                            in 1910 and includes an inscription of the watch maker on the back for added authenticity.
                        </p>

                        <p>
                            Original glass face with intricate ornamental design and classic Roman numerals. The perfect
                            gift to be handed down through the ages.
                        </p>
                        <br />

                        <b>Dimensions</b>
                        <p>1.25" width of the watch 1.75" height with bow 23.52 grams weight</p>
                    </div>

                    <button>ADD TO CART</button>
                </div>
            </section>
        </main>
    );
}
