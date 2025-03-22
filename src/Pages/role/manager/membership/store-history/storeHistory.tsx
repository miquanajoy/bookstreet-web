import {
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import { useStoreHistoryHook } from "./useStoreHistoryHook";

const StoryHistory = () => {
  const { street, bookStores } = useStoreHistoryHook();
  console.log("street :>> ", street);
  // Mock data for stores
  const stores = [
    {
      id: 1,
      name: "Đường Sách A",
      imageUrl: "https://via.placeholder.com/150", // Replace with actual image URL
    },
    {
      id: 2,
      name: "Đường Sách B",
      imageUrl: "https://via.placeholder.com/150", // Replace with actual image URL
    },
  ];

  const handleClickStore = (id) => {
    // Replace with your logic to navigate to the store's transaction history
    console.log(`Clicked on store with ID: ${id}`);
  };

  return (
    <div className="bg-white rounded-md ">
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        CÁC CỬA HÀNG TRÊN HỆ THỐNG
      </h2>

      <div className="grid grid-cols-4 p-2">
        <div className="col-span-1">
          {/* Store Selection */}
          <div className="space-y-1 mb-4">
            {street.map((stress) => (
              <div key={stress.streetId} className="mr-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-blue-500"
                    name="stress"
                    value={stress.streetId}
                    // Add onChange and checked attributes to handle radio selection
                  />
                  <span className="ml-2 text-gray-700">
                    {stress.streetName}
                  </span>
                </label>
              </div>
            ))}
            
          </div>
        </div>
        <div className="col-span-3">
          <ImageList cols={3}  sx={{ width: "100%", height: 450 }}>
            {bookStores.map((item) => (
              <ImageListItem key={item.img}>
                <img
                  srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.img}?w=248&fit=crop&auto=format`}
                  alt={item.title}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={item.title}
                  subtitle={item.author}
                  actionIcon={
                    <IconButton
                      sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                      aria-label={`info about ${item.title}`}
                    >
                      <InfoIcon />
                    </IconButton>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      </div>
    </div>
  );
};

export default StoryHistory;
