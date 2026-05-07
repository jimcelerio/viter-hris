import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React from "react";
import { FaTimes } from "react-icons/fa";
import * as Yup from "yup";
import useQueryData from "../../../../functions/custom-hooks/useQueryData";
import { queryData } from "../../../../functions/custom-hooks/queryData";
import { apiVersion } from "../../../../functions/functions-general";
import MessageError from "../../../../partials/MessageError";
import ModalWrapperSide from "../../../../partials/modals/ModalWrapperSide";
import ButtonSpinner from "../../../../partials/spinners/ButtonSpinner";
import {
  setError,
  setIsAdd,
  setMessage,
  setSuccess,
} from "../../../../store/StoreAction";
import { StoreContext } from "../../../../store/StoreContext";
import { InputSelect } from "../../../../components/form-input/FormInputs";

const ModalAddDirectReport = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);

  const { isLoading, data: dataEmployees } = useQueryData(
    `${apiVersion}/controllers/developers/employees/employees.php`,
    "get",
    "employees-for-direct-report",
    {}
  );

  const employeeOptions = dataEmployees?.data?.filter(
    (item) =>
      item.employee_is_active == 1 ||
      item.employee_aid == itemEdit?.direct_report_subordinate ||
      item.employee_aid == itemEdit?.direct_report_supervisor
  );

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(
        itemEdit
          ? `${apiVersion}/controllers/developers/settings/direct-report/direct-report.php?id=${itemEdit.direct_report_aid}`
          : `${apiVersion}/controllers/developers/settings/direct-report/direct-report.php`,
        itemEdit ? "put" : "post",
        values
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["direct-report"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-employees"] });

      if (data.success) {
        dispatch(setSuccess(true));
        dispatch(setMessage(`Successfully ${itemEdit ? "updated" : "added"}`));
        dispatch(setIsAdd(false));
      }

      if (data.success == false) {
        dispatch(setError(true));
        dispatch(setMessage(data.error));
      }
    },
  });

  const initVal = {
    ...itemEdit,
    direct_report_subordinate: itemEdit ? itemEdit.direct_report_subordinate : "",
    direct_report_supervisor: itemEdit ? itemEdit.direct_report_supervisor : "",
  };

  const yupSchema = Yup.object({
    direct_report_subordinate: Yup.string().trim().required("Subordinate is required"),
    direct_report_supervisor: Yup.string().trim().required("Supervisor is required"),
  });

  const handleClose = () => {
    dispatch(setIsAdd(false));
  };

  React.useEffect(() => {
    dispatch(setError(false));
  }, []);

  return (
    <ModalWrapperSide
      handleClose={handleClose}
      className="transition-all ease-in-out transform duration-200"
    >
      <div className="modal-header relative mb-4">
        <h3 className="text-dark text-sm">
          {itemEdit ? "Update" : "Add"} Direct Report
        </h3>
        <button
          type="button"
          className="absolute top-0 right-4"
          onClick={handleClose}
        >
          <FaTimes />
        </button>
      </div>

      <div className="modal-body">
        <Formik
          initialValues={initVal}
          validationSchema={yupSchema}
          onSubmit={async (values) => {
            dispatch(setError(false));
            mutation.mutate(values);
          }}
        >
          {(props) => {
            return (
              <Form className="h-full">
                <div className="modal-form-container">
                  <div className="modal-container">
                    <div className="relative mb-6">
                      <InputSelect
                        label="Subordinate"
                        name="direct_report_subordinate"
                        disabled={mutation.isPending || isLoading}
                      >
                        <optgroup label="Select subordinate">
                          <option value="" hidden>
                            --
                          </option>
                          {employeeOptions?.map((item) => (
                            <option key={item.employee_aid} value={item.employee_aid}>
                              {item.employee_first_name} {item.employee_last_name}
                            </option>
                          ))}
                        </optgroup>
                      </InputSelect>
                    </div>

                    <div className="relative mb-6">
                      <InputSelect
                        label="Supervisor"
                        name="direct_report_supervisor"
                        disabled={mutation.isPending || isLoading}
                      >
                        <optgroup label="Select supervisor">
                          <option value="" hidden>
                            --
                          </option>
                          {employeeOptions?.map((item) => (
                            <option key={item.employee_aid} value={item.employee_aid}>
                              {item.employee_first_name} {item.employee_last_name}
                            </option>
                          ))}
                        </optgroup>
                      </InputSelect>
                    </div>

                    {store.error && <MessageError />}
                  </div>

                  <div className="modal-action">
                    <button
                      type="submit"
                      disabled={mutation.isPending || !props.dirty}
                      className="btn-modal-submit"
                    >
                      {mutation.isPending ? (
                        <ButtonSpinner />
                      ) : itemEdit ? (
                        "Save"
                      ) : (
                        "Add"
                      )}
                    </button>
                    <button
                      type="reset"
                      className="btn-modal-cancel"
                      onClick={handleClose}
                      disabled={mutation.isPending}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </ModalWrapperSide>
  );
};

export default ModalAddDirectReport;
