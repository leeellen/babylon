import React, { useEffect } from 'react';
import { BasicScene } from '../BabylonExamples/BasicScene';
import '../styles/babylonExmaple.css';

export default function BabylonExmaple() {
    useEffect(() => {
        const canvas = document.querySelector('canvas');
        canvas && new BasicScene(canvas);
    }, []);

    return (
        <div>
            <h3>Babylon Examples</h3>
            <canvas />
        </div>
    );
}
