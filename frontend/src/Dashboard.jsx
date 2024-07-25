import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { username, password } = location.state; // 从导航状态中获取用户名和密码

  useEffect(() => {
    // 使用GET请求和URL参数发送用户名和密码
    axios.get(`http://127.0.0.1:7002/user/info?username=${username}&password=${password}`)
      .then(response => {
        if (response.data.success) {
          setProjects(response.data.projects);
        } else {
          console.error('用户验证失败:', response.data.message)
        //   navigate('/');
        }
      })
      .catch(error => {
        console.error('获取用户信息时出错:', error);
        // navigate('/');
      });
  }, [username, password, navigate]);

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-3xl">
      <div className="py-8">
        {/* 用户名及其他信息 */}
        <div>
          <h2 className="text-2xl font-semibold leading-tight">{username}</h2>
        </div>

        {/* 搜索栏 */}
        <div className="my-2 flex sm:flex-row flex-col">
          <div className="block relative">
            <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-gray-500"><path d="M10,20C4.5,20,0,15.5,0,10S4.5,0,10,0s10,4.5,10,10S15.5,20,10,20z M10,2C5.6,2,2,5.6,2,10s3.6,8,8,8s8-3.6,8-8 S14.4,2,10,2z"/><path d="M21,21l-5.6-5.6C16.9,14.3,18,12.3,18,10c0-4.4-3.6-8-8-8S2,5.6,2,10s3.6,8,8,8c2.3,0,4.3-1.1,5.4-2.6L21,21z"/></svg>
            </span>
            <input placeholder="搜索项目" className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"/>
          </div>
          {/* <div className="flex justify-end w-full"> */}
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              创建新项目
            </button>
          {/* </div> */}
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
                {projects.map((project, index) => (
                  <tr key={index}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{project.name}</p>
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
    </div>
  );
};

export default Dashboard;
