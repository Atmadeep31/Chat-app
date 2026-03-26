"use client"
interface ChildProps {
    username :string,
    email : string,
    setUsername:(username:string) => void,
    setEmail:(email : string) =>void
    CreateUser:()=>void
}

const UserSetup = ({username,setUsername,email,setEmail,CreateUser}:ChildProps) => {
    

    return (
        <div>
           <div style={{ padding: 20 }}>
        <h2>Enter Name</h2>
        <input
          value={username}
          onChange={(e) => { setUsername(e.target.value) }}
        />
         <h2>Enter Email</h2>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={()=>CreateUser()}>Create User</button>
        </div>
        </div>
    );
}

export default UserSetup;