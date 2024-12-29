import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Modal,
  Backdrop,
  Fade,
  IconButton,
} from "@mui/material";
import { Upload, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Formik, Field, Form, FieldArray } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { fetchAllCategories } from "../../../../redux/admin/adminActions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/store";
import { useNavigate, useParams } from "react-router-dom";
import {
  tutorEditCourse,
  tutorFetchCourseDetails,
} from "../../../../redux/tutors/tutorActions"; // Import the thunk action
import { courseValidationSchema } from "../../../../validations/courseValidation";
import { BASE_URL } from "../../../../utils/configs";
import { uploadFileToS3 } from "../../../../utils/s3";
import axios from "axios";
import Compressor from "compressorjs";

interface LessonType {
  title: string;
  goal: string;
  video: string;
  materials: string;
  homework: string;
}

const EditCourse: React.FC = () => {
  const [thumbnail, setThumbnail] = useState<string>("");
  const [croppedThumbnail, setCroppedThumbnail] = useState<string>("");
  const [courseDetails, setCourseDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loading2, setLoading2] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { courseId } = useParams();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const cropperRef = useRef<ReactCropperElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { tutorToken } = useSelector((state: RootState) => state.tutor);

  console.log("courseDetails =====>", courseDetails);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (courseId) {
        setLoading(true);
        try {
          const response = await dispatch(
            tutorFetchCourseDetails({ token: tutorToken as string, courseId })
          ).unwrap();
          setCourseDetails(response);
        } catch (error: any) {
          setError(error.message || "Failed to fetch course details");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCourseDetails();
  }, [courseId, dispatch]);

  function generateUniqueFilename(originalFilename: any): string {
    const timestamp = new Date().toISOString();

    const filename =
      typeof originalFilename === "string"
        ? originalFilename
        : originalFilename.name;

    const sanitizedFilename = filename.replace(/\s+/g, "-");
    return `${timestamp}-${sanitizedFilename}`;
  }

  const uploadLessonFile = async (file: File): Promise<string> => {
    try {
      console.log("invoked", file);

      const uniqueFilename = generateUniqueFilename(file);

      console.log("Requesting upload URL for:", uniqueFilename, file.type);
      console.log("File details:", file);
      const contentType = file.type || "application/octet-stream";

      console.log("Requesting upload URL for:", uniqueFilename, contentType);

      const { data } = await axios.get(`${BASE_URL}/course/get-upload-url`, {
        params: { key: uniqueFilename, contentType: contentType },
      });

      const presignedUrl = data.url;

      await uploadFileToS3(presignedUrl, file);

      return uniqueFilename;
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await dispatch(fetchAllCategories()).unwrap();
        setCategories(response);
      } catch (err: any) {
        console.error("Error fetching categories:", err.message);
      }
    };

    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    if (courseDetails) {
      setThumbnail(courseDetails.thumbnail || "");
      setCroppedThumbnail(courseDetails.thumbnail || "");
    }
  }, [courseDetails]);

  useEffect(() => {
    const fetchThumbnailFromFilename = async () => {
      if (courseDetails?.thumbnail) {
        const url = await fetchThumbnailUrl(courseDetails.thumbnail);
        if (url) {
          setThumbnail(url);
          setCroppedThumbnail(url);
        }
      }
    };

    if (courseDetails) {
      fetchThumbnailFromFilename();
    }
  }, [courseDetails]);

  useEffect(() => {
    if (courseDetails && courseDetails.updated) {
      Swal.fire({
        title: "Course Updated!",
        text: "Your course has been successfully updated.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/tutor/courses");
      });
    }
  }, [courseDetails, navigate]);

  const handleThumbnailUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnail(reader.result as string);
        setOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      setCroppedThumbnail(croppedCanvas.toDataURL());
      setOpen(false);
    }
  };

  const truncateTitle = (title: string, maxLength: number) => {
    if (!title) return "";
    if (title.length > maxLength) {
      return title.slice(0, maxLength) + "...";
    }
    return title;
  };

  function dataURLtoBlob(dataUrl: string) {
    const parts = dataUrl.split(",");
    if (parts.length !== 2) {
      throw new Error("Invalid Data URL");
    }

    const mimeMatch = parts[0].match(/:(.*?);/);
    if (!mimeMatch || mimeMatch.length < 2) {
      throw new Error("Invalid MIME type in Data URL");
    }

    const mimeType = mimeMatch[1]; // Get MIME type safely
    const byteString = atob(parts[1]); // Only the Base64 part

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeType });
  }

  const blobToFile = (blob: Blob, fileName: string): File => {
    return new File([blob], fileName, {
      type: blob.type,
      lastModified: Date.now(),
    });
  };

  const fetchThumbnailUrl = async (filename: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/course/get-presigned-url?filename=${filename}`
      );
      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error("Error fetching thumbnail URL:", error);
      return null;
    }
  };
  const handleSubmit = async (values: any) => {
    setLoading2(true);
    console.log("Form values:", values);
    console.log("Course details:", courseDetails);
    const formData = new FormData();

    formData.append("title", values.title.trim());
    formData.append("description", values.description.trim());
    formData.append("category", values.category);
    formData.append("level", values.level);
    formData.append("price", values.price.toString());

    for (const [index, lesson] of values.lessons.entries()) {
      formData.append(`lessons[${index}][title]`, lesson.title);
      formData.append(`lessons[${index}][goal]`, lesson.goal);

      if (lesson.video instanceof File) {
        const videoFilename = await uploadLessonFile(lesson.video);
        formData.append(`lessons[${index}][video]`, videoFilename);
      } else {
        formData.append(`lessons[${index}][video]`, lesson.video);
      }

      if (lesson.materials instanceof File) {
        const materialsFilename = await uploadLessonFile(lesson.materials);
        formData.append(`lessons[${index}][materials]`, materialsFilename);
      } else {
        formData.append(`lessons[${index}][materials]`, lesson.materials);
      }

      if (lesson.homework instanceof File) {
        const homeworkFilename = await uploadLessonFile(lesson.homework);
        formData.append(`lessons[${index}][homework]`, homeworkFilename);
      } else {
        formData.append(`lessons[${index}][homework]`, lesson.homework);
      }
    }

    const compressImage = (file: File, quality = 0.3): Promise<File> => {
      return new Promise((resolve, reject) => {
        new Compressor(file, {
          quality, // Lower quality for higher compression
          convertSize: 500000, // Convert files larger than 500KB to JPEG
          success: (compressedFile) => {
            console.log("Compression successful:");
            console.log("Original size:", file.size);
            console.log("Compressed size:", compressedFile.size);
            resolve(compressedFile as File);
          },
          error: (err) => {
            console.error("Compression failed:", err);
            reject(err);
          },
        });
      });
    };
    
    if (croppedThumbnail && croppedThumbnail.startsWith("data:image/")) {
      let thumbnailFile: File | null = null;
    
      try {
        const thumbnailBlob = dataURLtoBlob(croppedThumbnail);
        thumbnailFile = blobToFile(thumbnailBlob, "thumbnail.png");
    
        // Compress the thumbnail file
        const compressedThumbnailFile = await compressImage(thumbnailFile);
    
        // Upload the compressed file
        const thumbnailFilename = await uploadLessonFile(compressedThumbnailFile);
        formData.append("thumbnail", thumbnailFilename);
      } catch (error) {
        console.error("Error during compression or upload:", error);
    
        if (thumbnailFile) {
          // Fallback: Upload the original thumbnail file
          const thumbnailFilename = await uploadLessonFile(thumbnailFile);
          formData.append("thumbnail", thumbnailFilename);
        } else {
          console.error("Thumbnail file not created, skipping upload.");
        }
      }
    } else {
      formData.append("thumbnail", courseDetails.thumbnail);
    }
    
    

    try {
      // Dispatch the update course action
      await dispatch(
        tutorEditCourse({
          token: tutorToken as string,
          courseId: courseId as string,
          courseData: formData,
        })
      );
      setLoading2(false);

      Swal.fire({
        title: "Success!",
        text: "Your course has been successfully updated.",
        icon: "success",
        confirmButtonText: "OK",
      });

      navigate("/tutor/courses");
    } catch (error) {
      console.error("Failed to update course:", error);

      // Show error message if something goes wrong
      Swal.fire({
        title: "Error!",
        text: "There was an error updating your course. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        {/* Bouncing Circles */}
        <motion.div
          style={{
            display: "flex",
            gap: "10px", // Smaller gap between the balls
          }}
        >
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={index}
              style={{
                width: "12px", // Smaller ball size
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "grey", // Grey color for the balls
              }}
              animate={{
                y: [0, -10, 0], // Smaller bounce height
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 0.2 * index,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    );
  }

  if (loading2) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1.2 }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            repeatType: "reverse",
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#fff",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)",
          }}
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            style={{
              width: "50px",
              height: "50px",
              border: "5px solid #1976d2",
              borderTop: "5px solid transparent",
              borderRadius: "50%",
              marginBottom: "20px",
            }}
          ></motion.div>
          <h2 style={{ margin: 0 }}>Updating Course...</h2>
          <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
            Please wait while we updating your course.
          </p>
        </motion.div>
      </motion.div>
    );
  }

  if (!courseDetails) {
    return <Typography variant="h6">Course not found</Typography>;
  }
  return (
    <>
      <div className="heading">
        <h1 className="text-2xl font-semibold">Edit Courses</h1>
      </div>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1.2 }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              repeatType: "reverse",
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "15px",
              boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)",
            }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              style={{
                width: "50px",
                height: "50px",
                border: "5px solid #1976d2",
                borderTop: "5px solid transparent",
                borderRadius: "50%",
                marginBottom: "20px",
              }}
            ></motion.div>
            <h2 style={{ margin: 0 }}>Uploading Course...</h2>
            <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
              Please wait while we upload your course.
            </p>
          </motion.div>
        </motion.div>
      )}

      <Formik
        initialValues={{
          title: courseDetails.title || "",
          description: courseDetails.description || "",
          category: courseDetails.category,
          level: courseDetails.level,
          price: courseDetails.price || "",
          lessons: courseDetails.lessons || [
            { title: "", goal: "", video: "", materials: "", homework: "" },
          ],
        }}
        validationSchema={courseValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <Box>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Box component="form" noValidate autoComplete="off">
                    <Field
                      name="title"
                      as={TextField}
                      label="Title"
                      type="text"
                      fullWidth
                      sx={{ mb: 3, mt: 2 }}
                      variant="outlined"
                    />
                    <Field
                      name="description"
                      as={TextField}
                      label="Description"
                      variant="outlined"
                      multiline
                      rows={4}
                      fullWidth
                      sx={{ mb: 3 }}
                    />
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Category</InputLabel>
                      <Field name="category" as={Select} label="Category">
                        {categories.map((category) => (
                          <MenuItem key={category._id} value={category.name}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Field>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Level</InputLabel>
                      <Field name="level" as={Select} label="Level">
                        <MenuItem value="beginner">Beginner</MenuItem>
                        <MenuItem value="intermediate">Intermediate</MenuItem>
                        <MenuItem value="advanced">Advanced</MenuItem>
                      </Field>
                    </FormControl>
                    <Field
                      name="price"
                      as={TextField}
                      label="Price"
                      variant="outlined"
                      type="number"
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <Box
                      sx={{
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="subtitle1">
                        Upload Thumbnail
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <Button
                          variant="contained"
                          color="secondary"
                          component="label"
                          startIcon={<Upload />}
                          sx={{ mr: 2 }}
                        >
                          Upload Thumbnail
                          <input
                            type="file"
                            name="thumbnail"
                            hidden
                            accept="image/*"
                            onChange={handleThumbnailUpload}
                          />
                        </Button>
                        {(croppedThumbnail || thumbnail) && (
                          <Box
                            component="img"
                            src={croppedThumbnail || thumbnail}
                            alt="Thumbnail"
                            sx={{
                              width: 70,
                              height: 40,
                              borderRadius: "3px",
                              border: "2px solid #9c27b0",
                              objectFit: "cover",
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" justifyContent="center" mt={4}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: "#000",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#333" },
                      }}
                    >
                      Publish Course
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldArray
                    name="lessons"
                    render={(arrayHelpers) => (
                      <>
                        <motion.div
                          style={{
                            maxHeight: "calc(100vh - 200px)",
                            overflowY: "auto",
                          }}
                          drag="y"
                          dragConstraints={{ top: -300, bottom: 0 }}
                        >
                          {values.lessons.map(
                            (lesson: LessonType, index: number) => (
                              <Card
                                key={index}
                                sx={{
                                  maxWidth: 400,
                                  margin: "auto",
                                  padding: 1,
                                  mb: 2,
                                  backgroundColor: "#e4e4e7",
                                  position: "relative",
                                }}
                              >
                                <IconButton
                                  sx={{
                                    position: "absolute",
                                    top: 21,
                                    right: 8,
                                  }}
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  <Delete />
                                </IconButton>
                                <CardContent>
                                  <Typography variant="h6" gutterBottom>
                                    Lesson {index + 1}
                                  </Typography>
                                  <Box
                                    component="form"
                                    noValidate
                                    autoComplete="off"
                                    sx={{
                                      "& .MuiTextField-root": { mb: 2 },
                                    }}
                                  >
                                    <Field
                                      name={`lessons.${index}.title`}
                                      as={TextField}
                                      label="Title"
                                      variant="outlined"
                                      fullWidth
                                      size="small"
                                    />
                                    <Field
                                      name={`lessons.${index}.goal`}
                                      as={TextField}
                                      label="Goal"
                                      variant="outlined"
                                      fullWidth
                                      size="small"
                                    />
                                    <Box
                                      sx={{
                                        mb: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <Typography variant="subtitle1">
                                        Video
                                      </Typography>
                                      <Button
                                        variant="contained"
                                        color="secondary"
                                        component="label"
                                        startIcon={<Upload />}
                                      >
                                        {truncateTitle(
                                          values.lessons[index].video.name ||
                                            "Upload",
                                          20
                                        )}
                                        <input
                                          type="file"
                                          name={`lessons[${index}][video]`}
                                          hidden
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              setFieldValue(
                                                `lessons.${index}.video`,
                                                file
                                              );
                                            }
                                          }}
                                        />
                                      </Button>
                                    </Box>
                                    <Box
                                      sx={{
                                        mb: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <Typography variant="subtitle1">
                                        Materials
                                      </Typography>
                                      <Button
                                        variant="contained"
                                        color="secondary"
                                        component="label"
                                        startIcon={<Upload />}
                                      >
                                        {truncateTitle(
                                          values.lessons[index].materials
                                            .name || "Upload",
                                          20
                                        )}
                                        <input
                                          type="file"
                                          name={`lessons[${index}][materials]`}
                                          hidden
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              setFieldValue(
                                                `lessons.${index}.materials`,
                                                file
                                              );
                                            }
                                          }}
                                        />
                                      </Button>
                                    </Box>
                                    <Box
                                      sx={{
                                        mb: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <Typography variant="subtitle1">
                                        Homework
                                      </Typography>
                                      <Button
                                        variant="contained"
                                        color="secondary"
                                        component="label"
                                        startIcon={<Upload />}
                                      >
                                        {truncateTitle(
                                          values.lessons[index].homework.name ||
                                            "Upload",
                                          20
                                        )}
                                        <input
                                          type="file"
                                          name={`lessons[${index}][homework]`}
                                          hidden
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              setFieldValue(
                                                `lessons.${index}.homework`,
                                                file
                                              );
                                            }
                                          }}
                                        />
                                      </Button>
                                    </Box>
                                  </Box>
                                </CardContent>
                              </Card>
                            )
                          )}
                        </motion.div>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            position: "relative",
                            bottom: "-20px",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() =>
                              arrayHelpers.push({
                                title: "",
                                goal: "",
                                video: "",
                                materials: "",
                                homework: "",
                              })
                            }
                          >
                            Add Lesson
                          </Button>
                        </Box>
                      </>
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </Form>
        )}
      </Formik>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: 500,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Cropper
              src={thumbnail}
              style={{ height: 400, width: "100%" }}
              aspectRatio={16 / 9}
              guides={false}
              ref={cropperRef}
            />
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleCrop}
                sx={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#0d47a1" },
                }}
              >
                Crop & Save
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default EditCourse;
