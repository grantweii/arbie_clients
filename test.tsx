import React, { useState, useEffect } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);
  const [isShowing, setShowing] = useState(false)

    // SAME AS componentDidMount
    useEffect(    () => {}    ,  []    );

    // SAME AS componentDidUpdate
    useEffect(   () => {}  , [count, isShowing]   );

    // SAME AS componentWillUnmount
    useEffect(() => {
        return () => {

        }
    }, []);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setShowing(true)}>
        Click me
      </button>
    </div>
  );
}

