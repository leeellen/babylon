import React, { useEffect } from 'react';
import { PBR } from '../BabylonExamples/PBR';
import '../styles/babylonExmaple.css';

export default function BabylonExmaple() {
    useEffect(() => {
        const canvas = document.querySelector('canvas');
        canvas && new PBR(canvas);
    }, []);

    return (
        <div>
            <canvas />
        </div>
    );
}
