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
    const camera = new FreeCamera('camera', new Vector3(0, 2, -8), scene);
    camera.attachControl();
    camera.speed = 0.25;
};

const createEnvironment = async (scene: Scene) => {
    const { meshes } = await SceneLoader.ImportMeshAsync('', 'models/', 'LightingScene.glb', scene);

    models = meshes;
    lightTubes = meshes.filter((m) => m.name === 'lightTube_left' || m.name === 'lightTube_right');

    ball = MeshBuilder.CreateSphere('ball', { diameter: 0.5 }, scene);
    ball.position = new Vector3(0, 1, -1);

    const glowLayer = new GlowLayer('glowLayer', scene);
    glowLayer.intensity = 0.75;

    createLight(scene);
};

const createLight = (scene: Scene) => {
    // @hemiLight
    // const hemiLight = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
    // hemiLight.diffuse = new Color3(1, 0, 0);
    // hemiLight.specular = new Color3(0, 1, 0);
    // hemiLight.groundColor = new Color3(0, 0, 1);

    // @directionalLight
    // const directionalLight = new DirectionalLight('directionalLight', new Vector3(0, -1, 0), scene);

    // @pointLight
    const pointLight = new PointLight('pointLight', new Vector3(0, 1, 0), scene);
    pointLight.diffuse = new Color3(172 / 255, 246 / 255, 250 / 255); // new color3의 rgb값 범위는 0~1 사이이므로 보통의 rgb 값을 적용하기 위해서는 255로 나눈 값을 사용
    pointLight.intensity = 0.25;

    const pointClone = pointLight.clone('pointClone') as PointLight;

    // lightTubes의 부모로 포인트라이트를 설정히여 lightTube가 빛나는 효과
    pointLight.parent = lightTubes[0];
    pointClone.parent = lightTubes[1];

    // @spotLight
    const spotLight = new SpotLight('spotLight', new Vector3(0, 0.5, -3), new Vector3(0, 1, 3), Math.PI / 2, 10, scene);
    spotLight.intensity = 100; // 밝기

    spotLight.shadowEnabled = true;
    spotLight.shadowMinZ = 1;
    spotLight.shadowMaxZ = 10;

    const shadowGen = new ShadowGenerator(1024 * 2, spotLight);
    shadowGen.useBlurCloseExponentialShadowMap = true;

    ball.receiveShadows = true;
    shadowGen.addShadowCaster(ball);

    models.map((m) => {
        m.receiveShadows = true;
        shadowGen.addShadowCaster(m);
    });

    createGizmos(scene, spotLight);
};

const createGizmos = (scene: Scene, customLight: Light) => {
    const lightGizmo = new LightGizmo();
    lightGizmo.scaleRatio = 2;
    lightGizmo.light = customLight;

    const gizmoManager = new GizmoManager(scene);
    gizmoManager.positionGizmoEnabled = true;
    gizmoManager.rotationGizmoEnabled = true;
    gizmoManager.usePointerToAttachGizmos = false;
    gizmoManager.attachToMesh(lightGizmo.attachedMesh);
};

const onRender = (scene: Scene) => {
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
};

export default function LightShadow() {
    return <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} />;
}
