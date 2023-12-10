import React from "react";
import { useForm } from "react-hook-form";
import { addSubTask } from "../indexedDB";


const SubTaskModel = ({taskId})=>{
const { register, handleSubmit, reset } = useForm();
const onSubmit = (data) => {
    debugger;
    addSubTask(taskId, data)
      .then(() => {
        reset();
      })
      .catch((error) => {
       
        console.error("Error adding subtask:", error);
      });
  };
    return(
        <div
        className="modal fade"
        id="SubTask"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Add Sub Task
                </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="taskTitle">Task Title:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="taskTitle"
                    placeholder="Enter task title"
                    {...register("taskTitle", { required: true })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="taskDescription">Task Description:</label>
                  <textarea
                    className="form-control"
                    id="taskDescription"
                    rows="4"
                    placeholder="Enter task description"
                    {...register("taskDescription", { required: true })}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="dueDate">Due Date:</label>
                  <input
                    type="date"
                    className="form-control"
                    id="dueDate"
                    {...register("dueDate", { required: true })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
}

export default SubTaskModel