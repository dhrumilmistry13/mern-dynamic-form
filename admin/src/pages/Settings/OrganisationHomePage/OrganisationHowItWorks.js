import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Button, Card, Form, Nav } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';

import validationSchema from './OrganisationHowItWorksValidations';
import { useViewOrganisationHowItWorks, useUpdateOrganisationHowItWorks } from 'hooks';
import {
  CardFourDetail,
  CardOneDetail,
  CardThreeDetail,
  CardTwoDetail,
  SectionDetail,
} from './components';
import { TNButton } from 'common/components';
import { fileToDataUri, s3BucketFileUpload } from 'helpers';
// import { fileToDataUri, s3BucketFileUpload } from 'helpers';

const OrganisationHowItWorks = ({ t }) => {
  const navigate = useNavigate();
  const [formikValues, setFormikValues] = useState();
  /**
   * This Block will execute on Form Submit, provides form fields and validations for that
   */
  const initialValues = {
    home_page_organization_how_its_work_header_title: '',
    home_page_organization_how_its_work_header_sub_title: '',
    home_page_organization_how_its_work_header_text: '',
    home_page_organization_how_its_work_button_text: '',
    home_page_organization_how_its_work_button_link: '',
    home_page_organization_how_its_work_favicon_1: '',
    home_page_organization_how_its_work_header_text_1: '',
    home_page_organization_how_its_work_header_title_1: '',
    home_page_organization_how_its_work_header_button_text_1: '',
    home_page_organization_how_its_work_header_button_link_1: '',

    home_page_organization_how_its_work_favicon_2: '',
    home_page_organization_how_its_work_header_text_2: '',
    home_page_organization_how_its_work_header_title_2: '',
    home_page_organization_how_its_work_header_button_text_2: '',
    home_page_organization_how_its_work_header_button_link_2: '',

    home_page_organization_how_its_work_favicon_3: '',
    home_page_organization_how_its_work_header_text_3: '',
    home_page_organization_how_its_work_header_title_3: '',
    home_page_organization_how_its_work_header_button_text_3: '',
    home_page_organization_how_its_work_header_button_link_3: '',

    home_page_organization_how_its_work_favicon_4: '',
    home_page_organization_how_its_work_header_text_4: '',
    home_page_organization_how_its_work_header_title_4: '',
    home_page_organization_how_its_work_header_button_text_4: '',
    home_page_organization_how_its_work_header_button_link_4: '',
  };

  /**
   * This function will call on page load, and data will be set to the form fields
   */
  const {
    refetch: doViewHowItWorks,
    isLoading: isLoadingData,
    data: how_it_works,
  } = useViewOrganisationHowItWorks(({ data: how_it_works_data }) => {
    if (how_it_works_data) {
      initialValues.home_page_organization_how_its_work_header_title =
        how_it_works_data.home_page_organization_how_its_work_header_title;
      initialValues.home_page_organization_how_its_work_header_sub_title =
        how_it_works_data.home_page_organization_how_its_work_header_sub_title;
      initialValues.home_page_organization_how_its_work_header_text =
        how_it_works_data.home_page_organization_how_its_work_header_text;
      initialValues.home_page_organization_how_its_work_button_link =
        how_it_works_data.home_page_organization_how_its_work_button_link;
      initialValues.home_page_organization_how_its_work_button_text =
        how_it_works_data.home_page_organization_how_its_work_button_text;
      initialValues.home_page_organization_how_its_work_favicon_1 =
        how_it_works_data.home_page_organization_how_its_work_favicon_1;
      initialValues.home_page_organization_how_its_work_header_text_1 =
        how_it_works_data.home_page_organization_how_its_work_header_text_1;
      initialValues.home_page_organization_how_its_work_header_title_1 =
        how_it_works_data.home_page_organization_how_its_work_header_title_1;
      initialValues.home_page_organization_how_its_work_header_button_text_1 =
        how_it_works_data.home_page_organization_how_its_work_header_button_text_1;
      initialValues.home_page_organization_how_its_work_header_button_link_1 =
        how_it_works_data.home_page_organization_how_its_work_header_button_link_1;
      initialValues.home_page_organization_how_its_work_favicon_2 =
        how_it_works_data.home_page_organization_how_its_work_favicon_2;
      initialValues.home_page_organization_how_its_work_header_text_2 =
        how_it_works_data.home_page_organization_how_its_work_header_text_2;
      initialValues.home_page_organization_how_its_work_header_title_2 =
        how_it_works_data.home_page_organization_how_its_work_header_title_2;
      initialValues.home_page_organization_how_its_work_header_button_text_2 =
        how_it_works_data.home_page_organization_how_its_work_header_button_text_2;
      initialValues.home_page_organization_how_its_work_header_button_link_2 =
        how_it_works_data.home_page_organization_how_its_work_header_button_link_2;
      initialValues.home_page_organization_how_its_work_favicon_3 =
        how_it_works_data.home_page_organization_how_its_work_favicon_3;
      initialValues.home_page_organization_how_its_work_header_text_3 =
        how_it_works_data.home_page_organization_how_its_work_header_text_3;
      initialValues.home_page_organization_how_its_work_header_title_3 =
        how_it_works_data.home_page_organization_how_its_work_header_title_3;
      initialValues.home_page_organization_how_its_work_header_button_text_3 =
        how_it_works_data.home_page_organization_how_its_work_header_button_text_3;
      initialValues.home_page_organization_how_its_work_header_button_link_3 =
        how_it_works_data.home_page_organization_how_its_work_header_button_link_3;
      initialValues.home_page_organization_how_its_work_favicon_4 =
        how_it_works_data.home_page_organization_how_its_work_favicon_4;
      initialValues.home_page_organization_how_its_work_header_text_4 =
        how_it_works_data.home_page_organization_how_its_work_header_text_4;
      initialValues.home_page_organization_how_its_work_header_title_4 =
        how_it_works_data.home_page_organization_how_its_work_header_title_4;
      initialValues.home_page_organization_how_its_work_header_button_text_4 =
        how_it_works_data.home_page_organization_how_its_work_header_button_text_4;
      initialValues.home_page_organization_how_its_work_header_button_link_4 =
        how_it_works_data.home_page_organization_how_its_work_header_button_link_4;
    }
  });
  if (!isLoadingData && how_it_works) {
    initialValues.home_page_organization_how_its_work_header_title =
      how_it_works.data.home_page_organization_how_its_work_header_title;
    initialValues.home_page_organization_how_its_work_header_sub_title =
      how_it_works.data.home_page_organization_how_its_work_header_sub_title;
    initialValues.home_page_organization_how_its_work_header_text =
      how_it_works.data.home_page_organization_how_its_work_header_text;
    initialValues.home_page_organization_how_its_work_button_link =
      how_it_works.data.home_page_organization_how_its_work_button_link;
    initialValues.home_page_organization_how_its_work_button_text =
      how_it_works.data.home_page_organization_how_its_work_button_text;
    initialValues.home_page_organization_how_its_work_favicon_1 =
      how_it_works.data.home_page_organization_how_its_work_favicon_1;
    initialValues.home_page_organization_how_its_work_header_text_1 =
      how_it_works.data.home_page_organization_how_its_work_header_text_1;
    initialValues.home_page_organization_how_its_work_header_title_1 =
      how_it_works.data.home_page_organization_how_its_work_header_title_1;
    initialValues.home_page_organization_how_its_work_header_button_text_1 =
      how_it_works.data.home_page_organization_how_its_work_header_button_text_1;
    initialValues.home_page_organization_how_its_work_header_button_link_1 =
      how_it_works.data.home_page_organization_how_its_work_header_button_link_1;
    initialValues.home_page_organization_how_its_work_favicon_2 =
      how_it_works.data.home_page_organization_how_its_work_favicon_2;
    initialValues.home_page_organization_how_its_work_header_text_2 =
      how_it_works.data.home_page_organization_how_its_work_header_text_2;
    initialValues.home_page_organization_how_its_work_header_title_2 =
      how_it_works.data.home_page_organization_how_its_work_header_title_2;
    initialValues.home_page_organization_how_its_work_header_button_text_2 =
      how_it_works.data.home_page_organization_how_its_work_header_button_text_2;
    initialValues.home_page_organization_how_its_work_header_button_link_2 =
      how_it_works.data.home_page_organization_how_its_work_header_button_link_2;
    initialValues.home_page_organization_how_its_work_favicon_3 =
      how_it_works.data.home_page_organization_how_its_work_favicon_3;
    initialValues.home_page_organization_how_its_work_header_text_3 =
      how_it_works.data.home_page_organization_how_its_work_header_text_3;
    initialValues.home_page_organization_how_its_work_header_title_3 =
      how_it_works.data.home_page_organization_how_its_work_header_title_3;
    initialValues.home_page_organization_how_its_work_header_button_text_3 =
      how_it_works.data.home_page_organization_how_its_work_header_button_text_3;
    initialValues.home_page_organization_how_its_work_header_button_link_3 =
      how_it_works.data.home_page_organization_how_its_work_header_button_link_3;
    initialValues.home_page_organization_how_its_work_favicon_4 =
      how_it_works.data.home_page_organization_how_its_work_favicon_4;
    initialValues.home_page_organization_how_its_work_header_text_4 =
      how_it_works.data.home_page_organization_how_its_work_header_text_4;
    initialValues.home_page_organization_how_its_work_header_title_4 =
      how_it_works.data.home_page_organization_how_its_work_header_title_4;
    initialValues.home_page_organization_how_its_work_header_button_text_4 =
      how_it_works.data.home_page_organization_how_its_work_header_button_text_4;
    initialValues.home_page_organization_how_its_work_header_button_link_4 =
      how_it_works.data.home_page_organization_how_its_work_header_button_link_4;
  }
  /**
   * This function will call on submit, and data will get updated
   */
  const { mutate: doUpdateHowItWorks, isLoading } = useUpdateOrganisationHowItWorks((response) => {
    if (response.data.length > 0) {
      response.data.map(async (value) => {
        fileToDataUri(formikValues[value.fieldname]).then(async (dataUri) => {
          await s3BucketFileUpload(dataUri, formikValues[value.fieldname].type, value.uploadURL);
        });
      });
    }
    toast.success(response.message);
    setTimeout(() => {
      doViewHowItWorks();
    }, 3000);
  });
  /**
   * !This block will call on click cancel button, It'll open alert for user,
   * and user will be redirected to the dashboard page after confirmation
   */
  const handleCancel = (dirty) => {
    if (dirty && dirty !== undefined) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="alert-box">
              <FontAwesomeIcon
                className="alert-close"
                icon={faClose}
                onClick={() => {
                  onClose();
                }}
              />
              <div className="alert-popup">
                <h2
                  dangerouslySetInnerHTML={{
                    __html: t('page.reset_alert_popup_message'),
                  }}></h2>
                <Button
                  className="table-delete-button"
                  onClick={() => {
                    onClose();
                    navigate(`/dashboard/`);
                  }}>
                  {t('page.alert_popup_yes_button')}
                </Button>
                <Button className="table-primary-button" onClick={onClose}>
                  {t('page.alert_popup_no_button')}
                </Button>
              </div>
            </div>
          );
        },
      });
    } else {
      navigate(`/dashboard/`);
    }
  };
  return (
    <>
      <Nav className="tab-navigation">
        <Nav.Item>
          <NavLink to="/settings/organisation-how-it-works">
            {t('page.sidebar_organisation_how_it_works')}
          </NavLink>
        </Nav.Item>
      </Nav>
      <Card className="inner-box px-4">
        <h1 className="page-heading-center">{t('page.sidebar_organisation_how_it_works_lebel')}</h1>
        {!isLoadingData && (
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              doUpdateHowItWorks(values);
            }}>
            {({ handleSubmit, dirty, values }) => {
              setFormikValues(values);
              return (
                <Form onSubmit={handleSubmit}>
                  <Accordion defaultActiveKey="0">
                    {/* How It Works Section Details */}
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        {t(
                          'page.settings_home_page_organization_how_it_works_section_detail_label'
                        )}
                      </Accordion.Header>
                      <Accordion.Body>
                        <SectionDetail t={t} />
                      </Accordion.Body>
                    </Accordion.Item>

                    {/* Card One Detail */}
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>
                        {t(
                          'page.settings_home_page_organization_how_it_works_card_one_detail_label'
                        )}
                      </Accordion.Header>
                      <Accordion.Body>
                        <CardOneDetail t={t} />
                      </Accordion.Body>
                    </Accordion.Item>

                    {/* Card Two Detail */}
                    <Accordion.Item eventKey="2">
                      <Accordion.Header>
                        {t(
                          'page.settings_home_page_organization_how_it_works_card_two_detail_label'
                        )}
                      </Accordion.Header>
                      <Accordion.Body>
                        <CardTwoDetail t={t} />
                      </Accordion.Body>
                    </Accordion.Item>

                    {/* Card 3 Detail */}
                    <Accordion.Item eventKey="3">
                      <Accordion.Header>
                        {t(
                          'page.settings_home_page_organization_how_it_works_card_three_detail_label'
                        )}
                      </Accordion.Header>
                      <Accordion.Body>
                        <CardThreeDetail t={t} />
                      </Accordion.Body>
                    </Accordion.Item>

                    {/* Card 4 Detail */}
                    <Accordion.Item eventKey="4">
                      <Accordion.Header>
                        {t(
                          'page.settings_home_page_organization_how_it_works_card_four_detail_label'
                        )}
                      </Accordion.Header>
                      <Accordion.Body>
                        <CardFourDetail t={t} />
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                  <div className="primary-button">
                    <Link to="#" className="link-center" onClick={handleCancel}>
                      {t('page.settings_home_page_organization_how_it_works_cancel_btn')}
                    </Link>
                    <TNButton
                      type="submit"
                      disabled={isLoadingData}
                      loading={isLoading}
                      isdirtyform={dirty && dirty !== undefined ? 1 : 0}>
                      {t('page.settings_home_page_organization_how_it_works_submit_btn')}
                    </TNButton>
                  </div>
                </Form>
              );
            }}
          </Formik>
        )}
      </Card>
    </>
  );
};
OrganisationHowItWorks.propTypes = {
  t: PropTypes.func,
};
export default OrganisationHowItWorks;
