import { FreeCamera, Vector3, Scene, SceneLoader, CubeTexture, AbstractMesh } from '@babylonjs/core';
import '@babylonjs/loaders';
import SceneComponent from './SceneComponent';

const sky = require('../assets/environment/sky.env');
const proto = require('../assets/models/Prototype_Level.glb');
const character = require('../assets/models/character.glb');

let currentScene: Scene;
let camera: FreeCamera;
let target: AbstractMesh;

const onSceneReady = (scene: Scene) => {
    currentScene = scene;

    createScene();
    createEnvironment();
    createCharacter();
};

const createScene = () => {
    const envTex = CubeTexture.CreateFromPrefilteredData(sky, currentScene);

    envTex.gammaSpace = false;

    envTex.rotationY = Math.PI / 2;

    currentScene.environmentTexture = envTex;

    currentScene.createDefaultSkybox(envTex, true, 1000, 0.25);

    const camera = new FreeCamera('camera', new Vector3(0, 2, -10), currentScene);
    camera.attachControl();
    camera.minZ = 0.5;
    camera.speed = 0.5;
};

const createEnvironment = async () => {
    await SceneLoader.ImportMeshAsync('', proto, '', currentScene);
};

const createCharacter = async () => {
    const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync('', character, '');

    meshes[0].rotate(Vector3.Up(), Math.PI);

    console.log('animation groups', animationGroups);

    animationGroups[0].play(true);

    animationGroups[2].play(true);
};

const onRender = (scene: Scene) => {
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
};

export default function CharacterAnimation() {
    return <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} />;
}
