import React from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useNavigate, useParams, NavLink } from 'react-router-dom'

export default function DeleteBook() {
  const {id} = useParams();
  const navigate = useNavigate();
  const {handleSubmit} = useForm();
  const [book, setBook] = useState([]);

  async function fetchBook(){
    const result = await axios.get(`http://localhost:5000/books/${id}`)
    setBook(result.data)
  }

  useEffect(()=>{
    fetchBook();
  },[]);

  function deleteData() {
    axios.delete(`http://localhost:5000/books/${id}`)
    navigate('/show')
  }

  return (
    <div>
      <form onSubmit={handleSubmit(deleteData)}>
        <h1>Are you sure you want to delete {book.name}?</h1>
        <input type='submit' value='Yes' className='btn btn-danger'/>
        <NavLink to={'/show'}><button className='btn btn-success'>No</button></NavLink>
      </form>
    </div>
  )
}
