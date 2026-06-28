# Cơ chế hoạt động của State trong Notes App

## Tổng quan

Toàn bộ state của app chỉ nằm ở một chỗ duy nhất: **`App.jsx`**.  
Các component con không tự quản lý state — chúng nhận dữ liệu qua **props** và báo lại sự kiện lên App qua **callback**.

---

## Các State trong App.jsx

| State | Kiểu | Giá trị ban đầu | Vai trò |
|---|---|---|---|
| `notes` | Array | đọc từ localStorage | Danh sách tất cả ghi chú |
| `activeId` | number \| null | `null` | ID của ghi chú đang được chọn |
| `searchQuery` | string | `''` | Từ khóa đang tìm kiếm |

---

## Luồng hoạt động theo từng hành động

---

### 1. Người dùng gõ vào ô tìm kiếm

```
[Người dùng gõ]
  → SearchBar (src/components/SearchBar.jsx)
      onChange={e => onChange(e.target.value)}
  → NoteList (src/components/NoteList.jsx)
      nhận prop setSearchQuery từ App, truyền xuống SearchBar
  → App.jsx
      setSearchQuery(value)         ← searchQuery thay đổi
      → App re-render
      → filteredNotes tính lại      ← lọc notes theo searchQuery mới
      → NoteList nhận filteredNotes mới → hiển thị danh sách đã lọc
```

---

### 2. Người dùng nhấn "+ Ghi chú mới"

```
[Người dùng nhấn nút]
  → App.jsx
      handleAddNote()
        → tạo object newNote với id = Date.now()
        → setNotes([newNote, ...notes])   ← notes thay đổi
        → setActiveId(newNote.id)         ← activeId thay đổi
      → App re-render (React gộp 2 thay đổi thành 1 lần render)
        → NoteList nhận filteredNotes mới → hiển thị ghi chú mới ở đầu
        → activeNote tính lại → là ghi chú vừa tạo (title và content rỗng)
        → NoteEditor nhận note mới → hiển thị editor trống để bắt đầu gõ
        → useEffect chạy → lưu notes mới xuống localStorage
```

---

### 3. Người dùng click chọn một ghi chú

```
[Người dùng click vào NoteCard]
  → NoteCard (src/components/NoteCard.jsx)
      onClick={() => onSelect(note.id)}
  → NoteList (src/components/NoteList.jsx)
      truyền onSelect={setActiveId} xuống NoteCard
  → App.jsx
      setActiveId(id)               ← activeId thay đổi
      → App re-render
        → activeNote tính lại → tìm ra ghi chú có id khớp
        → NoteEditor nhận note mới → hiển thị tiêu đề và nội dung ghi chú đó
        → NoteList nhận activeId mới → NoteCard đúng được highlight (màu indigo)
```

---

### 4. Người dùng gõ tiêu đề hoặc nội dung

```
[Người dùng gõ trong NoteEditor]
  → NoteEditor (src/components/NoteEditor.jsx)
      input onChange:    onUpdate(note.id, e.target.value, note.content)
      textarea onChange: onUpdate(note.id, note.title, e.target.value)
  → App.jsx
      handleUpdateNote(id, title, content)
        → setNotes(notes.map(...))    ← notes thay đổi (chỉ ghi chú có id khớp)
      → App re-render
        → activeNote tính lại → NoteEditor nhận nội dung vừa gõ
        → NoteList re-render → NoteCard hiển thị preview mới
        → useEffect chạy → lưu xuống localStorage
```

---

### 5. Người dùng xóa một ghi chú

```
[Người dùng hover vào NoteCard và nhấn nút X]
  → NoteCard (src/components/NoteCard.jsx)
      handleDelete(e)
        → e.stopPropagation()         ← ngăn sự kiện click lan lên div cha
        → window.confirm(...)         ← hỏi xác nhận
        → onDelete(note.id)
  → NoteList (src/components/NoteList.jsx)
      truyền onDelete={handleDeleteNote} xuống NoteCard
  → App.jsx
      handleDeleteNote(id)
        → setNotes(notes.filter(...)) ← notes thay đổi (bỏ ghi chú bị xóa)
        → setActiveId(null)           ← nếu đang mở ghi chú đó thì bỏ chọn
      → App re-render
        → NoteList ngắn hơn 1 item
        → activeNote = null → NoteEditor hiển thị màn hình "Chọn ghi chú hoặc tạo mới"
        → useEffect chạy → lưu xuống localStorage
```

---

## Sơ đồ luồng dữ liệu

```
                    App.jsx (nơi chứa toàn bộ state)
                   /              \
          NoteList.jsx         NoteEditor.jsx
         /          \
  SearchBar.jsx   NoteCard.jsx


  Dữ liệu đi XUỐNG qua props:
    App → NoteList:   notes, activeId, searchQuery, setSearchQuery, onDelete
    App → NoteEditor: note (activeNote), onUpdate
    NoteList → NoteCard:    note, isActive, onSelect, onDelete
    NoteList → SearchBar:   value, onChange

  Sự kiện đi LÊN qua callback:
    SearchBar → App:  onChange → setSearchQuery
    NoteCard  → App:  onSelect → setActiveId
    NoteCard  → App:  onDelete → handleDeleteNote
    NoteEditor→ App:  onUpdate → handleUpdateNote
```

---

## useEffect — Tự động lưu localStorage

```js
useEffect(() => {
  localStorage.setItem('notes', JSON.stringify(notes))
}, [notes])
```

- Chạy **sau mỗi lần** `notes` thay đổi (thêm / sửa / xóa ghi chú).
- Đảm bảo dữ liệu không mất khi tắt trình duyệt hoặc F5.
- Không chạy khi `activeId` hay `searchQuery` thay đổi vì chúng không nằm trong dependency array `[notes]`.
