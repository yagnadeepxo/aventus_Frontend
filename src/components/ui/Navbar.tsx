import { Account } from '@/types/types';
import * as React from 'react';

interface INavbarProps {
  connectMetamask: () => void,
  account: Account
}

const Navbar: React.FunctionComponent<INavbarProps> = ({ connectMetamask, account }) => {
  return (
    <>
      <nav className="bg-white dark:bg-[#000403] border-b border-[#c53bdb]">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/" className="flex items-center">
            <span className="self-center text-4xl font-semibold whitespace-nowrap dark:text-[#c53bdb]">PolyMix</span>
          </a>
          <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-pink-400 dark:border-gray-700">
              <p
                className='px-6 py-2 cursor-pointer'
                onClick={connectMetamask}>
                {account ?
                  `${account.address.slice(0, 4)}.....${account.address.slice(37, 40)}`
                  : "Connect"}
              </p>
            </ul>
          </div>
        </div>
      </nav>

    </>
  );
};

export default Navbar;
