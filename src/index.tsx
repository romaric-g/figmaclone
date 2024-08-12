import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './ui/app';
import { Assets } from 'pixi.js';


async function main() {

    await Assets.load('https://pixijs.com/assets/bitmap-font/desyrel.xml');

    const domElement = document.getElementById('app')

    if (domElement) {
        const root = ReactDOM.createRoot(domElement);

        root.render(<App />);
    }
}

main()