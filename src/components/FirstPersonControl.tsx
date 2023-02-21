import { FreeCamera, Vector3, HemisphericLight, MeshBuilder, Scene, SceneLoader } from '@babylonjs/core';
import SceneComponent from './SceneComponent';

const prototype_Level = require('../assets/models/prototype_Level.glb');

let camera;
let currentScene: Scene;

const onSceneReady = (scene: Scene) => {
    currentScene = scene;
    camera = new FreeCamera('camera', new Vector3(0, 1, -5), currentScene);
    camera.attachControl();

    new HemisphericLight('hemi', new Vector3(0, 1, 0), currentScene);

    createEnvironment();
};

const createEnvironment = async () => {
    const { meshes } = await SceneLoader.ImportMeshAsync('', prototype_Level, '', currentScene);
};

const onRender = (scene: Scene) => {
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
};

export default function FirstPersonControl() {
    return <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} />;
}
