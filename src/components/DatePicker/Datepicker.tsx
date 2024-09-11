import { Dialog } from '@headlessui/react';
import React, { useState } from 'react';
import { DateRangePicker, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from 'date-fns';
import { FaCalendarAlt } from 'react-icons/fa';

interface CustomDatepickerProps {
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
}

export default function CustomDatepicker({ onDateRangeChange }: CustomDatepickerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDateChange = (ranges: RangeKeyDict) => {
    const { selection } = ranges;
    setDateRange({
      startDate: selection.startDate,
      endDate: selection.endDate,
    });
    onDateRangeChange(selection.startDate, selection.endDate);

  };


  const minDate = new Date();
  const maxDate = dateRange.startDate
    ? new Date(dateRange.startDate.getTime() + 30 * 24 * 60 * 60 * 1000)
    : undefined;
  const minDateForEndDate = dateRange.endDate
    ? new Date(dateRange.endDate.getTime() - 30 * 24 * 60 * 60 * 1000)
    : undefined;


  const handleRangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedRange(selectedValue);

    let startDate = new Date();
    let endDate = new Date();

    switch (selectedValue) {
      case "week":
        endDate.setDate(startDate.getDate() + 7);
        break;

      case "month":
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        break;

      case "prev-month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;

      case "next-month":
        endDate.setMonth(startDate.getMonth() + 1);
        break;

      case "1-week":
        endDate.setDate(startDate.getDate() + 7);
        break;

      default:
        return;
    }
    setDateRange({ startDate, endDate });
    onDateRangeChange(startDate, endDate);
    // setDateRange({ startDate, endDate });
    // onDateRangeChange(dateRange.startDate, dateRange.endDate);
  };

  const clearDates = () => setDateRange({ startDate: null, endDate: null });

  const formatDateRange = (start, end) => {
    if (!start || !end) return "Select Date Range";
    return `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`;
  };

  return (
    <div>

      <div className="flex w-full h-[31px] rounded-tl-md border border-gray-400 text-[#000000] text-xl font-semibold bg-[#EDF4FF]">
        <select
          value={selectedRange}
          onChange={handleRangeSelect}
          className="flex-1 px-4 border-r border-r-gray-500 bg-[#EDF4FF] rounded-tl-md"
        >
          <option className='bg-white text-lg font-semibold' value="" disabled>Select Range</option>
          <option className='bg-white' value="week">This Week</option>
          <option className='bg-white' value="prev-month">Previous Month</option>
          <option className='bg-white' value="month">This Month</option>
          <option className='bg-white' value="next-month">Next Month</option>
        </select>

        <button onClick={openModal} className="flex-1 flex items-center font-semibold justify-center px-4 bg-[#EDF4FF]">
          <FaCalendarAlt className="mr-2" />
          {formatDateRange(dateRange.startDate, dateRange.endDate)}
        </button>
      </div>

      {/* Date Picker Modal */}
      <Dialog
        open={isModalOpen}
        onClose={closeModal}
        className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Dialog.Title className="text-2xl mb-4">Select Date Range</Dialog.Title>
          <DateRangePicker
            ranges={[
              {
                startDate: dateRange.startDate || new Date(),
                endDate: dateRange.endDate || new Date(),
                key: "selection",
              },
            ]}
            onChange={handleDateChange}
            minDate={
              dateRange.endDate
                ? new Date(
                  dateRange.endDate.getTime() - 30 * 24 * 60 * 60 * 1000
                )
                : minDate
            }
            maxDate={
              dateRange.startDate
                ? new Date(
                  dateRange.startDate.getTime() + 30 * 24 * 60 * 60 * 1000
                )
                : undefined
            }
          />
          <div className="mt-4 flex justify-between">
            <button
              onClick={clearDates}
              className="bg-red-600 text-white px-4 py-2 rounded-full"
            >
              Clear Dates
            </button>
            <button
              onClick={closeModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-full"
            >
              Save
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}