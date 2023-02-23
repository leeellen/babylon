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
    Mesh,
    PBRMaterial,
    Color3,
    ActionManager,
    ExecuteCodeAction,
} from '@babylonjs/core';
import '@babylonjs/loaders';
import * as CANNON from 'cannon';
import SceneComponent from './SceneComponent';

const sky = require('../assets/environment/sky.env');
const proto = require('../assets/models/Prototype_Level.glb');
const rocket = require('../assets/models/toon_rocket.glb');

let currentScene: Scene;
let camera: FreeCamera;
let ground: Mesh;
let cannonball: Mesh;

const onSceneReady = (scene: Scene) => {
    currentScene = scene;

    createScene();
    createEnvironment();
    createPhysics();

    currentScene.onPointerDown = (e) => {
        if (e.button === 2) shootCannonball();
    };
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
    // createImpulse();
    // createCannonball();
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

const createImpulse = () => {
    const box = MeshBuilder.CreateBox('box', { height: 4 }); // create box mesh
    const boxMat = new PBRMaterial('boxMat', currentScene); // box pbr material

    boxMat.roughness = 1;
    box.position.y = 3;
    boxMat.albedoColor = new Color3(1, 0.5, 0);
    box.material = boxMat;

    // physics set up
    box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 0.5, friction: 1 });

    box.actionManager = new ActionManager(currentScene);

    /**
     * registerAction : 액션 등록
     * ExecuteCodeAction : 트리거된 코드(외부 이벤트)를 실행하는 작업을 정의합니다.
     *  */
    box.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickDownTrigger, () => {
            if (!box.physicsImpostor) return;

            // 박스에 커서 다운(OnPickDown) 시 가해질 힘 설정
            box.physicsImpostor.applyImpulse(
                new Vector3(-3, 0, 1),
                box.getAbsolutePosition().add(new Vector3(0, 2, 0)),
            );
        }),
    );
};

const createCannonball = () => {
    cannonball = MeshBuilder.CreateSphere('cannonball', { diameter: 0.5 });
    const ballMat = new PBRMaterial('ballMat', currentScene);
    ballMat.roughness = 1;
    ballMat.albedoColor = new Color3(0, 1, 0);

    cannonball.material = ballMat;

    // 물리법칙 적용
    cannonball.physicsImpostor = new PhysicsImpostor(cannonball, PhysicsImpostor.SphereImpostor, {
        mass: 1,
        friction: 1,
    });

    cannonball.position = camera.position; // 카메라 위치로 지정
    cannonball.setEnabled(false); // 보이지 않게
};

const shootCannonball = () => {
    const clone = cannonball.clone('clone'); // 공 복사

    if (clone.physicsImpostor && ground.physicsImpostor) {
        clone.position = camera.position; // 카메라와 동일한 위치로 지정하고

        clone.setEnabled(true); // 보이도록

        clone.physicsImpostor.applyForce(camera.getForwardRay().direction.scale(1000), clone.getAbsolutePosition());

        clone.physicsImpostor.registerOnPhysicsCollide(ground.physicsImpostor, () => {
            setTimeout(() => {
                clone.dispose();
            }, 3000);
        });
    }
};

const onRender = (scene: Scene) => {
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
};

export default function Raycasting() {
    return <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} />;
}
