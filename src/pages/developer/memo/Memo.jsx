import React from "react";
import { FaPlus } from "react-icons/fa";
import Layout from "../Layout";
import { StoreContext } from "../../../store/StoreContext";
import { setIsAdd } from "../../../store/StoreAction";
import MemoList from "./MemoList";
import ModalAddMemo from "./ModalAddMemo";

const Memo = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  const handleAdd = () => {
    dispatch(setIsAdd(true));
    setItemEdit(null);
  };

  return (
    <>
      <Layout menu="memo">
        <div className="flex items-center justify-between w-full">
          <h1>Memo</h1>
          <div>
            <button
              type="button"
              className="flex items-center gap-1 hover:underline"
              onClick={handleAdd}
            >
              <FaPlus className="text-primary" />
              add
            </button>
          </div>
        </div>

        <div>
          <MemoList itemEdit={itemEdit} setItemEdit={setItemEdit} />
        </div>
      </Layout>

      {store.isAdd && <ModalAddMemo itemEdit={itemEdit} />}
    </>
  );
};

export default Memo;
