import React, { useState,Fragment,useRef } from 'react';
import './App.css';
import axios from 'axios';
import useSWR from 'swr';
import { Dialog, Transition, Switch } from '@headlessui/react'

function App() {
  const [state, setState] = useState(1);
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenLogin, setIsOpenLogin] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [err, setErr] = useState(false)
  const [coffeeErr, setCoffeeErr] = useState(false)
  const [hi, setHi] = useState('Hi')

  const name:any = useRef()
  const price:any = useRef()
  const username:any = useRef()
  const password:any = useRef()
  let { data, error, mutate } = useSWR('http://localhost:8080/list', fetcher, {refreshInterval: 20000})
  if (error) return (<div>failed to load</div>)

  const addCoffee = async () => {
    if(name.current.value.length == 0 || !(Number(price.current.value)>0)){
      setCoffeeErr(true)
      return
    } else {
      setCoffeeErr(false)
    }
    await axios.post('http://localhost:8080/list/add',{
      name: name.current.value,
      price: Number(price.current.value),
    })
    mutate()
    setIsOpen(false)
  }

  const login = async () => {
    const res:any = await axios.post('http://localhost:8080/member/login',{
      username: username.current.value,
      password: password.current.value,
      role: enabled ? 'admin' : 'member'
    })
    if(res.data.id==0) {
      setErr(true)
    } else {
      setHi(`Hi, ${res.data.role} ${res.data.username}`)
      setErr(false)
      setIsOpenLogin(false)
    }
  }
  
  const closeModal = async () => {
    setIsOpen(false)
    setIsOpenLogin(false)
  }

  return (
    <div className="max-w-[1440px] min-h-screen mx-auto flex flex-col" >
      <div className="absolute bg-[url('../public/bg.jpeg')] max-w-[1440px] min-h-screen w-full bg-cover bg-center z-[-1] opacity-30"></div>
      <div className="w-full h-32 flex justify-end static">
        <div className="my-auto px-32 flex flex-row space-x-10">
          <button onClick={() => setState(1)} className={state === 1 ? 'text-blue-500' : ''}>Home</button>
          <button onClick={() => setState(0)} className={state === 0 ? 'text-blue-500' : ''}>Coffee Price</button>
          <button onClick={() => setIsOpenLogin(true)}>Login</button>
        </div>
      </div>
      { state === 0 ? (
        <div className="m-auto">
          {
            data ? (
              <>
                <div className="text-center my-auto">
                  <p className='text-6xl mb-10'>Coffee Price</p>
                    { 
                      data.map ((item:any,i:number) => {
                          return (
                            <div key={i} className="flex justify-between text-xl">
                              <span>{`${++i}. ${item.name}`}</span>
                              <span>${item.price}</span>
                            </div>
                          )
                      })
                    }
                </div>
                <button className='text-white text-xl rounded-md bg-purple-300 w-full mt-10 py-3' onClick={()=>setIsOpen(true)}>Add New Coffee</button>
              </>
            ) : <div className="m-auto text-2xl">กำลังโหลด...</div>
          }
        </div>
        ) : (
          <div className="text-center my-auto">
            <div className='space-y-4'>
              <p className="text-9xl">{hi}</p>
              <p className='text-3xl'>Welcome to Coffee.io Website</p>
            </div>
          </div>
        )
      }
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-60" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Add New Coffee
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 space-y-2">
                  <p className={'text-red-600 ' + (coffeeErr ? 'block' : 'hidden')}>! Please enter coffee name/price correctly</p>
                    <input ref={name} className='w-full rounded-full border-2 py-1 px-2 border-gray-300' type="text" placeholder='Coffee Name' />
                    <input type="number" ref={price} className='w-full rounded-full border-2 py-1 px-2 border-gray-300' placeholder='Price($)' />
                  </p>
                </div>

                <div className="mt-4 text-right space-x-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 pt-2 text-xl font-medium text-black border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 pt-2 text-xl font-medium text-black border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={addCoffee}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isOpenLogin} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-60" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-3xl font-medium leading-6 text-gray-900"
                >
                  Login
                </Dialog.Title>
                
                <div className="mt-10 mb-4">
                  <p className="text-sm text-gray-500 space-y-2">
                    <p className={'text-red-600 ' + (err ? 'block' : 'hidden')}>! Please enter username/password correctly</p>
                    <input ref={username} className='w-full rounded-full border-2 py-1 px-2 border-gray-300' type="text" placeholder='Username/Email' />
                    <input ref={password} className='w-full rounded-full border-2 py-1 px-2 border-gray-300' type="password" placeholder='Password' />
                    <div className="py-2 flex">
                    <Switch
                      checked={enabled}
                      onChange={setEnabled}
                      className={`${enabled ? 'bg-teal-900' : 'bg-teal-700'}
                        relative inline-flex flex-shrink-0 h-[28px] w-[63px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                      <span className="sr-only">Use setting</span>
                      <span
                        aria-hidden="true"
                        className={`${enabled ? 'translate-x-9' : 'translate-x-0'}
                          pointer-events-none inline-block h-[24px] w-[24px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                      />
                    </Switch>
                    <div className="my-auto ml-4">
                      <span className='text-black text-md'>Login as Administrator</span>
                    </div>
                  </div>
                  </p>
                </div>

                <div className="mt-4 text-right space-x-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 pt-2 text-xl font-medium text-black border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 pt-2 text-xl font-medium text-black border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={login}
                  >
                    Login
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>

  );
}

const fetcher = (url:any) => axios.get(url).then((res) => res.data )

export default App;
