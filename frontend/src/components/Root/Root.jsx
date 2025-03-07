import Footer from "../Footer/Footer"
import Navbar from "../Navbar/Navbar"
import {Outlet} from "react-router-dom"
function Root() {
  return (
    <div>
      <Navbar> </Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  )
}

export default Root