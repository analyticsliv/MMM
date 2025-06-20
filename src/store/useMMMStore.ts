import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Platform = 'google-ads' | 'dv360' | null;
type ReportLevel = 'campaign' | 'channel' | null;

interface CustomerSummary {
    id: string;
    name: string;
}
interface Advertiser {
    advertiserId: string;
    displayName: string;
}

interface Campaign {
    Campaign_Name: string;
    Active_Weeks: number;
    Total_Spend: number;
    Spend_Pct: number;
}

interface MMMStore {
    platform: Platform;
    setPlatform: (platform: Platform) => void;

    reportLevel: ReportLevel;
    setReportLevel: (level: ReportLevel) => void;

    googleAdsRefreshToken: string | null;
    setGoogleAdsRefreshToken: (token: string) => void;

    dv360RefreshToken: string | null;
    setDv360RefreshToken: (token: string) => void;

    customerSummaries: CustomerSummary[];
    setCustomerSummaries: (summaries: CustomerSummary[]) => void;

    selectedCustomer: string | null
    setSelectedCustomer: (customerId: string) => void
    uniqueId: string | null
    setUniqueId: (uniqueId: string) => void

    isSubmittingCustomerBtn: boolean;
    setIsSubmittingCustomerBtn: (value: boolean) => void;

    campaigns: Campaign[];
    setCampaigns: (data: Campaign[]) => void;

    selectedCountry: string | 'USA'
    setSelectedCountry: (country: string) => void

    advertisers: Advertiser[];
    setAdvertisers: (advertisers: Advertiser[]) => void;

    selectedCampaigns: string[];
    setSelectedCampaigns: (campaigns: string[]) => void;

    roiMean: number;
    roiSigma: number;
    setRoiMean: (value: number) => void;
    setRoiSigma: (value: number) => void;

    ga4Linked: boolean | null;
    setGa4Linked: (linked: boolean | null) => void;

    selectedTime: string;
    selectedKpi: string;
    selectedMediaSpend: string[];
    selectedMedia: string[];
    selectedControl: string[];

    setSelectedTime: (val: string) => void;
    setSelectedKpi: (val: string) => void;
    setSelectedMediaSpend: (val: string[]) => void;
    setSelectedMedia: (val: string[]) => void;
    setSelectedControl: (val: string[]) => void;

    clearAll: () => void;
}

export const useMMMStore = create<MMMStore>()(
    persist(
        (set) => ({
            platform: null,
            setPlatform: (platform) => set({ platform }),

            reportLevel: 'campaign',
            setReportLevel: (level) => set({ reportLevel: level }),

            googleAdsRefreshToken: null,
            setGoogleAdsRefreshToken: (token) => set({ googleAdsRefreshToken: token }),

            dv360RefreshToken: null,
            setDv360RefreshToken: (token) => set({ dv360RefreshToken: token }),

            customerSummaries: [],
            setCustomerSummaries: (summaries) => set({ customerSummaries: summaries }),

            selectedCustomer: null,
            setSelectedCustomer: (id) => set({ selectedCustomer: id }),
            uniqueId: null,
            setUniqueId: (id) => set({ uniqueId: id }),
            isSubmittingCustomerBtn: false,
            setIsSubmittingCustomerBtn: (value) => set({ isSubmittingCustomerBtn: value }),

            campaigns: [],
            setCampaigns: (data) => set({ campaigns: data }),

            selectedCountry: 'USA',
            setSelectedCountry: (name) => set({ selectedCountry: name }),

            advertisers: [],
            setAdvertisers: (advertisers) => set({ advertisers }),

            selectedCampaigns: [],
            setSelectedCampaigns: (campaigns) => set({ selectedCampaigns: campaigns }),

            roiMean: 0.2,
            setRoiMean: (value) => set({ roiMean: value }),
            roiSigma: 0.9,
            setRoiSigma: (value) => set({ roiSigma: value }),

            ga4Linked: null,
            setGa4Linked: (linked) => set({ ga4Linked: linked }),

            selectedTime: 'Date',
            selectedKpi: 'Revenue',
            selectedMediaSpend: [],
            selectedMedia: [],
            selectedControl: [],

            setSelectedTime: (val) => set({ selectedTime: val }),
            setSelectedKpi: (val) => set({ selectedKpi: val }),
            setSelectedMediaSpend: (val) => set({ selectedMediaSpend: val }),
            setSelectedMedia: (val) => set({ selectedMedia: val }),
            setSelectedControl: (val) => set({ selectedControl: val }),

            clearAll: () =>
                set({
                    platform: null,
                    reportLevel: 'campaign',
                    googleAdsRefreshToken: null,
                    dv360RefreshToken: null,
                    customerSummaries: [],
                    selectedCustomer: null,
                    advertisers: [],
                    selectedCampaigns: [],
                    ga4Linked: null,
                    roiMean: 0.2,
                    roiSigma: 0.9,
                    selectedTime: 'Date',
                    selectedKpi: 'Revenue',
                    selectedMediaSpend: [],
                    selectedMedia: [],
                    selectedControl: [],
                }),
        }),
        {
            name: 'mmm-store', // localStorage key
            partialize: (state) => ({
                googleAdsRefreshToken: state.googleAdsRefreshToken,
                dv360RefreshToken: state.dv360RefreshToken,
            }),
        }
    )
);
