import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useFieldArray, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { alertService, onAlert } from '../../_services';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { fetchWrapper } from '../../_helpers/fetch-wrapper';
import config from '../../config';
import draftToHtml from 'draftjs-to-html';
import { Trash } from '../../assets/icon/trash';

export default function HandleLocation() {
  const { control, register, handleSubmit, resetField } = useForm();
  const navigate = useNavigate();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: "location"
  });

  function fetAllData() {
    const result = fetchWrapper.get(config.apiUrl + 'Location')
    result.then(val => {
      remove()
      append([...val.map(v => ({ locationId: v.locationId, name: v.name }))]);
    })
  }

  useEffect(() => {
    fetAllData()
  }, []);

  function createField() {
    append({ value: '' });
  }

  function deleteItem(val) {
    const result = fetchWrapper.delete(config.apiUrl + 'Location/' + val.locationId)
    result.then(val => {
      alertService.alert(({
        content: "Remove success"
      }))
      fetAllData()
    })
  }

  const savedata = (value, name) => {
    if (value.locationId) {
      fetchWrapper.put(config.apiUrl + 'Location/' + value.locationId, {
        locationId: value.locationId, name
      })
    } else {
      const createItem = fetchWrapper.post(config.apiUrl + 'Location', {
        locationId: 0, name
      });
      createItem.then(() => { fetAllData() })
    }
  }
  return (
    <div className='container'>
      <div className="flex items-center justify-between mb-2">
        <h1 className='title'>
          LOCATION MANAGEMENT
        </h1>
        <button className='bg-black text-white rounded-lg px-3 py-0.5' onClick={(_) => {
          createField()
        }} >CREATE NEW LOCATION</button>
      </div>
      <form onSubmit={handleSubmit(savedata)} className='flex flex-wrap gap-4 mt-4'>

        {
          fields.map((value, index) =>
          (
            <div key={index} className='d-flex items-center position-relative'>
              <input type="text" className="border p-2.5" key={value.id}
                {...register(`location.${index}.name`)}
                onBlur={(e) => { savedata(value, e.target.value) }} />
              {
                register(`location.${index}.locationId`) && <div onClick={(_) => {
                  deleteItem(value)
                }} className="position-absolute right-2 bg-slate-400 rounded px-2 py-1 opacity-50 hover:!opacity-100" >
                  <Trash />
                </div>
              }
            </div>
          )
          )
        }
      </form>
    </div>
  )
}
