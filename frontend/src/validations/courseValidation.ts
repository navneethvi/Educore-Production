import * as Yup from "yup";

export const courseValidationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Category is required"),
  level: Yup.string().required("Level is required"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be positive"),
  lessons: Yup.array()
    .of(
      Yup.object({
        title: Yup.string().required("Lesson title is required"),
        goal: Yup.string().required("Lesson goal is required"),
        video: Yup.string(),
        materials: Yup.string(),
        homework: Yup.string(),
      })
    )
    .min(1, "At least one lesson is required"),
});
