import React, { useEffect } from 'react';
import PageTitle from '../../../components/PageTitle';
import { useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Table, message } from "antd";
import { showLoading, hideLoading } from "../../../redux/loaderSlice";
import { getAllExams, deleteExamById } from '../../../apicalls/exams';


function Eaxms() {

  const navigate = useNavigate();
  const [exams, setExams] = React.useState([]);
  const dispatch = useDispatch();

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "name"
    },
    {
      title: "Duration",
      dataIndex: "duration"
    },
    {
      title: "Category",
      dataIndex: "category"
    },
    {
      title: "Total Marks",
      dataIndex: "totalMarks"
    },
    {
      title: "Passing Marks",
      dataIndex: "passingMarks"
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (<div className="flex gap-2">
        <i className="ri-pencil-line" onClick={()=> navigate(`/admin/exams/edit/${record._id}`)}></i>
        <i className="ri-delete-bin-line" onClick={() => deleteExam(record._id)}></i>
      </div>)
    }
  ];

  const getAllExam = async () => {
    try {
      dispatch(showLoading());
      const response = await getAllExams();
      dispatch(hideLoading());
      if(response.data){
        setExams(response.data);
      }else{
        message.error(response.data)
      }
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  }

  const deleteExam = async (examId) => {
    try {
      dispatch(showLoading());
      const response = await deleteExamById({
        examId
      });
      dispatch(hideLoading());
      if(response.data){
        message.success(response.message);
        getAllExam();
      }else{
        message.error(response.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  }

  useEffect(()=>{
    getAllExam();
  },[])

  return (
    <div>
      <div className="flex justify-between mt-2 items-end">
        <PageTitle title="Exams" />
        <button
          className="primary-outlined-btn flex items-center"
          onClick={()=>navigate("/admin/exams/add")}
        >
          <i className="ri-add-line"></i>
          Add Exam
        </button>
      </div>
      <div className='divider'></div>

      <Table columns={columns} dataSource={exams} />
    </div>
  )
}

export default Eaxms
