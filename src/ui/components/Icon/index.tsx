import React from "react";
import "./index.scss"

interface Props {
    type: "stroke"
}

const Icon: React.FC<Props> = ({ type }) => {

    const svg = React.useMemo(() => {
        switch (type) {
            case "stroke":
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_337_4)">
                            <path d="M0 0H20V5H0V0ZM0 7H20V11H0V7ZM0 13H20V16H0V13ZM0 18H20V20H0V18Z" />
                        </g>
                        <defs>
                            <clipPath id="clip0_337_4">
                                <rect width="20" height="20" />
                            </clipPath>
                        </defs>
                    </svg>

                )
            default:
                return undefined
        }
    }, [type])

    return (
        <div className="Icon">
            {svg}
        </div>
    )


}

export default Icon;