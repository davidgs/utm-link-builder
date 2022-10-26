import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { FloatingLabel, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';

export default function UTMMedium({ valueChanged, enabled }) {
  const [ariaLabel, setAriaLabel] = useState('');
  const [label, setLabel] = useState('');
  const [errorLabel, setErrorLabel] = useState('');
  const [value, setValue] = useState([]);
  const [showName, setShowName] = useState(false);
  const [toolTip, setToolTip] = useState('');
  const [typeDef, setTypeDef] = useState('');
  const [typePrefix, setTypePrefix] = useState('');

  useEffect(() => {
    window.electronAPI
      .getConfig(null)
      .then((response: JSON) => {
        console.log('UseEffect UTMMedium: ', response);
        setAriaLabel(response.utm_medium.ariaLabel);
        setLabel(response.utm_medium.label);
        setErrorLabel(response.utm_medium.errorLabel);
        setToolTip(response.utm_medium.tooltip);
        setShowName(response.utm_medium.showName);
        setValue(response.utm_medium.value);
        if (response.utm_medium.showName) {
          setLabel(response.utm_medium.label + ' (utm_medium)');
        }
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  }, []);

  const getGroups = value.map((type: string) => {
    const t = type.toLowerCase().replace(/ /g, '_');
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <option key={`${t}`} value={`${t}`}>
        {type}
      </option>
    );
  });
  return (
    <Form.Group as={Col} md={12}>
      {/* <OverlayTrigger
        placement="auto"
        delay={{ show: 250, hide: 400 }}
        overlay={<Tooltip id="type-tooltip">{toolTip}</Tooltip>}
      > */}
      <FloatingLabel label={label}>
        <>
          <Form.Select
            required
            id="type"
            disabled={!enabled}
            aria-label={ariaLabel}
            value={typeDef}
            onChange={(eventKey) => {
              console.log('onSelect', eventKey.target.value);
              valueChanged(eventKey.target.value);
              setTypeDef(eventKey.target.key);
              console.log('Type Prefix: ', eventKey.target.value);
            }}
          >
            <option defaultValue>
              {enabled ? 'Choose one ...' : 'Choose a Term first'}
            </option>
            {getGroups}
          </Form.Select>
        </>
      </FloatingLabel>
      {/* </OverlayTrigger> */}
    </Form.Group>
  );
}
