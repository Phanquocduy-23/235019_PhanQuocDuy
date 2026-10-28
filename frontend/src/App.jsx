
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const emptyBook = {
  bookId: "",
  title: "",
  author: "",
  category: "",
  publisher: "",
  publishYear: new Date().getFullYear(),
  isbn: "",
  quantity: 0,
  description: ""
};

const fields = [
  ["bookId", "Mã sách"],
  ["title", "Tên sách"],
  ["author", "Tác giả"],
  ["category", "Thể loại"],
  ["publisher", "Nhà xuất bản"],
  ["publishYear", "Năm xuất bản"],
  ["isbn", "Mã ISBN"],
  ["quantity", "Số lượng"],
  ["description", "Mô tả"]
];

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });
  } catch {
    throw new Error(
      "Không kết nối được Backend. Hãy kiểm tra server hoặc VITE_API_URL."
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || `Yêu cầu thất bại (HTTP ${response.status})`
    );
  }

  return data;
}

export default function App() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ ...emptyBook });
  const [mode, setMode] = useState("");
  const [selected, setSelected] = useState(null);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadBooks() {
      setLoading(true);
      setError("");

      try {
        const query = search.trim()
          ? `?search=${encodeURIComponent(search.trim())}`
          : "";

        const data = await request(`/api/books${query}`);

        if (active) setBooks(data);
      } catch (err) {
        if (active) {
          setError(err.message);
          setBooks([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    const timer = setTimeout(loadBooks, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, revision]);

  function refresh() {
    setRevision((old) => old + 1);
  }

  function openAdd() {
    setForm({ ...emptyBook });
    setMode("add");
    setError("");
    setMessage("");
  }

  function openEdit(book) {
    setForm({
      bookId: book.bookId,
      title: book.title,
      author: book.author,
      category: book.category,
      publisher: book.publisher,
      publishYear: book.publishYear,
      isbn: book.isbn,
      quantity: book.quantity,
      description: book.description
    });
    setMode("edit");
    setError("");
    setMessage("");
  }

  async function showDetail(book) {
    setError("");

    try {
      const data = await request(
        `/api/books/${encodeURIComponent(book.bookId)}`
      );

      setSelected(data);
      setMode("detail");
    } catch (err) {
      setError(err.message);
    }
  }

  function changeField(event) {
    const { name, value } = event.target;

    setForm((old) => ({
      ...old,
      [name]: ["publishYear", "quantity"].includes(name)
        ? value === "" ? "" : Number(value)
        : value
    }));
  }

  async function saveBook(event) {
    event.preventDefault();
    if (saving) return;

    if (
      !Number.isInteger(form.publishYear) ||
      form.publishYear < 0 ||
      form.publishYear > 2100 ||
      !Number.isInteger(form.quantity) ||
      form.quantity < 0
    ) {
      setError("Năm xuất bản hoặc số lượng không hợp lệ.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const editing = mode === "edit";
      const path = editing
        ? `/api/books/${encodeURIComponent(form.bookId)}`
        : "/api/books";

      const data = await request(path, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(form)
      });

      setMode("");
      setMessage(
        data.message ||
          (editing ? "Cập nhật thành công!" : "Thêm sách thành công!")
      );
      refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteBook(book) {
    if (!window.confirm(`Bạn có chắc muốn xóa sách "${book.title}"?`)) {
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const data = await request(
        `/api/books/${encodeURIComponent(book.bookId)}`,
        { method: "DELETE" }
      );

      setMessage(data.message || "Xóa sách thành công!");
      refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const totalQuantity = books.reduce(
    (sum, book) => sum + book.quantity,
    0
  );

  const categories = new Set(
    books.map((book) => book.category)
  ).size;

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">ĐIỆN TOÁN ĐÁM MÂY</p>
          <h1>📚 Hệ thống quản lý sách</h1>
          <p className="subtitle">
            Sinh viên: Phan Quốc Duy | MSSV: 235019
          </p>
        </div>
        <span className="server-label">React + MongoDB Atlas</span>
      </header>

      <main className="container">
        <section className="stats">
          <div className="stat">
            <span>Đầu sách đang hiển thị</span>
            <strong>{books.length}</strong>
          </div>
          <div className="stat">
            <span>Số lượng đang hiển thị</span>
            <strong>{totalQuantity}</strong>
          </div>
          <div className="stat">
            <span>Thể loại đang hiển thị</span>
            <strong>{categories}</strong>
          </div>
        </section>

        <section className="panel">
          <div className="toolbar">
            <div>
              <h2>Danh sách sách</h2>
              <p>Quản lý thông tin sách trên đám mây</p>
            </div>
            <button className="primary" onClick={openAdd}>
              + Thêm sách
            </button>
          </div>

          <div className="searchbar">
            <input
              type="search"
              placeholder="Tìm tên sách, tác giả hoặc thể loại..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="secondary" onClick={refresh}>
              Làm mới
            </button>
          </div>

          {message && (
            <div className="notice success" role="status">
              ✅ {message}
            </div>
          )}

          {error && (
            <div className="notice failure" role="alert">
              ❌ {error}
            </div>
          )}

          {loading ? (
            <div className="empty">Đang tải dữ liệu sách...</div>
          ) : books.length === 0 ? (
            <div className="empty">
              Không tìm thấy sách phù hợp.
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Mã sách</th>
                    <th>Tên sách</th>
                    <th>Tác giả</th>
                    <th>Thể loại</th>
                    <th>Năm XB</th>
                    <th>Số lượng</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book._id || book.bookId}>
                      <td><b>{book.bookId}</b></td>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.category}</td>
                      <td>{book.publishYear}</td>
                      <td>{book.quantity}</td>
                      <td>
                        <div className="actions">
                          <button
                            className="view"
                            onClick={() => showDetail(book)}
                          >
                            Xem
                          </button>
                          <button
                            className="edit"
                            onClick={() => openEdit(book)}
                          >
                            Sửa
                          </button>
                          <button
                            className="delete"
                            onClick={() => deleteBook(book)}
                            disabled={saving}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer>
          Hệ thống quản lý sách | 235019_PhanQuocDuy
        </footer>
      </main>

      {(mode === "add" || mode === "edit") && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                {mode === "add" ? "Thêm sách mới" : "Cập nhật sách"}
              </h2>
              <button onClick={() => setMode("")}>✕</button>
            </div>

            <form onSubmit={saveBook}>
              <div className="form-grid">
                {fields.map(([name, label]) => (
                  <label
                    key={name}
                    className={name === "description" ? "full" : ""}
                  >
                    {label}
                    {name === "description" ? (
                      <textarea
                        name={name}
                        value={form[name]}
                        onChange={changeField}
                        rows={3}
                        required
                      />
                    ) : (
                      <input
                        name={name}
                        value={form[name]}
                        onChange={changeField}
                        type={
                          ["publishYear", "quantity"].includes(name)
                            ? "number"
                            : "text"
                        }
                        min={
                          ["publishYear", "quantity"].includes(name)
                            ? "0"
                            : undefined
                        }
                        max={name === "publishYear" ? "2100" : undefined}
                        step={
                          ["publishYear", "quantity"].includes(name)
                            ? "1"
                            : undefined
                        }
                        disabled={mode === "edit" && name === "bookId"}
                        required
                      />
                    )}
                  </label>
                ))}
              </div>

              {error && (
                <div className="notice failure" role="alert">
                  {error}
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setMode("")}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="primary"
                  disabled={saving}
                >
                  {saving ? "Đang lưu..." : "Lưu thông tin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mode === "detail" && selected && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Chi tiết sách</h2>
              <button onClick={() => setMode("")}>✕</button>
            </div>

            <div className="details">
              {fields.map(([name, label]) => (
                <div className="detail-row" key={name}>
                  <b>{label}</b>
                  <span>{selected[name]}</span>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button
                className="primary"
                onClick={() => setMode("")}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
