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
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
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

  const [selectedRole, setSelectedRole] = useState("default"); // State để lưu vai trò được chọn

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
      key: "role",
      name: "Vai trò",
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
      key: "action",
      name: "",
    },
  ];

  async function fetAllData(pageNumber = 1) {
    const filter = {
      filters: [],
    };
    // Thêm bộ lọc fullName nếu có giá trị tìm kiếm
    if (searchService.$SearchValue.value?.dataSearch) {
      filter.filters.push({
        field: "fullName",
        value: searchService.$SearchValue.value.dataSearch,
        operand: typeSearch,
      });
    }
    // Thêm bộ lọc role
    if (selectedRole !== "default") {
      
      filter.filters.push({
        field: "role",
        value: selectedRole,
        operand: 0, // equal
      });
    }
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + AUTH,
      pageNumber,
      filter
    );
    result.then((res) => {
      if(selectedRole === "default") {
        setData({
          list: res.list.filter(v => ![Role.Admin, "CUSTOMER"].includes(v.role)),
          totalPage: res.totalPage,
        });
      } else {
        setData({
          list: res.list,
          totalPage: res.totalPage,
        });
      }
    });
  }

  // Gọi API khi khởi tạo
  useEffect(() => {
    fetAllData();
  }, []);

  // Gọi API khi tìm kiếm
  useEffect(() => {
    const searchSub = searchService.$SearchValue.subscribe({
      next: (v: SearchModel) => {
        if (v?.isClickSearch) {
          fetAllData(1);
        }
      },
    });
    return () => searchSub.unsubscribe();
  }, []);

  // Gọi API khi thay đổi vai trò
  useEffect(() => {
    fetAllData(1);
  }, [selectedRole]);

  // Xử lý khi chọn vai trò từ dropdown
  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-2 bg-slate-200 pb-3">
        <div className="d-flex justify-between gap-2 w-full bg-white px-6 py-3">
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="role-filter-label">Lọc theo vai trò</InputLabel>
            <Select
              labelId="role-filter-label"
              id="role-filter"
              value={selectedRole}
              label="Lọc theo vai trò"
              onChange={handleRoleChange}
            >
              <MenuItem value="default">Mặc định</MenuItem>
              <MenuItem value={Role.Admin}>Admin</MenuItem>
              <MenuItem value={Role.Manager}>Manager</MenuItem>
              <MenuItem value={Role.Store}>Store</MenuItem>
              <MenuItem value={Role.GiftStore}>Gift store</MenuItem>
              <MenuItem value="CUSTOMER">Customer</MenuItem>
            </Select>
          </FormControl>
          <Link to="create">
            <button className="bg-info text-white rounded-lg px-3 py-0.5">
              Tạo mới tài khoản
            </button>
          </Link>
        </div>
      </div>
      <div className="p-2">
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
              {data.list?.length ? (
                data.list.map((row) => (
                  <TableRow
                    key={row.username}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      <div
                        className="mx-auto w-20 h-20 bg-contain bg-no-repeat bg-center"
                        style={{
                          backgroundImage: `url('${
                            row.avatar ?? AVATARDEFAULT
                          }')`,
                        }}
                      ></div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.username}
                    </TableCell>
                    <TableCell align="left">{row.role}</TableCell>
                    <TableCell component="th" scope="row">
                      {row.fullName}
                    </TableCell>
                    <TableCell align="left">{row.email}</TableCell>
                    <TableCell align="left">{row.phone}</TableCell>
                    <TableCell align="left">{row.address}</TableCell>
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={headers.length} align="center">
                    Không có người dùng nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="mt-2 p-2">
          {data.totalPage ? (
            <div className="flex justify-center">
              <Pagination
                count={data.totalPage}
                onChange={(_, pageNumber) => fetAllData(pageNumber)}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}