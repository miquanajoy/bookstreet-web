import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash } from '../assets/icon/trash';
import showBookStyle from './../styles/showBook.module.scss';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

export default function ListComponent(props) {
    return (
        <div className='px-6'>
            <div className="flex items-center justify-between mb-2">
                <h1 className='title'>
                    {props.title}
                </h1>
                {props.buttonName &&
                    (<Link to="create">
                        <button className='bg-black text-white rounded-lg px-3 py-0.5'>
                            {props.buttonName}
                        </button>
                    </Link>)
                }
            </div>
            <MDBTable align='middle'>
                <MDBTableHead>
                    <tr>
                        {
                            props.header.map(v => (
                                <th key={v} scope='col'>{v}</th>
                            ))
                        }
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {
                        props.data.map((v, index) => (
                            <tr key={index}>
                                {
                                    v.map((td, i) => (
                                        <td key={i}>
                                            <div className='d-flex align-items-center'>
                                                {
                                                    i == 0 &&
                                                    <img
                                                        src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                                                        alt=''
                                                        style={{ width: '45px', height: '45px' }}
                                                        className='rounded-circle'
                                                    />
                                                }
                                                <div className='ms-3'>
                                                    <p className='fw-bold mb-1'>{td[props.header[i]]}</p>
                                                </div>
                                            </div>
                                        </td>
                                    ))
                                }
                                <td>
                                    <div className='d-flex align-items-center'>

                                        <div className='ms-3'>
                                            <p className='fw-bold mb-1'>
                                                <Trash fill="#000" />
                                            </p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </MDBTableBody>
            </MDBTable>

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