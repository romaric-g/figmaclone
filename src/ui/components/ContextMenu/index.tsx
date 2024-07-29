import React from 'react';
import "./index.scss"
import { MenuItemData } from '../../subjects';


interface Props {
    x: number,
    y: number,
    items: MenuItemData[],
    onClose: () => void
}

const ContextMenu: React.FC<Props> = ({ x, y, items, onClose }) => {
    return (
        <div
            className='ContextMenu'
            style={{
                position: 'absolute',
                top: `${y}px`,
                left: `${x}px`,
                zIndex: 1000
            }}
            onClick={onClose}
        >
            <ul
                className='ContextMenu__items'
                style={{ listStyleType: 'none', margin: 0, padding: 0 }}
            >
                {items.map((item, index) => (
                    <li
                        className='ContextMenu__items__item'
                        key={index}
                        style={{ padding: '8px 12px', cursor: 'pointer' }}
                        onClick={() => {
                            item.onClick();
                            onClose();
                        }}
                    >
                        {item.label}
                        <span className='ContextMenu__items__item__command'>{item.command}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContextMenu;
