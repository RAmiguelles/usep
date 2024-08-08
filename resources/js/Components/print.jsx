import React from 'react';
const Print= ({componentRef}) => {
  return (
    <>
        <div style={{ display: 'none' }}>
            <div ref={componentRef}>
                <h1>Hello, World!</h1>
            </div>
        </div>
    </>
  );
};

export default Print;