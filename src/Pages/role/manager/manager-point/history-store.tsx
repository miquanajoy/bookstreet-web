import {
  Box,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ModelStyle } from "../../../../_helpers/const/model.const";
import dayjs from "dayjs";
export default function HistoryStore(props) {
  function HistoryStoreTable() {
    return (
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Tên cửa hàng</TableCell>
              <TableCell align="left">Số điểm</TableCell>
              <TableCell align="left">Ngày cộng điểm</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map((detail: any, index) => (
              <TableRow
                key={"n" + index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell>
                  <div>{detail?.storeName}</div>
                </TableCell>
                <TableCell>
                  <div>{detail?.point}</div>
                </TableCell>
                <TableCell>
                  <div>{dayjs(new Date(detail?.createdAt)).format("YYYY-MM-DD")}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  return <HistoryStoreTable />;
}
