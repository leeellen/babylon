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
    const envTex = CubeTexture.CreateFromPrefilteredData('environment/sunset.env', currentScene);

    currentScene.environmentTexture = envTex;
    currentScene.createDefaultSkybox(envTex, true);
    currentScene.environmentIntensity = 0.5;
};

const createEnvironment = async () => {
    await SceneLoader.ImportMeshAsync('', './models/', 'LightingScene.glb', currentScene, (evt) => {
        let loadedPercent = 0;

        if (evt.lengthComputable) {
            loadedPercent = +((evt.loaded * 100) / evt.total).toFixed();
        } else {
        }
        // currentLoading.updateLoadStatus(`${loadedPercent}`);
    });

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
