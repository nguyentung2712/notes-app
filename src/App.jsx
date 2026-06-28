import { useState, useEffect } from 'react'
import NoteList from './components/NoteList'
import NoteEditor from './components/NoteEditor'
import './index.css'

// App là component gốc — chứa toàn bộ state và logic của ứng dụng
export default function App() {
  // Khởi tạo state notes bằng cách đọc từ localStorage
  // Nếu chưa có dữ liệu thì dùng mảng rỗng []
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('notes')
    return saved ? JSON.parse(saved) : []
  })

  // activeId lưu id của ghi chú đang được chọn, null = chưa chọn ghi chú nào
  const [activeId, setActiveId] = useState(null)

  // searchQuery lưu từ khóa người dùng đang tìm kiếm
  const [searchQuery, setSearchQuery] = useState('')

  // useEffect chạy mỗi khi notes thay đổi → tự động lưu xuống localStorage
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  // Tìm object ghi chú đang active từ danh sách
  const activeNote = notes.find(n => n.id === activeId) ?? null

  // Lọc danh sách ghi chú theo từ khóa tìm kiếm
  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  function handleAddNote() {
    const newNote = {
      id: Date.now(), // Dùng timestamp làm ID — đơn giản và luôn duy nhất
      title: '',
      content: '',
      updatedAt: new Date().toISOString(),
    }
    // Thêm ghi chú mới lên đầu danh sách
    setNotes([newNote, ...notes])
    // Tự động chọn ghi chú vừa tạo
    setActiveId(newNote.id)
  }

  function handleUpdateNote(id, title, content) {
    // map() duyệt qua tất cả ghi chú, chỉ cập nhật đúng ghi chú có id khớp
    setNotes(notes.map(n =>
      n.id === id ? { ...n, title, content, updatedAt: new Date().toISOString() } : n
    ))
  }

  function handleDeleteNote(id) {
    // filter() loại bỏ ghi chú có id khớp, giữ lại tất cả ghi chú còn lại
    setNotes(notes.filter(n => n.id !== id))
    // Nếu ghi chú đang mở bị xóa thì bỏ chọn
    if (activeId === id) setActiveId(null)
  }

  return (
    <div className="flex flex-col h-screen bg-white font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-gray-800">Notes App</h1>
          <span className="text-xs text-gray-400">{notes.length} ghi chú</span>
        </div>
        <button
          onClick={handleAddNote}
          className="px-3 py-1.5 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition"
        >
          + Ghi chú mới
        </button>
      </header>

      {/* Layout chính: sidebar bên trái, editor bên phải */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: danh sách ghi chú */}
        <div className="w-72 flex-shrink-0 overflow-hidden flex flex-col">
          <NoteList
            notes={filteredNotes}
            activeId={activeId}
            onSelect={setActiveId}
            onDelete={handleDeleteNote}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* Vùng soạn thảo */}
        <main className="flex-1 overflow-y-auto flex flex-col bg-white">
          <NoteEditor note={activeNote} onUpdate={handleUpdateNote} />
        </main>
      </div>
    </div>
  )
}
