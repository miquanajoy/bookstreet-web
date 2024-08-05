import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Trash } from "../../assets/icon/trash";
import listStyle from "../../styles/listStyle.module.scss";
import { alertService } from "../../_services/alert.service";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import Pagination from "@mui/material/Pagination";
import { PAGINATOR } from "../../_helpers/const/paginator.const";
import { PRODUCT, ROUTER } from "../../_helpers/const/const";

export default function ShowBook() {
  const { pathname } = useLocation();

  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });
  function deleteItem(val) {
    const result = fetchWrapper.delete(
      config.apiUrl + "Product/" + val.productId
    );
    result.then((val) => {
      fetAllData();
      alertService.alert({
        content: "Remove success",
      });
    });
  }

  async function fetAllData(pageNumber = 1) {
    const filter = {
      filters: [
        {
          field: "productTypeId",
          value: pathname == ROUTER.book.url ? "1" : "2",
          operand: 0,
        },
      ],
    };
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + PRODUCT,
      pageNumber,
      filter
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
        <h1 className="title">
          {(pathname == ROUTER.book.url
            ? ROUTER.book.name
            : ROUTER.souvenir.name) + " management"}
        </h1>
        <Link to="create">
          <button className="bg-black text-white rounded-lg px-3 py-0.5">
            Create new
            {" " +
              (pathname == ROUTER.book.url
                ? ROUTER.book.name
                : ROUTER.souvenir.name)}
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {data.list.map((val) => (
          <div
            key={val.productId}
            className={`${listStyle["book-detail"]} position-relative`}
          >
            <Link to={"update/" + val.productId}>
              <div
                className="h-60 bg-contain bg-no-repeat bg-center"
                style={{ backgroundImage: `url(${val.urlImage})` }}
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
            <Link to={"update/" + val.productId}>
              <div className="mt-1 text-dark">
                <h6 className="mb-0 line-clamp-2">{val.productName}</h6>
                <div className="box-author">
                  {val.book?.authors ? (
                    val.book.authors.map((author) => (
                      <small key={author}>{author}</small>
                    ))
                  ) : (
                    <></>
                  )}
                </div>
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
