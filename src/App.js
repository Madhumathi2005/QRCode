import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [img, setImg] = useState('');
  const [size, setSize] = useState(150);
  const [storedQRCodes, setStoredQRCodes] = useState([]);
  const [amount, setAmount] = useState('');
  const [receiverDetail, setReceiverDetail] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(null); // To handle selected payment method or link

  function generateQR() {
    let qrData = '';

    // Check if link method is selected
    if (paymentMethod === 'link' && link.trim()) {
      // If Link is selected, generate the QR for URL
      qrData = link;

    } else if (paymentMethod === 'upi') {
      // If UPI is selected, generate the UPI QR
      if (!amount || !receiverDetail || !receiverName) {
        alert('Please provide all required details (Amount, Receiver Details, and Receiver Name).');
        return;
      }
      qrData = `upi://pay?pa=${receiverDetail}&pn=${encodeURIComponent(receiverName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(description)}`;
    }

    if (!qrData) return;

    const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=${size}x${size}`;
    setImg(url);

    // Store the generated QR Code in history
    setStoredQRCodes((prevQRCodes) => [
      ...prevQRCodes,
      { url, data: qrData },
    ]);
  }

  return (
    <div className="app-container">
      <div className="qr-generator">
        <h1>QR Code Generator</h1>

        {/* Button for selecting payment method or link */}
        {!paymentMethod && (
          <div className="form-group">
            <h2>Choose what to generate:</h2>
            <button
              className="payment-btn"
              onClick={() => setPaymentMethod('upi')}
            >
              Generate QR for UPI ID
            </button>
            <button
              className="payment-btn"
              onClick={() => setPaymentMethod('link')}
            >
              Generate QR for Link
            </button>
          </div>
        )}

        {/* Input Fields for UPI or Link */}
        {paymentMethod === 'link' && (
          <div>
            <div className="form-group">
              <label>Enter the Link:</label>
              <input
                type="text"
                placeholder="Enter link (e.g., http://example.com)"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>QR Code Size:</label>
              <input
                type="number"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                placeholder="Enter size (e.g., 150)"
              />
            </div>

            <button className="generate-btn" onClick={generateQR}>
              Generate QR Code
            </button>

            {img && (
              <a href={img} download="link_qrcode.png" className="download-btn">
                Download QR Code
              </a>
            )}
          </div>
        )}

        {paymentMethod === 'upi' && (
          <div>
            <div className="form-group">
              <label>Amount (INR):</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Receiver's UPI ID:</label>
              <input
                type="text"
                placeholder="Enter receiver's UPI ID"
                value={receiverDetail}
                onChange={(e) => setReceiverDetail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Receiver's Name:</label>
              <input
                type="text"
                placeholder="Enter receiver's name"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Description (Optional):</label>
              <input
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>QR Code Size:</label>
              <input
                type="number"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                placeholder="Enter size (e.g., 150)"
              />
            </div>

            <button className="generate-btn" onClick={generateQR}>
              Generate QR Code
            </button>

            {img && (
              <a href={img} download="transaction_qrcode.png" className="download-btn">
                Download QR Code
              </a>
            )}
          </div>
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
