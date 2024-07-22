import { useContext } from "react";
import { useSetHeadingBackButtonToggle } from "../providers/headingContext";
import { SearchContext } from "../providers/searchContext";

const LedgerDetail = () => {
  const { data: contactData } = useContext(SearchContext);
  // const navigate = useNavigate();

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
