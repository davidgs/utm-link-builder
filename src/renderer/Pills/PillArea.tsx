import PropTypes from 'prop-types';
import Pill from './Pill';

export default function PillArea({
  pills,
  type,
  callback,
}: {
  pills: string[];
  type: string;
  callback: (props: { id: string; link: string; type: string }) => void;
}): JSX.Element {
  return (
    <div className="pillArea" key={`${type}-pillArea`}>
      {pills.map((pill) => (
        <Pill
          key={pill.id}
          id={pill.id}
          value={pill.value}
          callback={callback}
        />
      ))}
    </div>
  );
}

PillArea.propTypes = {
  pills: PropTypes.arrayOf(PropTypes.string).isRequired,
  type: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
};
