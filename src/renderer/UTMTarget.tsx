import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import {
  FloatingLabel,
  FormControl,
  InputGroup,
  DropdownButton,
  Dropdown,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { UtmTarget, ValueList, defaultValueList } from './types';

export default function UTMTarget({
  valueChanged,
  originValue,
  utmParams,
  val,
  type,
}: {
  valueChanged: (value: string) => void;
  originValue: (value: string) => void;
  utmParams: UtmTarget;
  val: boolean;
  type: string;
}): JSX.Element {
  const [linkOrigin, setLinkOrigin] = useState('Pick a base target');
  const [ariaLabel, setAriaLabel] = useState('');
  const [label, setLabel] = useState('');
  const [tooltip, setToolTip] = useState('');
  const [errorLabel, setErrorLabel] = useState('');
  const [showType, setShowType] = useState(false);
  const [validated, setValidated] = useState(false);
  const [originsEnabled, setOriginsEnabled] = useState('inline');
  const [showOrigins, setShowOrigins] = useState(false);
  const [linkOriginTip, setLinkOriginTip] = useState('');
  const [linkOriginAriaLabel, setLinkOriginAriaLabel] = useState('');
  const [linkOriginLabel, setLinkOriginLabel] = useState(false);
  const [origins, setOrigins] = useState([defaultValueList]);
  const [linkTarget, setLinkTarget] = useState('');

  useEffect(() => {
    setAriaLabel(utmParams.target_field.ariaLabel);
    setLabel(`${utmParams.label}`);
    setShowType(utmParams.target_field.showName);
    setErrorLabel(utmParams.error);
    setToolTip(utmParams.tooltip);
    setLinkOriginTip(utmParams.tooltip);
    setShowOrigins(utmParams.RestrictBases);
    if (utmParams.RestrictBases) {
      setOrigins(utmParams.value);
    } else {
      setOrigins([]);
      setOriginsEnabled('none');
      setShowOrigins(false);
    }
  }, [utmParams]);

  useEffect(() => {
    setValidated(val);
  }, [val]);

  const getOrigins = origins.map((tar: ValueList) => {
    if (typeof tar.id === 'undefined') {
      return null;
    }
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <Dropdown.Item
        style={{ color: 'black' }}
        key={tar.id}
        id={tar.id}
        eventKey={tar.value}
      >
        {tar.value}
      </Dropdown.Item>
    );
  });

  if (showOrigins) {
    return (
      <InputGroup className="mb-3" size="lg">
        <DropdownButton
          variant="outline-secondary"
          title={linkOrigin}
          id="input-group-dropdown-1"
          onSelect={(eventKey) => {
            setLinkOrigin(eventKey);
            originValue(eventKey);
            setLinkOriginTip(
              "Where will this link point to? If it's to the top-level, just enter '-' here."
            );
          }}
        >
          {getOrigins}
        </DropdownButton>
        <FormControl
          required
          disabled={linkOrigin === 'Pick a base target'}
          id="target"
          label={showType ? `${label} (${type})` : label}
          aria-label={ariaLabel}
          placeholder={label}
          aria-describedby={tooltip}
          onBlur={(eventKey) => {
            valueChanged(eventKey.target.value);
            setLinkTarget(eventKey.target.value);
          }}
        />
        <Form.Control.Feedback type="invalid">
          {errorLabel}
        </Form.Control.Feedback>
      </InputGroup>
    );
  }
  return (
    <Form.Group>
      <FloatingLabel label={showType ? `${label} (${type})` : label}>
        <FormControl
          required
          id="target"
          key={type} // "utm_target"
          aria-label={ariaLabel} // "Referral Target"
          aria-describedby={tooltip} // "target-tooltip"
          onBlur={(eventKey) => {
            valueChanged(eventKey.target.value);
            setLinkTarget(eventKey.target.value);
            originValue('');
            setLinkOrigin('');
          }}
        />
      </FloatingLabel>
    </Form.Group>
  );
}
UTMTarget.propTypes = {
  valueChanged: PropTypes.func.isRequired,
  originValue: PropTypes.func.isRequired,
  utmParams: PropTypes.shape({
    label: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
    error: PropTypes.string.isRequired,
    RestrictBases: PropTypes.bool.isRequired,
    value: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        value: PropTypes.string,
      })
    ),
    target_field: PropTypes.shape({
      showName: PropTypes.bool.isRequired,
      label: PropTypes.string.isRequired,
      ariaLabel: PropTypes.string.isRequired,
      tooltip: PropTypes.string.isRequired,
      error: PropTypes.string.isRequired,
      value: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        })
      ).isRequired,
    }).isRequired,
  }).isRequired,
  val: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};
