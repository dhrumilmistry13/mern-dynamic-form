import React, { createRef, useEffect, useState } from 'react';

import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction';
import PropTypes from 'prop-types';
import { useGetAvailabilities } from 'hooks';
import { useParams } from 'react-router';
import moment from 'moment';

import { LoadingSpinner } from 'common/components';

const CalenderView = () => {
  const { user_id } = useParams();

  // for modal
  const [start_date, setStartDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [end_date, setEndDate] = useState();
  const [events, setEvents] = useState([]);
  const calendarRef = createRef();

  /**
    This will run on page renders, and resize event,
   */
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
  });

  /**
   * This will run on page renders,and set it to their corresponding Fields
   */
  useEffect(() => {
    doGetOrganisationSlot({ user_id, start_date, end_date });
  }, [start_date, end_date]);
  const { mutate: doGetOrganisationSlot, isLoading: loadingSlotData } = useGetAvailabilities(
    ({ data: slot_Data }) => {
      const event_data = [];
      const cust_event_data = [];
      setEvents([]);
      const SlotAvailability = slot_Data.orgAvailabilities;
      const Slotdata = slot_Data.orgSlots;
      const custom_slot = slot_Data.orgListDateAvailabilities;
      let startDate = moment(start_date);
      let endDate = moment(end_date);
      if (SlotAvailability.length != 0) {
        if (SlotAvailability.is_date_range == '2') {
          if (
            moment(SlotAvailability.start_date).format('YYYY-MM-DD') >
            moment(startDate).format('YYYY-MM-DD')
          ) {
            startDate = moment(SlotAvailability.start_date);
          }
          if (
            moment(SlotAvailability.end_date).format('YYYY-MM-DD') <
            moment(endDate).format('YYYY-MM-DD')
          ) {
            endDate = moment(SlotAvailability.end_date);
          }
        }
        if (startDate.valueOf() <= moment().valueOf()) {
          startDate = moment(moment().format('YYYY-MM-DD'));
        }

        let between = [];
        while (startDate.valueOf() <= endDate.valueOf()) {
          between.push(startDate.format('YYYY-MM-DD'));
          startDate.add(1, 'd');
        }
        custom_slot.forEach((valuecust, key) => {
          if (
            valuecust.start_time &&
            valuecust.end_time &&
            valuecust.is_closed === 1 &&
            valuecust.is_booked === 1
          ) {
            let clsasname = 'normal';
            const starttime = moment(valuecust.start_time, 'HH:mm');
            const endtime = moment(valuecust.end_time, 'HH:mm');
            clsasname = 'todayclass';
            const datedata = moment(valuecust.date, 'YYYY-MM-DD');
            cust_event_data.push({
              id: `${valuecust.org_specific_date_slot_id}-${key}`,
              allDay: false,
              className: clsasname,
              color: '#fff',
              date: datedata.format('YYYY-MM-DD'),
              title: starttime.format('hh:mm A') + ' - ' + endtime.format('hh:mm A'),
              start: moment(
                datedata.format('YYYY-MM-DD') + ' ' + starttime.format('hh:mm A'),
                'YYYY-MM-DD hh:mm A'
              ).format('YYYY-MM-DD HH:mm'),
              end: moment(
                datedata.format('YYYY-MM-DD') + ' ' + endtime.format('hh:mm A'),
                'YYYY-MM-DD hh:mm A'
              ).format('YYYY-MM-DD HH:mm'),
            });
          }
        });
        Slotdata.forEach((value, index) => {
          const starttime = moment(value.start_time, 'HH:mm');
          const endtime = moment(value.end_time, 'HH:mm');
          between.forEach((v, key) => {
            const datedata = moment(v, 'YYYY-MM-DD');
            const checkexitst = custom_slot.filter(
              (val) => moment(val.date).valueOf() === moment(v).valueOf()
            );
            const day = parseInt(datedata.format('d') == '0' ? 7 : datedata.format('d'));
            if (day == parseInt(value.day) && checkexitst.length === 0 && value.is_closed === 1) {
              var clsasname = 'normal';
              var currentDate = moment().format('YYYY-MM-DD');
              if (currentDate == datedata.format('YYYY-MM-DD')) {
                clsasname = 'todayclass';
              }
              event_data.push({
                id: `${value.org_slot_id}-${key}-${index}`,
                allDay: false,
                className: clsasname,
                color: '#fff',
                title: starttime.format('hh:mm A') + ' - ' + endtime.format('hh:mm A'),
                start: moment(
                  datedata.format('YYYY-MM-DD') + ' ' + starttime.format('hh:mm A'),
                  'YYYY-MM-DD hh:mm A'
                ).format('YYYY-MM-DD HH:mm'),
                end: moment(
                  datedata.format('YYYY-MM-DD') + ' ' + endtime.format('hh:mm A'),
                  'YYYY-MM-DD hh:mm A'
                ).format('YYYY-MM-DD HH:mm'),
                repeat: value.repeat,
              });
            }
          });
        });
        let eventData = [...cust_event_data, ...event_data].reduce((prev, el) => {
          if (prev.some((o) => o.start == el.start && o.title == el.title)) return prev;
          return [...prev, { start: el.start, title: el.title, id: el.id }];
        }, []);
        custom_slot.forEach((valuecust) => {
          if (valuecust.is_closed === 2) {
            eventData = eventData.filter((value) => {
              return value.date !== valuecust.date;
            });
          } else if (valuecust.is_booked === 2) {
            eventData = eventData.filter((value) => {
              return value.date !== valuecust.date;
            });
          }
        });
        setEvents(eventData);
      }
    }
  );

  /**
   * This function will set event Data In fullCalender
   */
  const renderEventContent = (eventContent) => {
    return (
      <>
        <b className="event-title">{eventContent.event.title}</b>
      </>
    );
  };
  return (
    <div className="Calender" id="calendar">
      {loadingSlotData ? <LoadingSpinner></LoadingSpinner> : ''}
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'title prev,next',
          center: '',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        themeSystem="bootstrap5"
        events={!loadingSlotData && events}
        weekends={true}
        initialView="dayGridMonth"
        editable={false}
        datesSet={(payload) => {
          const currentDate = moment(new Date()).format('YYYY-MM-DD');
          if (
            moment(currentDate).format('YYYY-MM-DD') <
            moment(payload.view.currentStart).format('YYYY-MM-DD')
          ) {
            setStartDate(moment(payload.view.currentStart).format('YYYY-MM-DD'));
          } else {
            setStartDate(moment(currentDate).format('YYYY-MM-DD'));
          }
          setEndDate(moment(payload.view.currentStart).endOf('month').format('YYYY-MM-DD'));
        }}
        nowIndicator={true}
        selectable={true}
        allDaySlot={true}
        dayMaxEvents={true}
        dateClick={(e) => console.log(e.dateStr)}
        eventContent={renderEventContent} // custom render function
        validRange={(nowDate) => {
          const data = moment(nowDate).startOf('month').format('YYYY-MM-DD');
          return {
            start: data,
          };
        }}
      />
    </div>
  );
};
CalenderView.propTypes = {
  t: PropTypes.func,
};
export default CalenderView;
