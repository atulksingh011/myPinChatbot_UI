import axios from "axios";
import { getAuthToken } from "./utils";

/**
 * Logs in the user with the provided username and password.
 * @param {number} mobile - The mobile number of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<void>}
 */
export const login = async (mobile = 9535888738, password = "kamal123") => {
  try {
    // Make the POST request with Axios
    const response = await axios.post(
      "https://account.mypin.ai/api/login/login",
      {
        mobile,
        password,
      }
    );

    // Save the result in localStorage
    localStorage.setItem("user", JSON.stringify(response.data));

    return response.data;
  } catch (error) {
    console.error("Login failed", error);
    return null;
  }
};

export const getContact = async (name: string) => {
  try {
    // Make the POST request with Axios
    const response = await axios.post(
      "https://account.mypin.ai/api/contact/get",
      {
        no_of_docs: 1,
        skip: 0,
        st: "all",
        name,
      },
      {
        headers: {
          Logintoken: getAuthToken(),
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("getContact failed", error);
    return null;
  }
};

export const getUnsettled = async (_id: string) => {
  try {
    // Make the POST request with Axios
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const clientId = user.data?.clientId;
    
    const response = await axios.post(
      "https://account.mypin.ai/api/settlement/getUnsettled",
      {
        no_of_docs: 3,
        groupView: false,
        pdf: false,
        _id,
      },
      {
        headers: {
          Logintoken: getAuthToken(),
        },
      }
    );
    const newResponse = response.data.data[0];
    if (!clientId) throw "User not loggedIn";
    const transformRes = transformLedgerDetailResponse(
      newResponse,
      clientId
    );
    return { data: transformRes } as any;
  } catch (error) {
    console.error("getUnsettled failed", error);
    return null;
  }
};


export function transformLedgerDetailResponse(
  settlement: any,
  clientId: number
) {
  const isPaymentTypeCR = (pType: any) =>
    pType == "Receipt" ||
    pType == "Discount Given" ||
    pType == "Purchase Adjustment";
  settlement.payments = settlement.payments || {};
  settlement.invoices = settlement.invoices || {};
  const skipCal = (inv: any) => {
    if (inv.type.toLowerCase() === "purchase") {
      if (inv.pStatus.toLowerCase() === "pending") return true;
    } else if (inv.type.toLowerCase() === "sales") {
      if (inv.sStatus.toLowerCase() === "pending" && inv.pStatus === "pending")
        return true;
    } else {
      if (inv.status.toLowerCase() === "pending") return true;
    }

    return false;
  };
  settlement.list = [
    ...(settlement.payments.entries || []).map((item: any) => {
      const payment = {
        type: item.ptype,
        date: item.date,
        key: "payments",
        products: [],
        cr: (isPaymentTypeCR(item.ptype) && item.amount) || 0,
        dr: (!isPaymentTypeCR(item.ptype) && item.amount) || 0,
        _id: item._id,
        isSettlable: checkIsSettleable(item),
        ...item,
      };

      if (!(payment.skipCal = skipCal(payment))) {
        payment.check = payment.isSettlable = !payment.skipCal;
      }
      return payment;
    }),

    ...(settlement.invoices.entries || []).map((item: any) => {
      const invoice = {
        type:
          (item.seller && item.seller.toc_id === clientId && "Sales") ||
          "Purchase",
        date: item.date,
        key: "invoices",
        products: item.products,
        cr:
          item.seller && item.seller.toc_id === clientId ? 0 : item.totalPrice,
        dr:
          item.seller && item.seller.toc_id === clientId ? item.totalPrice : 0,
        _id: item._id,

        ...item,
      };

      if (!(invoice.skipCal = skipCal(invoice))) {
        invoice.check = invoice.isSettlable = !invoice.skipCal;
      }
      return invoice;
    }),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let oSettlementGrouping: { [key: string]: any } = {};

  settlement.list.forEach((oLedger: any) => {
    oSettlementGrouping[oLedger.type] = oSettlementGrouping[oLedger.type] || {
      type: oLedger.type,
      products: {},
      entries: [],
    };

    if (oLedger.products.length) {
      let products = oSettlementGrouping[oLedger.type].products;

      oLedger.products.forEach((oProd: any) => {
        products[oProd.name] = products[oProd.name] || {
          name: oProd.name,
          unit: oProd.unit,
          entries: [],
        };
        let entries = products[oProd.name].entries;
        entries.push({
          ...oProd,
          date: oLedger.date,
        });

        entries.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      });
    } else {
      oSettlementGrouping[oLedger.type].entries.push(oLedger);
    }
  });

  settlement.groupList = Object.values(oSettlementGrouping).map(
    (oType: any) => {
      oType.products = Object.values(oType.products);
      return oType;
    }
  );

  return { settlement };
}


export function checkIsSettleable(item: any) {
  if (item.disputable && item.dispute && item.dispute.st)
    return !(item.dispute.st.toLowerCase() === "disputed");
  return true;
}
