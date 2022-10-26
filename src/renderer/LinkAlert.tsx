import { useRef, useState, useEffect } from 'react';
import { Alert, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { ClipboardData, Clipboard2CheckFill } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import { UtmParams } from './types';

export default function LinkAlert({
  finalLink,
  show,
  handleClose,
}: {
  finalLink: string;
  show: boolean;
  handleClose: () => void;
}): JSX.Element {
  // clearForm: () => void
  // ) {
  const printRef = useRef();
  const [showLink, setShowLink] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrCode, setQRCode] = useState('');
  const [fullLink, setFullLink] = useState('');

  // Copy link to the clipboard and change the icon to a checkmark
  function copyMe(): void {
    navigator.clipboard.writeText(fullLink);
    setCopied(true);
  }

  // get QR Code
  useEffect(() => {
    window.electronAPI
      .getQr(null, finalLink)
      .then((response: string) => {
        setQRCode(response);
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  }, [finalLink]);

  useEffect(() => {
    setFullLink(finalLink);
    setShowLink(show);
  }, [finalLink, show]);

  // Creat a QR Code png from the svg
  const createImage = (options) => {
    options = options || {};
    const img = document.createElement('img');
    if (options.src) {
      img.src = options.src;
    }
    return img;
  };

  // save the QR Code to the user's computer
  const handleDownloadImage = async () => {
    const canv = document.createElement('canvas');
    const ctx = canv.getContext('2d');
    if (!ctx) {
      return;
    }
    const imageEl = createImage({ src: `data:image/svg+xml;utf8,${qrCode}` });
    imageEl.onload = (e) => {
      canv.width = 400;
      canv.height = 400;
      ctx.drawImage(e.target, 0, 0, 400, 400);
      const qLink = document.createElement('a');
      const data = canv.toDataURL('image/png');
      if (typeof qLink.download === 'string') {
        qLink.href = data;
        qLink.download = 'QRCode.jpg';
        document.body.appendChild(qLink);
        qLink.click();
        document.body.removeChild(qLink);
      } else {
        window.open(data);
      }
    };
  };

  return (
    <>
      <OverlayTrigger
        placement="auto"
        delay={{ show: 250, hide: 400 }}
        rootClose
        overlay={
          <Tooltip id="alert-tooltip">
            Closing this will reset the form and remove your link
          </Tooltip>
        }
      >
        <Alert
          key="primary"
          variant="primary"
          onClose={() => {
            handleClose();
            // clearForm();
          }}
          dismissible
          show={showLink}
        >
          <div className="alert-columns">
            <div className="alert-column1">
              {copied && (
                <OverlayTrigger
                  delay={{ show: 250, hide: 400 }}
                  rootClose
                  overlay={
                    <Tooltip id="alert-tooltip">
                      You have successfully copied the link!
                    </Tooltip>
                  }
                >
                  <Clipboard2CheckFill
                    className="copy-icon"
                    role="button"
                    style={{
                      fontSize: '2rem',
                      cursor: 'pointer',
                      title: 'Link copied to clipboard!',
                    }}
                  />
                </OverlayTrigger>
              )}
              {!copied && (
                <OverlayTrigger
                  placement="auto"
                  delay={{ show: 250, hide: 400 }}
                  rootClose
                  overlay={
                    <Tooltip id="alert-tooltip">
                      Click here to copy your link!
                    </Tooltip>
                  }
                >
                  <ClipboardData
                    className="copy-icon"
                    tabIndex={0}
                    cursor="pointer"
                    role="button"
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={copyMe}
                    // eslint-disable-next-line react/jsx-no-bind
                    onKeyPress={copyMe}
                    title="Click to copy your link!"
                  />
                </OverlayTrigger>
              )}
            </div>
            <div className="alert-column2">
              <OverlayTrigger
                placement="auto"
                delay={{ show: 250, hide: 400 }}
                rootClose
                overlay={
                  <Tooltip id="alert-tooltip">
                    Click here to copy your QR Code!
                  </Tooltip>
                }
              >
                <strong style={{ cursor: 'pointer' }}>{fullLink}</strong>
              </OverlayTrigger>
            </div>
            <div className="alert-column3">
              <img
                ref={printRef}
                id="qr-code"
                src={`data:image/svg+xml;utf8,${qrCode}`}
                alt="QR Code"
                height="100px"
                width="100px"
                style={{ cursor: 'pointer' }}
                onClick={handleDownloadImage}
                onKeyPress={handleDownloadImage}
              />
            </div>
          </div>
        </Alert>
      </OverlayTrigger>
    </>
  );
}

LinkAlert.propTypes = {
  finalLink: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
