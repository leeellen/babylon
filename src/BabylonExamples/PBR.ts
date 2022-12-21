/**
 * Babylon 101 Part3 - Physically Based Rendering
 * https://www.youtube.com/watch?v=eCdj3JiPF10&t=55s
 *
 */

import {
    Scene,
    Engine,
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    CubeTexture,
    PBRMaterial,
    Texture,
    GlowLayer,
    Color3,
} from '@babylonjs/core';

export class PBR {
    scene: Scene;
    engine: Engine;

    constructor(private canvas: HTMLCanvasElement) {
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();

        this.CreateEnvironment();

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    CreateScene(): Scene {
        const scene = new Scene(this.engine);

        const camera = new FreeCamera('camera', new Vector3(0, 1, -5), this.scene);
        camera.attachControl();
        camera.speed = 0.25;

        const hemiLight = new HemisphericLight('hemiLight', new Vector3(0, 1, 0), this.scene);

        hemiLight.intensity = 1;

        const envTex = CubeTexture.CreateFromPrefilteredData('./environment/sky.env', scene);

        scene.environmentTexture = envTex;
        scene.createDefaultSkybox(envTex, true);

        return scene;
    }

    CreateEnvironment(): void {
        const ground = MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, this.scene);

        const ball = MeshBuilder.CreateSphere('ball', { diameter: 1 }, this.scene);

        ball.position = new Vector3(0, 1, 0);

        ground.material = this.CreateAsphalt();
        ball.material = this.CreateMagic();
    }

    CreateAsphalt(): PBRMaterial {
        const pbr = new PBRMaterial('asphalt', this.scene);

        pbr.albedoTexture = new Texture('./textures/asphalt/asphalt_diff.jpg', this.scene);

        pbr.bumpTexture = new Texture('./textures/asphalt/asphalt_nor.jpg', this.scene);

        pbr.invertNormalMapX = true;
        pbr.invertNormalMapY = true;

        pbr.useAmbientOcclusionFromMetallicTextureRed = true;
        pbr.useRoughnessFromMetallicTextureGreen = true;
        pbr.useMetallnessFromMetallicTextureBlue = true;

        pbr.metallicTexture = new Texture('./textures/asphalt/asphalt_ao_rough_metal.jpg', this.scene);

        return pbr;
    }

    CreateMagic(): PBRMaterial {
        const pbr = new PBRMaterial('magic', this.scene);

        pbr.albedoTexture = new Texture('./textures/magic/magic_diff.jpg', this.scene);

        pbr.bumpTexture = new Texture('./textures/magic/magic_nor.jpg', this.scene);

        pbr.invertNormalMapX = true;
        pbr.invertNormalMapY = true;

        pbr.useAmbientOcclusionFromMetallicTextureRed = true;
        pbr.useRoughnessFromMetallicTextureGreen = true;
        pbr.useMetallnessFromMetallicTextureBlue = true;

        pbr.metallicTexture = new Texture('./textures/magic/magic_ao_rough_metal.jpg', this.scene);

        // pbr.emissiveColor = new Color3(1, 1, 1);
        // pbr.emissiveTexture = new Texture('./textures/magic/magic_ao_rough_metal.jpg', this.scene);
        // pbr.emissiveIntensity = 3;

        // const glowLayer = new GlowLayer('glow', this.scene);
        // glowLayer.intensity = 1;

        return pbr;
    }
}
