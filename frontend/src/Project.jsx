import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Project = () => {
  const { username, projectName } = useParams();
  const [project, setProject] = useState(null);
  const [taskCategories, setTaskCategories] = useState({
    todo: [],
    doing: [],
    done: []
  });

  useEffect(() => {
    console.log(`Fetching project: ${username}/${projectName}`);
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
          // 假设任务有一个 category 属性
          const categories = {
            todo: tasks.filter(task => task.category === 'todo'),
            doing: tasks.filter(task => task.category === 'doing'),
            done: tasks.filter(task => task.category === 'done')
          };
          setTaskCategories(categories);
        } else {
          console.log("没有任务数据");
        }
      })
      .catch(error => {
        console.error('Error fetching tasks data:', error);
      });
  }, [username, projectName]);

  const addTask = (category) => {
    const newTask = { id: Date.now().toString(), name: '新任务', category };
    setTaskCategories(prev => ({
      ...prev,
      [category]: [...prev[category], newTask]
    }));
  };

  const removeTask = (category, taskId) => {
    setTaskCategories(prev => ({
      ...prev,
      [category]: prev[category].filter(task => task.id !== taskId)
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Project: {projectName}</h1>
      {project && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">{project.name}</h2>
          <p>{project.description}</p>
        </div>
      )}
      <div className="flex space-x-4">
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
                  <p>{task.name}</p>
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
    </div>
  );
};

export default Project;
