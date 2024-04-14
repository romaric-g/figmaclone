
type ValidKey = "shift" | "control"

const keyMap: { [key: string]: ValidKey } = {
    'ShiftLeft': 'shift',
    'ControlLeft': 'control'
};
type KeysState = {
    [key in ValidKey]: {
        pressed: boolean;
        doubleTap: boolean;
        timestamp: number;
    };
};

// Class for handling keyboard inputs.
export class KeyboardController {

    keys: KeysState

    constructor() {
        // The controller's state.
        this.keys = {
            'shift': { pressed: false, doubleTap: false, timestamp: 0 },
            'control': { pressed: false, doubleTap: false, timestamp: 0 },
        };

        // Register event listeners for keydown and keyup events.
        window.addEventListener('keydown', (event) => this.keydownHandler(event));
        window.addEventListener('keyup', (event) => this.keyupHandler(event));
    }

    keydownHandler(event: KeyboardEvent) {
        if (!(event.code in keyMap)) {
            return
        }

        const key = keyMap[event.code]
        const now = Date.now();

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

        // Reset the key pressed state.
        this.keys[key].pressed = false;

        // Reset double tap only if the key is in the double-tap state.
        if (this.keys[key].doubleTap) this.keys[key].doubleTap = false;
        // Otherwise, update the timestamp to track the time difference till the next potential key down.
        else this.keys[key].timestamp = now;
    }
}
