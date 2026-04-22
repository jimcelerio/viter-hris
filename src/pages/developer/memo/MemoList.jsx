import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import {
  FaArchive,
  FaEdit,
  FaEye,
  FaTrash,
  FaTrashRestore,
} from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import { queryDataInfinite } from "../../../functions/custom-hooks/queryDataInfinite";
import { apiVersion, formatDate } from "../../../functions/functions-general";
import Loadmore from "../../../partials/Loadmore";
import ModalArchive from "../../../partials/modals/ModalArchive";
import ModalDelete from "../../../partials/modals/ModalDelete";
import ModalRestore from "../../../partials/modals/ModalRestore";
import NoData from "../../../partials/NoData";
import SearchBar from "../../../partials/SearchBar";
import ServerError from "../../../partials/ServerError";
import FetchingSpinner from "../../../partials/spinners/FetchingSpinner";
import Status from "../../../partials/Status";
import TableLoading from "../../../partials/TableLoading";
import {
  setIsAdd,
  setIsArchive,
  setIsDelete,
  setIsRestore,
} from "../../../store/StoreAction";
import { StoreContext } from "../../../store/StoreContext";
import ModalViewMemo from "./ModalViewMemo";

const MemoList = ({ itemEdit, setItemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);

  const [page, setPage] = React.useState(1);
  const [filterData, setFilterData] = React.useState("");
  const [onSearch, setOnSearch] = React.useState(false);
  const [itemView, setItemView] = React.useState(null);
  const search = React.useRef({ value: "" });
  const { ref, inView } = useInView();
  let counter = 1;

  const {
    data: result,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["memo", search.current.value, store.isSearch, filterData],
    queryFn: async ({ pageParam = 1 }) =>
      await queryDataInfinite(
        ``,
        `${apiVersion}/controllers/developers/memo/page.php?start=${pageParam}`,
        false,
        {
          filterData,
          searchValue: search?.current?.value,
        },
        `post`
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total) {
        return lastPage.page + lastPage.count;
      }
      return;
    },
    refetchOnWindowFocus: false,
  });

  React.useEffect(() => {
    if (inView) {
      setPage((prev) => prev + 1);
      fetchNextPage();
    }
  }, [inView]);

  const handleView = (item) => {
    setItemView(item);
  };

  const handleEdit = (item) => {
    dispatch(setIsAdd(true));
    setItemEdit(item);
  };

  const handleArchive = (item) => {
    dispatch(setIsArchive(true));
    setItemEdit(item);
  };

  const handleRestore = (item) => {
    dispatch(setIsRestore(true));
    setItemEdit(item);
  };

  const handleDelete = (item) => {
    dispatch(setIsDelete(true));
    setItemEdit(item);
  };

  return (
    <>
      <div className="pt-5 pb-2 flex items-center justify-between">
        <div className="relative">
          <label htmlFor="">Status</label>
          <select
            onChange={(e) => setFilterData(e.target.value)}
            value={filterData}
          >
            <option value="">All</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
        <SearchBar
          search={search}
          dispatch={dispatch}
          store={store}
          result={result?.pages}
          isFetching={isFetching}
          setOnSearch={setOnSearch}
          onSearch={onSearch}
        />
      </div>

      <div className="relative pt-4 rounded-md">
        {status !== "pending" && isFetching && <FetchingSpinner />}
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Status</th>
              <th>Date</th>
              <th>Category</th>
              {/* <th>From</th>
              <th>To</th> */}
              <th>Memo</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!error &&
              (status == "pending" || result?.pages[0]?.count == 0) && (
                <tr>
                  <td colSpan="100%" className="p-10">
                    {status == "pending" ? (
                      <TableLoading cols={2} count={20} />
                    ) : (
                      <NoData />
                    )}
                  </td>
                </tr>
              )}

            {error && (
              <tr>
                <td colSpan="100%" className="p-10">
                  <ServerError />
                </td>
              </tr>
            )}

            {result?.pages?.map((page, key) => (
              <React.Fragment key={key}>
                {page?.data?.map((item, key) => {
                  return (
                    <tr key={key}>
                      <td>{counter++}</td>
                      <td>
                        <Status
                          text={`${
                            item.memo_is_active == 1 ? "active" : "inactive"
                          }`}
                        />
                      </td>
                      <td>{formatDate(item.memo_date, "--")}</td>
                      <td>{item.memo_category}</td>
                      {/* <td>{item.memo_from}</td>
                      <td>{item.memo_to}</td> */}
                      <td className="max-w-95 truncate">{item.memo_text}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            className="tooltip-action-table"
                            data-tooltip="View"
                            onClick={() => handleView(item)}
                          >
                            <FaEye />
                          </button>
                          {item.memo_is_active == 1 ? (
                            <>
                              <button
                                type="button"
                                className="tooltip-action-table"
                                data-tooltip="Edit"
                                onClick={() => handleEdit(item)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                type="button"
                                className="tooltip-action-table"
                                data-tooltip="Archive"
                                onClick={() => handleArchive(item)}
                              >
                                <FaArchive />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="tooltip-action-table"
                                data-tooltip="Restore"
                                onClick={() => handleRestore(item)}
                              >
                                <FaTrashRestore />
                              </button>
                              <button
                                type="button"
                                className="tooltip-action-table"
                                data-tooltip="Delete"
                                onClick={() => handleDelete(item)}
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        <div className="loadmore flex justify-center flex-col items-center pb-10">
          <Loadmore
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            result={result?.pages[0]}
            setPage={setPage}
            page={page}
            refView={ref}
            isSearchOrFilter={store.isSearch || result?.isFilter}
          />
        </div>
      </div>

      {itemView && (
        <ModalViewMemo itemView={itemView} setItemView={setItemView} />
      )}

      {store.isArchive && (
        <ModalArchive
          mysqlApiArchive={`${apiVersion}/controllers/developers/memo/active.php?id=${itemEdit.memo_aid}`}
          msg="Are you sure you want to archive this record?"
          successMsg="Successfully archived record!"
          item={itemEdit.memo_category}
          dataItem={itemEdit}
          queryKey={"memo"}
        />
      )}

      {store.isRestore && (
        <ModalRestore
          mysqlApiRestore={`${apiVersion}/controllers/developers/memo/active.php?id=${itemEdit.memo_aid}`}
          msg="Are you sure you want to restore this record?"
          successMsg="Successfully restore record!"
          item={itemEdit.memo_category}
          dataItem={itemEdit}
          queryKey={"memo"}
        />
      )}

      {store.isDelete && (
        <ModalDelete
          mysqlApiDelete={`${apiVersion}/controllers/developers/memo/memo.php?id=${itemEdit.memo_aid}`}
          msg="Are you sure you want to delete this record?"
          successMsg="Successfully deleted!"
          item={itemEdit.memo_category}
          dataItem={itemEdit}
          queryKey={"memo"}
        />
      )}
    </>
  );
};

export default MemoList;
