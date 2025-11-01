export interface FormField {
  name: string;
  type: 'text' | 'time' | 'number' | 'select' | 'date' | 'textarea';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: string | number;
}

interface FormProps {
  fields: FormField[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  submitLabel?: string;
  isEditing?: boolean;
}

const Form = ({ 
  fields, 
  onSubmit, 
  onCancel, 
  submitLabel = 'Thêm mới',
  isEditing = false 
}: FormProps) => {
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  return (
    <div className="flex flex-col h-full min-h-[400px]">
      {/* Form Fields - Scrollable */}
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 space-y-4 overflow-y-auto pr-2 max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/([A-Z])/g, ' $1')}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  defaultValue={field.defaultValue as string}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  aria-label={field.placeholder}
                  required={field.required}
                >
                  <option value="" disabled>
                    {field.placeholder || 'Chọn một tùy chọn...'}
                  </option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  placeholder={field.placeholder || `Nhập ${field.name.toLowerCase()}...`}
                  defaultValue={field.defaultValue as string}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y min-h-[100px]"
                  required={field.required}
                  rows={3}
                />
              ) : (
                <input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder || `Nhập ${field.name.toLowerCase()}...`}
                  defaultValue={field.defaultValue}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required={field.required}
                />
              )}
            </div>
          ))}
        </div>

        {/* Fixed Buttons - Always Visible */}
        <div className="flex space-x-3 pt-4 mt-4 border-t border-gray-200 bg-white flex-shrink-0">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
          >
            {isEditing ? '💾 Cập nhật' : `✅ ${submitLabel}`}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium shadow-md"
          >
            ❌ Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;