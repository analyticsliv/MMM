import { Input } from "../ui/input"
export default function SearchBar() {
  return (
    <div className="relative w-80">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-800 left-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <Input type="text" placeholder="Search here" className="w-[290px] py-2.5 xl:py-4 pl-12 pr-4 bg-[#EBECF0] placeholder-gray-600" />
    </div>
  )
}