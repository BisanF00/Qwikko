import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStores } from "../storesSlice";
import StoreCard from "../components/StoreCard";

const StoresPage = () => {
  const dispatch = useDispatch();
  const { allStores, loading, error } = useSelector(state => state.stores);

  useEffect(() => {
    dispatch(fetchStores());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {allStores.map(store => <StoreCard key={store.id} store={store} />)}
    </div>
  );
};

export default StoresPage;
