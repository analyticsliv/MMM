import axios from 'axios';

const useGa4Details = () => {
    const url = 'https://us-central1-dx-api-project.cloudfunctions.net/function-post-ga4';
    const ga4Details = async (data: Object) => {
        try {
            try {
                const response = await axios.post('/api/proxy', { url, body: data });

                if (response.status === 200) {
                    console.log("API response:", response.data);
                    return response.data;
                } else {
                    console.error("Error:", response.statusText);
                    return null;
                }
            } catch (error) {
                console.error("Error:", error);
                return null;
            }
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    };

    return { ga4Details };
};

export default useGa4Details;
