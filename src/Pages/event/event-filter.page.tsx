import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { EventTypeModel } from '../../models/calender.model';

export default function EventFilter() {
    const [formData, setFormData] = useState<EventTypeModel>({
        eventStatus: '0',
        eventType: '2',
    });

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleReset = () => {
        setFormData({
            eventStatus: '0',
            eventType: '2',
        });
    };


    return (
        <div className='pt-[5.5px] border-r w-1/5'>
            {/* <h5 className='pl-4 border-t-[16px] border-[#e2e8f0] pt-6'> */}
            <h5 className='pl-4 pt-6'>
                Filter
            </h5>
            <div className="flex flex-column pl-6">
                <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">Event status</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="eventStatus" // Updated name for form control
                        value={formData.eventStatus}
                        onChange={handleRadioChange}
                    >
                        <FormControlLabel value="0" control={<Radio />} label="Sắp diễn ra" />
                        <FormControlLabel value="1" control={<Radio />} label="Đang diễn ra" />
                    </RadioGroup>
                </FormControl>
                <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">Event type</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="eventType"  // Updated name for form control
                        value={formData.eventType}
                        onChange={handleRadioChange}
                    >
                        <FormControlLabel value="2" control={<Radio />} label="Sự kiện kí tặng" />
                        <FormControlLabel value="3" control={<Radio />} label="Sự kiện vui chơi" />
                    </RadioGroup>
                </FormControl>

            </div>
            <div className="ml-6 my-2">
                <Button variant="outlined" onClick={handleReset}>
                    Reset
                </Button>
            </div>

        </div>
    )
}