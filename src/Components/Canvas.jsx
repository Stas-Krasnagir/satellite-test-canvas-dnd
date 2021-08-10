import React, { useRef, useEffect } from 'react';
import { observer } from "mobx-react-lite";
import canvasState from "../Store/canvasState";

const WIDTH = 1000;
const HEIGHT = 600;

const Canvas = observer(() => {
  const canvasRef = useRef()
  useEffect(() => {
    canvasState.setCanvas(canvasRef.current)
    let ctx = canvasState.canvas.getContext('2d')

    let mouse = { x: null, y: null, down: false }
    let toolRect = { x: 50, y: 80, w: 100, h: 100 };
    let toolCircle = { x: 100, y: 250, r: 50 };

    function drawWorkplase() {
      let pading = 50;
      let figuresColumnWidth = WIDTH / 4;
      ctx.beginPath();
      ctx.moveTo(0, pading);
      ctx.lineTo(WIDTH, pading);
      ctx.moveTo(figuresColumnWidth, 0);
      ctx.lineTo(figuresColumnWidth, HEIGHT);
      ctx.font = "25px Arial";
      ctx.fillStyle = "black";
      ctx.fillText("Figures", 60, 35);
      ctx.fillText("Canvas", 450, 35);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = "green";
      ctx.fillRect(50, 80, 100, 100);
      ctx.fillStyle = "blue";
      ctx.arc(100, 250, 50, 0, 2 * Math.PI, false)
      ctx.fill()
      ctx.closePath();
    }

    //================================
    let myStorage = window.localStorage;
    async function addItem(item) {
      let lastValue = await myStorage.getItem('canvas')
      myStorage.clear()
      if (lastValue !== null) {
        let tmp = JSON.parse(lastValue)
        tmp.push(item)
        myStorage.setItem('canvas', JSON.stringify(tmp))
      }
      else {
        let res = []
        res.push(item)
        myStorage.setItem('canvas', JSON.stringify(res))
      }
    };
    async function getItems() {
      return await JSON.parse(myStorage.getItem('canvas'))
    }
    async function dellItem(item) {
      let data = await getItems()
      if (data) {
        data.filter(i => i !== item)
        myStorage.clear()
        myStorage.setItem('canvas', JSON.stringify(data))
      }
    }
    async function popItem() {
      let data = await getItems()
      if (data) {
        data.pop()
        myStorage.clear()
        myStorage.setItem('canvas', JSON.stringify(data))
      }
    }
    //================================

    let activeDrawRect = false
    let newRect = { type: "rect", x: null, y: null, w: null, h: null, stroke: false }

    let activeDrawCircle = false;
    let newCircle = { x: null, y: null, r: null };

    function cheakActiveRect(x, y, rect) {
      if (x >= rect.x && x <= (rect.x + rect.w)
        && y >= rect.y && y <= (rect.y + rect.h)) {
        return true;
      }
      else return false
    };

    function cheakActiveCircle(x, y, circle) {
      let distance = Math.sqrt(((x - circle.x) * (x - circle.x)) +
        ((y - circle.y) * (y - circle.y)))
      if (distance < 50)
        return true;
      else return false
    };

    canvasState.canvas.onmousemove = function (e) {
      mouse.x = e.pageX - e.target.offsetLeft;
      mouse.y = e.pageY - e.target.offsetTop

      if (activeDrawRect) {
        newRect = {
          type: "rect",
          x: mouse.x - 50,
          y: mouse.y - 50,
          w: 100,
          h: 100,
          stroke: true
        }
      }

      if (activeDrawCircle) {
        newCircle = {
          type: "circle",
          x: mouse.x,
          y: mouse.y,
          r: 50,
          stroke: true
        };
      }
    }

    canvasState.canvas.onmousedown = function (e) {
      mouse.down = true;
      activeDrawRect = cheakActiveRect(mouse.x, mouse.y, toolRect);
      activeDrawCircle = cheakActiveCircle(mouse.x, mouse.y, toolCircle);
    }

    canvasState.canvas.onmouseup = function (e) {
      mouse.down = false;
      if (activeDrawRect) {
        newRect.stroke = false;
        addItem(newRect);
      };
      activeDrawRect = false;
      if (activeDrawCircle) {
        newCircle.stroke = false;
        addItem(newCircle);
      };
      activeDrawCircle = false;
    };

    //================================

    async function drawFigures() {
      let tmp = await getItems()
      if (tmp === null) return
      tmp.forEach(item => {
        if (item.type === "rect") {
          if (cheakActiveRect(mouse.x, mouse.y, item)) {
            item.stroke = true;
          }
          drawRect(item.x, item.y, item.w, item.h, item.stroke)
        }
        if (item.type === "circle") {
          if (cheakActiveCircle(mouse.x, mouse.y, item)) {
            item.stroke = true;
          }
          drawCircle(item.x, item.y, item.r, item.stroke)
        }
      })
    }

    function drawRect(x, y, w, h, stroke) {
      ctx.beginPath()
      ctx.fillStyle = "green";
      ctx.rect(x, y, w, h)
      ctx.fill()
      if (stroke) ctx.stroke()
      ctx.closePath()
    }

    function drawCircle(x, y, r, stroke) {
      ctx.beginPath()
      ctx.fillStyle = "blue";
      ctx.arc(x, y, r, 0, 2 * Math.PI)
      ctx.fill()
      if (stroke) ctx.stroke()
      ctx.closePath()
    }

    function listen() {
      ctx.clearRect(0, 0, canvasState.canvas.width, canvasState.canvas.height)
      drawWorkplase()
      drawFigures()
      if (activeDrawRect) drawRect(newRect.x, newRect.y, newRect.w, newRect.h, newRect.stroke)
      if (activeDrawCircle) drawCircle(newCircle.x, newCircle.y, newCircle.r, newCircle.stroke)


    }

    setInterval(() => listen(), 30)
  }, [])

  return (
    <div className="canvas">
      <canvas
        width={WIDTH}
        height={HEIGHT}
        ref={canvasRef}>
      </canvas>
    </div>
  );
});


export default Canvas