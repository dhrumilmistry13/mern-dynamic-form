import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Button, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

import validationSchema from './GetInTouchValidations';
import { useViewGetInTouch, useUpdateGetInTouch } from 'hooks';
import { TNButton } from 'common/components';
import {
  GetGeneralSection,
  GetContactSectting,
  GetSocialSettings,
  GetBrandLogoSetttings,
} from './GetInTouch/components';
import SettingNavBar from './SettingNavBar';
import { fileToDataUri, s3BucketFileUpload } from 'helpers';

const GetInTouchPage = ({ t }) => {
  const navigate = useNavigate();
  /**
   * This Block will execute on Form Submit, provides form fields and validations for that
   */
  const formik = useFormik({
    initialValues: {
      home_page_get_in_touch_header_title: '',
      home_page_get_in_touch_header_sub_title: '',
      home_page_get_in_touch_header_text: '',
      home_page_get_in_touch_header_email: '',
      home_page_get_in_touch_header_contact_number: '',
      home_page_get_in_touch_header_send_email: '',

      home_page_get_in_touch_header_join_our_community: '',

      home_page_get_in_touch_header_join_our_community_instagram_social_media_link: '',
      home_page_get_in_touch_header_join_our_community_twitter_social_media_link: '',
      home_page_get_in_touch_header_join_our_community_linkdin_social_media_link: '',
      home_page_get_in_touch_header_join_our_community_facebook_social_media_link: '',

      // Button Text and Link
      home_page_get_in_touch_header_button_text: '',
      home_page_get_in_touch_header_button_link: '',

      home_page_get_in_touch_header_logo: '',
      home_page_get_in_touch_header_brand_title: '',
      home_page_get_in_touch_header_headquarters_text: '',
      home_page_get_in_touch_header_brand_text: '',
      home_page_get_in_touch_footer_title: '',
      home_page_get_in_touch_footer_text: '',
      home_page_get_in_touch_footer_sub_text: '',
      home_page_get_in_touch_footer_copyright: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      doUpdateGetInTouch(values);
    },
  });
  /**
   * This function will call on page load, and data will be set to the form fields
   */
  const { refetch: doViewGetInTouch, isLoading: isLoadingData } = useViewGetInTouch(
    ({ data: get_in_touch_data }) => {
      if (get_in_touch_data) {
        formik.values.home_page_get_in_touch_header_title =
          get_in_touch_data.home_page_get_in_touch_header_title;
        formik.values.home_page_get_in_touch_header_sub_title =
          get_in_touch_data.home_page_get_in_touch_header_sub_title;
        formik.values.home_page_get_in_touch_header_text =
          get_in_touch_data.home_page_get_in_touch_header_text;
        formik.values.home_page_get_in_touch_header_email =
          get_in_touch_data.home_page_get_in_touch_header_email;
        formik.values.home_page_get_in_touch_header_contact_number =
          get_in_touch_data.home_page_get_in_touch_header_contact_number;
        formik.values.home_page_get_in_touch_header_send_email =
          get_in_touch_data.home_page_get_in_touch_header_send_email;
        formik.values.home_page_get_in_touch_header_join_our_community =
          get_in_touch_data.home_page_get_in_touch_header_join_our_community;
        formik.values.home_page_get_in_touch_header_join_our_community_instagram_social_media_link =
          get_in_touch_data.home_page_get_in_touch_header_join_our_community_instagram_social_media_link;
        formik.values.home_page_get_in_touch_header_join_our_community_twitter_social_media_link =
          get_in_touch_data.home_page_get_in_touch_header_join_our_community_twitter_social_media_link;
        formik.values.home_page_get_in_touch_header_join_our_community_linkdin_social_media_link =
          get_in_touch_data.home_page_get_in_touch_header_join_our_community_linkdin_social_media_link;
        formik.values.home_page_get_in_touch_header_join_our_community_facebook_social_media_link =
          get_in_touch_data.home_page_get_in_touch_header_join_our_community_facebook_social_media_link;
        formik.values.home_page_get_in_touch_header_button_text =
          get_in_touch_data.home_page_get_in_touch_header_button_text;
        formik.values.home_page_get_in_touch_header_button_link =
          get_in_touch_data.home_page_get_in_touch_header_button_link;
        formik.values.home_page_get_in_touch_header_logo =
          get_in_touch_data.home_page_get_in_touch_header_logo;
        formik.values.home_page_get_in_touch_header_brand_title =
          get_in_touch_data.home_page_get_in_touch_header_brand_title;
        formik.values.home_page_get_in_touch_header_headquarters_text =
          get_in_touch_data.home_page_get_in_touch_header_headquarters_text;
        formik.values.home_page_get_in_touch_header_brand_text =
          get_in_touch_data.home_page_get_in_touch_header_brand_text;
        formik.values.home_page_get_in_touch_footer_text =
          get_in_touch_data.home_page_get_in_touch_footer_text;
        formik.values.home_page_get_in_touch_footer_sub_text =
          get_in_touch_data.home_page_get_in_touch_footer_sub_text;
        formik.values.home_page_get_in_touch_footer_copyright =
          get_in_touch_data.home_page_get_in_touch_footer_copyright;
        formik.values.home_page_get_in_touch_footer_title =
          get_in_touch_data.home_page_get_in_touch_footer_title;
      }
    }
  );
  /**
   * This function will call on submit, and data will get updated
   */
  const { mutate: doUpdateGetInTouch, isLoading } = useUpdateGetInTouch((response) => {
    if (response.data.length > 0) {
      response.data.map(async (value) => {
        fileToDataUri(formik.values[value.fieldname]).then(async (dataUri) => {
          await s3BucketFileUpload(dataUri, formik.values[value.fieldname].type, value.uploadURL);
        });
      });
    }
    setTimeout(() => {
      toast.success(response.message);
      doViewGetInTouch();
    }, 2000);
  });
  /**
   * !This block will call on click cancel button, It'll open alert for user,
   * and user will be redirected to the dashboard page after confirmation
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
                    navigate(`/dashboard/`);
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
      navigate(`/dashboard/`);
    }
  };
  return (
    <>
      <SettingNavBar t={t} />
      <Card className="inner-box px-4">
        <h1 className="page-heading-center">{t('page.settings_home_page_get_in_touch_label')}</h1>
        <Form onSubmit={formik.handleSubmit}>
          <Accordion defaultActiveKey="0">
            {/* How It Works Section Details */}
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                {t('page.settings_home_page_get_in_touch_general_detail_label')}
              </Accordion.Header>
              <Accordion.Body>
                <GetGeneralSection formik={formik} t={t} />
              </Accordion.Body>
            </Accordion.Item>
            {/* Contact section */}
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                {t('page.settings_home_page_get_in_touch_contact_detail_label')}
              </Accordion.Header>
              <Accordion.Body>
                <GetContactSectting formik={formik} t={t} />
              </Accordion.Body>
            </Accordion.Item>
            {/* social media section */}
            <Accordion.Item eventKey="2">
              <Accordion.Header>
                {t('page.settings_home_page_get_in_touch_social_media_links_label')}
              </Accordion.Header>
              <Accordion.Body>
                <GetSocialSettings formik={formik} t={t} />
              </Accordion.Body>
            </Accordion.Item>
            {/* Brand Dertail section */}
            <Accordion.Item eventKey="3">
              <Accordion.Header>
                {t('page.settings_home_page_get_in_touch_general_brand_detail_label')}
              </Accordion.Header>
              <Accordion.Body>
                <GetBrandLogoSetttings formik={formik} t={t} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <div className="primary-button">
            <Link to="#" className="link-center" onClick={handleCancel}>
              {t('page.settings_home_page_get_in_touch_cancel_btn')}
            </Link>
            <TNButton
              type="submit"
              disabled={isLoadingData}
              loading={isLoading}
              isdirtyform={formik.dirty && formik.dirty !== undefined ? 1 : 0}>
              {t('page.settings_home_page_get_in_touch_submit_btn')}
            </TNButton>
          </div>
        </Form>
      </Card>
    </>
  );
};
GetInTouchPage.propTypes = {
  t: PropTypes.func,
};
export default GetInTouchPage;
