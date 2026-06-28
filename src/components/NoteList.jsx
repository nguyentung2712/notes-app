import NoteCard from './NoteCard'
import SearchBar from './SearchBar'

// NoteList nhận props từ App và chia nhỏ xuống các component con
export default function NoteList({ notes, activeId, onSelect, onDelete, searchQuery, setSearchQuery }) {
  return (
    <aside className="flex flex-col h-full border-r border-gray-200 bg-white">
      {/* Truyền value và onChange xuống SearchBar — pattern "controlled component" */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <div className="flex-1 overflow-y-auto py-1">
        {/* Render có điều kiện: nếu không có ghi chú thì hiển thị thông báo */}
        {notes.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-8 px-4">
            {searchQuery ? 'Không tìm thấy ghi chú nào.' : 'Chưa có ghi chú nào.'}
          </p>
        ) : (
          // Dùng .map() để render danh sách — mỗi item cần prop `key` duy nhất để React tối ưu
          notes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              isActive={note.id === activeId} // So sánh để biết card nào đang được chọn
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </aside>
  )
}
