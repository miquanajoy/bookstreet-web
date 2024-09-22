import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { alertService } from "../../_services/alert.service";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import {
  GENRE,
} from "../../_helpers/const/const";
import ListComponent from "../../Components/list.component";
import { SearchModel, searchService, typeSearch } from "../../_services/home/search.service";

export default function ShowGenrePage() {
  const navigate = useNavigate();

  const headers = [
    {
      key: "genreName",
      name: "Tên thể loại",
    },
    {
      key: "categoryName",
      name: "Tên danh mục",
    },
  ];

  const { pathname } = useLocation();

  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });

  function deleteItem(id) {
    fetchWrapper.delete(
      config.apiUrl + GENRE + "/" + id,
      fetAllData
    );

  }

  async function fetAllData(pageNumber = 1) {
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + GENRE,
      pageNumber,
      {
        filters: [
          {
            field: "genreName",
            value: searchService.$SearchValue.value?.dataSearch,
            operand: typeSearch,
          },
        ],
      }
    );
    result.then((res) => {
      const convertData = res.list.map(v => {
        return v
      })
      const convertedData = res.list.map((val) => {
        let p = [];
        p.push({ id: val.genreId });

        for (const key in val) {
          if (!["categoryId"].includes(key)) {
            p.push({ [key]: val[key] });
          }
        }
        return p;
      });
      setData({
        list: convertedData,
        totalPage: res.totalPage,
      });
    });
    return result
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
    <ListComponent
      title="Quản lý thể loại"
      buttonName="Tạo thể loại"
      deleteItem={deleteItem}
      header={headers}
      data={data.list}
      totalPage={data.totalPage}
      handleChange={fetAllData}
    ></ListComponent>
  );
}
