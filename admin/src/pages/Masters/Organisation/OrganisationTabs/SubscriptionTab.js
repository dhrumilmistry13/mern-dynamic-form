import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

import validationSchema from './SubscriptionValidation';
import { TNBreadCurm, TNButton } from 'common/components';
import {
  useCancelOrganizationSubscriptionData,
  useSubscriptionOrganisationData,
  useSubscriptionOrganisationStore,
} from 'hooks';
import { currencyFormatFloat, setFormatDate } from 'helpers';
import TabsNavBar from './TabsNavBar';

const SubscriptionTab = ({ t }) => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const [isdirtyform, setIsdirtyform] = useState(0);
  let initialValues = {
    amount: 1,
    user_id,
  };

  /**
   * !This API will call while Function call and set data. Once data load we Cancel Subscription
   */
  const { mutate: doCancelOrganizationSubscriptionData, isLoading: isLoadingcancel } =
    useCancelOrganizationSubscriptionData((res) => {
      toast.success(res.message);
      refetch();
    });

  /**
   * This function will do Cancel Subscription
   */
  const handelCancelSubscription = () => {
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
              <h2>{t('page.org_subscription_cancel_confirm_header_text')}</h2>
              <Button
                className="table-delete-button"
                onClick={() => {
                  doCancelOrganizationSubscriptionData({ user_id });
                  onClose();
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
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      doSubscriptionOrganisation(values);
    },
  });
  // Initial Values of General data of organisation
  /**
   * !This API will call when page set. When response came we are setting up data into the form
   */
  const {
    isLoading: isLoadingData,
    data: organisation,
    refetch,
  } = useSubscriptionOrganisationData(user_id, (organisation) => {
    if (
      organisation.data.current_subscription == '' &&
      organisation.data.cancel_subscription !== ''
    ) {
      formik.setFieldValue(
        'amount',
        parseFloat(organisation.data.cancel_subscription.plan_amount).toFixed(2)
      );
    } else if (
      organisation.data.current_subscription !== '' &&
      organisation.data.cancel_subscription === ''
    ) {
      formik.setFieldValue(
        'amount',
        parseFloat(organisation.data.current_subscription.plan_amount).toFixed(2)
      );
    }
    if (
      organisation.data.card_data != '' &&
      organisation.data.current_subscription == '' &&
      organisation.data.cancel_subscription == ''
    ) {
      setIsdirtyform(1);
    } else if (
      organisation.data.card_data !== '' &&
      organisation.data.current_subscription !== '' &&
      organisation.data.cancel_subscription === '' &&
      moment(organisation.data.current_subscription.renewed_date)
        .subtract(1, 'days')
        .format('YYYY-MM-DD') <= moment().format('YYYY-MM-DD')
    ) {
      setIsdirtyform(1);
    } else if (
      organisation.data.card_data !== '' &&
      organisation.data.current_subscription === '' &&
      organisation.data.cancel_subscription !== '' &&
      moment(organisation.data.cancel_subscription.renewed_date)
        .subtract(1, 'days')
        .format('YYYY-MM-DD') <= moment().format('YYYY-MM-DD')
    ) {
      setIsdirtyform(1);
    } else {
      setIsdirtyform(0);
    }
  });
  const handleCancel = () => {
    navigate(`/organisation/list`);
  };
  /**
   * !This API will call when user click on Submit Button
   */
  const { mutate: doSubscriptionOrganisation, isLoading } = useSubscriptionOrganisationStore(
    (response) => {
      toast.success(response.message);
      refetch();
    }
  );
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
      label: t('page.vew_subscription_organisation_label'),
      link: '',
      active: 'active',
    },
  ];

  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <TabsNavBar user_id={user_id} t={t} />
      <Card className="inner-box">
        <Card.Body>
          <h1 className="page-heading-center ">
            {t('page.view_subscription_detail_organisation_label')}
          </h1>
        </Card.Body>
        <Form className="edit-profile-form" onSubmit={formik.handleSubmit}>
          <Row>
            <Col lg={12}>
              {!isLoadingData && organisation && organisation.data.card_data == '' ? (
                <Alert variant={'danger'}>{t('page.view_subscription_card_not_add')}</Alert>
              ) : (
                ''
              )}
              {isdirtyform === 1 &&
              organisation &&
              organisation.data.current_subscription === '' ? (
                <Alert variant={'warning'}>{t('page.view_subscription_not_added')}</Alert>
              ) : organisation && organisation.data.current_subscription !== '' ? (
                <Form.Label className="field-label field-label-top">
                  {t('page.org_subscription_current_header_text')}
                  {setFormatDate(organisation.data.current_subscription.renewed_date)}
                </Form.Label>
              ) : organisation && organisation.data.cancel_subscription !== '' ? (
                <>
                  <Form.Label className="field-label field-label-top">
                    {t('page.org_subscription_cancel_header_text')}
                    {setFormatDate(organisation.data.cancel_subscription.renewed_date)}
                  </Form.Label>
                  <Form.Label className="field-label field-label-top">
                    {t('page.org_subscription_cancel_date_text')}
                    {setFormatDate(organisation.data.cancel_subscription.cancelled_date)}
                  </Form.Label>
                </>
              ) : (
                ''
              )}
              <Form.Group>
                <Form.Label className="field-label field-label-top">
                  {t('page.subscription_amount_label')}
                </Form.Label>
                <Form.Control
                  className={
                    'form-field-height ' +
                    (formik.touched.amount && formik.errors.amount
                      ? 'form-field-error'
                      : formik.touched.amount && !formik.errors.amount
                      ? 'form-field-success'
                      : '')
                  }
                  type="text"
                  name="amount"
                  placeholder={t('page.subscription_amount_placeholder')}
                  onChange={(e) => {
                    formik.setFieldValue('amount', currencyFormatFloat(e));
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.amount}
                />
                <div className="form-field-error-text">
                  {formik.touched.amount && formik.errors.amount ? (
                    <div>{t(formik.errors.amount)}</div>
                  ) : null}
                </div>
              </Form.Group>
            </Col>
          </Row>
          <div className="primary-button">
            <span className="link-center" onClick={handleCancel}>
              {t('page.cancel_button_text')}
            </span>
            <TNButton type="submit" isdirtyform={isdirtyform} loading={isLoading}>
              {!isLoadingData &&
              organisation.data.card_data != '' &&
              organisation.data.current_subscription == '' &&
              organisation.data.cancel_subscription == ''
                ? t('page.org_subscription_add_button_text')
                : !isLoadingData &&
                  organisation.data.card_data !== '' &&
                  organisation.data.current_subscription !== '' &&
                  organisation.data.cancel_subscription === ''
                ? t('page.org_subscription_re_button_text')
                : !isLoadingData &&
                  organisation.data.card_data !== '' &&
                  organisation.data.current_subscription === '' &&
                  organisation.data.cancel_subscription !== ''
                ? t('page.org_subscription_re_button_text')
                : t('page.org_subscription_add_button_text')}
            </TNButton>
            {organisation && organisation.data.current_subscription !== '' ? (
              <TNButton type="button" onClick={handelCancelSubscription} loading={isLoadingcancel}>
                {t('page.cancel_subscription_button_text')}
              </TNButton>
            ) : (
              ''
            )}
          </div>
        </Form>
      </Card>
    </>
  );
};
SubscriptionTab.propTypes = {
  t: PropTypes.func,
};
export default SubscriptionTab;
