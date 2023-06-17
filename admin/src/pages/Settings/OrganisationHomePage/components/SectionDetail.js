import propTypes from 'prop-types';
import { Col, Form, Row } from 'react-bootstrap';
import { useFormikContext } from 'formik';

const SectionDetail = ({ t }) => {
  const { errors, values, touched, handleBlur, handleChange } = useFormikContext();
  return (
    <>
      <Row>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_organization_how_it_works_title_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (touched.home_page_organization_how_its_work_header_title &&
                errors.home_page_organization_how_its_work_header_title
                  ? 'form-field-error'
                  : touched.home_page_organization_how_its_work_header_title &&
                    !errors.home_page_organization_how_its_work_header_title
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_organization_how_its_work_header_title"
              placeholder={t('page.settings_home_page_organization_how_it_works_title_placeholder')}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.home_page_organization_how_its_work_header_title}
            />
            <div className="form-field-error-text">
              {touched.home_page_organization_how_its_work_header_title &&
              errors.home_page_organization_how_its_work_header_title ? (
                <div>{t(errors.home_page_organization_how_its_work_header_title)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_organization_how_it_works_sub_title_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (touched.home_page_organization_how_its_work_header_sub_title &&
                errors.home_page_organization_how_its_work_header_sub_title
                  ? 'form-field-error'
                  : touched.home_page_organization_how_its_work_header_sub_title &&
                    !errors.home_page_organization_how_its_work_header_sub_title
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_organization_how_its_work_header_sub_title"
              placeholder={t(
                'page.settings_home_page_organization_how_it_works_sub_title_placeholder'
              )}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.home_page_organization_how_its_work_header_sub_title}
            />
            <div className="form-field-error-text">
              {touched.home_page_organization_how_its_work_header_sub_title &&
              errors.home_page_organization_how_its_work_header_sub_title ? (
                <div>{t(errors.home_page_organization_how_its_work_header_sub_title)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_organization_how_it_works_description_label')}:
            </Form.Label>
            <Form.Control
              className={
                touched.home_page_organization_how_its_work_header_text &&
                errors.home_page_organization_how_its_work_header_text
                  ? 'form-field-error'
                  : touched.home_page_organization_how_its_work_header_text &&
                    !errors.home_page_organization_how_its_work_header_text
                  ? 'form-field-success'
                  : ''
              }
              as="textarea"
              rows={5}
              type="text"
              name="home_page_organization_how_its_work_header_text"
              placeholder={t(
                'page.settings_home_page_organization_how_it_works_description_placeholder'
              )}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.home_page_organization_how_its_work_header_text}
            />
            <div className="form-field-error-text">
              {touched.home_page_organization_how_its_work_header_text &&
              errors.home_page_organization_how_its_work_header_text ? (
                <div>{t(errors.home_page_organization_how_its_work_header_text)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_organization_how_it_works_btn_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (touched.home_page_organization_how_its_work_button_text &&
                errors.home_page_organization_how_its_work_button_text
                  ? 'form-field-error'
                  : touched.home_page_organization_how_its_work_button_text &&
                    !errors.home_page_organization_how_its_work_button_text
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_organization_how_its_work_button_text"
              placeholder={t('page.settings_home_page_organization_how_it_works_btn_placeholder')}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.home_page_organization_how_its_work_button_text}
            />
            <div className="form-field-error-text">
              {touched.home_page_organization_how_its_work_button_text &&
              errors.home_page_organization_how_its_work_button_text ? (
                <div>{t(errors.home_page_organization_how_its_work_button_text)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Form.Group>
            <Form.Label className="field-label field-label-top">
              {t('page.settings_home_page_organization_how_it_works_btn_link_label')}:
            </Form.Label>
            <Form.Control
              className={
                'form-field ' +
                (touched.home_page_organization_how_its_work_button_link &&
                errors.home_page_organization_how_its_work_button_link
                  ? 'form-field-error'
                  : touched.home_page_organization_how_its_work_button_link &&
                    !errors.home_page_organization_how_its_work_button_link
                  ? 'form-field-success'
                  : '')
              }
              type="text"
              name="home_page_organization_how_its_work_button_link"
              placeholder={t(
                'page.settings_home_page_organization_how_it_works_btn_link_placeholder'
              )}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.home_page_organization_how_its_work_button_link}
            />
            <div className="form-field-error-text">
              {touched.home_page_organization_how_its_work_button_link &&
              errors.home_page_organization_how_its_work_button_link ? (
                <div>{t(errors.home_page_organization_how_its_work_button_link)}</div>
              ) : null}
            </div>
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};
SectionDetail.propTypes = {
  t: propTypes.func,
};
export { SectionDetail };
