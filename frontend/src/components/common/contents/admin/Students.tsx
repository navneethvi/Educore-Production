import * as React from "react";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudents,
  toggleBlockStudent,
} from "../../../../redux/admin/adminActions";
import { AppDispatch, RootState } from "../../../../store/store";
import {
  TableBody,
  CircularProgress,
  InputBase,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import SearchIcon from "@mui/icons-material/Search";
import _ from "lodash";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#808999",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Students: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    students: { data: studentsData, loading, error, totalPages },
    adminToken,
  } = useSelector((state: RootState) => state.admin);

  const [students, setStudents] = useState(studentsData || null);
  const [page, setPage] = useState(1);
  const [loadingPage, setLoadingPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const debouncedSearch = React.useCallback(
    _.debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 1000),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1);
    debouncedSearch(value);
  };

  useEffect(() => {
    if (!adminToken) return;
    dispatch(
      fetchStudents({
        token: adminToken,
        page,
        searchTerm: debouncedSearchTerm,
      })
    );
  }, [dispatch, adminToken, page, debouncedSearchTerm]);

  useEffect(() => {
    if (studentsData) {
      setStudents(studentsData);
    }
  }, [studentsData]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleBlockUnblock = (
    studentId: string,
    token: string,
    isBlocked: boolean
  ) => {
    
    Swal.fire({
      title: `Are you sure you want to ${
        isBlocked ? "unblock" : "block"
      } this student?`,
      showCancelButton: true,
      confirmButtonColor: isBlocked ? "#3085d6" : "#d33",
      cancelButtonColor: "#bbb",
      confirmButtonText: isBlocked ? "Yes, unblock them!" : "Yes, block them!",
    })
    
    .then((result) => {
      if (result.isConfirmed) {
        dispatch(toggleBlockStudent({ token, studentId }))
          .then(() => {
            setStudents((prevStudents) =>
              prevStudents.map((student) =>
                student._id === studentId
                  ? { ...student, is_blocked: !isBlocked }
                  : student
              )
            );

            Swal.fire(
              isBlocked ? "Unblocked!" : "Blocked!",
              `The student has been ${isBlocked ? "unblocked" : "blocked"}.`,
              "success"
            );
          })
          .catch((err) => {
            Swal.fire(
              "Error",
              "An error occurred while updating the student status.",
              "error"
            );
          });
      }
    });
  };

  return (
    <>
      <div className="heading mb-6">
        <h1 className="text-2xl font-semibold">Students</h1>
      </div>
      <div className="w-full px-4">
        {/* Search Bar */}
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
            maxWidth: 600,
            margin: "0 auto",
            marginBottom: 2,
            border: 1,
            borderRadius: 10,
            borderColor: "#808999",
          }}
        >
          <InputBase
            sx={{ ml: 2, flex: 1 }}
            placeholder="Search Students"
            inputProps={{ "aria-label": "search students" }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>

        {loading && (
          <div className="flex justify-center items-center h-[300px]">
            <CircularProgress />
          </div>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && students.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <TableContainer
                component={Paper}
                className="w-full"
                style={{ maxHeight: "500px", overflowY: "auto" }}
              >
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell align="center">Email</StyledTableCell>
                      <StyledTableCell align="center">Phone</StyledTableCell>
                      <StyledTableCell align="center">
                        Following
                      </StyledTableCell>
                      <StyledTableCell align="center">Activity</StyledTableCell>
                      <StyledTableCell align="center">Manage</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => (
                      <StyledTableRow key={student._id}>
                        <StyledTableCell component="th" scope="row">
                          {student.name}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {student.email}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {student.phone}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {student.following.length}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {student.activity || "Active"}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {student.is_blocked ? (
                            <button
                              className="bg-purple-600 text-white text-xs px-5 py-2 rounded-full"
                              onClick={() =>
                                handleBlockUnblock(
                                  student._id,
                                  adminToken as string,
                                  true
                                )
                              }
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              className="bg-red-600 text-white text-xs px-6 py-2 rounded-full"
                              onClick={() =>
                                handleBlockUnblock(
                                  student._id,
                                  adminToken as string,
                                  false
                                )
                              }
                            >
                              Block
                            </button>
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </motion.div>

            <div className="pagination flex justify-center mt-2">
              <Stack spacing={2} mt={2}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="secondary"
                />
              </Stack>
            </div>

            {loadingPage && (
              <motion.div
                className="flex justify-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ minHeight: "34px" }}
              ></motion.div>
            )}
          </>
        ) : (
          <Alert severity="info">No students available</Alert>
        )}
      </div>
    </>
  );
};

export default Students;
