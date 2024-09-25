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
  user: {
    name: "Tài khoản",
    url: "/user-management",
  },  book: {
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
    ...ROUTER.user,
    roles: [Role.Admin],
  },
  {
    logo: "",
    ...ROUTER.store,
    roles: [Role.Manager],
  },
  {
    logo: "",
    ...ROUTER.kios,
    roles: [Role.Manager],
  },
  {
    logo: "",
    ...ROUTER.author,
    roles: [Role.Manager],
  },
  {
    logo: "",
    ...ROUTER.souvenir,
    roles: [Role.Manager, Role.Store],
  },
  {
    logo: "",
    ...ROUTER.book,
    roles: [Role.Manager, Role.Store],
  },
  {
    logo: "",
    ...ROUTER.publisher,
    roles: [Role.Manager],
  },
  {
    logo: "",
    ...ROUTER.event,
    roles: [Role.Manager],
  },
  {
    logo: "",
    ...ROUTER.street,
    roles: [Role.Manager],
  },
  {
    logo: "",
    name: "Khu vực",
    url: "/area",
    roles: [Role.Manager],
  },
  {
    logo: "",
    name: "Vị trí",
    url: "/location",
    roles: [Role.Manager],
  },
  {
    logo: "",
    ...ROUTER.genre,
    roles: [Role.Manager],
  },
  {
    logo: "",
    ...ROUTER.distributor,
    roles: [Role.Manager],
  },
  {
    logo: "",
    ...ROUTER.category,
    roles: [Role.Manager],
  },
  {
    logo: "",
    ...ROUTER.roleStore.customerPoint,
    roles: [Role.Store],
  },
  {
    logo: "",
    ...ROUTER.roleAdmin.pointHistory,
    roles: [Role.Manager],
  },
];

export const AVATARDEFAULT = "https://mdbootstrap.com/img/new/avatars/8.jpg";
