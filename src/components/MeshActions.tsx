import {
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    Scene,
    CubeTexture,
    Sound,
    Texture,
    PBRMaterial,
    Engine,
    Color3,
    SceneLoader,
} from '@babylonjs/core';
import '@babylonjs/loaders';
import SceneComponent from './SceneComponent';

let currentEngine: Engine;
let currentScene: Scene;
let cube;
let sphere;
let cylinder;
let sphereMat;

const onSceneReady = (scene: Scene, engine: Engine) => {
    currentEngine = engine;
    currentScene = scene;

    createEnvironment();
    createMeshes();
};

const createEnvironment = () => {
    new FreeCamera('camera', new Vector3(0, 0, -10), currentScene);

    const envTex = CubeTexture.CreateFromPrefilteredData('assets/environment/christmas.env', currentScene);
    currentScene.environmentTexture = envTex;
    currentScene.createDefaultSkybox(envTex, true, 1000, 0.2, true);
    currentScene.environmentIntensity = 1.5;
};

const createMeshes = async () => {
    sphereMat = new PBRMaterial('sphereMat', currentScene);
    sphereMat.albedoColor = new Color3(1, 0, 0);
    sphereMat.roughness = 1;

    const { meshes } = await SceneLoader.ImportMeshAsync('', 'assets/models/', 'gifts.glb', currentScene);

    cube = meshes[1];
    sphere = meshes[2];
    cylinder = meshes[3];
    cylinder.rotation = new Vector3(-Math.PI / 4, 0, 0);

    currentEngine.hideLoadingUI();
};

const onRender = () => {
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
};

export default function MeshActions() {
    return <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} />;
}
