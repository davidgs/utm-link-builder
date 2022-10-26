import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { FloatingLabel, FormControl } from 'react-bootstrap';

export default function UTMSource({ valueChanged }) {
  const [ariaLabel, setAriaLabel] = useState('');
  const [label, setLabel] = useState('');
  const [errorLabel, setErrorLabel] = useState('');
  const [value, setValue] = useState('');
  const [showName, setShowName] = useState(false);
  const [toolTip, setToolTip] = useState('');

  useEffect(() => {
    window.electronAPI
      .getConfig(null)
      .then((response: JSON) => {
        console.log('UseEffect UTMSource: ', response);
        setAriaLabel(response.utm_source.ariaLabel);
        setLabel(response.utm_source.label);
        setErrorLabel(response.utm_source.errorLabel);
        setToolTip(response.utm_source.tooltip);
        setShowName(response.utm_source.showName);
        setValue(response.utm_source.value);
        if (response.utm_source.showName) {
          setLabel(response.utm_source.label + ' (utm_source)');
        }
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  }, []);

  return (
    <Form.Group>
      <FloatingLabel label={label} size="sm">
        <FormControl
          required
          id="target"
          aria-label={ariaLabel}
          aria-describedby={toolTip}
          onBlur={(eventKey) => {
            console.log('onBlur', eventKey.target.value);
            valueChanged(eventKey.target.value);
          }}
        />
      </FloatingLabel>
    </Form.Group>
  );
}
