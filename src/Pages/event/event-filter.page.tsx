import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Button } from "@mui/material";
import { useState } from "react";

export default function EventFilter(prop) {
  const [formData, setFormData] = useState<any>();

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormData(value);
    prop.fetAllData(1, value)
  };

  const handleReset = () => {
    prop.fetAllData(1)
  };

  return (
    <div className="border-r ">
      <h4 className="pl-4">Bộ tìm kiếm</h4>
      <div className="flex flex-column pl-6">
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">Dạng sự kiện</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="eventType"
            value={formData}
            onChange={handleRadioChange}
          >
            <FormControlLabel
              value="0"
              control={<Radio />}
              label="Không xác định"
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
      </div>
      <div className="ml-6 my-2">
        <Button variant="outlined" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
