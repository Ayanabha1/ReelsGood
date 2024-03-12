import { PagesInterface } from "@/lib/commonInterfaces";
import React, { useState, CSSProperties } from "react";

import {
  useCSVReader,
  lightenDarkenColor,
  formatFileSize,
} from "react-papaparse";

const GREY = "#CCC";
const GREY_LIGHT = "rgba(255, 255, 255, 0.4)";
const DEFAULT_REMOVE_HOVER_COLOR = "#A01919";
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
  DEFAULT_REMOVE_HOVER_COLOR,
  40
);
const GREY_DIM = "#686868";

const styles = {
  zone: {
    cursor: "pointer",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: GREY,
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    padding: 20,
    width: "50%",
  } as CSSProperties,
  file: {
    background: "linear-gradient(to bottom, #EEE, #DDD)",
    borderRadius: 20,
    display: "flex",
    height: 120,
    width: 120,
    position: "relative",
    zIndex: 10,
    flexDirection: "column",
    justifyContent: "center",
  } as CSSProperties,
  info: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    paddingLeft: 10,
    paddingRight: 10,
  } as CSSProperties,
  size: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    marginBottom: "0.5em",
    justifyContent: "center",
    display: "flex",
  } as CSSProperties,
  name: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    fontSize: 12,
    marginBottom: "0.5em",
  } as CSSProperties,
  progressBar: {
    bottom: 14,
    position: "absolute",
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
  } as CSSProperties,
  zoneHover: {
    borderColor: GREY_DIM,
  } as CSSProperties,
  default: {
    borderColor: GREY,
  } as CSSProperties,
  remove: {
    height: 23,
    position: "absolute",
    right: 6,
    top: 6,
    width: 23,
  } as CSSProperties,
};

export default function CSVReader({
  onLoad,
  reqFields,
}: {
  onLoad: (data: any, rawData: any) => void;
  reqFields: string[];
}) {
  const { CSVReader } = useCSVReader();
  const [zoneHover, setZoneHover] = useState(false);
  const [removeHoverColor, setRemoveHoverColor] = useState(
    DEFAULT_REMOVE_HOVER_COLOR
  );

  const processData = (data: any) => {
    const fields = data?.data[0];
    const values = data?.data.slice(1);

    let res: any = [];
    values.forEach((row: any) => {
      const obj: any = {};
      fields.forEach((field: any, index: any) => {
        if (row[index]) {
          obj[field] = row[index];
        }
      });
      if (JSON.stringify(obj) !== "{}") {
        res.push(obj);
      }
    });

    let rawData: PagesInterface[][] = [];
    values?.forEach((item: any) => {
      let temp = [];
      if (item?.length > 0 && item[0]) {
        temp = item?.map((val: any) => ({ value: val }));
        rawData.push(temp);
      }
    });
    onLoad(res, rawData);
  };

  return (
    <CSVReader
      onUploadAccepted={(results: any) => {
        processData(results);
        setZoneHover(false);
      }}
      onDragOver={(event: DragEvent) => {
        event.preventDefault();
        setZoneHover(true);
      }}
      onDragLeave={(event: DragEvent) => {
        event.preventDefault();
        setZoneHover(false);
      }}
    >
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
        Remove,
      }: any) => (
        <>
          <div
            {...getRootProps()}
            style={Object.assign(
              {},
              styles.zone,
              zoneHover && styles.zoneHover
            )}
          >
            {acceptedFile ? (
              <>
                <div style={styles.file}>
                  <div style={styles.info}>
                    <span style={styles.size}>
                      {formatFileSize(acceptedFile.size)}
                    </span>
                    <span style={styles.name}>{acceptedFile.name}</span>
                  </div>
                  <div style={styles.progressBar}>
                    <ProgressBar />
                  </div>
                  <div
                    {...getRemoveFileProps()}
                    style={styles.remove}
                    onMouseOver={(event: Event) => {
                      event.preventDefault();
                      setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT);
                    }}
                    onMouseOut={(event: Event) => {
                      event.preventDefault();
                      setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR);
                    }}
                  >
                    <Remove color={removeHoverColor} />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <p>Drop CSV file here or click to upload</p>
                <p>
                  <div className="flex flex-wrap justify-center gap-[2px]">
                    <span>Required fields: </span>
                    {reqFields?.map((item: string, i: number) => (
                      <>
                        <span>{item}</span>
                        <span>{i !== reqFields?.length - 1 ? ", " : null}</span>
                      </>
                    ))}
                  </div>
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </CSVReader>
  );
}
