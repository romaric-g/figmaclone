import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './ui/app';


async function main() {


    const domElement = document.getElementById('app')

    if (domElement) {
        const root = ReactDOM.createRoot(domElement);

        root.render(<App />);
    }
}

main()