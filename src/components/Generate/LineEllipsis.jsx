import React from 'react';

const LineEllipsis = ({ children, line }) => {
    const ellipsisStyle = {
        display: '-webkit-box',
        WebkitLineClamp: line,           
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',

    };

    return (
        <div style={ellipsisStyle}>
            {children}
        </div>
    );
};

export default LineEllipsis;
