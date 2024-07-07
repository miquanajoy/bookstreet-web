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

export default function HandleStore() {
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
    const result = fetchWrapper.get(config.apiUrl + 'Store/' + params.id)
    result.then(val => {
      (document.getElementById("nm") as HTMLInputElement).value = val.name
      setData({ ...val })
      const dv = ContentState.createFromText(
        val.description
      );
      setEditorState(EditorState.createWithContent(dv))
    })
  }

  useEffect(() => {
    fetAllData();
  }, []);


  const savedata = val => {
    // const dataPost = {
    //   ...data,
    //   ...val,
    //   "bookCover": preview,
    //   "publicDay": new Date(),
    //   "isbn": "string",
    //   description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
    // }
    // if (params.id) {
    //   fetchWrapper.put(config.apiUrl + 'Store/' + params.id, dataPost)
    // } else {
    //   fetchWrapper.post(config.apiUrl + 'Store', dataPost)
    // }
  }
  return (
    <div className='container'>
      <form onSubmit={handleSubmit(savedata)} className='gap-2 mt-4'>
        <div>
          <label htmlFor='nm'><b>Store Name: </b></label>
          <input id='nm' type='text' className='form-control' placeholder='Store name' {...register('title')} /><br />
        </div>
        <div>
          <label htmlFor='location'><b>Location: </b></label>
          <select {...register('LocationId')} id='location' className='form-control'>
            <option value="0">Available</option>
            <option value="1">Not Available</option>
          </select>
          <br />
        </div>
        <div>
          <label htmlFor='User'><b>User: </b></label>
          <select {...register('UserId')} id='User' className='form-control'>
            <option value="0">Available</option>
            <option value="1">Not Available</option>
          </select>
          <br />
        </div>

        <div className='col-start-2 col-span-2'>
          <label htmlFor='avb'><b>Description: </b></label>
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={setEditorState}
          />
          <input type='submit' className='btn btn-success mt-12' value="Save" /> &nbsp;

        </div>
      </form>
    </div>
  )
}
