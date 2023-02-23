import {
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    Scene,
    SceneLoader,
    CannonJSPlugin,
    PhysicsImpostor,
    StandardMaterial,
    Color3,
    AbstractMesh,
} from '@babylonjs/core';
import '@babylonjs/loaders';
import * as CANNON from 'cannon';

import SceneComponent from './SceneComponent';

const proto = require('../assets/models/Prototype_Level.glb');

let currentScene: Scene;
let sphere: AbstractMesh;

const onSceneReady = (scene: Scene) => {
    currentScene = scene;

    new HemisphericLight('hemiLight', new Vector3(0, 1, 0), scene);

    const camera = new FreeCamera('camera', new Vector3(0, 10, -20), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl();
    camera.minZ = 0.5;

    currentScene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin(true, 10, CANNON));

    createEnvironment();
    createImposters();
    detectTrigger();
};

const createEnvironment = async () => {
    await SceneLoader.ImportMeshAsync('', proto, '', currentScene);
};

const createImposters = () => {
    /**
     * physicsImpostor option
     * mass: 요소의 움직임 정도 => 0: 움직이지 않음, 1: 움직임
     * restitution: 작용반작용 정도 => 0: 부딪혀도 반작용 없음, 1: 반작용 있음
     * friction : 마찰 정도
     */
    // const box = MeshBuilder.CreateBox('box', { size: 2 }, currentScene);
    // box.position = new Vector3(0, 3, 0);
    // box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, {
    //     mass: 1,
    //     restitution: 1,
    // });

    const ground = MeshBuilder.CreateGround('ground', { width: 40, height: 40 }, currentScene);
    ground.position.y = 0.25;
    ground.isVisible = false;
    ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: 1,
    });

    sphere = MeshBuilder.CreateSphere('sphere', { diameter: 2 }, currentScene);
    sphere.position = new Vector3(0, 8, 0);
    sphere.physicsImpostor = new PhysicsImpostor(sphere, PhysicsImpostor.SphereImpostor, {
        mass: 1,
        restitution: 1,
        friction: 1,
    });

    /**
     * registerOnPhysicsCollide => 다른 요소와 충돌할때 실행할 작업을 지정하는 매서드.
     * 1번째 인자: 충돌할 요소 또는 요소들의 배열
     * 2번째 인자: 충돌 시 실행할 작업
     */
    // box.physicsImpostor.registerOnPhysicsCollide(sphere.physicsImpostor, detectCollisions);

    // sphere.physicsImpostor.registerOnPhysicsCollide(box.physicsImpostor, detectCollisions); // 구체가 박스에 충돌하면 detectCollisions 실행

    // sphere.physicsImpostor.unregisterOnPhysicsCollide(ground.physicsImpostor, detectCollisions); // 구체가 ground 요소에 충돌하면 detectCollisions 실행하던 트리거를 제거
};

const detectCollisions = (boxCol: PhysicsImpostor, colAgainsst: any) => {
    const redMat = new StandardMaterial('mat', currentScene);
    redMat.diffuseColor = new Color3(1, 0, 0);

    // 물리법칙이 적용된 요소의 변경할때에는 적용한 물리값 또한 수정되어야한다.
    // boxCol.object.scaling = new Vector3(3, 3, 3);
    // boxCol.setScalingUpdated();

    (colAgainsst.object as AbstractMesh).material = redMat;
};

// const detectGroundCollision =(collider: PhysicsImpostor, collidedAgainst: PhysicsImpostor | PhysicsImpostor[])=>{
//     const whiteMat = new StandardMaterial('mat', currentScene);
//     whiteMat.diffuseColor = new Color3(0, 0, 0);

//     if(collidedAgainst?.length )
//     (collidedAgainst.object as AbstractMesh).material = whiteMat;

// }

const detectTrigger = () => {
    const box = MeshBuilder.CreateBox('box', { width: 4, height: 1, depth: 4 }, currentScene);
    box.position.y = 0.5;
    box.visibility = 0.25;

    let counter = 0;

    currentScene.registerBeforeRender(() => {
        if (box.intersectsMesh(sphere)) counter++;

        if (counter === 1) console.log('Entered trigger');
    });
};

const onRender = (scene: Scene) => {
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
};

export default function CollisionsAndTriggers() {
    return <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} />;
}
