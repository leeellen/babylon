import {
    FreeCamera,
    Vector3,
    Scene,
    SceneLoader,
    MeshBuilder,
    GlowLayer,
    Light,
    LightGizmo,
    GizmoManager,
    HemisphericLight,
    Color3,
    DirectionalLight,
    PointLight,
    AbstractMesh,
    SpotLight,
    ShadowGenerator,
} from '@babylonjs/core';
import '@babylonjs/loaders';
import SceneComponent from './SceneComponent';

let models: AbstractMesh[] = [];
let lightTubes: AbstractMesh[] = [];
let ball: AbstractMesh;

const onSceneReady = (scene: Scene) => {
    createCamera(scene);
    createEnvironment(scene);
};

const createCamera = (scene: Scene) => {
    const camera = new FreeCamera('camera', new Vector3(0, 1, -5), scene);
    camera.attachControl();
    camera.speed = 0.1;
    camera.minZ = 0.01;
};

const createEnvironment = async (scene: Scene) => {
    const { meshes } = await SceneLoader.ImportMeshAsync('', 'models/', 'bust_demo.glb', scene);
};

const onRender = (scene: Scene) => {
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
};

export default function BakedLighting() {
    return <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} />;
}
