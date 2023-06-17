import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Form, Modal, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import { TNBreadCurm } from 'common/components';
import { useViewFormulary } from 'hooks';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { defaultValue } from 'helpers';

const ViewFormularyPage = ({ t }) => {
  const { formulary_id } = useParams();
  // Modal Image preview
  const [modalShow, setModalShow] = useState(false);
  const [modalImgUrl, setModalImgUrl] = useState('');
  const navigate = useNavigate();
  /**
   * This is InitialValues object
   */
  let initialValues = {
    name: '',
    ndc: '',
    dosage_amount: '',
    price: '',
    description: '',
    sequence: '',
    short_description: '',
    status: '',
    packing_shipping_fee: '',
    is_appointment_required: '',
    featured_image: '',
    formulary_image: [],
  };
  /**
   * !This API will call when page set. When response came we are setting up data into the form
   */
  const { isLoading: isLoadingData, data: formulary } = useViewFormulary(formulary_id);
  if (!isLoadingData && formulary) {
    initialValues = {
      name: formulary.data.name,
      ndc: formulary.data.ndc,
      dosage_amount: formulary.data.dosage_amount,
      price: formulary.data.price,
      description: formulary.data.description,
      short_description: formulary.data.short_description,
      sequence: formulary.data.sequence,
      status: formulary.data.status,
      packing_shipping_fee: formulary.data.packing_shipping_fee,
      is_appointment_required: formulary.data.is_appointment_required,
      featured_image: formulary.data.featured_image,
      formulary_image: formulary.data.formulary_image,
    };
  }
  /**
   * Default options for status
   */
  const options = [
    { value: '', label: `${t('page.select_status')}` },
    { value: 1, label: `${t('page.active_status_name')}` },
    { value: 2, label: `${t('page.in_active_status_name')}` },
  ];
  const appointmentOptions = [
    { value: '', label: `${t('page.select_is_appointment_required')}` },
    { value: 1, label: `${t('page.is_appointment_required_yes_name')}` },
    { value: 2, label: `${t('page.is_appointment_required_no_name')}` },
  ];

  /**
   * BreadCum labels and links
   */
  const breadcurmArray = [
    {
      label: t('page.formulary_list_label'),
      link: '/formulary/list',
      active: '',
    },
    {
      label: t('page.view_formulary_label'),
      link: '',
      active: 'active',
    },
  ];
  /**
   * This function will call on cancel button click, and will redirect user to listing page
   */
  const handleCancel = () => {
    navigate(`/formulary/list`);
  };
  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <Card className="inner-box">
        <Card.Body>
          <h1 className="page-heading-center ">{t('page.view_formulary_label')}</h1>
          <Row>
            <Col lg={6} md={12} sm={12}>
              <Row>
                <Col lg={6}>
                  <Form.Label className="field-label">{t('page.formulary_name_label')}</Form.Label>
                </Col>
                <Col lg={1} xs={1}>
                  :
                </Col>
                <Col>
                  <span> {initialValues.name && initialValues.name} </span>
                </Col>
              </Row>
            </Col>
            <Col lg={6} md={12} sm={12}>
              <Row>
                <Col lg={6} xs={6}>
                  <Form.Label className="field-label">{t('page.formulary_ndc_label')}</Form.Label>
                </Col>
                <Col lg={1} xs={1}>
                  :
                </Col>
                <Col lg={5} xs={5}>
                  <span> {initialValues.ndc && initialValues.ndc} </span>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={12} sm={12}>
              <Row>
                <Col lg={6} xs={6}>
                  <Form.Label className="field-label">
                    {t('page.formulary_dosage_amount_label')}
                  </Form.Label>
                </Col>
                <Col lg={1} xs={1}>
                  :
                </Col>
                <Col lg={5} xs={5}>
                  <span> {initialValues.dosage_amount && initialValues.dosage_amount}</span>
                </Col>
              </Row>
            </Col>
            <Col lg={6} md={12} sm={12}>
              <Row>
                <Col lg={6} xs={6}>
                  <Form.Label className="field-label">{t('page.formulary_price_label')}</Form.Label>
                </Col>
                <Col lg={1} xs={1}>
                  :
                </Col>
                <Col lg={5} xs={5}>
                  <span> {initialValues.price && initialValues.price}</span>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col md={12} sm={12}>
              <Row>
                <Col lg={3} xs={6}>
                  <Form.Label className="field-label">
                    {t('page.formulary_description_label')}
                  </Form.Label>
                </Col>
                <Col lg={1} xs={1} className="divider">
                  :
                </Col>
                <Col lg={8} xs={5}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: initialValues.description && initialValues.description,
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col md={12} sm={12}>
              <Row>
                <Col lg={3} xs={6}>
                  <Form.Label className="field-label">
                    {t('page.formulary_short_description_label')}
                  </Form.Label>
                </Col>
                <Col lg={1} xs={1} className="divider">
                  :
                </Col>
                <Col lg={8} xs={5}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: initialValues.short_description && initialValues.short_description,
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={12} sm={12}>
              <Row>
                <Col lg={6} xs={6}>
                  <Form.Label className="field-label">
                    {t('page.formulary_status_label')}
                  </Form.Label>
                </Col>
                <Col lg={1} xs={1}>
                  :
                </Col>
                <Col lg={5} xs={5}>
                  <span>{defaultValue(options, initialValues.status).label}</span>
                </Col>
              </Row>
            </Col>
            <Col lg={6} md={12} sm={12}>
              <Row>
                <Col lg={6} xs={6}>
                  <Form.Label className="field-label">
                    {t('page.formulary_sequence_label')}
                  </Form.Label>
                </Col>
                <Col lg={1} xs={1}>
                  :
                </Col>
                <Col lg={5} xs={5}>
                  <span> {initialValues.sequence && initialValues.sequence}</span>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={12} sm={12}>
              <Row>
                <Col lg={6} xs={6}>
                  <Form.Label className="field-label">
                    {t('page.formulary_is_appointment_required_label')}
                  </Form.Label>
                </Col>
                <Col lg={1} xs={1}>
                  :
                </Col>
                <Col lg={5} xs={5}>
                  <span>
                    {defaultValue(appointmentOptions, initialValues.is_appointment_required).label}
                  </span>
                </Col>
              </Row>
            </Col>
            <Col lg={6} md={12} sm={12}>
              <Row>
                <Col lg={6} xs={6}>
                  <Form.Label className="field-label">
                    {t('page.formulary_packing_shipping_fee_label')}
                  </Form.Label>
                </Col>
                <Col lg={1} xs={1}>
                  :
                </Col>
                <Col lg={5} xs={5}>
                  <span>
                    {initialValues.packing_shipping_fee && initialValues.packing_shipping_fee}
                  </span>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={12} sm={12}>
              <Row className="align-items-center">
                <Col lg={6} xs={6}>
                  <Form.Label className="field-label">{t('page.featured_image_label')}</Form.Label>
                </Col>
                <Col lg={1} xs={1}>
                  :
                </Col>
                <Col lg={5} xs={5}>
                  {initialValues.featured_image && (
                    <div className="preview-image">
                      <img
                        width={150}
                        src={initialValues.featured_image}
                        alt="featured=image"
                        onClick={() => {
                          setModalImgUrl(initialValues.featured_image);
                          setModalShow(true);
                        }}
                      />
                    </div>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col lg={3} xs={6}>
              <Form.Label className="field-label">{t('page.formulary_image_label')}</Form.Label>
            </Col>
            <Col lg={1} xs={1}>
              :
            </Col>
            <Col lg={12} className="display-flex">
              {initialValues?.formulary_image &&
                initialValues.formulary_image.map((item) => (
                  <div className="preview-image" key={item.formulary_image_id}>
                    <img
                      src={item.image_name ? item.image_name : ''}
                      alt="formulary-image"
                      onClick={() => {
                        setModalImgUrl(item.image_name);
                        setModalShow(true);
                      }}
                    />
                  </div>
                ))}
            </Col>
          </Row>
          <div className="primary-button">
            <span className="link-center" onClick={handleCancel}>
              {t('page.cancel_button_text')}
            </span>
          </div>
          <Modal show={modalShow} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Body className="text-center">
              <div className="close-popup">
                <FontAwesomeIcon icon={faClose} onClick={() => setModalShow(false)} />
              </div>
              <img className="text-center" src={modalImgUrl} alt="profile_img" />
            </Modal.Body>
          </Modal>
        </Card.Body>
      </Card>
    </>
  );
};
ViewFormularyPage.propTypes = {
  t: PropTypes.func,
};
export default ViewFormularyPage;
