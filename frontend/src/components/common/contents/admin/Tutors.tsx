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
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTutors,
  toggleBlockTutor,
} from "../../../../redux/admin/adminActions";
import { AppDispatch, RootState } from "../../../../store/store";
import {
  TableBody,
  CircularProgress,
  Box,
  InputBase,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import SearchIcon from "@mui/icons-material/Search";

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

const Tutors: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    tutors: { data: tutorsData, loading, error, totalPages },
    adminToken,
  } = useSelector((state: RootState) => state.admin);

  const [tutors, setTutors] = useState(tutorsData || []);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const debouncedSearch = React.useCallback(
    _.debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 1000),
    []
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    debouncedSearch(event.target.value);
  };

  useEffect(() => {
    if (adminToken) {
      dispatch(
        fetchTutors({
          token: adminToken,
          page,
          searchTerm: debouncedSearchTerm,
        })
      );
    }
  }, [dispatch, adminToken, page, debouncedSearchTerm]);

  useEffect(() => {
    setTutors(tutorsData);
  }, [tutorsData]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleBlockUnblock = (
    tutorId: string,
    token: string,
    isBlocked: boolean
  ) => {
    Swal.fire({
      title: `Are you sure you want to ${
        isBlocked ? "unblock" : "block"
      } this tutor?`,
      showCancelButton: true,
      confirmButtonColor: isBlocked ? "#3085d6" : "#d33",
      cancelButtonColor: "#bbb",
      confirmButtonText: isBlocked ? "Yes, unblock them!" : "Yes, block them!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(toggleBlockTutor({ token, tutorId }))
          .then(() => {
            setTutors((prevTutors) =>
              prevTutors.map((tutor) =>
                tutor._id === tutorId
                  ? { ...tutor, is_blocked: !isBlocked }
                  : tutor
              )
            );
  
            Swal.fire(
              isBlocked ? "Unblocked!" : "Blocked!",
              `The tutor has been ${isBlocked ? "unblocked" : "blocked"}.`,
              "success"
            );
          })
          .catch((error) => {
            console.error("Failed to toggle block/unblock:", error);
            Swal.fire(
              "Error",
              "There was an issue updating the tutor's status. Please try again later.",
              "error"
            );
          });
      }
    });
  };
  

  return (
    <>
      <div className="heading mb-6">
        <h1 className="text-2xl font-semibold">Tutors</h1>
      </div>
      <div className="w-full px-4">
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
            placeholder="Search Tutors"
            inputProps={{ "aria-label": "search tutors" }}
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
        {!loading && !error && tutors.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <TableContainer component={Paper} className="w-full">
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell align="center">Email</StyledTableCell>
                      <StyledTableCell align="center">Phone</StyledTableCell>
                      <StyledTableCell align="center">
                        Followers
                      </StyledTableCell>
                      <StyledTableCell align="center">Status</StyledTableCell>
                      <StyledTableCell align="center">Manage</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tutors.map((tutor) => (
                      <StyledTableRow key={tutor._id}>
                        <StyledTableCell>{tutor.name}</StyledTableCell>
                        <StyledTableCell align="center">
                          {tutor.email}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {tutor.phone}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {tutor.followers.length}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {tutor.is_verified ? (
                            <span className="inline-flex items-center bg-green-500 text-white text-xs px-5 py-1.5 rounded-full">
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center bg-gray-500 text-white text-xs px-2 py-1.5 rounded-full">
                              Not Verified
                            </span>
                          )}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {tutor.is_blocked ? (
                            <button
                              className="bg-purple-600 text-white text-xs px-5 py-2 rounded-full"
                              onClick={(e) => {
                                e.preventDefault();
                                handleBlockUnblock(
                                  tutor._id,
                                  adminToken as string,
                                  true
                                );
                              }}
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              className="bg-red-600 text-white text-xs px-6 py-2 rounded-full"
                              onClick={(e) => {
                                e.preventDefault();
                                handleBlockUnblock(
                                  tutor._id,
                                  adminToken as string,
                                  false
                                );
                              }}
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

            <div className="pagination flex justify-center mt-10">
              <Stack spacing={2} mt={2}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="secondary"
                />
              </Stack>
            </div>
          </>
        ) : (
          <Alert severity="info">No tutors available</Alert>
        )}
      </div>
    </>
  );
};

export default Tutors;
