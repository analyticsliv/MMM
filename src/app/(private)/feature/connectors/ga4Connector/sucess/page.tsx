'use client'; // Add this line at the top of the file

import React, { useState } from 'react';
import SuccessPage from './success';
// import CustomDatepicker from './CustomDatepicker';
// import SuccessPage from './SuccessPage'; // Import SuccessPage

function Page() {
  return (
    <div>
      <SuccessPage />
    </div>
  );
}

export default Page;


// https://us-central1-wex-ga4-bigquery.cloudfunctions.net/function-post-test
// const data = [
//   {
//     "refresh_token": "1//0gP9C1j6ZNsq0CgYIARAAGBASNwF-L9Ir0UUc-oM9qr_RFT6bG3AKdBr6aZJKx6dlEy082IaY8Wh5wDa2ndQ_ax2oaXUZCDzFnRM",
//     "property_id": "307724020",
//     "start_date": dateRange.startDate,
//     "end_date": "2024-01-01",
//     "project_id": "wex-ga4-bigquery",
//     "dataset_name": "abcd",
//     "reports_list": [
//         "Engagement_Landing_page"
//     ]
// }
// ]