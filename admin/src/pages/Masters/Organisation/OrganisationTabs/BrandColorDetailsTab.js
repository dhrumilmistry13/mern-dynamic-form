import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Form, Modal, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

import { useViewBrandColor } from 'hooks';
import TabsNavBar from './TabsNavBar';
import { TNBreadCurm } from 'common/components';
import { checkAllValueEmptyInObj } from 'helpers';

const BrandColorDetailsTab = ({ t }) => {
  const { user_id } = useParams();
  const [modalShow, setModalShow] = useState(false);
  const [modalImgUrl, setModalImgUrl] = useState('');
  const navigate = useNavigate();

  /**
   * Initial Values for brand Colors
   */
  let brandColos = {
    menu_text_color: '',
    button_icon_color: '',
    heading_color: '',
    text_color: '',
    background_color: '',
    header_logo: '',
    footer_logo: '',
  };

  /**
   * !This API will call when page set. When response came we are setting up data into the form
   */
  const { isLoading: isLoadingData, data: brandColorData } = useViewBrandColor(user_id);
  if (!isLoadingData && brandColorData) {
    brandColos = {
      menu_text_color: brandColorData.data.menu_text_color,
      button_icon_color: brandColorData.data.button_icon_color,
      heading_color: brandColorData.data.heading_color,
      text_color: brandColorData.data.text_color,
      background_color: brandColorData.data.background_color,
      header_logo: brandColorData.data.header_logo,
      footer_logo: brandColorData.data.footer_logo,
    };
  }

  /**
   * !This block will call on click cancel, and user will be navigate to the listing page
   */
  const handleCancel = () => {
    navigate(`/organisation/list`);
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
      label: t('page.view_brand_color_organisation_label'),
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
          <h1 className="page-heading-center ">{t('page.view_brand_color_organisation_label')}</h1>
          {!checkAllValueEmptyInObj(brandColos) ? (
            <>
              <Row>
                <Col lg={6}>
                  <Row>
                    <Col lg={5} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.organisation_menu_text_color_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1}>
                      :
                    </Col>
                    <Col lg={6} xs={5}>
                      <span>{brandColos.menu_text_color && brandColos.menu_text_color}</span>
                    </Col>
                  </Row>
                </Col>
                <Col lg={6}>
                  <Row>
                    <Col lg={5} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.organisation_btn_icon_color_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1}>
                      :
                    </Col>
                    <Col lg={6} xs={5}>
                      <span>{brandColos.button_icon_color && brandColos.button_icon_color}</span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <Row>
                    <Col lg={5} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.organisation_heading_color_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1}>
                      :
                    </Col>
                    <Col lg={6} xs={5}>
                      <span>{brandColos.heading_color && brandColos.heading_color}</span>
                    </Col>
                  </Row>
                </Col>
                <Col lg={6}>
                  <Row>
                    <Col lg={5} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.organisation_text_color_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1}>
                      :
                    </Col>
                    <Col lg={6} xs={5}>
                      <span>{brandColos.text_color && brandColos.text_color}</span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <Row>
                    <Col lg={5} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.organisation_background_color_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1}>
                      :
                    </Col>
                    <Col lg={6} xs={5}>
                      <span>{brandColos.background_color && brandColos.background_color}</span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <Row>
                    <Col lg={5} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.organisation_header_image_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1}>
                      :
                    </Col>
                    <Col lg={6} xs={5}>
                      {brandColos.header_logo && (
                        <img
                          className="preview-image"
                          src={brandColos.header_logo && brandColos.header_logo}
                          alt="header-image"
                          onClick={() => {
                            setModalImgUrl(brandColos.header_logo);
                            setModalShow(true);
                          }}
                        />
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col lg={6}>
                  <Row>
                    <Col lg={5} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.organisation_footer_image_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1}>
                      :
                    </Col>
                    <Col lg={6} xs={5}>
                      {brandColos.footer_logo && (
                        <img
                          className="preview-image"
                          src={brandColos.footer_logo && brandColos.footer_logo}
                          alt="footer-logo"
                          onClick={() => {
                            setModalImgUrl(brandColos.footer_logo);
                            setModalShow(true);
                          }}
                        />
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </>
          ) : (
            <h5 className="page-heading-center">{t('page.organisation_no_data_found')}</h5>
          )}
        </Card.Body>
        <Modal show={modalShow} aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Body className="text-center">
            <div className="close-popup">
              <FontAwesomeIcon icon={faClose} onClick={() => setModalShow(false)} />
            </div>
            <img className="text-center" src={modalImgUrl} alt="image" />
          </Modal.Body>
        </Modal>
        <div className="primary-button">
          <span className="link-center" onClick={handleCancel}>
            {t('page.cancel_button_text')}
          </span>
        </div>
      </Card>
    </>
  );
};
BrandColorDetailsTab.propTypes = {
  t: PropTypes.func,
};
export default BrandColorDetailsTab;
