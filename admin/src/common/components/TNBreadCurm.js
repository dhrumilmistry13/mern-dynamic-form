import PropTypes from 'prop-types';
import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const TNBreadCurm = (props) => {
  const breadcurmArray = props.breadcurmArray;
  return (
    <Breadcrumb>
      {breadcurmArray.map((bread) => {
        return (
          <Breadcrumb.Item
            key={Math.floor(Math.random() * (1000 - 1 + 1) + 1)}
            active={bread.active}
            linkAs={Link}
            linkProps={{ to: bread.link }}>
            {bread.label}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

TNBreadCurm.propTypes = {
  breadcurmArray: PropTypes.array.isRequired,
};
export { TNBreadCurm };
