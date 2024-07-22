import { format } from "date-fns";

export const isProduction = () => import.meta.env.VITE_ENV === "production";

export const debounce = (func: (...args: unknown[]) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: unknown, ...args: unknown[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export const currencyFormat = (rupees = 0) => {
  const formattedValue = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
    .format(Math.abs(roundOff(rupees)))
    .replace("₹", "₹ ");

  return formattedValue;
};

export const dateFormat = (date: string) =>
  format(new Date(date), "dd MMM, yyyy");

export const delay = (ms = 0) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const buildImageURL = (imagePath: string) =>
  `${import.meta.env.VITE_API_URL}/img/${imagePath}`;

export const buildInvoiceImageURL = (toc_id: string, imagePath: string) =>
  `${import.meta.env.VITE_API_URL}/images/${toc_id}/${imagePath}`;

export const buildPaymentImageURL = (imagePath: string) =>
  `${import.meta.env.VITE_API_URL}/images/payments/${imagePath}`;

export const buildThumbnailURL = (imagePath: string) =>
  `${import.meta.env.VITE_API_URL}/tnl/${imagePath}`;

export const removeUndefinedKeys = (obj: any) => {
  const newObj: any = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};

export const roundOff = (num = 0): number => {
  const roundedNum = Math.round(((num || 0) + Number.EPSILON) * 100) / 100;
  return Math.abs(roundedNum);
};

export const roundPercentage = (num = 0): string => {
  if (num === 0) {
    return "0%";
  } else {
    const roundedNum = Math.round(num);
    return roundedNum + "%";
  }
};

export const percentageTwoDigit = (num = 0): string => {
  if (num === 0) {
    return "0%";
  } else {
    const roundedNum = Math.round(num * 100) / 100;
    const formattedNum = roundedNum.toFixed(2);
    return formattedNum.endsWith(".00")
      ? roundedNum.toFixed(0) + "%"
      : formattedNum + "%";
  }
};

export function getOrderStatusClass(status?: string): string {
  switch (status?.toLowerCase()) {
    case "approved":
      return "text-primary";
    case "pending":
      return "text-warning";
    case "unapproved":
      return "text-danger";
    case "sent":
      return "text-danger";
    case "received":
      return "text-danger";
    case "accepted":
      return "text-primary";
    case "created":
      return "text-warning";
    case "pending":
      return "text-warning";
    case "disputed":
      return "text-danger";
    case "resolved":
      return "text-primary";
    case "completed":
      return "text-primary";
    default:
      return "";
  }
}

export const transformInvoiceImageResponse = (
  imageDetails: any,
  toc_id: any
) => {
  if (imageDetails && imageDetails.pics) {
    imageDetails.pics = imageDetails.pics.map((imageName: any) =>
      buildInvoiceImageURL(toc_id, imageName)
    );
  }

  if (imageDetails && imageDetails.products) {
    imageDetails.products = imageDetails.products.map((product: any) => {
      if (product.pr && product.pr.images && product.pr.images.length > 0) {
        product.pr.images = product.pr.images.map((image: any) => {
          image.url = buildImageURL(image.name);
          image.name = buildThumbnailURL(image.name);
          return image;
        });
      }
      return product;
    });
  }

  return imageDetails;
};

export const transformProductImageResponse = (product: any) => {
  if (product.images && product.images.length > 0) {
    product.images[0].name = buildImageURL(product.images[0].name);
  }
  return product;
};
