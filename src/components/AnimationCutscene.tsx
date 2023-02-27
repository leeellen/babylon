import { FreeCamera, Vector3, Scene, SceneLoader, CubeTexture, Animation, AnimationGroup } from '@babylonjs/core';
import '@babylonjs/loaders';
import SceneComponent from './SceneComponent';

const sky = require('../assets/environment/sky.env');
const proto = require('../assets/models/Prototype_Level.glb');
const character = require('../assets/models/character.glb');
const zombie1 = require('../assets/models/zombie_1.glb');
const zombie2 = require('../assets/models/zombie_2.glb');

let currentScene: Scene;
let camera: FreeCamera;
let characterAnimations: AnimationGroup[];

const onSceneReady = (scene: Scene) => {
    currentScene = scene;

    createScene();
    createEnvironment();
    createCharacter();
    createZombies();
    createCutscene();
};

const createScene = () => {
    const envTex = CubeTexture.CreateFromPrefilteredData(sky, currentScene);

    envTex.gammaSpace = false;

    envTex.rotationY = Math.PI / 2;

    currentScene.environmentTexture = envTex;

    currentScene.createDefaultSkybox(envTex, true, 1000, 0.25);

    camera = new FreeCamera('camera', new Vector3(0, 2, -10), currentScene);
    camera.attachControl();
    camera.minZ = 0.5;
    camera.speed = 0.5;
};

const createEnvironment = async () => {
    await SceneLoader.ImportMeshAsync('', proto, '', currentScene);
};

const createCharacter = async () => {
    const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync('', character, '');

    meshes[0].rotate(Vector3.Up(), -Math.PI / 2);
    meshes[0].position = new Vector3(8, 0, -4);

    characterAnimations = animationGroups;

    characterAnimations[0].stop();
    characterAnimations[1].play();
};

const createZombies = async () => {
    const zombieOne = await SceneLoader.ImportMeshAsync('', zombie1, '');

    const zombieTwo = await SceneLoader.ImportMeshAsync('', zombie2, '');

    zombieOne.meshes[0].rotate(Vector3.Up(), Math.PI / 2);
    zombieOne.meshes[0].position = new Vector3(-8, 0, -4);

    zombieTwo.meshes[0].rotate(Vector3.Up(), Math.PI / 2);
    zombieTwo.meshes[0].position = new Vector3(-6, 0, -2);
};

const createCutscene = async () => {
    const camKeys = [];
    const fps = 60;
    const camAnim = new Animation(
        'camAnim',
        'position',
        fps,
        Animation.ANIMATIONTYPE_VECTOR3,
        Animation.ANIMATIONLOOPMODE_CONSTANT,
    );

    camKeys.push({ frame: 0, value: new Vector3(10, 2, -10) });
    camKeys.push({ frame: 5 * fps, value: new Vector3(-6, 2, -10) });
    camKeys.push({ frame: 8 * fps, value: new Vector3(-6, 2, -10) });
    camKeys.push({ frame: 12 * fps, value: new Vector3(0, 3, -16) });

    camAnim.setKeys(camKeys);

    camera.animations.push(camAnim);

    await currentScene.beginAnimation(camera, 0, 12 * fps).waitAsync();
    EndCutscene();
};

const EndCutscene = () => {
    camera.attachControl();
    characterAnimations[1].stop();
    characterAnimations[0].play();
};

const onRender = (scene: Scene) => {
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
};

export default function AnimationCutscene() {
    return <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} />;
}
