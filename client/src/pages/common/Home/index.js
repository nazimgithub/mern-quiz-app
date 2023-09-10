import React, { useEffect } from 'react';
import { message, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getAllExams } from '../../../apicalls/exams';
import { hideLoading, showLoading } from '../../../redux/loaderSlice';
import PageTitle from '../../../components/PageTitle';
import { useNavigate } from "react-router-dom";


function Home() {
  const [exams, setExams] = React.useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  
  const getExams = async () => {
    try {
      dispatch(showLoading());
      const response = await getAllExams();
      dispatch(hideLoading());
      if (response.data) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  }

  useEffect(() => {
    getExams();
  }, []);

  return (
    <div>
      <PageTitle title={
        `Hi ${user?.user_name}, Welcome to CHETU QUIZ`
      } />
      <div className='divider'></div>
      <Row gutter={[16, 16]} className="mt-2">
        {exams.map((exam) => (
          <Col span={6}>
            <div className="card-lg flex flex-col gap-1 p-2">
              <h1 className="text-2xl">
                {exam.name}
              </h1>
              <h1 className="text-md">
                Category : {exam.category}
              </h1>
              <h1 className="text-md">
                Passing Marks : {exam.passingMarks}
              </h1>
              <h1 className="text-md">
                Duration : {exam.duration}
              </h1>
              <button
                className="primary-outlined-btn"
                onClick={() => navigate(`/user/write-exam/${exam._id}`)}
              >Start Exam</button>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Home