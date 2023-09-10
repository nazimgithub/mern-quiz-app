import { Form, Modal, message } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../../../redux/loaderSlice';
import { addQuestionToExam, editQuestionById } from '../../../apicalls/exams';

function AddEditQuestion({
    showAddEditQuestionModal,
    setAddEditQuestionModal,
    refreshData,
    examId,
    selectedQuestion,
    setSelectedQuestion
}) {
    const dispatch = useDispatch();
    const onFinish = async (values) => {
        try {
            dispatch(showLoading());
            let response;
            const requiredPayload = {
                name: values.name,
                correctOption: values.correctOption,
                options: {
                    A: values.A,
                    B: values.B,
                    C: values.C,
                    D: values.D,
                },
                exam: examId
            };
            if(selectedQuestion){
                response = await editQuestionById({
                    ...requiredPayload,
                    questionId: selectedQuestion?._id
                });
            }else{
                response = await addQuestionToExam(requiredPayload);
            }
            
            if (response.success) {
                message.success(response.message);
                refreshData();
                setAddEditQuestionModal(false);
                dispatch(hideLoading())
            } else {
                message.error(response.message);
            }
            setSelectedQuestion(null);
            dispatch(hideLoading());
        } catch (error) {
            dispatch(hideLoading());
            message.error(error.message);
        }
    };

    return (
        <div>
            <Modal
                title={selectedQuestion ? "Edit Question" : "Add Question"}
                visible={showAddEditQuestionModal}
                footer={false}
                onCancel={() => {
                        setAddEditQuestionModal(false)
                        setSelectedQuestion(null)
                    }
                }
            >
                <Form onFinish={onFinish} layout='vertical'
                    initialValues={
                        {
                            name: selectedQuestion?.name,
                            A: selectedQuestion?.options?.A,
                            B: selectedQuestion?.options?.B,
                            C: selectedQuestion?.options?.C,
                            D: selectedQuestion?.options?.D,
                            correctOption: selectedQuestion?.correctOption
                        }
                    }
                >
                    <Form.Item name="name" label="Question">
                        <input type="text" />
                    </Form.Item>
                    <Form.Item name="correctOption" label="Correct Answer">
                        <input type="text" />
                    </Form.Item>
                    <div className="flex gap-5">
                        <Form.Item name="A" label="Option A">
                            <input type="text" />
                        </Form.Item>
                        <Form.Item name="B" label="Option B">
                            <input type="text" />
                        </Form.Item>
                    </div>
                    <div className="flex gap-5">
                        <Form.Item name="C" label="Option C">
                            <input type="text" />
                        </Form.Item>
                        <Form.Item name="D" label="Option D">
                            <input type="text" />
                        </Form.Item>
                    </div>
                    <div className="flex justify-end gap-3 mt-2">
                        <button
                            className="primary-outlined-btn"
                            type="button"
                            onClick={() => setAddEditQuestionModal(false)}
                        >Cancel</button>
                        <button className="primary-cotained-btn">Save</button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}

export default AddEditQuestion;
