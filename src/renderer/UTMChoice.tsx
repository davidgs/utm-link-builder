import { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import { FloatingLabel, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { UtmMedium, defaultUtmMedium, ValueList } from './types';

export default function UTMChoice({
  valueChanged,
  utmParams,
  val,
  type,
  enabled,
}: {
  valueChanged: (value: string) => void;
  utmParams: UtmMedium;
  val: boolean;
  type: string;
  enabled: boolean;
}): JSX.Element {
  const [label, setLabel] = useState('');
  const [value, setValue] = useState(defaultUtmMedium.value);
  const [tooltip, setTooltip] = useState('');
  const [ariaLabel, setAriaLabel] = useState('');
  const [typeDef, setTypeDef] = useState('');
  const [errorLabel, setErrorLabel] = useState('');
  const [showType, setShowType] = useState(false);
  const [validated, setValidated] = useState(false);
  const [defaultLabel, setDefaultLabel] = useState('Choose one...');
  const [enableChoice, setEnableChoice] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setTooltip(utmParams.tooltip);
    setLabel(utmParams.label);
    setValue(utmParams.value);
    setShowType(utmParams.showName);
    setAriaLabel(utmParams.ariaLabel);
  }, [utmParams]);

  useEffect(() => {
    setEnableChoice(enabled);
  }, [enabled]);

  useEffect(() => {
    setValidated(val);
  }, [val]);

  useEffect(() => {
    setTypeDef(type);
  }, [type]);

  const getGroups = value.map((ty: ValueList) => {
    const t: string = ty.value;
    if (t === 'undefined') {
      return null;
    }
    const f: string = t.toLowerCase();
    const tt = f.replace(/ /g, '-');
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <option key={`${tt}`} value={`${tt}`}>
        {ty.value}
      </option>
    );
  });
  return (
    <Form.Group as={Col} md={12}>
      <OverlayTrigger
        key={`${type}-overlay`}
        container={ref}
        placement="auto"
        overlay={
          <Tooltip id={`${type}-tooltip`}>
            <strong>{tooltip}</strong>.
          </Tooltip>
        }
      >
        <FloatingLabel label={showType ? `${label} (${type})` : label}>
          <Form.Select
            required
            ref={ref}
            aria-label={ariaLabel}
            id={type}
            disabled={!enableChoice}
            value={typeDef}
            onChange={(eventKey) => {
              valueChanged(eventKey.target.value);
              setTypeDef(eventKey.target.key);
            }}
          >
            <option defaultValue>
              {enableChoice ? 'Choose one ...' : 'Choose a Term first'}
            </option>
            {getGroups}
          </Form.Select>
        </FloatingLabel>
      </OverlayTrigger>
    </Form.Group>
  );
}

UTMChoice.propTypes = {
  utmParams: PropTypes.shape({
    showName: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
    error: PropTypes.string.isRequired,
    ariaLabel: PropTypes.string.isRequired,
    value: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }).isRequired
    ).isRequired,
  }).isRequired,
  valueChanged: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
};
