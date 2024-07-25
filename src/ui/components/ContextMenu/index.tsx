import React from 'react';

interface MenuItem {
    label: string,
    onClick: () => void
}

interface Props {
    x: number,
    y: number,
    items: MenuItem[],
    onClose: () => void
}

const ContextMenu: React.FC<Props> = ({ x, y, items, onClose }) => {
    return (
        <div
            style={{
                position: 'absolute',
                top: `${y}px`,
                left: `${x}px`,
                backgroundColor: 'white',
                border: '1px solid black',
                zIndex: 1000
            }}
            onClick={onClose}
        >
            <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                {items.map((item, index) => (
                    <li
                        key={index}
                        style={{ padding: '8px 12px', cursor: 'pointer' }}
                        onClick={() => {
                            item.onClick();
                            onClose();
                        }}
                    >
                        {item.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContextMenu;
