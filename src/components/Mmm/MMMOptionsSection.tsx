'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMMMStore } from '@/store/useMMMStore';
import { ChevronDown } from 'lucide-react';
import { renderCheckboxDropdown } from '@/utils/checkboxProvider';
import { controlStatic } from '@/utils/const';
import { updateStoreField } from '@/utils/updateStoreField';
import { runMMMModal } from '@/utils/runModal';
import EdaGraph from './EdaGraph';
import useUserSession from '../hooks/useUserSession';
import { generateUniqueId } from '@/utils/helper';

interface MMMOptionsSectionProps {
  handleBack: () => void;
}

const MMMOptionsSection: React.FC<MMMOptionsSectionProps> = ({ handleBack }) => {
  const { selectedCampaigns, roiMean, roiSigma, setRoiMean, setRoiSigma, selectedCountry, ga4Linked,
    selectedTime, setSelectedTime,
    selectedKpi, setSelectedKpi,
    selectedMediaSpend, setSelectedMediaSpend,
    selectedMedia, setSelectedMedia,
    selectedControl, setSelectedControl,
    uniqueId, hasSubmitted, setHasSubmitted,
    isSubmittingModal, setIsSubmittingModal, selectedCustomer, kpi, ga4uniqueId, mmmJobId
  } = useMMMStore();

  type SelectableFields = 'mediaSpend' | 'media' | 'control';

  type SelectedOptions = Record<SelectableFields, string[]>;

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    mediaSpend: selectedMediaSpend ?? [],
    media: selectedMedia ?? [],
    control: selectedControl ?? [],
  });

  const [openDropdown, setOpenDropdown] = useState<null | string>(null);
  const [html, setHtml] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [showBanner, setShowBanner] = useState(false);


  // const [isSubmittingModal, setIsSubmittingModal] = useState(false);
  // const [hasSubmitted, setHasSubmitted] = useState(false);
  const { user, setUser } = useUserSession();

  const toggleDropdown = (field: string) => {
    setOpenDropdown(openDropdown === field ? null : field);
  };

  const handleMultiSelect = (field: SelectableFields, option: string) => {
    setSelectedOptions((prev) => {
      const current = prev[field];
      const isSelected = current.includes(option);
      const updated = isSelected
        ? current.filter((item) => item !== option)
        : [...current, option];

      updateStoreField(field, updated, setSelectedMediaSpend, setSelectedMedia, setSelectedControl);
      return {
        ...prev,
        [field]: updated,
      };
    });
  };

  const handleSelectAll = (field: SelectableFields, options: string[]) => {
    const updated = selectedOptions[field].length === options.length ? [] : options;

    // Update Zustand store
    updateStoreField(field, updated, setSelectedMediaSpend, setSelectedMedia, setSelectedControl);

    setSelectedOptions((prev) => ({
      ...prev,
      [field]: updated,
    }));
  };

  const metricOptions = selectedCampaigns?.flatMap((camp) => [
    `${camp}_Spend`,
    `${camp}_Impressions`,
    `${camp}_Clicks`,
    `${camp}_Engagement_Rate`,
  ]);

  const controlDynamic = metricOptions?.filter((m) =>
    m?.endsWith('_Engagement_Rate')
  );
  const controlOptions = [...controlStatic, ...controlDynamic];

  const mediaSpendOptions = metricOptions?.filter((m) => m?.endsWith('_Spend'));

  // Derive base campaign names from selected mediaSpend (_Spend removed)
  const mediaSpendBases = selectedOptions?.mediaSpend?.map((m) =>
    m?.replace(/_Spend$/, '')
  );

  // Filter media options based on selected mediaSpend
  const mediaOptions = metricOptions?.filter((metric) => {
    const isMediaMetric = metric?.endsWith('_Clicks') || metric?.endsWith('_Impressions');
    const baseName = metric?.replace(/_(Clicks|Impressions)$/, '');
    return isMediaMetric && mediaSpendBases?.includes(baseName);
  });

  const handleSubmit = async () => {
    if (isSubmittingModal) return;

    if (selectedMediaSpend.length < 2) {
      alert('Please select at least 2 Media Spend options.');
      return;
    }
    if (selectedMedia.length < 2) {
      alert('Please select at least 2 Media options.');
      return;
    }
    if (selectedControl.length < 1) {
      alert("Please select at least 1 Control option.");
      return;
    }

    const MmmModalData = {
      country: selectedCountry,
      ga4_linked: ga4Linked,
      date: selectedTime,
      // kpi: selectedKpi,
      kpi: kpi,
      kpi_type: kpi == "Clicks" ? 'non_revenue' : 'revenue',
      media_spend: selectedMediaSpend,
      media: selectedMedia,
      controls: selectedControl,
      mean: roiMean,
      sigma: roiSigma,
      unique_ada_id: uniqueId,
      email: user?.email,
      jobId: mmmJobId,
      connector_type: 'googleAds',
      unique_ga4_id: ga4uniqueId,
      selected_campaigns: selectedCampaigns
    };

    setShowBanner(true);
    setProgress(0);
    setIsSubmittingModal(true);
    setHasSubmitted(true);
    document.getElementById('eda-graph-section')?.scrollIntoView({ behavior: 'smooth' });

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.floor(Math.random() * 10 + 5); // +5–14
      });
    }, 1000);

    try {
      // setIsSubmittingModal(true);
      // setHasSubmitted(true);
      // document.getElementById('eda-graph-section')?.scrollIntoView({ behavior: 'smooth' });
      const result = await runMMMModal(MmmModalData);
      setHtml(result);
      setProgress(100);

      // alert('MMM Modal Run Success!');

    } catch (err) {
      alert('Failed to run modal');
    } finally {
      clearInterval(progressInterval);

      setIsSubmittingModal(false);
      setShowBanner(false);

    }
  };

  return (
    <div className="max-h-[90dvh] overflow-y-auto">
      {showBanner && (
        <div className="fixed top-7 left-[40%] animate-pulse duration-[1500ms] mx-auto w-[520px] z-[9999] bg-blue-600 text-white text-center px-2 py-3 shadow-md rounded-lg">
          <p className="text-lg font-medium">
            Running the MMM model... This may take 5–7 minutes. Please do not
            close or refresh the page.
          </p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:max-w-7xl mx-auto shadow-lg rounded-xl p-10 bg-white"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            MMM Configuration Options
          </h2>
          <button
            onClick={handleBack}
            disabled={isSubmittingModal}
            className={`text-blue-600 hover:underline font-medium ${isSubmittingModal ? "cursor-not-allowed" : "cursor-pointer"
              }`}
          >
            ← Back to Campaigns
          </button>
        </div>

        <div className="space-y-6 mt-10">
          {/* Static Time & KPI */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col w-[47%]">
              <label className="text-lg font-medium text-gray-700 mb-1">
                Time
              </label>
              <select
                disabled
                value="Date"
                className="border border-gray-300 rounded-lg px-4 py-3 text-lg bg-gray-100 cursor-not-allowed"
              >
                <option value="Date">Date</option>
              </select>
            </div>

            <div className="flex flex-col w-[47%]">
              <label className="text-lg font-medium text-gray-700 mb-1">
                KPI
              </label>
              <select
                disabled
                value={kpi}
                className="border border-gray-300 rounded-lg px-4 py-3 text-lg bg-gray-100 cursor-not-allowed"
              >
                <option value={kpi}>{kpi}</option>
              </select>
            </div>
          </div>

          {/* Dropdowns with checkbox */}
          {renderCheckboxDropdown(
            "Media Spend",
            "mediaSpend",
            mediaSpendOptions,
            toggleDropdown,
            selectedOptions,
            openDropdown,
            handleMultiSelect,
            handleSelectAll
          )}

          {/* Media Dropdown */}
          <div className="relative">
            <label className="text-lg font-medium text-gray-700 mb-2">
              Media
            </label>

            <button
              type="button"
              onClick={() => toggleDropdown("media")}
              disabled={selectedOptions?.mediaSpend.length < 2}
              className={`border w-full rounded-lg px-4 py-3 text-left text-lg flex justify-between items-center 
      ${selectedOptions?.mediaSpend?.length < 2
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-400"
                  : "border-gray-400"
                }
    `}
            >
              <span>
                {selectedOptions?.media?.length > 0
                  ? `${selectedOptions?.media?.length} selected`
                  : "Select..."}
              </span>
              <ChevronDown className="w-5 h-5 text-gray-500" />
            </button>

            {openDropdown === "media" &&
              selectedOptions?.mediaSpend?.length >= 2 && (
                <div className="absolute z-10 mt-1 bg-white border border-gray-400 rounded-lg shadow-lg max-h-80 overflow-y-auto w-full p-5 space-y-3">
                  <div
                    className="text-sm text-blue-600 cursor-pointer"
                    onClick={() => handleSelectAll("media", mediaOptions)}
                  >
                    {selectedOptions?.media?.length === mediaOptions?.length
                      ? "Clear All"
                      : "Select All"}
                  </div>
                  {mediaOptions?.map((opt, idx) => (
                    <label key={idx} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedOptions?.media?.includes(opt)}
                        onChange={() => handleMultiSelect("media", opt)}
                        className="accent-blue-600"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

            {selectedOptions?.mediaSpend?.length < 2 && (
              <span className="text-sm text-[#797f8c] mt-2 pl-1">
                Please select at least 2 Media Spend options to enable Media
                selection.
              </span>
            )}
          </div>

          {renderCheckboxDropdown(
            "Control",
            "control",
            controlOptions,
            toggleDropdown,
            selectedOptions,
            openDropdown,
            handleMultiSelect,
            handleSelectAll
          )}

          <div className="pt-2 flex items-center w-full gap-10">
            {/* ROI Mean */}
            <div className="w-[47%] flex flex-col">
              <label className="text-lg font-medium text-gray-700 mb-2">
                ROI Mean:{" "}
                <span className="text-blue-600 font-semibold">
                  {roiMean.toFixed(2)}
                </span>
              </label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={roiMean}
                onChange={(e) => setRoiMean(parseFloat(e.target.value))}
                className="w-full h-3 bg-blue-200 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-[#737883] mt-1 px-[2px]">
                {[0.0, 0.2, 0.4, 0.6, 0.8, 1.0]?.map((val) => (
                  <span
                    key={val}
                    className="w-[6px] text-center"
                    style={{ transform: "translateX(-50%)" }}
                  >
                    {val?.toFixed(2)}
                  </span>
                ))}
              </div>
            </div>

            {/* ROI Sigma */}
            <div className="w-[47%] flex flex-col max-md:mt-6">
              <label className="text-lg font-medium text-gray-700 mb-2">
                ROI Sigma:{" "}
                <span className="text-blue-600 font-semibold">
                  {roiSigma.toFixed(2)}
                </span>
              </label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={roiSigma}
                onChange={(e) => setRoiSigma(parseFloat(e.target.value))}
                className="w-full h-3 bg-blue-200 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-[#737883] mt-1 px-[2px]">
                {[0.0, 0.2, 0.4, 0.6, 0.8, 1.0]?.map((val) => (
                  <span
                    key={val}
                    className="w-[6px] text-center"
                    style={{ transform: "translateX(-50%)" }}
                  >
                    {val?.toFixed(2)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isSubmittingModal ? (
          <div className="w-full mt-10 animate-pulse">
            <div className="w-full bg-gray-200 rounded-full h-5">
              <div
                className="bg-blue-600 h-5 rounded-full transition-all duration-500 text-white text-sm text-center"
                style={{ width: `${progress}%` }}
              >
                {progress < 100 ? `${progress}%` : "Finalizing..."}
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg mt-10"
          >
            Submit & Run Modal
          </button>
        )}
      </motion.div>

      {html && (
        <iframe
          srcDoc={html}
          title="MMM Report"
          className="w-full h-[1000px] my-16 border rounded-lg shadow"
          sandbox="allow-scripts allow-same-origin"
        />
      )}

      {!html && hasSubmitted && <EdaGraph />}
    </div>
  );
};

export default MMMOptionsSection;




    // const MmmModalData = {
    //   country: selectedCountry,
    //   ga4_linked: ga4Linked,
    //   date: selectedTime,
    //   kpi: selectedKpi,
    //   media_spend: selectedMediaSpend,
    //   media: selectedMedia,
    //   controls: selectedControl,
    //   mean: roiMean,
    //   sigma: roiSigma,
    //   // unique_ada_id: uniqueId,
    //   unique_ada_id: 'qb',
    //   email: user?.email,
    //   jobId: createMmmJobId,
    //   connector_type: 'dv360',
    // };