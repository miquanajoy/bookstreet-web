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

export default function HandleArea() {
  const { control, register, handleSubmit, resetField } = useForm();
  const navigate = useNavigate();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: "area"
  });

  function fetAllData() {
    const result = fetchWrapper.get(config.apiUrl + 'Area')
    result.then(val => {
      remove()
      append([...val.map(v => ({ areaId: v.areaId, name: v.name }))]);
    })
  }

  useEffect(() => {
    fetAllData()
  }, []);

  function createField() {
    append({ value: '' });
  }

  function deleteItem(val) {
    const result = fetchWrapper.delete(config.apiUrl + 'Area/' + val.areaId)
    result.then(val => {
      alertService.alert(({
        content: "Remove success"
      }))
      fetAllData()
    })
  }

  const savedata = (value, name) => {
    if (value.areaId) {
      fetchWrapper.put(config.apiUrl + 'Area/' + value.areaId, {
        areaId: value.areaId, name
      })
    } else {
      const createItem = fetchWrapper.post(config.apiUrl + 'Area', {
        areaId: 0, name
      });
      createItem.then(() => { fetAllData() })
    }
  }
  return (
    <div className='container'>
      <div className="flex items-center justify-between mb-2">
        <h1 className='title'>
          AREA MANAGEMENT
        </h1>
        <button className='bg-black text-white rounded-lg px-3 py-0.5' onClick={(_) => {
          createField()
        }} >CREATE NEW AREA</button>
      </div>
      <form onSubmit={handleSubmit(savedata)} className='flex flex-wrap gap-4 mt-4'>

        {
          fields.map((value, index) =>
          (
            <div key={index} className='d-flex items-center position-relative'>
              <input type="text" className="border p-2.5" key={value.id}
                {...register(`area.${index}.name`)}
                onBlur={(e) => { savedata(value, e.target.value) }} />
              {
                register(`area.${index}.areaId`) && <div onClick={(_) => {
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
