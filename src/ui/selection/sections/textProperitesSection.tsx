import React from 'react'
import SelectionInput from '../selectionInput';
import "./textPropertiesSection.scss"

interface Props {
    fontSize: number | "mixed",
    setFontSize: (value: number) => void
}

const TextProperitesSection: React.FC<Props> = (props) => {

    const {
        fontSize,
        setFontSize
    } = props;

    return (
        <div className="TextPropertiesSection">
            <span className="TextPropertiesSection__title">Texte</span>
            {
                fontSize === "mixed" ? (
                    <div className="TextPropertiesSection__mixed">
                        <p className="TextPropertiesSection__mixed__title">Taille mixte</p>
                    </div>
                ) : (
                    <SelectionInput
                        value={fontSize}
                        setValue={setFontSize}
                    />
                )
            }
        </div>
    )
}

export default TextProperitesSection