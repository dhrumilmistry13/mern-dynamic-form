import React from 'react';
import propTypes from 'prop-types';
import { Col, Form, Row } from 'react-bootstrap';

const GetSocialSettings = ({ formik, t }) => {
  return (
    <>
      <Row>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_get_in_touch_social_insta_link_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (formik.touched
                  .home_page_get_in_touch_header_join_our_community_instagram_social_media_link &&
                formik.errors
                  .home_page_get_in_touch_header_join_our_community_instagram_social_media_link
                  ? 'form-field-error'
                  : formik.touched
                      .home_page_get_in_touch_header_join_our_community_instagram_social_media_link &&
                    !formik.errors
                      .home_page_get_in_touch_header_join_our_community_instagram_social_media_link
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_get_in_touch_header_join_our_community_instagram_social_media_link"
              placeholder={t('page.settings_home_page_get_in_touch_social_insta_link_placeholder')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={
                formik.values
                  .home_page_get_in_touch_header_join_our_community_instagram_social_media_link
              }
            />
            <div className="form-field-error-text">
              {formik.touched
                .home_page_get_in_touch_header_join_our_community_instagram_social_media_link &&
              formik.errors
                .home_page_get_in_touch_header_join_our_community_instagram_social_media_link ? (
                <div>
                  {t(
                    formik.errors
                      .home_page_get_in_touch_header_join_our_community_instagram_social_media_link
                  )}
                </div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_get_in_touch_social_twitter_link_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (formik.touched
                  .home_page_get_in_touch_header_join_our_community_twitter_social_media_link &&
                formik.errors
                  .home_page_get_in_touch_header_join_our_community_twitter_social_media_link
                  ? 'form-field-error'
                  : formik.touched
                      .home_page_get_in_touch_header_join_our_community_twitter_social_media_link &&
                    !formik.errors
                      .home_page_get_in_touch_header_join_our_community_twitter_social_media_link
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_get_in_touch_header_join_our_community_twitter_social_media_link"
              placeholder={t(
                'page.settings_home_page_get_in_touch_social_twitter_link_placeholder'
              )}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={
                formik.values
                  .home_page_get_in_touch_header_join_our_community_twitter_social_media_link
              }
            />
            <div className="form-field-error-text">
              {formik.touched
                .home_page_get_in_touch_header_join_our_community_twitter_social_media_link &&
              formik.errors
                .home_page_get_in_touch_header_join_our_community_twitter_social_media_link ? (
                <div>
                  {t(
                    formik.errors
                      .home_page_get_in_touch_header_join_our_community_twitter_social_media_link
                  )}
                </div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_get_in_touch_social_linked_in_link_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (formik.touched
                  .home_page_get_in_touch_header_join_our_community_linkdin_social_media_link &&
                formik.errors
                  .home_page_get_in_touch_header_join_our_community_linkdin_social_media_link
                  ? 'form-field-error'
                  : formik.touched
                      .home_page_get_in_touch_header_join_our_community_linkdin_social_media_link &&
                    !formik.errors
                      .home_page_get_in_touch_header_join_our_community_linkdin_social_media_link
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_get_in_touch_header_join_our_community_linkdin_social_media_link"
              placeholder={t(
                'page.settings_home_page_get_in_touch_social_linked_in_link_placeholder'
              )}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={
                formik.values
                  .home_page_get_in_touch_header_join_our_community_linkdin_social_media_link
              }
            />
            <div className="form-field-error-text">
              {formik.touched
                .home_page_get_in_touch_header_join_our_community_linkdin_social_media_link &&
              formik.errors
                .home_page_get_in_touch_header_join_our_community_linkdin_social_media_link ? (
                <div>
                  {t(
                    formik.errors
                      .home_page_get_in_touch_header_join_our_community_linkdin_social_media_link
                  )}
                </div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_get_in_touch_social_facebook_link_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (formik.touched
                  .home_page_get_in_touch_header_join_our_community_facebook_social_media_link &&
                formik.errors
                  .home_page_get_in_touch_header_join_our_community_facebook_social_media_link
                  ? 'form-field-error'
                  : formik.touched
                      .home_page_get_in_touch_header_join_our_community_facebook_social_media_link &&
                    !formik.errors
                      .home_page_get_in_touch_header_join_our_community_facebook_social_media_link
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_get_in_touch_header_join_our_community_facebook_social_media_link"
              placeholder={t(
                'page.settings_home_page_get_in_touch_social_facebook_link_placeholder'
              )}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={
                formik.values
                  .home_page_get_in_touch_header_join_our_community_facebook_social_media_link
              }
            />
            <div className="form-field-error-text">
              {formik.touched
                .home_page_get_in_touch_header_join_our_community_facebook_social_media_link &&
              formik.errors
                .home_page_get_in_touch_header_join_our_community_facebook_social_media_link ? (
                <div>
                  {t(
                    formik.errors
                      .home_page_get_in_touch_header_join_our_community_facebook_social_media_link
                  )}
                </div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
      </Row>
      {/* Butoon Text and Links Field */}
      <Row>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_get_in_touch_header_button_text_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (formik.touched.home_page_get_in_touch_header_button_text &&
                formik.errors.home_page_get_in_touch_header_button_text
                  ? 'form-field-error'
                  : formik.touched.home_page_get_in_touch_header_button_text &&
                    !formik.errors.home_page_get_in_touch_header_button_text
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_get_in_touch_header_button_text"
              placeholder={t('page.settings_home_page_get_in_touch_header_button_text_placeholder')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.home_page_get_in_touch_header_button_text}
            />
            <div className="form-field-error-text">
              {formik.touched.home_page_get_in_touch_header_button_text &&
              formik.errors.home_page_get_in_touch_header_button_text ? (
                <div>{t(formik.errors.home_page_get_in_touch_header_button_text)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_get_in_touch_header_button_link_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (formik.touched.home_page_get_in_touch_header_button_link &&
                formik.errors.home_page_get_in_touch_header_button_link
                  ? 'form-field-error'
                  : formik.touched.home_page_get_in_touch_header_button_link &&
                    !formik.errors.home_page_get_in_touch_header_button_link
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_get_in_touch_header_button_link"
              placeholder={t('page.settings_home_page_get_in_touch_header_button_link_placeholder')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.home_page_get_in_touch_header_button_link}
            />
            <div className="form-field-error-text">
              {formik.touched.home_page_get_in_touch_header_button_link &&
              formik.errors.home_page_get_in_touch_header_button_link ? (
                <div>{t(formik.errors.home_page_get_in_touch_header_button_link)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};
GetSocialSettings.propTypes = {
  formik: propTypes.any,
  t: propTypes.func,
  imagePreviewFromik: propTypes.func,
};
export { GetSocialSettings };
