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
    name: "Book",
    url: "/books",
  },
  souvenir: {
    name: "Souvenir",
    url: "/souvenir",
  },
  event: {
    name: "Event",
    url: "/event-management",
  },
  publisher: {
    name: "Publisher",
    url: "/publisher-management",
  },
  store: {
    name: "Store",
    url: "/store-management",
  },
  author: {
    name: "Author",
    url: "/author-management",
  },
  genre: {
    name: "Genre",
    url: "/genre",
  },
  distributor: {
    name: DISTRIBUTOR,
    url: "/distributor",
  },
  category: {
    name: CATEGORY,
    url: "/category",
  },
};
export const ROUTERS = [
  {
    logo: "",
    name: "User",
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
    name: "Area",
    url: "/area",
    roles: [Role.Admin],
  },
  {
    logo: "",
    name: "Location",
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
