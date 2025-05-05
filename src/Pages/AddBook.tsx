import React from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

export default function AddBook() {
  const {register, handleSubmit} =  useForm();
  const navigate = useNavigate();
  const savedata = data => {
    console.log(data);
    // axios.post('http://localhost:5000/books',data)
  }
  return (
    <div className='container'>
      <form onSubmit={handleSubmit(savedata)} className='jumbotron mt-4'>
        <label htmlFor='nm'><b>Book Name: </b></label>
        <input id='nm' type='text' className='form-control' placeholder='eg. Atomic Habits' {...register('name')}/><br/>
        <label htmlFor='anm'><b>Author Name: </b></label>
        <input id='anm' type='text' className='form-control' placeholder='eg. James Clear' {...register('a_name')}/><br/>
        <label htmlFor='avb'><b>Avaibility: </b></label>
        <select {...register('avaibility')} id='avb' className='form-control'>
          <option value="Available">Available</option>
          <option value="Not Available">Not Available</option>
        </select>
        <br/>
        <input type='submit' className='btn btn-success' value="Add"/> &nbsp;
        <input type='reset' className='btn btn-warning'/>
      </form>
    </div>
  )
}
