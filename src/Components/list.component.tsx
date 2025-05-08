import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash } from "../assets/icon/trash";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import { EditIcon } from "../assets/icon/edit";
import Pagination from "@mui/material/Pagination";
import { searchService } from "../_services/search.service";
import { AVATARDEFAULT } from "../_helpers/const/const";

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
    const headerKeys = props.header.map((headerDt) => headerDt.key);
    const listData = props.data.map((td, i) => {
      return [
        ...td.filter((valueDetail) =>
          headerKeys.includes(Object.keys(valueDetail)[0])
        ),
      ];
    });

    return listData.map((tr, rowLine) => (
      <tr key={rowLine}>
        {tr.map((td, indexColumn) => (
          <td key={indexColumn} className="text-dark p-2">
            {Object.keys(td)[0] === "image" ? (
              <div
                className="mx-auto w-20 h-20 bg-contain bg-no-repeat bg-center"
                style={{
                  backgroundImage: `url('${td.image ?? AVATARDEFAULT}')`,
                }}
              ></div>
            ) : (
              <p className="text-center line-clamp-2">
                {td[Object.keys(td)[0]]}
              </p>
            )}
          </td>
        ))}

        {/* ✅ Ẩn nút hành động nếu là Store */}
        {!props.isStore && (
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

              {props.deleteItem && (
                <button
                  className="fw-bold"
                  onClick={() => props.deleteItem(findId(rowLine))}
                >
                  <Trash fill="#000" />
                </button>
              )}
            </div>
          </td>
        )}
      </tr>
    ));
  }

  return (
    <div>
      {/* ✅ Ẩn nút tạo nếu buttonName không truyền */}
      {props.buttonName && (
        <div className="flex items-center justify-between mb-2 bg-slate-200 pb-3">
          <div className="d-flex justify-end gap-2 w-full bg-white px-6 py-3">
            <Link to="create">
              <button className="bg-info text-white rounded-lg px-3 py-0.5">
                {props.buttonName}
              </button>
            </Link>
          </div>
        </div>
      )}

      <div className="p-2">
        <MDBTable align="middle" hover>
          <MDBTableHead>
            <tr className="text-center whitespace-nowrap">
              {props.header.map((v) => (
                <th
                  key={v.key}
                  scope="col"
                  className={v.key === "description" ? "w-[300px]" : ""}
                >
                  <div>{filterHeader(v.name)}</div>
                </th>
              ))}

              {/* ✅ Ẩn cột sửa/xóa nếu là Store */}
              {!props.isStore && (
                <th scope="col" className="whitespace-nowrap">
                  Sửa{props.deleteItem && <> / Xóa</>}
                </th>
              )}
            </tr>
          </MDBTableHead>
          <MDBTableBody>{renderTdUi()}</MDBTableBody>
        </MDBTable>

        {props.totalPage ? (
          <div className="flex justify-center">
            <Pagination
              count={props.totalPage}
              onChange={(_, pageNumber) => props.handleChange(pageNumber)}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
