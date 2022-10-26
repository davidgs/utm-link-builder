/* eslint-disable jsx-a11y/no-static-element-interactions */
import PropTypes from 'prop-types';
import { useState } from 'react';
import icon from '../../../assets/icons/stree.png';

export default function Pill({
  id,
  value,
  type,
  callback,
}: {
  id: string;
  value: string;
  type: string;
  callback: ({ target }: { target: string }) => void;
}): JSX.Element {
  const [myValue, setMyValue] = useState(value);
  const removeMe = (event: Event) => {
    console.log(event);
    if (event.target) {
      event.stopPropagation();
      const parent = event.target.parentNode;
      const pp = parent.parentNode;
      console.log(myValue);
      parent.removeChild(event.target);
      callback({ target: myValue });
    }
  };
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const parent = event.target.parentNode;
      parent.parentNode.removeChild(parent);
      callback(value);
    }
  };
  return (
    <button
      type="button"
      id={id}
      key={`${id}-${type}-button`}
      img={icon}
      className="pill"
      onClick={removeMe}
    >
      <img className="pillImage" key={`${id}-icon`} alt="icon" src={icon} />
      {value}
      <span
        className="close"
        id={`close-${id}`}
        key={`${id}-${type}-closer`}
        onClick={removeMe}
        onKeyPress={handleKeyPress}
      />
    </button>
  );
}
Pill.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
};
