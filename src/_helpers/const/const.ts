import { Address } from "../../assets/icon/address";
import { PublisherIcon } from "../../assets/icon/publisher";
import { AreaIcon } from "../../assets/icon/area";
import { BookIcon } from "../../assets/icon/book";
import { CustomerPointIcon } from "../../assets/icon/customerPoint";
import { KioskIcon } from "../../assets/icon/kiosk";
import { LocationIcon } from "../../assets/icon/location";
import { Souvenir } from "../../assets/icon/souvenir";
import { StoreIcon } from "../../assets/icon/store";
import { UserIcon } from "../../assets/icon/user";
import { Role } from "../../models/Role";
import bgDefault from "./../../assets/images/background-default.png";
import { EventIcon } from "../../assets/icon/event";
import { StreetIcon } from "../../assets/icon/street";
import { GenreIcon } from "../../assets/icon/genre";
import { DistributorIcon } from "../../assets/icon/distributorIcon";
import { CategoryIcon } from "../../assets/icon/category";
import { AuthorIcon } from "../../assets/icon/author";

export const AUTH = "Auth";
export const STORE = "Store";
export const AUTHOR = "Author";
export const IMPORT = "Import";
export const SAVEBATCH = "SaveBatch";

export const PUBLISHER = "Publisher";
export const EVENT = "Event";
export const STREET = "Street";
export const AREA = "Area";
export const LOCATION = "Location";

export const GENRE = "Genre";
export const PRODUCT = "Product";
export const DISTRIBUTOR = "Distributor";
export const CATEGORY = "Category";
export const CUSTOMER = "Customer";
export const POINT_HISTORY = "PointHistory";
export const GIFT = "Gift";
export const KIOS = "Kiosk";

export const ROUTER = {
  user: {
    name: "Tài khoản",
    url: "/user-management",
  },
  book: {
    name: "Sách",
    url: "/books",
  },
  souvenir: {
    name: "Quà lưu niệm",
    url: "/souvenir",
  },
  event: {
    name: "Sự kiện",
    url: "/event-management",
  },
  publisher: {
    name: "Nhà xuất bản",
    url: "/publisher-management",
  },
  store: {
    name: "Cửa hàng",
    url: "/store-management",
  },
  kios: {
    name: "Máy Kiosk",
    url: "/Kiosk",
  },
  author: {
    name: "Tác giả",
    url: "/author-management",
  },
  genre: {
    name: "Thể loại",
    url: "/genre",
  },
  distributor: {
    name: "Nhà phân phối",
    url: "/distributor",
  },
  category: {
    name: "Danh mục",
    url: "/category",
  },
  street: {
    name: "Đường sách",
    url: "/street",
  },
  roleStore: {
    customerPoint: {
      name: "Duyệt điểm",
      url: "/browse-scores",
    },
  },
  roleAdmin: {
    pointHistory: {
      name: "Quản lý cấp điểm",
      url: "/point-history",
    },
  },
  roleManager: {
    area: {
      name: "Quản lý khu vực",
      url: "/area",
    },
    location: {
      name: "Quản lý vị trí",
      url: "/location",
    },
  },
  roleGiftStore: {
    gift: {
      name: "Quà tặng",
      url: "/gift",
    },
  },
};
export const ROUTERS = [
  {
    logo: UserIcon,
    ...ROUTER.user,
    roles: [Role.Admin],
  },
  {
    logo: StoreIcon,
    ...ROUTER.store,
    roles: [Role.Manager],
  },
  {
    logo: KioskIcon,
    ...ROUTER.kios,
    roles: [Role.Manager],
  },
  {
    logo: AuthorIcon,
    ...ROUTER.author,
    roles: [Role.Manager],
  },
  {
    logo: Souvenir,
    ...ROUTER.souvenir,
    roles: [Role.Manager, Role.Store],
  },
  {
    logo: BookIcon,
    ...ROUTER.book,
    roles: [Role.Manager, Role.Store],
  },
  {
    logo: PublisherIcon,
    ...ROUTER.publisher,
    roles: [Role.Manager],
  },
  {
    logo: EventIcon,
    ...ROUTER.event,
    roles: [Role.Manager],
  },
  {
    logo: StreetIcon,
    ...ROUTER.street,
    roles: [Role.Manager],
  },
  {
    logo: AreaIcon,
    name: "Khu vực",
    url: "/area",
    roles: [Role.Manager],
  },
  {
    logo: LocationIcon,
    name: "Vị trí",
    url: "/location",
    roles: [Role.Manager],
  },
  {
    logo: DistributorIcon,
    ...ROUTER.distributor,
    roles: [Role.Manager],
  },
  {
    logo: CategoryIcon,
    ...ROUTER.category,
    roles: [Role.Manager],
  },
  {
    logo: GenreIcon,
    ...ROUTER.genre,
    roles: [Role.Manager],
  },
  {
    logo: CustomerPointIcon,
    ...ROUTER.roleStore.customerPoint,
    roles: [Role.Store],
  },
  {
    logo: Address,
    ...ROUTER.roleAdmin.pointHistory,
    roles: [Role.Manager],
  },
];

export const AVATARDEFAULT = bgDefault;
export const QUAN_LY = "Quản lý ";
