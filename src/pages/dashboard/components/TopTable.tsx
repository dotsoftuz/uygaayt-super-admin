import React from 'react';
import { ArrowUpward, SwapVert, ArrowDownward } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

type SortField = 'total_price' | 'total_order';
type SortOrder = 'asc' | 'desc';

const TopTable: React.FC<any> = ({ data, setSortField, sortField, setSortOrder, sortOrder }) => {

    const { t } = useTranslation();

    const handleSortUser = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "1" ? "-1" : "1");
        } else {
            setSortField(field);
            setSortOrder("-1");
        }
    };

    const SortIconUser = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <SwapVert className="w-4 h-4" />;
        return sortOrder === "1" ? (
            <ArrowUpward className="w-4 h-4" />
        ) : (
            <ArrowDownward className="w-4 h-4" />
        );
    };

    return (
        <div className="h-[400px] overflow-y-auto bg-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-b-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        {t("common.firstName")}
                                    </th>
                                    <th>
                                        {t('common.phoneNumber')}
                                    </th>
                                    {
                                        data?.[0]?.customer ?
                                            <th
                                                className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSortUser('total_price')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {t("common.price")}
                                                    <SortIconUser field="total_price" />
                                                </div>
                                            </th>
                                            :
                                            <th
                                                className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {t("common.price")}
                                                </div>
                                            </th>
                                    }
                                    <th
                                        className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSortUser('total_order')}
                                    >
                                        <div className="flex items-center gap-2">
                                            {t('sidebar.order')}
                                            <SortIconUser field="total_order" />
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data?.map((user: any) => (
                                    <tr
                                        key={user?._id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {user?.customer ? user?.customer?.firstName || user.customer?.lastName : user?.courier?.firstName || user.courier?.lastName}
                                        </td>
                                        <td>
                                            {user?.customer ? user?.customer?.phoneNumber : user?.courier?.phoneNumber}

                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user?.total_price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user?.total_amount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-700">
                            Ko'rsatilmoqda {startIndex} - {endIndex} jami {data?.length} ta
                        </span>
                        <select
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                        >
                            <option value="5">5 ta</option>
                            <option value="10">10 ta</option>
                            <option value="20">20 ta</option>
                            <option value="50">50 ta</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-lg ${currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                } shadow-md transition-all`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {Array.from({ length: totalPages }).map((_, index) => {
                            const pageNumber = index + 1;
                            // Show first page, last page, current page, and pages around current page
                            if (
                                pageNumber === 1 ||
                                pageNumber === totalPages ||
                                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className={`px-4 py-2 rounded-lg ${currentPage === pageNumber
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                            } shadow-md transition-all`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            } else if (
                                pageNumber === currentPage - 2 ||
                                pageNumber === currentPage + 2
                            ) {
                                return (
                                    <span key={index} className="px-2">
                                        ...
                                    </span>
                                );
                            }
                            return null;
                        })}

                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-lg ${currentPage === totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                } shadow-md transition-all`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default TopTable;