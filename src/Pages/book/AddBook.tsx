import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { alertService, onAlert } from '../../_services';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { fetchWrapper } from '../../_helpers/fetch-wrapper';
import config from '../../config';
import draftToHtml from 'draftjs-to-html';

export default function AddBook() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const params = useParams();

  const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState()

  const [editorState, setEditorState] = useState(() => {
    const content = ContentState.createFromText(
      ""
    );
    return EditorState.createWithContent(content);
  });

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

    let reader = new FileReader();
    let base64String;

    reader.onload = function () {
      base64String = reader.result
      setPreview(base64String);
    }
    reader.readAsDataURL(e.target.files[0]);
    setSelectedFile(e.target.files[0])
  }
  const [data, setData] = useState<any>();
  function fetAllData() {
    if (!params.id) return
    const result = fetchWrapper.get(config.apiUrl + 'Book/' + params.id)
    result.then(val => {
      (document.getElementById("nm") as HTMLInputElement).value = val.name
      setData({ ...val })
      const dv = ContentState.createFromText(val.description ?? '');
      setEditorState(EditorState.createWithContent(dv))
    })
  }

  useEffect(() => {
    fetAllData();
  }, []);


  const savedata = val => {
    const dataPost = {
      ...data,
      ...val,
      "bookCover": preview,
      "publicDay": new Date(),
      "isbn": "string",
      description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
    }
    if (params.id) {
      fetchWrapper.put(config.apiUrl + 'Book/' + params.id, dataPost)
    } else {
      fetchWrapper.post(config.apiUrl + 'Book', dataPost)
    }
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
          <input id='nm' type='text' className='form-control' placeholder='Book name' {...register('title')} /><br />
          <label htmlFor='anm'><b>Price: </b></label>
          <input id='anm' type='number' className='form-control' value="0" {...register('price')} /><br />
          <label htmlFor='genr'><b>Publisher: </b></label>
          <select {...register('publisherId')} id='genr' className='form-control'>
            <option value="0">Available</option>
            <option value="1">Not Available</option>
          </select><br />
          <label htmlFor='pub'><b>Public day: </b></label>
          <input id='pub' type='date' className='form-control' value={
            new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + ('0' + new Date().getDate()).slice(-2).toString()
          } {...register('publicDay')} /><br />

        </div>
        <div>
          <label htmlFor='cat'><b>Category: </b></label>
          <select {...register('categoryId')} id='cat' className='form-control'>
            <option value="0">Available</option>
            <option value="1">Not Available</option>
          </select>
          <br />
          <label htmlFor='genr'><b>Genre: </b></label>
          <select {...register('genreId')} id='genr' className='form-control'>
            <option value="0">Available</option>
            <option value="1">Not Available</option>
          </select>
          <br />
          <label htmlFor='dis'><b>Distributor: </b></label>
          <select {...register('distributorId')} id='dis' className='form-control'>
            <option value="0">Available</option>
            <option value="1">Not Available</option>
          </select>
          <br />
          <label htmlFor='isbn'><b>isbn: </b></label>
          <input id='isbn' type='text' className='form-control'  {...register('publicDay')} /><br />

        </div>
        <div className='col-start-2 col-span-2'>
          <label htmlFor='avb'><b>Description: </b></label>
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={setEditorState}
          />
          <input type='submit' className='btn btn-success mt-12' value="Save" />

        </div>
      </form>
    </div>
  )
}
