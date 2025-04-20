const BackgroundIcon = ({ children, lable, Bgcolor = '#f0f0f0' }) => {
    return (
        <>
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 25,
                height: 25,
                borderRadius: '50%',
                backgroundColor: Bgcolor
            }}>
                {children}
            </div>
            <span style={{ marginLeft: 5 }}>{lable}</span>
        </>
    );
};

export default BackgroundIcon;
