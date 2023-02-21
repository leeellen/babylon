import { FreeCamera, Vector3, HemisphericLight, MeshBuilder, Scene } from '@babylonjs/core';
import SceneComponent from './SceneComponent';

const onSceneReady = (scene: Scene) => {
    const camera = new FreeCamera('camera', new Vector3(0, 1, -5), scene);
    camera.attachControl();

    const hemiLight = new HemisphericLight('hemiLight', new Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.5;

    MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene);

    const ball = MeshBuilder.CreateSphere('ball', { diameter: 1 }, scene);
    ball.position = new Vector3(0, 1, 0);
};

const onRender = (scene: Scene) => {
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
};

export default function BasicScene() {
    return <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} />;
}
