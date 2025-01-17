import React from 'react'
import Home from './Home'
import List from './LIst'
import { useState } from 'react';
function Primary() {
    const [refresh, setRefresh] = useState(false);
    const handleTaskAdded = () => {
        setRefresh((prev) => !prev);
    };
  return (
    <div>
        <Home onTaskAdded={handleTaskAdded}/>
        <List refresh={refresh}/>
    </div>
  )
}

export default Primary
