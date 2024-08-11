import React from 'react';
import { Alpha, Hue, Saturation, HsvaColor } from '@uiw/react-color';
import { hsvaToHex, hsvaToHexa, validHex, hexToHsva } from '@uiw/color-convert'
import FocusInput from '../components/FocusInput';
import "./colorPicker.scss"

interface Props {
    color: HsvaColor,
    onChange: (color: HsvaColor) => void
}

const ColorPicker = ({ color, onChange }: Props) => {

    const [isOpen, setIsOpen] = React.useState(false)

    const onHexChangeHandler = React.useCallback((currentInput: HTMLInputElement | null) => {
        if (currentInput) {
            if (validHex(currentInput.value)) {

                const newColor = hexToHsva(currentInput.value)

                newColor.a = color.a

                onChange(newColor)

                if (newColor.h === color.h && newColor.s === color.s && newColor.v === color.v) {
                    currentInput.value = hsvaToHex(color)
                }

            } else {
                currentInput.value = hsvaToHex(color)
            }
        }
    }, [color, onChange])

    const onAlphaChangeHandler = React.useCallback((currentInput: HTMLInputElement | null) => {
        if (currentInput) {

            let currentValue = currentInput.value

            if (currentValue.endsWith("%")) {
                currentValue = currentValue.slice(0, -1)
            }


            if (Number(currentValue) || Number(currentValue) == 0) {
                const currentNumber = Number(currentValue)

                const newColor = color

                if (currentNumber < 1) {
                    newColor.a = currentNumber
                } else {
                    newColor.a = currentNumber / 100
                }

                if (newColor.a > 1) {
                    newColor.a = 1
                }


                if (newColor.a < 0) {
                    newColor.a = 0
                }

                if (newColor.a == color.a) {
                    currentInput.value = Math.round(color.a * 100) + "%"
                }

                onChange(newColor)
            } else {
                currentInput.value = Math.round(color.a * 100) + "%"
            }

            currentInput.blur()
        }
    }, [color, onChange])

    React.useEffect(() => {

        function onClick(e: MouseEvent) {
            if (!isOpen || !e.target) {
                return
            }
            let target = e.target as HTMLElement
            if (!target.closest('.ColorPicker__modal')) {
                if (isOpen) {
                    setIsOpen(false)
                }
            }
        }

        setTimeout(() => {
            document.addEventListener("pointerdown", onClick)
        })

        return () => {
            document.removeEventListener("pointerdown", onClick)
        }
    }, [isOpen, setIsOpen])

    return (
        <div className='ColorPicker'>

            <div className='ColorPicker__field'>
                <div className="ColorPicker__field__hex">
                    <div
                        onPointerDown={(e) => {
                            if (!isOpen) {
                                setIsOpen(true)
                            }
                        }}
                        className='ColorPicker__field__hex__preview'
                    >
                        <div
                            className="ColorPicker__field__hex__preview__color"
                            style={{ backgroundColor: hsvaToHex(color) }}
                        ></div>
                        <div
                            className="ColorPicker__field__hex__preview__alpha"
                            style={{ backgroundColor: hsvaToHexa(color) }}
                        ></div>
                    </div>

                    <FocusInput
                        className='ColorPicker__field__hex__input'
                        onValueConfirm={onHexChangeHandler}
                        value={hsvaToHex(color)}
                    >

                    </FocusInput>
                </div>

                <div className="ColorPicker__field__alpha">

                    <FocusInput
                        className='ColorPicker__field__alpha__input'
                        onValueConfirm={onAlphaChangeHandler}
                        value={Math.round(color.a * 100) + "%"}
                    >
                    </FocusInput>
                </div>
            </div>

            {isOpen && (
                <div className='ColorPicker__modal'>
                    <div className="ColorPicker__modal__header">
                        <p className="ColorPicker__modal__header__title">
                            Changer de couleur
                        </p>
                        <div className="ColorPicker__modal__header__close" onClick={() => setIsOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px"><path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z" /></svg>
                        </div>
                    </div>
                    <div className="ColorPicker__modal__content">
                        <Saturation
                            style={{
                                width: "100%"
                            }}
                            hsva={color}
                            onChange={(newColor) => {

                                const newHsva = { ...color, ...newColor, a: color.a }

                                onChange(newHsva);
                            }}
                        />

                        <div className="ColorPicker__modal__content__bars">
                            <Hue
                                hue={color.h}
                                style={{ height: 14 }}
                                onChange={(newHue) => {
                                    const newHsva = { ...color, ...newHue }

                                    onChange(newHsva);
                                }}
                            />

                            <Alpha
                                hsva={color}
                                style={{ height: 14 }}
                                onChange={(newAlpha) => {
                                    const newHsva = { ...color, ...newAlpha }

                                    onChange(newHsva);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ColorPicker;