import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState([]);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    creationTime: '',
    status: '未完成',
    tasks: []
  })
  const [newlyShowModal, setNewlyShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { username, password } = location.state || {}; // 使用空对象作为默认值

  useEffect(() => {
    if (!username || !password) {
      // 如果没有用户名或密码，重定向到登录页面
      navigate('/');
      return;
    }

    // 使用GET请求和URL参数发送用户名和密码
    axios.get(`http://127.0.0.1:7002/user/info?username=${username}&password=${password}`)
      .then(response => {
        if (response.data.success) {
          setProjects(response.data.projects);
          setFilteredProjects(response.data.projects);
        } else {
          console.error('用户验证失败:', response.data.message);
        }
      })
      .catch(error => {
        console.error('获取用户信息时出错:', error);
      });
  }, [username, password, navigate]);

  const handleSearch = async (event) => {
    event.preventDefault();
    const filtered = projects.filter(project =>
      project.name.includes(searchTerm)
    );
    setFilteredProjects(filtered);
  };

  const handleProjectClick = async (projectName) => {
    navigate(`/dashboard/${username}/${projectName}`, { state: { username, password } });
  };

  const addProject = () => {
    setNewlyShowModal(true);
  };

  const saveProject = () => {
    const projectData = {
      ...newProject,
      creationTime: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' }),
    }

    axios.post(`http://127.0.0.1:7002/project/${username}/projects`, projectData)
      .then(response => {
        if (response.data.success) {
          console.log("Project saved successfully!"); // 调试信息
          setProjects(prevProjects => [...prevProjects, projectData]);
          setFilteredProjects(prevProjects => [...prevProjects, projectData]);
          setNewProject({
            name: '',
            description: '',
            creationTime: '',
            status: '未完成',
            tasks: []
          });
          setNewlyShowModal(false);
        } else {
          console.log("任务添加失败");
        }
      })
      .catch(error => {
        console.error('Error saving project: ', error)
      })
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-3xl">
      <div className="py-8">
        {/* 用户名及其他信息 */}
        <div>
          <h2 className="text-2xl font-semibold leading-tight">{username}</h2>
        </div>

        {/* 搜索栏 */}
        <div className="my-2 flex sm:flex-row flex-col">
          <form action='#' onSubmit={handleSearch}>
            <div className="block relative">
              <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-gray-500"><path d="M10,20C4.5,20,0,15.5,0,10S4.5,0,10,0s10,4.5,10,10S15.5,20,10,20z M10,2C5.6,2,2,5.6,2,10s3.6,8,8,8s8-3.6,8-8 S14.4,2,10,2z" /><path d="M21,21l-5.6-5.6C16.9,14.3,18,12.3,18,10c0-4.4-3.6-8-8-8S2,5.6,2,10s3.6,8,8,8c2.3,0,4.3-1.1,5.4-2.6L21,21z" /></svg>
              </span>
              <input
                placeholder="搜索项目"
                className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
          <div className="flex justify-end w-full">
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => addProject()}
            >
              创建新项目
            </button>
          </div>
        </div>

        {/* 项目列表 */}
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th scope="col" className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                    项目名
                  </th>
                  <th scope="col" className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                    描述
                  </th>
                  <th scope="col" className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                    创建日期
                  </th>
                  <th scope="col" className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                    状态
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project, index) => (
                  <tr key={index}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap"
                        key={project.name} onClick={() => handleProjectClick(project.name)}>
                        {project.name}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{project.description}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{project.creationTime}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                        <span aria-hidden="true" className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                        <span className="relative">{project.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 新建项目 悬浮窗 */}
      {newlyShowModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">创建新项目</h2>
            <label className="block mb-2">
              项目名称:
              <input
                type="text"
                className="border p-2 w-full"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              />
            </label>
            <label className="block mb-2">
              描述:
              <input
                type="text"
                className="border p-2 w-full"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
            </label>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={saveProject}>
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
    </div>
  );
};

export default Dashboard;
