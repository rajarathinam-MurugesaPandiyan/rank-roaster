import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  Slider,
  Button,
  Space,
  Typography,
  message,
  Segmented,
} from "antd";
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  RotateRightOutlined,
  ScissorOutlined,
  UploadOutlined,
  ReloadOutlined,
  DragOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Text } = Typography;

interface ImageCropModalProps {
  open: boolean;
  imageSrc: string | null;
  fileName?: string;
  onCancel: () => void;
  onCropComplete: (uploadResult: {
    url: string;
    delete_url: string;
    file_key: string;
    file_name: string;
  }) => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  open,
  imageSrc,
  fileName = "avatar.png",
  onCancel,
  onCropComplete,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [cropShape, setCropShape] = useState<"circle" | "square">("circle");
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [uploading, setUploading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Reset state when modal opens with a new image
  useEffect(() => {
    if (open) {
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
    }
  }, [open, imageSrc]);

  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      imageRef.current = img;
      drawCanvas();
    };
  }, [imageSrc, zoom, rotation, cropShape, offset]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 320;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);
    ctx.save();

    // Center, translate by offset, rotate, and scale
    ctx.translate(size / 2 + offset.x, size / 2 + offset.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Draw image centered
    const aspect = img.width / img.height;
    let drawWidth = size;
    let drawHeight = size;

    if (aspect > 1) {
      drawHeight = size;
      drawWidth = size * aspect;
    } else {
      drawWidth = size;
      drawHeight = size / aspect;
    }

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();

    // Apply Mask overlay for crop preview
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(0, 0, size, size);

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    if (cropShape === "circle") {
      ctx.arc(size / 2, size / 2, size / 2 - 16, 0, Math.PI * 2);
    } else {
      ctx.rect(16, 16, size - 32, size - 32);
    }
    ctx.fill();
    ctx.restore();

    // Draw border guideline
    ctx.strokeStyle = "var(--primary-brand, #4f46e5)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (cropShape === "circle") {
      ctx.arc(size / 2, size / 2, size / 2 - 16, 0, Math.PI * 2);
    } else {
      ctx.rect(16, 16, size - 32, size - 32);
    }
    ctx.stroke();
  };

  // Mouse Drag / Pan Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Handlers for Mobile Devices
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  // Scroll Wheel Zoom Handler
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.1 : -0.1;
    setZoom((prev) => Math.min(Math.max(0.5, prev + zoomFactor), 4));
  };

  const getCroppedBlob = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = imageRef.current;
      if (!img) return reject(new Error("Image not loaded"));

      const cropCanvas = document.createElement("canvas");
      const size = 320;
      cropCanvas.width = size;
      cropCanvas.height = size;
      const ctx = cropCanvas.getContext("2d");

      if (!ctx) return reject(new Error("Could not get canvas context"));

      ctx.save();
      ctx.translate(size / 2 + offset.x, size / 2 + offset.y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      const aspect = img.width / img.height;
      let drawWidth = size;
      let drawHeight = size;

      if (aspect > 1) {
        drawHeight = size;
        drawWidth = size * aspect;
      } else {
        drawWidth = size;
        drawHeight = size / aspect;
      }

      ctx.drawImage(
        img,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight,
      );
      ctx.restore();

      cropCanvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas blob conversion failed"));
      }, "image/png");
    });
  };

  const handleUploadCropped = async () => {
    try {
      setUploading(true);
      const blob = await getCroppedBlob();
      const file = new File(
        [blob],
        fileName.replace(/\.[^/.]+$/, "") + "_cropped.png",
        {
          type: "image/png",
        },
      );

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:8080/public/documents/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (response.data && response.data.url) {
        message.success("Profile photo cropped and uploaded successfully!");
        onCropComplete(response.data);
      } else {
        message.error("Failed to upload photo");
      }
    } catch (err: any) {
      message.error(
        err.response?.data?.error ||
          err.message ||
          "Error uploading cropped image",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <Modal
      open={open}
      title={
        <Space>
          <ScissorOutlined style={{ color: "var(--primary-brand)" }} />
          <span>Adjust & Crop Profile Photo</span>
        </Space>
      }
      onCancel={onCancel}
      footer={[
        <Button
          key="reset"
          icon={<ReloadOutlined />}
          onClick={handleReset}
          disabled={uploading}
        >
          Reset Position
        </Button>,
        <Button key="cancel" onClick={onCancel} disabled={uploading}>
          Cancel
        </Button>,
        <Button
          key="upload"
          type="primary"
          icon={<UploadOutlined />}
          loading={uploading}
          onClick={handleUploadCropped}
          style={{ background: "var(--primary-brand)", border: "none" }}
        >
          Crop & Save
        </Button>,
      ]}
      destroyOnClose
      centered
      width={420}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
        }}
      >
        <Text type="secondary" style={{ fontSize: 12 }}>
          <DragOutlined /> Click & drag image to reposition • Scroll wheel to
          zoom
        </Text>

        <div
          style={{
            position: "relative",
            width: 320,
            height: 320,
            background: "#111",
            borderRadius: 12,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isDragging ? "grabbing" : "grab",
            boxShadow: "inset 0 0 12px rgba(0,0,0,0.8)",
          }}
        >
          <canvas
            ref={canvasRef}
            width={320}
            height={320}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            onWheel={handleWheel}
            style={{ display: "block", userSelect: "none" }}
          />
        </div>

        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Text type="secondary">Crop Shape:</Text>
          <Segmented
            options={[
              { label: "Circle", value: "circle" },
              { label: "Square", value: "square" },
            ]}
            value={cropShape}
            onChange={(val) => setCropShape(val as any)}
          />
        </Space>

        <div style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <Text type="secondary">Zoom:</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {Math.round(zoom * 100)}%
            </Text>
          </div>
          <Space style={{ width: "100%" }}>
            <ZoomOutOutlined
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
              style={{ cursor: "pointer" }}
            />
            <Slider
              min={0.5}
              max={4}
              step={0.05}
              value={zoom}
              onChange={(val) => setZoom(val)}
              style={{ flex: 1 }}
            />
            <ZoomInOutlined
              onClick={() => setZoom((z) => Math.min(4, z + 0.1))}
              style={{ cursor: "pointer" }}
            />
          </Space>
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text type="secondary">Orientation:</Text>
          <Button
            type="default"
            icon={<RotateRightOutlined />}
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
          >
            Rotate 90°
          </Button>
        </div>
      </div>
    </Modal>
  );
};
