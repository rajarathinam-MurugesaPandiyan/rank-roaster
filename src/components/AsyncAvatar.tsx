import React, { useState, useEffect } from "react";
import { Avatar, Spin } from "antd";
import { UserOutlined, LoadingOutlined } from "@ant-design/icons";
import { getPresignedDocumentUrl } from "../helpers/documentHelper";

interface AsyncAvatarProps {
  src?: string;
  size?: number | "large" | "small" | "default";
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  shape?: "circle" | "square";
  alt?: string;
  children?: React.ReactNode;
}

export const AsyncAvatar: React.FC<AsyncAvatarProps> = ({
  src,
  size = 40,
  icon = <UserOutlined />,
  style,
  className,
  shape = "circle",
  alt = "avatar",
  children,
}) => {
  const [resolvedSrc, setResolvedSrc] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    if (!src) {
      setResolvedSrc("");
      setLoading(false);
      setHasError(false);
      return;
    }

    setLoading(true);
    setHasError(false);

    getPresignedDocumentUrl(src)
      .then((url) => {
        if (!isMounted) return;
        const finalUrl = url || src;

        // Preload image in memory so spinner stays active until file is fully downloaded
        const img = new Image();
        img.src = finalUrl;
        img.onload = () => {
          if (isMounted) {
            setResolvedSrc(finalUrl);
            setLoading(false);
            setHasError(false);
          }
        };
        img.onerror = () => {
          if (isMounted) {
            setResolvedSrc(finalUrl);
            setLoading(false);
            setHasError(true);
          }
        };
      })
      .catch(() => {
        if (isMounted) {
          setResolvedSrc(src);
          setLoading(false);
          setHasError(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [src]);

  const numSize =
    typeof size === "number"
      ? size
      : size === "large"
        ? 48
        : size === "small"
          ? 24
          : 32;

  const showImage = resolvedSrc && !hasError;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: numSize,
        height: numSize,
        borderRadius: shape === "circle" ? "50%" : 8,
      }}
    >
      <Avatar
        size={size}
        shape={shape}
        src={showImage ? resolvedSrc : undefined}
        icon={!showImage && !children ? icon : undefined}
        style={style}
        className={className}
        alt={alt}
      >
        {!showImage && children}
      </Avatar>
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.45)",
            borderRadius: shape === "circle" ? "50%" : 8,
            backdropFilter: "blur(2px)",
            zIndex: 2,
          }}
        >
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: Math.max(12, Math.floor(numSize / 2.6)),
                  color: "#ffffff",
                }}
                spin
              />
            }
          />
        </div>
      )}
    </div>
  );
};
