const zod = require("zod");

const name = zod
  .string({ message: "Name is require" })
  .min(3, "Name must be at least 3 characters")
  .max(20, "Name must be at most 20 characters");
const password = zod
  .string({
    required_error: "Password is required",
  })
  .min(8, "Password must be at least 8 characters")
  .max(20, "Password must be at most 20 characters");
const email = zod
  .string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  })
  .email("Invalid email format");
const role = zod.enum(["user", "admin"]).optional();

const registerSchema = zod.object({
  name,
  email,
  password,
  role,
});

const loginSchema = zod.object({
  email,
  password,
});

const updateSchema = zod.object({ name });

const userSchema = { registerSchema, loginSchema, updateSchema };

const title = zod
  .string({ message: "Title is require" })
  .min(5, "Title must be at least 5 characters")
  .max(50, "Title must be at most 50 characters");
const description = zod
  .string({ message: "Description is require" })
  .min(5, "Description must be at least 5 characters")
  .max(100, "Description must be at most 100 characters")
  .optional();
const dueDate = zod.date({ message: "" }).optional();
const priority = zod.enum(["Low", "Medium", "High"]).optional();
const status = zod.enum(["Pending", "In Progress", "Done"]).optional();

const createTaskSchema = zod.object({
  title,
  description,
  dueDate,
  priority,
  status,
});

const updateTaskSchema = zod.object({
  title: title.optional(),
  description: description.optional(),
  dueDate: dueDate.optional(),
  priority: priority.optional(),
  status: status.optional(),
});

const taskSchema = { createTaskSchema, updateTaskSchema };

const id = zod
  .string({
    required_error: "Id is required",
    invalid_type_error: "Id must be a string",
  })
  .min(24, "Id must be at least 24 characters")
  .max(24, "Id must be at most 24 characters");

const idSchema = (key = "id") => zod.object({ [key]: id });

const content = zod
  .string({ message: "Content is required" })
  .min(3, { message: "Content must be at least 3 characters" })
  .max(100, { message: "Content must be at most 100 characters" });
const createSchema = zod.object({
  content,
});

const contentSchema = zod.object({
  content,
});
const commentSchema = { createSchema, contentSchema };

const createProject = zod.object({
  name: zod
    .string({ message: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
  description: zod
    .string({ message: "Description is require" })
    .min(5, "Description must be at least 5 characters")
    .max(100, "Description must be at most 100 characters")
    .optional(),
});

const updateProject = zod.object({
  name: zod
    .string({ message: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
  description: zod
    .string({ message: "Description is require" })
    .min(5, "Description must be at least 5 characters")
    .max(100, "Description must be at most 100 characters")
    .optional(),
});

const projectSchema = { createProject, updateProject };

const schema = {
  userSchema,
  taskSchema,
  idSchema,
  commentSchema,
  projectSchema,
};

module.exports = schema;
