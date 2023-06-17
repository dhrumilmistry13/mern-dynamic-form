import React, { useRef } from 'react';
import propTypes from 'prop-types';
import { Col, Form, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useFormikContext } from 'formik';

import { imagePreviewFromik } from 'helpers';

const CardFourDetail = ({ t }) => {
  const cardFourFaviconRef = useRef();
  const { errors, values, touched, handleBlur, handleChange, setFieldValue } = useFormikContext();

  return (
    <>
      <Row>
        <Col lg={6} md={6} xs={12}>
          <div className="change-align">
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_organization_how_it_works_card_four_favicon_label')}:
            </Form.Label>
            <Form.Control
              className="d-none "
              type="file"
              accept="image/*"
              ref={cardFourFaviconRef}
              name="home_page_organization_how_its_work_favicon_4"
              onChange={(event) => {
                setFieldValue(
                  'home_page_organization_how_its_work_favicon_4',
                  event.currentTarget.files[0]
                );
              }}
              onBlur={handleBlur}
            />
            <button
              type="button"
              onClick={() => cardFourFaviconRef.current.click()}
              className="btn btn-outline-primary ms-3">
              {t('page.settings_home_page_organization_how_it_works_card_four_upload_btn')}
            </button>
            <div className="preview-image change-align">
              <div>
                {values?.home_page_organization_how_its_work_favicon_4 &&
                values?.home_page_organization_how_its_work_favicon_4 ? (
                  <>
                    <img
                      className="preview-image"
                      src={imagePreviewFromik(
                        values?.home_page_organization_how_its_work_favicon_4
                      )}
                      alt="banner-img"
                    />
                    <FontAwesomeIcon
                      onClick={() => {
                        setFieldValue('home_page_organization_how_its_work_favicon_4', null);
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
            {touched.home_page_organization_how_its_work_favicon_4 &&
            errors.home_page_organization_how_its_work_favicon_4 ? (
              <div>{t(errors.home_page_organization_how_its_work_favicon_4)}</div>
            ) : null}
          </div>
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_organization_secrion_card_four_title_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (touched.home_page_organization_how_its_work_header_title_4 &&
                errors.home_page_organization_how_its_work_header_title_4
                  ? 'form-field-error'
                  : touched.home_page_organization_how_its_work_header_title_4 &&
                    !errors.home_page_organization_how_its_work_header_title_4
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_organization_how_its_work_header_title_4"
              placeholder={t(
                'page.settings_home_page_organization_secrion_card_four_title_placeholder'
              )}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.home_page_organization_how_its_work_header_title_4}
            />
            <div className="form-field-error-text">
              {touched.home_page_organization_how_its_work_header_title_4 &&
              errors.home_page_organization_how_its_work_header_title_4 ? (
                <div>{t(errors.home_page_organization_how_its_work_header_title_4)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_organization_card_four_description_label')}:
            </Form.Label>
            <Form.Control
              className={
                touched.home_page_organization_how_its_work_header_text_4 &&
                errors.home_page_organization_how_its_work_header_text_4
                  ? 'form-field-error'
                  : touched.home_page_organization_how_its_work_header_text_4 &&
                    !errors.home_page_organization_how_its_work_header_text_4
                  ? 'form-field-success'
                  : ''
              }
              as="textarea"
              rows={5}
              type="text"
              name="home_page_organization_how_its_work_header_text_4"
              placeholder={t(
                'page.settings_home_page_organization_card_four_description_placeholder'
              )}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.home_page_organization_how_its_work_header_text_4}
            />
            <div className="form-field-error-text">
              {touched.home_page_organization_how_its_work_header_text_4 &&
              errors.home_page_organization_how_its_work_header_text_4 ? (
                <div>{t(errors.home_page_organization_how_its_work_header_text_4)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_organization_section_card_four_btn_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (touched.home_page_organization_how_its_work_header_button_text_4 &&
                errors.home_page_organization_how_its_work_header_button_text_4
                  ? 'form-field-error'
                  : touched.home_page_organization_how_its_work_header_button_text_4 &&
                    !errors.home_page_organization_how_its_work_header_button_text_4
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_organization_how_its_work_header_button_text_4"
              placeholder={t(
                'page.settings_home_page_organization_section_card_four_btn_placeholder'
              )}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.home_page_organization_how_its_work_header_button_text_4}
            />
            <div className="form-field-error-text">
              {touched.home_page_organization_how_its_work_header_button_text_4 &&
              errors.home_page_organization_how_its_work_header_button_text_4 ? (
                <div>{t(errors.home_page_organization_how_its_work_header_button_text_4)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_organization_section_card_four_btn_link_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (touched.home_page_organization_how_its_work_header_button_link_4 &&
                errors.home_page_organization_how_its_work_header_button_link_4
                  ? 'form-field-error'
                  : touched.home_page_organization_how_its_work_header_button_link_4 &&
                    !errors.home_page_organization_how_its_work_header_button_link_4
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_organization_how_its_work_header_button_link_4"
              placeholder={t(
                'page.settings_home_page_organization_section_card_four_btn_link_placeholder'
              )}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.home_page_organization_how_its_work_header_button_link_4}
            />
            <div className="form-field-error-text">
              {touched.home_page_organization_how_its_work_header_button_link_4 &&
              errors.home_page_organization_how_its_work_header_button_link_4 ? (
                <div>{t(errors.home_page_organization_how_its_work_header_button_link_4)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};
CardFourDetail.propTypes = {
  t: propTypes.func,
};
export { CardFourDetail };
