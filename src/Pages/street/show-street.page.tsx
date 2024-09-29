import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Trash } from "../../assets/icon/trash";
import listStyle from "../../styles/listStyle.module.scss";
import { alertService } from "../../_services/alert.service";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import Pagination from "@mui/material/Pagination";
import { STREET, AVATARDEFAULT } from "../../_helpers/const/const";
import { SearchModel, searchService, typeSearch } from "../../_services/search.service";

export default function ShowStreetPage() {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });

  function deleteItem(val) {
    fetchWrapper.delete(
      config.apiUrl + STREET + "/" + val.streetId,
      fetAllData
    );
  }

  async function fetAllData(pageNumber = 1) {
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + STREET,
      pageNumber,
      {
        filters: [
          {
            field: "streetName",
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
    // End Search area
    
  return (
    <div className="">
      <div className="flex items-center justify-between mb-2 bg-slate-200 pb-3">
        <div className="d-flex justify-end gap-2 w-full bg-white px-6 py-3">
          <Link to="create">
            <button className="bg-info text-white rounded-lg px-3 py-0.5">
              Tạo Đường sách
            </button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4 px-6">
        {data.list.map((val) => (
          <div
            key={val.streetId}
            className={`${listStyle["book-detail"]} position-relative`}
          >
            <Link to={"update/" + val.streetId}>
              <div
                className="h-40 bg-contain bg-no-repeat bg-center"
                style={{
                  backgroundImage: `url(${
                    val.urlImage ? val.urlImage : AVATARDEFAULT
                  })`,
                }}
              ></div>
            </Link>
            {/* <div
              onClick={(event: any) => {
                deleteItem(val);
              }}
              className={`${listStyle["trash-box"]} position-absolute top-0 right-0 bg-slate-400 rounded px-2 py-1 opacity-50 hover:!opacity-100`}
            >
              <Trash />
            </div> */}
            <Link to={"update/" + val.streetId}>
              <div className="mt-1 text-dark">
                <h6 className="mb-0 line-clamp-2">{val.streetName}</h6>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-2 p-2">
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
