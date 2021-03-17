export interface UserType {
  id: number;
  firstname: string;
  lastname: string;
  password: string;
  regiesterTime: string;
  preferLanguage: string;
  photo: string;
  phoneNumber: string;
  email: string;
}

export interface RequestAccessQ {
  displayorder: number;
  hidden: boolean;
  questionstring: string;
  questiontype: string;
  required: boolean;
  options: Array;
  questionid: number;
  guestbookid: number;
}

export interface dataFiles {
  id: number;
  label: string;
  restricted: boolean;
  authenticated_user_id: number;
  assigneeidentifier: number;
}
export interface ResultType {
  type: "save" | "submit";
}

export interface AdminType {
  id: number;
  name: string;
  password: string;
  restaurantId: number;
  companyId: number;
  role: string;
  date?: string;
}

export interface CompanyType {
  companyId: number;
  name: string;
  url: string;
}

export interface RestaurantType {
  id: number;
  name: string;
  ename: string;
  abn: string;
  logo: string;
  description: string;
  type: string;
  phone: string;
  email: string;
  openTimeMorning: string;
  openTimeAfternoon: string;
  checkin: boolean;
  backgroundImg: string;
  serviceType: string;
  regiesterPrinter: boolean;
  kitchenPrinter: boolean;
  report: boolean;
  abn: string;
  cash: boolean;
  paypal: boolean;
  printMode: string;
  shipId: number;
  no: string;
  building: string;
  street: string;
  suburb: string;
  state: string;
  gpsPosition: string;
  url: string;
  themeMain: string;
  themeSecondary: string;
  themeBackground: string;
}

export enum OrderStatus {
  // Create = '0',
  NewOrder = "1",
  ConfirmOrder = "2",
  Delivering = "3",
  // Finish = '4'
}
export enum DishItemStatus {
  Wait = "0" | null,
  Cook = "1",
}
export interface CouponType {
  couponId: number;
  companyId: number;
  coupon: string;
  type: string;
  value: number;
  limit: number;
  condition: number;
  accumulate: number;
  valid: boolean;
  orderId: number;
  orderValue: number;
  expireDate: string;
  createDate: string;
}
export interface CouponRuleType {
  couponRuleId: number;
  companyId: number;
  unit: number;
  value: number;
  condition: number;
  status: boolean;
}
export interface OrderType {
  id: number;
  restaurantId: number;
  userId: number;
  creatTime: string;
  status: OrderStatus;
  totalPrice: number;
  paymentStatus: boolean;
  tableId: string;
  type: number;
  comment: string;
  finalPrice: number;
  paymentMethod: string;
  paymentReturn: string;
  items: Array<DishItemType>;
  deliveryId: string;
  deliveryFee: number;
  name: string;
  address: string;
  phone: string;
  registerPrint: boolean;
  kitchenPrint: boolean;
}

export interface SuburbType {
  id: number;
  postcode: string;
  suburb: string;
  shortName: string;
  cityId: number;
  stateId: number;
  restaurantId: number;
  price: number;
}

export interface DishExtraType {
  name: string;
  ename: string;
  price: number;
  dishId: number;
  dishExtraId: number;
  num: number;
}
export interface DishItemType extends ProductType {
  id: number;
  dishCount: number;
  deleted: number;
  comment: string;
  printed: number;
  status: DishItemStatus;
  salePrice: number;
  dishExtra: Array<DishExtraType>;
}
export enum ProductStatus {
  available = 1,
  unavailable = 0,
}
export interface AddSubDishType {
  dishExtraId: number | null;
  dishId: number;
  name: string;
  ename: string;
  price: string;
}
export interface ProductType {
  dishId: number;
  shopId: number;
  type: string;
  etype: string;
  name: string;
  ename: string;
  description: string;
  photo: string;
  ingredient: string;
  price: number;
  discount: number;
  flavor: number;
  sold: number;
  available: ProductStatus;
  favorite: boolean;
  subtype: string;
  abbreviation: string;
  printer: number;
  dish_extra: Array<ExtraDishType>;
  seq: number;
}

export interface ExtraDishType {
  dishExtraId: number;
  dishId: number;
  name: string;
  ename: string;
  price: string;
}

export interface AddressType {
  id: number;
  userId: number;
  building: string;
  street: string;
  suburb: string;
  state: string;
  isPrime: boolean;
  postcode: string;
}

export interface PrinterType {
  printerId: number;
  restaurantId: number;
  printerName: string;
  printerIP: string;
  printerPort: string;
  printerType: string;
  printerStandard: string;
  status:
    | "default"
    | "success"
    | "warning"
    | "error"
    | "processing"
    | undefined;
}

export interface PrintItemType {
  name: string;
  count: number;
  price: number;
  dishExtra: Array<DishExtraType>;
}

export interface KitchenPrinterType {
  orderId: number;
  printerIP: string;
  printerPort: string;
  items: Array<PrintItemType>;
}
export interface RegisterPrinterType {
  orderId: number;
  printerIP: string;
  printerPort: string;
  restaurantName: string;
  restaurantphone: string;
  abn: string;
  orderTime: string;
  priceTotal: number;
  paymentInfo: string;
  name: sting;
  phone: string;
  address: string;
  deliveryFee: number;
  note: string;
  url: string;
  items: Array<PrintItemType>;
}

export interface OpenDayType {
  id: number;
  openDay: string;
  restaurantId: number;
  morningStart: string;
  morningEnd: string;
  afternoonStart: string;
  afternoonEnd: string;
  morningClose: boolean;
  afternoonClose: boolean;
  open: boolean;
}
