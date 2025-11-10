import React from "react";

const Form = ({ user }) => {
  if (!user) return <p>Loading...</p>; // đợi data dc fetch về
  const { username, email, phoneNumber, balance } = user;

  return (
    <form className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100">
      <div>
        <label
          htmlFor="first_name"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Username
        </label>
        <input
          type="text"
          id="first_name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={username}
          disabled
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Phone number
        </label>
        <input
          type="text"
          id="phone"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={phoneNumber}
          disabled
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Email address
        </label>
        <input
          type="email"
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          value={email}
          disabled
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="balance"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Balance
        </label>
        <input
          type="text"
          id="balance"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={balance ? `${balance.toLocaleString("vi-VN")} VND` : "0 VND"}
          disabled
        />
      </div>
    </form>
  );
};

export default Form;
