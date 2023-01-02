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

let currentScene: Scene;
let models: AbstractMesh[] = [];
let lightTubes: AbstractMesh[] = [];
let ball: AbstractMesh;

const onSceneReady = (scene: Scene) => {
    currentScene = scene;

    createCamera();
    createEnvironment();
};

const createCamera = () => {
    const camera = new FreeCamera('camera', new Vector3(0, 2, -8), currentScene);
    camera.attachControl();
    camera.speed = 0.25;
};

const createEnvironment = async () => {
    const { meshes } = await SceneLoader.ImportMeshAsync('', 'assets/models/', 'LightingScene.glb', currentScene);

    models = meshes;
    lightTubes = meshes.filter((m) => m.name === 'lightTube_left' || m.name === 'lightTube_right');

    ball = MeshBuilder.CreateSphere('ball', { diameter: 0.5 }, currentScene);
    ball.position = new Vector3(0, 1, -1);

    const glowLayer = new GlowLayer('glowLayer', currentScene);
    glowLayer.intensity = 0.75;

    createLight();
};

const createLight = () => {
    // @hemiLight 기본 반구형 조명 효과
    // const hemiLight = new HemisphericLight('light', new Vector3(0, 1, 0), currentScene);

    // // 기본 빛 색상 설정, Color3의 인자는 0~1 범위이기 때문에 기존에 사용하는 rgb 값을 적용하기 위해서는 rgb값의 최대치인 255로 나눈 값을 넣어준다.
    // hemiLight.diffuse = new Color3(255 / 255, 186 / 255, 186 / 255);
    // // 하이라이트 색상 설정, 가장 밝은 하이라이트 부분의 색상을 설정
    // hemiLight.specular = new Color3(0, 1, 0);
    // // 빛 방향의 반대방향의 색상을 설정 ex) 빛 방향이 위에서 아래로 설정되어 있다면, groundColor는 아래서 위로 오는 빛의 색을 설정하는 것
    // hemiLight.groundColor = new Color3(0, 0, 1);

    // @directionalLight 지정한 방향으로 무한한 일직선의 빛 효과
    // const directionalLight = new DirectionalLight('directionalLight', new Vector3(0, -2, 0), currentScene);

    // @pointLight 전구와 같은 빛 효과, 특정 지점을 기준으로 빛이 퍼진다.
    // const pointLight = new PointLight('pointLight', new Vector3(0, 1, 0), currentScene);
    // pointLight.diffuse = new Color3(172 / 255, 246 / 255, 250 / 255); // new color3의 rgb값 범위는 0~1 사이이므로 보통의 rgb 값을 적용하기 위해서는 255로 나눈 값을 사용
    // pointLight.intensity = 0.25;
    // const pointClone = pointLight.clone('pointClone') as PointLight;

    // // lightTubes의 부모로 포인트라이트를 설정히여 lightTube가 빛나는 효과
    // pointLight.parent = lightTubes[0];
    // pointClone.parent = lightTubes[1];

    // @spotLight 설정값을 기준으로 퍼져나가는 빛 효과
    const spotLight = new SpotLight(
        'spotLight',
        new Vector3(0, 0.5, -3),
        new Vector3(0, 1, 3),
        Math.PI / 2,
        10,
        currentScene,
    );
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

    createGizmos(spotLight);
};

// 빛 조정 UI를 보여주는 함수
const createGizmos = (customLight: Light) => {
    const lightGizmo = new LightGizmo();
    lightGizmo.scaleRatio = 2;
    lightGizmo.light = customLight;

    const gizmoManager = new GizmoManager(currentScene);
    gizmoManager.positionGizmoEnabled = true;
    gizmoManager.rotationGizmoEnabled = true;
    gizmoManager.usePointerToAttachGizmos = false;
    gizmoManager.attachToMesh(lightGizmo.attachedMesh);
};

const onRender = () => {
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
};

export default function LightShadow() {
    return <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} />;
}
