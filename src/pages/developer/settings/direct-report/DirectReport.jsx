import React from "react";
import { FaPlus } from "react-icons/fa";
import Layout from "../../Layout";
import { StoreContext } from "../../../../store/StoreContext";
import { setIsAdd } from "../../../../store/StoreAction";
import DirectReportList from "./DirectReportList";
import ModalAddDirectReport from "./ModalAddDirectReport";

const DirectReport = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  const handleAdd = () => {
    dispatch(setIsAdd(true));
    setItemEdit(null);
  };

  return (
    <>
      <Layout menu="settings" submenu="direct report">
        <div className="flex items-center justify-between w-full">
          <h1>Direct Report</h1>
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
          <DirectReportList itemEdit={itemEdit} setItemEdit={setItemEdit} />
        </div>
      </Layout>

      {store.isAdd && <ModalAddDirectReport itemEdit={itemEdit} />}
    </>
  );
};

export default DirectReport;
