import { useLocation, useNavigate, useParams } from "react-router-dom";
import ListOrder from "../../../../store/process-order/list-order/list-order";
import { useEffect, useState } from "react";
import { fetchWrapper } from "../../../../../../_helpers/fetch-wrapper";
import config from "../../../../../../config";
import { STORE } from "../../../../../../_helpers/const/const";

export default function StoreHistoryDetail() {
  const navigate = useNavigate();
  const params = useParams();

  const [store, setStore] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      setIsLoading(true);
      setError(null);
      setStore(null);

      try {
        if (!params.id) {
          throw new Error("Store ID is missing.");
        }
        const result = await fetchWrapper.get(
          `${config.apiUrl}${STORE}/${params.id}`
        );
        setStore(result);
      } catch (err) {
        console.error("Error fetching store details:", err);
        setError(err.message || "Đã xảy ra lỗi khi tải thông tin cửa hàng.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 text-lg">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-4 text-center">
        <p className="text-red-600 mb-4">Lỗi: {error}</p>
        <button
          className="flex items-center text-gray-700 hover:text-black mx-auto"
          onClick={() => {
            navigate("/membership/store-history", { replace: true });
          }}
        >
          <span className="text-xl mr-2">←</span> Quay lại danh sách
        </button>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="px-6 py-4 text-center text-gray-500">
        Không tìm thấy thông tin cửa hàng.
      </div>
    );
  }

  return (
    <>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <button
            className="flex items-center text-gray-700 hover:text-black"
            onClick={() => {
              navigate("/membership/store-history", { replace: true });
            }}
          >
            <span className="text-xl mr-2">←</span> Quay lại
          </button>

          <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800 flex-grow mx-4">
            Các đơn hàng tại {store?.storeName || "Cửa hàng"}
          </h2>

          <div className="w-20 invisible"></div>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
          <div className="text-sm text-gray-700">
            Số đơn hàng chưa thanh toán: <span className="font-medium">1</span>
          </div>

          <button className="py-1.5 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded border border-gray-400 transition duration-150 ease-in-out">
            Thanh toán cho cửa hàng
          </button>
        </div>

        <div>
          <ListOrder status="1" storeId={params.id} />
        </div>
      </div>
    </>
  );
}
