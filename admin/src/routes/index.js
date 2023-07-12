// import libs
import { React } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import QuestionRoutes from 'pages/Masters/Question/QuestionRoute';
import FormRoutes from 'pages/Masters/Forms/FormRoutes';

const PagesRoutes = ({ t }) => {
  return (
    <Router basename={'/'}>
      <Routes>
        {/* Question Master Routes  */}
        <Route path="/*" element={<QuestionRoutes t={t} />} />
        <Route path="/form/*" element={<FormRoutes t={t} />} />
      </Routes>
    </Router>
  );
};
PagesRoutes.propTypes = {
  t: PropTypes.func,
};
export default PagesRoutes;
