import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash } from "../assets/icon/trash";
import showBookStyle from "./../styles/showBook.module.scss";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import { EditIcon } from "../assets/icon/edit";

export default function ListComponent(props) {
  function renderTdUi() {
    const headerKeys = props.header.map((headerDt) => {
      return headerDt.key;
    });
    const listData = props.data.map((td, i) => {
      return td.filter((valueDetail) => {
        return headerKeys.includes(Object.keys(valueDetail)[0]);
      });
    });
    return listData.map((tr, rowLine) => (
      <tr key={rowLine}>
        {tr.map((td, indexColumn) => (
          <td
            key={indexColumn}
            className="flex-inline items-center text-dark p-2"
          >
            <div>
              {Object.keys(td)[0] == "image" && (
                <div className="relative">
                  <div
                    className="mx-auto w-20 h-20 bg-contain bg-no-repeat bg-center"
                    style={{
                      backgroundImage: `url('${
                        td.image ??
                        "https://mdbootstrap.com/img/new/avatars/8.jpg"
                      }')`,
                    }}
                  ></div>
                </div>
              )}
              {<p className="text-center">{td[Object.keys(td)[0]]}</p>}
            </div>
          </td>
        ))}
        <td>
          <div className="flex items-center justify-center gap-4">
            <div>
              <Link to={"update/" + props.data[rowLine][0].id}>
                <p className="fw-bold mb-1">
                  <EditIcon />
                </p>
              </Link>
            </div>
            <div>
              <div
                className="fw-bold mb-1"
                onClick={(event: any) => {
                  props.deleteItem(props.data[rowLine][0]);
                }}
              >
                <Trash fill="#000" />
              </div>
            </div>
          </div>
        </td>
      </tr>
    ));
  }
  return (
    <div className="px-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="title">{props.title}</h1>
        {props.buttonName && (
          <Link to="create">
            <button className="bg-black text-white rounded-lg px-3 py-0.5">
              {props.buttonName}
            </button>
          </Link>
        )}
      </div>
      <MDBTable align="middle" hover>
        <MDBTableHead>
          <tr className="text-center">
            {props.header.map((v) => (
              <th key={v.key} scope="col">
                {v.name}
              </th>
            ))}
            <th scope="col">Actions</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {/* {props.data.map((v, index) => (
            <tr key={index}>
              {v.map((td, i) => (
              {}
                // <td key={i} className="flex-inline items-center text-dark p-2">
                //   <div>
                //     {i == 0 && (
                //       <div className="relative">
                //         <div
                //           className="w-20 h-20 bg-contain bg-no-repeat bg-center"
                //           style={{
                //             backgroundImage: `url('${
                //               td.image ??
                //               "https://mdbootstrap.com/img/new/avatars/8.jpg"
                //             }')`,
                //           }}
                //         ></div>
                //       </div>
                //     )}
                //     {i != 0 && (
                //       <p className="text-center">{td[props.header[i].key]}</p>
                //     )}
                //   </div>
                // </td>
              ))}
              
            </tr>
          ))} */}
          {renderTdUi()}
        </MDBTableBody>
      </MDBTable>

      <nav className="mt-4">
        <ul className="flex items-center justify-center -space-x-px h-10 text-base">
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Previous</span>
              <svg
                className="w-3 h-3 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              1
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              2
            </a>
          </li>
          <li>
            <a
              href="#"
              aria-current="page"
              className="z-10 flex items-center justify-center px-4 h-10 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            >
              3
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              4
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              5
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Next</span>
              <svg
                className="w-3 h-3 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
