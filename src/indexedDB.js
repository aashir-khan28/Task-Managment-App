const DB_NAME = "TaskDatabase";
const DB_VERSION = 1;
const OBJECT_STORE_NAME = "tasks";

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      reject(`Database error: ${event.target.errorCode}`);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        const objectStore = db.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("taskTitle", "taskTitle", { unique: false });
        objectStore.createIndex("dueDate", "dueDate", { unique: false });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
}
function addSubTask( taskId, subTask) {
  debugger;
  return new Promise(async (resolve, reject) => {
    const db = await openDatabase();
    const transaction = db.transaction([OBJECT_STORE_NAME], "readwrite");
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

    const request = objectStore.get(taskId);

    request.onsuccess = (event) => {
      const task = event.target.result;

      if (!task) {
        reject(`Task with ID ${taskId} not found.`);
        return;
      }

      if (!task.subTasks) {
        task.subTasks = []; 
      }

      task.subTasks.push({subTaskTitle:subTask.taskTitle, taskDescription: subTask.taskDescription, dueDate:subTask.dueDate });
debugger;
      const updateRequest = objectStore.put(task);

      updateRequest.onsuccess = () => {
        resolve('Subtask added successfully.');
      };

      updateRequest.onerror = (updateEvent) => {
        reject(`Error adding subtask: ${updateEvent.target.errorCode}`);
      };
    };

    request.onerror = (event) => {
      reject(`Error fetching task with ID ${taskId}: ${event.target.errorCode}`);
    };
  });
}

function addTask(task) {
  return new Promise(async (resolve, reject) => {
    const db = await openDatabase();
    const transaction = db.transaction([OBJECT_STORE_NAME], "readwrite");
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

    const request = objectStore.add(task);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(`Error adding task: ${event.target.errorCode}`);
    };
  });
}

function getAllTasks() {
  return new Promise(async (resolve, reject) => {
    const db = await openDatabase();
    const transaction = db.transaction([OBJECT_STORE_NAME], "readonly");
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

    const request = objectStore.getAll();

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(`Error getting tasks: ${event.target.errorCode}`);
    };
  });
}
function deleteTask(taskId) {
  return new Promise(async (resolve, reject) => {
    const db = await openDatabase();
    const transaction = db.transaction([OBJECT_STORE_NAME], "readwrite");
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

    const request = objectStore.delete(taskId);

    request.onsuccess = () => {
      resolve('Task deleted successfully.');
    };

    request.onerror = (event) => {
      reject(`Error deleting task: ${event.target.errorCode}`);
    };
  });
}
function deleteSubTask(taskId, subTaskIndex) {
  return new Promise(async (resolve, reject) => {
    const db = await openDatabase();
    const transaction = db.transaction([OBJECT_STORE_NAME], "readwrite");
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

    const request = objectStore.get(taskId);

    request.onsuccess = (event) => {
      const task = event.target.result;

      if (!task) {
        reject(`Task with ID ${taskId} not found.`);
        return;
      }

      if (!task.subTasks || !Array.isArray(task.subTasks)) {
        reject(`Subtasks not found for Task ID ${taskId}.`);
        return;
      }

      if (subTaskIndex < 0 || subTaskIndex >= task.subTasks.length) {
        reject(`Invalid subtask index for Task ID ${taskId}.`);
        return;
      }

      task.subTasks.splice(subTaskIndex, 1); 

      const updateRequest = objectStore.put(task);

      updateRequest.onsuccess = () => {
        resolve('Subtask deleted successfully.');
      };

      updateRequest.onerror = (updateEvent) => {
        reject(`Error deleting subtask: ${updateEvent.target.errorCode}`);
      };
    };

    request.onerror = (event) => {
      reject(`Error fetching task with ID ${taskId}: ${event.target.errorCode}`);
    };
  });
}
function editTask(taskId, updatedTask) {
  return new Promise(async (resolve, reject) => {
    const db = await openDatabase();
    const transaction = db.transaction([OBJECT_STORE_NAME], "readwrite");
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

    const request = objectStore.get(taskId);

    request.onsuccess = (event) => {
      const task = event.target.result;

      if (!task) {
        reject(`Task with ID ${taskId} not found.`);
        return;
      }

      task.taskTitle = updatedTask.taskTitle || task.taskTitle;
      task.taskDescription = updatedTask.taskDescription || task.taskDescription;
      task.dueDate = updatedTask.dueDate || task.dueDate;

      const updateRequest = objectStore.put(task);

      updateRequest.onsuccess = () => {
        resolve('Task updated successfully.');
      };

      updateRequest.onerror = (updateEvent) => {
        reject(`Error updating task: ${updateEvent.target.errorCode}`);
      };
    };

    request.onerror = (event) => {
      reject(`Error fetching task with ID ${taskId}: ${event.target.errorCode}`);
    };
  });
}
export { addTask, getAllTasks, addSubTask,deleteTask,deleteSubTask , editTask};
