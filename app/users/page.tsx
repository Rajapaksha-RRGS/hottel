import React from 'react'

const Userspage = async () => {

  const res = await  fetch("https://jsonplaceholder.typicode.com/users");
  const users = await res.json();

  return (
    <div className=''>
      <h1 className='text-4xl items-center flex flex-col'>Users Page</h1>
      <ul>
        {users.map((user: { id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
          <li key={user.id}>{String(user.id)}: {user.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default Userspage
