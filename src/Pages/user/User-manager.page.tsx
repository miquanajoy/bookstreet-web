import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Trash } from "../../assets/icon/trash";
import ListComponent from "../../Components/list.component";
import { alertService } from "../../_services/alert.service";
import { Role } from "../../models/Role";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import { AUTH } from "../../_helpers/const/const";
import { SearchModel, searchService, typeSearch } from "../../_services/home/search.service";

export default function ShowUserPage() {
  const { pathname } = useLocation();

  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });

  const headers = [
    {
      key: "image",
      name: "Avatar",
    },
    {
      key: "username",
      name: "Tên Tài khoản",
    },
    {
      key: "fullName",
      name: "Tên đầy đủ",
    },
    {
      key: "email",
      name: "email",
    },
    {
      key: "phone",
      name: "Điện thoại",
    },
    {
      key: "address",
      name: "Địa chỉ",
    },
    {
      key: "role",
      name: "Vai trò",
    },
  ];

  async function fetAllData(pageNumber = 1) {
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + AUTH,
      pageNumber,
      {
        filters: [
          {
            field: "fullName",
            value: searchService.$SearchValue.value?.dataSearch,
            operand: typeSearch,
          },
        ],
      }
    );
    result.then((res) => {
      const convertedData = res.list.map((val) => {
        let p = [];
        p.push({ image: val.avatar });
        for (const key in val) {
          if (!["password", "avatar"].includes(key)) {
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
    await fetchWrapper.delete(config.apiUrl + AUTH + "/" + id, fetAllData);
  }

  return (
    <>
      <ListComponent
        title="Quản lý Tài khoản"
        buttonName="Tạo Tài khoản"
        header={headers}
        data={data.list}
        totalPage={data.totalPage}
        handleChange={fetAllData}
      ></ListComponent>
    </>
  );
}
