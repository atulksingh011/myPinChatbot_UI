import { createContext, useState } from "react";
import { getContact } from "../apis";

export enum SEARCH_TYPE {
  product = "product",
  contact = "contact",
}

export const SearchContext = createContext<{
  type: SEARCH_TYPE;
  data: any;
  loading: boolean;
  getData: (data: string) => void;
}>({
  type: SEARCH_TYPE.contact,
  data: null,
  loading: false,
  getData: () => {},
});

const SearchProvider = ({ children }: any) => {
  const [type, setType] = useState(SEARCH_TYPE.contact);
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getData = async (searchText: string) => {
    if (searchText.indexOf("product") !== -1) {
      setSearch(searchText.replace(/product[^ ]*/, "").trim());
      setType(SEARCH_TYPE.product);
      // setData(await )
      return SEARCH_TYPE.product;
    } else {
      const contactName = searchText.trim();
      setSearch(contactName);
      setType(SEARCH_TYPE.contact);
      setLoading(true);
      const response = await getContact(contactName);
      setData(response.data?.[0]);
      setLoading(false);
      return SEARCH_TYPE.contact;
    }
  };

  return (
    <SearchContext.Provider value={{ type, data, loading, getData }}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
