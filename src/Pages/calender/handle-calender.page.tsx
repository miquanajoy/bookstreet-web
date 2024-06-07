import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { alertService } from '../../_services/alert.service';
import { DateRangePicker } from "./DateRangePicker";
import { DatePicker } from "./DatePicker";
import { today, now, getLocalTimeZone } from "@internationalized/date";
import { ChakraProvider, Box, Heading, Link } from "@chakra-ui/react";

export default function HandleCalenderPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState()

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }

    const objectUrl: any = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0])
  }


  const savedata = data => {
    // alertService.alert({
    //   id: 1,
    //   autoClose: false
    // })
    // // console.log('alertService.onAlert :>> ', alertService.onAlert());
    // onAlert().subscribe({
    //   next(value) {
    //     console.log('value :>> ', value);
    //   },
    //   complete() {
    //     console.log(5000);
    //   },
    //   error(err) {
    //     console.log('err :>> ', err);
    //   },
    // }
    // )
    alertService.alert(({
      content: "Create success"
    }))
    console.log(data);
    // axios.post('http://localhost:5000/Users',data)
  }

  return (
    <div className='container'>
      <h1 className='title'>EVENT MANAGEMENT</h1>
      <form onSubmit={handleSubmit(savedata)} className='grid grid-cols-2 gap-4 jumbotron mt-4'>
        <div className='flex flex-column items-center gap-2'>
          <label htmlFor="imageUpload" className='block h-52 w-52 bg-slate-50 bg-contain bg-no-repeat bg-center' style={{ backgroundImage: 'url(' + preview + ')' }}></label>
          <input type='file' onChange={onSelectFile} id="imageUpload" className='hidden' />
          <label htmlFor="imageUpload" className='block border px-2 py-1 bg-slate-50 rounded'>New Image</label>
        </div>

        <div>
          <label className='uppercase' htmlFor='nm'><b>EVENT: </b></label>
          <input id='nm' type='text' className='form-control' placeholder='eg. Atomic Habits' {...register('Title')} /><br />
          <label className='uppercase' htmlFor='anm'><b>BOOK STREET: </b></label>
          <input id='anm' type='text' className='form-control' placeholder='eg. James Clear' {...register('Author')} /><br />
          <label className='uppercase' htmlFor='avb'><b>ZONE: </b></label>
          <input id='avb' type='text' className='form-control' placeholder='eg. James Clear' {...register('Description')} /><br />
          <label className='uppercase' htmlFor='avb'><b>select date/time: </b></label>
          <ChakraProvider>
            <Box marginLeft="12">

              <DateRangePicker
                label="Date and time range"
                minValue={today(getLocalTimeZone())}
                defaultValue={{
                  start: now(getLocalTimeZone()),
                  end: now(getLocalTimeZone()).add({ weeks: 1 })
                }}
              />
            </Box>
          </ChakraProvider>

        </div>
      </form>
    </div>
  )
}
