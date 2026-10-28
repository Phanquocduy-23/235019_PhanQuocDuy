
require("dotenv").config();
const mongoose = require("mongoose");

async function testConnection() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("Chua cau hinh MONGO_URI trong .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const books = await mongoose.connection
      .collection("books")
      .find({})
      .toArray();

    console.log("Ket noi MongoDB Atlas thanh cong!");
    console.log("Database:", mongoose.connection.name);
    console.log("So luong sach:", books.length);

    books.forEach((book) => {
      console.log(book.bookId, "-", book.title);
    });
  } catch (error) {
    console.error("Ket noi that bai:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

testConnection();
