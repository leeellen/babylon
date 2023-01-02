import {
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    Scene,
    CubeTexture,
    Texture,
    PBRMaterial,
    Color3,
    GlowLayer,
} from '@babylonjs/core';
import SceneComponent from './SceneComponent';

let currentScene: Scene;

const onSceneReady = (scene: Scene) => {
    currentScene = scene;

    const camera = new FreeCamera('camera', new Vector3(0, 1, -5), currentScene);
    camera.attachControl();
    camera.speed = 0.25;

    const hemiLight = new HemisphericLight('hemiLight', new Vector3(0, 1, 0), currentScene);
    hemiLight.intensity = 1;

    const envTex = CubeTexture.CreateFromPrefilteredData('assets/environment/sky.env', currentScene);
    currentScene.environmentTexture = envTex;
    currentScene.createDefaultSkybox(envTex, true);

    createEnvironment();
};

const createEnvironment = () => {
    const ground = MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, currentScene);
    ground.material = createAsphalt();

    const ball = MeshBuilder.CreateSphere('ball', { diameter: 1 }, currentScene);
    ball.position = new Vector3(0, 1, 0);
    ball.material = CreateBallTexture();
};

const createAsphalt = () => {
    const pbr = new PBRMaterial('asphalt', currentScene);

    pbr.albedoTexture = new Texture('assets/textures/asphalt/asphalt_diff.jpg', currentScene);
    pbr.bumpTexture = new Texture('assets/textures/asphalt/asphalt_nor.jpg', currentScene);
    pbr.invertNormalMapX = true;
    pbr.invertNormalMapY = true;
    pbr.useAmbientOcclusionFromMetallicTextureRed = true;
    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallnessFromMetallicTextureBlue = true;
    pbr.metallicTexture = new Texture('assets/textures/asphalt/asphalt_ao_rough_metal.jpg', currentScene);

    return pbr;
};

const CreateBallTexture = () => {
    const pbr = new PBRMaterial('denim', currentScene);

    pbr.albedoTexture = new Texture('assets/textures/denim/denim_diff.jpeg', currentScene);
    pbr.bumpTexture = new Texture('assets/textures/denim/denim_nor.jpeg', currentScene);
    pbr.invertNormalMapX = true;
    pbr.invertNormalMapY = true;
    pbr.useAmbientOcclusionFromMetallicTextureRed = true;
    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallnessFromMetallicTextureBlue = true;
    pbr.metallicTexture = new Texture('assets/textures/denim/denim_ao_rough_metal.jpeg', currentScene);

    // pbr.emissiveColor = new Color3(1, 1, 1);
    // pbr.emissiveTexture = new Texture('assets/textures/denim/denim_ao_rough_metal.jpeg', currentScene);
    // pbr.emissiveIntensity = 3;

    // const glowLayer = new GlowLayer('glow', currentScene);
    // glowLayer.intensity = 1;

    return pbr;
};

const onRender = (scene: Scene) => {
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
};

export default function PBR() {
    return <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} />;
}
