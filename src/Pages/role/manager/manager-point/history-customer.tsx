import {
  Box,
  Modal,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import { Role } from "../../../../models/Role";
import {
  HISTORY_BROWSE_SCORE,
  REJECT_BROWSE_SCORE,
} from "../../store/browse-scores/list-browse-scores";
export default function HistoryCustomer(props) {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  function HistoryStoreTable() {
    return (
      <div>
        <TableContainer>
          <Table stickyHeader aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Mã hoá đơn</TableCell>
                <TableCell align="center">Tên khách hàng</TableCell>
                <TableCell align="center">Số điện thoại</TableCell>
                <TableCell align="center">Tổng tiền đơn hàng</TableCell>
                <TableCell align="center">Số điểm</TableCell>
                {/* <TableCell align="center">Số dư</TableCell>
              <TableCell align="center">Ghi chú</TableCell> */}
                <TableCell align="center">Ngày</TableCell>
                {user.user.role === Role.Store &&
                props.isRejectBrowseScore == REJECT_BROWSE_SCORE ? (
                  <TableCell align="center">Trạng thái</TableCell>
                ) : (
                  <></>
                )}
                {user.user.role === Role.Store &&
                props.isRejectBrowseScore == HISTORY_BROWSE_SCORE ? (
                  <TableCell align="center">Hành động</TableCell>
                ) : (
                  <></>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data?.map((data, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell align="center">{data.invoiceCode}</TableCell>
                  <TableCell align="center">{data.customerName}</TableCell>
                  <TableCell align="center">{data.customerPhone}</TableCell>
                  <TableCell align="center">{data.amount}</TableCell>

                  <TableCell align="center">{data.pointAmount}</TableCell>
                  {/* <TableCell align="center">{data.currentPoint}</TableCell>
                <TableCell align="center"> {data.note}</TableCell> */}
                  <TableCell align="center">
                    {dayjs(data.createdAt).format("YYYY-MM-DD")}
                  </TableCell>
                  {user.user.role === Role.Store &&
                  props.isRejectBrowseScore == REJECT_BROWSE_SCORE ? (
                    <TableCell align="center">
                      <div className="d-flex gap-2 justify-center">
                        {data.status == REJECT_BROWSE_SCORE ? (
                          <button className="text-danger">Từ chối</button>
                        ) : (
                          <button className="text-success">Đã duyệt</button>
                        )}
                      </div>
                    </TableCell>
                  ) : (
                    <></>
                  )}
                  {user.user.role === Role.Store &&
                  props.isRejectBrowseScore == HISTORY_BROWSE_SCORE ? (
                    <TableCell align="center">
                      <div className="d-flex gap-2 justify-center">
                        <button
                          className="btn btn btn-success"
                          onClick={() => {
                            props.browseScore(data, HISTORY_BROWSE_SCORE);
                          }}
                        >
                          Duyệt
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            props.getPointHistory(data, REJECT_BROWSE_SCORE);
                          }}
                        >
                          Từ chối
                        </button>
                      </div>
                    </TableCell>
                  ) : (
                    <></>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* <div className="flex justify-center">
          <span>
            <Pagination
              count={vc}
              onChange={(_, pageNumber) => props.fetAllData(pageNumber)}
            />
          </span>
        </div> */}
      </div>
    );
  }
  return <HistoryStoreTable />;
}
