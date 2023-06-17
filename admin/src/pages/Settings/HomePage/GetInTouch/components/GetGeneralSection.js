import React from 'react';
import propTypes from 'prop-types';
import { Col, Form, Row } from 'react-bootstrap';

const GetGeneralSection = ({ formik, t }) => {
  return (
    <>
      <Row>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_get_in_touch_title_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (formik.touched.home_page_get_in_touch_header_title &&
                formik.errors.home_page_get_in_touch_header_title
                  ? 'form-field-error'
                  : formik.touched.home_page_get_in_touch_header_title &&
                    !formik.errors.home_page_get_in_touch_header_title
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_get_in_touch_header_title"
              placeholder={t('page.settings_home_page_get_in_touch_title_placeholder')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.home_page_get_in_touch_header_title}
            />
            <div className="form-field-error-text">
              {formik.touched.home_page_get_in_touch_header_title &&
              formik.errors.home_page_get_in_touch_header_title ? (
                <div>{t(formik.errors.home_page_get_in_touch_header_title)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_get_in_touch_sub_title_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (formik.touched.home_page_get_in_touch_header_sub_title &&
                formik.errors.home_page_get_in_touch_header_sub_title
                  ? 'form-field-error'
                  : formik.touched.home_page_get_in_touch_header_sub_title &&
                    !formik.errors.home_page_get_in_touch_header_sub_title
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_get_in_touch_header_sub_title"
              placeholder={t('page.settings_home_page_get_in_touch_sub_title_placeholder')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.home_page_get_in_touch_header_sub_title}
            />
            <div className="form-field-error-text">
              {formik.touched.home_page_get_in_touch_header_sub_title &&
              formik.errors.home_page_get_in_touch_header_sub_title ? (
                <div>{t(formik.errors.home_page_get_in_touch_header_sub_title)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_get_in_touch_description_label')}:
            </Form.Label>
            <Form.Control
              className={
                formik.touched.home_page_get_in_touch_header_text &&
                formik.errors.home_page_get_in_touch_header_text
                  ? 'form-field-error'
                  : formik.touched.home_page_get_in_touch_header_text &&
                    !formik.errors.home_page_get_in_touch_header_text
                  ? 'form-field-success'
                  : ''
              }
              as="textarea"
              rows={5}
              type="text"
              name="home_page_get_in_touch_header_text"
              placeholder={t('page.settings_home_page_get_in_touch_description_placeholder')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.home_page_get_in_touch_header_text}
            />
            <div className="form-field-error-text">
              {formik.touched.home_page_get_in_touch_header_text &&
              formik.errors.home_page_get_in_touch_header_text ? (
                <div>{t(formik.errors.home_page_get_in_touch_header_text)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};
GetGeneralSection.propTypes = {
  formik: propTypes.any,
  t: propTypes.func,
  imagePreviewFromik: propTypes.func,
};
export { GetGeneralSection };
