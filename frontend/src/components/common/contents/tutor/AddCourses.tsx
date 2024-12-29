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
import { AnimatePresence, motion } from "framer-motion";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Formik, Field, Form, FieldArray } from "formik";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/store";
import { tutorCreateCourse } from "../../../../redux/tutors/tutorActions";
import { useNavigate } from "react-router-dom";
import { resetActions } from "../../../../redux/tutors/tutorSlice";
import { courseValidationSchema } from "../../../../validations/courseValidation";
import { uploadFileToS3 } from "../../../../utils/s3";
import axios from "axios";
import { BASE_URL } from "../../../../utils/configs";
import Compressor from "compressorjs";
import { fetchAllCategories } from "../../../../redux/admin/adminActions";

const AddCourses: React.FC = () => {
  const [thumbnail, setThumbnail] = useState<string>("");
  const [croppedThumbnail, setCroppedThumbnail] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [loading2, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);


  const cropperRef = useRef<ReactCropperElement>(null);

  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();
  const { tutorToken, loading, success } = useSelector(
    (state: RootState) => state.tutor
  );

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

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      setCroppedThumbnail(croppedCanvas.toDataURL());
      setOpen(false);
    }
  };

  useEffect(() => {
    if (success) {
      Swal.fire({
        title: "Course Uploaded!",
        text: "Your course has been successfully uploaded.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/tutor/courses");
        dispatch(resetActions());
      });
    }
  }, [success, navigate, dispatch]);

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

  const dataURLtoBlob = (dataURL: string): Blob => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];

    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  };

  const blobToFile = (blob: Blob, fileName: string): File => {
    return new File([blob], fileName, {
      type: blob.type,
      lastModified: Date.now(),
    });
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("level", values.level);
      formData.append("price", values.price);

      for (const [index, lesson] of values.lessons.entries()) {
        formData.append(`lessons[${index}][title]`, lesson.title);
        formData.append(`lessons[${index}][goal]`, lesson.goal);

        if (lesson.video) {
          const videoFilename = await uploadLessonFile(lesson.video);
          formData.append(`lessons[${index}][video]`, videoFilename);
        }
        if (lesson.materials) {
          const materialsFilename = await uploadLessonFile(lesson.materials);

          formData.append(`lessons[${index}][materials]`, materialsFilename);
        }
        if (lesson.homework) {
          const homeworkFilename = await uploadLessonFile(lesson.homework);
          formData.append(`lessons[${index}][homework]`, homeworkFilename);
        }
      }

      console.log("values.thumbnail==========>", values.thumbnail);
      console.log("thumbnail==========>", thumbnail);

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

      if (croppedThumbnail) {
        const thumbnailBlob = dataURLtoBlob(croppedThumbnail);
        const thumbnailFile = blobToFile(thumbnailBlob, "thumbnail.png");
        const compressedThumbnail = await compressImage(thumbnailFile, 0.3);
        const thumbnailFilename = await uploadLessonFile(compressedThumbnail);
        formData.append("thumbnail", thumbnailFilename);
      }

      await dispatch(
        tutorCreateCourse({ token: tutorToken as string, courseData: formData })
      );
    } catch (error) {
      console.error("Error uploading course:", error);
    } finally {
      setLoading(false); // Set loading to false when upload completes
    }
  };

  return (
    <>
      <div className="heading">
        <h1 className="text-2xl font-semibold">Add Courses</h1>
      </div>

      {loading ||
        (loading2 && (
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
        ))}

      <Formik
        initialValues={{
          title: "",
          description: "",
          category: "",
          level: "",
          price: "",
          lessons: [
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
                        {croppedThumbnail && (
                          <Box
                            component="img"
                            src={croppedThumbnail}
                            alt="Cropped Thumbnail"
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
                          {values.lessons.map((_, index) => (
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
                                sx={{ position: "absolute", top: 21, right: 8 }}
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
                                      {(values.lessons[index].video &&
                                        (
                                          values.lessons[index]
                                            .video as unknown as File
                                        ).name) ||
                                        "Upload"}
                                      <input
                                        type="file"
                                        name={`lessons[${index}][video]`}
                                        hidden
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          setFieldValue(
                                            `lessons.${index}.video`,
                                            file
                                          );
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
                                      {(values.lessons[index].materials &&
                                        (
                                          values.lessons[index]
                                            .materials as unknown as File
                                        ).name) ||
                                        "Upload"}

                                      <input
                                        type="file"
                                        name={`lessons[${index}][materials]`}
                                        hidden
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          setFieldValue(
                                            `lessons.${index}.materials`,
                                            file
                                          );
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
                                      {(values.lessons[index].homework &&
                                        (
                                          values.lessons[index]
                                            .homework as unknown as File
                                        ).name) ||
                                        "Upload"}

                                      <input
                                        type="file"
                                        name={`lessons[${index}][homework]`}
                                        hidden
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          setFieldValue(
                                            `lessons.${index}.homework`,
                                            file
                                          );
                                        }}
                                      />
                                    </Button>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          ))}
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

export default AddCourses;
