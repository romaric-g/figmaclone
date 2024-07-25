
export type ValidKey = "shift" | "control" | 'backspace' | 'left' | 'right' | 'up' | 'down' | 'enter' | 'g' | 'c' | 'v' | 'y' | 'z'

const keyMap: { [key: string]: ValidKey } = {
    'ShiftLeft': 'shift',
    'ControlLeft': 'control',
    'Backspace': 'backspace',
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'Enter': 'enter',
    'KeyG': 'g',
    'KeyC': 'c',
    'KeyV': 'v',
    'KeyY': 'y',
    'KeyW': 'z'
};

type KeyState = {
    pressed: boolean;
    doubleTap: boolean;
    timestamp: number;
};

type KeysState = {
    [key in ValidKey]: KeyState;
};


export type KeyboardListener = ((type: "up" | "down") => void)

// Class for handling keyboard inputs.
export class KeyboardController {

    keys: KeysState
    listeners: { [key in ValidKey]: KeyboardListener[] };

    constructor() {
        const defaultKeyState: KeyState = { pressed: false, doubleTap: false, timestamp: 0 };
        const validKeys: ValidKey[] = ["shift", "control", "backspace", "left", "right", "up", "down", "enter", "g", "c", "v", "y", "z"];

        this.keys = Object.fromEntries(
            validKeys.map(key => [key, { ...defaultKeyState }])
        ) as KeysState;

        this.listeners = Object.fromEntries(
            validKeys.map(key => [key, [] as KeyboardListener[]])
        ) as { [key in ValidKey]: KeyboardListener[] };

        document.addEventListener('keydown', (event) => this.keydownHandler(event));
        document.addEventListener('keyup', (event) => this.keyupHandler(event));

        document.addEventListener('keydown', function (event) {
            if (event.ctrlKey && event.key === 'g') {
                event.preventDefault();
            }
        });
    }

    keydownHandler(event: KeyboardEvent) {
        if (!(event.code in keyMap)) {
            return
        }

        const key = keyMap[event.code]
        const now = Date.now();

        for (const listener of this.listeners[key]) {
            listener("down")
        }

        // If not already in the double-tap state, toggle the double tap state if the key was pressed twice within 300ms.
        this.keys[key].doubleTap = this.keys[key].doubleTap || now - this.keys[key].timestamp < 300;

        // Toggle on the key pressed state.
        this.keys[key].pressed = true;
    }

    keyupHandler(event: KeyboardEvent) {
        if (!(event.code in keyMap)) {
            return
        }

        const key = keyMap[event.code]
        const now = Date.now();

        for (const listener of this.listeners[key]) {
            listener("up")
        }

        // Reset the key pressed state.
        this.keys[key].pressed = false;

        // Reset double tap only if the key is in the double-tap state.
        if (this.keys[key].doubleTap) this.keys[key].doubleTap = false;
        // Otherwise, update the timestamp to track the time difference till the next potential key down.
        else this.keys[key].timestamp = now;
    }

    addListener(key: ValidKey, callback: (type: "up" | "down") => void) {
        this.listeners[key].push(callback)
    }

    removeListener(key: ValidKey, callback: (type: "up" | "down") => void) {
        const callbacks = this.listeners[key];
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1); // Supprimer la fonction de rappel
            }
        }
    }
}
