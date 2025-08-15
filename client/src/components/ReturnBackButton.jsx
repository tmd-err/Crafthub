import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom"



function ReturnBackButton() {
    const navigate = useNavigate() ; 
    const handleReturnBack = () =>
        {
            navigate(-1)
            }

  return (
    <div>
      <button
            onClick={
                handleReturnBack
            }
            className='cursor-pointer text-sm border border-indigo-500 rounded-md text-indigo-500 w-4 p-2' >
                <FaArrowLeft/>
            </button>
    </div>
  )
}

export default ReturnBackButton
