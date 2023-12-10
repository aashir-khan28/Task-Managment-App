import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { addTask, deleteSubTask, deleteTask, getAllTasks, editTask } from "./indexedDB";
import SubTaskModel from "./Component/SubtaskModel";

const Tasks = () => {
  const { register, handleSubmit, reset } = useForm();
  const [tasks, setTasks] = useState([]);
  const [taskId, setTaskId] = useState(null);
  const [showSubtasks, setShowSubtasks] = useState({});
  const [editTaskData, setEditTaskData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const onSubmit = async (data) => {
    debugger;
    if (isEditing && editTaskData) {
      try {
        await editTask(editTaskData, data);
        const updatedTasks = await getAllTasks();
        setTasks(updatedTasks);
        setIsEditing(false);
        setEditTaskData(null);
      } catch (error) {
        console.error(error);
      }
    } else {
      const newTask = {
        taskTitle: data.taskTitle,
        taskDescription: data.taskDescription,
        dueDate: data.dueDate,
        subTasks: [],
      };

      try {
        await addTask(newTask);
        const updatedTasks = await getAllTasks();
        setTasks(updatedTasks);
        reset();
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const allTasks = await getAllTasks();
      setTasks(allTasks);
    };

    fetchTasks();
  }, [tasks]);

  const toggleSubtasks = (id) => {
    setShowSubtasks((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };
  const deleteTaskHandler = async (taskId) => {
    try {
      await deleteTask(taskId);
      const updatedTasks = await getAllTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSubTaskHandler = async (taskId, subTaskIndex) => {
    try {
      await deleteSubTask(taskId, subTaskIndex);
      const updatedTasks = await getAllTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error(error);
    }
  };
  const editTaskHandler = (task) => {
    setEditTaskData(task);
    setIsEditing(true);
  };

  return (
    <>
      <div className="d-flex justify-content-end mr-5">
        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
          Add New Task
        </button>
      </div>
      <div className="mt-3">
        <h2 className="mb-4">Tasks</h2>
        <ul className="list-group">
          {tasks.map((task, index) => (
            <li key={index} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">Title: {task.taskTitle}</h5>
                  <p className="mb-1">Description: {task.taskDescription}</p>
                </div>
                <span className="badge bg-primary">Due Date: {task.dueDate}</span>
                <div className="d-flex">
                  <button className="btn btn-success me-2" onClick={() => toggleSubtasks(task.id)}>
                    Show Subtasks
                  </button>
                  <button
                    className="btn btn-primary me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#SubTask"
                    onClick={() => setTaskId(task.id)}
                  >
                    Add Sub Task
                  </button>
                  <button
                    className="btn btn-success me-2"
                    onClick={() => editTaskHandler(task.id)}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => deleteTaskHandler(task.id)}>
                    Delete
                  </button>
                </div>
              </div>
              {showSubtasks[task.id] && (
                <div>
                  <strong>Sub Tasks:</strong>
                  <ul>
                    {task.subTasks.map((subTask, subIndex) => (
                      <li key={subIndex} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h5 className="mb-1">Title: {subTask.subTaskTitle}</h5>
                            {/* Add other subtask details here */}
                          </div>
                          <span className="badge bg-primary">Due Date: {subTask.dueDate}</span>
                          <div className="d-flex">
                            <button
                              className="btn btn-danger"
                              onClick={() => deleteSubTaskHandler(task.id, subTask.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="editTaskModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="editTaskModalLabel">
                  {isEditing ? "Edit Task" : "Add New Task"}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    setIsEditing(false);
                    setEditTaskData(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="taskTitle">Task Title:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="taskTitle"
                    placeholder="Enter task title"
                    defaultValue={editTaskData ? editTaskData.taskTitle : ""}
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
                    defaultValue={editTaskData ? editTaskData.taskDescription : ""}
                    {...register("taskDescription", { required: true })}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="dueDate">Due Date:</label>
                  <input
                    type="date"
                    className="form-control"
                    id="dueDate"
                    defaultValue={editTaskData ? editTaskData.dueDate : ""}
                    {...register("dueDate", { required: true })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    setIsEditing(false);
                    setEditTaskData(null);
                  }}
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                  {isEditing ? "Save Changes" : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <SubTaskModel taskId={taskId}></SubTaskModel>
    </>
  );
};

export default Tasks;
