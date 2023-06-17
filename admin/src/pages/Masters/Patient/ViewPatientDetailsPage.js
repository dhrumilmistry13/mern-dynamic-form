import React from 'react';
import PropTypes from 'prop-types';

import { useParams } from 'react-router';
import { TNBreadCurm } from 'common/components';
import ViewGeneralDetails from './PatientTabs/ViewGeneralDetails';
import TabsNavBar from './PatientTabs/TabsNavBar';

const ViewPatientDetailsPage = ({ t }) => {
  const { user_id } = useParams();
  /**
   * BreadCum Labels and Links
   */
  const breadcurmArray = [
    {
      label: t('page.patient_details_label'),
      link: '/patient/list',
      active: '',
    },
    {
      label: t('page.view_gereral_detail_patient_label'),
      link: '/patient/list',
      active: 'active',
    },
  ];
  return (
    <div>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <TabsNavBar user_id={user_id} t={t} />
      <ViewGeneralDetails t={t} />
    </div>
  );
};
ViewPatientDetailsPage.propTypes = {
  t: PropTypes.func,
};
export default ViewPatientDetailsPage;
