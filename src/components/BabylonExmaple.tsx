import React, { useEffect } from 'react';
import { StandardMaterials } from '../BabylonExamples/StandardMaterials';
import '../styles/babylonExmaple.css';

export default function BabylonExmaple() {
    useEffect(() => {
        const canvas = document.querySelector('canvas');
        canvas && new StandardMaterials(canvas);
    }, []);

    return (
        <div>
            <h3>Babylon Examples</h3>
            <canvas />
        </div>
    );
}
