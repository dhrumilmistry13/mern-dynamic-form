import { useEffect, useMemo, useState } from 'react';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';

import { TNBreadCurm, TNButton, TNTable } from 'common/components';
import { useViewOrganisationFormulary } from 'hooks';
import TabsNavBar from './TabsNavBar';
import { setFormatDate } from 'helpers';

const ViewOrganisationFormularyPage = ({ t }) => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  /**
   * Setting states data to the local storage
   */
  const [currentPage, setCurrentPage] = useState(
    localStorage.adminOrgFormularyTable !== undefined && localStorage.adminOrgFormularyTable !== ''
      ? JSON.parse(localStorage.adminOrgFormularyTable).currentPage
      : 1
  );
  // Initial Values of Organisation Formulary list data
  let FormularyList = {
    formulary_data: [],
    pagination: [],
  };
  /**
   * This will run on page renders, and read data from localstorage,
   * and set it to their corresponding states
   */
  useEffect(() => {
    let adminOrgFormularyTable = {
      currentPage: currentPage,
    };
    localStorage.adminOrgFormularyTable = JSON.stringify(adminOrgFormularyTable);
  }, [currentPage]);

  /**
   * !This Function will call when user clicks on Edit Button
   * @param {*} tdata which is current element of button
   */
  const handleEditClick = (tdata) => {
    let formulary_id = tdata.currentTarget.getAttribute('formulary_id');
    navigate(`/formulary/edit/${formulary_id}`);
  };
  /**
   * !This Function will call when user clicks on View Button
   */
  const handleViewClick = (tdata) => {
    let formulary_id = tdata.currentTarget.getAttribute('formulary_id');
    navigate(`/formulary/view/${formulary_id}`);
  };
  /**
   * This function will call on questions button, and will take user to the formulary related questions page
   */
  const handleViewQuestion = (tdata) => {
    let formulary_id = tdata.currentTarget.getAttribute('formulary_id');
    navigate(`/organisation/formulary-details/${user_id}/medical-question/${formulary_id}`);
  };

  /**
   * !This Block is making Headers for the column
   * @param Not Required
   */
  const columnsjson = [
    {
      Header: `${t('page.formulary_created_at')}`,
      accessor: 'created_at',
      disableSortBy: true,
      Cell: ({ value }) => {
        return setFormatDate(value);
      },
    },
    {
      Header: `${t('page.list_formulary_name_label')}`,
      accessor: 'name',
      disableSortBy: true,
      Cell: ({ row }) => {
        let formula_name;
        if (row.original.formulary.name && row.original.formulary.name?.length > 50) {
          formula_name = row.original.formulary.name?.slice(0, 50);
        } else {
          formula_name = row.original.formulary.name;
        }
        return formula_name;
      },
    },
    {
      Header: `${t('page.list_formulary_image_label')}`,
      accessor: 'featured_image',
      disableSortBy: true,
      Cell: ({ row }) => {
        return (
          <div>
            <img
              className="table-image"
              src={row.original.formulary.featured_image}
              alt="featured-image"
            />
          </div>
        );
      },
    },
    {
      Header: () => {
        return (
          <div
            className=" status-active"
            dangerouslySetInnerHTML={{
              __html: `${t('page.organisation_pharmacy_cost_label')}`,
            }}
          />
        );
      },
      accessor: 'price',
      disableSortBy: false,
      Cell: ({ row }) => {
        return row.original.formulary.price;
      },
    },
    {
      Header: (
        <>
          {t('page.organisation_margin_label')}
          <br />
          {t('page.organisation_patient_price_label')}
        </>
      ),
      accessor: 'margin',
      disableSortBy: true,
      Cell: ({ row }) => {
        return (
          <span>
            {row.original.margin}
            <br />
            {row.original.patient_price}
          </span>
        );
      },
    },
    {
      Header: () => {
        return (
          <div
            className=" status-active"
            dangerouslySetInnerHTML={{
              __html: `${t('page.formulary_prescription_products_label')}`,
            }}
          />
        );
      },
      accessor: 'prescription_product',
      disableSortBy: true,
      Cell: ({ row }) => {
        return (
          <div
            className={
              row.original.prescription_product === 1 ? ' status-active' : ' status-inactive'
            }>
            {t(
              row.original.prescription_product === 1
                ? 'page.formulary_flag_yes'
                : 'page.formulary_flag_no'
            )}
          </div>
        );
      },
    },
    {
      Header: () => {
        return (
          <div
            className=" status-active"
            dangerouslySetInnerHTML={{
              __html: `${t('page.formulary_top_discount_products_label')}`,
            }}
          />
        );
      },
      accessor: 'top_discount_product',
      disableSortBy: true,
      Cell: ({ row }) => {
        return (
          <div
            className={
              row.original.top_discount_product === 1 ? ' status-active' : ' status-inactive'
            }>
            {t(
              row.original.top_discount_product === 1
                ? 'page.formulary_flag_yes'
                : 'page.formulary_flag_no'
            )}
          </div>
        );
      },
    },
    {
      Header: () => {
        return (
          <div
            className=" status-active"
            dangerouslySetInnerHTML={{
              __html: `${t('page.formulary_popular_products_label')}`,
            }}
          />
        );
      },
      accessor: 'popular_product',
      disableSortBy: true,
      Cell: ({ row }) => {
        return (
          <div
            className={row.original.popular_product === 1 ? ' status-active' : ' status-inactive'}>
            {t(
              row.original.popular_product === 1
                ? 'page.formulary_flag_yes'
                : 'page.formulary_flag_no'
            )}
          </div>
        );
      },
    },
    {
      Header: `${t('page.action_column')}`,
      accessor: 'formulary_id',
      Cell: ({ value: initialValue }) => {
        return (
          <div className="action_btn">
            <TNButton
              className="table-primary-button"
              formulary_id={initialValue}
              onClick={handleViewClick.bind(this)}>
              {t('page.action_button_text_view')}
            </TNButton>
            <TNButton
              className="table-primary-button"
              formulary_id={initialValue}
              onClick={handleEditClick.bind(this)}>
              {t('page.action_button_text_edit')}
            </TNButton>
            <TNButton
              className="table-primary-button"
              formulary_id={initialValue}
              user_id={user_id}
              onClick={handleViewQuestion.bind(this)}>
              {t('page.action_button_text_view_questions')}
            </TNButton>
          </div>
        );
      },
      disableSortBy: true,
    },
  ];
  /**
   * !This API will call while Page Load and set data. Once data load we are updating State
   */
  const { isLoading: isLoadingData, data: formularyDetails } = useViewOrganisationFormulary([
    user_id,
    currentPage,
  ]);
  if (!isLoadingData && formularyDetails) {
    FormularyList = {
      formulary_data: formularyDetails?.data?.getOrganizationFormularyData,
      pagination: formularyDetails?.data?.pagination,
    };
  }
  const columns = useMemo(() => columnsjson, []);
  if (FormularyList.pagination === null) {
    return null;
  }
  /**
   * This function will set current page of table
   */
  const pageIndexHandle = (pageIndex) => {
    setCurrentPage(pageIndex + 1);
  };
  /**
   * BreadCum labels and links
   */
  const breadcurmArray = [
    {
      label: t('page.organisation_details_label'),
      link: '/organisation/list',
      active: '',
    },
    {
      label: t('page.view_formulary_details_organisation_label'),
      link: '',
      active: 'active',
    },
  ];
  /**
   * !This block will call on click cancel, and user will be redirected to the listing page
   */
  const handleCancel = () => {
    navigate(`/organisation/list`);
  };

  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <TabsNavBar user_id={user_id} t={t} />
      <Card className="inner-box">
        <Card.Body>
          <h1 className="page-heading-center ">
            {t('page.view_formulary_details_organisation_label')}
          </h1>
          <TNTable
            columns={columns}
            data={FormularyList.formulary_data}
            paginationData={FormularyList.pagination}
            onSelectPage={pageIndexHandle}
            t={t}
            pageIndexGet={currentPage - 1}
            key={Math.floor(Math.random() * (1000 - 1 + 1) + 1)}
          />
          <div className="primary-button">
            <span className="link-center" onClick={handleCancel}>
              {t('page.cancel_button_text')}
            </span>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};
ViewOrganisationFormularyPage.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  paginationData: PropTypes.any,
  t: PropTypes.func,
  value: PropTypes.any,
  row: PropTypes.any,
};
export default ViewOrganisationFormularyPage;
