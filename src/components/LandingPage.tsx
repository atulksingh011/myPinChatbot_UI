import { Route, Routes, useNavigate } from "react-router-dom";
import SearchPage from "./SearchPage";
import ContactDetail from "./ContactDetail";
import { HeadingContext } from "../providers/headingContext";
import { useContext } from "react";
import LedgerDetail from "./LedgerDetail";

const LandingPage = () => {
  const navigate = useNavigate();
  const { backButton } = useContext(HeadingContext);

  return (
    <div className="main container py-3" style={{ maxWidth: "550px" }}>
      <div className="row">
        <div className="col-md-12">
          <div className="position-relative">
            <div className="position-absolute top-50 start-0 translate-middle-y">
              {backButton && (
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(-1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#fff"
                    className="bi bi-chevron-left"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                    />
                  </svg>
                </button>
              )}

              {/* // ) : (
              //   <button className="btn btn-primary">
              //     <svg
              //       xmlns="http://www.w3.org/2000/svg"
              //       width="18"
              //       height="18"
              //       fill="#fff"
              //       className="bi bi-list"
              //       viewBox="0 0 16 16"
              //     >
              //       <path
              //         fillRule="evenodd"
              //         d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
              //       />
              //     </svg>
              //   </button>
              // )} */}
            </div>
            {/* <h1 className="bold text-center">myPin.ai</h1> */}

            <div
              className="d-flex flex-column align-items-center justify-content-center"
              style={{ marginTop: "0px" }}
            >
              <img
                src="src/assets/myPin-logo.png"
                className="img-fluid"
                style={{ height: "70px" }}
              />
            </div>
          </div>
        </div>
        <div
          className="col-md-12 py-5 px-3 mx-auto"
          style={{ maxWidth: "500px" }}
        >
          {
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/contact" element={<ContactDetail />} />
              <Route path="/ledger" element={<LedgerDetail />} />
              {/* <Route index element={<Home />} /> */}
              {/* <Route path="about" element={<About />} />
                <Route path="dashboard" element={<Dashboard />} /> */}

              {/* Using path="*"" means "match anything", so this route
						acts like a catch-all for URLs that we don't have explicit
						routes for. */}
              {/* <Route path="*" element={<NoMatch />} /> */}
              {/* </Route> */}
            </Routes>
          }
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
