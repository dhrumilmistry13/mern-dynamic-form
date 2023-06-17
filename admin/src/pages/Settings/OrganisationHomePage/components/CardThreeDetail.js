import React, { useRef } from 'react';
import propTypes from 'prop-types';
import { Col, Form, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useFormikContext } from 'formik';

import { imagePreviewFromik } from 'helpers';

const CardThreeDetail = ({ t }) => {
  const cardThreeFaviconRef = useRef();
  const { errors, values, touched, handleBlur, handleChange, setFieldValue } = useFormikContext();

  return (
    <>
      <Row>
        <Col lg={6} md={6} xs={12}>
          <div className="change-align">
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_organization_how_it_works_card_three_favicon_label')}:
            </Form.Label>
            <Form.Control
              className="d-none "
              type="file"
              accept="image/*"
              ref={cardThreeFaviconRef}
              name="home_page_organization_how_its_work_favicon_3"
              onChange={(event) => {
                setFieldValue(
                  'home_page_organization_how_its_work_favicon_3',
                  event.currentTarget.files[0]
                );
              }}
              onBlur={handleBlur}
            />
            <button
              type="button"
              onClick={() => cardThreeFaviconRef.current.click()}
              className="btn btn-outline-primary ms-3">
              {t('page.settings_home_page_organization_how_it_works_card_three_upload_btn')}
            </button>
            <div className="preview-image change-align">
              <div>
                {values?.home_page_organization_how_its_work_favicon_3 &&
                values?.home_page_organization_how_its_work_favicon_3 ? (
                  <>
                    <img
                      className="preview-image"
                      src={imagePreviewFromik(
                        values?.home_page_organization_how_its_work_favicon_3
                      )}
                      alt="banner-img"
                    />
                    <FontAwesomeIcon
                      onClick={() => {
                        setFieldValue('home_page_organization_how_its_work_favicon_3', null);
                      }}
                      className="svg-inline--fa "
                      icon={faXmark}
                    />
                  </>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
          <div className="form-field-error-text">
            {touched.home_page_organization_how_its_work_favicon_3 &&
            errors.home_page_organization_how_its_work_favicon_3 ? (
              <div>{t(errors.home_page_organization_how_its_work_favicon_3)}</div>
            ) : null}
          </div>
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_organization_secrion_card_three_title_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (touched.home_page_organization_how_its_work_header_title_3 &&
                errors.home_page_organization_how_its_work_header_title_3
                  ? 'form-field-error'
                  : touched.home_page_organization_how_its_work_header_title_3 &&
                    !errors.home_page_organization_how_its_work_header_title_3
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_organization_how_its_work_header_title_3"
              placeholder={t(
                'page.settings_home_page_organization_secrion_card_three_title_placeholder'
              )}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.home_page_organization_how_its_work_header_title_3}
            />
            <div className="form-field-error-text">
              {touched.home_page_organization_how_its_work_header_title_3 &&
              errors.home_page_organization_how_its_work_header_title_3 ? (
                <div>{t(errors.home_page_organization_how_its_work_header_title_3)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_organization_card_three_description_label')}:
            </Form.Label>
            <Form.Control
              className={
                touched.home_page_organization_how_its_work_header_text_3 &&
                errors.home_page_organization_how_its_work_header_text_3
                  ? 'form-field-error'
                  : touched.home_page_organization_how_its_work_header_text_3 &&
                    !errors.home_page_organization_how_its_work_header_text_3
                  ? 'form-field-success'
                  : ''
              }
              as="textarea"
              rows={5}
              type="text"
              name="home_page_organization_how_its_work_header_text_3"
              placeholder={t(
                'page.settings_home_page_organization_card_three_description_placeholder'
              )}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.home_page_organization_how_its_work_header_text_3}
            />
            <div className="form-field-error-text">
              {touched.home_page_organization_how_its_work_header_text_3 &&
              errors.home_page_organization_how_its_work_header_text_3 ? (
                <div>{t(errors.home_page_organization_how_its_work_header_text_3)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_organization_section_card_three_btn_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (touched.home_page_organization_how_its_work_header_button_text_3 &&
                errors.home_page_organization_how_its_work_header_button_text_3
                  ? 'form-field-error'
                  : touched.home_page_organization_how_its_work_header_button_text_3 &&
                    !errors.home_page_organization_how_its_work_header_button_text_3
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_organization_how_its_work_header_button_text_3"
              placeholder={t(
                'page.settings_home_page_organization_section_card_three_btn_placeholder'
              )}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.home_page_organization_how_its_work_header_button_text_3}
            />
            <div className="form-field-error-text">
              {touched.home_page_organization_how_its_work_header_button_text_3 &&
              errors.home_page_organization_how_its_work_header_button_text_3 ? (
                <div>{t(errors.home_page_organization_how_its_work_header_button_text_3)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_organization_section_card_three_btn_link_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (touched.home_page_organization_how_its_work_header_button_link_3 &&
                errors.home_page_organization_how_its_work_header_button_link_3
                  ? 'form-field-error'
                  : touched.home_page_organization_how_its_work_header_button_link_3 &&
                    !errors.home_page_organization_how_its_work_header_button_link_3
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_organization_how_its_work_header_button_link_3"
              placeholder={t(
                'page.settings_home_page_organization_section_card_three_btn_link_placeholder'
              )}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.home_page_organization_how_its_work_header_button_link_3}
            />
            <div className="form-field-error-text">
              {touched.home_page_organization_how_its_work_header_button_link_3 &&
              errors.home_page_organization_how_its_work_header_button_link_3 ? (
                <div>{t(errors.home_page_organization_how_its_work_header_button_link_3)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};
CardThreeDetail.propTypes = {
  t: propTypes.func,
};
export { CardThreeDetail };
