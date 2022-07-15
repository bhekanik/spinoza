import React from "react"

export const InputLink = () => {
  return (
    <form>
      <div className="relative flex mb-4 space-x-3 ">
        <input
          placeholder="Paste Link Here"
          type="text"
          id="name"
          name="article-link"
          className="w-full max-w-md px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <button
          type="submit"
          className="px-6 py-2 text-lg text-white bg-indigo-500 border-0 rounded focus:outline-none hover:bg-indigo-600"
        >
          Add Article
        </button>
      </div>
    </form>
  )
}
