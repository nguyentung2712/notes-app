// SearchBar là component "presentational" — chỉ hiển thị UI, không tự quản lý state
// State thực sự (searchQuery) được lưu ở useNotes và truyền xuống qua props
export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative px-3 py-2">
      {/* Icon kính lúp định vị tuyệt đối bên trong ô input */}
      <svg
        className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
      {/* Controlled input: value từ props, onChange gọi lên component cha */}
      <input
        type="text"
        placeholder="Tìm kiếm ghi chú..."
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-100 rounded-lg border border-transparent focus:outline-none focus:border-indigo-400 focus:bg-white transition"
      />
    </div>
  )
}
