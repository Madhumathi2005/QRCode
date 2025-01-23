import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [img, setImg] = useState('');
  const [qrData, setQrData] = useState('');
  const [size, setSize] = useState(150);
  const [storedQRCodes, setStoredQRCodes] = useState([]); // QR history array

  function QR_gen() {
    if (!qrData.trim()) return;
    const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=${size}x${size}`;
    setImg(url);

    // Add the new QR code URL to the stored list
    setStoredQRCodes((prevQRCodes) => [...prevQRCodes, { url, data: qrData }]);
  }

  return (
    <div className="app-container">
      {/* QR Code Generator */}
      <div className="qr-generator">
        <h1>QR Code Generator</h1>
        <div className="qr-display">
          {img && <img src={img} alt="Generated QR Code" />}
        </div>
        <div className="form-group">
          <label>Data for QR Code:</label>
          <input
            type="text"
            placeholder="Enter data"
            onChange={(e) => setQrData(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>QR Code Size:</label>
          <input
            type="number"
            placeholder="Enter size (e.g., 150)"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        </div>
        <button className="generate-btn" onClick={QR_gen}>
          Generate QR Code
        </button>
        {img && (
          <a href={img} download="qrcode.png" className="download-btn">
            Download
          </a>
        )}
      </div>

      {/* QR Code History */}
      <div className="qr-history">
        <h2>QR Code History</h2>
        {storedQRCodes.length > 0 ? (
          <div className="qr-list">
            {storedQRCodes.map((item, index) => (
              <div key={index} className="qr-item">
                <img src={item.url} alt={`QR ${index + 1}`} />
                <p>{item.data}</p>
                <a href={item.url} download={`qrcode_${index + 1}.png`} className="download-btn-small">
                  Download
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p>No QR Codes Generated</p>
        )}
      </div>
    </div>
  );
};

export default App;
