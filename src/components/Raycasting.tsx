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
} from '@babylonjs/core';
import '@babylonjs/loaders';
import * as CANNON from 'cannon';
import SceneComponent from './SceneComponent';

const sky = require('../assets/environment/sky.env');
const proto = require('../assets/models/Prototype_Level.glb');
const blueTexture = require('../assets/textures/blue.png');
const greenTexture = require('../assets/textures/green.png');
const orangeTexture = require('../assets/textures/orange.png');

let currentScene: Scene;
let camera: FreeCamera;
let ground: Mesh;
let splatters: PBRMaterial[];

const onSceneReady = (scene: Scene) => {
    currentScene = scene;

    createScene();
    createEnvironment();
    createTextures();
    createPickingRay();
    createPhysics();
};

const createScene = () => {
    const envTex = CubeTexture.CreateFromPrefilteredData(sky, currentScene);
    envTex.gammaSpace = false;
    envTex.rotationY = Math.PI / 2;
    currentScene.environmentTexture = envTex;
    currentScene.createDefaultSkybox(envTex, true, 1000, 0.25);

    camera = new FreeCamera('camera', new Vector3(0, 2, -5), currentScene);
    camera.attachControl();
    camera.minZ = -0.5;
};

const createEnvironment = async () => {
    await SceneLoader.ImportMeshAsync('', proto, '', currentScene);
};

const createPhysics = () => {
    currentScene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin(true, 10, CANNON));

    createImpostor();
};

const createImpostor = () => {
    ground = MeshBuilder.CreateGround('ground', {
        width: 40,
        height: 40,
    });
    ground.isVisible = false;
    ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 1 });

    const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 3 });
    const sphereMat = new PBRMaterial('sphereMat', currentScene);
    sphereMat.roughness = 1;

    sphere.position.y = 3;

    sphereMat.albedoColor = new Color3(1, 0.5, 0);
    sphere.material = sphereMat;

    sphere.physicsImpostor = new PhysicsImpostor(sphere, PhysicsImpostor.SphereImpostor, { mass: 20, friction: 1 });
};

const createTextures = () => {
    const blue = new PBRMaterial('blue', currentScene);
    const orange = new PBRMaterial('orange', currentScene);
    const green = new PBRMaterial('green', currentScene);

    blue.roughness = 1;
    orange.roughness = 1;
    green.roughness = 1;

    blue.albedoTexture = new Texture(blueTexture, currentScene);
    green.albedoTexture = new Texture(greenTexture, currentScene);
    orange.albedoTexture = new Texture(orangeTexture, currentScene);

    blue.albedoTexture.hasAlpha = true;
    orange.albedoTexture.hasAlpha = true;
    green.albedoTexture.hasAlpha = true;

    blue.zOffset = -0.25;
    orange.zOffset = -0.25;
    green.zOffset = -0.25;

    splatters = [blue, orange, green];
};

const createPickingRay = () => {
    // 포인터가 눌리면
    currentScene.onPointerDown = () => {
        const ray = currentScene.createPickingRay(
            currentScene.pointerX, // 현재 scene에서 pointer x 좌표
            currentScene.pointerY, // 현재 scene에서 pointer y 좌표
            Matrix.Identity(),
            camera,
        );

        const raycastHit = currentScene.pickWithRay(ray); // raycast로 선택된 데이터, pickWithRay로 가져올 수 있다.

        // 구체를 선택한 경우에만 실행
        if (raycastHit && raycastHit.hit && raycastHit?.pickedMesh?.name === 'sphere') {
            const decal = MeshBuilder.CreateDecal('decal', raycastHit.pickedMesh, {
                position: raycastHit.pickedPoint!,
                normal: raycastHit.getNormal(true)!,
                size: new Vector3(1, 1, 1),
            });

            decal.material = splatters[Math.floor(Math.random() * splatters.length)];

            decal.setParent(raycastHit.pickedMesh); // 부모로 설정하여 구체와 메터리얼을 묶어준다.

            raycastHit.pickedMesh.physicsImpostor!.applyImpulse(ray.direction.scale(5), raycastHit.pickedPoint!);
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
