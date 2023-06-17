import React from 'react';
import PropTypes from 'prop-types';
import GeneralDetailsTab from './OrganisationTabs/GeneralDetailsTab';
import TabsNavBar from './OrganisationTabs/TabsNavBar';
import { useParams } from 'react-router';
import { TNBreadCurm } from 'common/components';

const ViewOrganisationPage = ({ t }) => {
  const { user_id } = useParams();
  /**
   * BreadCum Labels and Links
   */
  const breadcurmArray = [
    {
      label: t('page.organisation_details_label'),
      link: '/organisation/list',
      active: '',
    },
    {
      label: t('page.view_gereral_detail_organisation_label'),
      link: '/organisation/list',
      active: 'active',
    },
  ];
  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <TabsNavBar user_id={user_id} t={t} />
      <GeneralDetailsTab t={t} />
    </>
  );
};
ViewOrganisationPage.propTypes = {
  t: PropTypes.func,
};
export default ViewOrganisationPage;
