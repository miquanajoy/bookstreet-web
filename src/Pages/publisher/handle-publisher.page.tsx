import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState } from 'draft-js';

export default function HandlePublisher() {
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
    // axios.post('http://localhost:5000/Users',data)
  }
  return (
    <div className='container'>
      <div className="col-10 mx-auto">
        <h1 className='title'>Publisher Manager</h1>
        <form onSubmit={handleSubmit(savedata)} className='grid grid-cols-2 gap-2 jumbotron mt-4'>
          <div className='flex flex-column items-center gap-2'>
            <label htmlFor="imageUpload" className='block h-52 w-52 bg-slate-50 bg-contain bg-no-repeat bg-center' style={{ backgroundImage: 'url(' + preview + ')' }}></label>
            <input type='file' onChange={onSelectFile} id="imageUpload" className='hidden' />
            <label htmlFor="imageUpload" className='block border px-2 py-1 bg-slate-50 rounded'>New Image</label>
          </div>

          <div>
            <label className='uppercase' htmlFor='nm'><b>BRAND NAME: </b></label>
            <input id='nm' type='text' className='form-control' {...register('Title')} /><br />
            <label className='uppercase' htmlFor='nm'><b>Description: </b></label>
            <Editor
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
            />
            <input type='submit' className='btn btn-dark mt-2' value="Save" /> &nbsp;
          </div>

        </form>
      </div>
    </div>
  )
}
