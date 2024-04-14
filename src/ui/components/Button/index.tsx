import React from "react"
import "./index.scss"
import classNames from "classnames"

interface Props {
    children?: React.ReactNode,
    selected: boolean,
    onClick?: () => void
}

const Button: React.FC<Props> = ({ selected, children, onClick }) => {
    return (
        <button
            className={classNames("Button", { "Button--selected": selected })}
            onClick={() => !!onClick && onClick()}
        >
            {children}
        </button>
    )
}

export default Button;