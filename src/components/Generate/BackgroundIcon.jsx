import React from 'react';

const BackgroundIcon = ({ children, lable }) => {
    return (
        <>
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 25, // Diameter of the circle
                height: 25, // Diameter of the circle
                borderRadius: '50%',
                backgroundColor: '#f0f0f0' // Light gray background
            }}>
                {children}
            </div>
            <span style={{ marginLeft: 5 }}>{lable}</span>
        </>
    );
};

export default BackgroundIcon;
