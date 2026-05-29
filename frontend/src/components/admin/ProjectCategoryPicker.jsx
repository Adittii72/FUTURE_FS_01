import { PROJECT_CATEGORIES } from '../../constants/projectCategories.js';

const ProjectCategoryPicker = ({ value, onChange }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Category <span className="text-[#00d4ff]">*</span>
      </label>
      <div className="grid grid-cols-1 gap-2">
        {PROJECT_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const selected = value === cat.name;
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => onChange(cat.name)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg border-2 text-left transition-all ${
                selected
                  ? 'border-[#00d4ff] bg-[#00d4ff]/15 shadow-[0_0_12px_rgba(0,212,255,0.35)]'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 hover:border-[#00d4ff]/50'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.gradient} flex items-center justify-center shrink-0`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span
                className={`text-sm font-semibold ${
                  selected ? 'text-[#00d4ff]' : 'text-gray-800 dark:text-gray-100'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
      <input type="hidden" name="category" value={value} required />
    </div>
  );
};

export default ProjectCategoryPicker;
