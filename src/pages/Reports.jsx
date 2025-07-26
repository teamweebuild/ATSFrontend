import React, { useEffect } from 'react';
import { useVehicleStore } from '../store/useVehicleStore';

const Reports = () => {
  const fetchSubmittedVehicles = useVehicleStore(s => s.submittedVehicles);
  const submittedVehicles = useVehicleStore(s => s.reportVehicles);

  useEffect(() => {
    fetchSubmittedVehicles();
  }, [fetchSubmittedVehicles]);
console.log(submittedVehicles)
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports</h2>

        {submittedVehicles?.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engine No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submittedVehicles.map((v) => (
                  <tr key={v._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{v.bookingId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{v.vehicle?.regnNo || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{v.updatedAt?.slice(0,10)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{v.vehicle?.engineNo || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{v?.vehicle?.status || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                        Download Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No reports available.</p>
        )}
      </div>
    </div>
  );
};

export default Reports;
