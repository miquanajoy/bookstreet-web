import React, { useEffect, useState } from "react";
import listStyle from "./../../styles/listStyle.module.scss";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import { AVATARDEFAULT, DISTRIBUTOR, ROUTER } from "../../_helpers/const/const";
import { alertService } from "../../_services";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Trash } from "../../assets/icon/trash";
import { Pagination } from "@mui/material";

export default function ShowDistributor() {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });

  function deleteItem(val) {
    const result = fetchWrapper.delete(
      config.apiUrl + DISTRIBUTOR + "/" + val.distributorId
    );
    result.then((val) => {
      fetAllData();
      alertService.alert({
        content: "Remove success",
      });
    });
  }

  async function fetAllData(pageNumber = 1) {
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + DISTRIBUTOR,
      pageNumber
    );
    result.then((res: any) => {
      setData(res);
    });
  }

  useEffect(() => {
    fetAllData();
  }, [pathname]);

  return (
    <div className="px-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="title">Distributor management</h1>
        <div className="d-flex gap-2">
          <Link to="create">
            <button className="bg-black text-white rounded-lg px-3 py-0.5">
              Create distributor
            </button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {data.list.map((val) => (
          <div
            key={val.distributorId}
            className={`${listStyle["book-detail"]} position-relative`}
          >
            <Link to={"update/" + val.distributorId}>
              <div
                className="h-40 bg-contain bg-no-repeat bg-center"
                style={{
                  backgroundImage: `url(${val.urlImage ? val.urlImage : AVATARDEFAULT})`,
                }}
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
            <Link to={"update/" + val.distributorId}>
              <div className="mt-1 text-dark">
                <h6 className="mb-0 line-clamp-2">{val.distriName}</h6>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-2">
        {data.totalPage ? (
          <div className="flex justify-center">
            <span>
              <Pagination
                count={data.totalPage}
                onChange={(_, pageNumber) => fetAllData(pageNumber)}
              />
            </span>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
