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
} from '@babylonjs/core';
import SceneComponent from './SceneComponent';

const onSceneReady = (scene: Scene) => {
    const camera = new FreeCamera('camera', new Vector3(0, 1, -5), scene);
    camera.attachControl();
    camera.speed = 0.25;

    const hemiLight = new HemisphericLight('hemiLight', new Vector3(0, 1, 0), scene);

    hemiLight.intensity = 1;

    const envTex = CubeTexture.CreateFromPrefilteredData('environment/sky.env', scene);

    scene.environmentTexture = envTex;
    scene.createDefaultSkybox(envTex, true);

    createEnvironment(scene);
    sound(scene);
};

const createEnvironment = (scene: Scene) => {
    const ground = MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene);

    const ball = MeshBuilder.CreateSphere('ball', { diameter: 1 }, scene);

    ball.position = new Vector3(0, 1, 0);

    ground.material = createAsphalt(scene);
    ball.material = CreateBallTexture(scene);
};

const sound = (scene: Scene) => {
    return new Sound('music', 'sound/music.mp3', scene, null, { loop: true, autoplay: true });
};

const createAsphalt = (scene: Scene) => {
    const pbr = new PBRMaterial('asphalt', scene);

    pbr.albedoTexture = new Texture('assets/textures/asphalt/asphalt_diff.jpg', scene);

    pbr.bumpTexture = new Texture('assets/textures/asphalt/asphalt_nor.jpg', scene);

    pbr.invertNormalMapX = true;
    pbr.invertNormalMapY = true;

    pbr.useAmbientOcclusionFromMetallicTextureRed = true;
    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallnessFromMetallicTextureBlue = true;

    pbr.metallicTexture = new Texture('./assets/textures/asphalt/asphalt_ao_rough_metal.jpg', scene);

    return pbr;
};

const CreateBallTexture = (scene: Scene) => {
    const pbr = new PBRMaterial('magic', scene);

    pbr.albedoTexture = new Texture('assets/textures/magic/magic_diff.jpg', scene);

    pbr.bumpTexture = new Texture('assets/textures/magic/magic_nor.jpg', scene);

    pbr.invertNormalMapX = true;
    pbr.invertNormalMapY = true;

    pbr.useAmbientOcclusionFromMetallicTextureRed = true;
    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallnessFromMetallicTextureBlue = true;

    pbr.metallicTexture = new Texture('assets/textures/magic/magic_ao_rough_metal.jpg', scene);

    // pbr.emissiveColor = new Color3(1, 1, 1);
    // pbr.emissiveTexture = new Texture('./assets/textures/magic/magic_ao_rough_metal.jpg', scene);
    // pbr.emissiveIntensity = 3;

    // const glowLayer = new GlowLayer('glow', scene);
    // glowLayer.intensity = 1;

    return pbr;
};

const onRender = (scene: Scene) => {
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
    // if (box !== undefined) {
    //     const deltaTimeInMillis = scene.getEngine().getDeltaTime();
    //     const rpm = 20;
    //     box.rotation.x += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    // }
};

export default function PBR() {
    return <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} />;
}
