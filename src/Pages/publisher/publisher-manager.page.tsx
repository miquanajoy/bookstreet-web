import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash } from "../../assets/icon/trash";
import listStyle from "./../../styles/listStyle.module.scss";
import { alertService } from "../../_services/alert.service";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import Pagination from "@mui/material/Pagination";

export default function PublisheranagerPage() {
  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });

  // const headers = ["publisherId", "name", "description", "action"];

  function deleteItem(val) {
    const result = fetchWrapper.delete(
      config.apiUrl + "Publisher/" + val.publisherId
    );
    result.then(async (val) => {
      await fetAllData();
      alertService.alert({
        content: "Xóa thành công",
      });
    });
  }

  async function fetAllData(pageNumber = 1) {
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + "Publisher",
      pageNumber
    );
    result.then((res: any) => {
      setData(res);
    });
  }

  useEffect(() => {
    fetAllData();
  }, []);

  function handleChange(pageNumber) {
    fetAllData(pageNumber);
  }

  return (
    <div className="px-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="title">Quản lý nhà xuất bản</h1>
        <Link to="create">
          <button className="bg-black text-white rounded-lg px-3 py-0.5">
            Tạo nhà xuất bản
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {data.list.map((val) => (
          <div
            key={val.publisherId}
            className={`${listStyle["book-detail"]} position-relative`}
          >
            <Link to={"update/" + val.publisherId}>
              <div
                className="h-52 bg-contain bg-no-repeat bg-center"
                style={{ backgroundImage: `url('${val.urlImage}')` }}
              ></div>
            </Link>
            <div
              onClick={(event: any) => {
                deleteItem(val);
              }}
              className={`${listStyle["trash-box"]} position-absolute top-0 right-0 bg-slate-400 rounded px-2 py-1 opacity-50 hover:!opacity-100`}
            >
              <Trash />
            </div>
            <Link to={"/books"}>
              <div className="px-2">
                <h6 className="text-dark">{val.publisherName}</h6>
              </div>
            </Link>
          </div>
        ))}
      </div>
      {data.totalPage ? (
        <div className="flex justify-center">
          <span>
            <Pagination
              count={data.totalPage}
              onChange={(_, pageNumber) => handleChange(pageNumber)}
            />
          </span>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
