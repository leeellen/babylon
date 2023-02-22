import {
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    Scene,
    SceneLoader,
    CannonJSPlugin,
    PhysicsImpostor,
} from '@babylonjs/core';
import '@babylonjs/loaders';
import * as CANNON from 'cannon';

import SceneComponent from './SceneComponent';

const proto = require('../assets/models/Prototype_Level.glb');

let currentScene: Scene;

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
};

const createEnvironment = async () => {
    await SceneLoader.ImportMeshAsync('', proto, '', currentScene);
};

const createImposters = () => {
    const box = MeshBuilder.CreateBox('box', { size: 2 }, currentScene);
    box.position = new Vector3(0, 10, 1);
    box.rotation = new Vector3(Math.PI / 4, 0, 0);
    box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, {
        mass: 1,
        restitution: 0.75,
    });

    const ground = MeshBuilder.CreateGround('ground', { width: 40, height: 40 }, currentScene);
    ground.isVisible = false;
    ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: 0.5,
    });

    const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 3 }, currentScene);
    sphere.position = new Vector3(0, 6, 0);
    sphere.physicsImpostor = new PhysicsImpostor(sphere, PhysicsImpostor.SphereImpostor, {
        mass: 1,
        restitution: 0.8,
    });
};

const onRender = (scene: Scene) => {
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
};

export default function PhysicsImposter() {
    return <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} />;
}
