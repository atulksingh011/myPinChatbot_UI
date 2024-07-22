import { ReactElement, useContext } from "react";
import { useSetHeadingBackButtonToggle } from "../providers/headingContext";
import { SearchContext } from "../providers/searchContext";
import { useNavigate } from "react-router-dom";

const LedgerDetail = () => {
  const { data: contactData } = useContext(SearchContext);
  const navigate = useNavigate();

  useSetHeadingBackButtonToggle(true);

  return (
    <>
      <p className="fs-3 mb-1">
        Showing {contactData?.name}'s Ledger?
      </p>
    </>
  );
};

export default LedgerDetail;

const ActionButton = ({
  icon,
  text,
  action,
}: {
  icon: ReactElement;
  text: string;
  action?: () => void;
}) => {
  return (
    <button
      className="btn btn-outline-primary border-0"
      style={{ maxWidth: "120px" }}
      onClick={() => action?.()}
    >
      <div
        className="rounded-circle border border-2 align-items-center border d-flex justify-content-center rounded-circle mx-auto mb-2"
        style={{ height: "50px", width: "50px" }}
      >
        {icon}
      </div>
      {text}
    </button>
  );
};
