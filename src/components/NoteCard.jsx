// NoteCard hiển thị thông tin tóm tắt của một ghi chú trong danh sách
export default function NoteCard({ note, isActive, onSelect, onDelete }) {
  // Tạo đoạn preview ngắn: bỏ xuống dòng, cắt còn 80 ký tự
  const preview = note.content.replace(/\n/g, " ").slice(0, 80);

  // Định dạng ngày theo kiểu Việt Nam: dd/mm/yyyy
  const date = new Date(note.updatedAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  function handleDelete(e) {
    // stopPropagation ngăn sự kiện click lan lên div cha (tránh vừa xóa vừa chọn ghi chú)
    e.stopPropagation();
    if (window.confirm("Xóa ghi chú này?")) onDelete(note.id);
  }

  return (
    <div
      onClick={() => onSelect(note.id)}
      // Template literal để ghép class động dựa vào isActive
      className={`group relative p-3 mx-2 mb-1 rounded-lg cursor-pointer transition
        ${isActive ? "bg-indigo-50 border border-indigo-200" : "hover:bg-gray-50 border border-transparent"}`}
    >
      <div className="flex justify-between items-start gap-2">
        {/* Hiển thị tiêu đề, fallback nếu chưa có */}
        <p className="text-sm font-semibold text-gray-800 truncate">
          {note.title || "Ghi chú chưa có tiêu đề"}
        </p>
        {/* Nút xóa chỉ hiện khi hover (group-hover) */}
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-0.5 rounded text-gray-400 hover:text-red-500 transition"
          title="Xóa"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="flex gap-2 mt-0.5 text-xs text-gray-400">
        <span>{date}</span>
        {/* Chỉ hiện preview nếu có nội dung — render có điều kiện với && */}
        {preview && <span className="truncate">{preview}</span>}
      </div>
    </div>
  );
}
