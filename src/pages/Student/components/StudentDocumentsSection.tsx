import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Avatar,
  Button,
  Space,
  Form,
  Input,
  Modal,
  Upload,
  message,
  Divider,
} from "antd";
import {
  FolderOpenOutlined,
  PlusOutlined,
  FileTextOutlined,
  UploadOutlined,
  EyeOutlined,
  DeleteOutlined,
  FileImageOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileZipOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import {
  uploadStudentDocument,
  deleteStudentDocument,
} from "../../../redux/roaster/roasterSlice";
import { getPresignedDocumentUrl } from "../../../helpers/documentHelper";

const { Paragraph, Text } = Typography;

interface StudentDocumentsSectionProps {
  student: any;
  setStudentData: (data: any) => void;
  activeTab: string;
}

export const StudentDocumentsSection: React.FC<
  StudentDocumentsSectionProps
> = ({ student, setStudentData, activeTab }) => {
  const dispatch = useAppDispatch();
  const { submitLoading } = useAppSelector((state) => state.roaster);

  const [docModalVisible, setDocModalVisible] = useState(false);
  const [docForm] = Form.useForm();

  const handleUploadStudentDocument = async (values: any) => {
    try {
      const fileList = values.file;
      const file = Array.isArray(fileList)
        ? fileList[0]?.originFileObj || fileList[0]
        : fileList?.originFileObj || fileList;

      if (!file) {
        message.error("Please select a valid document file to upload!");
        return;
      }

      // Dispatch Redux thunk to upload document & update DB
      const resultAction = await dispatch(
        uploadStudentDocument({
          name: values.name,
          file,
          student,
        }),
      );

      if (uploadStudentDocument.fulfilled.match(resultAction)) {
        if (resultAction.payload?.updatedStudent) {
          setStudentData(resultAction.payload.updatedStudent);
        }
        message.success("Document uploaded and attached successfully!");
        setDocModalVisible(false);
        docForm.resetFields();
      } else if (uploadStudentDocument.rejected.match(resultAction)) {
        message.error(
          (resultAction.payload as string) || "Failed to upload document",
        );
      }
    } catch (err: any) {
      message.error(err.message || "Error uploading document");
    }
  };

  const handleDeleteStudentDocument = async (indexToDelete: number) => {
    try {
      const resultAction = await dispatch(
        deleteStudentDocument({
          indexToDelete,
          student,
        }),
      );

      if (deleteStudentDocument.fulfilled.match(resultAction)) {
        if (resultAction.payload?.updatedStudent) {
          setStudentData(resultAction.payload.updatedStudent);
        }
        message.success("Document removed successfully!");
      } else if (deleteStudentDocument.rejected.match(resultAction)) {
        message.error(
          (resultAction.payload as string) || "Failed to delete document",
        );
      }
    } catch (err: any) {
      message.error(err.message || "Failed to remove document");
    }
  };

  const handleViewDocument = async (doc: any) => {
    const urlOrKey = doc.url || doc.file_key;
    if (!urlOrKey) {
      message.error("Document link unavailable");
      return;
    }
    try {
      const fullUrl = await getPresignedDocumentUrl(urlOrKey);
      if (fullUrl) {
        window.open(fullUrl, "_blank");
      } else {
        message.error("Could not fetch document URL");
      }
    } catch (err) {
      message.error("Failed to open document");
    }
  };

  // Helper to dynamically detect file type metadata for UI badges & icons
  const getFileTypeMeta = (doc: any) => {
    const name = (doc.name || "").toLowerCase();
    const type = (doc.type || "").toLowerCase();
    const url = (doc.url || "").toLowerCase();

    if (type.includes("pdf") || name.endsWith(".pdf") || url.includes(".pdf")) {
      return {
        label: "PDF Document",
        color: "red",
        icon: <FileTextOutlined />,
        bg: "#ef4444",
      };
    }
    if (
      type.includes("image") ||
      name.match(/\.(png|jpg|jpeg|webp|gif|svg|bmp|tiff)$/) ||
      url.match(/\.(png|jpg|jpeg|webp|gif|svg|bmp|tiff)/)
    ) {
      return {
        label: "Image File",
        color: "blue",
        icon: <FileImageOutlined />,
        bg: "#3b82f6",
      };
    }
    if (
      type.includes("word") ||
      type.includes("officedocument.wordprocessingml") ||
      name.match(/\.(doc|docx)$/)
    ) {
      return {
        label: "Word Document",
        color: "cyan",
        icon: <FileWordOutlined />,
        bg: "#0284c7",
      };
    }
    if (
      type.includes("excel") ||
      type.includes("spreadsheet") ||
      type.includes("csv") ||
      name.match(/\.(xls|xlsx|csv)$/)
    ) {
      return {
        label: "Spreadsheet / Excel",
        color: "green",
        icon: <FileExcelOutlined />,
        bg: "#16a34a",
      };
    }
    if (
      type.includes("zip") ||
      type.includes("compressed") ||
      type.includes("tar") ||
      name.match(/\.(zip|rar|tar|gz|7z)$/)
    ) {
      return {
        label: "Archive / Zip",
        color: "purple",
        icon: <FileZipOutlined />,
        bg: "#9333ea",
      };
    }
    if (
      type.includes("text") ||
      type.includes("json") ||
      name.match(/\.(txt|json|js|ts|py|html|css)$/)
    ) {
      return {
        label: "Text / Code File",
        color: "orange",
        icon: <FileTextOutlined />,
        bg: "#ea580c",
      };
    }
    if (
      type.includes("video") ||
      type.includes("audio") ||
      name.match(/\.(mp4|mov|avi|mkv|mp3|wav)$/)
    ) {
      return {
        label: "Media File",
        color: "magenta",
        icon: <VideoCameraOutlined />,
        bg: "#c026d3",
      };
    }

    return {
      label: "Document File",
      color: "geekblue",
      icon: <FolderOpenOutlined />,
      bg: "var(--primary-brand)",
    };
  };

  const docs = student.documents || [];

  return (
    <>
      <Card
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <Space>
              <FolderOpenOutlined
                style={{ color: "var(--primary-brand)", fontSize: 18 }}
              />
              <span>Supporting Documents & Academic Records</span>
            </Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setDocModalVisible(true)}
              style={{
                background: "var(--primary-brand)",
                border: "none",
                borderRadius: 8,
              }}
            >
              Upload New Document
            </Button>
          </div>
        }
        className="glass-panel"
        style={{
          borderRadius: 12,
          marginTop: activeTab === "profile" ? 24 : 0,
        }}
      >
        {docs.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              background: "var(--bg-elevated)",
              borderRadius: 8,
              border: "1px dashed var(--border-muted)",
            }}
          >
            <FileTextOutlined
              style={{ fontSize: 44, color: "var(--text-secondary)" }}
            />
            <Paragraph
              style={{
                color: "var(--text-secondary)",
                marginTop: 12,
                marginBottom: 16,
              }}
            >
              No supporting documents uploaded yet. You can attach birth
              certificates, identity proofs, marksheets, spreadsheets, or any
              relevant files.
            </Paragraph>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={() => setDocModalVisible(true)}
              style={{
                background: "var(--primary-brand)",
                border: "none",
                borderRadius: 8,
              }}
            >
              Upload Document
            </Button>
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {docs.map((doc: any, index: number) => {
              const meta = getFileTypeMeta(doc);
              return (
                <Col xs={24} sm={12} md={8} key={index}>
                  <Card
                    size="small"
                    style={{
                      borderRadius: 10,
                      border: "1px solid var(--border-muted)",
                      background: "var(--bg-elevated)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <Avatar
                        shape="square"
                        size={44}
                        style={{
                          backgroundColor: meta.bg,
                          borderRadius: 8,
                        }}
                        icon={meta.icon}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text
                          ellipsis
                          style={{
                            display: "block",
                            color: "var(--text-primary)",
                            fontWeight: 600,
                          }}
                        >
                          {doc.name || `Document #${index + 1}`}
                        </Text>
                        <Tag
                          color={meta.color}
                          style={{
                            fontSize: 10,
                            marginTop: 4,
                            borderRadius: 4,
                          }}
                        >
                          {meta.label}
                        </Tag>
                      </div>
                    </div>

                    <Divider style={{ margin: "12px 0 8px" }} />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDocument(doc)}
                        style={{ padding: 0 }}
                      >
                        View / Download
                      </Button>
                      <Button
                        type="link"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteStudentDocument(index)}
                        style={{ padding: 0 }}
                      >
                        Remove
                      </Button>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Card>

      {/* Upload Document Modal */}
      <Modal
        open={docModalVisible}
        title={
          <Space>
            <UploadOutlined style={{ color: "var(--primary-brand)" }} />
            <span>Upload Student Document</span>
          </Space>
        }
        onCancel={() => {
          setDocModalVisible(false);
          docForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={docForm}
          layout="vertical"
          onFinish={handleUploadStudentDocument}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="name"
            label="Document Title / Type"
            rules={[
              {
                required: true,
                message:
                  "Please enter document title (e.g., Identity Proof, Birth Certificate)",
              },
            ]}
          >
            <Input placeholder="e.g. Birth Certificate, Marksheet, Project File" />
          </Form.Item>

          <Form.Item
            name="file"
            label="Select Document File"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[
              { required: true, message: "Please select a document file!" },
            ]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Click to Select File</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0, textAlign: "right", marginTop: 24 }}
          >
            <Button
              onClick={() => {
                setDocModalVisible(false);
                docForm.resetFields();
              }}
              disabled={submitLoading}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<UploadOutlined />}
              loading={submitLoading}
              style={{ background: "var(--primary-brand)", border: "none" }}
            >
              Upload & Attach
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
