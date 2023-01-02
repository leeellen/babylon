import { FreeCamera, Vector3, Scene, SceneLoader, CubeTexture, Engine } from '@babylonjs/core';
import '@babylonjs/loaders';
import SceneComponent from './SceneComponent';

let currentScene: Scene;
let currentEngine: Engine;

const onSceneReady = (scene: Scene, engine: Engine) => {
    currentScene = scene;
    currentEngine = engine;

    createCamera();
    createSkyBox();
    createEnvironment();
};

const createCamera = () => {
    const camera = new FreeCamera('camera', new Vector3(0, 2, -8), currentScene);
    camera.attachControl();
    camera.speed = 0.25;
};

const createSkyBox = () => {
    const envTex = CubeTexture.CreateFromPrefilteredData('assets/environment/sunset.env', currentScene);

    currentScene.environmentTexture = envTex;
    currentScene.createDefaultSkybox(envTex, true);
    currentScene.environmentIntensity = 0.5;
};

const createEnvironment = async () => {
    await SceneLoader.ImportMeshAsync('', 'assets/models/', 'LightingScene.glb', currentScene, (evt) => {
        // let loadedPercent = 0;
        // https://doc.babylonjs.com/features/featuresDeepDive/scene/customLoadingScreen#getting-file-loading-rate
        // 파일 용량을 측정할 수 있을때
        // if (evt.lengthComputable) {
        //     // 로딩 퍼센트 계산
        //     loadedPercent = +((evt.loaded * 100) / evt.total).toFixed();
        // } else {
        //     // 로컬 파일인 경우 evt의 total 값이 0이기 때문에 아래 코드가 실행되게 되지만, 다양한 용량의 파일로 테스트 결과 제대로 작동하지 않는 코드인듯하다.
        //     let dlCount = evt.loaded / (1024 * 1024);
        //     loadedPercent = Math.floor(dlCount * 100.0) / 100.0;
        // }
    });

    // 설정한 커스텀 로딩 화면 숨기기
    currentEngine.loadingScreen.hideLoadingUI();
};

const onRender = () => {
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
};

export default function CustomLoading() {
    return <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} />;
}
