import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { comment } from 'postcss';

const Project = () => {

  const modalRef = useRef(null);  // 创建一个ref来引用悬浮窗
  const { username, projectName } = useParams();
  const [project, setProject] = useState(null);
  const [taskCategories, setTaskCategories] = useState({
    todo: [],
    doing: [],
    done: []
  });
  const [newlyShowModal, setNewlyShowModal] = useState(false);
  const [taskShowModal, setTaskShowModal] = useState(false);
  const [selectedTask, setSelctedTask] = useState({
    name: '',
    description: '',
    comments: [],
    category: ''
  })
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    comments: [],
    category: 'todo'
  })


  useEffect(() => {
    axios.get(`http://127.0.0.1:7002/project/${username}/${projectName}`)
      .then(response => {
        if (response.data.success) {
          setProject(response.data.project);
        } else {
          console.log("没有项目数据");
        }
      })
      .catch(error => {
        console.error('Error fetching project data:', error);
      });

    axios.get(`http://127.0.0.1:7002/project/${username}/${projectName}/tasks`)
      .then(response => {
        if (response.data.success) {
          const tasks = response.data.tasks.map(task => ({
            ...task,
            id: task.id.toString(),
          }));
          console.log(...tasks)
          // 假设任务有一个 category 属性
          const categories = {
            todo: tasks.filter(task => task.category === 'todo'),
            doing: tasks.filter(task => task.category === 'doing'),
            done: tasks.filter(task => task.category === 'done')
          };
          // console.log(categories)
          setTaskCategories(categories);
        } else {
          console.log("没有任务数据");
        }
      })
      .catch(error => {
        console.error('Error fetching tasks data:', error);
      });
  }, [username, projectName]);

  useEffect(() => {
    if (taskShowModal) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [taskShowModal]);  // 仅依赖于 showModal 状态

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setTaskShowModal(false);  // 点击悬浮窗外部时关闭悬浮窗
    }
  };

  const addTask = (category) => {
    setNewTask({ ...newTask, category });
    setNewlyShowModal(true);
  };

  const saveTask = () => {
    const taskData = {
      ...newTask,
      id: Date.now().toString() // todo: 修改id方法
    }

    axios.post(`http://127.0.0.1:7002/project/${username}/${projectName}/tasks`, taskData)
      .then(response => {
        if (response.data.success) {
          console.log("Task saved successfully!"); // 调试信息
          setTaskCategories(prev => ({
            ...prev,
            [taskData.category]: [...prev[taskData.category], taskData]
          }));
          setNewlyShowModal(false);
          setNewTask({
            name: '',
            description: '',
            comments: [],
            category: 'todo'
          });
        } else {
          console.log("任务添加失败");
        }
      })
      .catch(error => {
        console.error('Error saving task: ', error)
      })
  }

  const removeTask = (category, taskId) => {
    axios.delete(`http://127.0.0.1:7002/project/${username}/${projectName}/tasks/${taskId}`)
      .then(response => {
        if (response.data.success) {
          console.log("Task delteted successfully!");
          setTaskCategories(prev => ({
            ...prev,
            [category]: prev[category].filter(task => task.id !== taskId)
          }));
        } else {
          console.log("任务删除失败");
        }
      })
      .catch(e => {
        console.log('Error deleting task: ', e);
      });
  };

  const selectTask = (task) => {
    console.log(task)
    setSelctedTask(task);
    setTaskShowModal(true);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{projectName}</h1>
      {project && (
        <div className="mb-8">
          <h2>{project.description}</h2>
        </div>
      )}
      <div className="flex space-x-4 items-start">
        {Object.keys(taskCategories).map(category => (
          <div key={category} className="bg-gray-200 p-4 rounded-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4 capitalize">{category}</h3>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
              onClick={() => addTask(category)}>
              添加任务
            </button>
            <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
              {taskCategories[category].map(task => (
                <div
                  key={task.id}
                  className="bg-gray-100 p-3 rounded flex justify-between items-center shadow">
                  <p 
                    onClick={() => selectTask(task)}
                  >{task.name}
                  </p>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => removeTask(category, task.id)}>
                    删除
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 新建项目 悬浮窗 */}
      {newlyShowModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">添加新任务</h2>
            <label className="block mb-2">
              任务名称:
              <input
                type="text"
                className="border p-2 w-full"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              />
            </label>
            <label className="block mb-2">
              描述:
              <input
                type="text"
                className="border p-2 w-full"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </label>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={saveTask}>
                保存任务
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setNewlyShowModal(false)}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 项目查看 悬浮窗 */}
      {taskShowModal && selectedTask && (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white p-8 rounded-lg shadow-lg w-2/3 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{selectedTask.name}</h2>
            <p className="text-sm text-gray-600">{selectedTask.category}</p>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setTaskShowModal(false)}  // 关闭悬浮窗的按钮
          >
            关闭
          </button>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">描述</h3>
          <p>{selectedTask.description}</p>
        </div>

        {/* Comments */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">评论</h3>
          <ul className="list-disc list-inside space-y-2">
            {selectedTask.comments.length > 0 ? (
              selectedTask.comments.map((comment, index) => (
                <li key={index} className="text-gray-700">{comment}</li>
              ))
            ) : (
              <li className="text-gray-500">没有评论</li>
            )}
          </ul>
        </div>

        {/* 你可以在这里添加更多的元素，如标签、附件等 */}
      </div>
    </div>
  )}

    </div>
  );
};

export default Project;
