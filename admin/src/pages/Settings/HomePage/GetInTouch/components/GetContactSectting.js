import React from 'react';
import propTypes from 'prop-types';
import { Col, Form, Row } from 'react-bootstrap';

const GetContactSectting = ({ formik, t }) => {
  return (
    <>
      <Row>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_get_in_touch_email_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (formik.touched.home_page_get_in_touch_header_email &&
                formik.errors.home_page_get_in_touch_header_email
                  ? 'form-field-error'
                  : formik.touched.home_page_get_in_touch_header_email &&
                    !formik.errors.home_page_get_in_touch_header_email
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_get_in_touch_header_email"
              placeholder={t('page.settings_home_page_get_in_touch_email_placeholder')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.home_page_get_in_touch_header_email}
            />
            <div className="form-field-error-text">
              {formik.touched.home_page_get_in_touch_header_email &&
              formik.errors.home_page_get_in_touch_header_email ? (
                <div>{t(formik.errors.home_page_get_in_touch_header_email)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_get_in_touch_contact_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (formik.touched.home_page_get_in_touch_header_contact_number &&
                formik.errors.home_page_get_in_touch_header_contact_number
                  ? 'form-field-error'
                  : formik.touched.home_page_get_in_touch_header_contact_number &&
                    !formik.errors.home_page_get_in_touch_header_contact_number
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_get_in_touch_header_contact_number"
              placeholder={t('page.settings_home_page_get_in_touch_contact_placeholder')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.home_page_get_in_touch_header_contact_number}
            />
            <div className="form-field-error-text">
              {formik.touched.home_page_get_in_touch_header_contact_number &&
              formik.errors.home_page_get_in_touch_header_contact_number ? (
                <div>{t(formik.errors.home_page_get_in_touch_header_contact_number)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_get_in_touch_send_email_button_text_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (formik.touched.home_page_get_in_touch_header_send_email &&
                formik.errors.home_page_get_in_touch_header_send_email
                  ? 'form-field-error'
                  : formik.touched.home_page_get_in_touch_header_send_email &&
                    !formik.errors.home_page_get_in_touch_header_send_email
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_get_in_touch_header_send_email"
              placeholder={t(
                'page.settings_home_page_get_in_touch_send_email_button_text_placeholder'
              )}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.home_page_get_in_touch_header_send_email}
            />
            <div className="form-field-error-text">
              {formik.touched.home_page_get_in_touch_header_send_email &&
              formik.errors.home_page_get_in_touch_header_send_email ? (
                <div>{t(formik.errors.home_page_get_in_touch_header_send_email)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_get_in_touch_community_msg_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (formik.touched.home_page_get_in_touch_header_join_our_community &&
                formik.errors.home_page_get_in_touch_header_join_our_community
                  ? 'form-field-error'
                  : formik.touched.home_page_get_in_touch_header_join_our_community &&
                    !formik.errors.home_page_get_in_touch_header_join_our_community
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_get_in_touch_header_join_our_community"
              placeholder={t('page.settings_home_page_get_in_touch_community_msg_placeholder')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.home_page_get_in_touch_header_join_our_community}
            />
            <div className="form-field-error-text">
              {formik.touched.home_page_get_in_touch_header_join_our_community &&
              formik.errors.home_page_get_in_touch_header_join_our_community ? (
                <div>{t(formik.errors.home_page_get_in_touch_header_join_our_community)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};
GetContactSectting.propTypes = {
  formik: propTypes.any,
  t: propTypes.func,
  imagePreviewFromik: propTypes.func,
};
export { GetContactSectting };
