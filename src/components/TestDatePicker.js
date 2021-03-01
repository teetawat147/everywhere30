import React, { useState } from 'react';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

function TDP() {
  const [selectedDate, handleDateChange] = useState(new Date());

  return (
    <div>
        ddddddddddddd--------

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker value={selectedDate} onChange={handleDateChange} />
        {/* <TimePicker value={selectedDate} onChange={handleDateChange} /> */}
        {/* <DateTimePicker value={selectedDate} onChange={handleDateChange} /> */}
        </MuiPickersUtilsProvider>
    </div>
  );
}

export default TDP;