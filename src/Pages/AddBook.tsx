import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { alertService, onAlert } from '../_services';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState } from 'draft-js';

export default function AddBook() {
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
    alertService.alert(({
      content: "Create success"
    }))
    // console.log('alertService.onAlert :>> ', alertService.onAlert());

    console.log(data);
    // axios.post('http://localhost:5000/books',data)
  }
  return (
    <div className='container'>
      <form onSubmit={handleSubmit(savedata)} className='grid grid-cols-3 gap-2 jumbotron mt-4'>
        <div className='row-span-2 flex flex-column items-center gap-2'>
          <label htmlFor="imageUpload" className='block h-52 w-52 bg-slate-50 bg-contain bg-no-repeat bg-center' style={{ backgroundImage: 'url(' + preview + ')' }}></label>
          <input type='file' onChange={onSelectFile} id="imageUpload" className='hidden' />
          <label htmlFor="imageUpload" className='block border px-2 py-1 bg-slate-50 rounded'>New Image</label>
        </div>

        <div>
          <label htmlFor='nm'><b>Book Name: </b></label>
          <input id='nm' type='text' className='form-control' placeholder='eg. Atomic Habits' {...register('Title')} /><br />
          <label htmlFor='anm'><b>Author Name: </b></label>
          <input id='anm' type='text' className='form-control' placeholder='eg. James Clear' {...register('Author')} /><br />

        </div>
        <div>
          <label htmlFor='cat'><b>Category: </b></label>
          <select {...register('Category')} id='cat' className='form-control'>
            <option value="Available">Available</option>
            <option value="Not Available">Not Available</option>
          </select>
          <br />
          <label htmlFor='genr'><b>Genre: </b></label>
          <select {...register('Genre')} id='genr' className='form-control'>
            <option value="Available">Available</option>
            <option value="Not Available">Not Available</option>
          </select>
        </div>
        <div className='col-start-2 col-span-2'>
          <label htmlFor='avb'><b>Description: </b></label>
          <Editor
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
          />
          <input type='submit' className='btn btn-success mt-12' value="Save" /> &nbsp;

        </div>
      </form>
    </div>
  )
}
