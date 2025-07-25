import { create } from "zustand";
import { persist } from "zustand/middleware";

type Platform = "google-ads" | "dv360" | "meta" | null;
type ReportLevel = "campaign" | "channel" | null;

interface CustomerSummary {
    id: string;
    name: string;
}
interface AdvertiserSummary {
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
    metaAccessToken: string | null;
    setMetaAccessToken: (token: string) => void;

    // Google Ads
    googleCustomers: CustomerSummary[];
    setGoogleCustomers: (summaries: CustomerSummary[]) => void;
    selectedGoogleCustomer: string | null;
    setSelectedGoogleCustomer: (id: string) => void;
    googleAdvertiser: AdvertiserSummary[];
    setGoogleAdvertiser: (summaries: AdvertiserSummary[]) => void;
    selectedGoogleAdvertiser: string | null;
    setSelectedGoogleAdvertiser: (id: string) => void;
    isSubmittingGoogle: boolean;
    setIsSubmittingGoogle: (val: boolean) => void;

    // DV360
    advertisers: Advertiser[];
    setAdvertisers: (advertisers: Advertiser[]) => void;
    selectedDv360Advertiser: string | null;
    setSelectedDv360Advertiser: (id: string) => void;
    isSubmittingDv360: boolean;
    setIsSubmittingDv360: (val: boolean) => void;

    // Facebook(Meta)
    metaAccounts: Advertiser[];
    setMetaAccounts: (advertisers: Advertiser[]) => void;
    selectedMetaAccount: string | null;
    setSelectedMetaAccount: (id: string) => void;
    isSubmittingMeta: boolean;
    setIsSubmittingMeta: (val: boolean) => void;

    uniqueId: string | null;
    setUniqueId: (id: string) => void;
    mmmJobId: string | null;
    setMmmJobId: (id: string) => void;
    ga4uniqueId: string | null;
    setGa4UniqueId: (id: string) => void;
    kpi: string | "Revenue";
    setKpi: (kpi: string) => void;

    campaigns: Campaign[];
    setCampaigns: (data: Campaign[]) => void;

    selectedCountry: string | "USA";
    setSelectedCountry: (country: string) => void;

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

    hasSubmitted: boolean;
    setHasSubmitted: (val: boolean) => void;

    isSubmittingModal: boolean;
    setIsSubmittingModal: (val: boolean) => void;

    clearAll: () => void;
}

export const useMMMStore = create<MMMStore>()(
    persist(
        (set) => ({
            platform: null,
            setPlatform: (platform) => set({ platform }),

            reportLevel: "campaign",
            setReportLevel: (level) => set({ reportLevel: level }),

            googleAdsRefreshToken: null,
            setGoogleAdsRefreshToken: (token) =>
                set({ googleAdsRefreshToken: token }),

            dv360RefreshToken: null,
            setDv360RefreshToken: (token) => set({ dv360RefreshToken: token }),
            metaAccessToken: null,
            setMetaAccessToken: (token) => set({ metaAccessToken: token }),

            // Google
            googleCustomers: [],
            setGoogleCustomers: (summaries) => set({ googleCustomers: summaries }),
            selectedGoogleCustomer: null,
            setSelectedGoogleCustomer: (id) => set({ selectedGoogleCustomer: id }),
            isSubmittingGoogle: false,
            setIsSubmittingGoogle: (val) => set({ isSubmittingGoogle: val }),
            googleAdvertiser: [],
            setGoogleAdvertiser: (summaries) => set({ googleAdvertiser: summaries }),
            selectedGoogleAdvertiser: null,
            setSelectedGoogleAdvertiser: (id) => set({ selectedGoogleAdvertiser: id }),

            // DV360
            advertisers: [],
            setAdvertisers: (advertisers) => set({ advertisers }),
            selectedDv360Advertiser: null,
            setSelectedDv360Advertiser: (id) =>
                set({ selectedDv360Advertiser: id }),
            isSubmittingDv360: false,
            setIsSubmittingDv360: (val) => set({ isSubmittingDv360: val }),

            // Facebook
            metaAccounts: [],
            setMetaAccounts: (advertisers) => set({ metaAccounts: advertisers }),
            selectedMetaAccount: null,
            setSelectedMetaAccount: (id) =>
                set({ selectedMetaAccount: id }),
            isSubmittingMeta: false,
            setIsSubmittingMeta: (val) => set({ isSubmittingMeta: val }),

            uniqueId: null,
            setUniqueId: (id) => set({ uniqueId: id }),
            mmmJobId: null,
            setMmmJobId: (id) => set({ mmmJobId: id }),
            ga4uniqueId: null,
            setGa4UniqueId: (id) => set({ ga4uniqueId: id }),

            kpi: 'Revenue',
            setKpi: (kpi) => set({ kpi: kpi }),

            campaigns: [],
            setCampaigns: (data) => set({ campaigns: data }),

            selectedCountry: "USA",
            setSelectedCountry: (name) => set({ selectedCountry: name }),

            selectedCampaigns: [],
            setSelectedCampaigns: (campaigns) =>
                set({ selectedCampaigns: campaigns }),

            roiMean: 0.2,
            setRoiMean: (value) => set({ roiMean: value }),
            roiSigma: 0.9,
            setRoiSigma: (value) => set({ roiSigma: value }),

            ga4Linked: null,
            setGa4Linked: (linked) => set({ ga4Linked: linked }),

            selectedTime: "Date",
            selectedKpi: "Revenue",
            selectedMediaSpend: [],
            selectedMedia: [],
            selectedControl: [],

            setSelectedTime: (val) => set({ selectedTime: val }),
            setSelectedKpi: (val) => set({ selectedKpi: val }),
            setSelectedMediaSpend: (val) => set({ selectedMediaSpend: val }),
            setSelectedMedia: (val) => set({ selectedMedia: val }),
            setSelectedControl: (val) => set({ selectedControl: val }),

            hasSubmitted: false,
            setHasSubmitted: (val) => set({ hasSubmitted: val }),

            isSubmittingModal: false,
            setIsSubmittingModal: (val) => set({ isSubmittingModal: val }),

            clearAll: () =>
                set({
                    platform: null,
                    reportLevel: "campaign",
                    googleAdsRefreshToken: null,
                    dv360RefreshToken: null,
                    metaAccessToken: null,
                    googleCustomers: [],
                    metaAccounts: [],
                    selectedGoogleCustomer: null,
                    googleAdvertiser: [],
                    selectedGoogleAdvertiser: null,
                    advertisers: [],
                    selectedDv360Advertiser: null,
                    selectedCampaigns: [],
                    selectedMetaAccount: null,
                    ga4Linked: null,
                    roiMean: 0.2,
                    roiSigma: 0.9,
                    selectedTime: "Date",
                    selectedKpi: "Revenue",
                    selectedMediaSpend: [],
                    selectedMedia: [],
                    selectedControl: [],
                }),
        }),
        {
            name: "mmm-store",
            partialize: (state) => ({
                googleAdsRefreshToken: state.googleAdsRefreshToken,
                dv360RefreshToken: state.dv360RefreshToken,
                metaAccessToken: state.metaAccessToken,
            }),
        }
    )
);
