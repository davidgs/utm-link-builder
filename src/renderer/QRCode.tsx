import { useState, useEffect } from 'react';

export default function QRCode() {
  const [qrCode, setQRCode] = useState();
  const [fullLink, setFullLink] = useState('');

  useEffect(() => {
    window.electronAPI
      .getQr(null, fullLink)
      .then((response: ImageData) => {
        console.log('UseEffect QR: ', response);
        setQRCode(response);
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  }, [fullLink]);

  function copyMe() {
    navigator.clipboard.write(qrCode);
  }

  return (
    <div
      style={{
        marginRight: '-1rem',
        marginTop: '-3rem',
        verticalAlign: 'middle',
      }}
    >
      <img
        alt={`qr code for link ${qrCodeLink}`}
        height="100"
        width="100"
        src={`data:image/svg;utf8,${qrCode}`}
      />
    </div>
  );
}
