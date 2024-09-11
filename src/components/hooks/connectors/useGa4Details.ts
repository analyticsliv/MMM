import axios from 'axios';

const useGa4Details = () => {
    const ga4Details = async (data) => {
        try {
            const response = await axios.post(
                'https://us-central1-wex-ga4-bigquery.cloudfunctions.net/function-post-test', data
            );


            if (response.status === 200) {
                console.log("API response:", response);
            } else {
                console.log("Error:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    };

    return { ga4Details };
};

export default useGa4Details;
