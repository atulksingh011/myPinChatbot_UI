import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/authContext";
import { useSetHeadingBackButtonToggle } from "../providers/headingContext";
import { SearchContext } from "../providers/searchContext";

const SearchPage = () => {
  const { handleSubmit, register, watch, setValue, setFocus } = useForm<any>();

  const {loading, getData} = useContext(SearchContext);
  const [lastSearchValue, setLastSearchValue] = useState("");
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);
  useSetHeadingBackButtonToggle(false);

  const showClearButton = !!watch("search");

  const onSubmit = async ({ search }: any) => {
    if (loading || lastSearchValue === search) {
      return;
    }

    const route = await getData(search);

    setLastSearchValue(search);
    navigate(`/${route}`);
  };
  return (
    <>
      <p className="fs-3 mb-1">
        Hi <span className="text-capitalize">{user?.name}</span>,
      </p>
      <p className="fs-5">How can we help you?</p>
      <form
        id="searchBarContainer"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="align-items-center"
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
          placeholder="Search..."
          {...register("search")}
          autoFocus
        />
        {loading ? (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          showClearButton && (
            <button
              type="button"
              className="btn btn-link"
              onClick={() => {
                setValue("search", "");
                setFocus("search");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-x-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
              </svg>
            </button>
          )
        )}
      </form>
      <p className="mt-1 text-muted">
        Just type in any keyword and see the magic.
      </p>
    </>
  );
};

export default SearchPage;
