
const express = require("express");
const Book = require("../models/Book");

const router = express.Router();

// Danh sach cac truong bat buoc
const fields = [
  "bookId",
  "title",
  "author",
  "category",
  "publisher",
  "publishYear",
  "isbn",
  "quantity",
  "description"
];

// Kiem tra du lieu sach
function validateBook(data) {
  for (const field of fields) {
    if (
      data[field] === undefined ||
      data[field] === null ||
      data[field] === ""
    ) {
      return `Thieu truong: ${field}`;
    }
  }

  const textFields = fields.filter(
    (f) => !["publishYear", "quantity"].includes(f)
  );

  for (const field of textFields) {
    if (
      typeof data[field] !== "string" ||
      !data[field].trim()
    ) {
      return `Truong ${field} phai la chuoi khong rong`;
    }
  }

  if (
    !Number.isInteger(data.publishYear) ||
    data.publishYear < 0 ||
    data.publishYear > 2100
  ) {
    return "Nam xuat ban khong hop le";
  }

  if (
    !Number.isInteger(data.quantity) ||
    data.quantity < 0
  ) {
    return "So luong phai la so nguyen khong am";
  }

  return null;
}

// Xu ly loi API
function handleError(res, error) {
  if (error.code === 11000) {
    return res.status(409).json({
      message: "Ma sach bookId da ton tai"
    });
  }

  if (
    error.name === "ValidationError" ||
    error.name === "CastError"
  ) {
    return res.status(400).json({
      message: "Du lieu khong hop le"
    });
  }

  console.error(error);

  return res.status(500).json({
    message: "Loi may chu hoac ket noi co so du lieu"
  });
}

// 1. GET /api/books
// Lay danh sach va tim kiem sach
router.get("/", async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();

    // Escape ky tu dac biet trong regex
    const safe = search.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const filter = search
      ? {
          $or: [
            { title: { $regex: safe, $options: "i" } },
            { author: { $regex: safe, $options: "i" } },
            { category: { $regex: safe, $options: "i" } }
          ]
        }
      : {};

    const books = await Book.find(filter).sort({
      bookId: 1
    });

    return res.status(200).json(books);
  } catch (error) {
    return handleError(res, error);
  }
});

// 2. GET /api/books/:id
// Xem chi tiet sach theo bookId
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findOne({
      bookId: req.params.id
    });

    if (!book) {
      return res.status(404).json({
        message: "Khong tim thay sach"
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    return handleError(res, error);
  }
});

// 3. POST /api/books
// Them sach moi
router.post("/", async (req, res) => {
  try {
    const errorMessage = validateBook(req.body);

    if (errorMessage) {
      return res.status(400).json({
        message: errorMessage
      });
    }

    const book = await Book.create(req.body);

    return res.status(201).json({
      message: "Them sach thanh cong",
      book
    });
  } catch (error) {
    return handleError(res, error);
  }
});

// 4. PUT /api/books/:id
// Cap nhat thong tin sach
router.put("/:id", async (req, res) => {
  try {
    const current = await Book.findOne({
      bookId: req.params.id
    });

    if (!current) {
      return res.status(404).json({
        message: "Khong tim thay sach"
      });
    }

    const data = {};

    for (const field of fields) {
      data[field] =
        req.body[field] !== undefined
          ? req.body[field]
          : current[field];
    }

    const errorMessage = validateBook(data);

    if (errorMessage) {
      return res.status(400).json({
        message: errorMessage
      });
    }

    const book = await Book.findOneAndUpdate(
      { bookId: req.params.id },
      { $set: data },
      {
        new: true,
        runValidators: true
      }
    );

    return res.status(200).json({
      message: "Cap nhat sach thanh cong",
      book
    });
  } catch (error) {
    return handleError(res, error);
  }
});

// 5. DELETE /api/books/:id
// Xoa sach
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      bookId: req.params.id
    });

    if (!book) {
      return res.status(404).json({
        message: "Khong tim thay sach"
      });
    }

    return res.status(200).json({
      message: "Xoa sach thanh cong"
    });
  } catch (error) {
    return handleError(res, error);
  }
});

module.exports = router;
