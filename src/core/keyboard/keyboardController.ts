
export type ValidKey = "shift" | "control" | 'backspace' | 'left' | 'right' | 'up' | 'down' | 'enter' | 'g' | 'c' | 'v' | 'y' | 'z' | 'a'

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
    'KeyW': 'z',
    'KeyQ': 'a'
};

type KeyState = {
    pressed: boolean;
    doubleTap: boolean;
    timestamp: number;
};

type KeysState = {
    [key in ValidKey]: KeyState;
};


export type KeyboardKeyListener = ((type: "up" | "down") => void)

export type KeyboardEventListener = (event: KeyboardEvent, type: "up" | "down") => void

// Class for handling keyboard inputs.
export class KeyboardController {

    keys: KeysState
    keyListeners: { [key in ValidKey]: KeyboardKeyListener[] };
    eventListeners: KeyboardEventListener[] = []

    constructor() {
        const defaultKeyState: KeyState = { pressed: false, doubleTap: false, timestamp: 0 };
        const validKeys: ValidKey[] = ["shift", "control", "backspace", "left", "right", "up", "down", "enter", "g", "c", "v", "y", "z", 'a'];

        this.keys = Object.fromEntries(
            validKeys.map(key => [key, { ...defaultKeyState }])
        ) as KeysState;

        this.keyListeners = Object.fromEntries(
            validKeys.map(key => [key, [] as KeyboardKeyListener[]])
        ) as { [key in ValidKey]: KeyboardKeyListener[] };

        document.addEventListener('keydown', (event) => this.keydownHandler(event));
        document.addEventListener('keyup', (event) => this.keyupHandler(event));

        document.addEventListener('keydown', function (event) {
            if (event.ctrlKey && event.key === 'g') {
                event.preventDefault();
            }
        });
    }

    keydownHandler(event: KeyboardEvent) {
        for (const eventListener of this.eventListeners) {
            eventListener(event, "down")
        }

        if (!(event.code in keyMap)) {
            return
        }

        const key = keyMap[event.code]
        const now = Date.now();

        for (const listener of this.keyListeners[key]) {
            listener("down")
        }

        // If not already in the double-tap state, toggle the double tap state if the key was pressed twice within 300ms.
        this.keys[key].doubleTap = this.keys[key].doubleTap || now - this.keys[key].timestamp < 300;

        // Toggle on the key pressed state.
        this.keys[key].pressed = true;
    }

    keyupHandler(event: KeyboardEvent) {
        for (const eventListener of this.eventListeners) {
            eventListener(event, "up")
        }

        if (!(event.code in keyMap)) {
            return
        }

        const key = keyMap[event.code]
        const now = Date.now();

        for (const listener of this.keyListeners[key]) {
            listener("up")
        }

        // Reset the key pressed state.
        this.keys[key].pressed = false;

        // Reset double tap only if the key is in the double-tap state.
        if (this.keys[key].doubleTap) this.keys[key].doubleTap = false;
        // Otherwise, update the timestamp to track the time difference till the next potential key down.
        else this.keys[key].timestamp = now;
    }

    addKeyListener(key: ValidKey, callback: (type: "up" | "down") => void) {
        this.keyListeners[key].push(callback)
    }

    removeKeyListener(key: ValidKey, callback: (type: "up" | "down") => void) {
        const callbacks = this.keyListeners[key];
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1); // Supprimer la fonction de rappel
            }
        }
    }

    addEventListener(listener: KeyboardEventListener) {
        this.eventListeners.push(listener)
    }

    removeEventListener(listener: KeyboardEventListener) {
        const index = this.eventListeners.indexOf(listener);
        if (index !== -1) {
            this.eventListeners.splice(index, 1);
        }
    }
}
