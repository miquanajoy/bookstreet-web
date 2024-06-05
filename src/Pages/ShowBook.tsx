import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash } from '../assets/icon/trash';
import listStyle from './../styles/listStyle.module.scss';
import { alertService } from '../_services/alert.service';

export default function ShowBook() {
  const [data, setData] = useState([{
    id: "1",
    name: "The book ",
    author: "",
  }, {
    id: "2",
    name: "The book ",
    author: "",
  }, {
    id: "3",
    name: "The book ",
    author: "",
  }, {
    id: "4",
    name: "The book ",
    author: "",
  }, {
    id: "5",
    name: "The book ",
    author: "",
  }, {
    id: "6",
    name: "The book ",
    author: "",
  },]);
  async function fetchAllBooks() {
    // const result = await axios.get('http://localhost:5000/books')
    // setBooks(result.data)
    // setData([])
  }

  useEffect(() => {
    fetchAllBooks();
  }, []);

  function deleteItem(val) {
    alertService.alert(({
      content: "Remove success"
    }))
  }

  return (
    <div className='px-6'>
      <div className="flex items-center justify-between mb-2">
        <h1 className='title'>
          BOOK MANAGEMENT
        </h1>
        <Link to="create">
          <button className='bg-black text-white rounded-lg px-3 py-0.5'>CREATE NEW BOOK</button>
        </Link>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {
          data.map(val => (
            <div key={val.id} className={`${listStyle['book-detail']} position-relative`}>
              <Link to={"update/" + val.id}>
                <div className="h-52 bg-contain bg-no-repeat bg-center" style={{ backgroundImage: `url('book1.jpg')` }}></div>
              </Link>
              <div onClick={(event: any) => {
                deleteItem(val)
              }} className={`${listStyle['trash-box']} position-absolute top-0 right-0 bg-slate-400 rounded px-2 py-1 opacity-50 hover:!opacity-100`} >
                <Trash />
              </div>
              <Link to={"update/" + val.id}>
                <div className="px-2">
                  <h6>{val.name + val.id}</h6>
                  <small>Author: Admin</small>
                </div>
              </Link>
            </div>
          ))

        }
      </div>
      <nav className="mt-4">
        <ul className="flex items-center justify-center -space-x-px h-10 text-base">
          <li>
            <a href="#" className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              <span className="sr-only">Previous</span>
              <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
              </svg>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
          </li>
          <li>
            <a href="#" className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
          </li>
          <li>
            <a href="#" aria-current="page" className="z-10 flex items-center justify-center px-4 h-10 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
          </li>
          <li>
            <a href="#" className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
          </li>
          <li>
            <a href="#" className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">5</a>
          </li>
          <li>
            <a href="#" className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              <span className="sr-only">Next</span>
              <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
              </svg>
            </a>
          </li>
        </ul>
      </nav>

    </div>
  )
}
