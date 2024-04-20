import React from "react";
import "./selectionInput.scss";
import { Editor } from "../../core/editor";

interface Props {
    value: number | "mixed",
    label: string,
    setValue: (value: number) => void
}

const SelectionInput: React.FC<Props> = ({ value, label, setValue }) => {

    const ref = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {

        const confirmValue = () => {
            if (ref.current) {
                const currentValue = ref.current.value

                if (Number(currentValue) || Number(currentValue) == 0) {
                    const currentNumber = Number(currentValue)

                    setValue(currentNumber)
                } else {
                    ref.current.value = value.toString()
                }

                ref.current.blur()
            }

        }

        const focusOut = () => {
            confirmValue()
        }

        const enterKeyPress = (type: "up" | "down") => {
            if (type == "down") {
                confirmValue()
            }
        }

        if (ref.current) {
            ref.current.addEventListener("focusout", focusOut);

            Editor.getEditor().keyboardController.addListener('enter', enterKeyPress)
        }

        return () => {
            ref.current?.removeEventListener("focusout", focusOut)

            Editor.getEditor().keyboardController.removeListener('enter', enterKeyPress)
        }

    }, [value])

    React.useEffect(() => {
        if (ref.current) {
            ref.current.value = value.toString()
        }
    }, [value])

    const onFocus = React.useCallback((event: React.FocusEvent<HTMLInputElement, Element>) => {
        if (ref.current) {
            console.log("OKOK")
            ref.current.select()
        }
    }, [])


    return (
        <div className="SelectionInput">
            <label className="SelectionInput__label">{label}</label>
            <input
                ref={ref}
                defaultValue={value}
                onFocus={onFocus}
                placeholder="0"
                className="SelectionInput__input"
                disabled={value === "mixed"}
                type="text"
            />
        </div>
    )
}

export default SelectionInput;