import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Row, Form } from 'react-bootstrap';

const organisation_availibility_listview = ({ t, initialValues }) => {
  /**
   * This is Set InitialValues
   */
  const days_slot_1s = initialValues.days_slot_1;
  const isCloseDataDay1 = days_slot_1s.filter((v) => {
    return v.is_closed === 1;
  });
  const firstNotClosedSlotDay1 = days_slot_1s.filter(
    (val) => val.is_closed === 1 && val.is_delete === 1
  );
  const days_slot_2s = initialValues.days_slot_2;
  const isCloseDataDay2 = days_slot_2s.filter((v) => {
    return v.is_closed === 1;
  });
  const firstNotClosedSlotDay2 = days_slot_2s.filter(
    (val) => val.is_closed === 1 && val.is_delete === 1
  );
  const days_slot_3s = initialValues.days_slot_3;
  const isCloseDataDay3 = days_slot_3s.filter((v) => {
    return v.is_closed === 1;
  });
  const firstNotClosedSlotDay3 = days_slot_3s.filter(
    (val) => val.is_closed === 1 && val.is_delete === 1
  );
  const days_slot_4s = initialValues.days_slot_4;
  const isCloseDataDay4 = days_slot_4s.filter((v) => {
    return v.is_closed === 1;
  });
  const firstNotClosedSlotDay4 = days_slot_4s.filter(
    (val) => val.is_closed === 1 && val.is_delete === 1
  );
  const days_slot_5s = initialValues.days_slot_5;
  const isCloseDataDay5 = days_slot_5s.filter((v) => {
    return v.is_closed === 1;
  });
  const firstNotClosedSlotDay5 = days_slot_5s.filter(
    (val) => val.is_closed === 1 && val.is_delete === 1
  );
  const days_slot_6s = initialValues.days_slot_6;
  const isCloseDataDay6 = days_slot_6s.filter((v) => {
    return v.is_closed === 1;
  });
  const firstNotClosedSlotDay6 = days_slot_6s.filter(
    (val) => val.is_closed === 1 && val.is_delete === 1
  );
  const days_slot_7s = initialValues.days_slot_7;
  const isCloseDataDay7 = days_slot_7s.filter((v) => {
    return v.is_closed === 1;
  });
  const firstNotClosedSlotDay7 = days_slot_7s.filter(
    (val) => val.is_closed === 1 && val.is_delete === 1
  );

  return (
    <>
      <div className="organisation_availibility_listview">
        <Card className="border-0">
          <Card.Body className="border-0">
            {/* day 1 */}
            {days_slot_1s.length > 0 &&
              days_slot_1s.map((days_slot_1, index) => {
                return (
                  days_slot_1.is_closed == 1 &&
                  days_slot_1.is_delete == 1 && (
                    <>
                      <div key={index.toString()} className="working-details">
                        <Row className="working-text-center ">
                          {isCloseDataDay1.length !== 0 && (
                            <Col lg={2} xs={12} className="d-flex align-items-center">
                              {firstNotClosedSlotDay1[0]?.start_time == days_slot_1?.start_time ? (
                                <Form.Check
                                  disabled
                                  type={'checkbox'}
                                  label={t(
                                    'page.admin_organisation_availibility_listview_mon_checkbox_label'
                                  )}
                                  className={'custom-check'}
                                  name={`days_slot_1.${index}.is_closed`}
                                  value={days_slot_1s[index].is_closed}
                                  checked={days_slot_1s[index].is_closed == 1}
                                />
                              ) : null}
                            </Col>
                          )}
                          {days_slot_1.is_closed == 1 && days_slot_1.is_delete == 1 ? (
                            <>
                              <Col lg={3} md={6} xs={12}>
                                <Row className="working-text-center">
                                  <Col lg={12}>
                                    <Form.Control
                                      disabled
                                      name={`days_slot_1.${index}.start_time`}
                                      value={days_slot_1s[index].start_time}
                                      placeholder={t(
                                        'page.admin_organisation_availibility_listview_startdate_placeholder'
                                      )}
                                      className={'day-select form-control '}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={3} md={6} xs={12}>
                                <Row className="working-text-center">
                                  <Col lg={12}>
                                    <Form.Control
                                      disabled
                                      name={`days_slot_1.${index}.end_time`}
                                      value={days_slot_1s[index].end_time}
                                      placeholder={t(
                                        'page.admin_organisation_availibility_listview_enddate_placeholder'
                                      )}
                                      className={'day-select form-control '}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            </>
                          ) : null}
                        </Row>
                      </div>
                    </>
                  )
                );
              })}
            {isCloseDataDay1.length === 0 ? (
              <div className="working-details">
                <Row className="working-text-center ">
                  <Col lg={2} xs={12} className="d-flex align-items-center">
                    <Form.Check
                      disabled
                      type={'checkbox'}
                      label={t('page.admin_organisation_availibility_listview_mon_checkbox_label')}
                      className={'custom-check'}
                      name={`days_slot_1.${0}.is_closed`}
                      value={days_slot_1s[0]?.is_closed}
                      checked={days_slot_1s[0]?.is_closed == 1}
                    />
                  </Col>

                  <Col lg={5} xs={12}>
                    <p className="unavailable-text">
                      {t('page.admin_organisation_availibility_listview_unavailable_slots_text')}
                    </p>
                  </Col>
                </Row>
              </div>
            ) : (
              ''
            )}
            {/* day 2 */}
            {days_slot_2s.length > 0 &&
              days_slot_2s.map((days_slot_2, index) => {
                return (
                  days_slot_2.is_closed == 1 &&
                  days_slot_2.is_delete == 1 && (
                    <>
                      <div key={index.toString()} className="working-details">
                        <Row className="working-text-center ">
                          {isCloseDataDay2.length !== 0 && (
                            <Col lg={2} xs={12} className="d-flex align-items-center">
                              {firstNotClosedSlotDay2[0]?.start_time == days_slot_2?.start_time ? (
                                <Form.Check
                                  disabled
                                  type={'checkbox'}
                                  label={t(
                                    'page.admin_organisation_availibility_listview_tue_checkbox_label'
                                  )}
                                  className={'custom-check'}
                                  name={`days_slot_2.${index}.is_closed`}
                                  value={days_slot_2s[index].is_closed}
                                  checked={days_slot_2s[index].is_closed == 1}
                                />
                              ) : null}
                            </Col>
                          )}
                          {days_slot_2.is_closed == 1 && days_slot_2.is_delete == 1 ? (
                            <>
                              <Col lg={3} md={6} xs={12}>
                                <Row className="working-text-center">
                                  <Col lg={12}>
                                    <Form.Control
                                      disabled
                                      name={`days_slot_2.${index}.start_time`}
                                      value={days_slot_2s[index].start_time}
                                      placeholder={t(
                                        'page.admin_organisation_availibility_listview_startdate_placeholder'
                                      )}
                                      className={'day-select form-control '}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={3} md={6} xs={12}>
                                <Row className="working-text-center">
                                  <Col lg={12}>
                                    <Form.Control
                                      disabled
                                      name={`days_slot_2.${index}.end_time`}
                                      value={days_slot_2s[index].end_time}
                                      placeholder={t(
                                        'page.admin_organisation_availibility_listview_enddate_placeholder'
                                      )}
                                      className={'day-select form-control '}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            </>
                          ) : null}
                        </Row>
                      </div>
                    </>
                  )
                );
              })}
            {isCloseDataDay2.length === 0 ? (
              <div className="working-details">
                <Row className="working-text-center ">
                  <Col lg={2} xs={12} className="d-flex align-items-center">
                    <Form.Check
                      disabled
                      type={'checkbox'}
                      label={t('page.admin_organisation_availibility_listview_tue_checkbox_label')}
                      className={'custom-check'}
                      name={`days_slot_2.${0}.is_closed`}
                      value={days_slot_2s[0]?.is_closed}
                      checked={days_slot_2s[0]?.is_closed == 1}
                    />
                  </Col>

                  <Col lg={5} xs={12}>
                    <p className="unavailable-text">
                      {t('page.admin_organisation_availibility_listview_unavailable_slots_text')}
                    </p>
                  </Col>
                </Row>
              </div>
            ) : (
              ''
            )}
            {/* day 3 */}
            {days_slot_3s.length > 0 &&
              days_slot_3s.map((days_slot_3, index) => {
                return (
                  days_slot_3.is_closed == 1 &&
                  days_slot_3.is_delete == 1 && (
                    <>
                      <div key={index.toString()} className="working-details">
                        <Row className="working-text-center ">
                          {isCloseDataDay3.length !== 0 && (
                            <Col lg={2} xs={12} className="d-flex align-items-center">
                              {firstNotClosedSlotDay3[0]?.start_time == days_slot_3?.start_time ? (
                                <Form.Check
                                  disabled
                                  type={'checkbox'}
                                  label={t(
                                    'page.admin_organisation_availibility_listview_wed_checkbox_label'
                                  )}
                                  className={'custom-check'}
                                  name={`days_slot_3.${index}.is_closed`}
                                  value={days_slot_3s[index].is_closed}
                                  checked={days_slot_3s[index].is_closed == 1}
                                />
                              ) : null}
                            </Col>
                          )}
                          {days_slot_3.is_closed == 1 && days_slot_3.is_delete == 1 ? (
                            <>
                              <Col lg={3} md={6} xs={12}>
                                <Row className="working-text-center">
                                  <Col lg={12}>
                                    <Form.Control
                                      disabled
                                      name={`days_slot_3.${index}.start_time`}
                                      value={days_slot_3s[index].start_time}
                                      placeholder={t(
                                        'page.admin_organisation_availibility_listview_startdate_placeholder'
                                      )}
                                      className={'day-select form-control '}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={3} md={6} xs={12}>
                                <Row className="working-text-center">
                                  <Col lg={12}>
                                    <Form.Control
                                      disabled
                                      name={`days_slot_3.${index}.end_time`}
                                      value={days_slot_3s[index].end_time}
                                      placeholder={t(
                                        'page.admin_organisation_availibility_listview_enddate_placeholder'
                                      )}
                                      className={'day-select form-control '}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            </>
                          ) : null}
                        </Row>
                      </div>
                    </>
                  )
                );
              })}
            {isCloseDataDay3.length === 0 ? (
              <div className="working-details">
                <Row className="working-text-center ">
                  <Col lg={2} xs={12} className="d-flex align-items-center">
                    <Form.Check
                      disabled
                      type={'checkbox'}
                      label={t('page.admin_organisation_availibility_listview_wed_checkbox_label')}
                      className={'custom-check'}
                      name={`days_slot_3.${0}.is_closed`}
                      value={days_slot_3s[0]?.is_closed}
                      checked={days_slot_3s[0]?.is_closed == 1}
                    />
                  </Col>

                  <Col lg={5} xs={12}>
                    <p className="unavailable-text">
                      {t('page.admin_organisation_availibility_listview_unavailable_slots_text')}
                    </p>
                  </Col>
                </Row>
              </div>
            ) : (
              ''
            )}
            {/* day 4 */}
            {days_slot_4s.length > 0 &&
              days_slot_4s.map((days_slot_4, index) => {
                return (
                  days_slot_4.is_closed == 1 &&
                  days_slot_4.is_delete == 1 && (
                    <>
                      <div key={index.toString()} className="working-details">
                        <Row className="working-text-center ">
                          {isCloseDataDay4.length !== 0 && (
                            <Col lg={2} xs={12} className="d-flex align-items-center">
                              {firstNotClosedSlotDay4[0]?.start_time == days_slot_4?.start_time ? (
                                <Form.Check
                                  disabled
                                  type={'checkbox'}
                                  label={t(
                                    'page.admin_organisation_availibility_listview_thu_checkbox_label'
                                  )}
                                  className={'custom-check'}
                                  name={`days_slot_4.${index}.is_closed`}
                                  value={days_slot_4s[index].is_closed}
                                  checked={days_slot_4s[index].is_closed == 1}
                                />
                              ) : null}
                            </Col>
                          )}
                          {days_slot_4.is_closed == 1 && days_slot_4.is_delete == 1 ? (
                            <>
                              <Col lg={3} md={6} xs={12}>
                                <Row className="working-text-center">
                                  <Col lg={12}>
                                    <Form.Control
                                      disabled
                                      name={`days_slot_4.${index}.start_time`}
                                      value={days_slot_4s[index].start_time}
                                      placeholder={t(
                                        'page.admin_organisation_availibility_listview_startdate_placeholder'
                                      )}
                                      className={'day-select form-control '}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={3} md={6} xs={12}>
                                <Row className="working-text-center">
                                  <Col lg={12}>
                                    <Form.Control
                                      disabled
                                      name={`days_slot_4.${index}.end_time`}
                                      value={days_slot_4s[index].end_time}
                                      placeholder={t(
                                        'page.admin_organisation_availibility_listview_enddate_placeholder'
                                      )}
                                      className={'day-select form-control '}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            </>
                          ) : null}
                        </Row>
                      </div>
                    </>
                  )
                );
              })}
            {isCloseDataDay4.length === 0 ? (
              <div className="working-details">
                <Row className="working-text-center ">
                  <Col lg={2} xs={12} className="d-flex align-items-center">
                    <Form.Check
                      disabled
                      type={'checkbox'}
                      label={t('page.admin_organisation_availibility_listview_thu_checkbox_label')}
                      className={'custom-check'}
                      name={`days_slot_4.${0}.is_closed`}
                      value={days_slot_4s[0]?.is_closed}
                      checked={days_slot_4s[0]?.is_closed == 1}
                    />
                  </Col>

                  <Col lg={5} xs={12}>
                    <p className="unavailable-text">
                      {t('page.admin_organisation_availibility_listview_unavailable_slots_text')}
                    </p>
                  </Col>
                </Row>
              </div>
            ) : (
              ''
            )}
            {/* day 5 */}
            {days_slot_5s.length > 0 &&
              days_slot_5s.map((days_slot_5, index) => {
                return (
                  days_slot_5.is_closed == 1 &&
                  days_slot_5.is_delete == 1 && (
                    <>
                      <div key={index.toString()} className="working-details">
                        <Row className="working-text-center ">
                          {isCloseDataDay5.length !== 0 && (
                            <Col lg={2} xs={12} className="d-flex align-items-center">
                              {firstNotClosedSlotDay5[0]?.start_time == days_slot_5?.start_time ? (
                                <Form.Check
                                  disabled
                                  type={'checkbox'}
                                  label={t(
                                    'page.admin_organisation_availibility_listview_fri_checkbox_label'
                                  )}
                                  className={'custom-check'}
                                  name={`days_slot_5.${index}.is_closed`}
                                  value={days_slot_5s[index].is_closed}
                                  checked={days_slot_5s[index].is_closed == 1}
                                />
                              ) : null}
                            </Col>
                          )}
                          {days_slot_5.is_closed == 1 && days_slot_5.is_delete == 1 ? (
                            <>
                              <Col lg={3} md={6} xs={12}>
                                <Row className="working-text-center">
                                  <Col lg={12}>
                                    <Form.Control
                                      disabled
                                      name={`days_slot_5.${index}.start_time`}
                                      value={days_slot_5s[index].start_time}
                                      placeholder={t(
                                        'page.admin_organisation_availibility_listview_startdate_placeholder'
                                      )}
                                      className={'day-select form-control '}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={3} md={6} xs={12}>
                                <Row className="working-text-center">
                                  <Col lg={12}>
                                    <Form.Control
                                      disabled
                                      name={`days_slot_5.${index}.end_time`}
                                      value={days_slot_5s[index].end_time}
                                      placeholder={t(
                                        'page.admin_organisation_availibility_listview_enddate_placeholder'
                                      )}
                                      className={'day-select form-control '}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            </>
                          ) : null}
                        </Row>
                      </div>
                    </>
                  )
                );
              })}
            {isCloseDataDay5.length === 0 ? (
              <div className="working-details">
                <Row className="working-text-center ">
                  <Col lg={2} xs={12} className="d-flex align-items-center">
                    <Form.Check
                      disabled
                      type={'checkbox'}
                      label={t('page.admin_organisation_availibility_listview_fri_checkbox_label')}
                      className={'custom-check'}
                      name={`days_slot_5.${0}.is_closed`}
                      value={days_slot_5s[0]?.is_closed}
                      checked={days_slot_5s[0]?.is_closed == 1}
                    />
                  </Col>

                  <Col lg={5} xs={12}>
                    <p className="unavailable-text">
                      {t('page.admin_organisation_availibility_listview_unavailable_slots_text')}
                    </p>
                  </Col>
                </Row>
              </div>
            ) : (
              ''
            )}
            {/* day 6 */}
            {days_slot_6s.length > 0 &&
              days_slot_6s.map((days_slot_6, index) => {
                return (
                  days_slot_6.is_closed == 1 &&
                  days_slot_6.is_delete == 1 && (
                    <>
                      <div key={index.toString()} className="working-details">
                        <Row className="working-text-center ">
                          {isCloseDataDay6.length !== 0 && (
                            <Col lg={2} xs={12} className="d-flex align-items-center">
                              {firstNotClosedSlotDay6[0]?.start_time == days_slot_6?.start_time ? (
                                <Form.Check
                                  disabled
                                  type={'checkbox'}
                                  label={t(
                                    'page.admin_organisation_availibility_listview_sat_checkbox_label'
                                  )}
                                  className={'custom-check'}
                                  name={`days_slot_6.${index}.is_closed`}
                                  value={days_slot_6s[index].is_closed}
                                  checked={days_slot_6s[index].is_closed == 1}
                                />
                              ) : null}
                            </Col>
                          )}
                          {days_slot_6.is_closed == 1 && days_slot_6.is_delete == 1 ? (
                            <>
                              <Col lg={3} md={6} xs={12}>
                                <Row className="working-text-center">
                                  <Col lg={12}>
                                    <Form.Control
                                      disabled
                                      name={`days_slot_6.${index}.start_time`}
                                      value={days_slot_6s[index].start_time}
                                      placeholder={t(
                                        'page.admin_organisation_availibility_listview_startdate_placeholder'
                                      )}
                                      className={'day-select form-control '}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={3} md={6} xs={12}>
                                <Row className="working-text-center">
                                  <Col lg={12}>
                                    <Form.Control
                                      disabled
                                      name={`days_slot_6.${index}.end_time`}
                                      value={days_slot_6s[index].end_time}
                                      placeholder={t(
                                        'page.admin_organisation_availibility_listview_enddate_placeholder'
                                      )}
                                      className={'day-select form-control '}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            </>
                          ) : null}
                        </Row>
                      </div>
                    </>
                  )
                );
              })}
            {isCloseDataDay6.length === 0 ? (
              <div className="working-details">
                <Row className="working-text-center ">
                  <Col lg={2} xs={12} className="d-flex align-items-center">
                    <Form.Check
                      disabled
                      type={'checkbox'}
                      label={t('page.admin_organisation_availibility_listview_sat_checkbox_label')}
                      className={'custom-check'}
                      name={`days_slot_6.${0}.is_closed`}
                      value={days_slot_6s[0]?.is_closed}
                      checked={days_slot_6s[0]?.is_closed == 1}
                    />
                  </Col>

                  <Col lg={5} xs={12}>
                    <p className="unavailable-text">
                      {t('page.admin_organisation_availibility_listview_unavailable_slots_text')}
                    </p>
                  </Col>
                </Row>
              </div>
            ) : (
              ''
            )}
            {/* day 7 - Sunday */}
            {days_slot_7s.length > 0 &&
              days_slot_7s.map((days_slot_7, index) => {
                return (
                  days_slot_7.is_closed == 1 &&
                  days_slot_7.is_delete == 1 && (
                    <>
                      <div key={index.toString()} className="working-details">
                        <Row className="working-text-center ">
                          {isCloseDataDay7.length !== 0 && (
                            <Col lg={2} xs={12} className="d-flex align-items-center">
                              {firstNotClosedSlotDay7[0]?.start_time == days_slot_7?.start_time ? (
                                <Form.Check
                                  disabled
                                  type={'checkbox'}
                                  label={t(
                                    'page.admin_organisation_availibility_listview_sun_checkbox_label'
                                  )}
                                  className={'custom-check'}
                                  name={`days_slot_7.${index}.is_closed`}
                                  value={days_slot_7s[index].is_closed}
                                  checked={days_slot_7s[index].is_closed == 1}
                                />
                              ) : null}
                            </Col>
                          )}
                          {days_slot_7.is_closed == 1 && days_slot_7.is_delete == 1 ? (
                            <>
                              <Col lg={3} md={6} xs={12}>
                                <Row className="working-text-center">
                                  <Col lg={12}>
                                    <Form.Control
                                      disabled
                                      name={`days_slot_7.${index}.start_time`}
                                      value={days_slot_7s[index].start_time}
                                      placeholder={t(
                                        'page.admin_organisation_availibility_listview_startdate_placeholder'
                                      )}
                                      className={'day-select form-control '}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={3} md={6} xs={12}>
                                <Row className="working-text-center">
                                  <Col lg={12}>
                                    <Form.Control
                                      disabled
                                      name={`days_slot_7.${index}.end_time`}
                                      value={days_slot_7s[index].end_time}
                                      placeholder={t(
                                        'page.admin_organisation_availibility_listview_enddate_placeholder'
                                      )}
                                      className={'day-select form-control '}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            </>
                          ) : null}
                        </Row>
                      </div>
                    </>
                  )
                );
              })}
            {isCloseDataDay7.length === 0 ? (
              <div className="working-details">
                <Row className="working-text-center ">
                  <Col lg={2} xs={12} className="d-flex align-items-center">
                    <Form.Check
                      disabled
                      type={'checkbox'}
                      label={t('page.admin_organisation_availibility_listview_sun_checkbox_label')}
                      className={'custom-check'}
                      name={`days_slot_7.${0}.is_closed`}
                      value={days_slot_7s[0]?.is_closed}
                      checked={days_slot_7s[0]?.is_closed == 1}
                    />
                  </Col>

                  <Col lg={5} xs={12}>
                    <p className="unavailable-text">
                      {t('page.admin_organisation_availibility_listview_unavailable_slots_text')}
                    </p>
                  </Col>
                </Row>
              </div>
            ) : (
              ''
            )}
          </Card.Body>
        </Card>
      </div>
    </>
  );
};
organisation_availibility_listview.propTypes = {
  t: PropTypes.any,
  initialValues: PropTypes.any,
};
export default organisation_availibility_listview;
