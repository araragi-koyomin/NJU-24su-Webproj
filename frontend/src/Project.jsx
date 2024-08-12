import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

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
  const [selectedTask, setSelectedTask] = useState({
    id: '',
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
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState([])
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [newDescription, setDescription] = useState('')
  const navigate = useNavigate();
  const location = useLocation();
  const { password } = location.state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);


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
  }, [username, projectName, selectedTask]);

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
        console.error('Error deleting task: ', e);
      });
  };

  const selectTask = (task) => {
    console.log(task)
    setSelectedTask(task);
    setComments(task.comments);
    setDescription(task.description);
    setTaskShowModal(true);
  }

  const saveComment = (taskId) => {
    axios.post(`http://127.0.0.1:7002/project/${username}/${projectName}/tasks/${taskId}/comments`, {
      comment: newComment // 确保它是一个字符串
    })
      .then(response => {
        if (response.data.success) {
          console.log('Add new comment successfully');
          setComments(prev => [...prev, newComment]);  // 更新前端状态
          setSelectedTask(prev => ({
            ...prev,
            comments: [...prev.comments, newComment]  // 更新选中的任务
          }));
          setNewComment('');  // 清空输入框
        } else {
          console.log("评论添加失败");
        }
      })
      .catch(e => {
        console.error('Error adding comment: ', e);
      });
  };

  const saveDescription = (taskId) => {
    axios.post(`http://127.0.0.1:7002/project/${username}/${projectName}/tasks/${taskId}/description`, {
      description: newDescription
    })
      .then(response => {
        if (response.data.success) {
          setSelectedTask(prev => ({
            ...prev,
            description: newDescription  // 更新 selectedTask 中的描述
          }));
          setIsEditingDescription(false); // 保存后切换回查看模式
        } else {
          console.log("更新介绍失败");
        }
      })
      .catch(e => {
        console.error('Error updating description: ', e);
      });
  };

  const handleCategoryChange = (taskId, newCategory) => {
    console.log('Changing category for task:', taskId, 'to:', newCategory);

    axios.post(`http://127.0.0.1:7002/project/${username}/${projectName}/tasks/${taskId}/category`, {
      category: newCategory
    })
      .then(response => {
        if (response.data.success) {
          console.log('Task category updated successfully!');
          setSelectedTask(prev => ({
            ...prev,
            category: newCategory
          }));
        } else {
          console.log('Failed to update task category');
        }
      })
      .catch(error => {
        console.error('Error updating task category:', error);
      });
  };

  const handleUsernameClick = () => {
    if (username && password) {
      navigate(`/dashboard/${username}`, { state: { username, password } });
    } else {
      console.error('Username or password is missing');
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    console.log('Selected file:', file);  // 打印选择的文件信息
    console.log('FormData:', formData);  // 打印FormData对象以确保文件已正确添加

    setUploading(true);

    axios.post(`http://127.0.0.1:7002/project/${username}/${projectName}/tasks/${selectedTask.id}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        console.log('Request headers:', response.config.headers); // 打印请求头
        if (response.data.success) {
          console.log('File uploaded successfully!');
          setSelectedTask(prev => ({
            ...prev,
            attachments: [...prev.attachments, {
              filename: file.name,
              url: response.data.url,
              uploadAt: new Date().toISOString(),
            }]
          }));
          setUploading(false);
        } else {
          console.error('Failed to upload file');
          setUploadError('Failed to upload file');
          setUploading(false);
        }
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        setUploadError('Error uploading file');
        setUploading(false);
      });
  };

  const handleFileDownload = (attachment) => {
    // 对每一部分路径进行编码
    const encodedUsername = encodeURIComponent(username);
    const encodedProjectName = encodeURIComponent(projectName);
    const encodedTaskId = encodeURIComponent(selectedTask.id);
    const encodedFilename = encodeURIComponent(attachment.filename);

    // 构建并清理URL
    const url = `/uploads/${encodedUsername}/${encodedProjectName}/${encodedTaskId}/${encodedFilename}`;
    const cleanUrl = url.replace(/\/+/g, '/');

    // 创建一个隐藏的链接来触发下载
    const link = document.createElement('a');
    link.href = `http://127.0.0.1:7002${cleanUrl}`;
    link.download = attachment.filename;
    link.click();
  };





  return (
    <div className="container mx-auto p-4">
      <div className='flex justify-between'>
        <h1 className="text-3xl font-bold mb-4 mt-10">{projectName}</h1>
        {/* <h2 className='text-l font-bold mb-4 mt-10'>{username}</h2> */}
        <button
          className="w-12 h-12 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600"
          onClick={handleUsernameClick}
        >
          {username}
        </button>
      </div>
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

      {/* 新建任务 悬浮窗 */}
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
          <div ref={modalRef} className="bg-white p-8 rounded-lg shadow-lg w-2/3 max-w-4xl h-3/4 overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedTask.name}</h2>
                <select
                  className="w-full border border-gray-300 rounded p-2"
                  value={selectedTask ? selectedTask.category : ''}
                  onChange={(e) => {
                    handleCategoryChange(selectedTask.id, e.target.value);
                  }}
                >
                  <option value="todo">Todo</option>
                  <option value="doing">Doing</option>
                  <option value="done">Done</option>
                </select>

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
              <div className='flex justify-between items-center'>
                <h3 className="text-lg font-semibold mb-2">描述</h3>
                <button
                  className='text-gray-500 hover:text-gray-700'
                  onClick={() => setIsEditingDescription(!isEditingDescription)}
                >
                  {isEditingDescription ? "取消" : "编辑"}
                </button>
              </div>
              {isEditingDescription ? (
                <>
                  <textarea
                    className='w-full border border-gray-300 rounded p-2'
                    value={newDescription}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <button
                    className='mt-1 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm'
                    onClick={() => saveDescription(selectedTask.id)}
                  >
                    {console.log(newDescription)}
                    保存
                  </button>
                </>
              ) : (
                <p style={{ whiteSpace: 'pre-wrap' }}>{selectedTask.description}</p>
              )}

            </div>

            {/* Comments */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">评论</h3>
              <div className='mt-4'>
                <textarea
                  className='w-full border border-gray-300 rounded p-2'
                  placeholder='添加评论'
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  className='mt-1 mb-4 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm'
                  onClick={() => saveComment(selectedTask.id)}
                >
                  保存
                </button>
              </div>
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

            {/* Attachment */}
            <div className='mb-6'>
              <div className='flex justify-between items-center'>
                <h3 className='text-lg font-semibold mb-2'>附件</h3>
                <label className="cursor-pointer text-gray-500 hover:text-gray-700">
                  上传
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploading}  // 在上传中禁用上传按钮
                  />
                </label>
                {uploading && <p>Uploading...</p>}
                {uploadError && <p className="text-red-500">{uploadError}</p>}
              </div>
              <ul className="list-disc list-inside space-y-2">
                {selectedTask.attachments?.map((attachment, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{attachment.filename}</span>
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleFileDownload(attachment)}
                    >
                      下载
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
