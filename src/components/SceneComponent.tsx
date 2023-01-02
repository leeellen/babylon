import React, { useEffect, useRef } from 'react';
import { Engine, EngineOptions, Scene, SceneOptions } from '@babylonjs/core';

type SceneComponentType = {
    antialias?: boolean;
    engineOptions?: EngineOptions;
    adaptToDeviceRatio?: boolean;
    sceneOptions?: SceneOptions;
    onRender: (scene: Scene, engine: Engine) => void;
    onSceneReady: (scene: Scene, engine: Engine, canvas?: HTMLCanvasElement) => void;
};
export default function SceneComponent({
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    onRender,
    onSceneReady,
    ...rest
}: SceneComponentType) {
    const reactCanvas = useRef(null);

    useEffect(() => {
        const { current: canvas } = reactCanvas;
        if (!canvas) return;

        const engine = new Engine(canvas, antialias, engineOptions, adaptToDeviceRatio);

        // 클래스를 작성하여 구현하는 방법도 있지만 해당 코드에서는 인라인 코드로 작성하였다.
        const loadingScreenDiv = document.getElementById('loadingScreen') as HTMLElement;

        // 로딩 생성자 함수
        function customLoadingScreen() {
            console.log('customLoadingScreen creation');
        }

        // 로딩 보이기
        customLoadingScreen.prototype.displayLoadingUI = function () {
            console.log('customLoadingScreen loading');
            loadingScreenDiv.style.background = 'rgb(255, 255, 255,0.6)';
        };

        // 로딩 숨기기
        customLoadingScreen.prototype.hideLoadingUI = function () {
            console.log('customLoadingScreen loaded');
            loadingScreenDiv.style.background = 'rgb(255, 255, 255,0)';

            setTimeout(() => {
                loadingScreenDiv.style.display = 'none';
            }, 0);
        };

        // @ts-ignore
        const loadingScreen = new customLoadingScreen(); // 로딩 생성자 함수를 이용하여 커스텀 로딩 스크린 인터페이스 생성
        engine.loadingScreen = loadingScreen; // 엔진의 로딩스크린 값을 커스텀로딩스크린으로 초기화

        engine.displayLoadingUI(); // 로딩 스크린 보이도록

        const scene = new Scene(engine, sceneOptions);

        if (scene.isReady()) {
            onSceneReady(scene, engine, canvas);
        } else {
            scene.onReadyObservable.addOnce((scene) => onSceneReady(scene, engine, canvas));
        }

        engine.runRenderLoop(() => {
            if (typeof onRender === 'function') onRender(scene, engine);
            scene.render();
        });

        const resize = () => {
            scene.getEngine().resize();
        };

        if (window) {
            window.addEventListener('resize', resize);
        }

        return () => {
            scene.getEngine().dispose();

            if (window) {
                window.removeEventListener('resize', resize);
            }
        };
    }, [antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady]);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <canvas ref={reactCanvas} {...rest} />
            <div
                id="loadingScreen"
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.5s ease-out',
                    top: 0,
                }}
            >
                <img src="assets/loading.gif" alt="loading" />
            </div>
        </div>
    );
}
