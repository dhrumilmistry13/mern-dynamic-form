import React, { useRef } from 'react';
import propTypes from 'prop-types';
import { Col, Form, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { imagePreviewFromik } from 'helpers';

const CardThreeDetail = ({ formik, t }) => {
  const cardThreeFaviconRef = useRef();

  return (
    <>
      <Row>
        <Col lg={6} md={6} xs={12}>
          <div className="change-align">
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_how_it_works_card_three_favicon_label')}:{' '}
            </Form.Label>
            <Form.Control
              className={
                ' d-none ' +
                (formik.touched.home_page_how_its_work_favicon_3 &&
                formik.errors.home_page_how_its_work_favicon_3
                  ? 'form-field-error'
                  : formik.touched.home_page_how_its_work_favicon_3 &&
                    !formik.errors.home_page_how_its_work_favicon_3
                  ? 'form-field-success'
                  : '')
              }
              type="file"
              accept="image/*"
              ref={cardThreeFaviconRef}
              name="home_page_how_its_work_favicon_3"
              onChange={(event) => {
                formik.setFieldValue(
                  'home_page_how_its_work_favicon_3',
                  event.currentTarget.files[0]
                );
              }}
              onBlur={formik.handleBlur}
            />
            <button
              type="button"
              onClick={() => cardThreeFaviconRef.current.click()}
              className="btn btn-outline-primary ms-3">
              {t('page.settings_home_page_how_it_works_card_three_upload_btn')}
            </button>
            <div className="preview-image change-align">
              <div>
                {formik?.values?.home_page_how_its_work_favicon_3 &&
                formik?.values?.home_page_how_its_work_favicon_3 ? (
                  <>
                    <img
                      width={'100px'}
                      src={imagePreviewFromik(formik.values?.home_page_how_its_work_favicon_3)}
                      alt="banner-img"
                    />
                    <FontAwesomeIcon
                      onClick={() => {
                        formik.setFieldValue('home_page_how_its_work_favicon_3', null);
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
            {formik.touched.home_page_how_its_work_favicon_3 &&
            formik.errors.home_page_how_its_work_favicon_3 ? (
              <div>{t(formik.errors.home_page_how_its_work_favicon_3)}</div>
            ) : null}
          </div>
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_secrion_card_three_title_label')}:{' '}
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (formik.touched.home_page_how_its_work_header_title_3 &&
                formik.errors.home_page_how_its_work_header_title_3
                  ? 'form-field-error'
                  : formik.touched.home_page_how_its_work_header_title_3 &&
                    !formik.errors.home_page_how_its_work_header_title_3
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_how_its_work_header_title_3"
              placeholder={t('page.settings_home_page_secrion_card_three_title_placeholder')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.home_page_how_its_work_header_title_3}
            />
            <div className="form-field-error-text">
              {formik.touched.home_page_how_its_work_header_title_3 &&
              formik.errors.home_page_how_its_work_header_title_3 ? (
                <div>{t(formik.errors.home_page_how_its_work_header_title_3)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_card_three_description_label')}:{' '}
            </Form.Label>
            <Form.Control
              className={
                formik.touched.home_page_how_its_work_header_text_3 &&
                formik.errors.home_page_how_its_work_header_text_3
                  ? 'form-field-error'
                  : formik.touched.home_page_how_its_work_header_text_3 &&
                    !formik.errors.home_page_how_its_work_header_text_3
                  ? 'form-field-success'
                  : ''
              }
              as="textarea"
              rows={5}
              type="text"
              name="home_page_how_its_work_header_text_3"
              placeholder={t('page.settings_home_page_card_three_description_placeholder')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.home_page_how_its_work_header_text_3}
            />
            <div className="form-field-error-text">
              {formik.touched.home_page_how_its_work_header_text_3 &&
              formik.errors.home_page_how_its_work_header_text_3 ? (
                <div>{t(formik.errors.home_page_how_its_work_header_text_3)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_section_card_three_btn_label')}:{' '}
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (formik.touched.home_page_how_its_work_header_button_text_3 &&
                formik.errors.home_page_how_its_work_header_button_text_3
                  ? 'form-field-error'
                  : formik.touched.home_page_how_its_work_header_button_text_3 &&
                    !formik.errors.home_page_how_its_work_header_button_text_3
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_how_its_work_header_button_text_3"
              placeholder={t('page.settings_home_page_section_card_three_btn_placeholder')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.home_page_how_its_work_header_button_text_3}
            />
            <div className="form-field-error-text">
              {formik.touched.home_page_how_its_work_header_button_text_3 &&
              formik.errors.home_page_how_its_work_header_button_text_3 ? (
                <div>{t(formik.errors.home_page_how_its_work_header_button_text_3)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_section_card_three_btn_link_label')}:{' '}
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (formik.touched.home_page_how_its_work_header_button_link_3 &&
                formik.errors.home_page_how_its_work_header_button_link_3
                  ? 'form-field-error'
                  : formik.touched.home_page_how_its_work_header_button_link_3 &&
                    !formik.errors.home_page_how_its_work_header_button_link_3
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_how_its_work_header_button_link_3"
              placeholder={t('page.settings_home_page_section_card_one_btn_link_placeholder')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.home_page_how_its_work_header_button_link_3}
            />
            <div className="form-field-error-text">
              {formik.touched.home_page_how_its_work_header_button_link_3 &&
              formik.errors.home_page_how_its_work_header_button_link_3 ? (
                <div>{t(formik.errors.home_page_how_its_work_header_button_link_3)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};
CardThreeDetail.propTypes = {
  formik: propTypes.any,
  t: propTypes.func,
  imagePreviewFromik: propTypes.func,
};
export { CardThreeDetail };
