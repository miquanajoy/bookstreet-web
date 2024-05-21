import React from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export default function UpdateBook() {
  const {id} = useParams();
  const {register, handleSubmit, setValue} = useForm();
  const navigate = useNavigate();

  async function fetchBook() {
    const result = await axios.get(`http://localhost:5000/books/${id}`)
    setValue('name',result.data.name)
    setValue('a_name',result.data.a_name)
    setValue('avaibility', result.data.avaibility)
  }

  function savedata(data) {
    axios.put(`http://localhost:5000/books/${id}`,data)
    navigate('/show')
  }

  useEffect(()=>{
    fetchBook();
  },[]);
  
  return (
    <div className='container'>
      <form onSubmit={handleSubmit(savedata)} className='jumbotron mt-4'>
        <label htmlFor='nm'><b>Book Name: </b></label>
        <input id='nm' type='text' className='form-control' placeholder='eg. Authomic Habits' {...register('name')}/><br/>
        <label htmlFor='anm'><b>Author Name: </b></label>
        <input id='anm' type='text' className='form-control' placeholder='eg. James Clear' {...register('a_name')}/><br/>
        <label htmlFor='avb'><b>Avaibility: </b></label>
        <select {...register('avaibility')} id='avb' className='form-control'>
          <option value="Available">Available</option>
          <option value="Not Available">Not Available</option>
        </select>
        <br/>
        <input type='submit' className='btn btn-success' value="Update"/> &nbsp;
        <input type='reset' className='btn btn-warning'/>
      </form>
    </div>
  )
}
