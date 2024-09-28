import { useEffect, useState } from "react";
import { alertService, onAlert } from "../../_services";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import ListComponent from "../../Components/list.component";
import { LOCATION } from "../../_helpers/const/const";
import {
  SearchModel,
  searchService,
  typeSearch,
} from "../../_services/search.service";

export default function ShowLocation() {
  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });
  const headers = [
    // {
    //   key: "image",
    //   name: "urlImage",
    // },
    {
      key: "locationName",
      name: "locationName",
    },
    {
      key: "areaName",
      name: "areaName",
    },
  ];

  function fetAllData(pageNumber = 1) {
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + LOCATION,
      pageNumber,
      {
        filters: [
          {
            field: "locationName",
            value: searchService.$SearchValue.value?.dataSearch,
            operand: typeSearch,
          },
        ],
      }
    );
    result.then((res) => {
      const convertedData = res.list.map((val) => {
        let p = [];
        p.push({ id: val.locationId });
        p.push({ image: val.urlImage });
        for (const key in val) {
          if (!["areaId", "locationId"].includes(key)) {
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
    return result;
  }

  useEffect(() => {
    fetAllData();
  }, []);

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

  async function deleteItem(id) {
    await fetchWrapper.delete(config.apiUrl + LOCATION + "/" + id, fetAllData);
  }

  return (
    <>
      <ListComponent
        title="Quản lý vị trí"
        buttonName="Tạo vị trí"
        deleteItem={deleteItem}
        header={headers}
        data={data.list}
        totalPage={data.totalPage}
        handleChange={fetAllData}
      ></ListComponent>
    </>
  );
}
