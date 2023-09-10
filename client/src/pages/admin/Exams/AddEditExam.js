import React, { useEffect } from 'react';
import PageTitle from '../../../components/PageTitle';
import { Col, Form, Row, Table, Tabs, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { addExam, editExamById, getExamById, deleteQuestionById } from '../../../apicalls/exams';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from "../../../redux/loaderSlice";
import TabPane from 'antd/es/tabs/TabPane';
import AddEditQuestion from './AddEditQuestion';

function AddEditExam() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [examData, setExamData] = React.useState(null);
  const [selectedQuestion, setSelectedQuestion] = React.useState(null);
  const [showAddEditQuestionModal, setAddEditQuestionModal] = React.useState(false);

  // insert new exam data
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      let response;
      if (params.id) {
        response = await editExamById({
          ...values,
          examId: params.id
        }); // exam edit operation
      } else {
        response = await addExam(values); // exam new insert operation
      }
      if (response.success) {
        message.success(response.message);
        navigate("/admin/exams");
      } else {
        message.error(response.message);
      }
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading())
      message.error(error.message);
    }
  }

  // get exam data by id
  const getExamData = async () => {
    try {
      dispatch(showLoading());
      const response = await getExamById({
        examId: params.id
      });
      dispatch(hideLoading());
      if (response.data) {
        setExamData(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(hideLoading())
      message.error(error.message);
    }
  }

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
  }, []);

  // Delete question by id
  const deleteQuestion = async (questionId) => {
    try {
      dispatch(showLoading())
      const response = await deleteQuestionById({
        questionId,
        examId: params.id
      });
      dispatch(hideLoading());
      if (response.success) {
        message.success(response.message);
        getExamData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  }; 

  const questionsColumns = [
    {
      title: "Question",
      dataIndex: "name"
    },
    {
      title: "Options",
      dataIndex: "options",
      render: (text, record) => {
        return Object.keys(record.options).map((key) => {
          return <div>{key} : {record.options[key]}</div>
        })
      }
    },
    {
      title: "Correct Option",
      dataIndex: "correctOption",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="flex gap-2">
          <i className="ri-pencil-line" onClick={() => {
            setSelectedQuestion(record);
            setAddEditQuestionModal(true);
          }}></i>
          <i className="ri-delete-bin-line" onClick={() =>
            { deleteQuestion(record._id)}
          }></i>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageTitle title=
        {params.id ? "Edit Exam" : "Add Exam"}
      />
      <div className="divider"></div>
      {(examData || !params.id) && (
        <Form layout="vertical" className="mt-2" onFinish={onFinish} initialValues={examData}>
          <Tabs defaultActiveKey='1'>
            <TabPane tab="Exam Details" key="1">
              <Row gutter={[10, 10]}>
                <Col span={8}>
                  <Form.Item label="Exam Name" name="name">
                    <input type="text" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Exam Duration" name="duration">
                    <input type="text" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Category" name="category">
                    <select name="" id="">
                      <option value="">-- Select Category --</option>
                      <option value="php">PHP</option>
                      <option value="html">HTML</option>
                      <option value="javascript">Javascript</option>
                      <option value="node">Node</option>
                    </select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Total Marks" name="totalMarks">
                    <input type="number" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Passing Marks" name="passingMarks">
                    <input type="number" />
                  </Form.Item>
                </Col>
              </Row>
              <div className="flex justify-end gap-2">
                <button type="button" className="primary-outlined-btn" onClick={() => navigate("/admin/exams")}>Cancel</button>
                <button type="submit" className="primary-cotained-btn">Save</button>
              </div>
            </TabPane>
            {params.id && <TabPane tab="Questions" key="2">
              <div className="flex justify-end">
                <button type="button" className="primary-outlined-btn" onClick={() => setAddEditQuestionModal(true)}>Add Question</button>
              </div>
              {/* Display question list of exam */}
              <Table
                columns={questionsColumns}
                dataSource={examData?.questions || []}
              />
            </TabPane>}
          </Tabs>
        </Form>
      )}

      {/* Model component for Add Question */}
      {showAddEditQuestionModal && <AddEditQuestion
        setAddEditQuestionModal={setAddEditQuestionModal}
        showAddEditQuestionModal={showAddEditQuestionModal}
        examId={params.id}
        refreshData={getExamData}
        selectedQuestion={selectedQuestion}
        setSelectedQuestion={setSelectedQuestion}
      />}
    </div>
  );
}

export default AddEditExam
