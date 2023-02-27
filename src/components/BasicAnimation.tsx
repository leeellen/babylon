import {
    FreeCamera,
    Vector3,
    Scene,
    SceneLoader,
    CubeTexture,
    CannonJSPlugin,
    MeshBuilder,
    PhysicsImpostor,
    Mesh,
    PBRMaterial,
    Color3,
    Texture,
    Matrix,
    AbstractMesh,
    Animation,
} from '@babylonjs/core';
import '@babylonjs/loaders';
import * as CANNON from 'cannon';
import SceneComponent from './SceneComponent';

const sky = require('../assets/environment/sky.env');
const proto = require('../assets/models/Prototype_Level.glb');
const targetModel = require('../assets/models/target.glb');

let currentScene: Scene;
let camera: FreeCamera;
let target: AbstractMesh;

const onSceneReady = (scene: Scene) => {
    currentScene = scene;

    createScene();
    createEnvironment();
    createTarget();
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

const createTarget = async () => {
    const { meshes } = await SceneLoader.ImportMeshAsync('', targetModel, '', currentScene);

    meshes.shift();
    target = Mesh.MergeMeshes(meshes as Mesh[], true, true, undefined, false, true)!;

    target.position.y = 3;
    createAnimations();
};

const createAnimations = () => {
    const rotateFrames = [];
    const sliderFrames = [];
    const fadeFrames = [];
    const fps = 60;

    const rotateAnim = new Animation(
        'rotateAnim',
        'rotation.z',
        fps,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CYCLE,
    );

    const slideAnim = new Animation(
        'slideAnim',
        'position',
        fps,
        Animation.ANIMATIONTYPE_VECTOR3,
        Animation.ANIMATIONLOOPMODE_CYCLE,
    );

    const fadeAnim = new Animation(
        'fadeAnim',
        'visibility',
        fps,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CONSTANT,
    );

    rotateFrames.push({ frame: 0, value: 0 });
    rotateFrames.push({ frame: 180, value: Math.PI / 2 });

    sliderFrames.push({ frame: 0, value: new Vector3(0, 3, 0) });
    sliderFrames.push({ frame: 45, value: new Vector3(-3, 2, 0) });
    sliderFrames.push({ frame: 90, value: new Vector3(0, 3, 0) });
    sliderFrames.push({ frame: 135, value: new Vector3(3, 2, 0) });
    sliderFrames.push({ frame: 180, value: new Vector3(0, 3, 0) });

    fadeFrames.push({ frame: 0, value: 1 });
    fadeFrames.push({ frame: 180, value: 0 });

    rotateAnim.setKeys(rotateFrames);
    slideAnim.setKeys(sliderFrames);
    fadeAnim.setKeys(fadeFrames);

    target.animations.push(rotateAnim);
    target.animations.push(slideAnim);
    target.animations.push(fadeAnim);

    const onAnimationEnd = () => {
        console.log('animation ended');
        target.setEnabled(false);
    };

    const animControl = currentScene.beginDirectAnimation(
        target,
        [slideAnim, rotateAnim],
        0,
        180,
        true,
        1,
        onAnimationEnd,
    );

    currentScene.onPointerDown = async (evt) => {
        if (evt.button === 0) {
            await currentScene.beginDirectAnimation(target, [fadeAnim], 0, 180).waitAsync();
            animControl.stop();
        }
    };
};

const onRender = (scene: Scene) => {
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
};

export default function Raycasting() {
    return <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} />;
}
