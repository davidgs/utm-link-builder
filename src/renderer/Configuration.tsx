import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion'

export default function Configuration(showMe) {
  const [show, setShow] = useState(showMe);
  const [utmTarget, setUtmTarget] = useState({});
  const [utmSource, setUtmSource] = useState({});
  const [utmCampaign, setUtmCampaign] = useState({});
  const [utmMedium, setUtmMedium] = useState({});
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    window.electronAPI
      .getConfig(null)
      .then((response: JSON) => {
        console.log('UseEffect Configuration: ', response);
        setUtmTarget(response.utm_target);
        console.log('utmTarget: ', utmTarget);
        setUtmSource(response.utm_source);
        console.log('utmSource: ', utmSource);
        setUtmCampaign(response.utm_campaign);
        console.log('utmCampaign: ', utmCampaign);
        setUtmMedium(response.utm_medium);
        console.log('utmMedium: ', utmMedium);
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  }, []);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

//   return (
//     <Form.Group>
//       {/* <OverlayTrigger
//         placement="auto"
//         delay={{ show: 250, hide: 400 }}
//         overlay={<Tooltip id="target-tooltip">{toolTip}</Tooltip>}
//       > */}
//       <FloatingLabel label={label} size="sm">
//         <FormControl
//           required
//           id="target"
//           aria-label={ariaLabel}
//           aria-describedby={toolTip}
//           onBlur={(eventKey) => {
//             console.log('onBlur', eventKey.target.value);
//             valueChanged(eventKey.target.value);
//           }}
//         />
//       </FloatingLabel>
//     </Form.Group>
//   );
// }
