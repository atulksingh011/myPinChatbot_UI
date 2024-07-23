import { useContext, useEffect, useState } from "react";
import { useSetHeadingBackButtonToggle } from "../providers/headingContext";
import { SearchContext } from "../providers/searchContext";
import { getUnsettled } from "../apis";
import { currencyFormat, dateFormat } from "../utils/common-utils";
import CalendarIcon from "../icons/Calender";

interface LedgerData {
  dayReceivable: number;
  lsb: number;
  ls: any;
  ob: number;
  settlement: any;
  list: any;
  daysPayable: number;
}

const LedgerDetail = () => {
  const { data: contactData } = useContext(SearchContext);
  const [ledgerData, setLedgerData] = useState<LedgerData | null>(null);
  // const navigate = useNavigate();

  const combinedList = ledgerData?.list || [];
  const getBalance = () => {
    return combinedList.reduce((total: any, obj: any) => {
      if (obj.skipCal) return total;

      if (obj.check) {
        total += obj.dr - obj.cr;
      } else {
        total += obj.dr - obj.cr;
      }
      return total;
    }, ledgerData?.lsb || 0);
  };

  const balance = getBalance();

  useEffect(() => {
    const fetchLedgerData = async () => {
      if (contactData?._id) {
        try {
          const response = await getUnsettled(contactData._id);
          setLedgerData(
            response.data?.settlement ? response.data.settlement : null
          );
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchLedgerData();
  }, [contactData]);

  useSetHeadingBackButtonToggle(true);


  return (
    <>
      <p className="fs-4 mb-1">{contactData?.name}'s Ledger</p>
      <div>
        <p className="mt-3">
          <strong>Current Balance:{" "}</strong>
          {balance >= 0 && ledgerData?.dayReceivable !== 0 && (
            <span>
              <strong> {currencyFormat(balance)}</strong>
              <p className="fst-italic">
              You will Receive this amount in approximately {ledgerData?.dayReceivable} days.
              </p>
            </span>
          )}
          {balance < 0 && ledgerData?.daysPayable !== 0 && (
            <span>
              <strong> {currencyFormat(balance)}</strong> 
              <p>
              You will have to pay this amount in approximately {ledgerData?.daysPayable} days.
              </p>
            </span>
          )}
        </p>
        <strong>
          <span>
            {ledgerData?.ls?._id ? "Last Settled" : "Opening"} Balance:
          </span>
          <span
            className={`mx-1 ${
              ledgerData?.lsb !== undefined || ledgerData?.ob !== undefined
                ? (ledgerData?.lsb ?? 0) > 0 || (ledgerData?.ob ?? 0) > 0
                  ? "text-primary"
                  : "text-danger"
                : ""
            }`}
          >
            {" "}
            {ledgerData?.lsb !== 0
              ? currencyFormat(ledgerData?.lsb)
              : currencyFormat(ledgerData?.ob)}
            </span>
            </strong>
           <p>
           {balance >= 0 && ledgerData?.dayReceivable !== 0 && (
            <span className="fst-italic">
              {" "}
             You will receive this in {ledgerData?.dayReceivable} days
              
            </span>
          )}
          {balance < 0 && ledgerData?.daysPayable !== 0 && (
            <span className="fst-italic">
              {" "}
             You have to pay this in {ledgerData?.daysPayable} days
            </span>
          )}
          </p>

        <h6 className="mt-5"><strong>Ledger Details:</strong></h6> 
        <div className="table-responsive" style={{ height: "300px" }}>
          <table className="table mt-2">
            <thead>
              <tr>
                <th className="col-md-2 col-4 col-sm-4">Type</th>
                <th className="col-md-2 col-4 col-sm-4 text-center">DR</th>
                <th className="col-md-2 col-4 col-sm-4 text-center">CR</th>
              </tr>
            </thead>
            <tbody>
              {combinedList.map((item: any) => (
                <tr key={item._id}>
                  <td>
                    <div className="col-md-12 col-12 col-sm-4 d-flex">
                      <div className="text-primary">
                        <h6>{item.type}</h6>
                      </div>
                      {item.mode && (
                        <div className="ml-2  text-primary">
                          <h6>({item.mode})</h6>
                        </div>
                      )}
                    </div>
                    <div className="col-md-12 col-12 col-sm-6">
                      <CalendarIcon />
                      <span className="mx-1">{dateFormat(item.date)}</span>
                    </div>
                  </td>
                  <td className="col-md-2 col-4 col-sm-4 text-center">
                    {item.dr !== 0 ? (
                      <p className="text-primary">{currencyFormat(item.dr)}</p>
                    ) : null}
                  </td>
                  <td className="col-md-2 col-4 col-sm-4 text-center">
                    {item.cr !== 0 ? (
                      <p className="text-primary">{currencyFormat(item.cr)}</p>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5">
          Your payment terms were for <strong>30 days,</strong> and this period has already been {" "}
          <strong>exceeded</strong>. Would you like me to send another payment reminder to{" "}
          {contactData?.name} ? Last reminder was sent 5 days
          ago, (read on the same day).
        </p>
      </div>
      <form
        id="searchBarContainer"
        noValidate
        className="align-items-center mt-5"
      >
        <label htmlFor="searchBar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
          <span className="visually-hidden">Search</span>
        </label>
        <input
          id="searchBar"
          className=""
          type="search"
          placeholder="Yes send reminder again..."
        />
      </form>
      <p className="mt-1 text-muted">
        Just type in any keyword and see the magic.
      </p>
    </>
  );
};

export default LedgerDetail;
