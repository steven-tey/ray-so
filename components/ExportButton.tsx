import React, { MouseEventHandler, useContext } from "react";

import DownloadIcon from "assets/icons/download-16.svg";
import ImageIcon from "assets/icons/image-16.svg";
import LinkIcon from "assets/icons/link-16.svg";
import ClipboardIcon from "assets/icons/clipboard-16.svg";

import { FrameContext } from "../store/FrameContextStore";
import download from "../util/download";
import { toPng, toSvg, toBlob } from "../lib/image";

import styles from "styles/ExportButton.module.css";
import useHotkeys from "../util/useHotkeys";

const ExportButton: React.FC = () => {
  const frameContext = useContext(FrameContext);

  const savePng = async () => {
    if (!frameContext?.current) {
      throw new Error("Couldn't find a frame to export");
    }

    const dataUrl = await toPng(frameContext.current);
    download(dataUrl, "ray-so-export.png");
  };

  const copyPng = async () => {
    if (!frameContext?.current) {
      throw new Error("Couldn't find a frame to export");
    }

    const blob = await toBlob(frameContext.current);

    if (!blob) throw new Error("toBlob did not return a blob");

    navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);
  };

  const saveSvg = async () => {
    if (!frameContext?.current) {
      throw new Error("Couldn't find a frame to export");
    }

    const dataUrl = await toSvg(frameContext.current);
    download(dataUrl, "ray-so-export.svg");
  };

  const handleExportClick: MouseEventHandler = (event) => {
    event.preventDefault();

    savePng();
  };

  const copyUrl = () =>
    navigator.clipboard.writeText(window.location.toString());

  useHotkeys("ctrl+s,cmd+s", (event) => {
    event.preventDefault();
    savePng();
  });
  useHotkeys("ctrl+c,cmd+c", (event) => {
    event.preventDefault();
    copyPng();
  });
  useHotkeys("ctrl+shift+c,cmd+shift+c", (event) => {
    event.preventDefault();
    copyUrl();
  });
  useHotkeys("ctrl+shift+s,cmd+shift+s", (event) => {
    event.preventDefault();
    saveSvg();
  });

  return (
    <div className={styles.hoverContainer}>
      <a href="#" onClick={handleExportClick} className={styles.exportButton}>
        Export <DownloadIcon />
      </a>
      <div className={styles.popoverContainer}>
        <div className={styles.popover}>
          <a href="#" onClick={handleExportClick} className={styles.option}>
            <ImageIcon />
            Save PNG
          </a>
          <a
            href="#"
            className={styles.option}
            onClick={(event) => {
              event.preventDefault();
              saveSvg();
            }}
          >
            <ImageIcon />
            Save SVG
          </a>
          <a
            href="#"
            className={styles.option}
            onClick={(event) => {
              event.preventDefault();
              copyPng();
            }}
          >
            <ClipboardIcon />
            Copy Image
          </a>
          <a
            href="#"
            className={styles.option}
            onClick={(event) => {
              event.preventDefault();
              copyUrl();
            }}
          >
            <LinkIcon />
            Copy URL
          </a>
        </div>
      </div>
    </div>
  );
};

export default ExportButton;
