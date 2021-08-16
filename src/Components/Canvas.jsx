import React, { useRef, useEffect } from 'react';
import { observer } from "mobx-react-lite";
import canvasState from "../Store/canvasState";

const WIDTH = 1000;
const HEIGHT = 550;

const windW = document.documentElement.clientWidth - 25;
const windH = window.innerHeight - 70;


const Canvas = observer(() => {
  const canvasRef = useRef()
  useEffect(() => {
    canvasState.setCanvas(canvasRef.current)
    let ctx = canvasState.canvas.getContext('2d')

    let workplase = { x: windW / 6, y: windH / 12, w: WIDTH, h: HEIGHT };
    let drawPlase = { x: workplase.x * 2 + 51, y: 110 + 51, w: 760 - 102, h: workplase.h - workplase.h / 10 - 102 }
    let mouse = { x: null, y: null, down: false };
    let toolRect = { x: workplase.x + workplase.x / 3, y: workplase.y + workplase.h / 5, w: 100, h: 100 };
    let toolCircle = { x: workplase.x + workplase.x / 3 + 50, y: workplase.y + workplase.h / 2, r: 50 };
    let activeDrawRect = false
    let activeDrawCircle = false;
    let isMove = false
    let newRect = { type: "rect", x: workplase.x + workplase.x / 3, y: workplase.y + workplase.h / 5, w: 100, h: 100, stroke: false }
    let newCircle = { type: "circle", x: workplase.x + workplase.x / 3 + 50, y: workplase.y + workplase.h / 2, r: 50, stroke: false };

    //================================

    let myStorage = window.localStorage;
    function addItem(item) {
      let lastValue = myStorage.getItem('canvas')
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
    function getItems() {
      return JSON.parse(myStorage.getItem('canvas'))
    }

    //================================

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
      mouse.x = e.pageX - e.target.offsetLeft;
      mouse.y = e.pageY - e.target.offsetTop

      activeDrawRect = cheakActiveRect(mouse.x, mouse.y, toolRect);
      activeDrawCircle = cheakActiveCircle(mouse.x, mouse.y, toolCircle);
    }

    canvasState.canvas.onmouseup = function (e) {
      mouse.down = false;
      isMove = false;
      if (activeDrawRect && (cheakActiveRect(mouse.x, mouse.y, drawPlase))) {
        addItem(newRect);
      };
      newRect = { x: workplase.x + workplase.x / 3, y: workplase.y + workplase.h / 5, w: 100, h: 100 };

      activeDrawRect = false;
      if (activeDrawCircle && (cheakActiveRect(mouse.x, mouse.y, drawPlase))) {
        addItem(newCircle);
      };
      activeDrawCircle = false;
      newCircle = { x: workplase.x + workplase.x / 3 + 50, y: workplase.y + workplase.h / 2, r: 50 };
    };

    document.addEventListener('keydown', (event) => {
      if (event.key === "Delete") {
        activeDrawRect = false;
        activeDrawCircle = false;
      }
    })

    //================================

    function drawWorkplase() {
      ctx.beginPath();
      ctx.rect(workplase.x, workplase.y, workplase.w, workplase.h);
      ctx.fillStyle = "#e8e4e3";
      ctx.fillRect(workplase.x, workplase.y, workplase.w, workplase.h / 10);
      ctx.moveTo(workplase.x, workplase.h / 10 * 2);
      ctx.lineTo(workplase.x + WIDTH, workplase.h / 10 * 2);
      ctx.moveTo(workplase.x * 2, workplase.y);
      ctx.lineTo(workplase.x * 2, workplase.y + workplase.h);
      ctx.font = "25px Arial";
      ctx.fillStyle = "black";
      ctx.fillText("Figures", workplase.x + workplase.x / 3, workplase.y + workplase.y / 2);
      ctx.fillText("Canvas", workplase.x + workplase.w / 2, workplase.y + workplase.y / 2);
      ctx.stroke()
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = "green";
      ctx.fillRect(toolRect.x, toolRect.y, toolRect.w, toolRect.h);
      ctx.fillStyle = "blue";
      ctx.arc(toolCircle.x, toolCircle.y, toolCircle.r, 0, 2 * Math.PI, false)
      ctx.fill()
      ctx.closePath();
    }

    function drawFigures() {
      let tmp = getItems()
      if (tmp === null) return
      let tmp1 = tmp.reverse().map(item => {
        if (item.type === "rect") {
          if (cheakActiveRect(mouse.x, mouse.y, item) && mouse.down && !isMove && !activeDrawRect && !activeDrawCircle) {
            item.stroke = true
            isMove = true;
            newRect = { type: "rect", x: item.x, y: item.y, w: item.w, h: item.h, stroke: item.stroke }
            activeDrawRect = true;
            return null
          }
        }
        if (item.type === "circle") {
          if (cheakActiveCircle(mouse.x, mouse.y, item) && mouse.down && !isMove && !activeDrawCircle && !activeDrawRect) {
            isMove = true;
            item.stroke = true;
            newCircle = { type: "circle", x: item.x, y: item.y, r: item.r, stroke: item.stroke }
            activeDrawCircle = true;
            return null
          }
        }
        return item
      })
      let res = tmp1.filter(item => item !== null).reverse()
      myStorage.clear()
      res.forEach(item => {
        if (item.type === "rect") {
          drawRect(item.x, item.y, item.w, item.h, item.stroke)
        }
        if (item.type === "circle") {
          drawCircle(item.x, item.y, item.r, item.stroke)
        }
        item.stroke = false
        addItem(item)
      })
    }

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

    setInterval(() => listen(), 50)
  }, [])

  return (
    <div className="canvas">
      <canvas
        width={windW}
        height={windH}
        ref={canvasRef}>
      </canvas>
    </div>
  );
});


export default Canvas