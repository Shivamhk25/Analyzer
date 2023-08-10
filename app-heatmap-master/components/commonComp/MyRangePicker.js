import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { DatePicker } from "antd";
import moment from "moment";
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD-hh-mm";

const MyRangePicker = ({ getDate, prevDay = 7 }) => {
  const today = new Date();
  const pre7Day = new Date(today.getTime() - prevDay * 24 * 60 * 60 * 1000);
  const initialDate = [moment(pre7Day, dateFormat), moment(today, dateFormat)];

  const utcConverter = (conDate, offset) => {
    let localTime = new Date(conDate).getTime();
    let utcTimeMiliSec = localTime;
    // console.log(utcTimeMiliSec, localTime, "hi");
    return utcTimeMiliSec;
  };
  function onChange(value, dateString) {
    // console.log("Formatted Selected Time: ", dateString);
    if (value) {
      let offSet = value[0].utcOffset();
      let startDate = value[0]._d;
      let endDate = value[1]._d;
      let data = {
        start: utcConverter(startDate, offSet),
        end: utcConverter(endDate, offSet),
      };
      console.log(offSet, "offset", data);
      getDate(data);
    }
  }
  function disabledDate(current) {
    // Can not select after today
    return current > moment();
  }
  useEffect(() => {
    const data = {
      start: utcConverter(initialDate[0]?._d, initialDate[0]?.utcOffset()),
      end: utcConverter(initialDate[1]?._d, initialDate[1]?.utcOffset()),
    };
    console.log(data);
    getDate(data);
  }, []);
  return (
    <div>
      <RangePicker
        defaultValue={initialDate}
        disabledDate={disabledDate}
        showTime={{ format: "HH:mm" }}
        format="YYYY-MM-DD HH:mm"
        onChange={onChange}
        allowClear={false}
        // onOk={onOk}
        // size={'small'}
      />
    </div>
  );
};

export default MyRangePicker;
