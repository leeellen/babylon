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
    SceneLoader,
} from '@babylonjs/core';
import '@babylonjs/loaders';
import SceneComponent from './SceneComponent';

const onSceneReady = (scene: Scene) => {
    const camera = new FreeCamera('camera', new Vector3(0, 0.75, -8), scene);
    camera.attachControl();
    camera.speed = 0.25;

    const envTex = CubeTexture.CreateFromPrefilteredData('environment/roof.env', scene);

    scene.environmentTexture = envTex;
    scene.createDefaultSkybox(envTex, true);

    scene.environmentIntensity = 0.5;

    // createGound(scene);
    // createBarrel(scene);
    createCamp(scene);
};

const createGound = (scene: Scene) => {
    const ground = MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene);
    ground.material = createAsphalt(scene);
};

const createAsphalt = (scene: Scene) => {
    const pbr = new PBRMaterial('asphalt', scene);

    pbr.albedoTexture = new Texture('textures/asphalt/asphalt_diff.jpg', scene);

    pbr.bumpTexture = new Texture('textures/asphalt/asphalt_nor.jpg', scene);

    pbr.invertNormalMapX = true;
    pbr.invertNormalMapY = true;

    pbr.useAmbientOcclusionFromMetallicTextureRed = true;
    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallnessFromMetallicTextureBlue = true;

    pbr.metallicTexture = new Texture('./textures/asphalt/asphalt_ao_rough_metal.jpg', scene);

    return pbr;
};

const createBarrel = async (scene: Scene) => {
    const { meshes } = await SceneLoader.ImportMeshAsync('', 'models/', 'barrel.glb', scene);
};

const createCamp = async (scene: Scene) => {
    const models = await SceneLoader.ImportMeshAsync('', 'models/', 'camp.glb', scene);
    models.meshes[0].position = new Vector3(-3, 0, 0);
};

const onRender = (scene: Scene) => {
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
};

export default function CustomModels() {
    return <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} />;
}
