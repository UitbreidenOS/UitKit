'use client'

interface SearchInputProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder = 'Search...' }: SearchInputProps) {
  return (
    <div className="relative mb-6">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border-2 border-black px-4 py-3 font-bold text-base bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:font-normal placeholder:text-gray-400"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 font-black text-gray-400 hover:text-black text-xl leading-none"
        >
          ×
        </button>
      )}
    </div>
  )
}
