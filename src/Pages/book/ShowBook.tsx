import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash } from '../../assets/icon/trash';
import listStyle from '../../styles/listStyle.module.scss';
import { alertService } from '../../_services/alert.service';
import { fetchWrapper } from '../../_helpers/fetch-wrapper';
import config from '../../config';

export default function ShowBook() {
  const [data, setData] = useState([]);

  function deleteItem(val) {
    const result = fetchWrapper.delete(config.apiUrl + 'Book/' + val.bookId)
    result.then(val => {
      alertService.alert(({
        content: "Remove success"
      }))
      fetAllData()
    })
  }

  async function fetAllData() {
    const result = fetchWrapper.get(config.apiUrl + 'Book')
    result.then(val => {
      if (!val.length) {
        const data = {
          bookId: 0,
          categoryId: 0,
          distributorId: 0,
          publisherId: 0,
          genreId: 0,
          title: "string",
          bookCover: "string",
          description: "string",
          publicDay: "2024-07-01T13:23:45.275Z",
          price: 0,
          isbn: "string"
        };
        const data_list = [];
        for (let i = 0; i < 15; i++) {
          const new_data = { ...data };  // Spread operator to copy object
          new_data.bookId = i;
          new_data.title = `Anime best seller (#${i + 1})`;
          new_data.bookCover = i % 2 ? 'book1.png' : 'book1.jpg'
          new_data.description = `Description of book ${i + 1}`;
          new_data.price = Math.floor(Math.random() * 91) + 10;  // Random price between 10 and 100
          new_data.isbn = `ISBN ${i + 1}`;
          data_list.push(new_data);
        }
        setData(data_list);
      }
      else {
        setData(val);
      }
    })
  }

  useEffect(() => {
    fetAllData();
  }, []);

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
            <div key={val.bookId} className={`${listStyle['book-detail']} position-relative`}>
              <Link to={"update/" + val.bookId}>
                <div className="h-60 bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url(${val.bookCover})` }}></div>
              </Link>
              <div onClick={(event: any) => {
                deleteItem(val)
              }} className={`${listStyle['trash-box']} position-absolute top-0 right-0 bg-slate-400 rounded px-2 py-1 opacity-50 hover:!opacity-100`} >
                <Trash />
              </div>
              <Link to={"update/" + val.bookId}>
                <div className='mt-1 text-dark'>
                  <h6 className="mb-0">{val.title}</h6>
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
