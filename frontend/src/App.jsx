import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [registerShowModal, setRegisterShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    uid: '',
    username: '',
    password: '',
    projects: []
  })
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault(); // 阻止表单的默认提交行为
    try {
      const response = await axios.post('http://127.0.0.1:7003/user/login', { username, password });
      setMessage(response.data.message);
      if (response.data.success) {
        navigate(`/dashboard/${username}`, { state: { username, password } });   // 传递username到Dashboard
      }
    } catch (error) {
      setMessage('登陆失败');
    }
  };

  const saveUser = () => {
    const userData = {
      ...newUser,
      id: Date.now().toString() // todo: 修改id方法
    }

    axios.post(`http://127.0.0.1:7003/user/register`, userData)
      .then(response => {
        if (response.data.success) {
          console.log("User added successfully!");
          console.log("Saved users:", response.data.users);  // 打印保存的用户数据
          setRegisterShowModal(false);
          setNewUser({
            uid: '',
            username: '',
            password: '',
            projects: []
          });
        } else {
          console.log("用户添加失败");
        }
      })
      .catch(error => {
        console.error('Error add user: ', error)
      })
  }

  const addUser = () => {
    setRegisterShowModal(true);
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className='w-full max-w-sm'>
        {/* 上端文字说明：“请登录账号” */}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6" onSubmit={handleLogin}>
            {/* 输入用户名 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  placeholder="用户名"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* 输入密码 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  placeholder="密码"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
            {/* 注册账号 */}
            <div>
              <button
                type='button'
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => addUser()}
              >
                Register
              </button>
            </div>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>

      {/* 注册账号 悬浮窗 */}
      {registerShowModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">注册账号</h2>
            <label className="block mb-2">
              用户名:
              <input
                type="text"
                className="border p-2 w-full"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />
            </label>
            <label className="block mb-2">
              密码:
              <input
                type="text"
                className="border p-2 w-full"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </label>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={saveUser}>
                注册
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setRegisterShowModal(false)}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
