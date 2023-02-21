import { FreeCamera, Vector3, HemisphericLight, MeshBuilder, Scene, SceneLoader, Engine } from '@babylonjs/core';
import SceneComponent from './SceneComponent';
import '@babylonjs/loaders';

const prototype_Level = require('../assets/models/prototype_Level.glb');

let currentScene: Scene;
let currentEngine: Engine;

const onSceneReady = (scene: Scene, engine: Engine) => {
    currentScene = scene;
    currentEngine = engine;

    new HemisphericLight('hemi', new Vector3(0, 1, 0), currentScene);

    currentScene.onPointerDown = (e) => {
        if (e.button === 0) currentEngine.enterPointerlock();
        if (e.button === 1) currentEngine.exitPointerlock();
    };

    const framesPerSecond = 60;
    const gravity = -9.81;
    currentScene.gravity = new Vector3(0, gravity / framesPerSecond, 0);
    currentScene.collisionsEnabled = true;

    createEnvironment();
    createController();
};

const createEnvironment = async () => {
    const { meshes } = await SceneLoader.ImportMeshAsync('', prototype_Level, '', currentScene);

    meshes.map((mesh) => (mesh.checkCollisions = true));
};

const createController = () => {
    const camera = new FreeCamera('camera', new Vector3(0, 10, 0), currentScene); // 카메라 생성
    camera.attachControl(); // 카메라 컨트롤

    camera.applyGravity = true; // 중력 적용
    camera.checkCollisions = true; // 충돌체크 적용

    // 카메라를 감싸는 가상의 타원체로 설정값에 따라 충돌 감지 범위가 달라진다. link: https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions#2-define-an-ellipsoid
    camera.ellipsoid = new Vector3(1, 1, 1);

    camera.minZ = 0.45;
    camera.speed = 0.75;
    camera.angularSensibility = 4000;

    camera.keysUp.push(87);
    camera.keysDown.push(83);
    camera.keysLeft.push(65);
    camera.keysRight.push(68);
};

const onRender = (scene: Scene) => {
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
};

export default function FirstPersonControl() {
    return <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} />;
}
