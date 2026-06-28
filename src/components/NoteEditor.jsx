// NoteEditor nhận vào ghi chú đang active và hàm để cập nhật nó qua props
export default function NoteEditor({ note, onUpdate }) {
  // Render có điều kiện: nếu chưa chọn ghi chú nào thì hiển thị màn hình trống
  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <p className="text-sm">Chọn ghi chú hoặc tạo mới</p>
      </div>
    );
  }

  // Định dạng ngày giờ theo tiếng Việt
  const date = new Date(note.updatedAt).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="px-6 pt-5 pb-2 border-b border-gray-100">
        {/* Controlled input: value lấy từ props, onChange gọi onUpdate lên App */}
        <input
          type="text"
          placeholder="Tiêu đề..."
          value={note.title}
          onChange={(e) => onUpdate(note.id, e.target.value, note.content)}
          className="w-full text-2xl font-bold text-gray-800 placeholder-gray-300 focus:outline-none bg-transparent"
        />
        <p className="text-xs text-gray-400 mt-1">Cập nhật lần cuối: {date}</p>
      </div>

      {/* Controlled textarea tương tự như input ở trên */}
      <textarea
        placeholder="Bắt đầu viết..."
        value={note.content}
        onChange={(e) => onUpdate(note.id, note.title, e.target.value)}
        className="flex-1 w-full px-6 py-4 text-sm text-gray-700 placeholder-gray-300 focus:outline-none resize-none bg-transparent leading-relaxed"
      />
    </div>
  );
}
