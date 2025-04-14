import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Trash } from "../../assets/icon/trash";
import { alertService } from "../../_services/alert.service";
import { Role } from "../../models/Role";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import { AUTH, AVATARDEFAULT } from "../../_helpers/const/const";
import {
  SearchModel,
  searchService,
  typeSearch,
} from "../../_services/search.service";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { EditIcon } from "../../assets/icon/edit";

export default function ShowUserPage() {
  const navigate = useNavigate();

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
    {
      key: "action",
      name: "",
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
      console.log("res.list :>> ", res.list);
      setData({
        list: res.list,
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
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {headers.map((row) => (
                <TableCell align="left" key={row.key}>
                  {row.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.list.map((row) => (
              <TableRow
                key={row.username}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <div
                    className="mx-auto w-20 h-20 bg-contain bg-no-repeat bg-center"
                    style={{
                      backgroundImage: `url('${row.avatar ?? AVATARDEFAULT}')`,
                    }}
                  ></div>
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.username}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.fullName}
                </TableCell>
                <TableCell align="left">{row.email}</TableCell>
                <TableCell align="left">{row.phone}</TableCell>
                <TableCell align="left">{row.address}</TableCell>
                <TableCell align="left">{row.role}</TableCell>
                <TableCell>
                  {row.role !== Role.Admin ? (
                    <button
                      className="fw-bold"
                      onClick={() => {
                        navigate("update/" + row.id, { replace: true });
                      }}
                    >
                      <EditIcon />
                    </button>
                  ) : (
                    <></>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
