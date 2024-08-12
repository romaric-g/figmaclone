


import { HsvaColor } from '@uiw/react-color'
import React from 'react'
import ColorPicker from '../colorPicker';
import "./fillColorSection.scss"

interface Props {
    color: HsvaColor | "mixed",
    setColor: (color: HsvaColor) => void
}

const FillColorSection: React.FC<Props> = (props) => {

    const {
        color,
        setColor
    } = props;

    return (
        <div className="FillColorSection">
            <span className="FillColorSection__title">Remplissage</span>
            {
                color === "mixed" ? (
                    <div className="FillColorSection__mixed">
                        <p className="FillColorSection__mixed__title">Couleur mixte</p>
                    </div>
                ) : (

                    color ? (
                        <ColorPicker
                            color={color}
                            onChange={setColor}
                        />
                    ) : undefined
                )
            }
        </div>
    )
}

export default FillColorSection