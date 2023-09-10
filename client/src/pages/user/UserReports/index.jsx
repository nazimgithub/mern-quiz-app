import React, { useEffect } from 'react'
import PageTitle from '../../../components/PageTitle'
import { Table, message } from 'antd';
import { hideLoading, showLoading } from '../../../redux/loaderSlice';
import { useDispatch } from 'react-redux';
import { getAllReportsByUser } from '../../../apicalls/reports';
import moment from "moment";

function UserReports() {
    const [reportsData, setReportsData] = React.useState([]);
    const dispatch = useDispatch();
    const columns = [
        {
            title: "Exam Name",
            dataIndex: "examName",
            render: (text, record) => <>
                {record.exam.name}
            </>
        },
        {
            title: "Date",
            dataIndex: "date",
            render: (text, record) => <>
                {
                    moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")
                }
            </>
        },
        {
            title: "Total Marks",
            dataIndex: "totalMarks",
            render: (text, record) => <>
                {record.exam.totalMarks}
            </>
        },
        {
            title: "Passing Marks",
            dataIndex: "correctAnswers",
            render: (text, record) => <>
                {record.exam.passingMarks}
            </>
        },
        {
            title: "Obtained Marks",
            dataIndex: "correctAnswers",
            render: (text, record) => <>
                {record.result.correctAnswers.length}
            </>
        },
        {
            title: "Verdict",
            dataIndex: "verdict",
            render: (text, record) => <>
                {record.result.verdict}
            </>
        }
    ];

    const getData = async () => {
        try {
            dispatch(showLoading());
            const response = await getAllReportsByUser();
            if (response.success) {
                setReportsData(response.data);
            } else {
                message.error(response.message)
            }
            dispatch(hideLoading());
        } catch (error) {
            dispatch(hideLoading());
            message.error(error.message);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <PageTitle title="Reports" />
            <div className="divider"></div>
            <Table columns={columns} dataSource={reportsData} />
        </div>
    )
}

export default UserReports
