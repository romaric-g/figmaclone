import React from "react"
import { Editor } from "../../../core/editor"
import "./index.scss"
import classNames from "classnames"
import { KeyboardAttach } from "../../../core/keyboard/keyboardAttach"
import { KeyboardAction } from "../../../core/keyboard/keyboardAction"

interface Props {
    value: string | number,
    onValueConfirm: (inputElement: HTMLInputElement | null) => void,
    className?: string,
    disabled?: boolean,
    placeholder?: string
}

const FocusInput: React.FC<Props> = ({ value, onValueConfirm, className, disabled = false, placeholder = "" }) => {

    const ref = React.useRef<HTMLInputElement>(null)
    const prevAttach = React.useRef<KeyboardAttach>()

    const enterKeyPress = React.useCallback((type: "up" | "down") => {
        if (type == "down") {
            onValueConfirm(ref.current)

            if (ref.current) {
                ref.current.blur()
            }
        }
    }, [onValueConfirm])

    React.useEffect(() => {

        const focusOut = () => {
            if (prevAttach.current) {
                Editor.getEditor().keyboardManager.setAttach(prevAttach.current)
            }

            onValueConfirm(ref.current)

            if (ref.current) {
                ref.current.blur()
            }
        }

        if (ref.current) {
            ref.current.addEventListener("focusout", focusOut);
        }

        return () => {
            ref.current?.removeEventListener("focusout", focusOut)
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

            const keyboardManager = Editor.getEditor().keyboardManager

            prevAttach.current = keyboardManager.getAttach()

            keyboardManager.setAttach(new KeyboardAttach().addAction(
                new KeyboardAction("enter", enterKeyPress)
            ))
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