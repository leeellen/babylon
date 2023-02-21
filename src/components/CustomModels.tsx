import { FreeCamera, Vector3, Scene, CubeTexture, SceneLoader } from '@babylonjs/core';
import '@babylonjs/loaders';
import SceneComponent from './SceneComponent';

const sky = require('../assets/environment/sky.env');
const barrel = require('../assets/models/barrel.glb');
const camp = require('../assets/models/camp.glb');

let currentScene: Scene;

const onSceneReady = (scene: Scene) => {
    currentScene = scene;

    const camera = new FreeCamera('camera', new Vector3(0, 0.75, -8), currentScene);
    camera.attachControl();
    camera.speed = 0.25;

    const envTex = CubeTexture.CreateFromPrefilteredData(sky, currentScene);
    currentScene.environmentTexture = envTex;
    currentScene.createDefaultSkybox(envTex, true);
    currentScene.environmentIntensity = 0.5;

    createBarrel();
    createCamp();
};

const createBarrel = async () => {
    await SceneLoader.ImportMeshAsync('', barrel, '', currentScene);
};

const createCamp = async () => {
    await SceneLoader.ImportMeshAsync('', camp, '', currentScene);
};

const onRender = () => {
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
};

export default function CustomModels() {
    return <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} />;
}
