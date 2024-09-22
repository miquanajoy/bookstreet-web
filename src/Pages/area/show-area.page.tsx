import { useEffect, useState } from "react";
import { alertService, onAlert } from "../../_services";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import ListComponent from "../../Components/list.component";
import { AREA } from "../../_helpers/const/const";
import {
  SearchModel,
  searchService,
  typeSearch,
} from "../../_services/home/search.service";

export default function ShowAreaPage() {
  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });
  const headers = [
    {
      key: "image",
      name: "urlImage",
    },
    { key: "areaName", name: "areaName" },
    { key: "streetName", name: "streetName" },
  ];

  async function fetAllData(pageNumber = 1) {
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + AREA,
      pageNumber,
      {
        filters: [
          {
            field: "areaName",
            value: searchService.$SearchValue.value?.dataSearch,
            operand: typeSearch,
          },
        ],
      }
    );
    result.then((res) => {
      const convertedData = res.list.map((val) => {
        let p = [];

        p.push({ id: val.areaId });
        p.push({ image: val.urlImage });
        for (const key in val) {
          if (!["streetId", "urlImage"].includes(key)) {
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
  }, []);

  function deleteItem(id) {
    fetchWrapper.delete(config.apiUrl + AREA + "/" + id, fetAllData);
  }
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
    <>
      <ListComponent
        title="Quản lý khu vực"
        buttonName="Tạo khu vực"
        deleteItem={deleteItem}
        header={headers}
        data={data.list}
        totalPage={data.totalPage}
        handleChange={fetAllData}
      ></ListComponent>
    </>
  );
}
