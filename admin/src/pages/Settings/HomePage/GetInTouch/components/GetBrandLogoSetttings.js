import React, { useRef } from 'react';
import propTypes from 'prop-types';
import { Col, Form, Row } from 'react-bootstrap';
import { imagePreviewFromik } from 'helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const GetBrandLogoSetttings = ({ formik, t }) => {
  const brandLogoRef = useRef();
  return (
    <>
      <Row>
        <Col lg={6} md={6} xs={12}>
          <div className="change-align">
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_get_in_touch_logo_label')}
            </Form.Label>
            <Form.Control
              className={'d-none'}
              type="file"
              accept="image/*"
              ref={brandLogoRef}
              name="home_page_get_in_touch_header_logo"
              onChange={(event) => {
                formik.setFieldValue(
                  'home_page_get_in_touch_header_logo',
                  event.currentTarget.files[0]
                );
              }}
              onBlur={formik.handleBlur}
            />
            <button
              type="button"
              onClick={() => brandLogoRef.current.click()}
              className="btn btn-outline-primary ms-3">
              {t('page.settings_home_page_get_in_touch_upload_btn')}
            </button>
            <div className="preview-image change-align">
              <div>
                {formik.values.home_page_get_in_touch_header_logo ? (
                  <>
                    <img
                      width={150}
                      src={imagePreviewFromik(formik.values.home_page_get_in_touch_header_logo)}
                      alt="brand-logo"
                    />
                    <FontAwesomeIcon
                      onClick={() => {
                        formik.setFieldValue('home_page_get_in_touch_header_logo', null);
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
            {formik.touched.home_page_get_in_touch_header_logo &&
            formik.errors.home_page_get_in_touch_header_logo ? (
              <div>{t(formik.errors.home_page_get_in_touch_header_logo)}</div>
            ) : null}
          </div>
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_get_in_touch_brand_title_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (formik.touched.home_page_get_in_touch_header_brand_title &&
                formik.errors.home_page_get_in_touch_header_brand_title
                  ? 'form-field-error'
                  : formik.touched.home_page_get_in_touch_header_brand_title &&
                    !formik.errors.home_page_get_in_touch_header_brand_title
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_get_in_touch_header_brand_title"
              placeholder={t('page.settings_home_page_get_in_touch_brand_title_placeholder')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.home_page_get_in_touch_header_brand_title}
            />
            <div className="form-field-error-text">
              {formik.touched.home_page_get_in_touch_header_brand_title &&
              formik.errors.home_page_get_in_touch_header_brand_title ? (
                <div>{t(formik.errors.home_page_get_in_touch_header_brand_title)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_get_in_touch_headquarters_text_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (formik.touched.home_page_get_in_touch_header_headquarters_text &&
                formik.errors.home_page_get_in_touch_header_headquarters_text
                  ? 'form-field-error'
                  : formik.touched.home_page_get_in_touch_header_headquarters_text &&
                    !formik.errors.home_page_get_in_touch_header_headquarters_text
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_get_in_touch_header_headquarters_text"
              placeholder={t('page.settings_home_page_get_in_touch_headquarters_text_placeholder')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.home_page_get_in_touch_header_headquarters_text}
            />
            <div className="form-field-error-text">
              {formik.touched.home_page_get_in_touch_header_headquarters_text &&
              formik.errors.home_page_get_in_touch_header_headquarters_text ? (
                <div>{t(formik.errors.home_page_get_in_touch_header_headquarters_text)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_get_in_touch_brand_text_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (formik.touched.home_page_get_in_touch_header_brand_text &&
                formik.errors.home_page_get_in_touch_header_brand_text
                  ? 'form-field-error'
                  : formik.touched.home_page_get_in_touch_header_brand_text &&
                    !formik.errors.home_page_get_in_touch_header_brand_text
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_get_in_touch_header_brand_text"
              placeholder={t('page.settings_home_page_get_in_touch_brand_text_placeholder')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.home_page_get_in_touch_header_brand_text}
            />
            <div className="form-field-error-text">
              {formik.touched.home_page_get_in_touch_header_brand_text &&
              formik.errors.home_page_get_in_touch_header_brand_text ? (
                <div>{t(formik.errors.home_page_get_in_touch_header_brand_text)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_get_in_touch_footer_title_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (formik.touched.home_page_get_in_touch_footer_title &&
                formik.errors.home_page_get_in_touch_footer_title
                  ? 'form-field-error'
                  : formik.touched.home_page_get_in_touch_footer_title &&
                    !formik.errors.home_page_get_in_touch_footer_title
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_get_in_touch_footer_title"
              placeholder={t('page.settings_home_page_get_in_touch_footer_title_placeholder')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.home_page_get_in_touch_footer_title}
            />
            <div className="form-field-error-text">
              {formik.touched.home_page_get_in_touch_footer_title &&
              formik.errors.home_page_get_in_touch_footer_title ? (
                <div>{t(formik.errors.home_page_get_in_touch_footer_title)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_get_in_touch_footer_text_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (formik.touched.home_page_get_in_touch_footer_text &&
                formik.errors.home_page_get_in_touch_footer_text
                  ? 'form-field-error'
                  : formik.touched.home_page_get_in_touch_footer_text &&
                    !formik.errors.home_page_get_in_touch_footer_text
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_get_in_touch_footer_text"
              placeholder={t('page.settings_home_page_get_in_touch_footer_text_placeholder')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.home_page_get_in_touch_footer_text}
            />
            <div className="form-field-error-text">
              {formik.touched.home_page_get_in_touch_footer_text &&
              formik.errors.home_page_get_in_touch_footer_text ? (
                <div>{t(formik.errors.home_page_get_in_touch_footer_text)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_get_in_touch_footer_sub_text_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (formik.touched.home_page_get_in_touch_footer_sub_text &&
                formik.errors.home_page_get_in_touch_footer_sub_text
                  ? 'form-field-error'
                  : formik.touched.home_page_get_in_touch_footer_sub_text &&
                    !formik.errors.home_page_get_in_touch_footer_sub_text
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_get_in_touch_footer_sub_text"
              placeholder={t('page.settings_home_page_get_in_touch_footer_sub_text_placeholder')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.home_page_get_in_touch_footer_sub_text}
            />
            <div className="form-field-error-text">
              {formik.touched.home_page_get_in_touch_footer_sub_text &&
              formik.errors.home_page_get_in_touch_footer_sub_text ? (
                <div>{t(formik.errors.home_page_get_in_touch_footer_sub_text)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_get_in_touch_footer_copyright_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (formik.touched.home_page_get_in_touch_footer_copyright &&
                formik.errors.home_page_get_in_touch_footer_copyright
                  ? 'form-field-error'
                  : formik.touched.home_page_get_in_touch_footer_copyright &&
                    !formik.errors.home_page_get_in_touch_footer_copyright
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_get_in_touch_footer_copyright"
              placeholder={t('page.settings_home_page_get_in_touch_footer_copyright_placeholder')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.home_page_get_in_touch_footer_copyright}
            />
            <div className="form-field-error-text">
              {formik.touched.home_page_get_in_touch_footer_copyright &&
              formik.errors.home_page_get_in_touch_footer_copyright ? (
                <div>{t(formik.errors.home_page_get_in_touch_footer_copyright)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};
GetBrandLogoSetttings.propTypes = {
  formik: propTypes.any,
  t: propTypes.func,
  imagePreviewFromik: propTypes.func,
};
export { GetBrandLogoSetttings };
