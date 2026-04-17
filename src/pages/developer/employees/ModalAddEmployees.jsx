import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React from "react";
import { FaTimes } from "react-icons/fa";
import * as Yup from "yup";
import { queryData } from "../../../functions/custom-hooks/queryData";
import { apiVersion } from "../../../functions/functions-general";
import ModalWrapperSide from "../../../partials/modals/ModalWrapperSide";
import {
  setError,
  setIsAdd,
  setMessage,
  setSuccess,
} from "../../../store/StoreAction";
import { StoreContext } from "../../../store/StoreContext";
import {
  InputText,
  InputTextArea,
} from "../../../components/form-input/FormInputs";
import MessageError from "../../../partials/MessageError";
import ButtonSpinner from "../../../partials/spinners/ButtonSpinner";

const ModalAddEmployees = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);

  const QueryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(
        itemEdit
          ? `${apiVersion}/controllers/developers/employees/employees.php?id=${itemEdit.employee_aid}` // update records
          : `${apiVersion}/controllers/developers/employees/employees.php`, // create records
        itemEdit
          ? "put" // put if update a records
          : "post", // and post if create a new record
        values,
      ),
    onSuccess: (data) => {
      QueryClient.invalidateQueries({ queryKey: ["employees"] });

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
    employee_first_name: itemEdit ? itemEdit.employee_first_name : "",
    employee_middle_name: itemEdit ? itemEdit.employee_middle_name : "",
    employee_last_name: itemEdit ? itemEdit.employee_last_name : "",
    employee_email: itemEdit ? itemEdit.employee_email : "",

    employee_first_name_old: itemEdit ? itemEdit.employee_first_name : "",
    employee_middle_name_old: itemEdit ? itemEdit.employee_middle_name : "",
    employee_last_name_old: itemEdit ? itemEdit.employee_last_name : "",
    employee_email_old: itemEdit ? itemEdit.employee_email : "",
  };
  const yupSchema = Yup.object({
    employee_first_name: Yup.string().trim().required(),
    employee_middle_name: Yup.string().trim().required(),
    employee_last_name: Yup.string().trim().required(),
    employee_email: Yup.string().trim().required(),
  });

  const handleClose = () => {
    dispatch(setIsAdd(false));
  };

  React.useEffect(() => {
    dispatch(setError(false));
  }, []);

  return (
    <>
      <ModalWrapperSide
        handleClose={handleClose}
        className="transition-all ease-in-out transform duration-200"
      >
        {/* HEADER */}
        <div className="modal-header relative mb-4">
          <h3 className="text-dark text-sm">
            {itemEdit ? "Update" : "Add"} Employee
          </h3>
          <button
            type="button"
            className="absolute top-0 right-4"
            onClick={handleClose}
          >
            <FaTimes />
          </button>
        </div>
        {/* BODY */}
        <div className="modal-body">
          <Formik
            initialValues={initVal}
            validationSchema={yupSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
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
                        <InputText
                          label="First Name"
                          name="employee_first_name"
                          type="text"
                          disabled={mutation.isPending}
                        />
                      </div>
                      <div className="relative mb-6">
                        <InputText
                          label="Middle Name"
                          name="employee_middle_name"
                          type="text"
                          disabled={mutation.isPending}
                        />
                      </div>
                      <div className="relative mb-6">
                        <InputText
                          label="Last Name"
                          name="employee_last_name"
                          type="text"
                          disabled={mutation.isPending}
                        />
                      </div>
                      <div className="relative mb-6">
                        <InputText
                          label="Email Address"
                          name="employee_email"
                          type="text"
                          disabled={mutation.isPending}
                        />
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
    </>
  );
};

export default ModalAddEmployees;
