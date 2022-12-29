import { FreeCamera, Vector3, HemisphericLight, MeshBuilder, Scene, Texture, StandardMaterial } from '@babylonjs/core';
import SceneComponent from './SceneComponent';

const onSceneReady = (scene: Scene) => {
    const camera = new FreeCamera('camera', new Vector3(0, 2, -5), scene);
    camera.attachControl();
    camera.speed = 0.25;

    const hemiLight = new HemisphericLight('hemiLight', new Vector3(0, 1, 0), scene);
    hemiLight.intensity = 1;

    const ground = MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene);
    ground.material = createGroundMaterial(scene);

    const ball = MeshBuilder.CreateSphere('ball', { diameter: 1 }, scene);
    ball.position = new Vector3(0, 1, 0);
    ball.material = createBallMaterial(scene);
};

/**
 * diffuse : 텍스처의 기본 이미지, ex) 벽돌 텍스처라면 실생활에서 볼 수 있는 진짜 벽돌 이미지
 * Bump : 검은색, 흰색으로 구성된 이미지로 텍스처의 양각, 음각을 표현
 * AO : 대부분 흰색으로 구성된 이미지로 텍스처의 그림자 부각, 대비 향상의 용도
 * specular : 대부분 검은색으로 구성된 이미지로 텍스처의 반사효과 표현
 */

const createGroundMaterial = (scene: Scene) => {
    const groundMat = new StandardMaterial('ground', scene);
    const uvScale = 4;
    const textureArray: Texture[] = [];

    const diffTex = new Texture('assets/textures/stone/cobblestone_diff.jpg', scene);
    groundMat.diffuseTexture = diffTex;
    textureArray.push(diffTex);

    const normalTex = new Texture('assets/textures/stone/cobblestone_nor.jpg', scene);
    groundMat.bumpTexture = normalTex;
    textureArray.push(normalTex);

    const aoTex = new Texture('assets/textures/stone/cobblestone_ao.jpg', scene);
    groundMat.ambientTexture = aoTex;
    textureArray.push(aoTex);

    const specTex = new Texture('assets/textures/stone/cobblestone_spec.jpg', scene);
    groundMat.specularTexture = specTex;
    textureArray.push(specTex);

    textureArray.forEach((t) => {
        t.uScale = uvScale;
        t.vScale = uvScale;
    });

    return groundMat;
};

const createBallMaterial = (scene: Scene) => {
    const ballMat = new StandardMaterial('ball', scene);

    const uvScale = 1;
    const textureArray: Texture[] = [];

    const diffTex = new Texture('assets/textures/metal/metal_diff.jpg', scene);
    ballMat.diffuseTexture = diffTex;
    textureArray.push(diffTex);

    const normalTex = new Texture('assets/textures/metal/metal_nor.jpg', scene);
    ballMat.bumpTexture = normalTex;
    ballMat.invertNormalMapX = true;
    ballMat.invertNormalMapY = true;

    textureArray.push(normalTex);

    const aoTex = new Texture('assets/textures/metal/metal_ao.jpg', scene);
    ballMat.ambientTexture = aoTex;
    textureArray.push(aoTex);

    const specTex = new Texture('assets/textures/metal/metal_spec.jpg', scene);
    ballMat.specularTexture = specTex;
    ballMat.specularPower = 1;
    textureArray.push(specTex);

    textureArray.forEach((t) => {
        t.uScale = uvScale;
        t.vScale = uvScale;
    });

    return ballMat;
};

const onRender = (scene: Scene) => {
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
};

export default function StandardMaterials() {
    return <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} />;
}
