import { Role } from "../../models/Role";

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
      name: "Quản lý cộng điểm",
      url: "/point-history",
    },
  },
  roleManager: {
 
  },
  roleGiftStore: {
    gift: {
      name: "Quà tặng",
      url: "/gift",
    }
  },
};
export const ROUTERS = [
  {
    logo: "",
    name: "Tài khoản",
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
    ...ROUTER.kios,
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
    ...ROUTER.street,
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
  {
    logo: "",
    ...ROUTER.roleStore.customerPoint,
    roles: [Role.Store],
  },
  {
    logo: "",
    ...ROUTER.roleAdmin.pointHistory,
    roles: [Role.Admin],
  },
];

export const AVATARDEFAULT = "https://mdbootstrap.com/img/new/avatars/8.jpg";
