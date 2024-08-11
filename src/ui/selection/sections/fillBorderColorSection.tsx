import React from 'react'
import ColorPicker from '../colorPicker';
import SelectionInput from '../selectionInput';
import Icon from '../../components/Icon';
import { HsvaColor } from '@uiw/react-color';
import "./fillBorderColorSection.scss"

interface Props {
    borderColor: HsvaColor | "mixed",
    borderWidth: number | "mixed",
    setBorderColor: (value: HsvaColor) => void,
    setBorderWidth: (value: number) => void
}

const FillBorderColorSection: React.FC<Props> = (props) => {

    const {
        borderColor,
        borderWidth,
        setBorderColor,
        setBorderWidth
    } = props;

    return (
        <div className="FillBorderColorSection">
            <span className="FillBorderColorSection__title">Bordure</span>
            {
                borderColor === "mixed" ? (
                    <div className="FillBorderColorSection__mixed">
                        <p className="FillBorderColorSection__mixed__title">Couleur mixte</p>
                    </div>
                ) : (

                    borderColor !== undefined && borderWidth !== undefined ? (
                        <div>
                            <ColorPicker
                                color={borderColor}
                                onChange={setBorderColor}
                            />
                            <SelectionInput
                                value={borderWidth}
                                icon={(
                                    <Icon type="stroke" />
                                )}
                                setValue={setBorderWidth}
                            />
                        </div>
                    ) : undefined
                )
            }
        </div>
    )
}

export default FillBorderColorSection