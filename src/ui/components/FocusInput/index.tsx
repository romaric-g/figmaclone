import React from "react"
import { Editor } from "../../../core/editor"
import "./index.scss"
import classNames from "classnames"

interface Props {
    value: string | number,
    onValueConfirm: (inputElement: HTMLInputElement | null) => void,
    className?: string,
    disabled?: boolean,
    placeholder?: string
}

const FocusInput: React.FC<Props> = ({ value, onValueConfirm, className, disabled = false, placeholder = "" }) => {

    const ref = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {

        const focusOut = () => {
            onValueConfirm(ref.current)
        }

        const enterKeyPress = (type: "up" | "down") => {
            if (type == "down") {
                onValueConfirm(ref.current)
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

    }, [value, onValueConfirm])

    React.useEffect(() => {
        if (ref.current) {
            ref.current.value = value.toString()
        }
    }, [value])

    const onFocus = React.useCallback((event: React.FocusEvent<HTMLInputElement, Element>) => {
        if (ref.current) {
            ref.current.select()
        }
    }, [])


    return (
        <input
            className={classNames("FocusInput", className)}
            ref={ref}
            defaultValue={value}
            onFocus={onFocus}
            placeholder={placeholder}
            disabled={disabled}
            type="text"
        />
    )
}

export default FocusInput;