import {
    Scene,
    Engine,
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    StandardMaterial,
    Texture,
} from '@babylonjs/core';

export class StandardMaterials {
    scene: Scene;
    engine: Engine;

    constructor(private canvas: HTMLCanvasElement) {
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
    CreateScene(): Scene {
        const scene = new Scene(this.engine);
        const camera = new FreeCamera('camera', new Vector3(0, 2, -5), this.scene);
        camera.attachControl();
        camera.speed = 0.25;

        const hemiLight = new HemisphericLight('hemiLight', new Vector3(0, 1, 0), this.scene);

        hemiLight.intensity = 1;

        const ground = MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, this.scene);

        const ball = MeshBuilder.CreateSphere('ball', { diameter: 1 }, this.scene);

        ball.position = new Vector3(0, 1, 0);

        ground.material = this.createGroundMaterial();
        ball.material = this.createBallMaterial();

        return scene;
    }

    /**
     * diffuse : 텍스처의 기본 이미지, ex) 벽돌 텍스처라면 실생활에서 볼 수 있는 진짜 벽돌 이미지
     * Bump : 검은색, 흰색으로 구성된 이미지로 텍스처의 양각, 음각을 표현
     * AO : 대부분 흰색으로 구성된 이미지로 텍스처의 그림자 부각, 대비 향상의 용도
     * specular : 대부분 검은색으로 구성된 이미지로 텍스처의 반사효과 표현
     */

    createGroundMaterial(): StandardMaterial {
        const groundMat = new StandardMaterial('ground', this.scene);
        const uvScale = 4;
        const textureArray: Texture[] = [];

        const diffTex = new Texture('./textures/stone/cobblestone_diff.jpg', this.scene);
        groundMat.diffuseTexture = diffTex;
        textureArray.push(diffTex);

        const normalTex = new Texture('./textures/stone/cobblestone_nor.jpg', this.scene);
        groundMat.bumpTexture = normalTex;
        textureArray.push(normalTex);

        const aoTex = new Texture('./textures/stone/cobblestone_ao.jpg', this.scene);
        groundMat.ambientTexture = aoTex;
        textureArray.push(aoTex);

        const specTex = new Texture('./textures/stone/cobblestone_spec.jpg', this.scene);
        groundMat.specularTexture = specTex;
        textureArray.push(specTex);

        textureArray.forEach((t) => {
            t.uScale = uvScale;
            t.vScale = uvScale;
        });

        return groundMat;
    }

    createBallMaterial(): StandardMaterial {
        const ballMat = new StandardMaterial('ball', this.scene);

        const uvScale = 1;
        const textureArray: Texture[] = [];

        const diffTex = new Texture('./textures/metal/metal_diff.jpg', this.scene);
        ballMat.diffuseTexture = diffTex;
        textureArray.push(diffTex);

        const normalTex = new Texture('./textures/metal/metal_nor.jpg', this.scene);
        ballMat.bumpTexture = normalTex;
        ballMat.invertNormalMapX = true;
        ballMat.invertNormalMapY = true;

        textureArray.push(normalTex);

        const aoTex = new Texture('./textures/metal/metal_ao.jpg', this.scene);
        ballMat.ambientTexture = aoTex;
        textureArray.push(aoTex);

        const specTex = new Texture('./textures/metal/metal_spec.jpg', this.scene);
        ballMat.specularTexture = specTex;
        ballMat.specularPower = 1;
        textureArray.push(specTex);

        textureArray.forEach((t) => {
            t.uScale = uvScale;
            t.vScale = uvScale;
        });

        return ballMat;
    }
}
