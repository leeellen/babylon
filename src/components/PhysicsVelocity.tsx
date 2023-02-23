import {
    FreeCamera,
    Vector3,
    HemisphericLight,
    Scene,
    SceneLoader,
    CubeTexture,
    CannonJSPlugin,
    MeshBuilder,
    PhysicsImpostor,
} from '@babylonjs/core';
import '@babylonjs/loaders';
import * as CANNON from 'cannon';
import SceneComponent from './SceneComponent';

const sky = require('../assets/environment/sky.env');
const proto = require('../assets/models/Prototype_Level.glb');
const rocket = require('../assets/models/toon_rocket.glb');

let currentScene: Scene;
let camera: FreeCamera;

const onSceneReady = (scene: Scene) => {
    currentScene = scene;

    const envTex = CubeTexture.CreateFromPrefilteredData(sky, scene);
    envTex.gammaSpace = false;
    envTex.rotationY = Math.PI / 2;
    currentScene.environmentTexture = envTex;
    currentScene.createDefaultSkybox(envTex, true, 1000, 0.25);

    camera = new FreeCamera('camera', new Vector3(0, 2, -5), currentScene);
    camera.attachControl();
    camera.minZ = -0.5;

    currentScene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin(true, 10, CANNON));

    createEnvironment();
    createImpostor();
    createRocket();
};

const createEnvironment = async () => {
    const hemiLight = new HemisphericLight('hemiLight', new Vector3(0, 1, 0), currentScene);

    hemiLight.intensity = 0.5;

    await SceneLoader.ImportMeshAsync('', proto, '', currentScene);
};

const createImpostor = () => {
    const ground = MeshBuilder.CreateGround('ground', {
        width: 40,
        height: 40,
    });

    ground.isVisible = false;

    ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 1 });
};

const createRocket = async () => {
    const { meshes } = await SceneLoader.ImportMeshAsync('', rocket, '', currentScene);

    const rocketCol = MeshBuilder.CreateBox('rocketCol', { width: 1, height: 1.7, depth: 1 });
    rocketCol.position.y = 0.85;
    rocketCol.visibility = 0;

    rocketCol.physicsImpostor = new PhysicsImpostor(rocketCol, PhysicsImpostor.BoxImpostor, {
        mass: 1,
    });

    meshes[0].setParent(rocketCol);

    rocketCol.rotate(Vector3.Forward(), 0.5);

    const rocketPhysics = () => {
        if (rocketCol.physicsImpostor) {
            camera.position = new Vector3(rocketCol.position.x, rocketCol.position.y, camera.position.z); // 카메라가 로켓 따라가도록

            rocketCol.physicsImpostor.setLinearVelocity(rocketCol.up.scale(5)); // 움직임
            rocketCol.physicsImpostor.setAngularVelocity(rocketCol.up); // 회전
        }
    };

    let gameOver = false;
    if (!gameOver) currentScene.registerBeforeRender(rocketPhysics); // 모든 프레임마다 실행

    currentScene.onPointerDown = () => {
        gameOver = true;
        currentScene.unregisterBeforeRender(rocketPhysics); // 모든 프레임마다 실행
    };
};

const onRender = (scene: Scene) => {
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
};

export default function PhysicsVelocity() {
    return <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} />;
}
