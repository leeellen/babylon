import React, { useEffect, useRef } from 'react';
import { Engine, EngineOptions, Scene, SceneOptions } from '@babylonjs/core';

type SceneComponentType = {
    antialias?: boolean;
    engineOptions?: EngineOptions;
    adaptToDeviceRatio?: boolean;
    sceneOptions?: SceneOptions;
    onRender: (scene: Scene, engine: Engine) => void;
    onSceneReady: (scene: Scene, engine: Engine) => void;
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

        // const loadingScreenDiv = document.getElementById('loadingScreen') as HTMLElement;

        // function customLoadingScreen() {
        //     console.log('customLoadingScreen creation');
        // }
        // customLoadingScreen.prototype.displayLoadingUI = function () {
        //     console.log('customLoadingScreen loading');
        //     loadingScreenDiv.style.background = 'rgb(255, 255, 255,0.6)';
        // };
        // customLoadingScreen.prototype.hideLoadingUI = function () {
        //     console.log('customLoadingScreen loaded');
        //     loadingScreenDiv.style.background = 'rgb(255, 255, 255,0)';

        //     setTimeout(() => {
        //         loadingScreenDiv.style.display = 'none';
        //     }, 0);
        // };

        // // @ts-ignore
        // const loadingScreen = new customLoadingScreen();
        // engine.loadingScreen = loadingScreen;

        // engine.loadingScreen.displayLoadingUI();

        const scene = new Scene(engine, sceneOptions);

        if (scene.isReady()) {
            onSceneReady(scene, engine);
        } else {
            scene.onReadyObservable.addOnce((scene) => onSceneReady(scene, engine));
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
            {/* <div
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
            </div> */}
        </div>
    );
}
