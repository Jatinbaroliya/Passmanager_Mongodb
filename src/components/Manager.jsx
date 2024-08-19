import React, { useRef, useState, useEffect } from "react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();
  const [form, setForm] = useState({ _id: "", site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);

  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/data');
        setPasswordArray(response.data);
      } catch (error) {
        console.error('There was an error fetching the passwords!', error);
        toast.error('Failed to fetch passwords!');
      }
    };
    fetchPasswords();
  }, []);

  const showPassword = () => {
    passwordRef.current.type = passwordRef.current.type === "text" ? "password" : "text";
    ref.current.src = passwordRef.current.type === "text" ? "icons/eye.png" : "icons/eyecross.png";
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast('Copied to Clipboard', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const savePassword = async () => {
    if (form.site && form.username && form.password) {
      try {
        if (form._id) {
          // Update existing password
          await axios.put(`http://localhost:5000/api/data/${form._id}`, form);
          const updatedPasswordArray = passwordArray.map(item =>
            item._id === form._id ? form : item
          );
          setPasswordArray(updatedPasswordArray);
          toast('Password Updated!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          // Add new password
          const newPassword = { ...form, id: uuidv4() };
          await axios.post('http://localhost:5000/api/data', newPassword);
          setPasswordArray([...passwordArray, newPassword]);
          toast('Password Saved!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
        setForm({ _id: "", site: "", username: "", password: "" });
      } catch (error) {
        console.error('There was an error saving the password!', error);
        toast.error('Failed to Save Password!');
      }
    } else {
      toast.error("All fields are required!");
    }
  };
  

  const deletePassword = async (_id) => {
    if (!_id) {
      console.error("No ID provided for deletion");
      return;
    }

    const confirmation = window.confirm("Do you want to delete this?");
    if (confirmation) {
      try {
        await axios.delete(`http://localhost:5000/api/data/${_id}`);
        const updatedPasswordArray = passwordArray.filter(item => item._id !== _id);
        setPasswordArray(updatedPasswordArray);
        toast('Password Deleted', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } catch (error) {
        console.error('There was an error deleting the password!', error);
        toast.error('Failed to Delete Password!');
      }
    }
  };
  
  const editPassword = (id) => {
    const passwordToEdit = passwordArray.find(i => i._id === id);
    if (passwordToEdit) {
      setForm(passwordToEdit);
    }
  };
  
  

  return (
    <>
      <ToastContainer
       position="top-center"
       autoClose={3000}
       hideProgressBar={false}
       newestOnTop={false}
       closeOnClick
       rtl={false}
       pauseOnFocusLoss
       draggable
       pauseOnHover
       theme="light"
       transition= "Bounce"
      />
      <div>
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>
        <div className="w-full flex flex-col justify-center text-center gap-1 pt-6">
          <div className="text-2xl">
            <span className="text-green-500"> &lt;</span>
            <span>Pass</span>
            <span className="text-green-500">OP/&gt;</span>
          </div>
          <div className="text-[17px] text-zinc-300">
            Your own Password Manager
          </div>
        </div>
        <div className="flex flex-col w-[70%] m-auto text-center py-6 gap-4 items-center">
          <input
            className="w-[100%] rounded-full p-1 pl-5 border-lime-700 border-[3px] text-black"
            type="text"
            placeholder="Your Website Name"
            name="site"
            value={form.site}
            onChange={handleChange}
          />
          <div className="flex justify-between w-full">
            <input
              className="w-[78%] rounded-full p-1 pl-5 border-lime-700 border-[3px] mr-2 text-black"
              type="text"
              placeholder="Enter Username"
              name="username"
              value={form.username}
            onChange={handleChange}
            />
            <div className="w-[20%] relative">
              <input
                className="w-full rounded-full p-1 pl-5 border-lime-700 border-[3px] text-black"
                type="password"
                placeholder="Enter Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                ref={passwordRef}
              />
              <span onClick={showPassword}>
                <img
                  ref={ref}
                  className="absolute right-3 top-2 cursor-pointer"
                  width={20}
                  src="icons/eye.png"
                  alt="eye"
                />
              </span>
            </div>
          </div>
          <button
            onClick={savePassword}
            className="flex justify-center items-center gap-1 bg-green-600 rounded-full w-[100px] border-2 border-lime-200"
          >
            <span className="invert flex justify-center items-center">
              <lord-icon
                src="https://cdn.lordicon.com/jgnvfzqg.json"
                trigger="hover"
              ></lord-icon>
            </span>
            <span>Save</span>
          </button>
        </div>
        <div className="password pb-6">
          <h2 className="text-xl flex justify-center p-4 font-bold">Your Passwords</h2>
          {passwordArray.length === 0 && <div className="w-[70%] m-auto">No Passwords to Show</div>}
          {passwordArray.length !== 0 && (
            <table className="table-auto w-[70%] m-auto">
              <thead className="bg-green-600">
                <tr>
                  <th className="py-2">Site</th>
                  <th className="py-2">UserName</th>
                  <th className="py-2">Password</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-green-100 text-black">
                {passwordArray.map((item) => (
  
                  <tr key={item.id}>
                    <td className="border-y border-blue-950 pl-4 w-[30%] py-1 font-bold">
                      <div className="flex justify-center items-center pr-2">
                        <div className="w-[87%] overflow-hidden">{item.site}</div>
                        <div onClick={() => copyText(item.site)}>
                          <lord-icon
                            style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "6px" }}
                            src="https://cdn.lordicon.com/iykgtsbt.json"
                            trigger="hover"
                          ></lord-icon>
                        </div>
                      </div>
                    </td>
                    <td className="border-y border-blue-950 text-center w-[30%] py-1">
                      <div className="flex justify-center items-center pr-2">
                        <div className="w-[87%] overflow-hidden">{item.username}</div>
                        <div onClick={() => copyText(item.username)}>
                          <lord-icon
                            style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "6px" }}
                            src="https://cdn.lordicon.com/iykgtsbt.json"
                            trigger="hover"
                          ></lord-icon>
                        </div>
                      </div>
                    </td>
                    <td className="border-y border-blue-950 text-center w-[30%] py-1">
                      <div className="flex justify-center items-center pr-2">
                        <div className="w-[87%] overflow-hidden">{item.password}</div>
                        <div onClick={() => copyText(item.password)}>
                          <lord-icon
                            style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "6px" }}
                            src="https://cdn.lordicon.com/iykgtsbt.json"
                            trigger="hover"
                          ></lord-icon>
                        </div>
                      </div>
                    </td>
                    <td className='border-y border-blue-950 text-center w-[10%] py-1'>
                      <span className='cursor-pointer mx-1' onClick={() => editPassword(item._id)}>
                        <lord-icon
                          src="https://cdn.lordicon.com/gwlusjdu.json"
                          trigger="hover"
                          style={{ width: "25px", height: "25px" }}
                        ></lord-icon>
                      </span>
                      <span className='cursor-pointer mx-1' onClick={() => deletePassword(item._id)}>
                        <lord-icon
                          src="https://cdn.lordicon.com/skkahier.json"
                          trigger="hover"
                          style={{ width: "25px", height: "25px" }}
                        ></lord-icon>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
