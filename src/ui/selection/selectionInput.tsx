import React from "react";
import "./selectionInput.scss";
import { Editor } from "../../core/editor";
import FocusInput from "../components/FocusInput";

interface Props {
    value: number | "mixed",
    label: string,
    setValue: (value: number) => void
}

const SelectionInput: React.FC<Props> = ({ value, label, setValue }) => {

    const onValueConfirmHandler = React.useCallback((currentInput: HTMLInputElement | null) => {
        if (currentInput) {
            const currentValue = currentInput.value

            if (Number(currentValue) || Number(currentValue) == 0) {
                const currentNumber = Number(currentValue)

                setValue(currentNumber)
            } else {
                currentInput.value = value.toString()
            }

            currentInput.blur()
        }
    }, [])

    return (
        <div className="SelectionInput">
            <label className="SelectionInput__label">{label}</label>
            <FocusInput
                value={value}
                disabled={value === "mixed"}
                placeholder="0"
                onValueConfirm={onValueConfirmHandler}
            />
        </div>
    )
}

export default SelectionInput;