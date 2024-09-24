import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash } from "../assets/icon/trash";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import { EditIcon } from "../assets/icon/edit";
import Pagination from "@mui/material/Pagination";
import { searchService } from "../_services/home/search.service";

export default function ListComponent(props) {
  const navigate = useNavigate();

  function filterHeader(headerName: string) {
    switch (headerName) {
      case "urlImage":
        return "Avatar";
      case "locationName":
        return "Tên vị trí";
      case "areaName":
        return "Tên khu vực";
      case "streetName":
        return "Tên Đường sách";
      case "description":
        return "Mô tả";
      default:
        return headerName;
    }
  }

  function findId(index) {
    const item = props.data[index].find((td, i) => {
      return Object.keys(td)[0] == "id";
    });
    return item.id;
  }

  function renderTdUi() {
    const headerKeys = props.header.map((headerDt) => {
      return headerDt.key;
    });
    const listData = props.data.map((td, i) => {
      return [
        ...td.filter((valueDetail) => {
          return headerKeys.includes(Object.keys(valueDetail)[0]);
        }),
      ];
    });

    return listData.map((tr, rowLine) => (
      <tr key={rowLine}>
        {tr.map((td, indexColumn) => (
          <td
            key={indexColumn}
            className="flex-inline items-center text-dark p-2"
          >
            <div className="">
              {Object.keys(td)[0] == "image" ? (
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
              ) : (
                <p className="text-center line-clamp-2">
                  {td[Object.keys(td)[0]]}
                </p>
              )}
            </div>
          </td>
        ))}
        <td>
          <div className="flex items-center justify-center gap-4">
            <button
              className="fw-bold"
              onClick={() => {
                navigate("update/" + findId(rowLine), { replace: true });
              }}
            >
              <EditIcon />
            </button>
            {props.deleteItem ? (
              <button
                className="fw-bold"
                onClick={(event: any) => {
                  props.deleteItem(findId(rowLine));
                }}
              >
                <Trash fill="#000" />
              </button>
            ) : (
              <></>
            )}
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
              <th
                key={v.key}
                scope="col"
                className={v.key == "description" ? "w-[300px]" : ""}
              >
                <div>{filterHeader(v.name)}</div>
              </th>
            ))}
            <th scope="col" className="">
              Sửa
              {props.deleteItem ? <> / Xóa</> : <></>}
            </th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>{renderTdUi()}</MDBTableBody>
      </MDBTable>
      {props.totalPage ? (
        <div className="flex justify-center">
          <span>
            <Pagination
              count={props.totalPage}
              onChange={(_, pageNumber) => props.handleChange(pageNumber)}
            />
          </span>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
