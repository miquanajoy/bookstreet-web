import { useEffect, useState } from "react";
import { fetchWrapper } from "../../../../_helpers/fetch-wrapper";
import { KIOS, ROUTER, STORE } from "../../../../_helpers/const/const";
import config from "../../../../config";
import {
  SearchModel,
  searchService,
  typeSearch,
} from "../../../../_services/home/search.service";
import ListComponent from "../../../../Components/list.component";

export default function ListKios() {
  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });
  const headers = [
    { key: "storeName", name: "Tên " + ROUTER.kios.name.toLowerCase() },
    { key: "locationName", name: "Tên địa điểm" },
  ];

  function fetAllData(pageNumber = 1) {
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + KIOS,
      pageNumber,
      {
        filters: [
          {
            field: "storeName",
            value: searchService.$SearchValue.value?.dataSearch,
            operand: typeSearch,
          },
        ],
      }
    );
    result.then((res) => {
      const convertedData = res.list.map((val) => [
        { id: val.id },
        {
          storeName: val.kiosName,
        },
        {
          locationName: val.locationName,
        },
      ]);
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
    await fetchWrapper.delete(config.apiUrl + KIOS + "/" + id, fetAllData);
  }

  return (
    <>
      <ListComponent
        title={"Quản lý " + ROUTER.kios.name.toLowerCase()}
        buttonName={"Tạo " + ROUTER.kios.name.toLowerCase()}
        deleteItem={deleteItem}
        header={headers}
        data={data.list}
        totalPage={data.totalPage}
        handleChange={fetAllData}
      ></ListComponent>
    </>
  );
}
