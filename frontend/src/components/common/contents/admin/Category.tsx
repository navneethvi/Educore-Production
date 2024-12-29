import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Pagination,
} from "@mui/material";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../store/store";
import {
  fetchCategories,
  addCategory,
  deleteCategory,
} from "../../../../redux/admin/adminActions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

interface Category {
  _id: string;
  name: string;
  course?: string[];
}

interface CategoriesResponse {
  categories: Category[];
  totalPages: number;
  currentPage: number;
}

const Category: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { adminToken } = useSelector((state: RootState) => state.admin);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    if (adminToken) {
      dispatch(fetchCategories({ token: adminToken, page: currentPage }))
        .unwrap()
        .then((response: CategoriesResponse) => {
          // Extract data from the response
          const { categories, totalPages, currentPage } = response;
          setCategories(categories || []);
          setTotalPages(totalPages || 0);
          setCurrentPage(currentPage || 1);
        })
        .catch((error) => {
          setCategories([]);
          toast.error(`Error fetching categories: ${error}`);
        });
    }
  }, [dispatch, adminToken, currentPage]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

 const handleAddCategory = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (!newCategory.trim()) {
    toast.error("Please enter a category name!");
    return;
  }

  if (!adminToken) {
    toast.error("Admin token is missing!");
    return;
  }

  dispatch(addCategory({ token: adminToken, name: newCategory.trim() }))
    .unwrap()
    .then((addedCategory) => {
      // Prepend the newly added category to the state
      setCategories((prevCategories) => [
        addedCategory, // Add the new category at the top
        ...prevCategories,
      ]);
      
      toast.success("Category added successfully!");
      setNewCategory("");

      // Optionally, fetch the updated list to ensure accuracy
      dispatch(fetchCategories({ token: adminToken, page: currentPage }))
        .unwrap()
        .then((response: CategoriesResponse) => {
          setCategories(response.categories || []);
          setTotalPages(response.totalPages || 0);
        })
        .catch((error) => {
          toast.error(`Error fetching categories after addition: ${error}`);
        });
    })
    .catch((err) => {
      toast.error(`${err}`);
    });
};

  const handleDeleteCategory = (categoryId: string) => {
    if (!adminToken) {
      toast.error("Admin token is missing!");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteCategory({ token: adminToken, category_id: categoryId }))
          .unwrap()
          .then(() => {
            // Fetch categories again after deletion
            dispatch(fetchCategories({ token: adminToken, page: currentPage }))
              .unwrap()
              .then((response: CategoriesResponse) => {
                // Adjust the current page if necessary
                const isLastPageEmpty = currentPage > response.totalPages;
                setCurrentPage(isLastPageEmpty ? Math.max(response.totalPages, 1) : currentPage);
                setCategories(response.categories || []);
                setTotalPages(response.totalPages || 0);
                toast.success("Category deleted successfully!");
              })
              .catch((error) => {
                toast.error(`Error fetching categories after deletion: ${error}`);
              });
          })
          .catch((err) => {
            toast.error(`Error deleting category: ${err}`);
          });

        Swal.fire("Deleted!", "Your category has been deleted.", "success");
      }
    });
  };

  return (
    <Box>
      <div className="heading">
        <h1 className="text-2xl font-semibold">Category</h1>
      </div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        p={4}
        height="100%"
        marginTop="40px"
      >
        {/* Left Side - Category Table */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ flex: 2, marginRight: "20px" }}
        >
          <TableContainer
            component={Paper}
            sx={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: "#808999",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "16px",
                      textAlign: "left",
                      padding: "16px",
                    }}
                  >
                    Category Name
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#808999",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "16px",
                      textAlign: "center",
                      padding: "16px",
                    }}
                  >
                    Number of Courses
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#808999",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "16px",
                      textAlign: "center",
                      padding: "16px",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <motion.tr
                      key={category._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                    >
                      <TableCell sx={{ padding: "16px" }}>{category.name}</TableCell>
                      <TableCell align="center" sx={{ padding: "16px" }}>
                        {category.course ? category.course.length : 0}
                      </TableCell>
                      <TableCell align="center" sx={{ padding: "16px" }}>
                        <button
                          className="bg-purple-600 text-white text-xs px-5 py-2 rounded-full"
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          Delete
                        </button>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack spacing={2} mt={2} alignItems="center">
            <Pagination
              count={totalPages} // Use totalPages from the state
              page={currentPage} // Use currentPage from the state
              onChange={handlePageChange}
              color="secondary"
            />
          </Stack>
        </motion.div>
        {/* Right Side - Add Category Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ flex: 1 }}
        >
          <Box
            component="form"
            onSubmit={handleAddCategory}
            display="flex"
            flexDirection="column"
            alignItems="center"
            p={4}
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <TextField
              label="Category Name"
              variant="outlined"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              Add Category
            </Button>
          </Box>
        </motion.div>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default Category;
