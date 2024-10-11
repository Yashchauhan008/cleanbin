import React, { useRef } from 'react';

const DustbinCardPopup = ({ dustbin, onClose }) => {
  const printRef = useRef();

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <div className="popup">
      <div className="popup-content" ref={printRef}>
        <h2>{dustbin.dustbinName}</h2>
        <p><strong>Type:</strong> {dustbin.type}</p>
        {/* <p><strong>Color:</strong> {dustbin.color}</p>
        <p><strong>Address:</strong> {dustbin.address}</p>
        <p><strong>Filled Up:</strong> {dustbin.filledUp}%</p>
        <p><strong>Responsible Person:</strong> {dustbin.responsiblePerson}</p>
        <p><strong>Is Damaged:</strong> {dustbin.isDamaged ? 'Yes' : 'No'}</p> */}
        <img src={dustbin.qrcode} alt="QR Code" style={{ width: 150, height: 150 }} />
      </div>
      <div className="popup-actions">
        <button onClick={handlePrint}>Print Card</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DustbinCardPopup;
