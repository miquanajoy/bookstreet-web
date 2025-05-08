import React, { useEffect, useState } from "react";
import listStyle from "./../../styles/listStyle.module.scss";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import {
  AVATARDEFAULT,
  DISTRIBUTOR,
  ROUTER,
} from "../../_helpers/const/const";
import { alertService } from "../../_services";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Trash } from "../../assets/icon/trash";
import { Pagination } from "@mui/material";
import { Role } from "../../models/Role";
import {
  SearchModel,
  searchService,
  typeSearch,
} from "../../_services/search.service";

export default function ShowDistributor() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // ✅ Lấy role từ localStorage
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const role = user?.user?.role;

  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });

  function deleteItem(val) {
    fetchWrapper.delete(
      config.apiUrl + DISTRIBUTOR + "/" + val.distributorId,
      fetAllData
    );
  }

  async function fetAllData(pageNumber = 1) {
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + DISTRIBUTOR,
      pageNumber,
      {
        filters: [
          {
            field: "distriName",
            value: searchService.$SearchValue.value?.dataSearch,
            operand: typeSearch,
          },
        ],
      }
    );
    result.then((res: any) => {
      setData(res);
    });
  }

  useEffect(() => {
    fetAllData();
  }, [pathname]);

  // Search area
  useEffect(() => {
    const searchSub = searchService.$SearchValue.subscribe({
      next: (v: SearchModel) => {
        if (v?.isClickSearch) {
          fetAllData();
        }
      },
    });
    return () => searchSub.unsubscribe();
  }, []);

  return (
    <div className="">
      {/* ✅ Ẩn nút "Tạo" nếu là Store */}
      <div className="flex items-center justify-between mb-2 bg-slate-200 pb-3">
        <div className="d-flex justify-end gap-2 w-full bg-white px-6 py-3">
          {role !== Role.Store && (
            <Link to="create">
              <button className="bg-info text-white rounded-lg px-3 py-0.5">
                Tạo nhà phân phối
              </button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 px-6">
        {data.list.map((val) => (
          <div
            key={val.distributorId}
            className={`${listStyle["book-detail"]} position-relative`}
          >
            {/* ✅ Ẩn link cập nhật nếu là Store */}
            {role !== Role.Store ? (
              <Link to={"update/" + val.distributorId}>
                <div
                  className="h-40 bg-cover bg-no-repeat bg-center"
                  style={{
                    backgroundImage: `url(${val.urlImage || AVATARDEFAULT})`,
                  }}
                ></div>
              </Link>
            ) : (
              <div
                className="h-40 bg-cover bg-no-repeat bg-center"
                style={{
                  backgroundImage: `url(${val.urlImage || AVATARDEFAULT})`,
                }}
              ></div>
            )}

            {/* ✅ Ẩn nút xóa nếu là Store */}
            {role !== Role.Store && (
              <div
                onClick={() => deleteItem(val)}
                className={`${listStyle["trash-box"]} position-absolute top-0 right-0 bg-slate-400 rounded px-2 py-1 opacity-50 hover:!opacity-100`}
              >
                <Trash />
              </div>
            )}

            {/* ✅ Ẩn link tên nếu là Store */}
            {role !== "Store" ? (
              <Link to={"update/" + val.distributorId}>
                <div className="mt-1 text-dark">
                  <h6 className="mb-0 line-clamp-2">{val.distriName}</h6>
                </div>
              </Link>
            ) : (
              <div className="mt-1 text-dark">
                <h6 className="mb-0 line-clamp-2">{val.distriName}</h6>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Phân trang */}
      <div className="mt-2 p-2">
        {data.totalPage ? (
          <div className="flex justify-center">
            <Pagination
              count={data.totalPage}
              onChange={(_, pageNumber) => fetAllData(pageNumber)}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
