import {
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    Scene,
    CubeTexture,
    Sound,
    Texture,
    PBRMaterial,
    Engine,
    Color3,
    SceneLoader,
    AbstractMesh,
    ActionManager,
    InterpolateValueAction,
    SetValueAction,
    IncrementValueAction,
} from '@babylonjs/core';
import '@babylonjs/loaders';
import SceneComponent from './SceneComponent';

let currentEngine: Engine;
let currentScene: Scene;
let cube: AbstractMesh;
let sphere: AbstractMesh;
let cylinder: AbstractMesh;
let sphereMat: PBRMaterial;

const onSceneReady = (scene: Scene, engine: Engine) => {
    currentEngine = engine;
    currentScene = scene;

    createEnvironment();
    createMeshes();
};

const createEnvironment = () => {
    new FreeCamera('camera', new Vector3(0, 0, -10), currentScene);

    const envTex = CubeTexture.CreateFromPrefilteredData('assets/environment/christmas.env', currentScene);
    currentScene.environmentTexture = envTex;
    currentScene.createDefaultSkybox(envTex, true, 1000, 0.2, true);
    currentScene.environmentIntensity = 1.5;
};

const createMeshes = async () => {
    sphereMat = new PBRMaterial('sphereMat', currentScene);
    sphereMat.albedoColor = new Color3(1, 0, 0);
    sphereMat.roughness = 1;

    const { meshes } = await SceneLoader.ImportMeshAsync('', 'assets/models/', 'gifts.glb', currentScene);

    cube = meshes[1];
    sphere = meshes[2];
    sphere.material = sphereMat;
    cylinder = meshes[3];
    cylinder.rotation = new Vector3(-Math.PI / 4, 0, 0);

    createActions();

    currentEngine.hideLoadingUI();
};

const createActions = async () => {
    cube.actionManager = new ActionManager(currentScene);

    // 박스를 클릭하면 1.5배 크기 커지도록
    cube.actionManager.registerAction(
        new SetValueAction(ActionManager.OnPickDownTrigger, cube, 'scaling', new Vector3(1.5, 1.5, 1.5)),
    );

    sphere.actionManager = new ActionManager(currentScene);
    // 구를 클릭하면 3000ms 시간동안 roughness 1 => 0으로 변환, roughness 설정은 sphereMat에 설정했으니 target 또한 sphere가 아닌 sphereMat
    sphere.actionManager
        .registerAction(new InterpolateValueAction(ActionManager.OnPickDownTrigger, sphereMat, 'roughness', 0, 3000))
        ?.then(new InterpolateValueAction(ActionManager.NothingTrigger, sphereMat, 'roughness', 1, 1000));

    currentScene.actionManager = new ActionManager(currentScene);

    currentScene.actionManager.registerAction(
        // IncrementValueAction => 조건이 트리거되면, value 파라미터만큼 계속해서 증가하는 액션 아래 코드에서는 모든 프레임이 트리거이므로 모든 프레임마다 rotation.x 값을 0.01씩 증가
        new IncrementValueAction(ActionManager.OnEveryFrameTrigger, cylinder, 'rotation.x', 0.01),
    );
};

const onRender = () => {
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
};

export default function MeshActions() {
    return <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} />;
}
