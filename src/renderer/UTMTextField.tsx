import { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import {
  FloatingLabel,
  FormControl,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { UtmObj } from './types';

function UTMTextField({
  valueChanged,
  utmParams,
  targetType,
  val,
}: {
  valueChanged: (value: string) => void;
  utmParams: UtmObj;
  targetType: string;
  val: boolean;
}): JSX.Element {
  const [ariaLabel, setAriaLabel] = useState('');
  const [label, setLabel] = useState('');
  const [errorLabel, setErrorLabel] = useState('');
  const [showName, setShowName] = useState(false);
  const [tooltip, setTooltip] = useState('');
  const [validated, setValidated] = useState(false);
  const [tType, setTType] = useState(targetType);
  const ref = useRef(null);

  useEffect(() => {
    setAriaLabel(utmParams.ariaLabel);
    setLabel(utmParams.label);
    setErrorLabel(utmParams.error);
    setShowName(utmParams.showName);
    setTooltip(utmParams.tooltip);
  }, [utmParams]);

  useEffect(() => {
    setValidated(val);
  }, [val]);

  return (
    <div>
      <Form.Group>
        <OverlayTrigger
          key={`${targetType}-overlay`}
          container={ref}
          placement="top"
          overlay={
            <Tooltip id={`${targetType}-tooltip`}>
              <strong>{tooltip}</strong>
            </Tooltip>
          }
        >
          <FloatingLabel label={showName ? `${label} (${tType})` : `${label}`}>
            <FormControl
              required
              ref={ref}
              id={`${targetType}-target`}
              aria-label={ariaLabel}
              aria-describedby={tooltip}
              onBlur={(eventKey) => {
                valueChanged(eventKey.target.value);
              }}
            />
          </FloatingLabel>
        </OverlayTrigger>
        <Form.Control.Feedback type="invalid">
          {errorLabel}
        </Form.Control.Feedback>
      </Form.Group>
    </div>
  );
}

UTMTextField.propTypes = {
  valueChanged: PropTypes.func.isRequired,
  utmParams: PropTypes.shape({
    ariaLabel: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    error: PropTypes.string.isRequired,
    showName: PropTypes.bool.isRequired,
    tooltip: PropTypes.string.isRequired,
  }).isRequired,
  targetType: PropTypes.string.isRequired,
  val: PropTypes.bool.isRequired,
};

export default UTMTextField;
