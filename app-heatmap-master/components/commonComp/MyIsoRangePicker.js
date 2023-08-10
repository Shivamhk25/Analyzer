import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";
import moment from "moment";
const { RangePicker } = DatePicker;
const MyIsoRangePicker = ({ prevDate = 7, getIso }) => {
  const [start, setStart] = useState(moment().subtract(prevDate, "day"));
  const [end, setEnd] = useState(moment());
  const [startIso, setStartIso] = useState("");
  const [endIso, setEndIso] = useState("");
  function disabledDate(current) {
    // Can not select after today
    return current > moment();
  }

  function onChange(dates, dateStrings) {
    setStart(dates[0]);
    setEnd(dates[1]);
  }
  const isoBuilder = (conDate) => {
    let iso1 = "";
    if (conDate) {
      let year1 = conDate.year();
      let month1 = conDate.month() + 1;
      let date1 = conDate.date();
      let hr1 = conDate.hour();
      let min1 = conDate.minute();
      let sec1 = conDate.second();
      let miliSec1 = conDate.millisecond();
      if (month1 < 10) {
        month1 = `0${month1}`;
      }
      if (date1 < 10) {
        date1 = `0${date1}`;
      }
      if (hr1 < 10) {
        hr1 = `0${hr1}`;
      }
      if (min1 < 10) {
        min1 = `0${min1}`;
      }
      if (sec1 < 10) {
        sec1 = `0${sec1}`;
      }
      iso1 = `${year1}-${month1}-${date1}T${hr1}:${min1}:${sec1}.${miliSec1}Z`;
    }
    // console.log(iso1, "iso date");
    return iso1;
  };
  useEffect(() => {
    if (start) {
      let iso1 = isoBuilder(start);
      setStartIso(iso1);
      console.log(iso1, "start");
    }
    if (end) {
      let iso2 = isoBuilder(end);
      setEndIso(iso2);
      console.log(iso2, "end");
    }
  }, [start, end]);
  useEffect(() => {
    if (startIso && endIso) {
      getIso({ start: startIso, end: endIso });
    }
  }, [startIso, endIso]);
  // console.log(start.toISOString(),'ggg')
  return (
    <>
      <RangePicker
        disabledDate={disabledDate}
        defaultValue={[moment().subtract(prevDate, "day"), moment()]}
        showTime={{
          hideDisabledOptions: true,
        }}
        onChange={onChange}
        allowClear={false}
      />
    </>
  );
};
export default MyIsoRangePicker;
