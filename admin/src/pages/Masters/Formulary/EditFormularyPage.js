import { Form, Card, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faXmark } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';
import { CKEditor } from 'ckeditor4-react';

import validationSchema from './AddEditFormularyValidations';
import { TNButton } from 'common/components/TNButton';
import {
  allowNumbersOnly,
  defaultValue,
  imagePreviewFromik,
  currencyFormatFloat,
  fileToDataUri,
  s3BucketFileUpload,
} from 'helpers';
import { useUpdateFormulary, useViewFormulary, useDeleteFormularyImage } from 'hooks';
import { TNBreadCurm } from 'common/components';

const EditFormularyPage = ({ t }) => {
  const navigate = useNavigate();
  const featuredImageRef = useRef();
  const formularyImageRef = useRef();
  const { formulary_id } = useParams();

  /**
   * !This API will call when user click on Image remove icon
   */
  const { mutate: doDeleteFormularyImage } = useDeleteFormularyImage((response) => {
    toast.success(response.message);
    refetch();
  });
  /**
   * !This API will call when user clicks on Submit Button
   */
  const { mutate: doUpdateFormulary, isLoading } = useUpdateFormulary((response) => {
    if (response.data.length > 0) {
      response.data.map(async (value) => {
        let fieldname = value.fieldname;
        if (fieldname !== 'featured_image') {
          fieldname = value.fieldname.split('.')[0];
          let cnt = parseInt(value.fieldname.split('.')[1]);
          fileToDataUri(formik.values[fieldname][cnt]).then(async (dataUri) => {
            await s3BucketFileUpload(dataUri, formik.values[fieldname][cnt].type, value.uploadURL);
          });
        } else {
          fileToDataUri(formik.values[fieldname]).then(async (dataUri) => {
            await s3BucketFileUpload(dataUri, formik.values[fieldname].type, value.uploadURL);
          });
        }
      });
    }
    setTimeout(() => {
      toast.success(response.message);
      navigate('/formulary/list');
    }, 2000);
  });

  /**
   * !This API will call when page set. When response came we are setting up data into the form
   */
  const { refetch, isLoading: getDataLoding } = useViewFormulary(
    formulary_id,
    ({ data: formulary }) => {
      if (formulary) {
        formik.values.name = formulary.name;
        formik.values.ndc = formulary.ndc;
        formik.values.dosage_amount = formulary.dosage_amount;
        formik.values.price = formulary.price;
        formik.values.description = formulary.description;
        formik.values.short_description = formulary.short_description;
        formik.values.sequence = formulary.sequence;
        formik.values.status = formulary.status;
        formik.values.is_appointment_required = formulary.is_appointment_required;
        formik.values.featured_image = formulary.featured_image;
        formik.values.packing_shipping_fee = formulary.packing_shipping_fee;
        formik.values.formulary_image = formulary.formulary_image.map((data) => {
          return { image: data.image_name, id: data.formulary_image_id };
        });
      }
    }
  );
  /**
   * This Block will execute on Form Submit, provides form fields and validations for that
   */
  const formik = useFormik({
    initialValues: {
      ndc: '',
      dosage_amount: '',
      price: '',
      packing_shipping_fee: '',
      description: '',
      short_description: '',
      sequence: '',
      status: '',
      is_appointment_required: '',
      featured_image: '',
      formulary_image: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      values.formulary_id = formulary_id;
      values.formulary_image = values.formulary_image.filter((value) => {
        return value.image === undefined && typeof value.image !== 'string';
      });
      doUpdateFormulary(values);
    },
  });
  /**
   * Default Options of status
   */
  const options = [
    { value: '', label: `${t('page.select_status')}` },
    { value: 1, label: `${t('page.active_status_name')}` },
    { value: 2, label: `${t('page.in_active_status_name')}` },
  ];
  const appopintmentOptions = [
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
      label: t('page.edit_formulary_label'),
      link: '',
      active: 'active',
    },
  ];
  /**
   * This function will call on cancel button click, and will display alert
   */
  const handleCancel = () => {
    if (formik.dirty && formik.dirty !== undefined) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="alert-box">
              <FontAwesomeIcon
                className="alert-close"
                icon={faClose}
                onClick={() => {
                  onClose();
                }}
              />
              <div className="alert-popup">
                <h2
                  dangerouslySetInnerHTML={{
                    __html: t('page.reset_alert_popup_message'),
                  }}></h2>
                <Button
                  className="table-delete-button"
                  onClick={() => {
                    onClose();
                    navigate(`/formulary/list`);
                  }}>
                  {t('page.alert_popup_yes_button')}
                </Button>
                <Button className="table-primary-button" onClick={onClose}>
                  {t('page.alert_popup_no_button')}
                </Button>
              </div>
            </div>
          );
        },
      });
    } else {
      navigate(`/formulary/list`);
    }
  };
  /**
   * This function will call on close icon of Featured image click, and will display alert
   */
  const handleRemoveFeatureImage = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="alert-box">
            <FontAwesomeIcon
              className="alert-close"
              icon={faClose}
              onClick={() => {
                onClose();
              }}
            />
            <div className="alert-popup">
              <h2
                dangerouslySetInnerHTML={{
                  __html: t('page.formulary_image_remove_alert'),
                }}></h2>
              <Button
                className="table-delete-button"
                onClick={() => {
                  onClose();
                  formik.setFieldValue('featured_image', '');
                }}>
                {t('page.alert_popup_yes_button')}
              </Button>
              <Button className="table-primary-button" onClick={onClose}>
                {t('page.alert_popup_no_button')}
              </Button>
            </div>
          </div>
        );
      },
    });
  };
  /**
   * This function will call on close icon of Formulary image click, and will display alert
   */
  const handleImageRemove = (formulary_image_id, type) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="alert-box">
            <FontAwesomeIcon
              className="alert-close"
              icon={faClose}
              onClick={() => {
                onClose();
              }}
            />
            <div className="alert-popup">
              <h2
                dangerouslySetInnerHTML={{
                  __html: t('page.formulary_image_remove_alert'),
                }}></h2>
              <Button
                className="table-delete-button"
                onClick={() => {
                  if (type === 'old') {
                    doDeleteFormularyImage({ formulary_image_id });
                  } else {
                    formik.values.formulary_image.splice(formulary_image_id, 1);
                    formik.setFieldValue('formulary_image', formik.values.formulary_image);
                  }
                  onClose();
                }}>
                {t('page.alert_popup_yes_button')}
              </Button>
              <Button className="table-primary-button" onClick={onClose}>
                {t('page.alert_popup_no_button')}
              </Button>
            </div>
          </div>
        );
      },
    });
  };
  const [editor, setEditor] = useState(null);

  const onBeforeLoad = (e) => {
    setEditor(e.editor);
  };

  if (editor && !editor.getData()) {
    editor.setData(formik.values.description);
  }
  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <Card className="inner-box">
        <h1 className="page-heading-center">{t('page.edit_formulary_label')}</h1>
        <div>
          <Form className="edit-profile-form" onSubmit={formik.handleSubmit}>
            <Row>
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.formulary_name_label')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field-height ' +
                      (formik.touched.name && formik.errors.name
                        ? 'form-field-error'
                        : formik.touched.name && !formik.errors.name
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="name"
                    placeholder={t('page.formulary_name_placeholder')}
                    onChange={formik.handleChange}
                    onBlur={formik.onBlur}
                    value={formik.values.name}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.name && formik.errors.name ? (
                      <div>{t(formik.errors.name)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.formulary_ndc_label')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field-height ' +
                      (formik.touched.ndc && formik.errors.ndc
                        ? 'form-field-error'
                        : formik.touched.ndc && !formik.errors.ndc
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="ndc"
                    placeholder={t('page.formulary_ndc_placeholder')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.ndc}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.ndc && formik.errors.ndc ? (
                      <div>{t(formik.errors.ndc)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.formulary_dosage_amount_label')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field-height ' +
                      (formik.touched.dosage_amount && formik.errors.dosage_amount
                        ? 'form-field-error'
                        : formik.touched.dosage_amount && !formik.errors.dosage_amount
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="dosage_amount"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('page.formulary_dosage_amount_placeholder')}
                    value={formik.values.dosage_amount}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.dosage_amount && formik.errors.dosage_amount ? (
                      <div>{t(formik.errors.dosage_amount)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.formulary_price_label')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field-height ' +
                      (formik.touched.price && formik.errors.price
                        ? 'form-field-error'
                        : formik.touched.price && !formik.errors.price
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="price"
                    placeholder={t('page.formulary_price_placeholder')}
                    value={formik.values.price}
                    onBlur={formik.handleBlur}
                    onChange={(e) => {
                      formik.setFieldValue('price', currencyFormatFloat(e));
                    }}
                    onKeyUp={currencyFormatFloat}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.price && formik.errors.price ? (
                      <div>{t(formik.errors.price)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.formulary_packing_shipping_fee_label')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field-height ' +
                      (formik.touched.price && formik.errors.price
                        ? 'form-field-error'
                        : formik.touched.price && !formik.errors.price
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="packing_shipping_fee"
                    placeholder={t('page.formulary_packing_shipping_fee_placeholder')}
                    onBlur={formik.handleBlur}
                    onChange={(e) => {
                      formik.setFieldValue('packing_shipping_fee', currencyFormatFloat(e));
                    }}
                    value={formik.values.packing_shipping_fee}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.packing_shipping_fee && formik.errors.packing_shipping_fee ? (
                      <div>{t(formik.errors.packing_shipping_fee)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.formulary_is_appointment_required_label')}
                  </Form.Label>
                  <Select
                    placeholder={t('page.select_is_appointment_required_status')}
                    options={appopintmentOptions}
                    value={defaultValue(appopintmentOptions, formik.values.is_appointment_required)}
                    onChange={(selectedOption) => {
                      formik.setFieldValue('is_appointment_required', selectedOption.value);
                    }}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.is_appointment_required &&
                    formik.errors.is_appointment_required ? (
                      <div>{t(formik.errors.is_appointment_required)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.formulary_description_label')}
                  </Form.Label>
                  {!getDataLoding && (
                    <CKEditor
                      onLoaded={onBeforeLoad}
                      onReady={({ editor }) => {
                        editor.setData(formik.values.description);
                        editor.updateElement();
                      }}
                      onInstanceReady={({ editor }) => {
                        editor.setData(formik.values.description);
                        if (editor.mode == 'wysiwyg') {
                          editor.insertHtml(formik.values.descriptio);
                        } else {
                          editor.setMode('wysiwyg', function () {
                            editor.insertHtml(formik.values.descriptio);
                          });
                        }
                        editor.updateElement();
                      }}
                      onChange={(value) => {
                        formik.setFieldValue('description', value.editor.getData());
                      }}
                      config={{
                        allowedContent: true,
                      }}
                      name="description"
                      initData={formik.values.description}
                      data={formik.values.description}
                    />
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.formulary_short_description_label')}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    className={
                      formik.touched.short_description && formik.errors.short_description
                        ? 'form-field-error'
                        : formik.touched.short_description && !formik.errors.short_description
                        ? 'form-field-success'
                        : ''
                    }
                    type="text"
                    name="short_description"
                    placeholder={t('page.formulary_short_description_placeholder')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.short_description}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.short_description && formik.errors.short_description ? (
                      <div>{t(formik.errors.short_description)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.formulary_sequence_label')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field ' +
                      (formik.touched.sequence && formik.errors.sequence
                        ? 'form-field-error'
                        : formik.touched.sequence && !formik.errors.sequence
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="sequence"
                    placeholder={t('page.formulary_sequence_placeholder')}
                    onChange={(e) => {
                      formik.setFieldValue('sequence', allowNumbersOnly(e));
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.sequence}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.sequence && formik.errors.sequence ? (
                      <div>{t(formik.errors.sequence)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.formulary_status_label')}
                  </Form.Label>
                  <Select
                    placeholder={t('page.select_status')}
                    options={options}
                    value={defaultValue(options, formik.values.status)}
                    onChange={(selectedOption) => {
                      formik.setFieldValue('status', selectedOption.value);
                    }}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.status && formik.errors.status ? (
                      <div>{t(formik.errors.status)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <div className="change-align">
                  <Form.Label className="field-label field-label-top">
                    {t('page.featured_image_label')}:
                  </Form.Label>
                  <Form.Control
                    className={'d-none'}
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    ref={featuredImageRef}
                    name="featured_image"
                    onChange={(event) => {
                      const extansion = event.currentTarget.files[0].name.split('.');
                      if (['png', 'jpg', 'jpeg'].includes(extansion[1])) {
                        formik.setFieldValue('featured_image', event.currentTarget.files[0]);
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                  <button
                    type="button"
                    onClick={() => featuredImageRef.current.click()}
                    className="btn btn-outline-primary ms-3">
                    {t('page.featured_image_upload_btn')}
                  </button>
                  <div className="preview-image change-align">
                    <div>
                      {formik.values.featured_image ? (
                        <>
                          <img
                            width={150}
                            src={imagePreviewFromik(formik.values.featured_image)}
                            alt="formula_image"
                          />
                          <FontAwesomeIcon
                            onClick={() => {
                              handleRemoveFeatureImage();
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
                  {formik.touched.featured_image && formik.errors.featured_image ? (
                    <div>{t(formik.errors.featured_image)}</div>
                  ) : null}
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <div className="change-align">
                  <Form.Label className="field-label field-label-top">
                    {t('page.formulary_image_label')}:
                  </Form.Label>
                  <Form.Control
                    className={'d-none'}
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    ref={formularyImageRef}
                    multiple
                    name="formulary_image"
                    onChange={(event) => {
                      let filelength = formik.values.formulary_image.length;
                      for (var i = 0; i < event.currentTarget.files.length; ++i) {
                        const extansion = event.currentTarget.files[i].name.split('.');
                        if (['png', 'jpg', 'jpeg'].includes(extansion[1])) {
                          formik.setFieldValue(
                            `formulary_image.${filelength}`,
                            event.currentTarget.files[i]
                          );
                          filelength++;
                        }
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                  <button
                    type="button"
                    onClick={() => formularyImageRef.current.click()}
                    className="btn btn-outline-primary ms-3">
                    {t('page.formulary_image_upload_btn')}
                  </button>
                </div>
                <div className="form-field-error-text">
                  {formik.touched.formulary_image && formik.errors.formulary_image ? (
                    <div>{t(formik.errors.formulary_image)}</div>
                  ) : null}
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={12} lg={12}>
                <Row>
                  {formik.values.formulary_image.length > 0 &&
                    formik.values.formulary_image.map((item, i) => {
                      return (
                        <Col key={i} xs={6} sm={6} lg={2}>
                          <div className="preview-image">
                            <img
                              src={imagePreviewFromik(item.image ? item.image : item)}
                              alt="profile_img"
                            />
                            <FontAwesomeIcon
                              icon={faClose}
                              onClick={() => {
                                if (item?.id) {
                                  handleImageRemove(item.id, 'old');
                                } else {
                                  handleImageRemove(i, 'new');
                                }
                              }}
                            />
                          </div>
                        </Col>
                      );
                    })}
                </Row>
              </Col>
            </Row>
            <div className="primary-button">
              <span className="link-center" onClick={handleCancel}>
                {t('page.cancel_button_text')}
              </span>
              <TNButton
                type="submit"
                loading={isLoading}
                isdirtyform={formik.dirty && formik.dirty !== undefined ? 1 : 0}>
                {t('page.save_button_text')}
              </TNButton>
            </div>
          </Form>
        </div>
      </Card>
    </>
  );
};
EditFormularyPage.propTypes = {
  t: PropTypes.func,
};
export default EditFormularyPage;
