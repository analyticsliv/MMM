import { ChevronDown } from "lucide-react";

export const renderCheckboxDropdown = (
    label: string,
    field: 'mediaSpend' | 'media' | 'control',
    options: string[],
    toggleDropdown,
    selectedOptions,
    openDropdown,
    handleMultiSelect,
    handleSelectAll
) => (
    <div className="relative">
        <label className="text-lg font-medium text-gray-700 mb-2">{label}</label>
        <button
            type="button"
            onClick={() => toggleDropdown(field)}
            className="border border-gray-400 w-full rounded-lg px-4 py-3 text-left text-lg flex justify-between items-center"
        >
            <span>{selectedOptions[field]?.length > 0 ? `${selectedOptions[field]?.length} selected` : 'Select...'}</span>
            <ChevronDown className="w-5 h-5 text-gray-500" />
        </button>
        {openDropdown === field && (
            <div className="absolute z-10 mt-1 bg-white border border-gray-400 rounded-lg shadow-lg max-h-80 overflow-y-auto w-full p-5 space-y-3">
                <div className="text-sm text-blue-600 cursor-pointer" onClick={() => handleSelectAll(field, options)}>
                    {selectedOptions[field]?.length === options?.length ? 'Clear All' : 'Select All'}
                </div>
                {options?.map((opt, idx) => (
                    <label key={idx} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectedOptions[field]?.includes(opt)}
                            onChange={() => handleMultiSelect(field, opt)}
                            className="accent-blue-600"
                        />
                        <span>{opt}</span>
                    </label>
                ))}
            </div>
        )}
    </div>
);