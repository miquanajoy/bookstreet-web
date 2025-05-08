import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Button } from "@mui/material";
import { Role } from "../../models/Role";
import { useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

export default function EventFilter({
  fetAllData,
  formData,
  setFormData,
  eventStatus,
  setEventStatus,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  filterType,
  setFilterType,
}) {
  const { user } = JSON.parse(localStorage.getItem("userInfo"));

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormData(value);
    setFilterType("status");
  };

  const handleEventStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEventStatus(value);
    setFilterType("status");
  };

  const handleReset = () => {
    setFormData(undefined);
    setEventStatus("1"); // Đặt trạng thái về "Đang diễn ra"
    setFromDate(null);
    setToDate(null);
    setFilterType("status");
    // Gọi lại API với trạng thái mặc định là "Đang diễn ra"
    fetAllData(1, undefined, "1", null, null, "status");
  };

  const FormFilterByEventType = () => {
    return user.role == Role.Store ? (
      <></>
    ) : (
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">Dạng sự kiện</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="eventType"
          value={formData}
          onChange={handleRadioChange}
        >
          <FormControlLabel value="5" control={<Radio />} label="Tất cả" />
          <FormControlLabel
            value="0"
            control={<Radio />}
            label="Sự kiện khác"
          />
          <FormControlLabel
            value="1"
            control={<Radio />}
            label="Sự kiện vui chơi giải trí"
          />
          <FormControlLabel
            value="2"
            control={<Radio />}
            label="Sự kiện ra mắt sách, ký tặng sách"
          />
          <FormControlLabel
            value="3"
            control={<Radio />}
            label="Sự kiện giao lưu với diễn giả, tác giả"
          />
          <FormControlLabel
            value="4"
            control={<Radio />}
            label="Sự kiện giảm giá"
          />
        </RadioGroup>
      </FormControl>
    );
  };

  return (
    <div className="border-r">
      <h4 className="pl-4">Bộ tìm kiếm</h4>
      <div className="flex flex-column pl-6">
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">Trạng thái</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="eventStatus"
            value={eventStatus}
            onChange={handleEventStatus}
          >
            <FormControlLabel
              value="0"
              control={<Radio />}
              label="Sắp diễn ra"
            />
            <FormControlLabel
              value="1"
              control={<Radio />}
              label="Đang diễn ra"
            />
            <FormControlLabel
              value="2"
              control={<Radio />}
              label="Đã kết thúc"
            />
          </RadioGroup>
        </FormControl>
        <FormFilterByEventType />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <FormLabel className="mt-2">Thời gian</FormLabel>
          <div className="flex flex-col gap-2 p-2">
            <DatePicker
              label="Từ ngày"
              value={fromDate}
              onChange={(newValue: Dayjs | null) => {
                setFromDate(newValue);
                setFilterType("date");
              }}
              format="DD/MM/YYYY"
              slotProps={{ textField: { size: "small" } }}
            />
            <DatePicker
              label="Đến ngày"
              value={toDate}
              onChange={(newValue: Dayjs | null) => {
                setToDate(newValue);
                setFilterType("date");
              }}
              format="DD/MM/YYYY"
              slotProps={{ textField: { size: "small" } }}
            />
          </div>
        </LocalizationProvider>
      </div>
      <div className="ml-6 my-2">
        <Button variant="outlined" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}