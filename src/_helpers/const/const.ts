import { Role } from "../../models/Role";

export const AUTH = "Auth";
export const STORE = "Store";
export const AUTHOR = "Author";
export const IMPORT = "Import";
export const SAVEBATCH = "SaveBatch";

export const PUBLISHER = "Publisher";
export const EVENT = "Event";
export const AREA = "Area";
export const LOCATION = "Location";

export const GENRE = "Genre";
export const PRODUCT = "Product";
export const DISTRIBUTOR = "Distributor";
export const CATEGORY = "Category";

export const ROUTER = {
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
    name: "Phân loại",
    url: "/category",
  },
};
export const ROUTERS = [
  {
    logo: "",
    name: "Người dùng",
    url: "/user-management",
    roles: [Role.Admin],
  },
  {
    logo: "",
    ...ROUTER.store,
    roles: [Role.Admin],
  },
  {
    logo: "",
    ...ROUTER.author,
    roles: [Role.Admin],
  },
  {
    logo: "",
    ...ROUTER.souvenir,
    roles: [Role.Admin, Role.Store],
  },
  {
    logo: "",
    ...ROUTER.book,
    roles: [Role.Admin, Role.Store],
  },
  {
    logo: "",
    ...ROUTER.publisher,
    roles: [Role.Admin],
  },
  {
    logo: "",
    ...ROUTER.event,
    roles: [Role.Admin],
  },
  {
    logo: "",
    name: "Khu vực",
    url: "/area",
    roles: [Role.Admin],
  },
  {
    logo: "",
    name: "Vị trí",
    url: "/location",
    roles: [Role.Admin],
  },
  {
    logo: "",
    ...ROUTER.genre,
    roles: [Role.Admin],
  },
  {
    logo: "",
    ...ROUTER.distributor,
    roles: [Role.Admin],
  },
  {
    logo: "",
    ...ROUTER.category,
    roles: [Role.Admin],
  },
];

export const AVATARDEFAULT = "https://mdbootstrap.com/img/new/avatars/8.jpg";
