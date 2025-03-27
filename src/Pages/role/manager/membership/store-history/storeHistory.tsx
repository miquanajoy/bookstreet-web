import {
  FormControl,
  FormControlLabel,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
  Radio,
  RadioGroup,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useStoreHistoryHook } from "./useStoreHistoryHook";

const StoryHistory = () => {
  const { defaultStressId, street, bookStores, handleChange } =
    useStoreHistoryHook();

  return (
    <div className="bg-white rounded-md ">
      <div className="grid grid-cols-4 p-2">
        <div className="col-span-1">
          {/* Store Selection */}
          <div className="space-y-1 mb-4">
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={defaultStressId}
                onChange={handleChange}
              >
                {street.map((street) => (
                  <FormControlLabel
                    value={street.streetId}
                    control={<Radio />}
                    label={street.streetName}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </div>
        </div>
        <div className="col-span-3">
          <h1 className="text-xl font-semibold text-gray-800 mb-4">
            Các cửa hàng trên hệ thống
          </h1>
          {bookStores.length ? (
            <ImageList cols={4} sx={{ width: "100%" }} gap={12}>
              {bookStores.map((item) => (
                <ImageListItem key={item.id} className="m-0">
                  <img
                    srcSet={`${item.urlImage}`}
                    src={`${item.urlImage}`}
                    alt={item.storeName}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={item.storeName}
                    subtitle={item.author}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          ) : (
            <> </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryHistory;
