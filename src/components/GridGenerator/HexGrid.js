import React, { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./HexGrid.css";

const HexGridOverlay = () => {
  const [src, setSrc] = useState(null);
  const [gridApplied, setGridApplied] = useState(false);
  const [hexSideLength, setHexSideLength] = useState(50); // default value
  const [lineColor, setLineColor] = useState("#ff0000"); // default value

  const handleHexSideLengthChange = (event) => {
    const value = event.target.value >= 5 ? event.target.value : 5;
    setHexSideLength(value);
  };

  const handleLineColorChange = (event) => {
    setLineColor(event.target.value);
  };

  const canvasRef = useRef(null);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      setSrc(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const drawHexagon = (ctx, x, y, size) => {
    ctx.beginPath();
    ctx.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));

    for (let side = 0; side < 7; side++) {
      ctx.lineTo(
        x + size * Math.cos((side * 2 * Math.PI) / 6),
        y + size * Math.sin((side * 2 * Math.PI) / 6)
      );
    }

    ctx.closePath();
    ctx.stroke();
  };

  const drawHexGrid = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      ctx.strokeStyle = lineColor;

      const radius = hexSideLength / Math.sqrt(3);
      const horizSpacing = 1.5 * radius;
      const vertSpacing = Math.sqrt(3) * radius;

      for (let y = 0; y < img.height; y += vertSpacing) {
        for (let x = 0, col = 0; x < img.width; x += horizSpacing, col++) {
          let yPos = y + (col % 2 === 0 ? 0 : vertSpacing / 2);
          drawHexagon(ctx, x, yPos, radius);
        }
      }

      // Create an image element and set its src to the data URL of the canvas
      const outputImg = document.getElementById("outputImg");
      outputImg.src = canvas.toDataURL();
    };
    setGridApplied(true);
    img.src = src;
  };

  //disables button
  const handleDrawHexGrid = () => {
    src && drawHexGrid();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="options">
          <label
            style={{
              margin: "5px",
            }}
          >
            Length of Hexagonal Side:
            <input
              type="number"
              value={hexSideLength}
              onChange={handleHexSideLengthChange}
            />
          </label>
          <label>
            Line Color:
            <input
              type="color"
              value={lineColor}
              onChange={handleLineColorChange}
            />
          </label>
        </div>
        <div
          {...getRootProps()}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            alignSelf: "center",
            border: "dotted grey 2px",
            width: "300px",
          }}
        >
          <input {...getInputProps()} />
          {src ? (
            <img src={src} alt="user input" style={{ width: "100px" }} />
          ) : isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some file here, or click to select file</p>
          )}
        </div>
        <button
          onClick={handleDrawHexGrid}
          style={{
            alignSelf: "center",
            width: "fit-content",
            margin: "5px",
          }}
        >
          Draw Hex Grid
        </button>
      </div>
      <div style={{ display: gridApplied ? "initial" : "none" }}>
        <p>Now Save Image</p>
        <canvas
          ref={canvasRef}
          style={{ display: "none" }}
          className="grid-image"
        />
        <img className="grid-image" id="outputImg" alt="Output" />
      </div>
    </div>
  );
};

export default HexGridOverlay;
