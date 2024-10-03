import React from 'react';

const CartaoFesta = ({
    bgColor = '#FF5C5C',
    textColor = '#000000',
    text = 'CARTÃO FESTA',
    code = '12345678',
    fontSize = 24,
    fontFamily = 'Arial',
    svg = null,
  }) => {return (
    <div>
      <div
        style={{
          backgroundColor: bgColor,
          color: textColor,
          fontFamily: fontFamily,
          fontSize: `${fontSize}px`,
          width: '345px',
          height: '220px',
          borderRadius: '14px',
          padding: '20px',
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            textAlign: 'left',
            whiteSpace: 'nowrap',
            fontSize: `${fontSize}px`,
            color: textColor,
            fontFamily: fontFamily,
          }}
        >
          {text}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '20px',
            textAlign: 'left',
            fontSize: `${fontSize * 0.8}px`,
            color: textColor,
            fontFamily: fontFamily,
          }}
        >
          CÓDIGO: {code}
        </div>
            {svg ? (
                <div style={{ 
                    backgroundColor: '#FFFFFF',
                    position: 'absolute',
                    padding: '7px',
                    bottom: '20px',
                    right: '20px',
                    width: '100px',
                    height: '100px',
                    overflow: 'hidden' }}>
                    {React.cloneElement(svg, { style: { width: '100%', height: '100%', objectFit: 'contain' } })}
                </div>
            ) : (
                <div
                    style={{
                        position: 'absolute',
                        padding: '7px',
                        bottom: '20px',
                        right: '20px',
                        width: '100px',
                        height: '100px',
                        backgroundColor: '#FFFFFF',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '50px',
                    }}
                >
                    <div style={{ backgroundColor: '#000000', width: '100%', height: '100%' }}></div>
                    <div style={{ backgroundColor: '#000000', width: '100%', height: '100%' }}></div>
                    <div style={{ backgroundColor: '#000000', width: '100%', height: '100%' }}></div>
                </div>
            )}
      </div>
    </div>
  );
};

export default CartaoFesta;
