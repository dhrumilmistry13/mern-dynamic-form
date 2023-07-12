import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import { TNBreadCurm } from 'common/components';
import { useViewFormData } from 'hooks';

const ViewFormPage = ({ t }) => {
  const { form_id } = useParams();
  const navigate = useNavigate();

  // Initial Values
  let initialValues = [];

  /**
   * !This API will call when page set. When response came we are setting up data into the form
   */
  const { isLoading: isLoadingData, data: question_data } = useViewFormData(form_id);
  if (!isLoadingData && question_data) {
    console.log(question_data.data);
    question_data.data.map((value) => {
      initialValues.push({
        label: value.question,
        answer: value.ans_val,
        is_required: value.is_required,
      });
    });
  }
  /**
   * BreadCum labels and links
   */
  const breadcurmArray = [
    {
      label: 'Form List',
      link: '/form',
      active: '',
    },
    {
      label: 'Form Details Page',
      link: '',
      active: 'active',
    },
  ];
  /**
   * This function will call on cancel button click, and user will be redirected to teh listing page
   */
  const handleCancel = () => {
    navigate(`/form`);
  };
  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <Card className="inner-box">
        <Card.Body>
          <h1 className="page-heading-center ">Form Details Page</h1>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Row>
                {initialValues && initialValues.length > 0
                  ? initialValues.map((value) => {
                      return (
                        <>
                          <Col lg={2} xs={6}>
                            <Form.Label className="field-label">
                              {value.label}{' '}
                              <span className={value.is_required ? 'text-danger' : ''}>
                                {value.is_required ? ' *' : ''}
                              </span>
                            </Form.Label>
                          </Col>
                          <Col lg={1} xs={1} className={'divider'}>
                            :
                          </Col>
                          <Col lg={3} xs={5}>
                            <span>{value.answer}</span>
                          </Col>
                        </>
                      );
                    })
                  : ''}
              </Row>
            </Col>
          </Row>
          <div className="primary-button">
            <span className="link-center" onClick={handleCancel}>
              {t('page.cancel_button_text')}
            </span>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};
ViewFormPage.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  paginationData: PropTypes.any,
  t: PropTypes.func,
};
export default ViewFormPage;
