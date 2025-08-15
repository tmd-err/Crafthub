import React from 'react'

function Layout() {
  return (
    <>
      <div>
        {/*navbar */}
        <Navbar />
        {/*rendered results*/}
        <div className='main-content'>
          <Outlet/>
        </div>
      </div>
    </>
  )
}

export default Layout